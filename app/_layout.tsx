// Root Layout
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";
import { CartProvider } from "../contexts/cart-context";
import { useColorScheme } from "../hooks/use-color-scheme";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();

  useEffect(() => {
    // Hide splash screen after a short delay
    setTimeout(() => {
      SplashScreen.hideAsync();
    }, 100);
  }, []);

  return (
    <CartProvider>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="product/[id]"
            options={{
              presentation: "card",
              headerShown: true,
            }}
          />
          <Stack.Screen
            name="order/[id]"
            options={{
              presentation: "card",
              headerShown: true,
            }}
          />
          <Stack.Screen
            name="cart"
            options={{
              presentation: "card",
              headerShown: true,
              title: "Кошик",
            }}
          />
          <Stack.Screen
            name="checkout"
            options={{
              presentation: "card",
              headerShown: true,
              title: "Оформлення замовлення",
            }}
          />
          <Stack.Screen
            name="map"
            options={{
              presentation: "card",
              headerShown: true,
            }}
          />
          <Stack.Screen
            name="profile"
            options={{
              presentation: "modal",
              headerShown: true,
            }}
          />
          <Stack.Screen name="modal" options={{ presentation: "modal" }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </CartProvider>
  );
}
