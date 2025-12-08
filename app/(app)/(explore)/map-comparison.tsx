/**
 * Map Comparison Screen
 * 
 * MapLibre full-screen map with random markers in Iran.
 */

import { useState, useEffect, useMemo } from 'react';
import { View, Text } from 'react-native';
import { Stack } from 'expo-router';
import * as Location from 'expo-location';
import { MapLibreView, generateRandomMarkersInIran, calculateCenterFromMarkers, type MapLibreMarker } from '@ui/maps';

export default function MapComparisonScreen() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);

  // Generate random markers in Iran
  const markers = useMemo(() => generateRandomMarkersInIran(15), []);

  // Calculate center from markers
  const mapCenter = useMemo(() => calculateCenterFromMarkers(markers), [markers]);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const loc = await Location.getCurrentPositionAsync({});
        setLocation(loc);
      }
    })();
  }, []);

  const handleMarkerPress = (marker: MapLibreMarker) => {
    console.log('Marker pressed:', marker);
  };

  return (
    <View className="flex-1 bg-white dark:bg-black">
      <Stack.Screen
        options={{
          title: 'MapLibre Map',
          headerShown: true,
        }}
      />

      {/* Full-screen Map */}
      <View className="flex-1">
        <MapLibreView
          markers={markers}
          initialCenter={mapCenter}
          initialZoom={5}
          minZoom={3}
          maxZoom={18}
          showUserLocation={!!location}
          onMarkerPress={handleMarkerPress}
        />
      </View>

      {/* Info Overlay */}
      <View className="absolute bottom-4 left-4 right-4">
        <View className="bg-white/90 dark:bg-black/90 rounded-xl p-4 border border-gray-200 dark:border-gray-800 shadow-lg">
          <Text className="text-sm text-gray-900 dark:text-gray-100 font-semibold mb-1">
            🗺️ MapLibre React Native
          </Text>
          <Text className="text-xs text-gray-600 dark:text-gray-400">
            {markers.length} random markers across Iran
          </Text>
        </View>
        </View>
    </View>
  );
}

