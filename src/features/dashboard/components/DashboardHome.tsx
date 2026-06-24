import { Icon, type IconName } from "@/components/branding/Icon";
import { Button } from "@/components/ui/Button";
import { DashboardCard } from "@/components/layout/DashboardCard";
import { moodInfluenceOptions, moodNeedOptions, moodOptions, type Mood, type MoodEntry, type MoodInfluence, type MoodNeed } from "@/types/mood";

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

const emotionIcons: Record<Mood, IconName> = {
  "Muy bien": "heart-pulse",
  "En calma": "heart",
  Neutral: "circle",
  "Baja energía": "cloud-rain",
  "Abrumada/o": "cloud-lightning",
};

function checkinTime(entry: MoodEntry | null) {
  return entry ? new Intl.DateTimeFormat("es-UY", { hour: "2-digit", minute: "2-digit" }).format(new Date(entry.createdAt)) : "hoy";
}

export function DashboardHome({ readingCount, readingComplete, checkinCount, selectedMood, selectedInfluence, selectedNeed, note, todayEntry, moodSaved, moodPending, moodCanSave, seminarReserved, exerciseOpen, exerciseDone, onMoodSelect, onInfluenceSelect, onNeedSelect, onNoteChange, onMoodSave, onExerciseOpen, onExerciseComplete, onNavigate }: DashboardHomeProps) {
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
      <div className="checkin-heading"><span className="checkin-icon"><Icon name="heart-pulse" /></span><div><small>UN MOMENTO PARA VOS</small><h2>Check-in emocional</h2><p>Tomate un momento para registrar cómo estás hoy.</p></div></div>
      {moodSaved ? <CheckinComplete entry={todayEntry} /> : <CheckinSurvey selectedMood={selectedMood} selectedInfluence={selectedInfluence} selectedNeed={selectedNeed} note={note} pending={moodPending} canSave={moodCanSave} onMoodSelect={onMoodSelect} onInfluenceSelect={onInfluenceSelect} onNeedSelect={onNeedSelect} onNoteChange={onNoteChange} onSave={onMoodSave} />}
    </section>

    <div className="view-head recommendation-head"><div><h1 style={{ fontSize: 23 }}>Recomendado para vos</h1></div></div>
    <section className="app-grid">
      <DashboardCard className={`resource-card${readingComplete ? " completed-resource" : ""}`}>
        {readingComplete ? <><Icon name="badge-check" /><h3>Lectura del día completada</h3><small>HERRAMIENTA DEL DÍA</small><p>Hoy trabajaste herramientas para gestionar el estrés y priorizar lo importante.</p><Button variant="outline" onClick={() => onNavigate("/app/lecturas")}>Volver a leer</Button></> : <><Icon name="book-open" /><h3>Cómo gestionar el estrés cuando todo parece urgente</h3><small>5 min · Lectura del día</small><p>Una pausa breve para ordenar lo que necesita atención ahora.</p><Button onClick={() => onNavigate("/app/lecturas")}>Leer ahora</Button></>}
      </DashboardCard>
      <DashboardCard className={`resource-card exercise-card${exerciseDone ? " completed-resource" : ""}`}>
        {exerciseDone ? <><Icon name="badge-check" /><h3>Ejercicio completado</h3><small>RESPIRACIÓN CONSCIENTE · 2 MIN</small><p>Te regalaste un momento para volver al presente.</p><Button variant="outline" onClick={onExerciseOpen}>Volver a practicar</Button></> : <><Icon name="wind" /><h3>Respiración consciente 2 minutos</h3><small>EJERCICIO RECOMENDADO</small><p>Una práctica simple para bajar el ritmo y volver a vos.</p><Button onClick={onExerciseOpen}>Abrir ejercicio guiado</Button></>}
      </DashboardCard>
      <DashboardCard className="resource-card reflection"><Icon name="lightbulb" /><h3>Reflexión del día</h3><p>“No necesitás resolverlo todo hoy.”</p></DashboardCard>
    </section>

    {exerciseOpen && <ExerciseGuide done={exerciseDone} onComplete={onExerciseComplete} />}

    <section className={`app-card seminar-app dashboard-seminar${seminarReserved ? " reserved-seminar" : ""}`}><span className="seminar-icon"><Icon name="presentation" /></span><div>{seminarReserved ? <><small>RESERVA CONFIRMADA</small><h3><Icon name="badge-check" /> Lugar reservado</h3><p>Manejo de la ansiedad · Martes · 19:00 · Online</p></> : <><small>PRÓXIMO SEMINARIO</small><h3>Manejo de la ansiedad</h3><p>Martes · 19:00 · Modalidad online</p></>}</div><Button variant={seminarReserved ? "outline" : "primary"} onClick={() => onNavigate("/app/seminarios")}>{seminarReserved ? "Ver detalles" : "Reservar lugar"}</Button></section>

    <section className="app-grid two dashboard-bottom"><DashboardCard className="mental-ai-card"><Icon name="bot" /><h3>Mental IA</h3><p>¿Querés contarme cómo estuvo tu día?</p><Button onClick={() => onNavigate("/app/mental-ia")}>Hablar con Mental</Button></DashboardCard><article className="trial-app"><Icon name="sparkles" /><div><h3>Prueba gratuita activa</h3><p>Día 1 de 7 · Lecturas, seminarios, IA y recursos.</p></div><Button onClick={() => onNavigate("/plan")}>Ver plan</Button></article></section>
  </>;
}

