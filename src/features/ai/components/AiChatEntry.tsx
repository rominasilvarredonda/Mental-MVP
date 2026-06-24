"use client";
import { DashboardLayout } from "@/features/dashboard/components/DashboardLayout";
import { AiChatScreen } from "@/features/ai/components/AiChatScreen";
import { useAiChat } from "@/features/ai/hooks/useAiChat";
export function AiChatEntry() { const chat = useAiChat(); return <DashboardLayout activePage="ai"><AiChatScreen messages={chat.messages} pending={chat.isPending} onSend={chat.send} /></DashboardLayout>; }
