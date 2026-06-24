import type { Metadata } from "next";
import "@/app/globals.css";
import { AuthProvider } from "@/features/auth/hooks/useAuth";

export const metadata: Metadata = { title: "Mental — acompañamiento emocional", description: "Acompañamiento emocional profesional, accesible y a tu ritmo." };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es"><head><link rel="preconnect" href="https://fonts.googleapis.com" /><link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" /><link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Raleway:wght@500;600;700;800&display=swap" rel="stylesheet" /></head><body><AuthProvider>{children}</AuthProvider></body></html>;
}
