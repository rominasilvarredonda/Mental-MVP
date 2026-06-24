"use client";

import { useAuth } from "@/features/auth/hooks/useAuth";
import { useAsyncAction } from "@/hooks/useAsyncAction";

export function useLogout() {
  const { logout } = useAuth();
  const { isPending, run } = useAsyncAction();
  return { isPending, logout: () => run(logout) };
}
