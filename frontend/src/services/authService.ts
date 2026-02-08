import axios, { AxiosResponse } from 'axios';

// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8001';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Types
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

// API Functions
export const authAPI = {
  // Send OTP for registration
  sendOTP: async (signupData: {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    confirm_password: string;
  }): Promise<OTPResponse> => {
    const response: AxiosResponse<OTPResponse> = await api.post('/auth/send-otp', signupData);
    return response.data;
  },

  // Verify OTP
  verifyOTP: async (email: string, otp: string): Promise<VerifyResponse> => {
    const response: AxiosResponse<VerifyResponse> = await api.post('/auth/verify-otp', { email, otp });
    return response.data;
  },

  // Complete registration
  register: async (email: string, password: string): Promise<AuthResponse> => {
    const response: AxiosResponse<AuthResponse> = await api.post('/auth/register', null, {
      params: { email, password }
    });
    return response.data;
  },

  // Login
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response: AxiosResponse<AuthResponse> = await api.post('/auth/login', { email, password });
    return response.data;
  },

  // Send OTP for password reset
  sendPasswordResetOTP: async (email: string): Promise<OTPResponse> => {
    const response: AxiosResponse<OTPResponse> = await api.post('/auth/forgot-password', { email });
    return response.data;
  },

  // Reset password with OTP
  resetPassword: async (email: string, otp: string, newPassword: string): Promise<{ message: string }> => {
    const response: AxiosResponse<{ message: string }> = await api.post('/auth/reset-password', {
      email,
      otp,
      new_password: newPassword
    });
    return response.data;
  },

  // Get current user
  getCurrentUser: async (): Promise<User> => {
    const response: AxiosResponse<User> = await api.get('/auth/me');
    return response.data;
  },
};

// Auth utilities
export const authUtils = {
  // Store auth data
  setAuthData: (token: string, user: User) => {
    localStorage.setItem('access_token', token);
    localStorage.setItem('user', JSON.stringify(user));
  },

  // Clear auth data
  clearAuthData: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
  },

  // Get stored user
  getStoredUser: (): User | null => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Get stored token
  getStoredToken: (): string | null => {
    return localStorage.getItem('access_token');
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('access_token');
  },

  // Format lockout time
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
