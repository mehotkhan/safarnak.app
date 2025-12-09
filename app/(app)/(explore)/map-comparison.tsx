/**
 * Map Comparison Screen
 * 
 * MapLibre full-screen map with random markers in Iran.
 */

import { MapLibreView, calculateCenterFromMarkers, generateRandomMarkersInIran, type MapLibreMarker } from '@ui/maps';
import * as Location from 'expo-location';
import { Stack } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { View } from 'react-native';

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
      </View>
  );
}

