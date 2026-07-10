import Link from "next/link";
import { Logo } from "@/components/branding/Logo";

export function LogoLink({ dark = false, compact = false }: { dark?: boolean; compact?: boolean }) {
  return <Link aria-label="Volver al inicio de Mental" className="landing-logo-link" href="/"><Logo dark={dark} compact={compact} /></Link>;
}
