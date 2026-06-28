import { isSupabaseConfigured, supabase } from "@/lib/supabase/client";
import type { ProfessionalApplicationSubmission, PsychologistApplication } from "@/types/prelaunch";

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
      throw new Error("Supabase no está configurado para guardar postulaciones profesionales.");
    }

    const payload = getNormalizedColumns(nextRecord);
    const { error } = await supabase!.from("professional_applications").insert(payload);

    if (error) {
      console.error("[professionalApplicationService] Supabase insert failed", { error, payload });
      throw new Error("No pudimos guardar la postulación en Supabase. Intentá nuevamente en unos minutos.");
    }

    return nextRecord;
  },
};
