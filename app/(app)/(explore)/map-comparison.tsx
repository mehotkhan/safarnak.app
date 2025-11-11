/**
 * Map Comparison Screen
 * 
 * Side-by-side comparison of Leaflet WebView vs Mapbox Native maps.
 * Demonstrates the difference in performance and features.
 */

import { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Stack } from 'expo-router';
import * as Location from 'expo-location';
import MapView from '@components/MapView'; // Leaflet WebView
import MapboxMapView from '@components/MapboxMapView'; // Mapbox Native
import { Ionicons } from '@expo/vector-icons';

type MapType = 'leaflet' | 'mapbox';

export default function MapComparisonScreen() {
  const [activeMap, setActiveMap] = useState<MapType>('mapbox');
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
        {/* Toggle Buttons */}
        <View className="flex-row p-4 gap-3">
          <TouchableOpacity
            className={`flex-1 py-3 px-4 rounded-xl ${
              activeMap === 'mapbox'
                ? 'bg-purple-500'
                : 'bg-gray-200 dark:bg-gray-800'
            }`}
            onPress={() => setActiveMap('mapbox')}
          >
            <View className="flex-row items-center justify-center gap-2">
              <Ionicons
                name="map"
                size={20}
                color={activeMap === 'mapbox' ? '#fff' : '#666'}
              />
              <Text
                className={`font-semibold ${
                  activeMap === 'mapbox'
                    ? 'text-white'
                    : 'text-gray-700 dark:text-gray-300'
                }`}
              >
                Mapbox Native
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            className={`flex-1 py-3 px-4 rounded-xl ${
              activeMap === 'leaflet'
                ? 'bg-green-500'
                : 'bg-gray-200 dark:bg-gray-800'
            }`}
            onPress={() => setActiveMap('leaflet')}
          >
            <View className="flex-row items-center justify-center gap-2">
              <Ionicons
                name="leaf"
                size={20}
                color={activeMap === 'leaflet' ? '#fff' : '#666'}
              />
              <Text
                className={`font-semibold ${
                  activeMap === 'leaflet'
                    ? 'text-white'
                    : 'text-gray-700 dark:text-gray-300'
                }`}
              >
                Leaflet WebView
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Info Banner */}
        <View className="mx-4 mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
          <Text className="text-sm text-blue-900 dark:text-blue-100 font-medium mb-2">
            📍 {activeMap === 'mapbox' ? 'Mapbox Native' : 'Leaflet WebView'}
          </Text>
          <Text className="text-xs text-blue-700 dark:text-blue-300">
            {activeMap === 'mapbox'
              ? '⚡ Native SDK - Better performance, offline maps, 3D tilt, smooth gestures'
              : '🍃 WebView-based - Lighter bundle, custom tile servers, web-compatible'}
          </Text>
        </View>

        {/* Map Container */}
        <View className="h-[500px] mx-4 mb-4 rounded-2xl overflow-hidden border-2 border-gray-200 dark:border-gray-800">
          {activeMap === 'mapbox' ? (
            <MapboxMapView
              location={location}
              waypoints={waypoints}
              showControls={true}
              showUserLocation={true}
              autoCenter={false}
            />
          ) : (
            <MapView
              location={location}
              waypoints={waypoints}
              showControls={true}
              autoCenter={false}
            />
          )}
        </View>

        {/* Feature Comparison */}
        <View className="px-4 pb-8">
          <Text className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
            Feature Comparison
          </Text>

          <View className="space-y-3">
            {/* Performance */}
            <View className="flex-row items-center justify-between p-3 bg-gray-100 dark:bg-gray-900 rounded-xl">
              <Text className="text-sm text-gray-700 dark:text-gray-300">
                Performance
              </Text>
              <View className="flex-row gap-4">
                <Text className="text-sm font-semibold text-purple-600">
                  ⚡ 60fps
                </Text>
                <Text className="text-sm text-gray-500">🐌 30fps</Text>
              </View>
            </View>

            {/* Offline Maps */}
            <View className="flex-row items-center justify-between p-3 bg-gray-100 dark:bg-gray-900 rounded-xl">
              <Text className="text-sm text-gray-700 dark:text-gray-300">
                Offline Maps
              </Text>
              <View className="flex-row gap-4">
                <Text className="text-sm font-semibold text-purple-600">✅ Yes</Text>
                <Text className="text-sm text-gray-500">⚠️ Manual</Text>
              </View>
            </View>

            {/* 3D/Tilt */}
            <View className="flex-row items-center justify-between p-3 bg-gray-100 dark:bg-gray-900 rounded-xl">
              <Text className="text-sm text-gray-700 dark:text-gray-300">
                3D/Tilt Views
              </Text>
              <View className="flex-row gap-4">
                <Text className="text-sm font-semibold text-purple-600">✅ Yes</Text>
                <Text className="text-sm text-gray-500">❌ No</Text>
              </View>
            </View>

            {/* Bundle Size */}
            <View className="flex-row items-center justify-between p-3 bg-gray-100 dark:bg-gray-900 rounded-xl">
              <Text className="text-sm text-gray-700 dark:text-gray-300">
                Bundle Size
              </Text>
              <View className="flex-row gap-4">
                <Text className="text-sm text-purple-600">~15MB</Text>
                <Text className="text-sm font-semibold text-green-600">~1MB</Text>
              </View>
            </View>

            {/* Battery Usage */}
            <View className="flex-row items-center justify-between p-3 bg-gray-100 dark:bg-gray-900 rounded-xl">
              <Text className="text-sm text-gray-700 dark:text-gray-300">
                Battery Usage
              </Text>
              <View className="flex-row gap-4">
                <Text className="text-sm font-semibold text-purple-600">
                  🔋 Optimized
                </Text>
                <Text className="text-sm text-gray-500">⚠️ Higher</Text>
              </View>
            </View>
          </View>

          {/* Recommendation */}
          <View className="mt-6 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-200 dark:border-purple-800">
            <Text className="text-sm font-semibold text-purple-900 dark:text-purple-100 mb-2">
              💡 Recommendation
            </Text>
            <Text className="text-xs text-purple-700 dark:text-purple-300 leading-5">
              Use <Text className="font-bold">Mapbox Native</Text> for production - better
              performance, offline support, and native feel. Use{' '}
              <Text className="font-bold">Leaflet</Text> for quick prototyping or when
              bundle size is critical.
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

