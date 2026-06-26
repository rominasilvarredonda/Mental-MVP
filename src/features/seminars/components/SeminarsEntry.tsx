"use client";
import { DashboardLayout } from "@/features/dashboard/components/DashboardLayout";
import { SeminarsScreen } from "@/features/seminars/components/SeminarsScreen";
import { useSeminars } from "@/features/seminars/hooks/useSeminars";
export function SeminarsEntry() { const seminars = useSeminars(); return <DashboardLayout activePage="seminars"><SeminarsScreen seminars={seminars.seminars} reservedId={seminars.reservedId} pending={seminars.isPending} onReserve={seminars.reserve} onCancel={seminars.cancelReservation} /></DashboardLayout>; }
