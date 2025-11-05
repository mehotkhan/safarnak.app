import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { View, TouchableOpacity, ActivityIndicator, Text } from 'react-native';
import { WebView } from 'react-native-webview';
import { useColorScheme } from '@hooks/useColorScheme';

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

type MapLayer = 'standard' | 'satellite' | 'terrain';

const MAP_LAYERS = {
  standard: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
  terrain: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
} as const;

const DEFAULT_CENTER = { latitude: 35.6892, longitude: 51.3890 }; // Tehran, Iran

export default function MapView({ location, waypoints, showControls = true, autoCenter = false }: MapViewProps) {
  const [isMapLoading, setIsMapLoading] = useState(true);
  const [mapLayer, setMapLayer] = useState<MapLayer>('standard');
  const webViewRef = useRef<WebView>(null);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  // Generate HTML content for the map
  const generateMapHTML = useCallback(() => {
    // Determine center point: use first waypoint if available, otherwise use location, otherwise default
    let centerLat = DEFAULT_CENTER.latitude;
    let centerLng = DEFAULT_CENTER.longitude;
    
    if (waypoints && waypoints.length > 0) {
      centerLat = waypoints[0].latitude;
      centerLng = waypoints[0].longitude;
    } else if (location) {
      centerLat = location.coords.latitude;
      centerLng = location.coords.longitude;
    }
    
    const hasLocation = !!location;
    const hasWaypoints = waypoints && Array.isArray(waypoints) && waypoints.length > 0;
    
    // Prepare waypoints array for JavaScript (safely handle empty/undefined)
    const waypointsJS = hasWaypoints 
      ? waypoints
          .filter(wp => wp && typeof wp.latitude === 'number' && typeof wp.longitude === 'number')
          .map(wp => `[${wp.latitude}, ${wp.longitude}, ${wp.label ? `"${wp.label.replace(/"/g, '\\"')}"` : 'null'}]`)
          .join(',')
      : '';
    
    // Prepare polyline coordinates (safely handle empty/undefined)
    const polylineCoords = hasWaypoints
      ? waypoints
          .filter(wp => wp && typeof wp.latitude === 'number' && typeof wp.longitude === 'number')
          .map(wp => `[${wp.latitude}, ${wp.longitude}]`)
          .join(',')
      : '';

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
        center: [${centerLat}, ${centerLng}],
        zoom: ${hasWaypoints ? '10' : '13'},
        zoomControl: false
      });
      
      var currentTileLayer = L.tileLayer('${MAP_LAYERS.standard}', {
        attribution: '',
        maxZoom: 19,
        minZoom: 2
      }).addTo(map);

      var markers = [];
      var polyline = null;
      
      ${hasWaypoints && waypointsJS ? `
      // Add waypoints and draw curved polyline
      var waypoints = [${waypointsJS}];
      var polylineCoords = [${polylineCoords}];
      
      // Function to create Bezier curve points between two coordinates
      function createBezierCurve(start, end, controlPoint1, controlPoint2, numPoints) {
        var points = [];
        for (var i = 0; i <= numPoints; i++) {
          var t = i / numPoints;
          var mt = 1 - t;
          var mt2 = mt * mt;
          var mt3 = mt2 * mt;
          var t2 = t * t;
          var t3 = t2 * t;
          
          var lat = mt3 * start[0] + 3 * mt2 * t * controlPoint1[0] + 3 * mt * t2 * controlPoint2[0] + t3 * end[0];
          var lng = mt3 * start[1] + 3 * mt2 * t * controlPoint1[1] + 3 * mt * t2 * controlPoint2[1] + t3 * end[1];
          points.push([lat, lng]);
        }
        return points;
      }
      
      // Generate curved route with Bezier curves
      function generateCurvedRoute(coords) {
        if (coords.length < 2) return coords;
        
        var curvedCoords = [coords[0]]; // Start with first point
        
        for (var i = 0; i < coords.length - 1; i++) {
          var start = coords[i];
          var end = coords[i + 1];
          
          // Calculate control points for smooth curves
          // Control points are offset perpendicular to the line between points
          var dx = end[1] - start[1];
          var dy = end[0] - start[0];
          var dist = Math.sqrt(dx * dx + dy * dy);
          
          // Perpendicular offset for curve (adjust multiplier for more/less curve)
          var offset = dist * 0.15; // 15% of distance as curve offset
          var perpX = -dy / dist * offset;
          var perpY = dx / dist * offset;
          
          // Control points (midpoint with perpendicular offset)
          var midLat = (start[0] + end[0]) / 2;
          var midLng = (start[1] + end[1]) / 2;
          
          var control1 = [midLat + perpX, midLng + perpY];
          var control2 = [midLat + perpX, midLng + perpY];
          
          // Generate curve points (exclude first point to avoid duplicates)
          var curvePoints = createBezierCurve(start, end, control1, control2, 20);
          for (var j = 1; j < curvePoints.length; j++) {
            curvedCoords.push(curvePoints[j]);
          }
        }
        
        return curvedCoords;
      }
      
      // Draw curved polyline connecting all waypoints (only if we have at least 2 points)
      if (waypoints && waypoints.length > 0 && polylineCoords.length > 1) {
        try {
          var curvedRoute = generateCurvedRoute(polylineCoords);
          
          if (curvedRoute && curvedRoute.length > 0) {
            polyline = L.polyline(curvedRoute, {
              color: '#8b5cf6',
              weight: 4,
              opacity: 0.8,
              smoothFactor: 1,
              lineCap: 'round',
              lineJoin: 'round'
            }).addTo(map);
            
            // Fit map to show entire route
            if (polyline && polyline.getBounds) {
              map.fitBounds(polyline.getBounds(), { padding: [50, 50] });
            }
          }
        } catch (e) {
          console.error('Error drawing curved route:', e);
          // Fallback to straight line if curve fails
          if (polylineCoords.length > 1) {
            polyline = L.polyline(polylineCoords, {
              color: '#8b5cf6',
              weight: 4,
              opacity: 0.8
            }).addTo(map);
            if (polyline && polyline.getBounds) {
              map.fitBounds(polyline.getBounds(), { padding: [50, 50] });
            }
          }
        }
      }
      
      // Add markers for each waypoint (safely)
      if (waypoints && waypoints.length > 0) {
        waypoints.forEach(function(wp, index) {
          if (wp && wp[0] && wp[1] && !isNaN(wp[0]) && !isNaN(wp[1])) {
            try {
              var marker = L.marker([wp[0], wp[1]]).addTo(map);
              var label = wp[2] ? wp[2] : 'Step ' + (index + 1);
              marker.bindPopup('<b>' + label + '</b>');
              markers.push(marker);
              
              // Open popup for first waypoint
              if (index === 0) {
                marker.openPopup();
              }
            } catch (e) {
              console.error('Error creating marker:', e);
            }
          }
        });
      }
      ` : ''}
      
      ${hasLocation && !hasWaypoints ? `
      // Add single location marker if no waypoints
      var marker = L.marker([${centerLat}, ${centerLng}]).addTo(map).bindPopup('<b>Your Location</b>').openPopup();
      markers.push(marker);
      ` : ''}
      
      setTimeout(() => map.invalidateSize(), 100);
    } catch (error) {
      console.error('Map initialization error:', error);
    }
  </script>
