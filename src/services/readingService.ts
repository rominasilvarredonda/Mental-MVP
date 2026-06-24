import { isSupabaseConfigured, supabase } from "@/lib/supabase/client";
import type { Reading } from "@/types/reading";

export const readingService = {
  getDailyReading(): Reading {
    return { id: "stress-urgent", title: "Cómo gestionar el estrés cuando todo parece urgente", category: "Estrés", estimatedTime: "5 min", content: "Cuando todo parece urgente, el cuerpo suele reaccionar antes de que podamos ordenar lo que pasa. Una primera pausa puede ayudarte a elegir el siguiente paso con más claridad." };
  },
  async completedCount(userId: string): Promise<number> {
    if (!isSupabaseConfigured) return Number(localStorage.getItem(`mental-v2.readings.${userId}`) ?? "0");
    const { count, error } = await supabase!.from("reading_completions").select("id", { count: "exact", head: true }).eq("user_id", userId);
    if (error) throw error;
    return count ?? 0;
  },
  async isCompletedToday(userId: string, readingId: string): Promise<boolean> {
    const today = new Date().toISOString().slice(0, 10);
    if (!isSupabaseConfigured) return localStorage.getItem(`mental-v2.reading-day.${userId}.${readingId}`) === today;
    const { data, error } = await supabase!.from("reading_completions").select("id").eq("user_id", userId).eq("reading_id", readingId).eq("completed_date", today).maybeSingle();
    if (error) throw error;
    return Boolean(data);
  },
  async markCompleted(userId: string, readingId: string): Promise<boolean> {
    if (!isSupabaseConfigured) {
      const today = new Date().toISOString().slice(0, 10);
      const key = `mental-v2.reading-day.${userId}.${readingId}`;
      if (localStorage.getItem(key) !== today) {
        const current = await this.completedCount(userId);
        localStorage.setItem(`mental-v2.readings.${userId}`, String(current + 1));
        localStorage.setItem(key, today);
      }
      return true;
    }
    const { error } = await supabase!.from("reading_completions").upsert({ user_id: userId, reading_id: readingId, completed_date: new Date().toISOString().slice(0, 10) }, { onConflict: "user_id,reading_id,completed_date" });
    if (error) throw error;
    return true;
  },
};
