"use client";

import { useRouter } from "next/navigation";
import { PreparingSpace } from "@/features/onboarding/components/PreparingSpace";
import { usePreparingSpace } from "@/features/onboarding/hooks/usePreparingSpace";

export function PreparingEntry() {
  const router = useRouter();
  usePreparingSpace(() => router.replace("/lista-espera"));
  return <PreparingSpace onClose={() => router.push("/")} />;
}
