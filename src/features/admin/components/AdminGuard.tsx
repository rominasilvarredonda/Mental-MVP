"use client";

import type { ReactNode } from "react";
import { useAdminAccess } from "@/features/admin/hooks/useAdminAccess";
export function AdminGuard({ children }: { children: ReactNode }) { const { isAllowed, isLoading } = useAdminAccess(); if (isLoading || !isAllowed) return null; return <>{children}</>; }
