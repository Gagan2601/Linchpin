// services/auth.ts
import { apiClient } from "@/lib/api";

export interface User {
  _id: string;
  name: string;
  email: string;
  username: string;
  aboutMe?: string;
  designation?: string;
  savedAIs?: string[];
  isEmailVerified: boolean;
  role: "user" | "admin";
  emailVerificationToken?: string;
  emailVerificationTokenExpires?: Date;
  passwordResetToken?: string;
  passwordResetTokenExpires?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface SignupPayload {
  name: string;
  email: string;
  username: string;
  password: string;
}

interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthResponse {
  data?: object; // Make data flexible to handle different response structures
  message?: string;
  status?: number;
  error?: string;
}

export interface LoginResponse {
  data?: {
    user: User;
    accessToken?: string;
    refreshToken?: string;
  };
  status?: number;
  error?: string;
}

export interface SignupResponse {
  data?: {
    message: string;
  };
  message?: string;
  status?: number;
  error?: string;
}

export interface VerifyEmailResponse {
  data?: {
    message: string;
  };
  message?: string;
  status?: number;
  error?: string;
}

export interface CheckAuthResponse {
  data?: User;
  status?: number;
  error?: string;
}

export const authService = {
  async signup(payload: SignupPayload): Promise<SignupResponse> {
    return apiClient<{ message: string }>("/auth/signup", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  async login(payload: LoginPayload): Promise<LoginResponse> {
    return apiClient<{ user: User }>("/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  async verifyEmail(token: string): Promise<VerifyEmailResponse> {
    return apiClient<{ message: string }>(`/auth/verify-email/${token}`, {
      method: "GET",
    });
  },

  async checkAuth(): Promise<CheckAuthResponse> {
    return apiClient<User>("/auth/me", {
      method: "GET",
      credentials: "include",
    });
  },

  async logout(): Promise<{ message?: string; error?: string }> {
    return apiClient<{ message: string }>("/auth/logout", {
      method: "POST",
      credentials: "include",
    });
  },

  async refreshToken(): Promise<{ message?: string; error?: string }> {
    return apiClient<{ message: string }>("/auth/refresh", {
      method: "POST",
      credentials: "include",
    });
  },
};
