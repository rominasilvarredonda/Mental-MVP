"use client";

import { useMemo, useState } from "react";
import { isAtLeastNumericAge, isValidAgeNumber } from "@/lib/validation";
import { assessmentService } from "@/services/assessmentService";
import { wizardQuestions, type WizardAnswer, type WizardAnswers, type WizardQuestion } from "@/features/onboarding/wizardQuestions";

const wellbeingOnly = "Herramientas de bienestar (lecturas, psicoeducación, seminarios, AI, etc)";
const valuesOf = (answer: WizardAnswer | undefined) => Array.isArray(answer) ? answer : answer ? [answer] : [];

function getValidationError(question: WizardQuestion, answers: WizardAnswers) {
  const answer = answers[question.id];
  if (!answer || (Array.isArray(answer) && !answer.length) || (typeof answer === "string" && !answer.trim())) return "Respondé esta pregunta para continuar.";
  if (question.id === "age") {
    if (!isValidAgeNumber(String(answer))) return "Ingresá una edad válida.";
    if (!isAtLeastNumericAge(String(answer), 12)) return "Por el momento Mental está disponible para personas mayores de 12 años.";
  }
  if (question.nested && answer === question.nested.showWhen) {
    const nestedAnswer = answers[question.nested.id];
    if (!nestedAnswer || (typeof nestedAnswer === "string" && !nestedAnswer.trim())) return "Respondé esta pregunta para continuar.";
    if (valuesOf(nestedAnswer).some((value) => question.nested?.textWhen?.includes(value)) && !String(answers[`${question.nested.id}-text`] ?? "").trim()) return "Respondé esta pregunta para continuar.";
  }
  if (valuesOf(answer).some((value) => question.textWhen?.includes(value)) && !String(answers[`${question.id}-text`] ?? "").trim()) return "Respondé esta pregunta para continuar.";
  return "";
}

export function useOnboardingWizard() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<WizardAnswers>({});
  const [error, setError] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const visibleQuestions = useMemo(() => wizardQuestions.filter((question) => !question.visibleWhen || question.visibleWhen(answers)), [answers]);
  const question = visibleQuestions[step];

  function saveAnswer(id: string, answer: WizardAnswer) {
    setAnswers((current) => ({ ...current, [id]: answer }));
    setError("");
  }

  function selectAnswer(value: string) {
    if (!question) return;
    if (question.id === "accompaniment" && value === wellbeingOnly) {
      setAnswers((current) => ({ ...current, accompaniment: value, "therapist-expectations": undefined, "therapist-expectations-text": undefined, schedule: undefined }));
      setError("");
      return;
    }
    const current = valuesOf(answers[question.id]);
    saveAnswer(question.id, question.multiple ? (current.includes(value) ? current.filter((item) => item !== value) : [...current, value]) : value);
  }

  function next() {
    const validationError = question ? getValidationError(question, answers) : "Respondé esta pregunta para continuar.";
    if (validationError) {
      setError(validationError);
      return;
    }
    if (step === visibleQuestions.length - 1) {
      assessmentService.saveDraft(Object.values(answers).filter((answer): answer is WizardAnswer => answer !== undefined));
      setIsComplete(true);
      return;
    }
    setStep((current) => current + 1);
    setError("");
  }

  function previous() {
    if (!step) return false;
    setStep((current) => current - 1);
    setError("");
    return true;
  }

  return { step, total: visibleQuestions.length, question, answers, error, isComplete, saveAnswer, selectAnswer, previous, next };
}
