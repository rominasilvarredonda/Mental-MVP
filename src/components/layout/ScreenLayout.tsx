import type { ReactNode } from "react";
import { Logo } from "@/components/branding/Logo";

export function ScreenLayout({ children, progress, onClose }: { children: ReactNode; progress: number; onClose: () => void }) {
  return <div className="flow"><div className="flow-top"><Logo /><button type="button" className="flow-close" onClick={onClose}>× Volver a la web</button></div><main className="flow-main">{children}</main></div>;
}
