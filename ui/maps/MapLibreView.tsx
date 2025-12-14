/**
 * MapLibre MapView Component
 * 
 * Native MapLibre map component with annotation support.
 */

import { Ionicons } from '@expo/vector-icons';
import React, { useMemo, useState, useRef, useCallback } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { MapView, PointAnnotation, Camera, UserLocation } from '@maplibre/maplibre-react-native';
import { useColorScheme } from '@hooks/useColorScheme';
import MapLibreLayerSelector, { MAP_LAYER_OPTIONS, type MapLibreLayer } from './MapLibreLayerSelector';
import { getStyleForLayer } from './mapStyles';
import { calculateCenterFromMarkers } from './utils';

export interface MapLibreMarker {
  id: string;
  latitude: number;
  longitude: number;
  title?: string;
  onPress?: () => void;
}

interface MapLibreViewProps {
  markers?: MapLibreMarker[];
  initialCenter?: { latitude: number; longitude: number };
  initialZoom?: number;
  minZoom?: number;
  maxZoom?: number;
  style?: object;
  showUserLocation?: boolean;
  onMarkerPress?: (marker: MapLibreMarker) => void;
  showLayerSelector?: boolean;
  showControls?: boolean; // Show/hide map control buttons (zoom, center, layer change)
  initialLayer?: MapLibreLayer;
}

