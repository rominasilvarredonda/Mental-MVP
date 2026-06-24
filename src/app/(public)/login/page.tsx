import { Suspense } from "react";
import { LoginEntry } from "@/features/auth/components/LoginEntry";

export default function LoginPage() {
  return <Suspense fallback={null}><LoginEntry /></Suspense>;
}
