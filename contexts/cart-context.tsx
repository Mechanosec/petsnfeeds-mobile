// Cart Context - Global state for shopping cart
import React, { createContext, ReactNode, useContext, useState } from "react";
import { CartItem, Product, ProductInStore } from "../types";

interface CartContextType {
  items: CartItem[];
  addToCart: (
    product: Product,
    store: ProductInStore,
    quantity: number
  ) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  getItemsByStore: () => Map<string, CartItem[]>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addToCart = (
    product: Product,
    store: ProductInStore,
    quantity: number
  ) => {
    setItems((prevItems) => {
      // Check if item from this store already exists
      const existingItemIndex = prevItems.findIndex(
        (item) =>
          item.productId === product.id && item.storeId === store.storeId
      );

      if (existingItemIndex > -1) {
        // Update quantity if exists
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + quantity,
        };
        return updatedItems;
      } else {
        // Add new item
        const newItem: CartItem = {
          id: `${product.id}-${store.storeId}-${Date.now()}`,
          productId: product.id,
          productName: product.name,
          productBrand: product.brand,
          productImage: product.imageUrl,
          storeId: store.storeId,
          storeName: store.storeName,
          price: store.price,
          quantity,
          availability: store.availability,
        };
        return [...prevItems, newItem];
      }
    });
  };

  const removeFromCart = (itemId: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getItemsByStore = () => {
    const itemsByStore = new Map<string, CartItem[]>();
    items.forEach((item) => {
      const storeItems = itemsByStore.get(item.storeId) || [];
      storeItems.push(item);
      itemsByStore.set(item.storeId, storeItems);
    });
    return itemsByStore;
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalItems,
        getTotalPrice,
        getItemsByStore,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
