import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import React, { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { View, TouchableOpacity, ActivityIndicator, Text } from 'react-native';
import { LeafletView, MapMarker, MapShape, MapLayer, LatLng, MapShapeType, MapLayerType, WebviewLeafletMessage } from 'react-native-leaflet-view';
import { useColorScheme } from '@hooks/useColorScheme';
import { useAppSelector } from '@store/hooks';
import { cacheTile, type MapLayer as CacheMapLayer } from '@/utils/mapTileCache';

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
    // Using Esri World Imagery - more reliable than ArcGIS REST
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: '&copy; <a href="https://www.esri.com/">Esri</a>, &copy; <a href="https://www.esri.com/">Maxar</a>, &copy; <a href="https://www.esri.com/">GeoEye</a>',
    // Alternative free satellite providers if Esri doesn't work:
    // - NASA GIBS: 'https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/BlueMarble_ShadedRelief_Bathymetry/default/{time}/{tileMatrixSet}/{z}/{y}/{x}.jpg'
    // - Esri World Imagery (alternative): 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
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
  autoCenter: _autoCenter = false,
}: MapViewProps) {
  const [isMapLoading, setIsMapLoading] = useState(true);
  const [mapLayer, setMapLayer] = useState<MapLayerName>('standard');
  const [userZoom, setUserZoom] = useState<number | null>(null); // User-controlled zoom
  const [userCenter, setUserCenter] = useState<LatLng | null>(null); // User-controlled center
  const [mapKey, setMapKey] = useState(0); // Key to force remount for auto-center
  
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const mapCacheEnabled = useAppSelector((state) => state.mapCache.enabled);
  
  // Ref to track last cached viewport
  const lastCachedViewport = useRef<{
    center: LatLng;
    zoom: number;
    layer: MapLayerName;
  } | null>(null);

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
    const points: LatLng[] = [];
    
    if (validWaypoints.length > 0) {
      validWaypoints.forEach((wp) => {
        points.push({ lat: wp.latitude, lng: wp.longitude });
      });
    } else if (location) {
      points.push({ lat: location.coords.latitude, lng: location.coords.longitude });
    }
    
    if (points.length === 0) return null;
    
    // Calculate bounds
    const lats = points.map((p) => p.lat);
    const lngs = points.map((p) => p.lng);
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);
    
    return {
      bounds: [[minLat, minLng], [maxLat, maxLng]] as [[number, number], [number, number]],
      center: { lat: (minLat + maxLat) / 2, lng: (minLng + maxLng) / 2 },
      zoom: validWaypoints.length > 1 ? 10 : 13,
    };
  }, [location, validWaypoints]);

  // Compute map center and zoom (prefer user values, fallback to bounds)
  const mapCenter = useMemo(() => {
    return userCenter || mapBounds?.center || DEFAULT_CENTER;
  }, [userCenter, mapBounds]);

  const currentZoom = useMemo(() => {
    return userZoom || mapBounds?.zoom || 13;
  }, [userZoom, mapBounds]);

  // Calculate visible tiles based on current viewport for caching
  const calculateVisibleTiles = useCallback((center: LatLng, zoom: number): Array<{ z: number; x: number; y: number }> => {
    const tiles: Array<{ z: number; x: number; y: number }> = [];
    const z = Math.floor(zoom);
    
    // Convert lat/lng to tile coordinates
    const lat2tile = (lat: number, z: number) => {
      return Math.floor(((1 - Math.log(Math.tan((lat * Math.PI) / 180) + 1 / Math.cos((lat * Math.PI) / 180)) / Math.PI) / 2) * Math.pow(2, z));
    };
    
    const lon2tile = (lon: number, z: number) => {
      return Math.floor(((lon + 180) / 360) * Math.pow(2, z));
    };
    
    const centerX = lon2tile(center.lng, z);
    const centerY = lat2tile(center.lat, z);
    
    // Get tiles in a 3x3 grid around center (visible area + buffer)
    const radius = 2;
    for (let dx = -radius; dx <= radius; dx++) {
      for (let dy = -radius; dy <= radius; dy++) {
        const x = centerX + dx;
        const y = centerY + dy;
        
        // Validate tile coordinates
        const maxTile = Math.pow(2, z);
        if (x >= 0 && x < maxTile && y >= 0 && y < maxTile) {
          tiles.push({ z, x, y });
        }
      }
    }
    
    return tiles;
  }, []);

  // Cache tiles when viewport changes
  useEffect(() => {
    if (!mapCacheEnabled) return;
    
    const currentViewport = { center: mapCenter, zoom: currentZoom, layer: mapLayer };
    
    // Check if viewport changed significantly
    const last = lastCachedViewport.current;
    if (last && 
        Math.abs(last.center.lat - mapCenter.lat) < 0.01 &&
        Math.abs(last.center.lng - mapCenter.lng) < 0.01 &&
        last.zoom === currentZoom &&
        last.layer === mapLayer) {
      return; // No significant change
    }
    
    lastCachedViewport.current = currentViewport;
    
    // Calculate and cache visible tiles
    const visibleTiles = calculateVisibleTiles(mapCenter, currentZoom);
    
    if (__DEV__) {
      console.log(`🗺️ Caching ${visibleTiles.length} tiles for viewport:`, {
        center: mapCenter,
        zoom: currentZoom,
        layer: mapLayer,
      });
    }
    
    // Cache tiles in background (don't await)
    visibleTiles.forEach((tile) => {
      const tileKey = { layer: mapLayer as CacheMapLayer, ...tile };
      cacheTile(tileKey).catch((error) => {
        if (__DEV__) {
          console.error('Error caching tile:', error, tileKey);
        }
      });
    });
  }, [mapCenter, currentZoom, mapLayer, mapCacheEnabled, calculateVisibleTiles]);

  // Simple JavaScript injection for bounds fitting
  const injectedJavaScript = useMemo(() => {
    if (!mapBounds) return '';
    
    const boundsStr = JSON.stringify(mapBounds.bounds);
    const maxZoom = mapBounds.zoom;
    
    return `
      (function() {
        if (window.leafletMap && window.leafletMap.fitBounds) {
          try {
            const bounds = ${boundsStr};
            window.leafletMap.fitBounds(bounds, { 
              padding: [50, 50],
              maxZoom: ${maxZoom},
              animate: true,
              duration: 0.5
            });
          } catch (e) {
            console.error('Error fitting bounds:', e);
          }
        }
      })();
      true;
    `;
  }, [mapBounds]);

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
    setUserZoom((prev) => Math.min((prev || currentZoom) + 1, 19));
  }, [currentZoom]);

  const handleZoomOut = useCallback(() => {
    setUserZoom((prev) => Math.max((prev || currentZoom) - 1, 2));
  }, [currentZoom]);

  const handleCenterLocation = useCallback(() => {
    // Reset user overrides and force re-center
    if (mapBounds) {
      setUserCenter(null);
      setUserZoom(null);
      setMapKey((prev) => prev + 1); // Force re-injection of JavaScript
    }
  }, [mapBounds]);

  const handleMapLayerChange = useCallback(() => {
    const layers: MapLayerName[] = ['standard', 'satellite', 'terrain'];
    const currentIndex = layers.indexOf(mapLayer);
    const nextLayer = layers[(currentIndex + 1) % layers.length] as MapLayerName;
    setMapLayer(nextLayer);
  }, [mapLayer]);

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
        key={mapKey} // Force remount for auto-center
        mapCenterPosition={mapCenter}
        zoom={currentZoom}
        mapLayers={mapLayers}
        mapMarkers={mapMarkers}
        mapShapes={mapShapes}
        zoomControl={false}
        attributionControl={true}
        injectedJavaScript={injectedJavaScript}
        onLoadEnd={() => {
          setIsMapLoading(false);
        }}
        onLoadStart={() => {
          setIsMapLoading(true);
        }}
        onMessageReceived={(message: WebviewLeafletMessage) => {
          try {
            // Update zoom when user interacts with map
            if (message.payload?.zoom !== undefined) {
              setUserZoom(message.payload.zoom);
            }
            
            // Update center when user moves map
            const payload = message.payload as any;
            if (payload?.mapCenter) {
              const center = payload.mapCenter;
              if (center.lat !== undefined && center.lng !== undefined) {
                setUserCenter({ lat: center.lat, lng: center.lng });
              }
            }
            
            // Log other messages in dev mode for debugging
            if (__DEV__ && message.msg !== 'onMove' && message.msg !== 'onZoom') {
              console.log('MapView message:', message.msg, message.payload);
            }
          } catch (error) {
            if (__DEV__) {
              console.error('Error handling map message:', error);
            }
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
