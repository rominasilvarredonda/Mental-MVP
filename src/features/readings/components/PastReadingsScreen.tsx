"use client";

import { useState } from "react";
import { Icon } from "@/components/branding/Icon";
import { Button } from "@/components/ui/Button";
import { DashboardCard } from "@/components/layout/DashboardCard";

const pastReadings = [
  { title: "Escuchar lo que necesitás", category: "Autoconocimiento", time: "4 min", content: ["Escucharte no siempre significa tener una respuesta inmediata. A veces es registrar que algo te incomoda, que estás cansada/o o que necesitás bajar el ritmo.", "Probá preguntarte qué emoción aparece con más fuerza y qué gesto simple podría acompañarla hoy. Lo pequeño también puede ser una forma de cuidado."] },
  { title: "Comunicar un límite con calma", category: "Comunicación", time: "6 min", content: ["Poner un límite no es alejarte de las personas: es cuidar las condiciones para que un vínculo pueda ser más claro y más sano.", "Elegí una frase breve, hablá desde tu experiencia y recordá que no necesitás justificar cada necesidad para que sea válida."] },
  { title: "Relaciones que hacen bien", category: "Relaciones", time: "5 min", content: ["Los vínculos que hacen bien no son perfectos. Son espacios donde podés ser escuchada/o, reparar cuando algo duele y sentirte respetada/o.", "Pensá en una relación que te dé calma. Reconocer lo que sí funciona también te ayuda a construir más de eso."] },
];

export function PastReadingsScreen({ onBack }: { onBack: () => void }) {
  const [selectedPast, setSelectedPast] = useState<number | null>(null);
  return <><div className="view-head"><div><Button variant="outline" onClick={onBack}>← Lectura del día</Button><h1 className="past-reading-title">Lecturas pasadas</h1><p>Volvé a las herramientas que te acompañaron esta semana.</p></div></div><section className="past-reading-list">{pastReadings.map((item, index) => <DashboardCard className="past-reading-card" key={item.title}><div><small>{item.category} · {item.time}</small><h3>{item.title}</h3><p>{item.content[0]}</p></div><Button variant="outline" onClick={() => setSelectedPast(selectedPast === index ? null : index)}>{selectedPast === index ? "Cerrar lectura" : "Abrir lectura"}</Button>{selectedPast === index && <article className="past-reading-full"><span><Icon name="book-open" /></span>{item.content.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</article>}</DashboardCard>)}</section></>;
}
