import { isSupabaseConfigured, supabase } from "@/lib/supabase/client";
import type { Seminar, SeminarReservation } from "@/types/seminar";

const seminars: Seminar[] = [
  { id: "anxiety", title: "Manejo de la ansiedad", schedule: "Martes · 19:00", capacity: 12 },
  { id: "communication", title: "Comunicación efectiva", schedule: "Jueves · 18:30", capacity: 9 },
  { id: "emotional-intelligence", title: "Inteligencia emocional", schedule: "Sábado · 11:00", capacity: 16 },
];

export const seminarService = {
  list(): Seminar[] { return seminars; },
  async listReservations(userId: string): Promise<SeminarReservation[]> {
    if (!isSupabaseConfigured) {
      try { return JSON.parse(localStorage.getItem(`mental-v2.seminars.${userId}`) ?? "[]") as SeminarReservation[]; } catch { return []; }
    }
    const { data, error } = await supabase!.from("seminar_reservations").select("seminar_id,reserved_at").eq("user_id", userId);
    if (error) throw error;
    return data.map((item) => ({ seminarId: item.seminar_id, reservedAt: item.reserved_at }));
  },
  async reserve(userId: string, seminarId: string): Promise<SeminarReservation> {
    const reservation = { seminarId, reservedAt: new Date().toISOString() };
    if (!isSupabaseConfigured) {
      const existing = await this.listReservations(userId);
      localStorage.setItem(`mental-v2.seminars.${userId}`, JSON.stringify([...existing.filter((item) => item.seminarId !== seminarId), reservation]));
      return reservation;
    }
    const { error } = await supabase!.from("seminar_reservations").upsert({ user_id: userId, seminar_id: seminarId });
    if (error) throw error;
    return reservation;
  },
  async cancel(userId: string, seminarId: string): Promise<boolean> {
    if (!isSupabaseConfigured) {
      const existing = await this.listReservations(userId);
      localStorage.setItem(`mental-v2.seminars.${userId}`, JSON.stringify(existing.filter((item) => item.seminarId !== seminarId)));
      return true;
    }
    const { error } = await supabase!.from("seminar_reservations").delete().eq("user_id", userId).eq("seminar_id", seminarId);
    if (error) throw error;
    return true;
  },
};
