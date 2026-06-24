import { isSupabaseConfigured, supabase } from "@/lib/supabase/client";
import type { UserProfile } from "@/types/profile";

function localProfileKey(userId: string) {
  return `mental-v2.local-profile.${userId}`;
}

function emptyProfile(userId: string, email: string): UserProfile {
  return { id: userId, firstName: "", lastName: "", email, role: "user", avatarUrl: null };
}

export const profileService = {
  async getProfile(userId: string, email: string): Promise<UserProfile> {
    if (!isSupabaseConfigured) {
      try {
        const stored = JSON.parse(localStorage.getItem(localProfileKey(userId)) ?? "{}") as Partial<UserProfile>;
        const isMatchingProfile = stored.id === userId && stored.email?.toLowerCase() === email.toLowerCase();
        if (!isMatchingProfile) return emptyProfile(userId, email);
        return {
          id: userId,
          firstName: stored.firstName ?? "",
          lastName: stored.lastName ?? "",
          email,
          role: stored.role === "admin" || stored.role === "therapist" ? stored.role : "user",
          avatarUrl: stored.avatarUrl ?? null,
          age: stored.age ?? null,
          phone: stored.phone ?? null,
          address: stored.address ?? null,
        };
      } catch {
        return emptyProfile(userId, email);
      }
    }
    const { data, error } = await supabase!.from("profiles").select("*").eq("id", userId).maybeSingle();
    if (error) throw error;
    return {
      id: userId,
      firstName: data?.first_name ?? "",
      lastName: data?.last_name ?? "",
      email: data?.email ?? email,
      role: data?.role === "admin" || data?.role === "therapist" ? data.role : "user",
      avatarUrl: data?.avatar_url ?? null,
      age: data?.age ?? null,
      phone: data?.phone ?? null,
      address: data?.address ?? null,
    };
  },

  async upsertProfile(profile: UserProfile): Promise<void> {
    if (!isSupabaseConfigured) {
      localStorage.setItem(localProfileKey(profile.id), JSON.stringify(profile));
      return;
    }
    const { error } = await supabase!.from("profiles").upsert({ id: profile.id, first_name: profile.firstName, last_name: profile.lastName, email: profile.email, role: profile.role });
    if (error) throw error;
  },
};
