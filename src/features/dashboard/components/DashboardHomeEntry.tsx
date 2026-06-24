"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/features/dashboard/components/DashboardLayout";
import { DashboardHome } from "@/features/dashboard/components/DashboardHome";
import { useMood } from "@/features/mood/hooks/useMood";
import { useReadings } from "@/features/readings/hooks/useReadings";
import { useSeminars } from "@/features/seminars/hooks/useSeminars";
import { useAuth } from "@/features/auth/hooks/useAuth";

const today = () => new Date().toISOString().slice(0, 10);

export function DashboardHomeEntry() {
  const router = useRouter();
  const mood = useMood();
  const readings = useReadings();
  const seminars = useSeminars();
  const { user } = useAuth();
  const [exerciseOpen, setExerciseOpen] = useState(false);
  const [exerciseDone, setExerciseDone] = useState(false);
  const exerciseKey = user ? `mental-v2.exercise.breathing.${user.id}` : null;

  useEffect(() => {
    setExerciseOpen(false);
    setExerciseDone(exerciseKey ? localStorage.getItem(exerciseKey) === today() : false);
  }, [exerciseKey]);

  function completeExercise() {
    if (!exerciseKey) return;
    localStorage.setItem(exerciseKey, today());
    setExerciseDone(true);
  }

  return <DashboardLayout activePage="home"><DashboardHome readingCount={readings.completed} readingComplete={readings.isDailyComplete} checkinCount={mood.total} selectedMood={mood.selectedMood} selectedInfluence={mood.selectedInfluence} selectedNeed={mood.selectedNeed} note={mood.note} todayEntry={mood.todayEntry} moodSaved={mood.isSaved} moodPending={mood.isPending} moodCanSave={mood.canSave} seminarReserved={seminars.reservedId === "anxiety"} exerciseOpen={exerciseOpen} exerciseDone={exerciseDone} onMoodSelect={mood.setSelectedMood} onInfluenceSelect={mood.setSelectedInfluence} onNeedSelect={mood.setSelectedNeed} onNoteChange={mood.setNote} onMoodSave={mood.save} onExerciseOpen={() => setExerciseOpen(true)} onExerciseComplete={completeExercise} onNavigate={(path) => router.push(path)} /></DashboardLayout>;
}
