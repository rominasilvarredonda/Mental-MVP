"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { authService, type Credentials, type Registration } from "@/services/authService";
import { profileService } from "@/services/profileService";
import type { AuthUser } from "@/types/auth";
import type { UserProfile } from "@/types/profile";

type AuthContextValue = {
  user: AuthUser | null;
  profile: UserProfile | null;
  isLoading: boolean;
  login: (credentials: Credentials) => Promise<AuthUser>;
  register: (registration: Registration) => Promise<AuthUser>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

async function loadProfile(user: AuthUser): Promise<UserProfile> {
  return profileService.getProfile(user.id, user.email);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const hydrationId = useRef(0);

  const hydrate = useCallback(async (nextUser: AuthUser | null) => {
    const currentHydration = ++hydrationId.current;
    setUser(nextUser);
    setProfile(null);
    if (!nextUser) { setIsLoading(false); return; }
    setIsLoading(true);
    try {
      const nextProfile = await loadProfile(nextUser);
      if (currentHydration !== hydrationId.current) return;
      setProfile(nextProfile);
      setUser({ ...nextUser, role: nextProfile.role });
    } finally {
      if (currentHydration === hydrationId.current) setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void authService.getCurrentUser().then(hydrate).catch(() => setIsLoading(false));
    return authService.observe((nextUser) => { void hydrate(nextUser); });
  }, [hydrate]);

  const login = useCallback(async (credentials: Credentials) => {
    const nextUser = await authService.signIn(credentials);
    await hydrate(nextUser);
    return nextUser;
  }, [hydrate]);

  const register = useCallback(async (registration: Registration) => {
    const nextUser = await authService.signUp(registration);
    const nextProfile: UserProfile = { id: nextUser.id, firstName: registration.firstName, lastName: registration.lastName, email: registration.email, role: "user" };
    await profileService.upsertProfile(nextProfile);
    await hydrate(nextUser);
    return nextUser;
  }, [hydrate]);

  const logout = useCallback(async () => {
    ++hydrationId.current;
    setUser(null);
    setProfile(null);
    setIsLoading(false);
    await authService.signOut();
  }, []);

  const value = useMemo(() => ({ user, profile, isLoading, login, register, logout }), [user, profile, isLoading, login, register, logout]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth debe usarse dentro de AuthProvider.");
  return context;
}
