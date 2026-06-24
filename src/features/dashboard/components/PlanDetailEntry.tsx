import { DashboardLayout } from "@/features/dashboard/components/DashboardLayout";
import { PlanDetailScreen } from "@/features/dashboard/components/PlanDetailScreen";

export function PlanDetailEntry() {
  return <DashboardLayout activePage="profile"><PlanDetailScreen /></DashboardLayout>;
}
