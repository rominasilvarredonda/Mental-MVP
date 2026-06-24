"use client";

import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useProtectedRoute } from "@/hooks/useProtectedRoute";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useLogout } from "@/features/auth/hooks/useLogout";
import { DashboardShell, type DashboardPage } from "@/features/dashboard/components/DashboardShell";
import { useDashboardNavigation } from "@/features/dashboard/hooks/useDashboardNavigation";

export function DashboardLayout({ activePage, children }: { activePage: DashboardPage; children: ReactNode }) {
  const router = useRouter();
  const { isLoading, isAuthorized } = useProtectedRoute();
  const { profile, user } = useAuth();
  const { logout } = useLogout();
  const navigate = useDashboardNavigation();
  if (isLoading || !isAuthorized) return null;
  async function leave() { await logout(); router.push("/"); }
  const userName = [profile?.firstName, profile?.lastName].filter(Boolean).join(" ");
  return <DashboardShell activePage={activePage} onNavigate={navigate} onLogout={leave} userName={userName} userEmail={profile?.email ?? user?.email ?? ""} avatarUrl={profile?.avatarUrl}>{children}</DashboardShell>;
}
