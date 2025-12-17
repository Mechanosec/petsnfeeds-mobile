// Products Service
import { Product, ProductInStore } from "../types";
import { apiClient } from "./api";
import { Config } from "../constants/config";
import {
  mockProducts,
  mockProductsInStores,
} from "../mocks/data";

// Helper function to simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const productsService = {
  // Search products
  searchProducts: async (
    query: string,
    category?: string
  ): Promise<Product[]> => {
    if (Config.USE_MOCK_DATA) {
      await delay(Config.MOCK_API_DELAY);
      let results = mockProducts;
      
      if (query) {
        const lowerQuery = query.toLowerCase();
        results = results.filter(
          (p) =>
            p.name.toLowerCase().includes(lowerQuery) ||
            p.description.toLowerCase().includes(lowerQuery) ||
            p.brand.toLowerCase().includes(lowerQuery) ||
            p.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
        );
      }
      
      if (category) {
        results = results.filter((p) => p.category === category);
      }
      
      return results;
    }
    
    const response = await apiClient.get("/products/search", {
      params: { q: query, category },
    });
    return response.data;
  },

  // Get product details
  getProduct: async (productId: string): Promise<Product> => {
    if (Config.USE_MOCK_DATA) {
      await delay(Config.MOCK_API_DELAY);
      const product = mockProducts.find((p) => p.id === productId);
      if (!product) {
        throw new Error("Product not found");
      }
      return product;
    }
    
    const response = await apiClient.get(`/products/${productId}`);
    return response.data;
  },

  // Get stores that have this product
  getProductStores: async (
    productId: string,
    latitude?: number,
    longitude?: number
  ): Promise<ProductInStore[]> => {
    if (Config.USE_MOCK_DATA) {
      await delay(Config.MOCK_API_DELAY);
      const stores = mockProductsInStores[productId] || [];
      
      // Sort by distance if location provided
      if (latitude && longitude) {
        return [...stores].sort((a, b) => (a.store.distance || 0) - (b.store.distance || 0));
      }
      
      return stores;
    }
    
    const response = await apiClient.get(`/products/${productId}/stores`, {
      params: { lat: latitude, lng: longitude },
    });
    return response.data;
  },

  // Get popular products
  getPopularProducts: async (limit = 10): Promise<Product[]> => {
    if (Config.USE_MOCK_DATA) {
      await delay(Config.MOCK_API_DELAY);
      return mockProducts.slice(0, limit);
    }
    
    const response = await apiClient.get("/products/popular", {
      params: { limit },
    });
    return response.data;
  },

  // Get products by category
  getProductsByCategory: async (category: string): Promise<Product[]> => {
    if (Config.USE_MOCK_DATA) {
      await delay(Config.MOCK_API_DELAY);
      return mockProducts.filter((p) => p.category === category);
    }
    
    const response = await apiClient.get("/products/category", {
      params: { category },
    });
    return response.data;
  },
};
