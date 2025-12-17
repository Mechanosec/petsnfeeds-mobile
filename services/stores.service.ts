// Stores Service
import { Store } from "../types";
import { apiClient } from "./api";

export const storesService = {
  // Get all stores
  getAllStores: async (): Promise<Store[]> => {
    const response = await apiClient.get("/stores");
    return response.data;
  },

  // Get store details
  getStore: async (storeId: string): Promise<Store> => {
    const response = await apiClient.get(`/stores/${storeId}`);
    return response.data;
  },

  // Get nearby stores
  getNearbyStores: async (
    latitude: number,
    longitude: number,
    radius = 10
  ): Promise<Store[]> => {
    const response = await apiClient.get("/stores/nearby", {
      params: { lat: latitude, lng: longitude, radius },
    });
    return response.data;
  },
};
