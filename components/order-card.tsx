// Order Card Component
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Order } from "../types";

interface OrderCardProps {
  order: Order;
  onPress: (order: Order) => void;
}

export function OrderCard({ order, onPress }: OrderCardProps) {
  const getStatusColor = () => {
    switch (order.status) {
      case "pending":
        return "#ff9800";
      case "reserved":
        return "#2196F3";
      case "ready":
        return "#4caf50";
      case "completed":
        return "#9e9e9e";
      case "cancelled":
        return "#f44336";
      default:
        return "#999";
    }
  };

  const getStatusText = () => {
    switch (order.status) {
      case "pending":
        return "Обробляється";
      case "reserved":
        return "Заброньовано";
      case "ready":
        return "Готово до видачі";
      case "completed":
        return "Виконано";
      case "cancelled":
        return "Скасовано";
      default:
        return "";
    }
  };

  const getStatusIcon = () => {
    switch (order.status) {
      case "pending":
        return "time-outline";
      case "reserved":
        return "bookmark-outline";
      case "ready":
        return "checkmark-circle-outline";
      case "completed":
        return "checkmark-done-circle-outline";
      case "cancelled":
        return "close-circle-outline";
      default:
        return "help-circle-outline";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("uk-UA", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Pressable
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
      onPress={() => onPress(order)}
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.orderId}>Замовлення #{order.id.slice(0, 8)}</Text>
          <Text style={styles.date}>{formatDate(order.createdAt)}</Text>
        </View>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor() + "20" },
          ]}
        >
          <Ionicons
            name={getStatusIcon() as any}
            size={16}
            color={getStatusColor()}
          />
          <Text style={[styles.statusText, { color: getStatusColor() }]}>
            {getStatusText()}
          </Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.storeInfo}>
        <Ionicons name="storefront-outline" size={16} color="#666" />
        <Text style={styles.storeName} numberOfLines={1}>
          {order.store.name}
        </Text>
      </View>

      <View style={styles.itemsInfo}>
        <Text style={styles.itemsText}>
          {order.items.length} {order.items.length === 1 ? "товар" : "товари"}
        </Text>
        <Text style={styles.totalAmount}>{order.totalAmount.toFixed(2)} ₴</Text>
      </View>

      {order.pickupTime && (
        <View style={styles.pickupInfo}>
          <Ionicons name="calendar-outline" size={14} color="#666" />
          <Text style={styles.pickupText}>
            Отримання: {formatDate(order.pickupTime)}
          </Text>
        </View>
      )}
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
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  pressed: {
    opacity: 0.7,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  orderId: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  date: {
    fontSize: 13,
    color: "#999",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  divider: {
    height: 1,
    backgroundColor: "#f0f0f0",
    marginBottom: 12,
  },
  storeInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  storeName: {
    fontSize: 14,
    color: "#666",
    flex: 1,
  },
  itemsInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  itemsText: {
    fontSize: 14,
    color: "#666",
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2196F3",
  },
  pickupInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  pickupText: {
    fontSize: 13,
    color: "#666",
  },
});
