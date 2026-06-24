"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { moodService } from "@/services/moodService";
import { useAsyncAction } from "@/hooks/useAsyncAction";
import type { Mood, MoodEntry, MoodInfluence, MoodNeed } from "@/types/mood";

export function useMood() {
  const { user } = useAuth();
  const { isPending, error, run } = useAsyncAction();
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const [selectedInfluence, setSelectedInfluence] = useState<MoodInfluence | null>(null);
  const [selectedNeed, setSelectedNeed] = useState<MoodNeed | null>(null);
  const [note, setNote] = useState("");
  const [isSaved, setIsSaved] = useState(false);
  const [todayEntry, setTodayEntry] = useState<MoodEntry | null>(null);
  const [total, setTotal] = useState(0);
  useEffect(() => {
    let active = true;
    setSelectedMood(null);
    setSelectedInfluence(null);
    setSelectedNeed(null);
    setNote("");
    setTodayEntry(null);
    setIsSaved(false);
    setTotal(0);
    if (!user) return () => { active = false; };
    void moodService.list(user.id).then((entries) => {
      if (!active) return;
      setTotal(entries.length);
      const entry = entries.find((item) => item.date === new Date().toISOString().slice(0, 10)) ?? null;
      setTodayEntry(entry);
      setIsSaved(Boolean(entry));
      if (entry) {
        setSelectedMood(entry.mood);
        setSelectedInfluence(entry.influence);
        setSelectedNeed(entry.need);
        setNote(entry.note ?? "");
      }
    });
    return () => { active = false; };
  }, [user?.id]);
  async function save() {
    if (!user || isSaved || !selectedMood || !selectedInfluence || !selectedNeed) return;
    const entry = await run(() => moodService.create(user.id, { mood: selectedMood, influence: selectedInfluence, need: selectedNeed, note }));
    if (entry) {
      setTodayEntry(entry);
      setIsSaved(true);
      setTotal((current) => current + 1);
    }
  }
  return { selectedMood, setSelectedMood, selectedInfluence, setSelectedInfluence, selectedNeed, setSelectedNeed, note, setNote, todayEntry, isSaved, isPending, error, total, canSave: Boolean(selectedMood && selectedInfluence && selectedNeed), save };
}
