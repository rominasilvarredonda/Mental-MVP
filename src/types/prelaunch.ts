import type { AssessmentDraft } from "@/types/assessment";

export type PrelaunchSource = "pre-landing";
export type PrelaunchMetadata = Record<string, unknown>;

export type PrelaunchWaitlistSubmission = {
  onboardingAnswers: AssessmentDraft;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  interestedPlan?: string | null;
  metadata?: PrelaunchMetadata;
};

export type WaitlistRegistration = {
  onboardingAnswers: AssessmentDraft;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  interestedPlan?: string | null;
  source: PrelaunchSource;
  metadata?: PrelaunchMetadata;
  createdAt: string;
};

export type PsychologistApplicationAnswers = {
  education: string;
  educationOther?: string;
  specialties: string[];
  specialtiesOther?: string;
  onlineCare: string;
  weeklyHours: string;
  fixedJob: string;
  experience: string;
  motivation: string;
};

export type PsychologistApplication = {
  answers: PsychologistApplicationAnswers;
  firstName: string;
  lastName: string;
  birthDate: string;
  email: string;
  phone: string;
  linkedin?: string;
  source: PrelaunchSource;
  metadata?: PrelaunchMetadata;
  createdAt: string;
};

export type ProfessionalApplicationSubmission = Omit<PsychologistApplication, "createdAt" | "source"> & {
  metadata?: PrelaunchMetadata;
};
