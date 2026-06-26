import type { AssessmentAnswer } from "@/types/assessment";

export type WaitlistRegistration = {
  onboardingAnswers: AssessmentAnswer[];
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  registeredAt: string;
  source: "pre-landing";
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
  appliedAt: string;
};
