"use client";

import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/features/dashboard/components/DashboardLayout";
import { ProfileScreen } from "@/features/dashboard/components/ProfileScreen";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useLogout } from "@/features/auth/hooks/useLogout";

export function ProfileEntry() {
  const router = useRouter();
  const { profile } = useAuth();
  const { logout } = useLogout();
  async function leave() { await logout(); router.push("/"); }
  return <DashboardLayout activePage="profile"><ProfileScreen profile={profile} onLogout={leave} onPlan={() => router.push("/plan")} /></DashboardLayout>;
}
