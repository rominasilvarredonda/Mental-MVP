"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/features/auth/hooks/useAuth";
import type { Role } from "@/types/auth";

export function useRoleGuard(allowedRoles: Role[]) {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const isAllowed = Boolean(user && allowedRoles.includes(user.role));
  useEffect(() => { if (!isLoading && user && !isAllowed) router.replace("/app"); }, [isAllowed, isLoading, router, user]);
  return { isLoading, isAllowed };
}
