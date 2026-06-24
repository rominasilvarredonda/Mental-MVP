import { isSupabaseConfigured, supabase } from "@/lib/supabase/client";
import type { AssessmentAnswer } from "@/types/assessment";

const ASSESSMENT_DRAFT_KEY = "mental-v2.assessment-draft";

export const assessmentService = {
  saveDraft(answers: AssessmentAnswer[]) {
    sessionStorage.setItem(ASSESSMENT_DRAFT_KEY, JSON.stringify(answers));
  },
  getDraft(): AssessmentAnswer[] {
    try { return JSON.parse(sessionStorage.getItem(ASSESSMENT_DRAFT_KEY) ?? "[]") as AssessmentAnswer[]; } catch { return []; }
  },
  clearDraft() { sessionStorage.removeItem(ASSESSMENT_DRAFT_KEY); },
  async save(userId: string, answers: AssessmentAnswer[]): Promise<void> {
    if (!isSupabaseConfigured) return;
    const { error } = await supabase!.from("onboarding_answers").upsert({ user_id: userId, answers });
    if (error) throw error;
  },
};
