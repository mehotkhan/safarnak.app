import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { View, TouchableOpacity, ActivityIndicator, Text } from 'react-native';
import { LeafletView, MapMarker, MapShape, MapLayer, LatLng, MapShapeType, MapLayerType } from 'react-native-leaflet-view';
import { useColorScheme } from '@hooks/useColorScheme';
import { useAppSelector } from '@store/hooks';

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

const MAP_LAYER_CONFIGS: Record<MapLayerName, { url: string; attribution: string }> = {
  standard: {
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  },
  satellite: {
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: '&copy; <a href="https://www.esri.com/">Esri</a>',
  },
  terrain: {
    url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a>',
  },
};

const DEFAULT_CENTER: LatLng = { lat: 35.6892, lng: 51.3890 }; // Tehran, Iran

// Bezier curve utility functions for curved polylines
interface Point {
  latitude: number;
  longitude: number;
}

function createBezierCurve(
  start: Point,
  end: Point,
  controlPoint1: Point,
  controlPoint2: Point,
  numPoints: number
): Point[] {
  const points: Point[] = [];
  for (let i = 0; i <= numPoints; i++) {
    const t = i / numPoints;
    const mt = 1 - t;
    const mt2 = mt * mt;
    const mt3 = mt2 * mt;
    const t2 = t * t;
    const t3 = t2 * t;

    const latitude =
      mt3 * start.latitude +
      3 * mt2 * t * controlPoint1.latitude +
      3 * mt * t2 * controlPoint2.latitude +
      t3 * end.latitude;
    const longitude =
      mt3 * start.longitude +
      3 * mt2 * t * controlPoint1.longitude +
      3 * mt * t2 * controlPoint2.longitude +
      t3 * end.longitude;

    points.push({ latitude, longitude });
  }
  return points;
}

function generateCurvedRoute(coords: Point[]): LatLng[] {
  if (coords.length < 2) {
    return coords.map((c) => ({ lat: c.latitude, lng: c.longitude }));
  }

  const curvedCoords: Point[] = [coords[0]];

  for (let i = 0; i < coords.length - 1; i++) {
    const start = coords[i];
    const end = coords[i + 1];

    const dx = end.longitude - start.longitude;
    const dy = end.latitude - start.latitude;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist === 0) {
      continue;
    }

    const offset = dist * 0.15;
    const perpX = (-dy / dist) * offset;
    const perpY = (dx / dist) * offset;
    const midLat = (start.latitude + end.latitude) / 2;
    const midLng = (start.longitude + end.longitude) / 2;

    const control1: Point = { latitude: midLat + perpX, longitude: midLng + perpY };
    const control2: Point = { latitude: midLat + perpX, longitude: midLng + perpY };

    const curvePoints = createBezierCurve(start, end, control1, control2, 20);
    for (let j = 1; j < curvePoints.length; j++) {
      curvedCoords.push(curvePoints[j]);
    }
  }

  return curvedCoords.map((c) => ({ lat: c.latitude, lng: c.longitude }));
}

