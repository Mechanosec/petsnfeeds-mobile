// Store List Item Component
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ProductInStore } from "../types";

interface StoreListItemProps {
  productInStore: ProductInStore;
  onPress: (storeId: string) => void;
  onMapPress: (storeId: string) => void;
}

export function StoreListItem({
  productInStore,
  onPress,
  onMapPress,
}: StoreListItemProps) {
  const { store, price, availability } = productInStore;

  const getAvailabilityColor = () => {
    switch (availability) {
      case "in_stock":
        return "#4caf50";
      case "low_stock":
        return "#ff9800";
      case "out_of_stock":
        return "#f44336";
      default:
        return "#999";
    }
  };

  const getAvailabilityText = () => {
    switch (availability) {
      case "in_stock":
        return "В наявності";
      case "low_stock":
        return "Мало";
      case "out_of_stock":
        return "Немає";
      default:
        return "";
    }
  };

  return (
    <Pressable
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
      onPress={() => onPress(store.id)}
    >
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.storeName}>{store.name}</Text>
          {store.distance !== undefined && (
            <Text style={styles.distance}>{store.distance.toFixed(1)} км</Text>
          )}
        </View>
        <TouchableOpacity
          onPress={() => onMapPress(store.id)}
          style={styles.mapButton}
        >
          <Ionicons name="map" size={24} color="#2196F3" />
        </TouchableOpacity>
      </View>

      <Text style={styles.address} numberOfLines={2}>
        {store.address}
      </Text>

      <View style={styles.footer}>
        <View style={styles.priceContainer}>
          <Text style={styles.price}>{price.toFixed(2)} ₴</Text>
          <View
            style={[
              styles.badge,
              { backgroundColor: getAvailabilityColor() + "20" },
            ]}
          >
            <Text style={[styles.badgeText, { color: getAvailabilityColor() }]}>
              {getAvailabilityText()}
            </Text>
          </View>
        </View>
        <Text style={styles.hours}>{store.workingHours}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  pressed: {
    opacity: 0.7,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  headerLeft: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  storeName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  distance: {
    fontSize: 14,
    color: "#666",
  },
  mapButton: {
    padding: 4,
  },
  address: {
    fontSize: 14,
    color: "#666",
    marginBottom: 12,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  price: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2196F3",
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "600",
  },
  hours: {
    fontSize: 12,
    color: "#999",
  },
});
