// Orders Service
import { CartItem, Order } from "../types";
import { apiClient } from "./api";
import { Config } from "../constants/config";
import { mockOrders, mockStores, mockProducts } from "../mocks/data";

// Helper function to simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// In-memory storage for mock orders
let mockOrdersData = [...mockOrders];

export const ordersService = {
  // Create new order (reserve products)
  createOrder: async (
    items: CartItem[],
    storeId: string,
    pickupTime?: string
  ): Promise<Order> => {
    const response = await apiClient.post("/orders", {
      items: items.map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
        price: item.price,
      })),
      storeId,
      pickupTime,
    });
    return response.data;
  },

  // Get user's orders
  getUserOrders: async (status?: string): Promise<Order[]> => {
    if (Config.USE_MOCK_DATA) {
      await delay(Config.MOCK_API_DELAY);
      let orders = mockOrdersData;
      
      if (status) {
        orders = orders.filter((o) => o.status === status);
      }
      
      return orders.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }
    
    const response = await apiClient.get("/orders", {
      params: { status },
    });
    return response.data;
  },

  // Get order details
  getOrder: async (orderId: string): Promise<Order> => {
    if (Config.USE_MOCK_DATA) {
      await delay(Config.MOCK_API_DELAY);
      const order = mockOrdersData.find((o) => o.id === orderId);
      if (!order) {
        throw new Error("Order not found");
      }
      return order;
    }
    
    const response = await apiClient.get(`/orders/${orderId}`);
    return response.data;
  },

  // Cancel order
  cancelOrder: async (orderId: string): Promise<Order> => {
    if (Config.USE_MOCK_DATA) {
      await delay(Config.MOCK_API_DELAY);
      const orderIndex = mockOrdersData.findIndex((o) => o.id === orderId);
      if (orderIndex === -1) {
        throw new Error("Order not found");
      }
      
      mockOrdersData[orderIndex] = {
        ...mockOrdersData[orderIndex],
        status: "cancelled",
        updatedAt: new Date().toISOString(),
      };
      
      return mockOrdersData[orderIndex];
    }
    
    const response = await apiClient.post(`/orders/${orderId}/cancel`);
    return response.data;
  },

  // Get active orders (pending, reserved, ready)
  getActiveOrders: async (): Promise<Order[]> => {
    if (Config.USE_MOCK_DATA) {
      await delay(Config.MOCK_API_DELAY);
      return mockOrdersData
        .filter((o) => ["pending", "reserved", "ready"].includes(o.status))
        .sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    }
    
    const response = await apiClient.get("/orders/active");
    return response.data;
  },

  // Get order history (completed, cancelled)
  getOrderHistory: async (): Promise<Order[]> => {
    if (Config.USE_MOCK_DATA) {
      await delay(Config.MOCK_API_DELAY);
      return mockOrdersData
        .filter((o) => ["completed", "cancelled"].includes(o.status))
        .sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    }
    
    const response = await apiClient.get("/orders/history");
    return response.data;
  },
};
