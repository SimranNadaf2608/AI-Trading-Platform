import axios, { AxiosResponse } from 'axios';

// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ========================
// REQUEST INTERCEPTOR
// ========================
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ========================
// RESPONSE INTERCEPTOR
// ========================
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // 🔥 UPDATED: clear auth & redirect
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      window.location.href = '/signin'; // ⬅️ UPDATED (was /login)
    }
    return Promise.reject(error);
  }
);

// ========================
// TYPES
// ========================
export interface User {
  id: number;
  email: string;
  is_verified: boolean;
  created_at: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface OTPResponse {
  message: string;
  can_resend_after?: number;
  is_locked?: boolean;
  lockout_until?: string;
}

export interface VerifyResponse {
  message: string;
  success: boolean;
  user?: User;
  token?: string;
}

// ========================
// API FUNCTIONS
// ========================
export const authAPI = {
  sendOTP: async (signupData: {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    confirm_password: string;
  }): Promise<OTPResponse> => {
    const response: AxiosResponse<OTPResponse> =
      await api.post('/auth/send-otp', signupData);
    return response.data;
  },

  verifyOTP: async (email: string, otp: string): Promise<VerifyResponse> => {
    const response: AxiosResponse<VerifyResponse> =
      await api.post('/auth/verify-otp', { email, otp });
    return response.data;
  },

   // 🔥 NEW FUNCTION FOR FORGOT PASSWORD OTP
  verifyResetOTP: async (
    email: string,
    otp: string
  ): Promise<{ success: boolean; message: string }> => {
    const response = await api.post('/auth/verify-reset-otp', { email, otp });
    return response.data;
  },

  register: async (email: string, password: string): Promise<AuthResponse> => {
    const response: AxiosResponse<AuthResponse> =
      await api.post('/auth/register', null, { params: { email, password } });
    return response.data;
  },

  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response: AxiosResponse<AuthResponse> =
      await api.post('/auth/login', { email, password });
    return response.data;
  },

  sendPasswordResetOTP: async (email: string): Promise<OTPResponse> => {
    const response: AxiosResponse<OTPResponse> =
      await api.post('/auth/forgot-password', { email });
    return response.data;
  },

  resetPassword: async (
    email: string,
    otp: string,
    newPassword: string
  ): Promise<{ message: string }> => {
    const response: AxiosResponse<{ message: string }> =
      await api.post('/auth/reset-password', {
        email,
        otp,
        new_password: newPassword,
      });
    return response.data;
  },

  getCurrentUser: async (): Promise<User> => {
    const response: AxiosResponse<User> = await api.get('/auth/me');
    return response.data;
  },
};

// ========================
// AUTH UTILITIES
// ========================
export const authUtils = {
  // ✅ already used in login page
  setAuthData: (token: string, user: User) => {
    localStorage.setItem('access_token', token);
    localStorage.setItem('user', JSON.stringify(user));
  },

  // 🔥 NEW (explicit logout helper)
  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
  },

  clearAuthData: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
  },

  getStoredUser: (): User | null => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  getStoredToken: (): string | null => {
    return localStorage.getItem('access_token');
  },

  // 🔥 NEW (semantic helper for UI)
  isLoggedIn: (): boolean => {
    return !!localStorage.getItem('access_token');
  },

  // kept for backward compatibility
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('access_token');
  },

  formatLockoutTime: (lockoutUntil: string): string => {
    const lockoutDate = new Date(lockoutUntil);
    const now = new Date();
    const diffMs = lockoutDate.getTime() - now.getTime();
    const diffMins = Math.ceil(diffMs / 60000);

    if (diffMins <= 0) return 'Available now';
    if (diffMins === 1) return '1 minute';
    return `${diffMins} minutes`;
  },
};

export default api;
