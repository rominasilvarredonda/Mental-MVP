"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LandingScreen } from "@/features/onboarding/components/LandingScreen";

export function LandingEntry() {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const updateHeader = () => setIsScrolled(window.scrollY > 18);
    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });
    return () => window.removeEventListener("scroll", updateHeader);
  }, []);

  return <LandingScreen isScrolled={isScrolled} onStart={() => router.push("/onboarding")} onScrollTo={(id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" })} />;
}
