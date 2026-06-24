export const moodOptions = ["Muy bien", "En calma", "Neutral", "Baja energía", "Abrumada/o"] as const;
export const moodInfluenceOptions = ["Trabajo/estudio", "Vínculos", "Descanso", "Salud", "Incertidumbre", "Otro"] as const;
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