export default function MapView({
  location,
  waypoints,
  showControls = true,
  autoCenter = false,
}: MapViewProps) {
  const [isMapLoading, setIsMapLoading] = useState(true);
  const [mapLayer, setMapLayer] = useState<MapLayerName>('standard');
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const mapCacheEnabled = useAppSelector((state) => state.mapCache.enabled);

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

  // Calculate initial center and zoom
  const mapCenter = useMemo((): LatLng => {
    if (validWaypoints.length > 0) {
      return { lat: validWaypoints[0].latitude, lng: validWaypoints[0].longitude };
    } else if (location) {
      return { lat: location.coords.latitude, lng: location.coords.longitude };
    }
    return DEFAULT_CENTER;
  }, [location, validWaypoints]);

  const initialZoom = useMemo(() => {
    if (validWaypoints.length > 0) return 10;
    if (location) return 13;
    return 13;
  }, [location, validWaypoints]);

  const [currentZoom, setCurrentZoom] = useState(initialZoom);

  // Update zoom when initialZoom changes
  useEffect(() => {
    setCurrentZoom(initialZoom);
  }, [initialZoom]);

  // Generate curved polyline coordinates
  const polylineCoordinates = useMemo(() => {
    if (validWaypoints.length < 2) return [];

    const coords: Point[] = validWaypoints.map((wp) => ({
      latitude: wp.latitude,
      longitude: wp.longitude,
    }));

    try {
      return generateCurvedRoute(coords);
    } catch (error) {
      console.error('Error generating curved route:', error);
      return coords.map((c) => ({ lat: c.latitude, lng: c.longitude }));
    }
  }, [validWaypoints]);

  // Convert waypoints to MapMarker format
  const mapMarkers = useMemo((): MapMarker[] => {
    const markers: MapMarker[] = [];

    if (validWaypoints.length > 0) {
      validWaypoints.forEach((wp, index) => {
        markers.push({
          id: `waypoint-${index}`,
          position: { lat: wp.latitude, lng: wp.longitude },
          icon: '📍',
          size: [32, 32],
          title: wp.label || `Step ${index + 1}`,
        });
      });
    } else if (location) {
      markers.push({
        id: 'location',
        position: { lat: location.coords.latitude, lng: location.coords.longitude },
        icon: '📍',
        size: [32, 32],
        title: 'Your Location',
      });
    }

    return markers;
  }, [location, validWaypoints]);

  // Create polyline shape for route
  const mapShapes = useMemo((): MapShape[] => {
    if (polylineCoordinates.length < 2) return [];

    return [
      {
        id: 'route',
        shapeType: MapShapeType.POLYLINE,
        positions: polylineCoordinates,
        color: '#8b5cf6',
      },
    ];
  }, [polylineCoordinates]);

  // Create map layer configuration
  const mapLayers = useMemo((): MapLayer[] => {
    const config = MAP_LAYER_CONFIGS[mapLayer];
    return [
      {
        id: 'main-layer',
        baseLayer: true,
        baseLayerIsChecked: true,
        baseLayerName: mapLayer,
        layerType: MapLayerType.TILE_LAYER,
        url: config.url,
        attribution: config.attribution,
        minZoom: 2,
        maxZoom: 19,
      },
    ];
  }, [mapLayer]);

  // Map control handlers
  const handleZoomIn = useCallback(() => {
    setCurrentZoom((prev) => Math.min(prev + 1, 19));
  }, []);

  const handleZoomOut = useCallback(() => {
    setCurrentZoom((prev) => Math.max(prev - 1, 2));
  }, []);

  const handleCenterLocation = useCallback(() => {
    // Center will be handled by mapCenterPosition prop
  }, []);

  const handleMapLayerChange = useCallback(() => {
    const layers: MapLayerName[] = ['standard', 'satellite', 'terrain'];
    const currentIndex = layers.indexOf(mapLayer);
    const nextLayer = layers[(currentIndex + 1) % layers.length] as MapLayerName;
    setMapLayer(nextLayer);
  }, [mapLayer]);

  const hasLocation = !!location;
  const hasWaypoints = validWaypoints.length > 0;

  return (
    <View className="flex-1">
      {/* Loading Indicator */}
      {isMapLoading && (
        <View className="absolute inset-0 justify-center items-center bg-white/90 dark:bg-black/90 z-[1000]">
          <ActivityIndicator size="large" color="#8b5cf6" />
          <Text className="mt-2.5 text-base text-gray-800 dark:text-gray-200">Loading Map...</Text>
        </View>
      )}

      {/* Leaflet Map View */}
      <LeafletView
        mapCenterPosition={mapCenter}
        zoom={currentZoom}
        mapLayers={mapLayers}
        mapMarkers={mapMarkers}
        mapShapes={mapShapes}
        zoomControl={false}
        attributionControl={true}
        onLoadEnd={() => {
          setIsMapLoading(false);
        }}
        onLoadStart={() => {
          setIsMapLoading(true);
        }}
        onMessageReceived={(message) => {
          // Handle zoom changes from map
          if (message.payload?.zoom) {
            setCurrentZoom(message.payload.zoom);
          }
        }}
        renderLoading={() => (
          <View className="flex-1 justify-center items-center bg-white dark:bg-black">
            <ActivityIndicator size="large" color="#8b5cf6" />
            <Text className="mt-2.5 text-base text-gray-800 dark:text-gray-200">Loading Map...</Text>
          </View>
        )}
      />

      {/* Map Controls - Only show if showControls is true */}
      {showControls && (
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
            disabled={!location && !validWaypoints.length}
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
      )}
    </View>
  );
}
