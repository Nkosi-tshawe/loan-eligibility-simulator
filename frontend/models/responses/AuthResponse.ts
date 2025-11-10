import { IUser } from "@/models/User";
export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    expiresAt: string;
        user: IUser;
  }