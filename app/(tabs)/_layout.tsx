// Tabs Layout - Bottom Navigation
import { Ionicons } from "@expo/vector-icons";
import { Tabs, useRouter } from "expo-router";
import React from "react";
import { Platform, TouchableOpacity } from "react-native";

export default function TabLayout() {
  const router = useRouter();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#2196F3",
        tabBarInactiveTintColor: "#999",
        headerShown: true,
        tabBarStyle: Platform.select({
          ios: {
            position: "absolute",
          },
          default: {},
        }),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Головна",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
          headerRight: () => (
            <TouchableOpacity
              onPress={() => router.push("/profile")}
              style={{ marginRight: 16 }}
            >
              <Ionicons
                name="person-circle-outline"
                size={28}
                color="#2196F3"
              />
            </TouchableOpacity>
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "Замовлення",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="list" size={size} color={color} />
          ),
          headerRight: () => (
            <TouchableOpacity
              onPress={() => router.push("/profile")}
              style={{ marginRight: 16 }}
            >
              <Ionicons
                name="person-circle-outline"
                size={28}
                color="#2196F3"
              />
            </TouchableOpacity>
          ),
        }}
      />
    </Tabs>
  );
}
