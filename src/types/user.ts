export interface UserInterface {
  id: number;
  email: string;
  name: string;
  phone?: string;
  avatar?: string;
  provider: "local" | "google" | "facebook";
  externalId?: string;
  status: "active" | "inactive" | "blocked";
  createdAt: string;
}
