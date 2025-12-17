// Authentication Service
import { User } from "../types";
import { apiClient } from "./api";
import { Config } from "../constants/config";
import { mockUser } from "../mocks/data";

// Helper function to simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

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
    if (Config.USE_MOCK_DATA) {
      await delay(Config.MOCK_API_DELAY);
      return mockUser;
    }
    
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
