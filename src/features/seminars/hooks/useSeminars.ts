"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { seminarService } from "@/services/seminarService";
import { useAsyncAction } from "@/hooks/useAsyncAction";

export function useSeminars() {
  const { user } = useAuth();
  const { isPending, error, run } = useAsyncAction();
  const [reservedId, setReservedId] = useState<string | null>(null);
  const seminars = seminarService.list();

  useEffect(() => {
    if (user) {
      void seminarService
        .listReservations(user.id)
        .then((items) => setReservedId(items[0]?.seminarId ?? null));
    }
  }, [user]);

  async function reserve(seminarId: string) {
    if (!user) return;
    const result = await run(() => seminarService.reserve(user.id, seminarId));
    if (result) setReservedId(seminarId);
  }

  return { seminars, reservedId, isPending, error, reserve };
}
