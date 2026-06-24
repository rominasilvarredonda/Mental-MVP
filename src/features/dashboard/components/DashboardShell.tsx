"use client";

import { useState, type ReactNode } from "react";
import { Icon, type IconName } from "@/components/branding/Icon";
import { Logo } from "@/components/branding/Logo";

export type DashboardPage = "home" | "readings" | "seminars" | "ai" | "progress" | "profile";
const navigation: { page: DashboardPage; label: string; icon: IconName }[] = [{ page: "home", label: "Mi espacio", icon: "house" }, { page: "readings", label: "Lectura diaria", icon: "book-open" }, { page: "seminars", label: "Seminarios", icon: "presentation" }, { page: "ai", label: "Mental IA", icon: "bot" }, { page: "progress", label: "Progreso", icon: "trending-up" }, { page: "profile", label: "Perfil", icon: "user-circle" }];

const notifications = ["Tu lectura del día está disponible", "Recordá completar tu check-in", "Tu próximo seminario se habilitará pronto"];

function initials(userName: string, email: string) {
  const nameParts = userName.trim().split(/\s+/).filter(Boolean);
  if (nameParts.length > 0) return nameParts.slice(0, 2).map((part) => part[0]).join("").toUpperCase();
  return email.trim().charAt(0).toUpperCase() || "M";
}

export function DashboardShell({ activePage, children, onNavigate, onLogout, userName, userEmail, avatarUrl }: { activePage: DashboardPage; children: ReactNode; onNavigate: (page: DashboardPage) => void; onLogout: () => void; userName: string; userEmail: string; avatarUrl?: string | null }) {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const avatarInitials = initials(userName, userEmail);

  return <div className="mental-app"><aside className="app-sidebar"><Logo /><nav className="app-nav">{navigation.map((item) => <button type="button" className={activePage === item.page ? "active" : ""} onClick={() => onNavigate(item.page)} key={item.page}><Icon name={item.icon} />{item.label}</button>)}</nav><button type="button" className="app-sidebar-bottom" onClick={onLogout}>Prueba gratuita · Día 1 de 7</button></aside><main className="app-main"><header className="app-top"><div className="app-user"><div className="notification-menu"><button type="button" className="notification-trigger" onClick={() => setNotificationsOpen((isOpen) => !isOpen)} aria-label="Ver notificaciones" aria-haspopup="menu" aria-expanded={notificationsOpen}><Icon name="bell" /><i /></button>{notificationsOpen && <div className="notification-dropdown" role="menu" aria-label="Notificaciones"><div className="notification-dropdown-head"><b>Notificaciones</b><span>Hoy</span></div>{notifications.map((notification) => <p key={notification}>{notification}</p>)}</div>}</div>{avatarUrl ? <img className="avatar avatar-image" src={avatarUrl} alt={`Foto de perfil de ${userName || userEmail}`} /> : <span className="avatar" aria-label={`Iniciales de ${userName || userEmail}`}>{avatarInitials}</span>}<span>{userName || userEmail}</span></div></header><section className="app-view">{children}</section></main></div>;
}
