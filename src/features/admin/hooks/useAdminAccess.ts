"use client";

import { useRoleGuard } from "@/hooks/useRoleGuard";
export function useAdminAccess() { return useRoleGuard(["admin"]); }