function CheckinSurvey({ selectedMood, selectedInfluence, selectedNeed, note, pending, canSave, onMoodSelect, onInfluenceSelect, onNeedSelect, onNoteChange, onSave }: { selectedMood: Mood | null; selectedInfluence: MoodInfluence | null; selectedNeed: MoodNeed | null; note: string; pending: boolean; canSave: boolean; onMoodSelect: (mood: Mood) => void; onInfluenceSelect: (influence: MoodInfluence) => void; onNeedSelect: (need: MoodNeed) => void; onNoteChange: (note: string) => void; onSave: () => void }) {
  return <div className="checkin-survey">
    <CheckinQuestion number="Pregunta 1" title="¿Cómo te sentís hoy?">
      <div className="checkin-emotions">{moodOptions.map((mood) => <button type="button" className={selectedMood === mood ? "selected" : ""} onClick={() => onMoodSelect(mood)} key={mood}><span><Icon name={emotionIcons[mood]} /></span><b>{mood}</b></button>)}</div>
    </CheckinQuestion>
    <CheckinQuestion number="Pregunta 2" title="¿Qué fue lo que más influyó en tu estado de hoy?"><div className="checkin-options">{moodInfluenceOptions.map((influence) => <button type="button" className={selectedInfluence === influence ? "selected" : ""} onClick={() => onInfluenceSelect(influence)} key={influence}>{influence}</button>)}</div></CheckinQuestion>
    <CheckinQuestion number="Pregunta 3" title="¿Qué necesitás hoy?"><div className="checkin-options">{moodNeedOptions.map((need) => <button type="button" className={selectedNeed === need ? "selected" : ""} onClick={() => onNeedSelect(need)} key={need}>{need}</button>)}</div></CheckinQuestion>
    <div className="checkin-note"><label htmlFor="checkin-note">Nota breve <small>Opcional</small></label><textarea id="checkin-note" value={note} onChange={(event) => onNoteChange(event.target.value)} placeholder="¿Querés dejar una nota sobre cómo estuvo tu día?" rows={3} /><div><small>{canSave ? "Tu registro es privado y está disponible solo para vos." : "Respondé las tres preguntas para guardar tu check-in."}</small><Button disabled={!canSave || pending} type="button" onClick={onSave}>{pending ? "Guardando..." : "Guardar check-in"}</Button></div></div>
  </div>;
}

function CheckinQuestion({ number, title, children }: { number: string; title: string; children: React.ReactNode }) {
  return <section className="checkin-question"><small>{number}</small><h3>{title}</h3>{children}</section>;
}

function CheckinComplete({ entry }: { entry: MoodEntry | null }) {
  return <div className="checkin-complete"><Icon name="badge-check" /><div><b>Check-in de hoy completado</b><dl><div><dt>Hoy registraste</dt><dd>{entry?.mood ?? "Sin registrar"}</dd></div><div><dt>Influyó principalmente</dt><dd>{entry?.influence ?? "Sin registrar"}</dd></div><div><dt>Hoy necesitás</dt><dd>{entry?.need ?? "Sin registrar"}</dd></div></dl><small>Registrado a las {checkinTime(entry)} · Volvé mañana para realizar un nuevo check-in.</small></div></div>;
}

function ExerciseGuide({ done, onComplete }: { done: boolean; onComplete: () => void }) {
  const steps = ["Sentate cómodo y aflojá los hombros.", "Inspirá durante 4 segundos.", "Sostené el aire durante 4 segundos.", "Exhalá lentamente durante 6 segundos.", "Repetí a tu ritmo durante 2 minutos."];
  return <section className="exercise-guide"><div className="exercise-guide-head"><span><Icon name="wind" /></span><div><small>EJERCICIO GUIADO</small><h2>Respiración consciente 2 minutos</h2><p>Seguí estos pasos a tu ritmo. No necesitás hacerlo perfecto.</p></div></div><ol>{steps.map((step, index) => <li key={step}><b>Paso {index + 1}</b><span>{step}</span></li>)}</ol>{done ? <div className="exercise-complete"><Icon name="badge-check" /><b>Ejercicio completado</b><span>Este momento de pausa quedó registrado para hoy.</span></div> : <Button onClick={onComplete}>Marcar ejercicio como completado</Button>}</section>;
}
