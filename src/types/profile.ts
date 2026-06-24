import type { Role } from "@/types/auth";

export type UserProfile = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
  avatarUrl?: string | null;
  age?: number | null;
  phone?: string | null;
  address?: string | null;
};
