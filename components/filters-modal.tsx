// Filters Modal Component
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export interface Filters {
  priceRange: { min: number; max: number };
  brands: string[];
  availability: string[];
  sortBy: "price_asc" | "price_desc" | "popular" | "newest" | null;
}

interface FiltersModalProps {
  visible: boolean;
  onClose: () => void;
  onApply: (filters: Filters) => void;
  currentFilters: Filters;
  availableBrands: string[];
}

const PRICE_RANGES = [
  { label: "До 100₴", min: 0, max: 100 },
  { label: "100₴ - 300₴", min: 100, max: 300 },
  { label: "300₴ - 500₴", min: 300, max: 500 },
  { label: "500₴ - 1000₴", min: 500, max: 1000 },
  { label: "Від 1000₴", min: 1000, max: 999999 },
];

const AVAILABILITY_OPTIONS = [
  { label: "В наявності", value: "in_stock" },
  { label: "Мало", value: "low_stock" },
];

const SORT_OPTIONS = [
  { label: "За популярністю", value: "popular" as const },
  { label: "Спочатку дешеві", value: "price_asc" as const },
  { label: "Спочатку дорогі", value: "price_desc" as const },
  { label: "Новинки", value: "newest" as const },
];

export function FiltersModal({
  visible,
  onClose,
  onApply,
  currentFilters,
  availableBrands,
}: FiltersModalProps) {
  const [filters, setFilters] = useState<Filters>(currentFilters);

  const handlePriceRangeToggle = (range: { min: number; max: number }) => {
    const isSame =
      filters.priceRange.min === range.min &&
      filters.priceRange.max === range.max;
    setFilters({
      ...filters,
      priceRange: isSame ? { min: 0, max: 999999 } : range,
    });
  };

  const handleBrandToggle = (brand: string) => {
    const isSelected = filters.brands.includes(brand);
    setFilters({
      ...filters,
      brands: isSelected
        ? filters.brands.filter((b) => b !== brand)
        : [...filters.brands, brand],
    });
  };

  const handleAvailabilityToggle = (value: string) => {
    const isSelected = filters.availability.includes(value);
    setFilters({
      ...filters,
      availability: isSelected
        ? filters.availability.filter((a) => a !== value)
        : [...filters.availability, value],
    });
  };

  const handleSortChange = (
    value: "price_asc" | "price_desc" | "popular" | "newest"
  ) => {
    setFilters({
      ...filters,
      sortBy: filters.sortBy === value ? null : value,
    });
  };

  const handleReset = () => {
    const resetFilters: Filters = {
      priceRange: { min: 0, max: 999999 },
      brands: [],
      availability: [],
      sortBy: null,
    };
    setFilters(resetFilters);
  };

  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  const activeFiltersCount =
    (filters.priceRange.min !== 0 || filters.priceRange.max !== 999999
      ? 1
      : 0) +
    filters.brands.length +
    filters.availability.length +
    (filters.sortBy ? 1 : 0);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Text style={styles.headerTitle}>Фільтри</Text>
              {activeFiltersCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{activeFiltersCount}</Text>
                </View>
              )}
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#e5e5e5" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollView}>
            {/* Sort */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Сортування</Text>
              <View style={styles.optionsGrid}>
                {SORT_OPTIONS.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.option,
                      filters.sortBy === option.value && styles.optionActive,
                    ]}
                    onPress={() => handleSortChange(option.value)}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        filters.sortBy === option.value &&
                          styles.optionTextActive,
                      ]}
                    >
                      {option.label}
                    </Text>
                    {filters.sortBy === option.value && (
                      <Ionicons
                        name="checkmark-circle"
                        size={18}
                        color="#10b981"
                      />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Price Range */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Ціна</Text>
              <View style={styles.optionsGrid}>
                {PRICE_RANGES.map((range, index) => {
                  const isActive =
                    filters.priceRange.min === range.min &&
                    filters.priceRange.max === range.max;
                  return (
                    <TouchableOpacity
                      key={index}
                      style={[styles.option, isActive && styles.optionActive]}
                      onPress={() => handlePriceRangeToggle(range)}
                    >
                      <Text
                        style={[
                          styles.optionText,
                          isActive && styles.optionTextActive,
                        ]}
                      >
                        {range.label}
                      </Text>
                      {isActive && (
                        <Ionicons
                          name="checkmark-circle"
                          size={18}
                          color="#10b981"
                        />
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Brands */}
            {availableBrands.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Бренд</Text>
                <View style={styles.optionsGrid}>
                  {availableBrands.map((brand) => {
                    const isActive = filters.brands.includes(brand);
                    return (
                      <TouchableOpacity
                        key={brand}
                        style={[styles.option, isActive && styles.optionActive]}
                        onPress={() => handleBrandToggle(brand)}
                      >
                        <Text
                          style={[
                            styles.optionText,
                            isActive && styles.optionTextActive,
                          ]}
                        >
                          {brand}
                        </Text>
                        {isActive && (
                          <Ionicons
                            name="checkmark-circle"
                            size={18}
                            color="#10b981"
                          />
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            )}

            {/* Availability */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Наявність</Text>
              <View style={styles.optionsGrid}>
                {AVAILABILITY_OPTIONS.map((option) => {
                  const isActive = filters.availability.includes(option.value);
                  return (
                    <TouchableOpacity
                      key={option.value}
                      style={[styles.option, isActive && styles.optionActive]}
                      onPress={() => handleAvailabilityToggle(option.value)}
                    >
                      <Text
                        style={[
                          styles.optionText,
                          isActive && styles.optionTextActive,
                        ]}
                      >
                        {option.label}
                      </Text>
                      {isActive && (
                        <Ionicons
                          name="checkmark-circle"
                          size={18}
                          color="#10b981"
                        />
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </ScrollView>

          {/* Footer */}
          <View style={styles.footer}>
            <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
              <Ionicons name="refresh" size={20} color="#a3a3a3" />
              <Text style={styles.resetButtonText}>Скинути</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
              <Text style={styles.applyButtonText}>Застосувати</Text>
              <Ionicons name="checkmark" size={20} color="#ffffff" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  container: {
    backgroundColor: "#1f1f1f",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "85%",
    borderTopWidth: 1,
    borderTopColor: "#333333",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#333333",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#e5e5e5",
  },
  badge: {
    backgroundColor: "#10b981",
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 8,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#ffffff",
  },
  closeButton: {
    padding: 4,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#2a2a2a",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#e5e5e5",
    marginBottom: 12,
  },
  optionsGrid: {
    gap: 10,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#2a2a2a",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#333333",
  },
  optionActive: {
    backgroundColor: "#065f46",
    borderColor: "#10b981",
  },
  optionText: {
    fontSize: 14,
    color: "#a3a3a3",
    fontWeight: "500",
  },
  optionTextActive: {
    color: "#ffffff",
    fontWeight: "600",
  },
  footer: {
    flexDirection: "row",
    gap: 12,
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#333333",
  },
  resetButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#2a2a2a",
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#404040",
  },
  resetButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#a3a3a3",
  },
  applyButton: {
    flex: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#10b981",
    paddingVertical: 14,
    borderRadius: 12,
  },
  applyButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#ffffff",
  },
});
