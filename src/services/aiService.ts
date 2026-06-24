import { isSupabaseConfigured, supabase } from "@/lib/supabase/client";
import type { AiMessage } from "@/types/ai";

export const aiService = {
  async list(userId: string): Promise<AiMessage[]> {
    if (!isSupabaseConfigured) {
      try {
        return JSON.parse(
          localStorage.getItem(`mental-v2.ai.${userId}`) ?? "[]",
        ) as AiMessage[];
      } catch {
        return [];
      }
    }

    const { data, error } = await supabase!
      .from("ai_messages")
      .select("*")
      .eq("user_id", userId)
      .order("created_at");

    if (error) throw error;

    return data.map((item) => ({
      id: item.id,
      role: item.role,
      content: item.content,
      createdAt: item.created_at,
    }));
  },

  async createMessage(
    userId: string,
    role: AiMessage["role"],
    content: string,
  ): Promise<AiMessage> {
    const message: AiMessage = {
      id: crypto.randomUUID(),
      role,
      content,
      createdAt: new Date().toISOString(),
    };

    if (!isSupabaseConfigured) {
      const entries = await this.list(userId);
      localStorage.setItem(
        `mental-v2.ai.${userId}`,
        JSON.stringify([...entries, message]),
      );
      return message;
    }

    const { data, error } = await supabase!
      .from("ai_messages")
      .insert({ user_id: userId, role, content })
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      role: data.role,
      content: data.content,
      createdAt: data.created_at,
    };
  },
};
