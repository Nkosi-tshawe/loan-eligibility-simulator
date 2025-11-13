import { RegisterRequest, LoginRequest, VerifyEmailRequest, ResendVerificationRequest, ForgotPasswordRequest, ResetPasswordRequest } from "@/models/requests";
import { AuthResponse } from "@/models/responses/AuthResponse";
import { VerifyEmailResponse, ResendVerificationResponse, ForgotPasswordResponse, ResetPasswordResponse } from "@/models/responses";
import { IUser } from "@/models/User";

export class AuthApiClient {
    private baseUrl = process.env.NEXT_PUBLIC_API_URL ; // API Gateway
  
    async register(request: RegisterRequest): Promise<AuthResponse> {
      const response = await fetch(`${this.baseUrl}/auth/register`, {
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
      const response = await fetch(`${this.baseUrl}/auth/login`, {
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

    async getCurrentUser(): Promise<IUser> {
      const response = await fetch(`${this.baseUrl}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${this.getAccessToken()}`
        }
      });
      if (!response.ok) {
        throw new Error('Failed to get current user');
      }
      return response.json();
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

    async verifyEmail(request: VerifyEmailRequest): Promise<VerifyEmailResponse> {
      const response = await fetch(`${this.baseUrl}/auth/verify-email?token=${encodeURIComponent(request.token)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to verify email');
      }

      return response.json();
    }

    async resendVerificationEmail(request: ResendVerificationRequest): Promise<ResendVerificationResponse> {
      const response = await fetch(`${this.baseUrl}/auth/resend-verification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to resend verification email');
      }

      return response.json();
    }

    async forgotPassword(request: ForgotPasswordRequest): Promise<ForgotPasswordResponse> {
      const response = await fetch(`${this.baseUrl}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to send password reset email');
      }

      return response.json();
    }

    async resetPassword(request: ResetPasswordRequest): Promise<ResetPasswordResponse> {
      const response = await fetch(`${this.baseUrl}/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: request.token,
          newPassword: request.newPassword,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to reset password');
      }

      return response.json();
    }
  }