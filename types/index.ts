// Core types for Pets&Feed app

export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  imageUrl: string;
  brand: string;
  unit: string; // e.g., "kg", "piece", "ml"
  tags: string[];
}

export interface Store {
  id: string;
  name: string;
  address: string;
  phone: string;
  latitude: number;
  longitude: number;
  workingHours: string;
  rating?: number;
  distance?: number; // in km
}

export interface ProductInStore {
  productId: string;
  storeId: string;
  price: number;
  availability: "in_stock" | "low_stock" | "out_of_stock";
  quantity: number;
  store: Store;
}

export interface Order {
  id: string;
  userId: string;
  status: "pending" | "reserved" | "ready" | "completed" | "cancelled";
  items: OrderItem[];
  totalAmount: number;
  store: Store;
  createdAt: string;
  updatedAt: string;
  pickupTime?: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
  price: number;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  avatarUrl?: string;
  location?: {
    latitude: number;
    longitude: number;
  };
}

export interface CartItem {
  product: Product;
  storeId: string;
  quantity: number;
  price: number;
}
