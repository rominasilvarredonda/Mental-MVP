import type { LucideIcon, LucideProps } from "lucide-react";
import { Award, BadgeCheck, Bell, BookOpen, Bot, Brain, CalendarClock, Circle, ClipboardList, CloudLightning, CloudRain, GraduationCap, Handshake, Heart, HeartPulse, House, Lightbulb, MessageCircle, Presentation, Sparkles, Sprout, Star, TrendingUp, UserCircle, UserRoundCheck, Video, Wind } from "lucide-react";

const icons: Record<string, LucideIcon> = { award: Award, "badge-check": BadgeCheck, bell: Bell, "book-open": BookOpen, bot: Bot, brain: Brain, "calendar-clock": CalendarClock, circle: Circle, "clipboard-list": ClipboardList, "cloud-lightning": CloudLightning, "cloud-rain": CloudRain, "graduation-cap": GraduationCap, handshake: Handshake, heart: Heart, "heart-pulse": HeartPulse, house: House, lightbulb: Lightbulb, "message-circle": MessageCircle, presentation: Presentation, sparkles: Sparkles, sprout: Sprout, star: Star, "trending-up": TrendingUp, "user-circle": UserCircle, "user-round-check": UserRoundCheck, video: Video, wind: Wind };

export type IconName = keyof typeof icons;
export function Icon({ name, ...props }: LucideProps & { name: IconName }) { const Glyph = icons[name]; return <Glyph aria-hidden="true" strokeWidth={1.8} {...props} />; }
