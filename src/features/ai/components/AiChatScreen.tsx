import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import type { AiMessage } from "@/types/ai";
export function AiChatScreen({ messages, pending, onSend }: { messages: AiMessage[]; pending: boolean; onSend: (content: string) => void }) {
  const [content, setContent] = useState("");
  function submit(event: React.FormEvent) { event.preventDefault(); onSend(content); setContent(""); }
  return <><div className="view-head"><div><h1>Mental IA</h1><p>Un espacio para hacer una pausa y ordenar lo que sentís.</p></div></div><section className="app-card chat-app"><div className="chat-history"><div className="chat-bubble">Hola, estoy acá para acompañarte. ¿Querés contarme cómo te sentís hoy?</div>{messages.map((message) => <div key={message.id} className={`chat-bubble${message.role === "user" ? " user" : ""}`}>{message.content}</div>)}</div><form className="chat-composer" onSubmit={submit}><Input value={content} onChange={(event) => setContent(event.target.value)} placeholder="Escribí lo que estás sintiendo..." /><Button disabled={pending} type="submit">Enviar</Button></form><p className="modal-sub">Esta IA no reemplaza la atención profesional ni brinda diagnósticos.</p></section></>;
}
