"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { seminarService } from "@/services/seminarService";
import { useAsyncAction } from "@/hooks/useAsyncAction";

export function useSeminars() {
  const { user } = useAuth();
  const { isPending, error, run } = useAsyncAction();
  const [reservedId, setReservedId] = useState<string | null>(null);
  const seminars = seminarService.list();
  const userId = user?.id ?? null;

  const refreshReservations = useCallback(async () => {
    if (!userId) {
      setReservedId(null);
      return;
    }
    const items = await seminarService.listReservations(userId);
    setReservedId(items[0]?.seminarId ?? null);
  }, [userId]);

  useEffect(() => {
    void refreshReservations();
  }, [refreshReservations]);

  async function reserve(seminarId: string) {
    if (!userId) return;
    const result = await run(() => seminarService.reserve(userId, seminarId));
    if (result) setReservedId(seminarId);
  }

  async function cancelReservation(seminarId?: string) {
    if (!userId) {
      setReservedId(null);
      return;
    }
    const targetId = seminarId ?? reservedId;
    if (!targetId) return;
    const result = await run(() => seminarService.cancel(userId, targetId));
    if (result) setReservedId((current) => current === targetId ? null : current);
  }

  return { seminars, reservedId, isPending, error, reserve, cancelReservation };
}
