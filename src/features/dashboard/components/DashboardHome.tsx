import { useEffect, useState, type ReactNode } from "react";
import { Icon } from "@/components/branding/Icon";
import { Button } from "@/components/ui/Button";
import { DashboardCard } from "@/components/layout/DashboardCard";
import { Modal } from "@/components/ui/Modal";
import { moodInfluenceOptions, moodOptions, type Mood, type MoodEntry, type MoodInfluence, type MoodNeed } from "@/types/mood";

type DashboardHomeProps = {
  readingCount: number;
  readingComplete: boolean;
  checkinCount: number;
  selectedMood: Mood | null;
  selectedInfluence: MoodInfluence | null;
  selectedNeed: MoodNeed | null;
  note: string;
  todayEntry: MoodEntry | null;
  moodSaved: boolean;
  moodPending: boolean;
  moodCanSave: boolean;
  seminarReserved: boolean;
  exerciseOpen: boolean;
  exerciseDone: boolean;
  onMoodSelect: (mood: Mood) => void;
  onInfluenceSelect: (influence: MoodInfluence) => void;
  onNeedSelect: (need: MoodNeed) => void;
  onNoteChange: (note: string) => void;
  onMoodSave: () => void;
  onExerciseOpen: () => void;
  onExerciseComplete: () => void;
  onNavigate: (path: string) => void;
};

const CHECKIN_NEED_VALUE: MoodNeed = "Seguir como estoy";
const MAX_CHECKIN_NOTE = 2000;
const NEXT_SEMINAR = {
  title: "Manejo de la ansiedad",
  date: "Martes 16 de julio",
  time: "19:00 hs",
  modality: "Encuentro online por Zoom",
};

function checkinTime(entry: MoodEntry | null) {
  return entry ? new Intl.DateTimeFormat("es-UY", { hour: "2-digit", minute: "2-digit" }).format(new Date(entry.createdAt)) : "hoy";
}

function formatWellbeing(value: Mood | null | undefined) {
  return value && /^\d+$/.test(value) ? `${value}/10` : value ?? "Sin registrar";
}

