// Authentication Service
import { User } from "../types";
import { apiClient } from "./api";

export const authService = {
  // Login
  login: async (
    email: string,
    password: string
  ): Promise<{ user: User; token: string }> => {
    const response = await apiClient.post("/auth/login", { email, password });
    return response.data;
  },

  // Register
  register: async (data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone: string;
  }): Promise<{ user: User; token: string }> => {
    const response = await apiClient.post("/auth/register", data);
    return response.data;
  },

  // Get current user
  getCurrentUser: async (): Promise<User> => {
    const response = await apiClient.get("/auth/me");
    return response.data;
  },

  // Update user profile
  updateProfile: async (data: Partial<User>): Promise<User> => {
    const response = await apiClient.put("/auth/profile", data);
    return response.data;
  },

  // Logout
  logout: async (): Promise<void> => {
    await apiClient.post("/auth/logout");
  },
};
