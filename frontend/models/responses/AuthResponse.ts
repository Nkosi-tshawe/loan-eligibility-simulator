export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    expiresAt: string;
    user: {
      id: number;
      username: string;
      email: string;
      firstName?: string;
      lastName?: string;
    };
  }