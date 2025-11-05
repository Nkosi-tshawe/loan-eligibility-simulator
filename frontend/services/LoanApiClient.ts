import {
    EligibilityRequest,
    EligibilityResponse,
    LoanProduct,
    CalculateRateRequest,
    CalculateRateResponse,
    ValidationRulesResponse,
  } from '@/models/index';
  import { AuthApiClient } from '@/services/AuthApiClient';
  
  /**
   * Model Layer - API Client
   * Handles all API interactions with the backend
   * Includes automatic token refresh on 401 errors
   */
  export class LoanApiClient {
    private baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/loans'; // API Gateway
    private authClient = new AuthApiClient();
    
    private async getAuthHeaders(): Promise<HeadersInit> {
      const token = this.authClient.getAccessToken();
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      return headers;
    }
  
    private async handleResponse<T>(response: Response): Promise<T> {
      if (response.status === 401) {
        // Token expired, try to refresh
        const refreshToken = this.authClient.getRefreshToken();
        if (refreshToken) {
          try {
            await this.authClient.refreshToken(refreshToken);
            // Retry the original request
            const token = this.authClient.getAccessToken();
            if (token) {
              // This won't work for fetch, but we'll throw an error to trigger retry in caller
              throw new Error('TOKEN_REFRESHED');
            }
          } catch (error) {
            // Refresh failed, logout user
            this.authClient.logout();
            window.location.reload();
            throw new Error('Session expired. Please login again.');
          }
        } else {
          this.authClient.logout();
          window.location.reload();
          throw new Error('Session expired. Please login again.');
        }
      }
  
      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Request failed' }));
        throw new Error(error.error || `Request failed with status ${response.status}`);
      }
  
      return response.json();
    }
  
    async checkEligibility(request: EligibilityRequest): Promise<EligibilityResponse> {
      try {
        const headers = await this.getAuthHeaders();
        const response = await fetch(`${this.baseUrl}/eligibility`, {
          method: 'POST',
          headers,
          body: JSON.stringify(request),
        });
  
        return await this.handleResponse<EligibilityResponse>(response);
      } catch (error: unknown) {
        if (error instanceof Error && error.message === 'TOKEN_REFRESHED') {
          // Retry with new token
          const headers = await this.getAuthHeaders();
          const response = await fetch(`${this.baseUrl}/eligibility`, {
            method: 'POST',
            headers,
            body: JSON.stringify(request),
          });
          return await this.handleResponse<EligibilityResponse>(response);
        }
        throw error;
      }
    }
  
    async getProducts(): Promise<LoanProduct[]> {
      try {
        const headers = await this.getAuthHeaders();
        const response = await fetch(`${this.baseUrl}/products`, {
          headers,
        });
  
        const data = await this.handleResponse<{ products: LoanProduct[] }>(response);
        return data.products;
      } catch (error: unknown) {
        if (error instanceof Error && error.message === 'TOKEN_REFRESHED') {
          const headers = await this.getAuthHeaders();
          const response = await fetch(`${this.baseUrl}/products`, {
            headers,
          });
          const data = await this.handleResponse<{ products: LoanProduct[] }>(response);
          return data.products;
        }
        throw error;
      }
    }
  
    async calculateRate(request: CalculateRateRequest): Promise<CalculateRateResponse> {
      try {
        const headers = await this.getAuthHeaders();
        const response = await fetch(`${this.baseUrl}/calculate-rate`, {
          method: 'POST',
          headers,
          body: JSON.stringify(request),
        });
  
        return await this.handleResponse<CalculateRateResponse>(response);
      } catch (error: unknown) {
        if (error instanceof Error && error.message === 'TOKEN_REFRESHED') {
          const headers = await this.getAuthHeaders();
          const response = await fetch(`${this.baseUrl}/calculate-rate`, {
            method: 'POST',
            headers,
            body: JSON.stringify(request),
          });
          return await this.handleResponse<CalculateRateResponse>(response);
        }
        throw error;
      }
    }
  
    async getValidationRules(): Promise<ValidationRulesResponse> {
      // This endpoint is public, no auth needed
      const response = await fetch(`${this.baseUrl}/validation-rules`);
  
      if (!response.ok) {
        throw new Error('Failed to fetch validation rules');
      }
  
      return response.json();
    }
  }
  
  