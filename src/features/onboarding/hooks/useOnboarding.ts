"use client";

import { useMemo, useState } from "react";
import { assessmentService } from "@/services/assessmentService";
import type { AssessmentAnswer } from "@/types/assessment";
import { questions } from "@/features/onboarding/questions";

export function useOnboarding() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<AssessmentAnswer[]>([]);
  const [otherAnswers, setOtherAnswers] = useState<Record<number, string>>({});
  const [error, setError] = useState("");
  const question = questions[step];
  const selected = useMemo(() => { const answer = answers[step]; return Array.isArray(answer) ? answer : answer ? [answer] : []; }, [answers, step]);

  function saveAnswer(answer: AssessmentAnswer) { setAnswers((current) => { const copy = [...current]; copy[step] = answer; return copy; }); setError(""); }
  function selectAnswer(value: string) {
    if (question.multi) { const current = Array.isArray(answers[step]) ? answers[step] : []; saveAnswer(current.includes(value) ? current.filter((item) => item !== value) : [...current, value]); }
    else saveAnswer(value);
  }
  function changeOther(value: string) { setOtherAnswers((current) => ({ ...current, [step]: value })); setError(""); }
  function previous(onClose: () => void) { if (!step) { onClose(); return; } setStep((current) => current - 1); setError(""); }
  function next(onComplete: () => void) {
    const answer = answers[step];
    const missingName = typeof answer === "object" && !Array.isArray(answer) && (!answer?.name || !answer?.last);
    if (!answer || (Array.isArray(answer) && !answer.length) || missingName) { setError(question.type === "name" ? "Ingresá tu nombre y apellido para continuar." : "Elegí una opción para continuar."); return; }
    if (question.other && selected.includes(question.other) && !otherAnswers[step]?.trim()) { setError("Completá este campo para continuar."); return; }
    if (step === questions.length - 1) { assessmentService.saveDraft(answers); onComplete(); return; }
    setStep((current) => current + 1); setError("");
  }
  return { step, question, answers, selected, otherAnswers, error, setError, saveAnswer, selectAnswer, changeOther, previous, next };
}
