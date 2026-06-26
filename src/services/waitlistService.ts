import { isSupabaseConfigured, supabase } from "@/lib/supabase/client";
import type { WaitlistRegistration } from "@/types/prelaunch";

const WAITLIST_KEY = "mental-v2.prelaunch.waitlist";

function saveLocal(record: WaitlistRegistration) {
  const existing = JSON.parse(localStorage.getItem(WAITLIST_KEY) ?? "[]") as WaitlistRegistration[];
  localStorage.setItem(WAITLIST_KEY, JSON.stringify([...existing, record]));
}

export const waitlistService = {
  async submit(record: Omit<WaitlistRegistration, "registeredAt" | "source">): Promise<WaitlistRegistration> {
    const nextRecord: WaitlistRegistration = { ...record, registeredAt: new Date().toISOString(), source: "pre-landing" };
    if (!isSupabaseConfigured) {
      saveLocal(nextRecord);
      return nextRecord;
    }
    const { error } = await supabase!.from("prelaunch_waitlist").insert({
      onboarding_answers: nextRecord.onboardingAnswers,
      first_name: nextRecord.firstName,
      last_name: nextRecord.lastName,
      email: nextRecord.email,
      phone: nextRecord.phone || null,
      registered_at: nextRecord.registeredAt,
      source: nextRecord.source,
    });
    if (error) saveLocal(nextRecord);
    return nextRecord;
  },
};
