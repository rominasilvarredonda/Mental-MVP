"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ScreenLayout } from "@/components/layout/ScreenLayout";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { isValidEmail, isValidPhone, sanitizePhone } from "@/lib/validation";
import { assessmentService } from "@/services/assessmentService";
import { waitlistService } from "@/services/waitlistService";

const initialForm = { firstName: "", lastName: "", email: "", phone: "" };
const initialFieldErrors = { email: "", phone: "" };

export function WaitlistEntry() {
  const router = useRouter();
  const [form, setForm] = useState(initialForm);
  const [fieldErrors, setFieldErrors] = useState(initialFieldErrors);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  function update(field: keyof typeof initialForm, value: string) {
    const nextValue = field === "phone" ? sanitizePhone(value) : value;
    setForm((current) => ({ ...current, [field]: nextValue }));
    if (field === "email" || field === "phone") {
      setFieldErrors((current) => ({ ...current, [field]: field === "phone" && nextValue !== value ? "El celular solo puede contener números y símbolos válidos." : "" }));
    }
    setError("");
  }

  async function submit() {
    const nextFieldErrors = { ...initialFieldErrors };
    if (!form.firstName.trim() || !form.lastName.trim() || !form.email.trim()) {
      setError("Completá nombre, apellido y e-mail para sumarte.");
      return;
    }
    if (!isValidEmail(form.email)) nextFieldErrors.email = "Ingresá un email válido.";
    if (form.phone.trim() && !isValidPhone(form.phone)) nextFieldErrors.phone = "El celular solo puede contener números y símbolos válidos.";
    if (nextFieldErrors.email || nextFieldErrors.phone) {
      setFieldErrors(nextFieldErrors);
      return;
    }
    setFieldErrors(nextFieldErrors);
    setIsPending(true);
    setError("");
    await waitlistService.submit({
      onboardingAnswers: assessmentService.getDraft(),
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      email: form.email.trim(),
      phone: form.phone.trim() || undefined,
    });
    assessmentService.clearDraft();
    setIsSubmitted(true);
    setIsPending(false);
  }

  if (isSubmitted) {
    return <ScreenLayout progress={100} onClose={() => router.push("/")}>
      <section className="prelaunch-card prelaunch-confirmation">
        <div className="completeMark">✓</div>
        <p className="overline">PRE-LANZAMIENTO</p>
        <h1>Ya estás en la lista de espera</h1>
        <p>Te vamos a avisar cuando Mental esté disponible. Además, vas a conservar tu 30% OFF de pre-lanzamiento.</p>
        <Button type="button" onClick={() => router.push("/")}>Volver a la web</Button>
      </section>
    </ScreenLayout>;
  }

  return <ScreenLayout progress={100} onClose={() => router.push("/")}>
    <section className="prelaunch-card">
      <p className="overline">PRE-LANZAMIENTO MENTAL</p>
      <h1>Sumate al pre-lanzamiento de Mental</h1>
      <p>Anotate en la lista de espera y accedé a un 30% OFF en cualquiera de los planes cuando lancemos oficialmente.</p>
      <form className="prelaunch-form" noValidate onSubmit={(event) => { event.preventDefault(); void submit(); }}>
        <label>Nombre<Input required value={form.firstName} onChange={(event) => update("firstName", event.target.value)} placeholder="Tu nombre" /></label>
        <label>Apellido<Input required value={form.lastName} onChange={(event) => update("lastName", event.target.value)} placeholder="Tu apellido" /></label>
        <label>E-mail<Input required type="email" value={form.email} onChange={(event) => update("email", event.target.value)} placeholder="nombre@email.com" />{fieldErrors.email && <small className="prelaunch-field-error">{fieldErrors.email}</small>}</label>
        <label>Celular <small>Opcional</small><Input value={form.phone} onChange={(event) => update("phone", event.target.value)} placeholder="Tu celular" />{fieldErrors.phone && <small className="prelaunch-field-error">{fieldErrors.phone}</small>}</label>
        <p className="flow-error span-full" role="alert">{error}</p>
        <Button className="span-full" disabled={isPending} type="submit">{isPending ? "Guardando..." : "Quiero sumarme a la lista de espera"}</Button>
      </form>
    </section>
  </ScreenLayout>;
}
