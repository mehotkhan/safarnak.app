/**
 * MapView Component (MapLibre-based)
 * 
 * Replaces the Leaflet WebView-based map with native MapLibre GL.
 * Maintains the same props interface for backward compatibility.
 */

import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import React, { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { View, TouchableOpacity, ActivityIndicator, Text } from 'react-native';
import { MapView as MLMapView, PointAnnotation, Camera, UserLocation, ShapeSource, LineLayer, SymbolLayer } from '@maplibre/maplibre-react-native';
import { useColorScheme } from '@hooks/useColorScheme';
import { getStyleForLayer } from './mapStyles';
import MapLibreLayerSelector, { type MapLibreLayer } from './MapLibreLayerSelector';

interface Waypoint {
  latitude: number;
  longitude: number;
  label?: string;
}

interface MapViewProps {
  location: Location.LocationObject | null;
  waypoints?: Waypoint[]; // Optional array of waypoints for route polyline
  showControls?: boolean; // Show/hide map control buttons (zoom, center, layer change)
  autoCenter?: boolean; // Automatically center map when data changes (default: false)
}

type MapLayerName = 'standard' | 'satellite' | 'terrain';

const DEFAULT_CENTER = { latitude: 35.6892, longitude: 51.3890 }; // Tehran, Iran

// Convert MapLayerName to MapLibreLayer
function mapLayerToMapLibreLayer(layer: MapLayerName): MapLibreLayer {
  switch (layer) {
    case 'standard':
      return 'standard';
    case 'satellite':
      return 'satellite';
    case 'terrain':
      return 'terrain';
    default:
      return 'standard';
  }
}

export default function MapView({
  location,
  waypoints,
  showControls = true,
  autoCenter = false,
}: MapViewProps) {
  const [isMapLoading, setIsMapLoading] = useState(true);
  const [mapLayer, setMapLayer] = useState<MapLayerName>('standard');
  const [userZoom, setUserZoom] = useState<number | null>(null);
  const [userCenter, setUserCenter] = useState<{ latitude: number; longitude: number } | null>(null);
  const [mapKey, setMapKey] = useState(0);
  
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const cameraRef = useRef<any>(null);

  // Filter and validate waypoints
  const validWaypoints = useMemo(() => {
    if (!waypoints || !Array.isArray(waypoints)) return [];
    return waypoints.filter(
      (wp) =>
        wp &&
        typeof wp.latitude === 'number' &&
        typeof wp.longitude === 'number' &&
        !isNaN(wp.latitude) &&
        !isNaN(wp.longitude)
    );
  }, [waypoints]);

  // Calculate bounds from waypoints or location
  const mapBounds = useMemo(() => {
    const points: Array<{ latitude: number; longitude: number }> = [];
    
    if (validWaypoints.length > 0) {
      validWaypoints.forEach((wp) => {
        points.push({ latitude: wp.latitude, longitude: wp.longitude });
      });
    } else if (location) {
      points.push({ 
        latitude: location.coords.latitude, 
        longitude: location.coords.longitude 
      });
    }
    
    if (points.length === 0) return null;
    
    // Calculate bounds
    const lats = points.map((p) => p.latitude);
    const lngs = points.map((p) => p.longitude);
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);
    
    return {
      bounds: [[minLat, minLng], [maxLat, maxLng]] as [[number, number], [number, number]],
      center: { latitude: (minLat + maxLat) / 2, longitude: (minLng + maxLng) / 2 },
      zoom: validWaypoints.length > 1 ? 10 : 13,
    };
  }, [location, validWaypoints]);

  // Compute map center and zoom
  const mapCenter = useMemo(() => {
    return userCenter || mapBounds?.center || DEFAULT_CENTER;
  }, [userCenter, mapBounds]);

  const currentZoom = useMemo(() => {
    return userZoom || mapBounds?.zoom || 13;
  }, [userZoom, mapBounds]);

  // Get map style based on layer
  const mapStyle = useMemo(() => {
    const mlLayer = mapLayerToMapLibreLayer(mapLayer);
    return getStyleForLayer(mlLayer);
  }, [mapLayer]);

  // Generate polyline coordinates for route
  const polylineCoordinates = useMemo(() => {
    if (validWaypoints.length < 2) return [];

    const coords: Array<[number, number]> = validWaypoints.map((wp) => [
      wp.longitude,
      wp.latitude,
    ]);
    
    return coords;
  }, [validWaypoints]);

  // Auto-center when bounds change (if autoCenter is enabled)
  useEffect(() => {
    if (autoCenter && mapBounds && cameraRef.current) {
      // Force camera update by changing key (use setTimeout to avoid sync setState)
      setTimeout(() => {
        setMapKey((prev) => prev + 1);
      }, 0);
    }
  }, [autoCenter, mapBounds]);

  // Map control handlers
  const handleZoomIn = useCallback(() => {
    setUserZoom((prev) => Math.min((prev || currentZoom) + 1, 19));
  }, [currentZoom]);

  const handleZoomOut = useCallback(() => {
    setUserZoom((prev) => Math.max((prev || currentZoom) - 1, 2));
  }, [currentZoom]);

  const handleCenterLocation = useCallback(() => {
    if (mapBounds) {
      setUserCenter(null);
      setUserZoom(null);
      setMapKey((prev) => prev + 1);
    }
  }, [mapBounds]);

  const handleMapLayerChange = useCallback(() => {
    const layers: MapLayerName[] = ['standard', 'satellite', 'terrain'];
    const currentIndex = layers.indexOf(mapLayer);
    const nextLayer = layers[(currentIndex + 1) % layers.length] as MapLayerName;
    setMapLayer(nextLayer);
  }, [mapLayer]);

  // Convert waypoints to markers
  const markers = useMemo(() => {
    const markerList: Array<{
      id: string;
      latitude: number;
      longitude: number;
      title?: string;
    }> = [];

    if (validWaypoints.length > 0) {
      validWaypoints.forEach((wp, index) => {
        markerList.push({
          id: `waypoint-${index}`,
          latitude: wp.latitude,
          longitude: wp.longitude,
          title: wp.label || `Step ${index + 1}`,
        });
      });
    } else if (location) {
      markerList.push({
        id: 'location',
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        title: 'Your Location',
      });
    }

    return markerList;
  }, [location, validWaypoints]);

  return (
    <View className="flex-1">
      {/* Loading Indicator */}
      {isMapLoading && (
        <View className="absolute inset-0 justify-center items-center bg-white/90 dark:bg-black/90 z-[1000]">
          <ActivityIndicator size="large" color="#8b5cf6" />
          <Text className="mt-2.5 text-base text-gray-800 dark:text-gray-200">Loading Map...</Text>
        </View>
      )}

      {/* MapLibre Map View */}
      <MLMapView
        key={`map-${mapKey}-${mapLayer}`}
        style={{ flex: 1 }}
        mapStyle={mapStyle}
        logoEnabled={false}
        attributionEnabled={true}
        compassEnabled={true}
        zoomEnabled={true}
        scrollEnabled={true}
        pitchEnabled={true}
        rotateEnabled={true}
        onDidFinishLoadingMap={() => {
          setIsMapLoading(false);
        }}
        onWillStartLoadingMap={() => {
          setIsMapLoading(true);
        }}
      >
        <Camera
          ref={cameraRef}
          key={`camera-${mapKey}`}
          zoomLevel={currentZoom}
          centerCoordinate={[mapCenter.longitude, mapCenter.latitude]}
          minZoomLevel={2}
          maxZoomLevel={19}
          animationDuration={autoCenter && mapBounds ? 500 : 0}
        />

        {/* User Location */}
        {location && (
          <UserLocation
            visible={true}
            animated={true}
          />
        )}

        {/* Route Polyline */}
        {polylineCoordinates.length >= 2 && (
          <ShapeSource
            id="route-source"
            shape={{
              type: 'FeatureCollection',
              features: [
                {
                  type: 'Feature',
                  geometry: {
                    type: 'LineString',
                    coordinates: polylineCoordinates,
                  },
                  properties: {},
                },
              ],
            }}
          >
            <LineLayer
              id="route-layer"
              style={{
                lineColor: '#8b5cf6',
                lineWidth: 4,
                lineOpacity: 0.8,
              }}
            />
          </ShapeSource>
        )}

        {/* Markers */}
        {markers.map((marker) => (
          <PointAnnotation
            key={marker.id}
            id={marker.id}
            coordinate={[marker.longitude, marker.latitude]}
            title={marker.title}
          >
            <View className="items-center justify-center">
              {/* Place Name Label */}
              {marker.title && (
                <View className="mb-1 px-2 py-1 bg-white/95 dark:bg-gray-900/95 rounded-lg border border-gray-200 dark:border-gray-700 shadow-md">
                  <Text className="text-xs font-semibold text-gray-900 dark:text-gray-100" numberOfLines={1}>
                    {marker.title}
                  </Text>
                </View>
              )}
              {/* Marker Icon */}
              <View className="w-8 h-8 bg-purple-500 rounded-full border-2 border-white shadow-lg items-center justify-center">
                <Ionicons name="location" size={16} color="#FFFFFF" />
              </View>
            </View>
          </PointAnnotation>
        ))}
      </MLMapView>

      {/* Map Controls - Only show if showControls is true */}
      {showControls && (
        <>
          {/* Layer Selector (replaces layer button) */}
          <MapLibreLayerSelector
            currentLayer={mapLayerToMapLibreLayer(mapLayer)}
            onLayerChange={(layer) => {
              // Convert MapLibreLayer back to MapLayerName
              if (layer === 'standard' || layer === 'satellite' || layer === 'terrain') {
                setMapLayer(layer);
              }
            }}
            position="top-right"
            collapsed={true}
          />

          {/* Control Buttons */}
        <View className="absolute bottom-8 ltr:right-5 rtl:left-5 flex-col z-[100] gap-2">
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
            disabled={!location && !validWaypoints.length}
          >
            <Ionicons name="locate" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
        </>
      )}
    </View>
  );
}
