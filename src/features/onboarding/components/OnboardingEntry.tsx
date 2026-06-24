"use client";

import { useRouter } from "next/navigation";
import { OnboardingSurvey } from "@/features/onboarding/components/OnboardingSurvey";
import { useOnboarding } from "@/features/onboarding/hooks/useOnboarding";
import { questions } from "@/features/onboarding/questions";

export function OnboardingEntry() {
  const router = useRouter();
  const onboarding = useOnboarding();
  return <OnboardingSurvey step={onboarding.step} total={questions.length} question={onboarding.question} answer={onboarding.answers[onboarding.step]} selected={onboarding.selected.filter((answer): answer is string => typeof answer === "string")} otherAnswer={onboarding.otherAnswers[onboarding.step] ?? ""} error={onboarding.error} onClose={() => router.push("/")} onAnswer={onboarding.saveAnswer} onSelect={onboarding.selectAnswer} onOtherAnswer={onboarding.changeOther} onPrevious={() => onboarding.previous(() => router.push("/"))} onNext={() => onboarding.next(() => router.push("/onboarding/preparando"))} />;
}
