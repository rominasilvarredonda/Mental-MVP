export const moodOptions = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"] as const;
export const moodInfluenceOptions = ["Angustia", "Estrés", "Ansiedad", "Euforia", "Alegría", "Tristeza", "Furia", "Enojo", "Calma", "Inseguridad", "Confusión", "Incomodidad"] as const;
export const moodNeedOptions = ["Ordenar mis ideas", "Bajar ansiedad", "Motivarme", "Descansar", "Hablar con alguien", "Seguir como estoy"] as const;

export type Mood = (typeof moodOptions)[number];
export type MoodInfluence = (typeof moodInfluenceOptions)[number];
export type MoodNeed = (typeof moodNeedOptions)[number];

export type DailyCheckinInput = {
  mood: Mood;
  influence: MoodInfluence;
  need: MoodNeed;
  note: string;
};

export type MoodEntry = {
  id: string;
  mood: Mood;
  influence: MoodInfluence | null;
  need: MoodNeed | null;
  note: string | null;
  date: string;
  createdAt: string;
};
