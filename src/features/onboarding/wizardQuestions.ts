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

const therapySelected = (answers: WizardAnswers) => answers.accompaniment === "Terapia con psicólogo/a." || answers.accompaniment === "Herramientas + terapia con psicologo/a.";

export const wizardQuestions: WizardQuestion[] = [
  { id: "identity", title: "¿Cómo te identificás?", options: ["Mujer", "Hombre", "No binario", "Prefiero describirme"], textWhen: ["Prefiero describirme"], textPlaceholders: { "Prefiero describirme": "¿Cómo te identificás?" } },
  { id: "age", title: "¿Qué edad tienes?", input: "number" },
  { id: "orientation", title: "¿Con qué orientación sexual te identificás?", options: ["Heterosexual", "Homosexual", "Bisexual", "Desplegar opciones"], nested: { id: "orientation-other", showWhen: "Desplegar opciones", options: ["Asexual", "Pansexual", "Queer", "Prefiero describirme", "Prefiero no responder"], textWhen: ["Prefiero describirme"] } },
  { id: "religion", title: "¿Tenés alguna afiliación o creencia religiosa?", options: ["No tengo", "Cristianismo", "Judaísmo", "Islam", "Hinduismo", "Budismo", "Otra religión", "Prefiero no responder"], textWhen: ["Otra religión"] },
  { id: "therapy-history", title: "¿Has hecho terapia anteriormente?", options: ["Si, actualmente.", "Si, en el pasado.", "No, sería mi primera vez."] },
  { id: "support-reason", title: "¿Cual es la principal razón por la que estás buscando apoyo?", options: ["Ansiedad o preocupaciones constantes", "Estrés o agotamiento", "Autoestima o confianza", "Relaciones de pareja", "Relaciones familiares", "Tristeza o desmotivación", "Manejo de emociones", "Crecimiento personal", "Rendimiento deportivo", "Otra"], textWhen: ["Otra"] },
  { id: "current-situation", title: "¿Cuál de estas opciones describe mejor tu situación actual?", options: ["Estudiante", "Empleado/a", "Trabajo independiente", "Emprendedor/a", "Actualmente no estudio ni trabajo", "Prefiero no responder"] },
  { id: "stress", title: "¿Cómo te has sentido últimamente en relación al estrés o la ansiedad?", options: ["Me siento muy sobrepasado/a por el estrés o la ansiedad", "Me siento bastante estresado/a o ansioso/a", "Tengo estrés ocasional, manejable", "Me siento tranquilo/a la mayor parte del tiempo", "Prefiero no responder"], layout: "stacked" },
  { id: "mood", title: "¿Cómo ha estado tu estado de ánimo últimamente?", options: ["Me siento muy decaído/a o sin energía la mayor parte del tiempo", "Me siento desmotivado/a o triste con frecuencia", "A veces me siento bajo/a de ánimo", "Me siento bien la mayor parte del tiempo", "Prefiero no responder"], layout: "stacked" },
  { id: "support-network", title: "¿Cómo te sentís en cuanto a tu entorno o compañía actualmente?", options: ["Me siento muy solo/a la mayor parte del tiempo", "Me siento bastante solo/a o desconectado/a", "A veces me siento solo/a", "Me siento acompañado/a y con buen apoyo", "Prefiero no responder"], layout: "stacked" },
  { id: "accompaniment", title: "¿Qué tipo de acompañamiento estás buscando?", options: ["Herramientas de bienestar (lecturas, psicoeducación, seminarios, AI, etc)", "Terapia con psicólogo/a.", "Herramientas + terapia con psicologo/a."] },
  { id: "goal", title: "¿Cual es tu principal objetivo hoy?", options: ["Sentirme más en calma.", "Comprender mejor mis emociones.", "Crear hábitos de bienestar.", "Mejorar mis vínculos.", "Crecer personalmente.", "Rendimiento deportivo", "Otro"], textWhen: ["Otro"] },
  { id: "therapist-expectations", title: "¿Qué esperás de tu terapeuta? Un terapeuta que…", helper: "Puedes seleccionar varias opciones.", options: ["Me escuche", "Explore mi pasado", "Me enseñe nuevas habilidades", "Cuestione mis creencias", "Me asigne tareas o ejercicios para hacer entre sesiones", "Me ayude a definir objetivos", "Tome la iniciativa de hacer seguimiento conmigo", "Otro"], multiple: true, textWhen: ["Otro"], visibleWhen: therapySelected },
  { id: "schedule", title: "¿En qué horarios te resulta más cómodo tener tus sesiones?", options: ["Mañana", "Tarde", "Noche", "Flexible"], visibleWhen: therapySelected },
  { id: "discovery", title: "¿Cómo conociste Mental?", options: ["Instagram", "TikTok", "Youtube", "Google", "Influencer", "Inteligencia Artificial", "Recomendacion de familiar/amigo", "Otro"], textWhen: ["Influencer", "Otro"], textPlaceholders: { Influencer: "¿Qué influencer te recomendó Mental?" } },
  { id: "professional-preference", title: "¿Tienes alguna preferencia respecto al profesional?", options: ["Hombre", "Mujer", "Sin preferencia"], visibleWhen: therapySelected },
];