export default function MapLibreView({
  markers = [],
  initialCenter = { latitude: 35.6892, longitude: 51.3890 }, // Tehran default
  initialZoom = 6,
  minZoom = 3,
  maxZoom = 20,
  style,
  showUserLocation = false,
  onMarkerPress,
  showLayerSelector = true,
  showControls = true,
  initialLayer = 'standard',
}: MapLibreViewProps) {
  const [currentLayer, setCurrentLayer] = useState<MapLibreLayer>(initialLayer);
  const [userZoom, setUserZoom] = useState<number | null>(null);
  const [userCenter, setUserCenter] = useState<{ latitude: number; longitude: number } | null>(null);
  const [mapKey, setMapKey] = useState(0);
  
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const cameraRef = useRef<any>(null);

  // Calculate center from markers if available
  const mapCenter = useMemo(() => {
    if (userCenter) return userCenter;
    if (markers.length > 0) {
      return calculateCenterFromMarkers(markers);
    }
    return initialCenter;
  }, [userCenter, markers, initialCenter]);

  const currentZoom = useMemo(() => {
    return userZoom || initialZoom;
  }, [userZoom, initialZoom]);

  // Get style URL or object for current layer
  const mapStyle = useMemo(() => {
    const layerOption = MAP_LAYER_OPTIONS.find((opt) => opt.id === currentLayer);
    const styleUrlOrMarker = layerOption?.styleUrl || MAP_LAYER_OPTIONS[0].styleUrl;
    
    // If it's a special marker (standard, satellite, terrain), get the style object
    if (styleUrlOrMarker === 'standard' || styleUrlOrMarker === 'satellite' || styleUrlOrMarker === 'terrain') {
      const styleObj = getStyleForLayer(styleUrlOrMarker as 'standard' | 'satellite' | 'terrain');
      if (__DEV__) {
        console.log('[MapLibreView] Layer changed:', currentLayer, 'Using style object');
      }
      return styleObj;
    }
    
    // Otherwise, it's a URL string
    if (__DEV__) {
      console.log('[MapLibreView] Layer changed:', currentLayer, 'Style URL:', styleUrlOrMarker);
    }
    return styleUrlOrMarker;
  }, [currentLayer]);

  // Handle layer change with callback
  const handleLayerChange = (layer: MapLibreLayer) => {
    if (__DEV__) {
      console.log('[MapLibreView] handleLayerChange called with:', layer);
    }
    setCurrentLayer(layer);
  };

  const handleMarkerPress = (marker: MapLibreMarker) => {
    if (onMarkerPress) {
      onMarkerPress(marker);
    } else if (marker.onPress) {
      marker.onPress();
    }
  };

  // Map control handlers
  const handleZoomIn = useCallback(() => {
    setUserZoom((prev) => Math.min((prev || currentZoom) + 1, maxZoom));
  }, [currentZoom, maxZoom]);

  const handleZoomOut = useCallback(() => {
    setUserZoom((prev) => Math.max((prev || currentZoom) - 1, minZoom));
  }, [currentZoom, minZoom]);

  const handleCenterLocation = useCallback(() => {
    if (markers.length > 0) {
      const center = calculateCenterFromMarkers(markers);
      setUserCenter(center);
      setUserZoom(null);
      setMapKey((prev) => prev + 1);
    } else if (showUserLocation) {
      // Reset to initial center if user location is shown
      setUserCenter(null);
      setUserZoom(null);
      setMapKey((prev) => prev + 1);
    }
  }, [markers, showUserLocation]);

  return (
    <View className="flex-1" style={style}>
      <MapView
        key={`map-${mapKey}-${currentLayer}`} // Force remount when layer changes or map key changes
        mapStyle={mapStyle}
        style={{ flex: 1 }}
        logoEnabled={false}
        attributionEnabled={true}
        compassEnabled={true}
        zoomEnabled={true}
        scrollEnabled={true}
        pitchEnabled={true}
        rotateEnabled={true}
      >
        <Camera
          ref={cameraRef}
          key={`camera-${mapKey}`}
          zoomLevel={currentZoom}
          centerCoordinate={[mapCenter.longitude, mapCenter.latitude]}
          minZoomLevel={minZoom}
          maxZoomLevel={maxZoom}
          animationDuration={300}
        />

        {showUserLocation && (
          <UserLocation
            visible={true}
            animated={true}
          />
        )}

        {markers.map((marker) => (
          <PointAnnotation
            key={marker.id}
            id={marker.id}
            coordinate={[marker.longitude, marker.latitude]}
            title={marker.title}
            onSelected={() => handleMarkerPress(marker)}
          >
            <View className="items-center justify-center">
              {/* Place Name Label */}
              {marker.title && (
                <View className="mb-1 rounded-lg border border-gray-200 bg-white/95 px-2 py-1 shadow-md dark:border-gray-700 dark:bg-gray-900/95">
                  <Text className="text-xs font-semibold text-gray-900 dark:text-gray-100" numberOfLines={1}>
                    {marker.title}
                  </Text>
                </View>
              )}
              {/* Marker Icon */}
              <View className="size-6 rounded-full border-2 border-white bg-red-500 shadow-lg" />
            </View>
          </PointAnnotation>
        ))}
      </MapView>

      {/* Map Controls - Only show if showControls is true */}
      {showControls && (
        <>
          {/* Layer Selector */}
          {showLayerSelector && (
            <MapLibreLayerSelector
              currentLayer={currentLayer}
              onLayerChange={handleLayerChange}
              position="top-right"
              collapsed={true}
            />
          )}

          {/* Control Buttons */}
          <View className="absolute bottom-8 z-[100] flex-col gap-2 ltr:right-5 rtl:left-5">
            {/* Zoom In */}
            <TouchableOpacity
              className="size-12 items-center justify-center rounded-full bg-white shadow-lg dark:bg-gray-800"
              onPress={handleZoomIn}
              activeOpacity={0.7}
            >
              <Ionicons name="add" size={24} color={isDark ? '#fff' : '#333'} />
            </TouchableOpacity>

            {/* Zoom Out */}
            <TouchableOpacity
              className="size-12 items-center justify-center rounded-full bg-white shadow-lg dark:bg-gray-800"
              onPress={handleZoomOut}
              activeOpacity={0.7}
            >
              <Ionicons name="remove" size={24} color={isDark ? '#fff' : '#333'} />
            </TouchableOpacity>

            {/* Center on Location/Markers */}
            <TouchableOpacity
              className="size-12 items-center justify-center rounded-full bg-purple-500 shadow-lg"
              onPress={handleCenterLocation}
              activeOpacity={0.7}
              disabled={markers.length === 0 && !showUserLocation}
            >
              <Ionicons name="locate" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </>
      )}

      {/* Layer Selector only (when controls are hidden but layer selector should be shown) */}
      {!showControls && showLayerSelector && (
        <MapLibreLayerSelector
          currentLayer={currentLayer}
          onLayerChange={handleLayerChange}
          position="top-right"
          collapsed={true}
        />
      )}
    </View>
  );
}
