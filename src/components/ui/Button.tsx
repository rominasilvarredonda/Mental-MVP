import type { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "outline" };

export function Button({ variant = "primary", className = "", ...props }: ButtonProps) {
  return <button {...props} className={`btn ${variant}${className ? ` ${className}` : ""}`} />;
}
