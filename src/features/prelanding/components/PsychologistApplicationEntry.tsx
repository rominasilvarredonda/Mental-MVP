"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ScreenLayout } from "@/components/layout/ScreenLayout";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { isAtLeastAge, isValidBirthDate, isValidEmail, isValidPhone, sanitizePhone } from "@/lib/validation";
import { psychologistApplicationService } from "@/services/psychologistApplicationService";
import type { PsychologistApplicationAnswers } from "@/types/prelaunch";

type StepId = keyof PsychologistApplicationAnswers;
type Step = { id: StepId; title: string; options?: string[]; multiple?: boolean; freeText?: boolean };

const maxMotivation = 2000;
const steps: Step[] = [
  { id: "education", title: "¿Cuál es tu formación profesional?", options: ["Licenciatura en Psicología", "Psicología clínica", "Psicoterapia", "Psiquiatría", "Coaching certificado", "Estudiante avanzado/a de Psicología", "Otro"] },
  { id: "specialties", title: "¿En qué área/s te especializás?", multiple: true, options: ["Ansiedad", "Estrés", "Autoestima", "Vínculos", "Terapia de pareja", "Adolescencia", "Adultos", "Trauma", "Duelo", "Regulación emocional", "Orientación vocacional", "Rendimiento deportivo", "Otro"] },
  { id: "onlineCare", title: "¿Actualmente brindás atención online?", options: ["Sí", "No"] },
  { id: "weeklyHours", title: "¿Cuántas horas por semana te gustaría dedicarle a Mental?", options: ["1 a 3 horas", "4 a 6 horas", "7 a 10 horas", "11 a 15 horas", "Más de 15 horas"] },
  { id: "fixedJob", title: "¿Contás con un trabajo fijo actualmente?", options: ["Sí", "No", "Solo trabajo independiente"] },
  { id: "experience", title: "¿Desde cuándo ejercés como profesional?", options: ["No tengo experiencia", "Menos de 1 año", "1 a 2 años", "3 a 5 años", "Más de 5 años", "Más de 10 años"] },
  { id: "motivation", title: "¿Por qué te gustaría formar parte de Mental?", freeText: true },
];

const initialAnswers: PsychologistApplicationAnswers = {
  education: "",
  educationOther: "",
  specialties: [],
  specialtiesOther: "",
  onlineCare: "",
  weeklyHours: "",
  fixedJob: "",
  experience: "",
  motivation: "",
};
const initialForm = { firstName: "", lastName: "", birthDate: "", email: "", phone: "", linkedin: "" };
const initialFieldErrors = { birthDate: "", email: "", phone: "" };

