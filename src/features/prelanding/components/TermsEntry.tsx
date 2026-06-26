"use client";

import { useRouter } from "next/navigation";
import { ScreenLayout } from "@/components/layout/ScreenLayout";
import { Button } from "@/components/ui/Button";

export function TermsEntry() {
  const router = useRouter();
  return <ScreenLayout progress={100} onClose={() => router.push("/")}>
    <article className="prelaunch-card legal-card">
      <p className="overline">MENTAL</p>
      <h1>Términos y condiciones</h1>
      <p>Los términos y condiciones definitivos de Mental estarán disponibles antes del lanzamiento oficial de la plataforma.</p>
      <p>Durante esta etapa de pre-lanzamiento, la información presentada tiene carácter informativo y puede actualizarse a medida que avancemos en la preparación del servicio.</p>
      <p>Mental es una herramienta de acompañamiento emocional, psicoeducación y conexión con profesionales. No reemplaza servicios de emergencia, atención médica urgente ni asistencia clínica inmediata.</p>
      <p>En caso de urgencia o riesgo inmediato, comunicate con los servicios de emergencia correspondientes, como el 911.</p>
      <Button type="button" onClick={() => router.push("/")}>Volver a la web</Button>
    </article>
  </ScreenLayout>;
}
