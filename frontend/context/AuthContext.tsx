"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthApiClient } from '@/services/AuthApiClient';
import { AuthResponse } from '@/models/responses/AuthResponse';

interface AuthContextType {
  isAuthenticated: boolean;
  user: AuthResponse['user'] | null;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string, firstName?: string, lastName?: string) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<AuthResponse['user'] | null>(null);
  const [loading, setLoading] = useState(true);
  const authClient = new AuthApiClient();

  // Check authentication status on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = authClient.getAccessToken();
        if (token) {
          // Validate token by checking expiration
          const tokenData = parseJwt(token);
          if (tokenData && tokenData.exp * 1000 > Date.now()) {
            setIsAuthenticated(true);
            // You could fetch user details here
            setUser({
              id: Number(tokenData.userId) || 0,
              username: String(tokenData.unique_name) || '',
              email: String(tokenData.email) || '',
            });
          } else {
            // Token expired, try to refresh
            await handleTokenRefresh();
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        authClient.logout();
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // Set up automatic token refresh
  useEffect(() => {
    if (!isAuthenticated) return;

    const checkAndRefreshToken = async () => {
      const token = authClient.getAccessToken();
      if (token) {
        const tokenData = parseJwt(token);
        if (tokenData) {
          // Refresh token 5 minutes before expiry
          const expirationTime = tokenData.exp * 1000;
          const refreshTime = expirationTime - Date.now() - 5 * 60 * 1000;
          
          if (refreshTime > 0) {
            setTimeout(async () => {
              try {
                await handleTokenRefresh();
              } catch (error) {
                console.error('Auto token refresh failed:', error);
                logout();
              }
            }, refreshTime);
          }
        }
      }
    };

    checkAndRefreshToken();
    
    // Check every minute
    const interval = setInterval(checkAndRefreshToken, 60 * 1000);
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  interface JwtPayload {
    exp: number;
    email?: string;
    [key: string]: unknown;
  }

  const parseJwt = (token: string): JwtPayload | null => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      return null;
    }
  };

  const handleTokenRefresh = async () => {
    const refreshToken = authClient.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await authClient.refreshToken(refreshToken);
    setIsAuthenticated(true);
    setUser(response.user);
  };

  const login = async (username: string, password: string) => {
    setLoading(true);
    try {
      const response = await authClient.login({ username, password });
      setIsAuthenticated(true);
      setUser(response.user);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message || 'Login failed');
      } else {
        throw new Error('Login failed');
      }
    } finally {
      setLoading(false);
    }
  };

  const register = async (
    username: string,
    email: string,
    password: string,
    firstName?: string,
    lastName?: string
  ) => {
    setLoading(true);
    try {
      const response = await authClient.register({
        username,
        email,
        password,
        firstName,
        lastName,
      });
      setIsAuthenticated(true);
      setUser(response.user);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message || 'Registration failed');
      } else {
        throw new Error('Registration failed');
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authClient.logout();
    setIsAuthenticated(false);
    setUser(null);
  };

  const refreshToken = async () => {
    await handleTokenRefresh();
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        login,
        register,
        logout,
        refreshToken,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

