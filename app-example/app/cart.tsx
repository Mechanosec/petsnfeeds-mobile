// Cart Screen
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCart } from "../contexts/cart-context";

export default function CartScreen() {
  const router = useRouter();
  const {
    items,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalPrice,
    getItemsByStore,
  } = useCart();

  const itemsByStore = getItemsByStore();
  const totalPrice = getTotalPrice();

  const handleRemoveItem = (itemId: string, productName: string) => {
    Alert.alert("Видалити товар?", `Видалити ${productName} з кошика?`, [
      { text: "Скасувати", style: "cancel" },
      {
        text: "Видалити",
        style: "destructive",
        onPress: () => removeFromCart(itemId),
      },
    ]);
  };

  const handleClearCart = () => {
    Alert.alert("Очистити кошик?", "Всі товари будуть видалені з кошика", [
      { text: "Скасувати", style: "cancel" },
      {
        text: "Очистити",
        style: "destructive",
        onPress: () => clearCart(),
      },
    ]);
  };

  const handleCheckout = () => {
    router.push("/checkout");
  };

  if (items.length === 0) {
    return (
      <SafeAreaView style={styles.container} edges={["bottom"]}>
        <View style={styles.emptyContainer}>
          <Ionicons name="cart-outline" size={80} color="#737373" />
          <Text style={styles.emptyTitle}>Кошик порожній</Text>
          <Text style={styles.emptySubtitle}>
            Додайте товари щоб оформити замовлення
          </Text>
          <TouchableOpacity
            style={styles.continueButton}
            onPress={() => router.back()}
          >
            <Text style={styles.continueButtonText}>До покупок</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>
            Товарів у кошику: {items.length}
          </Text>
          <TouchableOpacity onPress={handleClearCart}>
            <Text style={styles.clearButton}>Очистити</Text>
          </TouchableOpacity>
        </View>

        {Array.from(itemsByStore.entries()).map(([storeId, storeItems]) => (
          <View key={storeId} style={styles.storeSection}>
            <View style={styles.storeSectionHeader}>
              <Ionicons name="storefront" size={18} color="#10b981" />
              <Text style={styles.storeName}>{storeItems[0].storeName}</Text>
            </View>

            {storeItems.map((item) => (
              <View key={item.id} style={styles.cartItem}>
                <Image
                  source={{ uri: item.productImage }}
                  style={styles.productImage}
                  resizeMode="cover"
                />
                <View style={styles.itemInfo}>
                  <Text style={styles.productName} numberOfLines={2}>
                    {item.productName}
                  </Text>
                  <Text style={styles.productBrand}>{item.productBrand}</Text>
                  <Text style={styles.productPrice}>{item.price}₴</Text>
                </View>
                <View style={styles.itemActions}>
                  <View style={styles.quantityControls}>
                    <TouchableOpacity
                      style={styles.quantityButton}
                      onPress={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      <Ionicons name="remove" size={18} color="#e5e5e5" />
                    </TouchableOpacity>
                    <Text style={styles.quantity}>{item.quantity}</Text>
                    <TouchableOpacity
                      style={styles.quantityButton}
                      onPress={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      <Ionicons name="add" size={18} color="#e5e5e5" />
                    </TouchableOpacity>
                  </View>
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => handleRemoveItem(item.id, item.productName)}
                  >
                    <Ionicons name="trash-outline" size={20} color="#ef4444" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}

            <View style={styles.storeTotalRow}>
              <Text style={styles.storeTotalLabel}>Разом по магазину:</Text>
              <Text style={styles.storeTotalPrice}>
                {storeItems.reduce(
                  (sum, item) => sum + item.price * item.quantity,
                  0
                )}
                ₴
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.totalSection}>
          <Text style={styles.totalLabel}>До сплати:</Text>
          <Text style={styles.totalPrice}>{totalPrice}₴</Text>
        </View>
        <TouchableOpacity
          style={styles.checkoutButton}
          onPress={handleCheckout}
        >
          <Text style={styles.checkoutButtonText}>Оформити замовлення</Text>
          <Ionicons name="arrow-forward" size={20} color="#ffffff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a1a",
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#2a2a2a",
    borderBottomWidth: 1,
    borderBottomColor: "#333333",
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#e5e5e5",
  },
  clearButton: {
    fontSize: 14,
    color: "#ef4444",
    fontWeight: "600",
  },
  storeSection: {
    backgroundColor: "#2a2a2a",
    marginTop: 12,
    marginHorizontal: 12,
    borderRadius: 12,
    padding: 16,
  },
  storeSectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#333333",
  },
  storeName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#e5e5e5",
  },
  cartItem: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#333333",
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: "#1a1a1a",
  },
  itemInfo: {
    flex: 1,
    justifyContent: "space-between",
  },
  productName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#e5e5e5",
    marginBottom: 4,
  },
  productBrand: {
    fontSize: 12,
    color: "#737373",
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: "700",
    color: "#10b981",
  },
  itemActions: {
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1f1f1f",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#404040",
  },
  quantityButton: {
    padding: 8,
  },
  quantity: {
    fontSize: 14,
    fontWeight: "600",
    color: "#e5e5e5",
    minWidth: 30,
    textAlign: "center",
  },
  removeButton: {
    padding: 8,
  },
  storeTotalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  storeTotalLabel: {
    fontSize: 14,
    color: "#a3a3a3",
    fontWeight: "500",
  },
  storeTotalPrice: {
    fontSize: 16,
    fontWeight: "700",
    color: "#e5e5e5",
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
    fontSize: 18,
    fontWeight: "600",
    color: "#e5e5e5",
  },
  totalPrice: {
    fontSize: 28,
    fontWeight: "700",
    color: "#10b981",
  },
  checkoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#10b981",
    paddingVertical: 16,
    borderRadius: 12,
  },
  checkoutButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#ffffff",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#e5e5e5",
    marginTop: 24,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 15,
    color: "#a3a3a3",
    textAlign: "center",
    marginBottom: 32,
  },
  continueButton: {
    backgroundColor: "#10b981",
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
  },
});
