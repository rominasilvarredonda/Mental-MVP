"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { LoginScreen } from "@/features/auth/components/LoginScreen";
import { useLogin } from "@/features/auth/hooks/useLogin";

export function LoginEntry() {
  const router = useRouter(); const params = useSearchParams(); const login = useLogin();
  return <LoginScreen email={login.email} password={login.password} error={login.error} isPending={login.isPending} onEmail={login.setEmail} onPassword={login.setPassword} onSubmit={() => login.submit(() => router.push(params.get("next") ?? "/app"))} onForgot={() => login.setError("La recuperación de contraseña estará disponible próximamente.")} onClose={() => router.push("/")} onRegister={() => router.push("/onboarding")} />;
}
