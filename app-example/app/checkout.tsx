// Checkout Screen
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCart } from "../contexts/cart-context";
import { ordersService } from "../services/orders.service";

export default function CheckoutScreen() {
  const router = useRouter();
  const { items, getTotalPrice, getItemsByStore, clearCart } = useCart();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const itemsByStore = getItemsByStore();
  const totalPrice = getTotalPrice();

  const validateForm = () => {
    if (!name.trim()) {
      Alert.alert("Помилка", "Введіть ваше ім'я");
      return false;
    }
    if (!phone.trim() || phone.length < 10) {
      Alert.alert("Помилка", "Введіть коректний номер телефону");
      return false;
    }
    if (email && !email.includes("@")) {
      Alert.alert("Помилка", "Введіть коректний email");
      return false;
    }
    return true;
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);

      // Create order for each store
      const orderPromises = Array.from(itemsByStore.entries()).map(
        async ([storeId, storeItems]) => {
          const orderData = {
            storeId,
            items: storeItems.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.price,
            })),
            totalAmount: storeItems.reduce(
              (sum, item) => sum + item.price * item.quantity,
              0
            ),
            customerName: name,
            customerPhone: phone,
            customerEmail: email || undefined,
            notes: notes || undefined,
          };

          return await ordersService.createOrder(orderData);
        }
      );

      const orders = await Promise.all(orderPromises);

      // Clear cart
      clearCart();

      // Show success
      Alert.alert(
        "Замовлення оформлено!",
        `Створено ${orders.length} замовлень. Очікуйте дзвінка від магазину для підтвердження.`,
        [
          {
            text: "OK",
            onPress: () => router.replace("/(tabs)/explore"),
          },
        ]
      );
    } catch (error) {
      console.error("Failed to create order:", error);
      Alert.alert(
        "Помилка",
        "Не вдалося оформити замовлення. Спробуйте ще раз."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView style={styles.scrollView}>
          {/* Contact Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Контактна інформація</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Ім'я <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Введіть ваше ім'я"
                placeholderTextColor="#737373"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Телефон <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                value={phone}
                onChangeText={setPhone}
                placeholder="+380 XX XXX XX XX"
                placeholderTextColor="#737373"
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email (опціонально)</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="email@example.com"
                placeholderTextColor="#737373"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Примітки до замовлення</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={notes}
                onChangeText={setNotes}
                placeholder="Додаткова інформація..."
                placeholderTextColor="#737373"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>
          </View>

          {/* Order Summary */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Підсумок замовлення</Text>

            {Array.from(itemsByStore.entries()).map(([storeId, storeItems]) => {
              const storeTotal = storeItems.reduce(
                (sum, item) => sum + item.price * item.quantity,
                0
              );

              return (
                <View key={storeId} style={styles.storeCard}>
                  <View style={styles.storeHeader}>
                    <Ionicons name="storefront" size={16} color="#10b981" />
                    <Text style={styles.storeName}>
                      {storeItems[0].storeName}
                    </Text>
                  </View>

                  {storeItems.map((item) => (
                    <View key={item.id} style={styles.orderItem}>
                      <Text style={styles.itemName} numberOfLines={1}>
                        {item.productName}
                      </Text>
                      <Text style={styles.itemQuantity}>×{item.quantity}</Text>
                      <Text style={styles.itemPrice}>
                        {(item.price * item.quantity).toFixed(2)}₴
                      </Text>
                    </View>
                  ))}

                  <View style={styles.storeTotalRow}>
                    <Text style={styles.storeTotalLabel}>Разом:</Text>
                    <Text style={styles.storeTotalPrice}>
                      {storeTotal.toFixed(2)}₴
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>

          {/* Info */}
          <View style={styles.infoCard}>
            <Ionicons name="information-circle" size={20} color="#10b981" />
            <Text style={styles.infoText}>
              Після оформлення замовлення з вами зв'яжеться менеджер магазину
              для підтвердження та узгодження часу отримання товару.
            </Text>
          </View>
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.totalSection}>
            <Text style={styles.totalLabel}>Загальна сума:</Text>
            <Text style={styles.totalPrice}>{totalPrice.toFixed(2)}₴</Text>
          </View>
          <TouchableOpacity
            style={[styles.orderButton, loading && styles.orderButtonDisabled]}
            onPress={handlePlaceOrder}
            disabled={loading}
          >
            {loading ? (
              <Text style={styles.orderButtonText}>Оформлення...</Text>
            ) : (
              <>
                <Text style={styles.orderButtonText}>
                  Підтвердити замовлення
                </Text>
                <Ionicons name="checkmark-circle" size={22} color="#ffffff" />
              </>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a1a",
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    backgroundColor: "#2a2a2a",
    marginTop: 12,
    marginHorizontal: 12,
    borderRadius: 12,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#e5e5e5",
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#a3a3a3",
    marginBottom: 8,
  },
  required: {
    color: "#ef4444",
  },
  input: {
    backgroundColor: "#1f1f1f",
    borderWidth: 1,
    borderColor: "#404040",
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: "#e5e5e5",
  },
  textArea: {
    height: 100,
    paddingTop: 12,
  },
  storeCard: {
    backgroundColor: "#1f1f1f",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
  },
  storeHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#333333",
  },
  storeName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#e5e5e5",
  },
  orderItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  itemName: {
    flex: 1,
    fontSize: 13,
    color: "#a3a3a3",
  },
  itemQuantity: {
    fontSize: 13,
    color: "#737373",
    minWidth: 30,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: "600",
    color: "#10b981",
    minWidth: 70,
    textAlign: "right",
  },
  storeTotalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#333333",
  },
  storeTotalLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#a3a3a3",
  },
  storeTotalPrice: {
    fontSize: 16,
    fontWeight: "700",
    color: "#e5e5e5",
  },
  infoCard: {
    flexDirection: "row",
    gap: 12,
    backgroundColor: "#065f46",
    marginHorizontal: 12,
    marginTop: 12,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: "#d1fae5",
    lineHeight: 20,
  },
  footer: {
    backgroundColor: "#2a2a2a",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#333333",
  },
  totalSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#e5e5e5",
  },
  totalPrice: {
    fontSize: 26,
    fontWeight: "700",
    color: "#10b981",
  },
  orderButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#10b981",
    paddingVertical: 16,
    borderRadius: 12,
  },
  orderButtonDisabled: {
    opacity: 0.6,
  },
  orderButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#ffffff",
  },
});
