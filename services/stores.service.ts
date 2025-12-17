// Stores Service
import { Store } from "../types";
import { apiClient } from "./api";
import { Config } from "../constants/config";
import { mockStores } from "../mocks/data";

// Helper function to simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const storesService = {
  // Get all stores
  getAllStores: async (): Promise<Store[]> => {
    if (Config.USE_MOCK_DATA) {
      await delay(Config.MOCK_API_DELAY);
      return mockStores;
    }
    
    const response = await apiClient.get("/stores");
    return response.data;
  },

  // Get store details
  getStore: async (storeId: string): Promise<Store> => {
    if (Config.USE_MOCK_DATA) {
      await delay(Config.MOCK_API_DELAY);
      const store = mockStores.find((s) => s.id === storeId);
      if (!store) {
        throw new Error("Store not found");
      }
      return store;
    }
    
    const response = await apiClient.get(`/stores/${storeId}`);
    return response.data;
  },

  // Get nearby stores
  getNearbyStores: async (
    latitude: number,
    longitude: number,
    radius = 10
  ): Promise<Store[]> => {
    if (Config.USE_MOCK_DATA) {
      await delay(Config.MOCK_API_DELAY);
      // In mock mode, just return all stores sorted by distance
      return [...mockStores].sort((a, b) => (a.distance || 0) - (b.distance || 0));
    }
    
    const response = await apiClient.get("/stores/nearby", {
      params: { lat: latitude, lng: longitude, radius },
    });
    return response.data;
  },
};
