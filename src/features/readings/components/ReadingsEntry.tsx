"use client";

import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/features/dashboard/components/DashboardLayout";
import { ReadingsScreen } from "@/features/readings/components/ReadingsScreen";
import { useReadings } from "@/features/readings/hooks/useReadings";

export function ReadingsEntry() {
  const router = useRouter();
  const readings = useReadings();
  return <DashboardLayout activePage="readings"><ReadingsScreen reading={readings.reading} isDailyComplete={readings.isDailyComplete} pending={readings.isPending} onComplete={readings.complete} onPast={() => router.push("/app/lecturas/pasadas")} /></DashboardLayout>;
}
