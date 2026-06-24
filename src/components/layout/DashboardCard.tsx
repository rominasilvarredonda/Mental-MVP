import type { ReactNode } from "react";
import { Card } from "@/components/ui/Card";

export function DashboardCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <Card className={className}>{children}</Card>;
}
