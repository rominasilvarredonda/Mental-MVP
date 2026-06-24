import { isSupabaseConfigured, supabase } from "@/lib/supabase/client";
import type { DailyCheckinInput, MoodEntry } from "@/types/mood";

type StoredCheckinDetails = Pick<DailyCheckinInput, "influence" | "need" | "note"> & { kind: "mental-v2-checkin" };

function readDetails(note: string | null): Pick<MoodEntry, "influence" | "need" | "note"> {
  if (!note) return { influence: null, need: null, note: null };
  try {
    const details = JSON.parse(note) as Partial<StoredCheckinDetails>;
    if (details.kind === "mental-v2-checkin") {
      return { influence: details.influence ?? null, need: details.need ?? null, note: details.note ?? null };
    }
  } catch {
    // Los registros anteriores pueden ser notas de texto simple.
  }
  return { influence: null, need: null, note };
}

function toMoodEntry(record: { id: string; mood: MoodEntry["mood"]; note: string | null; date: string; created_at?: string; createdAt?: string }): MoodEntry {
  return { id: record.id, mood: record.mood, date: record.date, createdAt: record.created_at ?? record.createdAt ?? new Date().toISOString(), ...readDetails(record.note) };
}

function persistDetails(input: DailyCheckinInput): string {
  const details: StoredCheckinDetails = { kind: "mental-v2-checkin", influence: input.influence, need: input.need, note: input.note };
  return JSON.stringify(details);
}

export const moodService = {
  async list(userId: string): Promise<MoodEntry[]> {
    if (!isSupabaseConfigured) {
      try { return JSON.parse(localStorage.getItem(`mental-v2.moods.${userId}`) ?? "[]") as MoodEntry[]; } catch { return []; }
    }
    const { data, error } = await supabase!.from("mood_logs").select("*").eq("user_id", userId).order("created_at", { ascending: false });
    if (error) throw error;
    return data.map((item) => toMoodEntry(item));
  },
  async create(userId: string, input: DailyCheckinInput): Promise<MoodEntry> {
    const now = new Date();
    const date = now.toISOString().slice(0, 10);
    const existingEntry = (await this.list(userId)).find((entry) => entry.date === date);
    if (existingEntry) return existingEntry;
    const entry: MoodEntry = { id: crypto.randomUUID(), mood: input.mood, influence: input.influence, need: input.need, note: input.note || null, date, createdAt: now.toISOString() };
    if (!isSupabaseConfigured) {
      const entries = await this.list(userId);
      localStorage.setItem(`mental-v2.moods.${userId}`, JSON.stringify([entry, ...entries]));
      return entry;
    }
    const { data, error } = await supabase!.from("mood_logs").insert({ user_id: userId, mood: entry.mood, note: persistDetails(input), date: entry.date }).select().single();
    if (error) throw error;
    return toMoodEntry(data);
  },
};
