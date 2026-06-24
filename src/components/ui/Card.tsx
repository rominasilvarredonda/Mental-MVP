import type { HTMLAttributes } from "react";

export function Card({ className = "", ...props }: HTMLAttributes<HTMLElement>) {
  return <article {...props} className={`app-card${className ? ` ${className}` : ""}`} />;
}
