/**
 * MapLibre MapView Component
 * 
 * Native MapLibre map component with annotation support.
 */

import React, { useMemo, useState } from 'react';
import { View } from 'react-native';
import { MapView, PointAnnotation, Camera, UserLocation } from '@maplibre/maplibre-react-native';
import MapLibreLayerSelector, { MAP_LAYER_OPTIONS, type MapLibreLayer } from './MapLibreLayerSelector';
import { getStyleForLayer } from './mapStyles';

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
  initialLayer = 'standard',
}: MapLibreViewProps) {
  const [currentLayer, setCurrentLayer] = useState<MapLibreLayer>(initialLayer);

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

  return (
    <View className="flex-1" style={style}>
      <MapView
        key={`map-${currentLayer}`} // Force remount when layer changes (even if style URL is same)
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
          zoomLevel={initialZoom}
          centerCoordinate={[initialCenter.longitude, initialCenter.latitude]}
          minZoomLevel={minZoom}
          maxZoomLevel={maxZoom}
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
              <View className="w-6 h-6 bg-red-500 rounded-full border-2 border-white shadow-lg" />
            </View>
          </PointAnnotation>
        ))}
      </MapView>

      {/* Layer Selector */}
      {showLayerSelector && (
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