export function DashboardHome({ readingCount, readingComplete, checkinCount, selectedMood, selectedInfluence, selectedNeed, note, todayEntry, moodSaved, moodPending, moodCanSave, seminarReserved, exerciseOpen, exerciseDone, onMoodSelect, onInfluenceSelect, onNeedSelect, onNoteChange, onMoodSave, onExerciseOpen, onExerciseComplete, onNavigate }: DashboardHomeProps) {
  const [showEmergencyInfo, setShowEmergencyInfo] = useState(false);

  return <>
    <div className="view-head"><div><h1>Hola</h1><p>Tu bienestar se construye todos los días.</p></div></div>

    <section className="app-hero">
      <small>TU SEMANA</small><h2>Un espacio para volver a vos.</h2>
      <div className="app-stats">
        <div className="app-stat"><Icon name="heart-pulse" /><b>{checkinCount} {checkinCount === 1 ? "día" : "días"}</b>registrando emociones</div>
        <div className="app-stat"><Icon name="book-open" /><b>{readingCount} lecturas</b>completadas</div>
        <div className="app-stat"><Icon name="presentation" /><b>En 2 días</b>próximo seminario</div>
      </div>
    </section>

    <section className={`checkin-card${moodSaved ? " is-complete" : ""}`}>
      <div className="checkin-heading"><span className="checkin-icon"><Icon name="heart-pulse" /></span><div><small>{moodSaved ? "TU REGISTRO DE HOY" : "CHECK-IN EMOCIONAL"}</small><h2>Check-in emocional</h2><p>Tomate un minuto para registrar cómo te sentís hoy.</p></div></div>
      {moodSaved ? <CheckinComplete entry={todayEntry} /> : <CheckinSurvey selectedMood={selectedMood} selectedInfluence={selectedInfluence} selectedNeed={selectedNeed} note={note} pending={moodPending} canSave={moodCanSave} onMoodSelect={onMoodSelect} onInfluenceSelect={onInfluenceSelect} onNeedSelect={onNeedSelect} onNoteChange={onNoteChange} onSave={onMoodSave} />}
    </section>

    <section className="app-grid two">
      <DashboardCard className={`resource-card${readingComplete ? " completed-resource" : ""}`}>
        {readingComplete ? <><Icon name="badge-check" /><small>PARA TRABAJAR HOY</small><h3>Lectura del día completada</h3><p className="dashboard-card-subtitle">Cómo gestionar el estrés cuando todo parece urgente</p><p>Hoy trabajaste herramientas para gestionar el estrés y priorizar lo importante.</p><Button variant="outline" onClick={() => onNavigate("/app/lecturas")}>Volver a leer</Button></> : <><Icon name="book-open" /><small>PARA TRABAJAR HOY</small><h3>Lectura del día</h3><p className="dashboard-card-subtitle">Cómo gestionar el estrés cuando todo parece urgente</p><p>Una pausa breve para ordenar lo que necesita atención ahora.</p><Button onClick={() => onNavigate("/app/lecturas")}>Leer ahora</Button></>}
      </DashboardCard>
      <DashboardCard className={`resource-card exercise-card${exerciseDone ? " completed-resource" : ""}`}>
        {exerciseDone ? <><Icon name="badge-check" /><small>PRÁCTICA SUGERIDA</small><h3>Ejercicio completado</h3><p className="dashboard-card-subtitle">Respiración consciente de 2 minutos</p><p>Te regalaste un momento para volver al presente.</p><Button variant="outline" onClick={onExerciseOpen}>Volver a practicar</Button></> : <><Icon name="wind" /><small>PRÁCTICA SUGERIDA</small><h3>Ejercicio recomendado</h3><p className="dashboard-card-subtitle">Respiración consciente de 2 minutos</p><p>Una práctica simple para bajar el ritmo y volver a vos.</p><Button onClick={onExerciseOpen}>Abrir ejercicio guiado</Button></>}
      </DashboardCard>
    </section>

    {exerciseOpen && <ExerciseGuide done={exerciseDone} onComplete={onExerciseComplete} />}

    <section className={`app-card seminar-app dashboard-seminar${seminarReserved ? " reserved-seminar" : ""}`}><span className="seminar-icon"><Icon name="presentation" /></span><div className="seminar-dashboard-content"><small>ENCUENTRO RECOMENDADO</small><h3>{seminarReserved ? "Reserva confirmada para el seminario" : "Reservá tu lugar para el seminario"}</h3><p className="dashboard-card-subtitle">{NEXT_SEMINAR.title}</p><div className="seminar-dashboard-meta"><span>{NEXT_SEMINAR.date}</span><span>{NEXT_SEMINAR.time}</span><span>{NEXT_SEMINAR.modality}</span></div>{seminarReserved && <p className="seminar-confirmation"><Icon name="badge-check" /> Lugar reservado</p>}</div><Button variant={seminarReserved ? "outline" : "primary"} onClick={() => onNavigate("/app/seminarios")}>{seminarReserved ? "Ver detalles" : "Reservar lugar"}</Button></section>

    <section className="app-grid two dashboard-bottom"><DashboardCard className="mental-ai-card"><Icon name="bot" /><h3>Mental IA</h3><p>¿Cómo estas?</p><Button onClick={() => onNavigate("/app/mental-ia")}>Hablar con Mental</Button></DashboardCard><article className="trial-app"><Icon name="sparkles" /><div><h3>Prueba gratuita activa</h3><p>Día 1 de 7 · Lecturas, seminarios, IA y recursos.</p></div><Button onClick={() => onNavigate("/plan")}>Ver plan</Button></article></section>

    <section className="emergency-help-card">
      <span className="emergency-help-icon"><Icon name="badge-check" /></span>
      <div className="emergency-help-copy">
        <h2>¿Necesitás ayuda inmediata?</h2>
        <p><strong>Esta web no es un servicio de emergencia. En caso de urgencia comunicate al 911.</strong></p>
        <p className="emergency-help-secondary">Si sentís que vos o alguien más está en una situación de riesgo inmediato, buscá ayuda profesional o comunicate con los servicios de emergencia.</p>
      </div>
      <div className="emergency-help-actions">
        <a className="btn primary" href="tel:911">Llamar al 911</a>
        <button className="btn outline" type="button" onClick={() => setShowEmergencyInfo(true)}>Más información</button>
      </div>
    </section>

    {showEmergencyInfo && <Modal onClose={() => setShowEmergencyInfo(false)}>
      <div className="emergency-info-modal">
        <span className="emergency-help-icon"><Icon name="badge-check" /></span>
        <h2>Mental no reemplaza la atención de urgencia</h2>
        <p>Mental es una herramienta de acompañamiento emocional, psicoeducación y seguimiento cotidiano. No está diseñada para responder ante emergencias ni situaciones de riesgo inmediato.</p>
        <p>Si necesitás ayuda urgente o creés que vos u otra persona puede estar en peligro, comunicate con emergencias al 911 o buscá asistencia profesional inmediata.</p>
        <a className="btn primary" href="tel:911">Llamar al 911</a>
      </div>
    </Modal>}
  </>;
}

