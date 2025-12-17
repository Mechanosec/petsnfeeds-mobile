// Orders Service
import { CartItem, Order } from "../types";
import { apiClient } from "./api";

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
    const response = await apiClient.get("/orders", {
      params: { status },
    });
    return response.data;
  },

  // Get order details
  getOrder: async (orderId: string): Promise<Order> => {
    const response = await apiClient.get(`/orders/${orderId}`);
    return response.data;
  },

  // Cancel order
  cancelOrder: async (orderId: string): Promise<Order> => {
    const response = await apiClient.post(`/orders/${orderId}/cancel`);
    return response.data;
  },

  // Get active orders (pending, reserved, ready)
  getActiveOrders: async (): Promise<Order[]> => {
    const response = await apiClient.get("/orders/active");
    return response.data;
  },

  // Get order history (completed, cancelled)
  getOrderHistory: async (): Promise<Order[]> => {
    const response = await apiClient.get("/orders/history");
    return response.data;
  },
};
