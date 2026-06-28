"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LandingScreen } from "@/features/onboarding/components/LandingScreen";

const interestedPlanKey = "mental-v2.prelaunch.interested-plan";

export function LandingEntry() {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const updateHeader = () => setIsScrolled(window.scrollY > 18);
    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });
    return () => window.removeEventListener("scroll", updateHeader);
  }, []);

  function startOnboarding(interestedPlan?: string) {
    if (interestedPlan) sessionStorage.setItem(interestedPlanKey, interestedPlan);
    else sessionStorage.removeItem(interestedPlanKey);
    router.push("/onboarding");
  }

  return <LandingScreen isScrolled={isScrolled} onStart={startOnboarding} onScrollTo={(id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" })} />;
}
