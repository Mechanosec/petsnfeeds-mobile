// Category Chip Component
import React from "react";
import { Pressable, StyleSheet, Text } from "react-native";

interface CategoryChipProps {
  label: string;
  icon?: string;
  active?: boolean;
  onPress: () => void;
}

export function CategoryChip({ label, active, onPress }: CategoryChipProps) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.chip,
        active && styles.chipActive,
        pressed && styles.chipPressed,
      ]}
      onPress={onPress}
    >
      <Text style={[styles.label, active && styles.labelActive]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#2a2a2a",
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#404040",
  },
  chipActive: {
    backgroundColor: "#10b981",
    borderColor: "#10b981",
  },
  chipPressed: {
    opacity: 0.7,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#a3a3a3",
  },
  labelActive: {
    color: "#ffffff",
  },
});

