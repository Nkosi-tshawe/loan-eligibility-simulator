import { RegisterRequest, LoginRequest, RefreshTokenRequest } from "@/models/requests";
import { AuthResponse } from "@/models/responses/AuthResponse";

export class AuthApiClient {
    private baseUrl = 'http://localhost:5000/api/auth'; // API Gateway
  
    async register(request: RegisterRequest): Promise<AuthResponse> {
      const response = await fetch(`${this.baseUrl}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });
  
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to register');
      }
  
      return response.json();
    }
  
    async login(request: LoginRequest): Promise<AuthResponse> {
      const response = await fetch(`${this.baseUrl}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });
  
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to login');
      }
  
      const data = await response.json();
      // Store tokens
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      return data;
    }
  
    async refreshToken(refreshToken: string): Promise<AuthResponse> {
      const response = await fetch(`${this.baseUrl}/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to refresh token');
      }
  
      const data = await response.json();
      // Update stored tokens
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      return data;
    }
  
    logout(): void {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
  
    getAccessToken(): string | null {
      return localStorage.getItem('accessToken');
    }
  
    getRefreshToken(): string | null {
      return localStorage.getItem('refreshToken');
    }
  
    isAuthenticated(): boolean {
      return !!this.getAccessToken();
    }
  }