import type { ReactNode } from "react";

export function Modal({ children, onClose }: { children: ReactNode; onClose: () => void }) {
  return <div className="space-modal" role="dialog" aria-modal="true"><div className="space-modal-card"><button type="button" className="modal-close" onClick={onClose} aria-label="Cerrar">×</button>{children}</div></div>;
}
