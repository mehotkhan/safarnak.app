import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { View, TouchableOpacity, ActivityIndicator, Text } from 'react-native';
import { WebView } from 'react-native-webview';
import { useColorScheme } from '@hooks/useColorScheme';

interface MapViewProps {
  location: Location.LocationObject | null;
}

type MapLayer = 'standard' | 'satellite' | 'terrain';

const MAP_LAYERS = {
  standard: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
  terrain: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
} as const;

const DEFAULT_CENTER = { latitude: 35.6892, longitude: 51.3890 }; // Tehran, Iran

export default function MapView({ location }: MapViewProps) {
  const [isMapLoading, setIsMapLoading] = useState(true);
  const [mapLayer, setMapLayer] = useState<MapLayer>('standard');
  const webViewRef = useRef<WebView>(null);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  // Generate HTML content for the map
  const generateMapHTML = useCallback(() => {
    const lat = location?.coords.latitude || DEFAULT_CENTER.latitude;
    const lng = location?.coords.longitude || DEFAULT_CENTER.longitude;
    const hasLocation = !!location;

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" 
    integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" 
    crossorigin=""/>
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
    integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo="
    crossorigin=""></script>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body { height: 100%; width: 100%; overflow: hidden; }
    #map { 
      position: absolute;
      top: 0; left: 0; right: 0; bottom: 0;
      width: 100%; height: 100%;
    }
  </style>
</head>
<body>
  <div id="map"></div>
  <script>
    try {
      var map = L.map('map', {
        center: [${lat}, ${lng}],
        zoom: 13,
        zoomControl: false
      });
      
      var currentTileLayer = L.tileLayer('${MAP_LAYERS.standard}', {
        attribution: '',
        maxZoom: 19,
        minZoom: 2
      }).addTo(map);

      var marker${hasLocation ? ` = L.marker([${lat}, ${lng}]).addTo(map).bindPopup('<b>Your Location</b>').openPopup()` : ''};
      
      setTimeout(() => map.invalidateSize(), 100);
    } catch (error) {
      console.error('Map initialization error:', error);
    }
  </script>
</body>
</html>`;
  }, [location]);

  // Update marker position when location changes
  useEffect(() => {
    if (!location || !webViewRef.current) return;

    const { latitude, longitude } = location.coords;
    webViewRef.current.injectJavaScript(`
      if (typeof map !== 'undefined') {
        map.setView([${latitude}, ${longitude}], map.getZoom());
        if (typeof marker !== 'undefined') {
          marker.setLatLng([${latitude}, ${longitude}]);
        } else {
          marker = L.marker([${latitude}, ${longitude}])
            .addTo(map)
            .bindPopup('<b>Your Location</b>')
            .openPopup();
        }
      }
      true;
    `);
  }, [location]);

  // Map control handlers
  const executeMapCommand = useCallback((command: string) => {
    webViewRef.current?.injectJavaScript(`
      if (typeof map !== 'undefined') {
        ${command}
      }
      true;
    `);
  }, []);

  const handleZoomIn = useCallback(() => {
    executeMapCommand('map.zoomIn();');
  }, [executeMapCommand]);

  const handleZoomOut = useCallback(() => {
    executeMapCommand('map.zoomOut();');
  }, [executeMapCommand]);

  const handleCenterLocation = useCallback(() => {
    if (!location) return;
    
    const { latitude, longitude } = location.coords;
    executeMapCommand(`
      map.setView([${latitude}, ${longitude}], 15);
      if (typeof marker !== 'undefined') {
        marker.setLatLng([${latitude}, ${longitude}]).openPopup();
      }
    `);
  }, [location, executeMapCommand]);

  const handleMapLayerChange = useCallback(() => {
    const layers: MapLayer[] = ['standard', 'satellite', 'terrain'];
    const currentIndex = layers.indexOf(mapLayer);
    const nextLayer = layers[(currentIndex + 1) % layers.length] as MapLayer;
    
    setMapLayer(nextLayer);
    
    executeMapCommand(`
      if (typeof currentTileLayer !== 'undefined') {
        map.removeLayer(currentTileLayer);
        currentTileLayer = L.tileLayer('${MAP_LAYERS[nextLayer]}', {
          attribution: '',
          maxZoom: 19,
          minZoom: 2
        }).addTo(map);
      }
    `);
  }, [mapLayer, executeMapCommand]);

  return (
    <View className="flex-1">
      {/* Loading Indicator */}
      {isMapLoading && (
        <View className="absolute inset-0 justify-center items-center bg-white/90 dark:bg-black/90 z-[1000]">
          <ActivityIndicator size="large" color="#8b5cf6" />
          <Text className="mt-2.5 text-base text-gray-800 dark:text-gray-200">
            Loading Map...
          </Text>
        </View>
      )}

      {/* Map WebView */}
      <WebView
        ref={webViewRef}
        source={{ html: generateMapHTML(), baseUrl: 'https://openstreetmap.org' }}
        className="flex-1"
        javaScriptEnabled={true}
        domStorageEnabled={true}
        originWhitelist={['*']}
        startInLoadingState={true}
        onLoadEnd={() => setIsMapLoading(false)}
        onError={() => setIsMapLoading(false)}
      />

      {/* Map Controls */}
      <View className="absolute bottom-8 right-5 flex-col z-[100] gap-2">
        {/* Zoom In */}
        <TouchableOpacity
          className="w-12 h-12 rounded-full bg-white dark:bg-gray-800 justify-center items-center shadow-lg"
          onPress={handleZoomIn}
          activeOpacity={0.7}
        >
          <Ionicons name="add" size={24} color={isDark ? '#fff' : '#333'} />
        </TouchableOpacity>

        {/* Zoom Out */}
        <TouchableOpacity
          className="w-12 h-12 rounded-full bg-white dark:bg-gray-800 justify-center items-center shadow-lg"
          onPress={handleZoomOut}
          activeOpacity={0.7}
        >
          <Ionicons name="remove" size={24} color={isDark ? '#fff' : '#333'} />
        </TouchableOpacity>

        {/* Center on Location */}
        <TouchableOpacity
          className="w-12 h-12 rounded-full bg-purple-500 justify-center items-center shadow-lg"
          onPress={handleCenterLocation}
          activeOpacity={0.7}
          disabled={!location}
        >
          <Ionicons name="locate" size={24} color="#FFFFFF" />
        </TouchableOpacity>

        {/* Change Map Layer */}
        <TouchableOpacity
          className="w-12 h-12 rounded-full bg-blue-500 justify-center items-center shadow-lg"
          onPress={handleMapLayerChange}
          activeOpacity={0.7}
        >
          <Ionicons name="layers" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
