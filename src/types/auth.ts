export type Role = "user" | "admin" | "therapist";

export type AuthUser = {
  id: string;
  email: string;
  role: Role;
};