</body>
</html>`;
  }, [location, waypoints]);

  // Update map when waypoints or location changes
  useEffect(() => {
    if (!webViewRef.current) return;

    const hasWaypoints = waypoints && Array.isArray(waypoints) && waypoints.length > 0;
    
    if (hasWaypoints) {
      // Update waypoints and curved polyline (safely filter invalid waypoints)
      const validWaypoints = waypoints.filter(wp => wp && typeof wp.latitude === 'number' && typeof wp.longitude === 'number');
      
      if (validWaypoints.length === 0) {
        // No valid waypoints, just show location if available
        if (location) {
          const { latitude, longitude } = location.coords;
          webViewRef.current.injectJavaScript(`
            if (typeof map !== 'undefined') {
              map.setView([${latitude}, ${longitude}], map.getZoom());
              if (typeof markers !== 'undefined' && markers.length > 0) {
                markers[0].setLatLng([${latitude}, ${longitude}]);
              } else {
                var marker = L.marker([${latitude}, ${longitude}])
                  .addTo(map)
                  .bindPopup('<b>Your Location</b>')
                  .openPopup();
                if (typeof markers === 'undefined') markers = [];
                markers.push(marker);
              }
            }
            true;
          `);
        }
        return;
      }
      
      const waypointsJS = validWaypoints.map(wp => `[${wp.latitude}, ${wp.longitude}, ${wp.label ? `"${wp.label.replace(/"/g, '\\"')}"` : 'null'}]`).join(',');
      const polylineCoords = validWaypoints.map(wp => `[${wp.latitude}, ${wp.longitude}]`).join(',');
      
      webViewRef.current.injectJavaScript(`
        if (typeof map !== 'undefined') {
          // Remove existing polyline and markers
          if (typeof polyline !== 'undefined' && polyline !== null) {
            map.removeLayer(polyline);
          }
          if (typeof markers !== 'undefined' && markers.length > 0) {
            markers.forEach(function(m) { map.removeLayer(m); });
          }
          
          // Re-define curve functions if needed
          if (typeof createBezierCurve === 'undefined') {
            function createBezierCurve(start, end, controlPoint1, controlPoint2, numPoints) {
              var points = [];
              for (var i = 0; i <= numPoints; i++) {
                var t = i / numPoints;
                var mt = 1 - t;
                var mt2 = mt * mt;
                var mt3 = mt2 * mt;
                var t2 = t * t;
                var t3 = t2 * t;
                var lat = mt3 * start[0] + 3 * mt2 * t * controlPoint1[0] + 3 * mt * t2 * controlPoint2[0] + t3 * end[0];
                var lng = mt3 * start[1] + 3 * mt2 * t * controlPoint1[1] + 3 * mt * t2 * controlPoint2[1] + t3 * end[1];
                points.push([lat, lng]);
              }
              return points;
            }
            
            function generateCurvedRoute(coords) {
              if (coords.length < 2) return coords;
              var curvedCoords = [coords[0]];
              for (var i = 0; i < coords.length - 1; i++) {
                var start = coords[i];
                var end = coords[i + 1];
                var dx = end[1] - start[1];
                var dy = end[0] - start[0];
                var dist = Math.sqrt(dx * dx + dy * dy);
                var offset = dist * 0.15;
                var perpX = -dy / dist * offset;
                var perpY = dx / dist * offset;
                var midLat = (start[0] + end[0]) / 2;
                var midLng = (start[1] + end[1]) / 2;
                var control1 = [midLat + perpX, midLng + perpY];
                var control2 = [midLat + perpX, midLng + perpY];
                var curvePoints = createBezierCurve(start, end, control1, control2, 20);
                for (var j = 1; j < curvePoints.length; j++) {
                  curvedCoords.push(curvePoints[j]);
                }
              }
              return curvedCoords;
            }
          }
          
          // Draw new curved polyline (safely)
          var waypoints = [${waypointsJS}];
          var polylineCoords = [${polylineCoords}];
          
          if (waypoints && waypoints.length > 0 && polylineCoords.length > 1) {
            try {
              var curvedRoute = generateCurvedRoute(polylineCoords);
              if (curvedRoute && curvedRoute.length > 0) {
                polyline = L.polyline(curvedRoute, {
                  color: '#8b5cf6',
                  weight: 4,
                  opacity: 0.8,
                  smoothFactor: 1,
                  lineCap: 'round',
                  lineJoin: 'round'
                }).addTo(map);
                if (polyline && polyline.getBounds) {
                  map.fitBounds(polyline.getBounds(), { padding: [50, 50] });
                }
              }
            } catch (e) {
              console.error('Error drawing curved route:', e);
              // Fallback to straight line
              try {
                polyline = L.polyline(polylineCoords, {
                  color: '#8b5cf6',
                  weight: 4,
                  opacity: 0.8
                }).addTo(map);
                if (polyline && polyline.getBounds) {
                  map.fitBounds(polyline.getBounds(), { padding: [50, 50] });
                }
              } catch (e2) {
                console.error('Error drawing fallback route:', e2);
              }
            }
          }
          
          // Add new markers (safely)
          markers = [];
          if (waypoints && waypoints.length > 0) {
            waypoints.forEach(function(wp, index) {
              if (wp && wp[0] && wp[1] && !isNaN(wp[0]) && !isNaN(wp[1])) {
                try {
                  var marker = L.marker([wp[0], wp[1]]).addTo(map);
                  var label = wp[2] ? wp[2] : 'Step ' + (index + 1);
                  marker.bindPopup('<b>' + label + '</b>');
                  markers.push(marker);
                  if (index === 0) marker.openPopup();
                } catch (e) {
                  console.error('Error creating marker:', e);
                }
              }
            });
          }
        }
        true;
      `);
    } else if (location) {
      // Update single location marker
    const { latitude, longitude } = location.coords;
    webViewRef.current.injectJavaScript(`
      if (typeof map !== 'undefined') {
        map.setView([${latitude}, ${longitude}], map.getZoom());
          if (typeof markers !== 'undefined' && markers.length > 0) {
            markers[0].setLatLng([${latitude}, ${longitude}]);
        } else {
            var marker = L.marker([${latitude}, ${longitude}])
            .addTo(map)
            .bindPopup('<b>Your Location</b>')
            .openPopup();
            if (typeof markers === 'undefined') markers = [];
            markers.push(marker);
        }
      }
      true;
    `);
    }
  }, [location, waypoints]);

  // Auto-center map when data changes (for small map preview)
  useEffect(() => {
    if (!autoCenter || !webViewRef.current || isMapLoading) return;

    const hasWaypoints = waypoints && Array.isArray(waypoints) && waypoints.length > 0;
    const validWaypoints = hasWaypoints 
      ? waypoints.filter(wp => wp && typeof wp.latitude === 'number' && typeof wp.longitude === 'number')
      : [];

    if (validWaypoints.length > 1) {
      // Center on waypoints route
      const polylineCoords = validWaypoints.map(wp => `[${wp.latitude}, ${wp.longitude}]`).join(',');
      webViewRef.current.injectJavaScript(`
        if (typeof map !== 'undefined') {
          try {
            var coords = [${polylineCoords}];
            if (coords.length > 1) {
              var bounds = L.latLngBounds(coords);
              map.fitBounds(bounds, { padding: [20, 20], maxZoom: ${showControls ? 15 : 13} });
            }
          } catch (e) {
            console.error('Error auto-centering on waypoints:', e);
          }
        }
        true;
      `);
    } else if (location) {
      // Center on single location
      const { latitude, longitude } = location.coords;
      webViewRef.current.injectJavaScript(`
        if (typeof map !== 'undefined') {
          try {
            map.setView([${latitude}, ${longitude}], ${showControls ? 15 : 13});
          } catch (e) {
            console.error('Error auto-centering on location:', e);
          }
        }
        true;
      `);
    }
  }, [location, waypoints, autoCenter, isMapLoading, showControls]);

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
    const hasWaypoints = waypoints && waypoints.length > 0;
    
    if (hasWaypoints) {
      // Fit bounds to show all waypoints
      executeMapCommand(`
        if (typeof polyline !== 'undefined' && polyline !== null) {
          map.fitBounds(polyline.getBounds(), { padding: [50, 50] });
        }
      `);
    } else if (location) {
    const { latitude, longitude } = location.coords;
    executeMapCommand(`
      map.setView([${latitude}, ${longitude}], 15);
        if (typeof markers !== 'undefined' && markers.length > 0) {
          markers[0].setLatLng([${latitude}, ${longitude}]).openPopup();
      }
    `);
    }
  }, [location, waypoints, executeMapCommand]);

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
            disabled={!location && !waypoints?.length}
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