function CheckinSurvey({ selectedMood, selectedInfluence, selectedNeed, note, pending, canSave, onMoodSelect, onInfluenceSelect, onNeedSelect, onNoteChange, onSave }: { selectedMood: Mood | null; selectedInfluence: MoodInfluence | null; selectedNeed: MoodNeed | null; note: string; pending: boolean; canSave: boolean; onMoodSelect: (mood: Mood) => void; onInfluenceSelect: (influence: MoodInfluence) => void; onNeedSelect: (need: MoodNeed) => void; onNoteChange: (note: string) => void; onSave: () => void }) {
  const [step, setStep] = useState(0);
  const displayedStep = Math.min(step + 1, 3);
  const progress = step >= 3 ? 100 : ((displayedStep / 3) * 100);

  useEffect(() => {
    if (!selectedNeed) onNeedSelect(CHECKIN_NEED_VALUE);
  }, [onNeedSelect, selectedNeed]);

  function selectMood(mood: Mood) {
    onMoodSelect(mood);
    setStep(1);
  }

  function selectInfluence(influence: MoodInfluence) {
    onInfluenceSelect(influence);
    setStep(2);
  }

  function updateNote(value: string) {
    onNoteChange(value.slice(0, MAX_CHECKIN_NOTE));
  }

  function saveCheckin() {
    if (!selectedNeed) onNeedSelect(CHECKIN_NEED_VALUE);
    onSave();
  }

  return <div className="checkin-survey">
    <div className="checkin-flow-top"><span>{step >= 3 ? "Resumen" : `${displayedStep} de 3`}</span><i><em style={{ width: `${progress}%` }} /></i></div>
    <div className="checkin-flow-panel" key={step}>
      {step === 0 && <CheckinQuestion eyebrow="Pregunta 1" title="¿Cómo te sentís hoy?">
        <div className="wellbeing-scale-labels"><span>Me está costando</span><span>Me siento bien</span><span>Me siento excelente</span></div>
        <div className="wellbeing-scale">{moodOptions.map((mood) => <button type="button" className={selectedMood === mood ? "selected" : ""} onClick={() => selectMood(mood)} key={mood}>{mood}</button>)}</div>
      </CheckinQuestion>}
      {step === 1 && <CheckinQuestion eyebrow="Pregunta 2" title="¿Qué emoción sentís que predomina hoy?">
        <div className="emotion-chip-grid">{moodInfluenceOptions.map((influence) => <button type="button" className={selectedInfluence === influence ? "selected" : ""} onClick={() => selectInfluence(influence)} key={influence}>{influence}</button>)}</div>
      </CheckinQuestion>}
      {step === 2 && <CheckinQuestion eyebrow="Pregunta 3" title="¿Hay algo más que te gustaría registrar?" subtitle="Podés escribir cualquier pensamiento, situación o emoción que quieras recordar.">
        <div className="guided-note"><textarea id="checkin-note" maxLength={MAX_CHECKIN_NOTE} value={note} onChange={(event) => updateNote(event.target.value)} placeholder="Escribí acá lo que quieras registrar…" rows={6} /><small>{note.length} / {MAX_CHECKIN_NOTE}</small></div>
        <div className="checkin-flow-actions"><button type="button" onClick={() => setStep(1)}>← Volver</button><Button type="button" onClick={() => setStep(3)}>Continuar →</Button></div>
      </CheckinQuestion>}
      {step >= 3 && <div className="checkin-summary-card">
        <small>RESUMEN FINAL</small><h3>Tu check-in de hoy</h3>
        <dl><div><dt>Nivel de bienestar</dt><dd>{formatWellbeing(selectedMood)}</dd></div><div><dt>Emoción predominante</dt><dd>{selectedInfluence ?? "Sin registrar"}</dd></div><div><dt>Nota</dt><dd>{note.trim() || "Sin nota agregada."}</dd></div></dl>
        <div className="checkin-flow-actions"><button type="button" onClick={() => setStep(2)}>← Volver</button><Button disabled={!selectedMood || !selectedInfluence || pending} type="button" onClick={saveCheckin}>{pending ? "Guardando..." : "Guardar check-in"}</Button></div>
      </div>}
    </div>
  </div>;
}

