// Products Service
import { Product, ProductInStore } from "../types";
import { apiClient } from "./api";

export const productsService = {
  // Search products
  searchProducts: async (
    query: string,
    category?: string
  ): Promise<Product[]> => {
    const response = await apiClient.get("/products/search", {
      params: { q: query, category },
    });
    return response.data;
  },

  // Get product details
  getProduct: async (productId: string): Promise<Product> => {
    const response = await apiClient.get(`/products/${productId}`);
    return response.data;
  },

  // Get stores that have this product
  getProductStores: async (
    productId: string,
    latitude?: number,
    longitude?: number
  ): Promise<ProductInStore[]> => {
    const response = await apiClient.get(`/products/${productId}/stores`, {
      params: { lat: latitude, lng: longitude },
    });
    return response.data;
  },

  // Get popular products
  getPopularProducts: async (limit = 10): Promise<Product[]> => {
    const response = await apiClient.get("/products/popular", {
      params: { limit },
    });
    return response.data;
  },

  // Get products by category
  getProductsByCategory: async (category: string): Promise<Product[]> => {
    const response = await apiClient.get("/products/category", {
      params: { category },
    });
    return response.data;
  },
};
