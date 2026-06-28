import { isSupabaseConfigured, supabase } from "@/lib/supabase/client";
import type { AssessmentDraft } from "@/types/assessment";

const ASSESSMENT_DRAFT_KEY = "mental-v2.assessment-draft";

export const assessmentService = {
  saveDraft(answers: AssessmentDraft) {
    sessionStorage.setItem(ASSESSMENT_DRAFT_KEY, JSON.stringify(answers));
  },
  getDraft(): AssessmentDraft {
    try { return JSON.parse(sessionStorage.getItem(ASSESSMENT_DRAFT_KEY) ?? "[]") as AssessmentDraft; } catch { return []; }
  },
  clearDraft() { sessionStorage.removeItem(ASSESSMENT_DRAFT_KEY); },
  async save(userId: string, answers: AssessmentDraft): Promise<void> {
    if (!isSupabaseConfigured) return;
    const { error } = await supabase!.from("onboarding_answers").upsert({ user_id: userId, answers });
    if (error) throw error;
  },
};