export function PsychologistApplicationEntry() {
  const router = useRouter();
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<PsychologistApplicationAnswers>(initialAnswers);
  const [form, setForm] = useState(initialForm);
  const [fieldErrors, setFieldErrors] = useState(initialFieldErrors);
  const [stage, setStage] = useState<"survey" | "form" | "done">("survey");
  const [error, setError] = useState("");
  const [isPending, setIsPending] = useState(false);
  const step = steps[stepIndex];
  const progress = stage === "form" ? 100 : ((stepIndex + 1) / steps.length) * 100;

  function selectOption(option: string) {
    setError("");
    if (step.multiple && step.id === "specialties") {
      setAnswers((current) => ({ ...current, specialties: current.specialties.includes(option) ? current.specialties.filter((item) => item !== option) : [...current.specialties, option] }));
      return;
    }
    setAnswers((current) => ({ ...current, [step.id]: option }));
  }

  function isCurrentValid() {
    if (step.id === "specialties") {
      if (!answers.specialties.length) return false;
      if (answers.specialties.includes("Otro") && !answers.specialtiesOther?.trim()) return false;
      return true;
    }
    if (step.id === "education") return Boolean(answers.education && (answers.education !== "Otro" || answers.educationOther?.trim()));
    if (step.id === "motivation") return Boolean(answers.motivation.trim());
    return Boolean(answers[step.id]);
  }

  function next() {
    if (!isCurrentValid()) {
      setError("Respondé esta pregunta para continuar.");
      return;
    }
    if (stepIndex === steps.length - 1) {
      setStage("form");
      setError("");
      return;
    }
    setStepIndex((current) => current + 1);
    setError("");
  }

  function previous() {
    if (stage === "form") {
      setStage("survey");
      setStepIndex(steps.length - 1);
      return;
    }
    if (stepIndex === 0) {
      router.push("/");
      return;
    }
    setStepIndex((current) => current - 1);
    setError("");
  }

  function updateForm(field: keyof typeof initialForm, value: string) {
    const nextValue = field === "phone" ? sanitizePhone(value) : value;
    setForm((current) => ({ ...current, [field]: nextValue }));
    if (field === "birthDate" || field === "email" || field === "phone") {
      setFieldErrors((current) => ({ ...current, [field]: field === "phone" && nextValue !== value ? "El celular solo puede contener números y símbolos válidos." : "" }));
    }
    setError("");
  }

  async function submitApplication() {
    const nextFieldErrors = { ...initialFieldErrors };
    if (!form.firstName.trim() || !form.lastName.trim() || !form.birthDate || !form.email.trim() || !form.phone.trim()) {
      setError("Completá los datos requeridos para enviar tu postulación.");
      return;
    }
    if (!isValidBirthDate(form.birthDate)) nextFieldErrors.birthDate = "Ingresá una fecha de nacimiento válida.";
    else if (!isAtLeastAge(form.birthDate, 18)) nextFieldErrors.birthDate = "Para postularte como profesional debés ser mayor de 18 años.";
    if (!isValidEmail(form.email)) nextFieldErrors.email = "Ingresá un email válido.";
    if (!isValidPhone(form.phone)) nextFieldErrors.phone = "El celular solo puede contener números y símbolos válidos.";
    if (nextFieldErrors.birthDate || nextFieldErrors.email || nextFieldErrors.phone) {
      setFieldErrors(nextFieldErrors);
      return;
    }
    setFieldErrors(nextFieldErrors);
    setIsPending(true);
    setError("");
    await psychologistApplicationService.submit({
      answers,
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      birthDate: form.birthDate,
      email: form.email.trim(),
      phone: form.phone.trim(),
      linkedin: form.linkedin.trim() || undefined,
    });
    setIsPending(false);
    setStage("done");
  }

  if (stage === "done") {
    return <ScreenLayout progress={100} onClose={() => router.push("/")}>
      <section className="prelaunch-card prelaunch-confirmation">
        <div className="completeMark">✓</div>
        <p className="overline">POSTULACIÓN RECIBIDA</p>
        <h1>Recibimos tu postulación</h1>
        <p>Gracias por tu interés en formar parte de Mental. Vamos a revisar tu perfil y contactarte si avanzamos a la siguiente etapa.</p>
        <Button type="button" onClick={() => router.push("/")}>Volver a la web</Button>
      </section>
    </ScreenLayout>;
  }

  return <ScreenLayout progress={progress} onClose={() => router.push("/")}>
    <section className="prelaunch-card psychologist-flow">
      {stage === "survey" ? <>
        <header className="prelaunch-progress"><span>Pregunta {stepIndex + 1} de {steps.length}</span><i><em style={{ width: `${progress}%` }} /></i></header>
        <p className="overline">{step.multiple ? "SELECCIÓN MÚLTIPLE" : "POSTULACIÓN PROFESIONAL"}</p>
        <h1>{step.title}</h1>
        {step.freeText ? <div className="prelaunch-textarea"><textarea maxLength={maxMotivation} value={answers.motivation} onChange={(event) => setAnswers((current) => ({ ...current, motivation: event.target.value.slice(0, maxMotivation) }))} placeholder="Contanos qué te motiva a formar parte de Mental." rows={7} /><small>{answers.motivation.length} / {maxMotivation}</small></div> : <div className={`prelaunch-options${step.multiple ? " multi" : ""}`}>{step.options?.map((option) => {
          const selected = step.id === "specialties" ? answers.specialties.includes(option) : answers[step.id] === option;
          return <button key={option} type="button" className={selected ? "selected" : ""} onClick={() => selectOption(option)}><span>{selected ? "✓" : ""}</span>{option}</button>;
        })}</div>}
        {step.id === "education" && answers.education === "Otro" && <Input className="prelaunch-other" value={answers.educationOther ?? ""} onChange={(event) => setAnswers((current) => ({ ...current, educationOther: event.target.value }))} placeholder="Contanos tu formación" />}
        {step.id === "specialties" && answers.specialties.includes("Otro") && <Input className="prelaunch-other" value={answers.specialtiesOther ?? ""} onChange={(event) => setAnswers((current) => ({ ...current, specialtiesOther: event.target.value }))} placeholder="Contanos tu especialidad" />}
        <p className="flow-error" role="alert">{error}</p>
        <footer className="prelaunch-actions"><button type="button" onClick={previous}>← Volver</button><Button type="button" onClick={next}>{stepIndex === steps.length - 1 ? "Continuar" : "Siguiente"} →</Button></footer>
      </> : <>
        <p className="overline">DATOS DE CONTACTO</p>
        <h1>Completá tus datos para enviar la postulación</h1>
        <form className="prelaunch-form" noValidate onSubmit={(event) => { event.preventDefault(); void submitApplication(); }}>
          <label>Nombre<Input required value={form.firstName} onChange={(event) => updateForm("firstName", event.target.value)} placeholder="Tu nombre" /></label>
          <label>Apellido<Input required value={form.lastName} onChange={(event) => updateForm("lastName", event.target.value)} placeholder="Tu apellido" /></label>
          <label>Fecha de nacimiento<Input required type="date" value={form.birthDate} onChange={(event) => updateForm("birthDate", event.target.value)} />{fieldErrors.birthDate && <small className="prelaunch-field-error">{fieldErrors.birthDate}</small>}</label>
          <label>E-mail<Input required type="email" value={form.email} onChange={(event) => updateForm("email", event.target.value)} placeholder="nombre@email.com" />{fieldErrors.email && <small className="prelaunch-field-error">{fieldErrors.email}</small>}</label>
          <label>Celular<Input required value={form.phone} onChange={(event) => updateForm("phone", event.target.value)} placeholder="Tu celular" />{fieldErrors.phone && <small className="prelaunch-field-error">{fieldErrors.phone}</small>}</label>
          <label>LinkedIn <small>Opcional</small><Input value={form.linkedin} onChange={(event) => updateForm("linkedin", event.target.value)} placeholder="https://linkedin.com/in/..." /></label>
          <p className="flow-error span-full" role="alert">{error}</p>
          <div className="prelaunch-form-actions span-full"><button type="button" onClick={previous}>← Volver</button><Button disabled={isPending} type="submit">{isPending ? "Enviando..." : "Enviar postulación"}</Button></div>
        </form>
      </>}
    </section>
  </ScreenLayout>;
}
