"use client";

import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ScreenLayout } from "@/components/layout/ScreenLayout";
import type { AssessmentAnswer } from "@/types/assessment";
import type { Question } from "@/features/onboarding/questions";

type OnboardingSurveyProps = {
  step: number;
  total: number;
  question: Question;
  answer: AssessmentAnswer;
  selected: string[];
  otherAnswer: string;
  error: string;
  onClose: () => void;
  onAnswer: (answer: AssessmentAnswer) => void;
  onSelect: (value: string) => void;
  onOtherAnswer: (value: string) => void;
  onPrevious: () => void;
  onNext: () => void;
};

export function OnboardingSurvey({ step, total, question, answer, selected, otherAnswer, error, onClose, onAnswer, onSelect, onOtherAnswer, onPrevious, onNext }: OnboardingSurveyProps) {
  const name = typeof answer === "object" && !Array.isArray(answer) ? answer : undefined;
  return <ScreenLayout progress={((step + 1) / total) * 100} onClose={onClose}><section className="flow-step conversational">
    {step < 2 && <div className="survey-intro"><h2>Ayudanos a encontrar el profesional ideal para vos</h2><p>Trabajamos con psicólogos de distintas especialidades y enfoques terapéuticos. Respondé algunas preguntas para que podamos recomendarte la experiencia más adecuada dentro de Mental.</p></div>}
    <div className="overline">CONOCIÉNDOTE MEJOR · {step + 1} DE {total}</div><h1>{question.title}</h1><p>{question.desc}</p>
    {question.type === "name" ? <div className="name-answer"><label>Nombre<Input value={name?.name ?? ""} onChange={(event) => onAnswer({ name: event.target.value, last: name?.last ?? "" })} placeholder="Tu nombre" /></label><label>Apellido<Input value={name?.last ?? ""} onChange={(event) => onAnswer({ name: name?.name ?? "", last: event.target.value })} placeholder="Tu apellido" /></label></div> : question.type === "input" ? <div className="open-answer"><Input type={question.inputType ?? "text"} list={question.list ? "country-list" : undefined} value={typeof answer === "string" ? answer : ""} onChange={(event) => onAnswer(event.target.value)} placeholder={question.placeholder} />{question.list && <datalist id="country-list">{question.list.map((country) => <option key={country} value={country} />)}</datalist>}</div> : <><div className={step === 10 ? "scale" : "answer-grid"}>{question.options?.map((option) => <button type="button" key={option} className={`answer${selected.includes(option) ? " selected" : ""}${step === 10 ? " scale-answer" : ""}`} onClick={() => onSelect(option)}>{option}</button>)}</div>{question.other && selected.includes(question.other) && <div className="open-answer other-answer"><Input value={otherAnswer} onChange={(event) => onOtherAnswer(event.target.value)} placeholder={question.placeholder} /></div>}</>}
    <p className="flow-error" role="alert">{error}</p><div className="flow-actions"><button type="button" onClick={onPrevious}>{step ? "← Anterior" : ""}</button><Button type="button" onClick={onNext}>Continuar →</Button></div>
  </section></ScreenLayout>;
}
