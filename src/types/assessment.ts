export type AssessmentAnswer = string | string[] | { name: string; last: string } | undefined;

export type Assessment = {
  answers: AssessmentAnswer[];
  completedAt: string;
};
