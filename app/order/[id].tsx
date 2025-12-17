// Order Details Screen
import { Ionicons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ordersService } from "../../services/orders.service";
import { Order } from "../../types";

export default function OrderDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    loadOrderDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadOrderDetails = async () => {
    try {
      setLoading(true);
      const orderData = await ordersService.getOrder(id as string);
      setOrder(orderData);
    } catch (error) {
      console.error("Failed to load order details:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = () => {
    Alert.alert(
      "Скасувати замовлення",
      "Ви впевнені, що хочете скасувати це замовлення?",
      [
        { text: "Ні", style: "cancel" },
        {
          text: "Так, скасувати",
          style: "destructive",
          onPress: async () => {
            try {
              setCancelling(true);
              await ordersService.cancelOrder(id as string);
              router.back();
            } catch (error) {
              console.error("Failed to cancel order:", error);
              Alert.alert("Помилка", "Не вдалося скасувати замовлення");
            } finally {
              setCancelling(false);
            }
          },
        },
      ]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
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

  const getStatusText = (status: string) => {
    switch (status) {
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("uk-UA", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <Stack.Screen options={{ title: "Завантаження..." }} />
        <ActivityIndicator size="large" color="#2196F3" />
      </View>
    );
  }

  if (!order) {
    return (
      <View style={styles.centered}>
        <Stack.Screen options={{ title: "Помилка" }} />
        <Text style={styles.errorText}>Замовлення не знайдено</Text>
      </View>
    );
  }

  const canCancel = order.status === "pending" || order.status === "reserved";

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <Stack.Screen
        options={{
          title: `Замовлення #${order.id.slice(0, 8)}`,
          headerBackTitle: "Назад",
        }}
      />
      <ScrollView style={styles.scrollView}>
        <View style={styles.statusCard}>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor(order.status) + "20" },
            ]}
          >
            <Text
              style={[
                styles.statusText,
                { color: getStatusColor(order.status) },
              ]}
            >
              {getStatusText(order.status)}
            </Text>
          </View>
          <Text style={styles.orderDate}>
            Створено: {formatDate(order.createdAt)}
          </Text>
          {order.updatedAt !== order.createdAt && (
            <Text style={styles.orderDate}>
              Оновлено: {formatDate(order.updatedAt)}
            </Text>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Магазин</Text>
          <View style={styles.storeCard}>
            <Text style={styles.storeName}>{order.store.name}</Text>
            <Text style={styles.storeAddress}>{order.store.address}</Text>
            <Text style={styles.storePhone}>{order.store.phone}</Text>
            <Text style={styles.storeHours}>{order.store.workingHours}</Text>
          </View>
        </View>

        {order.pickupTime && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Час отримання</Text>
            <View style={styles.pickupCard}>
              <Ionicons name="calendar" size={24} color="#2196F3" />
              <Text style={styles.pickupTime}>
                {formatDate(order.pickupTime)}
              </Text>
            </View>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Товари</Text>
          {order.items.map((item) => (
            <View key={item.id} style={styles.itemCard}>
              <View style={styles.itemInfo}>
                <Text style={styles.itemName} numberOfLines={2}>
                  {item.product.name}
                </Text>
                <Text style={styles.itemBrand}>{item.product.brand}</Text>
              </View>
              <View style={styles.itemPricing}>
                <Text style={styles.itemQuantity}>x{item.quantity}</Text>
                <Text style={styles.itemPrice}>
                  {(item.price * item.quantity).toFixed(2)} ₴
                </Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.totalSection}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Всього:</Text>
            <Text style={styles.totalAmount}>
              {order.totalAmount.toFixed(2)} ₴
            </Text>
          </View>
        </View>

        {canCancel && (
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={handleCancelOrder}
            disabled={cancelling}
          >
            {cancelling ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Ionicons name="close-circle-outline" size={22} color="#fff" />
                <Text style={styles.cancelButtonText}>
                  Скасувати замовлення
                </Text>
              </>
            )}
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  scrollView: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  statusCard: {
    backgroundColor: "#fff",
    padding: 16,
    marginBottom: 16,
    alignItems: "center",
  },
  statusBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    marginBottom: 12,
  },
  statusText: {
    fontSize: 16,
    fontWeight: "700",
  },
  orderDate: {
    fontSize: 13,
    color: "#666",
    marginTop: 4,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#999",
    textTransform: "uppercase",
    paddingHorizontal: 16,
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  storeCard: {
    backgroundColor: "#fff",
    padding: 16,
  },
  storeName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
    marginBottom: 8,
  },
  storeAddress: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  storePhone: {
    fontSize: 14,
    color: "#2196F3",
    marginBottom: 4,
  },
  storeHours: {
    fontSize: 13,
    color: "#999",
  },
  pickupCard: {
    backgroundColor: "#fff",
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  pickupTime: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  itemCard: {
    backgroundColor: "#fff",
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  itemInfo: {
    flex: 1,
    marginRight: 12,
  },
  itemName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  itemBrand: {
    fontSize: 13,
    color: "#666",
  },
  itemPricing: {
    alignItems: "flex-end",
  },
  itemQuantity: {
    fontSize: 13,
    color: "#666",
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
  },
  totalSection: {
    backgroundColor: "#fff",
    padding: 16,
    marginBottom: 16,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: "700",
    color: "#2196F3",
  },
  cancelButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#f44336",
    marginHorizontal: 16,
    marginBottom: 24,
    paddingVertical: 14,
    borderRadius: 12,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  errorText: {
    fontSize: 16,
    color: "#999",
  },
});
