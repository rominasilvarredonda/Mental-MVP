import { isSupabaseConfigured, supabase } from "@/lib/supabase/client";
import type { PrelaunchWaitlistSubmission, WaitlistRegistration } from "@/types/prelaunch";
import type { AssessmentDraft } from "@/types/assessment";

const legacyAnswerIds = [
  "identity",
  "age",
  "orientation",
  "religion",
  "therapy-history",
  "support-reason",
  "current-situation",
  "stress",
  "mood",
  "support-network",
  "accompaniment",
  "goal",
  "therapist-expectations",
  "schedule",
  "discovery",
  "professional-preference",
];

type AnswerValue = string | string[] | undefined;
type AnswerMap = Record<string, AnswerValue>;

function createRecord(submission: PrelaunchWaitlistSubmission): WaitlistRegistration {
  return {
    ...submission,
    source: "pre-landing",
    createdAt: new Date().toISOString(),
  };
}

function toAnswerMap(answers: AssessmentDraft): AnswerMap {
  if (!Array.isArray(answers)) return answers;
  return legacyAnswerIds.reduce<AnswerMap>((result, id, index) => {
    const value = answers[index];
    result[id] = typeof value === "string" || Array.isArray(value) ? value : undefined;
    return result;
  }, {});
}

function asString(value: AnswerValue) {
  if (Array.isArray(value)) return value[0]?.trim() || null;
  return value?.trim() || null;
}

function asNumber(value: AnswerValue) {
  const stringValue = asString(value);
  if (!stringValue) return null;
  const parsed = Number(stringValue);
  return Number.isFinite(parsed) ? parsed : null;
}

function asArray(value: AnswerValue) {
  if (Array.isArray(value)) return value.map((item) => item.trim()).filter(Boolean);
  const singleValue = value?.trim();
  return singleValue ? [singleValue] : [];
}

function compactArray(values: (string | null)[]) {
  return values.filter((value): value is string => Boolean(value));
}

function getNormalizedColumns(record: WaitlistRegistration) {
  const answers = toAnswerMap(record.onboardingAnswers);
  const orientation = asString(answers.orientation);
  const discovery = asString(answers.discovery);

  return {
    first_name: record.firstName,
    last_name: record.lastName,
    email: record.email,
    phone: record.phone || null,
    gender: asString(answers.identity),
    gender_other: asString(answers["identity-text"]),
    age: asNumber(answers.age),
    sexual_orientation: orientation === "Desplegar opciones" ? asString(answers["orientation-other"]) : orientation,
    sexual_orientation_other: asString(answers["orientation-other-text"]),
    religion: asString(answers.religion),
    religion_other: asString(answers["religion-text"]),
    therapy_history: asString(answers["therapy-history"]),
    support_reason: asString(answers["support-reason"]),
    support_reason_other: asString(answers["support-reason-text"]),
    occupation: asString(answers["current-situation"]),
    stress_level: asString(answers.stress),
    mood: asString(answers.mood),
    social_environment: asString(answers["support-network"]),
    accompaniment_type: asString(answers.accompaniment),
    primary_goal: asString(answers.goal),
    primary_goal_other: asString(answers["goal-text"]),
    therapist_expectations: asArray(answers["therapist-expectations"]),
    therapist_expectations_other: asString(answers["therapist-expectations-text"]),
    preferred_schedule: asString(answers.schedule),
    professional_preference: asString(answers["professional-preference"]),
    interests: compactArray([asString(answers["support-reason"]), asString(answers.goal)]),
    referral_source: discovery,
    influencer_name: discovery === "Influencer" ? asString(answers["discovery-text"]) : null,
    referral_source_other: discovery === "Otro" ? asString(answers["discovery-text"]) : null,
    plan_interest: record.interestedPlan || null,
    source: record.source,
    metadata: record.metadata ?? {},
    created_at: record.createdAt,
    updated_at: record.createdAt,
  };
}

export const prelaunchWaitlistService = {
  async submit(submission: PrelaunchWaitlistSubmission): Promise<WaitlistRegistration> {
    const nextRecord = createRecord(submission);

    if (!isSupabaseConfigured) {
      throw new Error("Supabase no está configurado para guardar la lista de espera.");
    }

    const payload = getNormalizedColumns(nextRecord);
    const { error } = await supabase!.from("prelaunch_waitlist").insert(payload);

    if (error) {
      console.error("[prelaunchWaitlistService] Supabase insert failed", { error, payload });
      throw new Error("No pudimos guardar tu registro en Supabase. Intentá nuevamente en unos minutos.");
    }

    return nextRecord;
  },
};
