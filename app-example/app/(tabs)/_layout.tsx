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
        tabBarActiveTintColor: "#10b981",
        tabBarInactiveTintColor: "#737373",
        headerShown: true,
        headerStyle: {
          backgroundColor: "#1f1f1f",
        },
        headerTintColor: "#e5e5e5",
        tabBarStyle: Platform.select({
          ios: {
            position: "absolute",
            backgroundColor: "#1f1f1f",
            borderTopColor: "#333333",
          },
          default: {
            backgroundColor: "#1f1f1f",
            borderTopColor: "#333333",
          },
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
                  color="#10b981"
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
                  color="#10b981"
                />
              </TouchableOpacity>
            ),
          }}
        />
      </Tabs>
    );
  }
