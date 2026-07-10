import type { ReactNode } from "react";
import { LogoLink } from "@/components/branding/LogoLink";

export function ScreenLayout({ children, progress, onClose }: { children: ReactNode; progress: number; onClose: () => void }) {
  return <div className="flow"><div className="flow-top"><LogoLink /><button type="button" className="flow-close" onClick={onClose}>× Volver a la web</button></div><main className="flow-main">{children}</main></div>;
}
