// Product Details Screen
import { Ionicons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StoreListItem } from "../../components/store-list-item";
import { useCart } from "../../contexts/cart-context";
import { productsService } from "../../services/products.service";
import { Product, ProductInStore } from "../../types";

export default function ProductDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [stores, setStores] = useState<ProductInStore[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAllStores, setShowAllStores] = useState(false);

  useEffect(() => {
    loadProductDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadProductDetails = async () => {
    try {
      setLoading(true);
      const [productData, storesData] = await Promise.all([
        productsService.getProduct(id as string),
        productsService.getProductStores(id as string),
      ]);
      setProduct(productData);
      setStores(storesData);
    } catch (error) {
      console.error("Failed to load product details:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStorePress = (storeId: string) => {
    // Navigate to store details or booking
    console.log("Store pressed:", storeId);
  };

  const handleMapPress = (storeId: string) => {
    router.push(`/map?storeId=${storeId}&productId=${id}`);
  };

  const handleAddToCart = (store: ProductInStore) => {
    if (!product) return;

    addToCart(product, store, 1);
    Alert.alert(
      "Додано в кошик",
      `${product.name} додано в кошик з ${store.storeName}`,
      [
        { text: "Продовжити покупки", style: "cancel" },
        { text: "Перейти в кошик", onPress: () => router.push("/cart") },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <Stack.Screen options={{ title: "Завантаження..." }} />
        <ActivityIndicator size="large" color="#10b981" />
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.centered}>
        <Stack.Screen options={{ title: "Помилка" }} />
        <Text style={styles.errorText}>Товар не знайдено</Text>
      </View>
    );
  }

  // Calculate price statistics
  const prices = stores
    .filter((s) => s.availability !== "out_of_stock")
    .map((s) => s.price);
  const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
  const maxPrice = prices.length > 0 ? Math.max(...prices) : 0;
  const availableStoresCount = stores.filter(
    (s) => s.availability !== "out_of_stock"
  ).length;

  // Show first 3 stores or all if expanded
  const displayedStores = showAllStores ? stores : stores.slice(0, 3);
  const hasMoreStores = stores.length > 3;

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <Stack.Screen
        options={{
          title: product.name,
          headerBackTitle: "Назад",
        }}
      />
      <ScrollView style={styles.scrollView}>
        <Image
          source={{ uri: product.imageUrl }}
          style={styles.image}
          resizeMode="cover"
        />

        <View style={styles.content}>
          {/* Product Info */}
          <View style={styles.productHeader}>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{product.category}</Text>
            </View>
            <Text style={styles.productName}>{product.name}</Text>
            <Text style={styles.brand}>{product.brand}</Text>
          </View>

          {/* Price Range */}
          {availableStoresCount > 0 && (
            <View style={styles.priceSection}>
              <View style={styles.priceRow}>
                <Text style={styles.priceFrom}>від {minPrice}₴</Text>
                {minPrice !== maxPrice && (
                  <Text style={styles.priceTo}>до {maxPrice}₴</Text>
                )}
              </View>
              <Text style={styles.storesCount}>
                В наявності у {availableStoresCount}{" "}
                {availableStoresCount === 1
                  ? "магазині"
                  : availableStoresCount < 5
                  ? "магазинах"
                  : "магазинах"}
              </Text>
            </View>
          )}

          <View style={styles.divider} />

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Опис</Text>
            <Text style={styles.description}>{product.description}</Text>
          </View>

          {/* Tags */}
          {product.tags && product.tags.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Особливості</Text>
              <View style={styles.tagsContainer}>
                {product.tags.map((tag, index) => (
                  <View key={index} style={styles.tag}>
                    <Ionicons
                      name="checkmark-circle"
                      size={16}
                      color="#10b981"
                    />
                    <Text style={styles.tagText}>{tag}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          <View style={styles.divider} />

          {/* Stores Section */}
          <View style={styles.section}>
            <View style={styles.storesHeader}>
              <Text style={styles.storesTitle}>
                Де купити ({stores.length})
              </Text>
              <TouchableOpacity
                style={styles.mapButton}
                onPress={() => router.push(`/map?productId=${id}`)}
              >
                <Ionicons name="map-outline" size={20} color="#10b981" />
                <Text style={styles.mapButtonText}>Мапа</Text>
              </TouchableOpacity>
            </View>

            {stores.length === 0 ? (
              <View style={styles.emptyStores}>
                <Ionicons name="sad-outline" size={48} color="#737373" />
                <Text style={styles.emptyStoresText}>
                  На жаль, цей товар зараз недоступний
                </Text>
              </View>
            ) : (
              <View style={styles.storesList}>
                {displayedStores.map((store) => (
                  <StoreListItem
                    key={store.storeId}
                    productInStore={store}
                    onPress={handleStorePress}
                    onMapPress={handleMapPress}
                    onAddToCart={handleAddToCart}
                    showAddButton={true}
                  />
                ))}
                {hasMoreStores && !showAllStores && (
                  <TouchableOpacity
                    style={styles.showMoreButton}
                    onPress={() => setShowAllStores(true)}
                  >
                    <Text style={styles.showMoreText}>
                      Показати ще {stores.length - 3}{" "}
                      {stores.length - 3 === 1
                        ? "магазин"
                        : stores.length - 3 < 5
                        ? "магазини"
                        : "магазинів"}
                    </Text>
                    <Ionicons name="chevron-down" size={20} color="#10b981" />
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>
        </View>
      </ScrollView>
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
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: 300,
    backgroundColor: "#242424",
  },
  content: {
    padding: 16,
  },
  productHeader: {
    marginBottom: 16,
  },
  categoryBadge: {
    backgroundColor: "#065f46",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: "flex-start",
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 11,
    color: "#34d399",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  productName: {
    fontSize: 24,
    fontWeight: "700",
    color: "#e5e5e5",
    marginBottom: 6,
    lineHeight: 32,
  },
  brand: {
    fontSize: 16,
    color: "#a3a3a3",
    fontWeight: "500",
  },
  priceSection: {
    marginBottom: 20,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 12,
    marginBottom: 8,
  },
  priceFrom: {
    fontSize: 32,
    fontWeight: "700",
    color: "#10b981",
  },
  priceTo: {
    fontSize: 24,
    fontWeight: "600",
    color: "#34d399",
  },
  storesCount: {
    fontSize: 14,
    color: "#a3a3a3",
  },
  divider: {
    height: 1,
    backgroundColor: "#333333",
    marginVertical: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#e5e5e5",
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    color: "#c9c9c9",
    lineHeight: 24,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  tag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#2a2a2a",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  tagText: {
    fontSize: 14,
    color: "#e5e5e5",
  },
  storesHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  storesTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#e5e5e5",
  },
  mapButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  mapButtonText: {
    fontSize: 14,
    color: "#10b981",
    fontWeight: "600",
  },
  storesList: {
    gap: 12,
  },
  showMoreButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    marginTop: 8,
    backgroundColor: "#2a2a2a",
    borderRadius: 12,
  },
  showMoreText: {
    fontSize: 14,
    color: "#10b981",
    fontWeight: "600",
  },
  emptyStores: {
    padding: 32,
    alignItems: "center",
  },
  emptyStoresText: {
    fontSize: 16,
    color: "#a3a3a3",
    textAlign: "center",
    marginTop: 16,
  },
  errorText: {
    fontSize: 16,
    color: "#a3a3a3",
  },
});
