"use client";

import { useState } from "react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useAsyncAction } from "@/hooks/useAsyncAction";

export function useLogin() {
  const { login } = useAuth();
  const { error, setError, isPending, run } = useAsyncAction();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  async function submit(onSuccess: () => void) {
    if (!/^\S+@\S+\.\S+$/.test(email)) { setError("Ingresá un email válido."); return; }
    if (!password) { setError("Ingresá tu contraseña."); return; }
    const user = await run(() => login({ email, password }));
    if (user) onSuccess();
  }
  return { email, password, error, isPending, setEmail, setPassword, setError, submit };
}
