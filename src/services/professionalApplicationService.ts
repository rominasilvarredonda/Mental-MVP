import { isSupabaseConfigured, supabase } from "@/lib/supabase/client";
import type { ProfessionalApplicationSubmission, PsychologistApplication } from "@/types/prelaunch";

const APPLICATIONS_KEY = "mental-v2.prelaunch.professional-applications";

function isDevelopmentFallbackAllowed() {
  return process.env.NODE_ENV !== "production";
}

function saveLocal(record: PsychologistApplication) {
  if (typeof window === "undefined") return;

  try {
    const existing = JSON.parse(localStorage.getItem(APPLICATIONS_KEY) ?? "[]") as PsychologistApplication[];
    localStorage.setItem(APPLICATIONS_KEY, JSON.stringify([...existing, record]));
  } catch {
    localStorage.setItem(APPLICATIONS_KEY, JSON.stringify([record]));
  }
}

function createRecord(submission: ProfessionalApplicationSubmission): PsychologistApplication {
  return {
    ...submission,
    source: "pre-landing",
    createdAt: new Date().toISOString(),
  };
}

function toBooleanAnswer(value: string) {
  if (value === "Sí") return true;
  if (value === "No") return false;
  return null;
}

function getNormalizedColumns(record: PsychologistApplication) {
  return {
    first_name: record.firstName,
    last_name: record.lastName,
    birth_date: record.birthDate,
    email: record.email,
    phone: record.phone,
    linkedin: record.linkedin || null,
    professional_degree: record.answers.education,
    professional_degree_other: record.answers.educationOther?.trim() || null,
    specialties: record.answers.specialties,
    specialty_other: record.answers.specialtiesOther?.trim() || null,
    provides_online_sessions: toBooleanAnswer(record.answers.onlineCare),
    weekly_availability: record.answers.weeklyHours,
    employment_status: record.answers.fixedJob,
    professional_experience: record.answers.experience,
    motivation: record.answers.motivation,
    source: record.source,
    metadata: record.metadata ?? {},
    created_at: record.createdAt,
    updated_at: record.createdAt,
  };
}

export const professionalApplicationService = {
  async submit(submission: ProfessionalApplicationSubmission): Promise<PsychologistApplication> {
    const nextRecord = createRecord(submission);

    if (!isSupabaseConfigured) {
      if (isDevelopmentFallbackAllowed()) {
        saveLocal(nextRecord);
        return nextRecord;
      }

      throw new Error("Supabase no está configurado para guardar postulaciones profesionales.");
    }

    const { error } = await supabase!.from("professional_applications").insert(getNormalizedColumns(nextRecord));

    if (error) {
      throw new Error("No pudimos guardar la postulación en Supabase. Intentá nuevamente en unos minutos.");
    }

    return nextRecord;
  },
};
