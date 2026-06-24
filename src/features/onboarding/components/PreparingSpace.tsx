import { ScreenLayout } from "@/components/layout/ScreenLayout";

export function PreparingSpace({ onClose }: { onClose: () => void }) {
  return <ScreenLayout progress={100} onClose={onClose}><section className="flow-step analyzing"><div className="analysis-orbit"><i /><i /><i /></div><div className="overline">PERSONALIZANDO TU EXPERIENCIA</div><h1>Estamos preparando tu espacio…</h1><p>Estamos organizando una experiencia acorde a lo que nos compartiste.</p></section></ScreenLayout>;
}
