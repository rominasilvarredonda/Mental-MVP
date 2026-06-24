"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/features/auth/hooks/useAuth";

export function useProtectedRoute() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isLoading } = useAuth();
  useEffect(() => { if (!isLoading && !user) router.replace(`/login?next=${encodeURIComponent(pathname)}`); }, [isLoading, pathname, router, user]);
  return { user, isLoading, isAuthorized: Boolean(user) };
}
