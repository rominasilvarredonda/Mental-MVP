export type WizardAnswer = string | string[];
export type WizardAnswers = Record<string, WizardAnswer | undefined>;

export type WizardQuestion = {
  id: string;
  title: string;
  helper?: string;
  input?: "number";
  options?: string[];
  multiple?: boolean;
  textWhen?: string[];
  textPlaceholders?: Record<string, string>;
  nested?: { id: string; showWhen: string; options: string[]; textWhen?: string[] };
  layout?: "stacked";
  visibleWhen?: (answers: WizardAnswers) => boolean;
};

export const wizardQuestions: WizardQuestion[] = [
  { id: "identity", title: "¿Cómo te identificás?", options: ["Mujer", "Hombre", "No binario", "Prefiero describirme"], textWhen: ["Prefiero describirme"], textPlaceholders: { "Prefiero describirme": "¿Cómo te identificás?" } },
  { id: "age", title: "¿Qué edad tienes?", input: "number" },
  { id: "therapy-history", title: "¿Has hecho terapia anteriormente?", options: ["Si, actualmente.", "Si, en el pasado.", "No, sería mi primera vez."] },
  { id: "accompaniment", title: "¿Qué tipo de acompañamiento estás buscando?", options: ["Herramientas de bienestar (lecturas, psicoeducación, seminarios, AI, etc)", "Terapia con psicólogo/a.", "Herramientas + terapia con psicologo/a."] },
];
