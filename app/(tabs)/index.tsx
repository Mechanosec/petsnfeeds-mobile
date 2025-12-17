// Home Screen - Search Products
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CategoryChip } from "../../components/category-chip";
import { ProductCard } from "../../components/product-card";
import { SearchBar } from "../../components/search-bar";
import { FiltersModal, Filters } from "../../components/filters-modal";
import { useCart } from "../../contexts/cart-context";
import { getProductPriceRange } from "../../mocks/data";
import { productsService } from "../../services/products.service";
import { Product } from "../../types";

const CATEGORIES = [
  "Всі",
  "Корм для собак",
  "Корм для котів",
  "Іграшки",
  "Аксесуари",
];

export default function HomeScreen() {
  const router = useRouter();
  const { getTotalItems } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Всі");
  const [showFiltersModal, setShowFiltersModal] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    priceRange: { min: 0, max: 999999 },
    brands: [],
    availability: [],
    sortBy: null,
  });
  const cartItemsCount = getTotalItems();

  useEffect(() => {
    loadPopularProducts();
  }, []);

  const loadPopularProducts = async () => {
    try {
      setLoading(true);
      const data = await productsService.getPopularProducts(20);
      setAllProducts(data);
      setProducts(data);
    } catch (error) {
      console.error("Failed to load popular products:", error);
    } finally {
      setLoading(false);
    }
  };

  // Get available brands from products
  const availableBrands = useMemo(() => {
    const brands = new Set(allProducts.map((p) => p.brand));
    return Array.from(brands).sort();
  }, [allProducts]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Filter by price range
    if (filters.priceRange.min > 0 || filters.priceRange.max < 999999) {
      result = result.filter((p) => {
        const { minPrice } = getProductPriceRange(p.id);
        return (
          minPrice >= filters.priceRange.min &&
          minPrice <= filters.priceRange.max
        );
      });
    }

    // Filter by brand
    if (filters.brands.length > 0) {
      result = result.filter((p) => filters.brands.includes(p.brand));
    }

    // Sort
    if (filters.sortBy) {
      switch (filters.sortBy) {
        case "price_asc":
          result.sort((a, b) => {
            const priceA = getProductPriceRange(a.id).minPrice;
            const priceB = getProductPriceRange(b.id).minPrice;
            return priceA - priceB;
          });
          break;
        case "price_desc":
          result.sort((a, b) => {
            const priceA = getProductPriceRange(a.id).minPrice;
            const priceB = getProductPriceRange(b.id).minPrice;
            return priceB - priceA;
          });
          break;
        case "newest":
          result = [...result].reverse();
          break;
        case "popular":
          // Already sorted by popularity
          break;
      }
    }

    return result;
  }, [products, filters]);

  const activeFiltersCount = useMemo(() => {
    return (
      (filters.priceRange.min !== 0 || filters.priceRange.max !== 999999
        ? 1
        : 0) +
      filters.brands.length +
      filters.availability.length +
      (filters.sortBy ? 1 : 0)
    );
  }, [filters]);

  const handleApplyFilters = (newFilters: Filters) => {
    setFilters(newFilters);
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    setSelectedCategory("Всі");
    if (!query.trim()) {
      loadPopularProducts();
      return;
    }

    try {
      setLoading(true);
      const data = await productsService.searchProducts(query);
      setAllProducts(data);
      setProducts(data);
    } catch (error) {
      console.error("Failed to search products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryPress = async (category: string) => {
    setSelectedCategory(category);
    setSearchQuery("");

    try {
      setLoading(true);
      if (category === "Всі") {
        const data = await productsService.getPopularProducts(20);
        setAllProducts(data);
        setProducts(data);
      } else {
        const data = await productsService.getProductsByCategory(category);
        setAllProducts(data);
        setProducts(data);
      }
    } catch (error) {
      console.error("Failed to load category products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    if (searchQuery) {
      await handleSearch(searchQuery);
    } else {
      await loadPopularProducts();
    }
    setRefreshing(false);
  };

  const handleProductPress = (product: Product) => {
    router.push(`/product/${product.id}`);
  };

  return (
    <>
      <SafeAreaView style={styles.container} edges={["top"]}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Pets&Feed</Text>
            <Text style={styles.subtitle}>
              Знайди найкраще для своїх улюбленців
            </Text>
          </View>
          <TouchableOpacity
            style={styles.cartButton}
            onPress={() => router.push("/cart")}
          >
            <Ionicons name="cart" size={28} color="#10b981" />
            {cartItemsCount > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{cartItemsCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

      <View style={styles.searchRow}>
        <View style={styles.searchBarContainer}>
          <SearchBar
            onSearch={handleSearch}
            placeholder="Шукати корм, іграшки..."
          />
        </View>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowFiltersModal(true)}
        >
          <Ionicons name="options" size={24} color="#10b981" />
          {activeFiltersCount > 0 && (
            <View style={styles.filterBadge}>
              <Text style={styles.filterBadgeText}>{activeFiltersCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.categoriesSection}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContent}
        >
          {CATEGORIES.map((category) => (
            <CategoryChip
              key={category}
              label={category}
              active={selectedCategory === category}
              onPress={() => handleCategoryPress(category)}
            />
          ))}
        </ScrollView>
      </View>

        {loading && products.length === 0 ? (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color="#10b981" />
          </View>
        ) : (
          <FlatList
            data={filteredProducts}
            keyExtractor={(item) => item.id}
            numColumns={2}
            renderItem={({ item }) => (
              <ProductCard product={item} onPress={handleProductPress} />
            )}
            contentContainerStyle={styles.listContent}
            columnWrapperStyle={styles.row}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
            }
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>Товарів не знайдено</Text>
                <Text style={styles.emptySubtext}>
                  Спробуйте змінити фільтри або пошуковий запит
                </Text>
              </View>
            }
          />
        )}
      </SafeAreaView>

      <FiltersModal
        visible={showFiltersModal}
        onClose={() => setShowFiltersModal(false)}
        onApply={handleApplyFilters}
        currentFilters={filters}
        availableBrands={availableBrands}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a1a",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 16,
    backgroundColor: "#1f1f1f",
    borderBottomWidth: 1,
    borderBottomColor: "#333333",
  },
  cartButton: {
    position: "relative",
    padding: 8,
  },
  cartBadge: {
    position: "absolute",
    top: 4,
    right: 4,
    backgroundColor: "#ef4444",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 5,
  },
  cartBadgeText: {
    color: "#ffffff",
    fontSize: 11,
    fontWeight: "700",
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#10b981",
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 4,
  },
  searchBarContainer: {
    flex: 1,
  },
  filterButton: {
    position: "relative",
    backgroundColor: "#2a2a2a",
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#404040",
  },
  filterBadge: {
    position: "absolute",
    top: 4,
    right: 4,
    backgroundColor: "#10b981",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 5,
  },
  filterBadgeText: {
    color: "#ffffff",
    fontSize: 11,
    fontWeight: "700",
  },
  subtitle: {
    fontSize: 15,
    color: "#a3a3a3",
    fontWeight: "500",
  },
  categoriesSection: {
    backgroundColor: "#1f1f1f",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#333333",
  },
  categoriesContent: {
    paddingHorizontal: 16,
  },
  listContent: {
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  row: {
    justifyContent: "space-between",
    paddingHorizontal: 8,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    padding: 32,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#a3a3a3",
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#737373",
    textAlign: "center",
  },
});