function CheckinQuestion({ eyebrow, title, subtitle, children }: { eyebrow: string; title: string; subtitle?: string; children: ReactNode }) {
  return <section className="checkin-question guided"><small>{eyebrow}</small><h3>{title}</h3>{subtitle && <p>{subtitle}</p>}{children}</section>;
}

function CheckinComplete({ entry }: { entry: MoodEntry | null }) {
  return <div className="checkin-complete guided-complete"><Icon name="badge-check" /><div><b>Check-in registrado correctamente.</b><p>Gracias por tomarte este momento para vos.</p><dl><div><dt>Nivel registrado</dt><dd>{formatWellbeing(entry?.mood)}</dd></div><div><dt>Emoción</dt><dd>{entry?.influence ?? "Sin registrar"}</dd></div><div><dt>Nota</dt><dd>{entry?.note || "Sin nota agregada."}</dd></div></dl><small>Registrado hoy a las {checkinTime(entry)} · Volvé mañana para registrar un nuevo check-in.</small></div></div>;
}

function ExerciseGuide({ done, onComplete }: { done: boolean; onComplete: () => void }) {
  const steps = ["Sentate cómodo y aflojá los hombros.", "Inspirá durante 4 segundos.", "Sostené el aire durante 4 segundos.", "Exhalá lentamente durante 6 segundos.", "Repetí a tu ritmo durante 2 minutos."];
  return <section className="exercise-guide"><div className="exercise-guide-head"><span><Icon name="wind" /></span><div><small>EJERCICIO GUIADO</small><h2>Respiración consciente 2 minutos</h2><p>Seguí estos pasos a tu ritmo. No necesitás hacerlo perfecto.</p></div></div><ol>{steps.map((step, index) => <li key={step}><b>Paso {index + 1}</b><span>{step}</span></li>)}</ol>{done ? <div className="exercise-complete"><Icon name="badge-check" /><b>Ejercicio completado</b><span>Este momento de pausa quedó registrado para hoy.</span></div> : <Button onClick={onComplete}>Marcar ejercicio como completado</Button>}</section>;
}
