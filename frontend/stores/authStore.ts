import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { AuthApiClient } from '@/services/AuthApiClient';
import { AuthResponse } from '@/models/responses/AuthResponse';
import { parseJwt, getTokenExpiration, isTokenExpired } from '@/lib/jwt';

interface AuthState {
  // State
  isAuthenticated: boolean;
  user: AuthResponse['user'] | null;
  loading: boolean;
  isEmailVerified: boolean;
  registrationSuccess: boolean;
  registeredEmail: string;

  // Actions
  initAuth: () => Promise<void>;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string, firstName?: string, lastName?: string) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
  verifyEmail: (token: string) => Promise<void>;
  resendVerificationEmail: (email: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, newPassword: string, confirmPassword: string) => Promise<void>;
  setLoading: (loading: boolean) => void;
}

// Store refresh interval and timeout references outside the store to prevent memory leaks
let refreshInterval: NodeJS.Timeout | null = null;
let refreshTimeout: NodeJS.Timeout | null = null;
let isRefreshing = false; // Prevent concurrent refresh attempts

export const useAuthStore = create<AuthState>()(
  devtools(
    (set, get) => {
  const authClient = new AuthApiClient();

  const handleTokenRefresh = async () => {
    // Prevent concurrent refresh attempts
    if (isRefreshing) {
      return;
    }

    isRefreshing = true;
    try {
      const refreshToken = authClient.getRefreshToken();
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await authClient.refreshToken(refreshToken);
      set({
        isAuthenticated: true,
        user: response.user,
        loading: false,
      });
    } finally {
      isRefreshing = false;
    }
  };

  // Clean up all refresh timers
  const cleanupRefreshTimers = () => {
    if (refreshInterval) {
      clearInterval(refreshInterval);
      refreshInterval = null;
    }
    if (refreshTimeout) {
      clearTimeout(refreshTimeout);
      refreshTimeout = null;
    }
  };

  // Set up automatic token refresh
  const setupAutoRefresh = () => {
    cleanupRefreshTimers();

    const checkAndRefreshToken = async () => {
      const { isAuthenticated } = get();
      if (!isAuthenticated || isRefreshing) {
        return;
      }

      const token = authClient.getAccessToken();
      if (!token) {
        return;
      }

      // Check if token is expired
      if (isTokenExpired(token)) {
        // Token expired, refresh immediately
        try {
          await handleTokenRefresh();
        } catch {
          // Refresh failed, logout user
          get().logout();
        }
        return;
      }

      // Calculate when to refresh (5 minutes before expiration)
      const expirationTime = getTokenExpiration(token);
      if (!expirationTime) {
        return;
      }

      const refreshTime = expirationTime - Date.now() - 5 * 60 * 1000;
      
      if (refreshTime > 0) {
        // Schedule refresh before expiration
        refreshTimeout = setTimeout(async () => {
          try {
            await handleTokenRefresh();
          } catch {
            // Refresh failed, logout user
            get().logout();
          }
        }, refreshTime);
      } else {
        // Token is about to expire, refresh immediately
        try {
          await handleTokenRefresh();
        } catch {
          // Refresh failed, logout user
          get().logout();
        }
      }
    };

    // Check immediately and then every minute
    checkAndRefreshToken();
    refreshInterval = setInterval(checkAndRefreshToken, 60 * 1000);
  };

  // Track if initialization has started
  let initStarted = false;

  // Check token synchronously to set initial loading state
  let initialLoading = true;
  let initialIsAuthenticated = false;
  let initialUser: AuthResponse['user'] | null = null;

  if (typeof window !== 'undefined') {
    const token = authClient.getAccessToken();
    if (token && !isTokenExpired(token)) {
      // Valid token found, set initial state
      const tokenData = parseJwt(token);
      if (tokenData) {
        initialIsAuthenticated = true;
        initialUser = {
          id: Number(tokenData.userId) || 0,
          username: String(tokenData.unique_name) || '',
          email: String(tokenData.email) || '',
          firstName: String(tokenData.firstName) || '',
          lastName: String(tokenData.lastName) || '',
        };
        initialLoading = false;
      } else {
        // Invalid token format
        initialLoading = false;
      }
    } else if (token) {
      // Token expired, will need to refresh
      initialLoading = true;
    } else {
      // No token, not loading
      initialLoading = false;
    }
  }

  // Initialize auth state
  const initAuth = async () => {
    // Prevent multiple initializations
    if (initStarted) {
      return;
    }
    initStarted = true;

    const currentState = get();
    // If already authenticated from sync check, just setup refresh
    if (currentState.isAuthenticated && currentState.user) {
      setupAutoRefresh();
      return;
    }

    set({ loading: true });
    try {
      const token = authClient.getAccessToken();
      if (token && !isTokenExpired(token)) {
        const tokenData = parseJwt(token);
        if (tokenData) {
          set({
            isAuthenticated: true,
            user: {
              id: Number(tokenData.userId) || 0,
              username: String(tokenData.unique_name) || '',
              email: String(tokenData.email) || '',
              firstName: String(tokenData.firstName) || '',
              lastName: String(tokenData.lastName) || '',
            },
            loading: false,
          });
          setupAutoRefresh();
        } else {
          // Invalid token format
          authClient.logout();
          set({ isAuthenticated: false, user: null, loading: false });
        }
      } else if (token) {
        // Token expired, try to refresh
        try {
          await handleTokenRefresh();
          setupAutoRefresh();
        } catch {
          // Refresh failed, clear auth state
          authClient.logout();
          set({ isAuthenticated: false, user: null, loading: false });
        }
      } else {
        set({ loading: false });
      }
    } catch {
      // Auth initialization error - clear state
      authClient.logout();
      set({ isAuthenticated: false, user: null, loading: false });
    }
  };

  // Initialize if needed (for token refresh case)
  if (typeof window !== 'undefined' && initialLoading) {
    setTimeout(() => {
      initAuth();
    }, 0);
  } else if (typeof window !== 'undefined' && initialIsAuthenticated) {
    // Setup auto refresh for valid token
    setTimeout(() => {
      setupAutoRefresh();
    }, 0);
  }

  return {
    // Initial state
    isAuthenticated: initialIsAuthenticated,
    user: initialUser,
    loading: initialLoading,
    isEmailVerified: false,
    registrationSuccess: false,
    registeredEmail: '',

    // Actions
    initAuth,
    setLoading: (loading: boolean) => set({ loading }),

    login: async (username: string, password: string) => {
      set({ loading: true });
      try {
        const response = await authClient.login({ username, password });
        set({
          isAuthenticated: true,
          user: response.user,
          loading: false,
        });
        setupAutoRefresh();
      } catch (error) {
        set({ loading: false });
        if (error instanceof Error) {
          throw new Error(error.message || 'Login failed');
        } else {
          throw new Error('Login failed');
        }
      }
    },

    register: async (
      username: string,
      email: string,
      password: string,
      firstName?: string,
      lastName?: string
    ) => {
      set({ loading: true });
      try {
        const response = await authClient.register({
          username,
          email,
          password,
          firstName,
          lastName,
        });
        set({
          isAuthenticated: false,
          registrationSuccess: true,
          isEmailVerified: false,
          user: response.user,
          registeredEmail: email,
          loading: false,
        });
      } catch (error) {
        set({ loading: false });
        if (error instanceof Error) {
          throw new Error(error.message || 'Registration failed');
        } else {
          throw new Error('Registration failed');
        }
      }
    },

    logout: () => {
      cleanupRefreshTimers();
      authClient.logout();
      set({
        isAuthenticated: false,
        user: null,
        registrationSuccess: false,
        registeredEmail: '',
        loading: false,
      });
    },

    refreshToken: async () => {
      await handleTokenRefresh();
      setupAutoRefresh();
    },

    verifyEmail: async (token: string) => {
      set({ loading: true });
      try {
        await authClient.verifyEmail({ token });
        set({ isEmailVerified: true, loading: false });
      } catch (error) {
        set({ loading: false });
        if (error instanceof Error) {
          throw new Error(error.message || 'Email verification failed');
        } else {
          throw new Error('Email verification failed');
        }
      }
    },

    resendVerificationEmail: async (email: string) => {
      set({ loading: true });
      try {
        await authClient.resendVerificationEmail({ email });
        set({ loading: false });
      } catch (error) {
        set({ loading: false });
        if (error instanceof Error) {
          throw new Error(error.message || 'Failed to resend verification email');
        } else {
          throw new Error('Failed to resend verification email');
        }
      }
    },

    forgotPassword: async (email: string) => {
      set({ loading: true });
      try {
        await authClient.forgotPassword({ email });
        set({ loading: false });
      } catch (error) {
        set({ loading: false });
        if (error instanceof Error) {
          throw new Error(error.message || 'Failed to send password reset email');
        } else {
          throw new Error('Failed to send password reset email');
        }
      }
    },

    resetPassword: async (token: string, newPassword: string, confirmPassword: string) => {
      if (newPassword !== confirmPassword) {
        throw new Error('Passwords do not match');
      }
      set({ loading: true });
      try {
        await authClient.resetPassword({ token, newPassword, confirmPassword });
        // If user was authenticated, logout after password reset
        if (authClient.isAuthenticated()) {
          cleanupRefreshTimers();
          authClient.logout();
          set({ 
            isAuthenticated: false, 
            user: null,
            loading: false 
          });
        } else {
          set({ loading: false });
        }
      } catch (error) {
        set({ loading: false });
        if (error instanceof Error) {
          throw new Error(error.message || 'Failed to reset password');
        } else {
          throw new Error('Failed to reset password');
        }
      }
    },
  };
    },
    { name: 'AuthStore' }
  )
);

