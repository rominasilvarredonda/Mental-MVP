import { isSupabaseConfigured, supabase } from "@/lib/supabase/client";
import type { AuthUser, Role } from "@/types/auth";

type Credentials = { email: string; password: string };
type Registration = Credentials & { firstName: string; lastName: string };

const LOCAL_SESSION_KEY = "mental-v2.local-session";

function localUser(email: string): AuthUser {
  const normalizedEmail = email.trim().toLowerCase();
  return { id: `local-${encodeURIComponent(normalizedEmail)}`, email: normalizedEmail, role: "user" };
}

function persistLocal(user: AuthUser) {
  localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(user));
}

function toAuthUser(user: { id: string; email?: string | null; app_metadata?: Record<string, unknown> }): AuthUser {
  const role = user.app_metadata?.role;
  return { id: user.id, email: user.email ?? "", role: role === "admin" || role === "therapist" ? role : "user" } as AuthUser;
}

export const authService = {
  async getCurrentUser(): Promise<AuthUser | null> {
    if (!isSupabaseConfigured) {
      const stored = localStorage.getItem(LOCAL_SESSION_KEY);
      if (!stored) return null;
      try {
        const localSession = JSON.parse(stored) as Partial<AuthUser>;
        if (!localSession.email) return null;
        const user = localUser(localSession.email);
        persistLocal(user);
        return user;
      } catch {
        localStorage.removeItem(LOCAL_SESSION_KEY);
        return null;
      }
    }
    const { data } = await supabase!.auth.getUser();
    return data.user ? toAuthUser(data.user) : null;
  },

  async signIn({ email, password }: Credentials): Promise<AuthUser> {
    if (!isSupabaseConfigured) {
      const user = localUser(email);
      persistLocal(user);
      return user;
    }
    const { data, error } = await supabase!.auth.signInWithPassword({ email, password });
    if (error) throw error;
    if (!data.user) throw new Error("No pudimos iniciar sesión.");
    return toAuthUser(data.user);
  },

  async signUp({ firstName, lastName, email, password }: Registration): Promise<AuthUser> {
    if (!isSupabaseConfigured) {
      const user = localUser(email);
      persistLocal(user);
      return user;
    }
    const { data, error } = await supabase!.auth.signUp({
      email,
      password,
      options: { data: { first_name: firstName, last_name: lastName } },
    });
    if (error) throw error;
    if (!data.user) throw new Error("No pudimos crear tu cuenta.");
    if (!data.session) throw new Error("Te enviamos un email para confirmar tu cuenta. Luego iniciá sesión.");
    return toAuthUser(data.user);
  },

  async signOut(): Promise<void> {
    if (!isSupabaseConfigured) { localStorage.removeItem(LOCAL_SESSION_KEY); return; }
    const { error } = await supabase!.auth.signOut();
    if (error) throw error;
  },

  observe(onChange: (user: AuthUser | null) => void) {
    if (!isSupabaseConfigured) return () => undefined;
    const { data } = supabase!.auth.onAuthStateChange((_event, session) => onChange(session?.user ? toAuthUser(session.user) : null));
    return () => data.subscription.unsubscribe();
  },
};

export type { Credentials, Registration, Role };
