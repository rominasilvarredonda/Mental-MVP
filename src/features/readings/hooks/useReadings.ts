"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { readingService } from "@/services/readingService";
import { useAsyncAction } from "@/hooks/useAsyncAction";

export function useReadings() {
  const { user } = useAuth();
  const { isPending, error, run } = useAsyncAction();
  const [completed, setCompleted] = useState(2);
  const [isDailyComplete, setIsDailyComplete] = useState(false);
  const reading = readingService.getDailyReading();
  useEffect(() => {
    if (!user) return;
    void Promise.all([readingService.completedCount(user.id), readingService.isCompletedToday(user.id, reading.id)]).then(([count, todayComplete]) => {
      setCompleted(count);
      setIsDailyComplete(todayComplete);
    });
  }, [reading.id, user]);
  async function complete() {
    if (!user || isDailyComplete) return;
    const result = await run(() => readingService.markCompleted(user.id, reading.id));
    if (result) { setCompleted((value) => value + 1); setIsDailyComplete(true); }
  }
  return { reading, completed, isDailyComplete, isPending, error, complete };
}
