export type AssessmentAnswer = string | string[] | { name: string; last: string } | undefined;
export type AssessmentAnswersByQuestion = Record<string, string | string[] | undefined>;
export type AssessmentDraft = AssessmentAnswer[] | AssessmentAnswersByQuestion;

export type Assessment = {
  answers: AssessmentDraft;
  completedAt: string;
};
