"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { aiService } from "@/services/aiService";
import type { AiMessage } from "@/types/ai";
import { useAsyncAction } from "@/hooks/useAsyncAction";

const reply = "Gracias por compartirlo. Podemos ir paso a paso: ¿qué sería una cosa amable que podrías hacer por vos hoy?";
export function useAiChat() {
  const { user } = useAuth();
  const { isPending, error, run } = useAsyncAction();
  const [messages, setMessages] = useState<AiMessage[]>([]);
  useEffect(() => { if (user) void aiService.list(user.id).then(setMessages); }, [user]);
  async function send(content: string) {
    if (!user || !content.trim()) return;
    const userMessage = await run(() => aiService.createMessage(user.id, "user", content.trim()));
    if (!userMessage) return;
    const assistantMessage = await aiService.createMessage(user.id, "assistant", reply);
    setMessages((current) => [...current, userMessage, assistantMessage]);
  }
  return { messages, isPending, error, send };
}
