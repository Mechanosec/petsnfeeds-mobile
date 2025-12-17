// Product Card Component
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { getProductPriceRange } from "../mocks/data";
import { Product } from "../types";

interface ProductCardProps {
  product: Product;
  onPress: (product: Product) => void;
}

export function ProductCard({ product, onPress }: ProductCardProps) {
  const { minPrice } = getProductPriceRange(product.id);

  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      onPress={() => onPress(product)}
    >
      <Image
        source={{ uri: product.imageUrl }}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.content}>
        <Text style={styles.category} numberOfLines={1}>
          {product.category}
        </Text>
        <Text style={styles.name} numberOfLines={2}>
          {product.name}
        </Text>
        <Text style={styles.brand} numberOfLines={1}>
          {product.brand}
        </Text>
        <View style={styles.priceContainer}>
          <Ionicons name="pricetag" size={14} color="#10b981" />
          <Text style={styles.priceLabel}>від</Text>
          <Text style={styles.price}>
            {minPrice > 0 ? `${minPrice.toFixed(0)}₴` : "—"}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#2a2a2a",
    borderRadius: 12,
    marginBottom: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#333333",
    flex: 1,
    maxWidth: "48%",
  },
  cardPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.98 }],
  },
  image: {
    width: "100%",
    height: 140,
    backgroundColor: "#1a1a1a",
  },
  content: {
    padding: 10,
  },
  category: {
    fontSize: 10,
    color: "#34d399",
    fontWeight: "600",
    textTransform: "uppercase",
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  name: {
    fontSize: 14,
    fontWeight: "600",
    color: "#e5e5e5",
    marginBottom: 4,
    height: 36,
  },
  brand: {
    fontSize: 12,
    color: "#737373",
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#404040",
  },
  priceLabel: {
    fontSize: 11,
    color: "#a3a3a3",
  },
  price: {
    fontSize: 14,
    fontWeight: "700",
    color: "#10b981",
    flex: 1,
  },
});
