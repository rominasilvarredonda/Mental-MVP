"use client";

import { useRouter } from "next/navigation";
import { RegisterScreen } from "@/features/auth/components/RegisterScreen";
import { useRegister } from "@/features/auth/hooks/useRegister";

export function RegisterEntry() {
  const router = useRouter(); const register = useRegister();
  return <RegisterScreen form={register.form} error={register.error} isPending={register.isPending} onChange={(field, value) => register.setForm({ ...register.form, [field]: value })} onSubmit={() => register.submit(() => router.push("/app"))} onClose={() => router.push("/")} />;
}
