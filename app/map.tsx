// Map Screen - Show stores on map
import { Stack, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import MapView, { Marker, PROVIDER_DEFAULT } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";
import { productsService } from "../services/products.service";
import { storesService } from "../services/stores.service";
import { ProductInStore, Store } from "../types";

export default function MapScreen() {
  const { storeId, productId } = useLocalSearchParams();
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [region, setRegion] = useState({
    latitude: 50.4501, // Kyiv default
    longitude: 30.5234,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
  });

  useEffect(() => {
    loadStores();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storeId, productId]);

  const loadStores = async () => {
    try {
      setLoading(true);

      if (storeId) {
        // Load single store
        const store = await storesService.getStore(storeId as string);
        setStores([store]);
        setRegion({
          latitude: store.latitude,
          longitude: store.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });
      } else if (productId) {
        // Load stores with this product
        const productStores = await productsService.getProductStores(
          productId as string
        );
        const storesList = productStores.map((ps: ProductInStore) => ps.store);
        setStores(storesList);

        if (storesList.length > 0) {
          // Center on first store
          setRegion({
            latitude: storesList[0].latitude,
            longitude: storesList[0].longitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          });
        }
      } else {
        // Load all stores
        const allStores = await storesService.getAllStores();
        setStores(allStores);
      }
    } catch (error) {
      console.error("Failed to load stores:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <Stack.Screen options={{ title: "Карта магазинів" }} />
        <ActivityIndicator size="large" color="#2196F3" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <Stack.Screen
        options={{
          title: "Карта магазинів",
          headerBackTitle: "Назад",
        }}
      />
      <MapView
        provider={PROVIDER_DEFAULT}
        style={styles.map}
        initialRegion={region}
        showsUserLocation
        showsMyLocationButton
      >
        {stores.map((store) => (
          <Marker
            key={store.id}
            coordinate={{
              latitude: store.latitude,
              longitude: store.longitude,
            }}
            title={store.name}
            description={store.address}
          />
        ))}
      </MapView>

      {stores.length === 0 && (
        <View style={styles.emptyOverlay}>
          <Text style={styles.emptyText}>Магазинів не знайдено</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  map: {
    flex: 1,
  },
  emptyOverlay: {
    position: "absolute",
    top: 100,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#999",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
});
