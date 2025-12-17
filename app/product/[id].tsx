// Product Details Screen
import { Ionicons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StoreListItem } from "../../components/store-list-item";
import { productsService } from "../../services/products.service";
import { Product, ProductInStore } from "../../types";

export default function ProductDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [stores, setStores] = useState<ProductInStore[]>([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <View style={styles.centered}>
        <Stack.Screen options={{ title: "Завантаження..." }} />
        <ActivityIndicator size="large" color="#2196F3" />
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
          <View style={styles.header}>
            <View style={styles.headerText}>
              <Text style={styles.productName}>{product.name}</Text>
              <Text style={styles.brand}>{product.brand}</Text>
            </View>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{product.category}</Text>
            </View>
          </View>

          <Text style={styles.description}>{product.description}</Text>

          {product.tags && product.tags.length > 0 && (
            <View style={styles.tagsContainer}>
              {product.tags.map((tag, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
          )}

          <View style={styles.divider} />

          <View style={styles.storesHeader}>
            <Text style={styles.storesTitle}>Магазини ({stores.length})</Text>
            <TouchableOpacity
              style={styles.viewAllMapButton}
              onPress={() => router.push(`/map?productId=${id}`)}
            >
              <Ionicons name="map-outline" size={20} color="#2196F3" />
              <Text style={styles.viewAllMapText}>Усі на мапі</Text>
            </TouchableOpacity>
          </View>

          {stores.length === 0 ? (
            <View style={styles.emptyStores}>
              <Ionicons name="sad-outline" size={48} color="#ccc" />
              <Text style={styles.emptyStoresText}>
                На жаль, цей товар зараз недоступний
              </Text>
            </View>
          ) : (
            stores.map((store) => (
              <StoreListItem
                key={store.storeId}
                productInStore={store}
                onPress={handleStorePress}
                onMapPress={handleMapPress}
              />
            ))
          )}
        </View>
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
  image: {
    width: "100%",
    height: 300,
    backgroundColor: "#f5f5f5",
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  headerText: {
    flex: 1,
    marginRight: 12,
  },
  productName: {
    fontSize: 24,
    fontWeight: "700",
    color: "#333",
    marginBottom: 4,
  },
  brand: {
    fontSize: 16,
    color: "#666",
  },
  categoryBadge: {
    backgroundColor: "#e8f5e9",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  categoryText: {
    fontSize: 13,
    color: "#4caf50",
    fontWeight: "600",
  },
  description: {
    fontSize: 15,
    color: "#666",
    lineHeight: 22,
    marginBottom: 16,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  tag: {
    backgroundColor: "#e3f2fd",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 12,
    color: "#2196F3",
  },
  divider: {
    height: 1,
    backgroundColor: "#e0e0e0",
    marginVertical: 16,
  },
  storesHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  storesTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#333",
  },
  viewAllMapButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  viewAllMapText: {
    fontSize: 14,
    color: "#2196F3",
    fontWeight: "600",
  },
  emptyStores: {
    padding: 32,
    alignItems: "center",
  },
  emptyStoresText: {
    fontSize: 16,
    color: "#999",
    textAlign: "center",
    marginTop: 16,
  },
  errorText: {
    fontSize: 16,
    color: "#999",
  },
});
