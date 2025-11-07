import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { View, TouchableOpacity, ActivityIndicator, Text } from 'react-native';
import { LeafletView, MapMarker, MapShape, MapLayer, LatLng, MapShapeType, MapLayerType, WebviewLeafletMessage } from 'react-native-leaflet-view';
import { useColorScheme } from '@hooks/useColorScheme';
import { useAppSelector } from '@store/hooks';
import { cacheTile, getCachedTilePath, isTileCached, type MapLayer as CacheMapLayer } from '@/utils/mapTileCache';
import * as FileSystem from 'expo-file-system';

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

  // Calculate bounds from waypoints or location for auto-zoom
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
    
    return [[minLat, minLng], [maxLat, maxLng]] as [[number, number], [number, number]];
  }, [location, validWaypoints]);

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
  const [mapReady, setMapReady] = useState(false);
  const [centerTrigger, setCenterTrigger] = useState(0); // Counter to trigger center action
  const [shouldCenter, setShouldCenter] = useState(false); // Flag to trigger center without remount

  // Update zoom when initialZoom changes
  useEffect(() => {
    setCurrentZoom(initialZoom);
  }, [initialZoom]);

  // Tile caching is handled via injectedJavaScript - tiles are cached after they load

  // Auto-fit bounds when map is ready and bounds are available
  // Always auto-zoom to show selected points (waypoints or location)
  // Also triggered when centerTrigger changes (button click)
  const injectedJavaScript = useMemo(() => {
    const boundsStr = mapBounds ? JSON.stringify(mapBounds) : 'null';
    const trigger = centerTrigger; // Capture current trigger value
    const shouldCenterNow = shouldCenter; // Capture shouldCenter flag
    const maxZoom = validWaypoints.length > 1 ? 18 : 19;
    const cacheEnabled = mapCacheEnabled ? 'true' : 'false';
    const currentLayer = mapLayer;
    
    return `
      (function() {
        const bounds = ${boundsStr};
        const maxZoomLevel = ${maxZoom};
        const cacheEnabled = ${cacheEnabled};
        const currentLayer = '${currentLayer}';
        
        // Set up tile caching - cache tiles after they load
        if (cacheEnabled) {
          function setupTileCaching() {
            if (!window.leafletMap) {
              console.log('Tile cache: Map not ready, retrying...');
              setTimeout(setupTileCaching, 500);
              return;
            }
            
            console.log('Tile cache: Setting up tile caching...');
            let tileLayerFound = false;
            
            // Try to find and attach to tile layers
            window.leafletMap.eachLayer(function(layer) {
              // Check if this is a tile layer (L.TileLayer)
              if (layer._url && typeof layer.on === 'function') {
                tileLayerFound = true;
                console.log('Tile cache: Found tile layer:', layer._url);
                
                // Remove existing listener if any
                if (typeof layer.off === 'function') {
                  layer.off('tileload');
                }
                
                // Listen for tile load events
                layer.on('tileload', function(e) {
                  try {
                    const tile = e.tile;
                    if (!tile) return;
                    
                    const url = tile.src || tile.currentSrc || tile.getAttribute('src') || '';
                    
                    if (!url) {
                      console.warn('Tile cache: No URL found for tile');
                      return;
                    }
                    
                    console.log('Tile cache: Tile loaded:', url);
                    
                    // Extract tile coordinates from URL
                    // Handle different URL formats:
                    // OpenStreetMap: /{z}/{x}/{y}.png
                    // ArcGIS: /tile/{z}/{y}/{x}
                    let z, x, y;
                    
                    // Try standard format first: /{z}/{x}/{y}.png
                    let match = url.match(/\\/(\\d+)\\/(\\d+)\\/(\\d+)\\.(png|jpg|jpeg)/);
                    
                    if (match) {
                      z = parseInt(match[1]);
                      x = parseInt(match[2]);
                      y = parseInt(match[3]);
                    } else {
                      // Try ArcGIS format: /tile/{z}/{y}/{x}
                      match = url.match(/tile\\/(\\d+)\\/(\\d+)\\/(\\d+)/);
                      if (match) {
                        z = parseInt(match[1]);
                        y = parseInt(match[2]); // Note: ArcGIS uses y then x
                        x = parseInt(match[3]);
                      } else {
                        // Try another format without extension
                        match = url.match(/\\/(\\d+)\\/(\\d+)\\/(\\d+)(?:\\/|$)/);
                        if (match) {
                          z = parseInt(match[1]);
                          x = parseInt(match[2]);
                          y = parseInt(match[3]);
                        }
                      }
                    }
                    
                    if (z !== undefined && x !== undefined && y !== undefined) {
                      console.log('Tile cache: Parsed coordinates:', { z, x, y, layer: currentLayer });
                      
                      // Send to React Native to cache
                      if (window.ReactNativeWebView) {
                        const message = {
                          type: 'cacheTile',
                          tileKey: { 
                            layer: currentLayer, 
                            z: z, 
                            x: x, 
                            y: y 
                          },
                          url: url
                        };
                        window.ReactNativeWebView.postMessage(JSON.stringify(message));
                        console.log('Tile cache: Sent cache request:', message);
                      } else {
                        console.warn('Tile cache: ReactNativeWebView not available');
                      }
                    } else {
                      console.warn('Tile cache: Could not parse tile coordinates from URL:', url);
                    }
                  } catch (err) {
                    console.error('Tile cache: Error in tile caching:', err);
                  }
                });
                
                // Also listen for tileloadstart to catch tiles earlier
                layer.on('tileloadstart', function(e) {
                  console.log('Tile cache: Tile load started');
                });
              }
            });
            
            if (!tileLayerFound) {
              console.warn('Tile cache: No tile layer found, retrying...');
              setTimeout(setupTileCaching, 1000);
            } else {
              console.log('Tile cache: Setup complete');
            }
          }
          
          // Set up caching after map is ready
          if (window.leafletMap) {
            // Wait a bit for layers to be added
            setTimeout(setupTileCaching, 500);
          } else {
            // Wait for map to be ready
            setTimeout(setupTileCaching, 1000);
          }
          
          // Re-setup when layers change
          if (window.leafletMap && typeof window.leafletMap.on === 'function') {
            window.leafletMap.on('layeradd', function() {
              console.log('Tile cache: Layer added, re-setting up caching...');
              setTimeout(setupTileCaching, 200);
            });
          }
        } else {
          console.log('Tile cache: Caching disabled');
        }
        
        function fitMapBounds() {
          if (window.leafletMap && bounds) {
            try {
              window.leafletMap.fitBounds(bounds, { 
                padding: [50, 50],
                maxZoom: maxZoomLevel
              });
            } catch (e) {
              console.error('Error fitting bounds:', e);
            }
          }
        }
        
        // Store function and bounds globally so they can be called later
        window.fitMapToWaypoints = fitMapBounds;
        window.mapBounds = bounds;
        window.mapMaxZoom = maxZoomLevel;
        
        // Store current trigger value - this gets updated when injectedJavaScript re-runs
        const currentTrigger = ${trigger};
        const shouldCenterNow = ${shouldCenterNow};
        const previousTrigger = window.centerTrigger || 0;
        
        // Update stored bounds when they change
        window.mapBounds = bounds;
        window.mapMaxZoom = maxZoomLevel;
        window.centerTrigger = currentTrigger;
        
        // Try immediately if bounds exist (initial load)
        if (bounds && previousTrigger === 0) {
          fitMapBounds();
          setTimeout(fitMapBounds, 300);
          setTimeout(fitMapBounds, 800);
        }
        
        // If shouldCenter flag is set or trigger changed (button clicked), call fitBounds immediately
        if ((shouldCenterNow || currentTrigger > previousTrigger) && bounds) {
          // Button was clicked - center the map immediately
          setTimeout(function() {
            if (window.leafletMap && window.mapBounds) {
              try {
                window.leafletMap.fitBounds(window.mapBounds, { 
                  padding: [50, 50],
                  maxZoom: window.mapMaxZoom
                });
              } catch (e) {
                console.error('Error fitting bounds:', e);
              }
            }
          }, 50);
          setTimeout(function() {
            if (window.leafletMap && window.mapBounds) {
              try {
                window.leafletMap.fitBounds(window.mapBounds, { 
                  padding: [50, 50],
                  maxZoom: window.mapMaxZoom
                });
              } catch (e) {
                console.error('Error fitting bounds:', e);
              }
            }
          }, 200);
          setTimeout(function() {
            if (window.leafletMap && window.mapBounds) {
              try {
                window.leafletMap.fitBounds(window.mapBounds, { 
                  padding: [50, 50],
                  maxZoom: window.mapMaxZoom
                });
              } catch (e) {
                console.error('Error fitting bounds:', e);
              }
            }
          }, 500);
        }
      })();
      true; // Required for injected JavaScript
    `;
  }, [mapBounds, validWaypoints.length, centerTrigger, shouldCenter, mapCacheEnabled, mapLayer]);

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
    // Fit bounds to show all waypoints or center on location
    if (mapBounds) {
      // Set flag to trigger center action
      setShouldCenter(true);
      // Also update trigger to ensure injectedJavaScript sees the change
      setCenterTrigger((prev) => prev + 1);
      // Reset flag after a short delay
      setTimeout(() => setShouldCenter(false), 1000);
    }
  }, [mapBounds]);

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
        injectedJavaScript={injectedJavaScript}
        onLoadEnd={() => {
          setIsMapLoading(false);
          setMapReady(true);
        }}
        onLoadStart={() => {
          setIsMapLoading(true);
          setMapReady(false);
        }}
        onMessageReceived={async (message: WebviewLeafletMessage) => {
          // Handle zoom changes from map
          if (message.payload?.zoom) {
            setCurrentZoom(message.payload.zoom);
          }
          
          // Handle map ready event - auto-fit bounds when map is ready
          if (message.msg === 'MAP_READY' && mapBounds) {
            // Bounds will be fitted via injectedJavaScript
          }
          
          // Handle tile caching requests
          // The library parses messages as WebviewLeafletMessage, but our custom messages
          // might come through in different formats. Check all possible locations.
          try {
            const msgAny = message as any;
            
            // Log all messages in dev mode to debug
            if (__DEV__ && mapCacheEnabled) {
              console.log('MapView received message:', JSON.stringify(msgAny));
            }
            
            // Check if message has our custom type directly
            let cacheData: any = null;
            if (msgAny.type === 'cacheTile') {
              cacheData = msgAny;
            } 
            // Check payload
            else if (msgAny.payload && msgAny.payload.type === 'cacheTile') {
              cacheData = msgAny.payload;
            }
            // Check if msg field contains our JSON
            else if (msgAny.msg && typeof msgAny.msg === 'string') {
              try {
                const parsed = JSON.parse(msgAny.msg);
                if (parsed && parsed.type === 'cacheTile') {
                  cacheData = parsed;
                }
              } catch {
                // Not JSON, ignore
              }
            }
            // Check event data
            else if (msgAny.event && msgAny.event.type === 'cacheTile') {
              cacheData = msgAny.event;
            }
            
            if (cacheData && cacheData.type === 'cacheTile' && cacheData.tileKey && mapCacheEnabled) {
              // Cache tile in background
              const layer = cacheData.tileKey.layer as CacheMapLayer;
              const key = { 
                layer, 
                z: cacheData.tileKey.z, 
                x: cacheData.tileKey.x, 
                y: cacheData.tileKey.y 
              };
              
              if (__DEV__) {
                console.log('✅ Caching tile:', key);
              }
              
              // Cache tile asynchronously (don't await to avoid blocking)
              cacheTile(key)
                .then((success) => {
                  if (__DEV__) {
                    if (success) {
                      console.log('✅ Tile cached successfully:', key);
                    } else {
                      console.log('⚠️ Tile cache failed (may already be cached):', key);
                    }
                  }
                })
                .catch((error) => {
                  if (__DEV__) {
                    console.error('❌ Error caching tile:', error, key);
                  }
                });
            }
          } catch (error) {
            if (__DEV__) {
              console.error('❌ Error handling cache message:', error, message);
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
