"use client";

import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/features/dashboard/components/DashboardLayout";
import { PastReadingsScreen } from "@/features/readings/components/PastReadingsScreen";

export function PastReadingsEntry() {
  const router = useRouter();
  return <DashboardLayout activePage="readings"><PastReadingsScreen onBack={() => router.push("/app/lecturas")} /></DashboardLayout>;
}
