import { isSupabaseConfigured, supabase } from "@/lib/supabase/client";
import type { PsychologistApplication } from "@/types/prelaunch";

const APPLICATIONS_KEY = "mental-v2.prelaunch.psychologist-applications";

function saveLocal(record: PsychologistApplication) {
  const existing = JSON.parse(localStorage.getItem(APPLICATIONS_KEY) ?? "[]") as PsychologistApplication[];
  localStorage.setItem(APPLICATIONS_KEY, JSON.stringify([...existing, record]));
}

export const psychologistApplicationService = {
  async submit(record: Omit<PsychologistApplication, "appliedAt">): Promise<PsychologistApplication> {
    const nextRecord: PsychologistApplication = { ...record, appliedAt: new Date().toISOString() };
    if (!isSupabaseConfigured) {
      saveLocal(nextRecord);
      return nextRecord;
    }
    const { error } = await supabase!.from("psychologist_applications").insert({
      answers: nextRecord.answers,
      first_name: nextRecord.firstName,
      last_name: nextRecord.lastName,
      birth_date: nextRecord.birthDate,
      email: nextRecord.email,
      phone: nextRecord.phone,
      linkedin: nextRecord.linkedin || null,
      applied_at: nextRecord.appliedAt,
    });
    if (error) saveLocal(nextRecord);
    return nextRecord;
  },
};
