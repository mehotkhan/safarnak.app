/**
 * Map Comparison Screen
 * 
 * Leaflet map demo screen.
 */

import { useState, useEffect } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Stack } from 'expo-router';
import * as Location from 'expo-location';
import { MapView } from '@ui/maps'; // Leaflet WebView

export default function MapComparisonScreen() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);

  // Sample waypoints for testing (Tehran → Darband → Tochal)
  const waypoints = [
    { latitude: 35.6892, longitude: 51.3890, label: 'Tehran City Center' },
    { latitude: 35.7719, longitude: 51.3947, label: 'Darband' },
    { latitude: 35.8892, longitude: 51.3947, label: 'Tochal Peak' },
  ];

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const loc = await Location.getCurrentPositionAsync({});
        setLocation(loc);
      }
    })();
  }, []);

  return (
    <View className="flex-1 bg-white dark:bg-black">
      <Stack.Screen
        options={{
          title: 'Map Comparison',
          headerShown: true,
        }}
      />

      <ScrollView className="flex-1">
        {/* Info Banner */}
        <View className="mx-4 mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
          <Text className="text-sm text-blue-900 dark:text-blue-100 font-medium mb-2">
            📍 Leaflet WebView
          </Text>
          <Text className="text-xs text-blue-700 dark:text-blue-300">
            🍃 WebView-based map - Lighter bundle, custom tile servers, web-compatible
          </Text>
        </View>

        {/* Map Container */}
        <View className="h-[500px] mx-4 mb-4 rounded-2xl overflow-hidden border-2 border-gray-200 dark:border-gray-800">
          <MapView
            location={location}
            waypoints={waypoints}
            showControls={true}
            autoCenter={false}
          />
        </View>

        <View className="px-4 pb-8" />
      </ScrollView>
    </View>
  );
}

