"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ScreenLayout } from "@/components/layout/ScreenLayout";
import type { WizardAnswers, WizardQuestion } from "@/features/onboarding/wizardQuestions";
import styles from "./OnboardingWizard.module.css";

type OnboardingWizardProps = {
  step: number;
  total: number;
  question: WizardQuestion | undefined;
  answers: WizardAnswers;
  error: string;
  isComplete: boolean;
  onClose: () => void;
  onSaveAnswer: (id: string, answer: string | string[]) => void;
  onSelectAnswer: (value: string) => void;
  onPrevious: () => void;
  onNext: () => void;
  onFinish: () => void;
};

const valuesOf = (answer: string | string[] | undefined) => Array.isArray(answer) ? answer : answer ? [answer] : [];

function Options({ question, answers, onSaveAnswer, onSelectAnswer }: Pick<OnboardingWizardProps, "answers" | "onSaveAnswer" | "onSelectAnswer"> & { question: WizardQuestion }) {
  const selected = valuesOf(answers[question.id]);
  const needsText = selected.some((option) => question.textWhen?.includes(option));
  const textPlaceholder = selected.map((option) => question.textPlaceholders?.[option]).find(Boolean) ?? "Contanos un poco más";
  const nestedVisible = Boolean(question.nested && answers[question.id] === question.nested.showWhen);
  const nestedSelected = question.nested ? valuesOf(answers[question.nested.id]) : [];
  const nestedNeedsText = Boolean(question.nested && nestedSelected.some((option) => question.nested?.textWhen?.includes(option)));

  return <div className={styles.optionsWrap}>
    <div className={`${styles.options}${question.layout === "stacked" ? ` ${styles.stackedOptions}` : ""}`}>{question.options?.map((option) => <button key={option} type="button" className={`${styles.option}${selected.includes(option) ? ` ${styles.selected}` : ""}`} aria-pressed={selected.includes(option)} onClick={() => onSelectAnswer(option)}><span className={`${styles.control}${question.multiple ? ` ${styles.checkbox}` : ""}`} aria-hidden="true">{selected.includes(option) && "✓"}</span><span>{option}</span></button>)}</div>
    {needsText && <Input className={styles.textInput} value={String(answers[`${question.id}-text`] ?? "")} onChange={(event) => onSaveAnswer(`${question.id}-text`, event.target.value)} placeholder={textPlaceholder} />}
    {nestedVisible && question.nested && <div className={styles.nested}><div className={styles.options}>{question.nested.options.map((option) => <button key={option} type="button" className={`${styles.option}${nestedSelected.includes(option) ? ` ${styles.selected}` : ""}`} aria-pressed={nestedSelected.includes(option)} onClick={() => onSaveAnswer(question.nested!.id, option)}><span className={styles.control} aria-hidden="true">{nestedSelected.includes(option) && "✓"}</span><span>{option}</span></button>)}</div>{nestedNeedsText && <Input className={styles.textInput} value={String(answers[`${question.nested.id}-text`] ?? "")} onChange={(event) => onSaveAnswer(`${question.nested!.id}-text`, event.target.value)} placeholder="Contanos un poco más" />}</div>}
  </div>;
}

export function OnboardingWizard({ step, total, question, answers, error, isComplete, onClose, onSaveAnswer, onSelectAnswer, onPrevious, onNext, onFinish }: OnboardingWizardProps) {
  if (isComplete) return <ScreenLayout progress={100} onClose={onClose}><section className={styles.complete}><div className={styles.completeMark}>✓</div><p className={styles.stepLabel}>TU EXPERIENCIA MENTAL</p><h1>Gracias por contarnos un poco sobre vos. Con esta información vamos a poder personalizar mejor tu experiencia cuando lancemos Mental.</h1><Button type="button" onClick={onFinish}>Continuar a la lista de espera</Button></section></ScreenLayout>;
  if (!question) return null;

  const selected = valuesOf(answers[question.id]);
  return <ScreenLayout progress={((step + 1) / total) * 100} onClose={onClose}><section className={styles.wizard}>
    <header className={styles.header}><div className={styles.progressTrack}><span style={{ width: `${((step + 1) / total) * 100}%` }} /></div><p className={styles.stepLabel}>TU PERFIL · PASO {step + 1}</p></header>
    <div className={styles.card}><p className={styles.cardLabel}>{question.multiple ? "SELECCIÓN MÚLTIPLE" : "ELEGÍ UNA OPCIÓN"}</p><h1>{question.title}</h1>{question.helper && <p className={styles.helper}>{question.helper}</p>}{question.input ? <><Input className={styles.ageInput} type="number" inputMode="numeric" min="1" value={String(answers[question.id] ?? "")} onChange={(event) => onSaveAnswer(question.id, event.target.value)} placeholder="Ingresá tu edad" />{error && <p className={styles.fieldError} role="alert">{error}</p>}</> : <Options question={question} answers={answers} onSaveAnswer={onSaveAnswer} onSelectAnswer={onSelectAnswer} />}</div>
    <p className={styles.error} role="alert">{question.input ? "" : error}</p><footer className={styles.actions}><button type="button" className={styles.back} onClick={step ? onPrevious : onClose}>← Volver</button><Button type="button" onClick={onNext}>{step === total - 1 ? "Finalizar" : "Continuar"} →</Button></footer>
  </section></ScreenLayout>;
}
