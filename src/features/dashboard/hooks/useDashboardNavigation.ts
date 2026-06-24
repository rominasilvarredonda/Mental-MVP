"use client";

import { useRouter } from "next/navigation";
import type { DashboardPage } from "@/features/dashboard/components/DashboardShell";

const paths: Record<DashboardPage, string> = { home: "/app", readings: "/app/lecturas", seminars: "/app/seminarios", ai: "/app/mental-ia", progress: "/app/progreso", profile: "/app/perfil" };
export function useDashboardNavigation() { const router = useRouter(); return (page: DashboardPage) => router.push(paths[page]); }
