"use client";

import { useRouter } from "next/navigation";
import { OnboardingWizard } from "@/features/onboarding/components/OnboardingWizard";
import { useOnboardingWizard } from "@/features/onboarding/hooks/useOnboardingWizard";

export function OnboardingEntry() {
  const router = useRouter();
  const onboarding = useOnboardingWizard();

  return <OnboardingWizard
    step={onboarding.step}
    total={onboarding.total}
    question={onboarding.question}
    answers={onboarding.answers}
    error={onboarding.error}
    isComplete={onboarding.isComplete}
    onClose={() => router.push("/")}
    onSaveAnswer={onboarding.saveAnswer}
    onSelectAnswer={onboarding.selectAnswer}
    onPrevious={() => onboarding.previous()}
    onNext={onboarding.next}
    onFinish={() => router.push("/lista-espera")}
  />;
}
