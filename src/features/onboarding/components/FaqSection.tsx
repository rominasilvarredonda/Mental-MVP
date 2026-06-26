"use client";

import { useState } from "react";
import styles from "./FaqSection.module.css";

type Faq = {
  question: string;
  paragraphs: string[];
  items?: string[];
  afterItems?: string[];
};

const faqs: Faq[] = [
  {
    question: "¿Qué es Mental?",
    paragraphs: [
      "Mental es una plataforma diseñada para ayudarte a desarrollar las habilidades emocionales que impactan en tu bienestar, tus relaciones y tu crecimiento personal.",
      "Combinamos terapia psicológica online, educación emocional y tecnología para ofrecer un acompañamiento más constante, ayudándote a fortalecer tu inteligencia emocional, mejorar habilidades blandas como la comunicación, la autoestima y la gestión emocional, y construir herramientas prácticas para tu día a día.",
    ],
  },
  {
    question: "¿La terapia online es realmente efectiva?",
    paragraphs: [
      "Sí. Diversos estudios muestran que la terapia online es tan efectiva como la presencial cuando es realizada por profesionales capacitados.",
      "Además, en Mental sumamos una IA de apoyo, seguimiento emocional, recordatorios y ejercicios entre sesiones, lo que mejora la continuidad y los resultados del proceso.",
    ],
  },
  {
    question: "¿Quiénes son los psicólogos de Mental?",
    paragraphs: ["Todos los profesionales de Mental son psicólogos titulados y verificados."],
  },
  {
    question: "¿Qué significa “acompañamiento más allá de la sesión”?",
    paragraphs: ["Significa que no estás solo entre una sesión y otra."],
    items: [
      "Registro diario del estado de ánimo",
      "Ejercicios personalizados asignados por tu psicólogo",
      "Recordatorios y tareas sugeridas",
      "Recomendaciones adaptadas a tu progreso",
      "Seguimiento automatizado y apoyo emocional",
      "Inteligencia Artificial de apoyo emocional",
    ],
    afterItems: ["La terapia no se limita a la videollamada."],
  },
  {
    question: "¿Puedo cambiar de psicólogo si no me siento cómodo?",
    paragraphs: [
      "Sí. Podés cambiar de psicólogo en cualquier momento, de forma simple y sin explicaciones incómodas desde la app.",
      "Encontrar al profesional adecuado es clave para que la terapia funcione, y en Mental lo entendemos.",
    ],
  },
  {
    question: "¿Es seguro y confidencial?",
    paragraphs: [
      "Sí.",
      "Las videollamadas están protegidas, los datos se almacenan de forma segura y seguimos estándares de privacidad y confidencialidad para proteger tu información.",
      "Tu proceso terapéutico es completamente privado.",
    ],
  },
  {
    question: "¿A partir de qué edad se puede usar Mental?",
    paragraphs: [
      "Mental está pensada para personas mayores de 18 años.",
      "En el caso de menores de edad, se aplican condiciones específicas de consentimiento según la normativa vigente.",
    ],
  },
  {
    question: "¿Qué pasa si me olvido de una sesión o una tarea?",
    paragraphs: [
      "La app te envía recordatorios automáticos antes de cada sesión y para las tareas sugeridas.",
      "El objetivo es ayudarte a sostener el proceso, no exigirte.",
      "Si olvidás una sesión, podrás asistir a la siguiente normalmente.",
      "Cuando se avisa con al menos 48 horas de anticipación, la sesión podrá recuperarse.",
    ],
  },
  {
    question: "¿La app reemplaza a la terapia tradicional?",
    paragraphs: [
      "No.",
      "Mental ofrece terapia psicológica real, brindada por profesionales, potenciada por tecnología.",
      "No es contenido genérico ni consejos automáticos: es un proceso terapéutico personalizado y acompañado.",
    ],
  },
  {
    question: "¿Mental es solo para personas con problemas graves?",
    paragraphs: ["No.", "Mental es para cualquier persona que quiera:"],
    items: [
      "Mejorar su bienestar emocional",
      "Trabajar ansiedad, estrés o tristeza",
      "Conocerse mejor",
      "Prevenir dificultades futuras",
      "Tener un espacio seguro de acompañamiento",
    ],
    afterItems: ["No necesitás estar pasando por una crisis para empezar terapia."],
  },
  {
    question: "¿Las sesiones tienen una duración fija?",
    paragraphs: ["Sí.", "Cada sesión tiene una duración estándar de 50 minutos para asegurar un espacio terapéutico adecuado y de calidad."],
  },
  {
    question: "¿La inteligencia artificial reemplaza al psicólogo?",
    paragraphs: ["No.", "La IA no reemplaza al profesional.", "Funciona como una herramienta complementaria de apoyo, seguimiento y acompañamiento emocional."],
  },
  {
    question: "¿Puedo usar Mental solo como apoyo emocional y no como terapia intensiva?",
    paragraphs: ["Sí.", "Mental se adapta a distintos niveles de necesidad: desde acompañamiento emocional y prevención hasta procesos terapéuticos más profundos y continuos."],
  },
  {
    question: "¿Qué pasa si necesito más apoyo en un mes difícil?",
    paragraphs: ["Podés mejorar tu plan o agregar sesiones individuales.", "La idea es que el servicio se adapte a tus necesidades y a cada momento de tu proceso."],
  },
];

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return <section className={styles.section} aria-labelledby="faq-title">
    <div className={styles.heading}>
      <div className={styles.kicker}>ACLARAMOS TUS DUDAS</div>
      <h2 id="faq-title">Preguntas frecuentes</h2>
      <p>Respondemos las dudas más comunes sobre cómo funciona Mental.</p>
    </div>
    <div className={styles.list}>
      {faqs.map((faq, index) => {
        const isOpen = openIndex === index;
        const answerId = `faq-answer-${index}`;
        return <article className={`${styles.item}${isOpen ? ` ${styles.open}` : ""}`} key={faq.question}>
          <button type="button" className={styles.question} aria-expanded={isOpen} aria-controls={answerId} onClick={() => setOpenIndex(isOpen ? null : index)}>
            <span>{faq.question}</span><span className={styles.chevron} aria-hidden="true">▼</span>
          </button>
          <div className={styles.answer} id={answerId}>
            <div className={styles.answerInner}>
              {faq.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              {faq.items && <ul>{faq.items.map((item) => <li key={item}>{item}</li>)}</ul>}
              {faq.afterItems?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </div>
          </div>
        </article>;
      })}
    </div>
  </section>;
}
