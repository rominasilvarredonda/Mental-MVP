"use client";

import { useState } from "react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useAsyncAction } from "@/hooks/useAsyncAction";
import { assessmentService } from "@/services/assessmentService";

export function useRegister() {
  const { register } = useAuth();
  const { error, setError, isPending, run } = useAsyncAction();
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", password: "", confirm: "" });
  async function submit(onSuccess: () => void) {
    if (!form.firstName || !form.lastName) { setError("Ingresá tu nombre y apellido."); return; }
    if (!/^\S+@\S+\.\S+$/.test(form.email)) { setError("Ingresá un email válido."); return; }
    if (form.password.length < 8) { setError("La contraseña debe tener al menos 8 caracteres."); return; }
    if (form.password !== form.confirm) { setError("Las contraseñas no coinciden."); return; }
    const user = await run(async () => {
      const nextUser = await register(form);
      await assessmentService.save(nextUser.id, assessmentService.getDraft());
      return nextUser;
    });
    if (!user) return;
    assessmentService.clearDraft();
    onSuccess();
  }
  return { form, setForm, error, isPending, submit };
}
