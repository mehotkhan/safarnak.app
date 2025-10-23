import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, ActivityIndicator, Text } from 'react-native';
import { WebView } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';

interface MapViewProps {
  location: Location.LocationObject | null;
  onLocationUpdate?: (location: Location.LocationObject) => void;
}

export default function MapView({ location, onLocationUpdate }: MapViewProps) {
  const [isMapLoading, setIsMapLoading] = React.useState(true);
  const [mapLayer, setMapLayer] = React.useState<'standard' | 'satellite' | 'terrain'>('standard');
  const webViewRef = useRef<WebView>(null);

  useEffect(() => {
    if (location && webViewRef.current) {
      // Update map center when location is available
      const script = `
        if (typeof map !== 'undefined') {
          map.setView([${location.coords.latitude}, ${location.coords.longitude}], 13);
          if (typeof marker !== 'undefined') {
            marker.setLatLng([${location.coords.latitude}, ${location.coords.longitude}]);
          } else {
            marker = L.marker([${location.coords.latitude}, ${location.coords.longitude}])
              .addTo(map)
              .bindPopup('Your Location')
              .openPopup();
          }
        }
      `;
      webViewRef.current.injectJavaScript(script);
    }
  }, [location]);

  const handleZoomIn = () => {
    if (webViewRef.current) {
      webViewRef.current.injectJavaScript(`
        if (typeof map !== 'undefined') {
          map.zoomIn();
        }
        true;
      `);
    }
  };

  const handleZoomOut = () => {
    if (webViewRef.current) {
      webViewRef.current.injectJavaScript(`
        if (typeof map !== 'undefined') {
          map.zoomOut();
        }
        true;
      `);
    }
  };

  const handleCenterLocation = () => {
    if (location && webViewRef.current) {
      webViewRef.current.injectJavaScript(`
        if (typeof map !== 'undefined') {
          map.setView([${location.coords.latitude}, ${location.coords.longitude}], 15);
          if (typeof marker !== 'undefined') {
            marker.setLatLng([${location.coords.latitude}, ${location.coords.longitude}]);
            marker.openPopup();
          } else {
            marker = L.marker([${location.coords.latitude}, ${location.coords.longitude}])
              .addTo(map)
              .bindPopup('Your Location')
              .openPopup();
          }
        }
        true;
      `);
    }
  };

  const handleMapLayerChange = () => {
    const layers = ['standard', 'satellite', 'terrain'] as const;
    const currentIndex = layers.indexOf(mapLayer);
    const nextIndex = (currentIndex + 1) % layers.length;
    const newLayer = layers[nextIndex];
    setMapLayer(newLayer);

    if (webViewRef.current) {
      let tileUrl = '';
      
      switch (newLayer) {
        case 'standard':
          tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
          break;
        case 'satellite':
          tileUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
          break;
        case 'terrain':
          tileUrl = 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png';
          break;
      }

      webViewRef.current.injectJavaScript(`
        if (typeof map !== 'undefined' && typeof currentTileLayer !== 'undefined') {
          map.removeLayer(currentTileLayer);
          currentTileLayer = L.tileLayer('${tileUrl}', {
            attribution: '',
            maxZoom: 19,
            minZoom: 2
          }).addTo(map);
        }
        true;
      `);
    }
  };

  const htmlContent = `
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
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      width: 100%;
      height: 100%;
    }
  </style>
</head>
<body>
  <div id="map"></div>
  <script>
    try {
      var map = L.map('map', {
        center: [${location?.coords.latitude || 37.78825}, ${location?.coords.longitude || -122.4324}],
        zoom: 13,
        zoomControl: false
      });
      
      var currentTileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '',
        maxZoom: 19,
        minZoom: 2
      }).addTo(map);

      var marker;
      ${location ? `
        marker = L.marker([${location.coords.latitude}, ${location.coords.longitude}], {
          title: 'Your Location'
        })
          .addTo(map)
          .bindPopup('<b>Your Location</b>')
          .openPopup();
      ` : ''}
      
      // Force map to invalidate size after load
      setTimeout(function() {
        map.invalidateSize();
      }, 100);
    } catch (error) {
      console.error('Map initialization error:', error);
    }
  </script>
</body>
</html>`;

  return (
    <View style={styles.container}>
      {isMapLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text style={styles.loadingText}>Loading Map...</Text>
        </View>
      )}
      <WebView
        ref={webViewRef}
        source={{ 
          html: htmlContent,
          baseUrl: 'https://openstreetmap.org'
        }}
        style={styles.map}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        originWhitelist={['*']}
        allowsInlineMediaPlayback={true}
        mediaPlaybackRequiresUserAction={false}
        startInLoadingState={true}
        onLoadEnd={() => setIsMapLoading(false)}
        onError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.warn('WebView error: ', nativeEvent);
          setIsMapLoading(false);
        }}
        onHttpError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.warn('WebView HTTP error: ', nativeEvent);
        }}
        onMessage={(event) => {
          console.log('WebView message:', event.nativeEvent.data);
        }}
      />
      
      {/* Map Controls */}
      <View style={styles.controlsContainer}>
        <TouchableOpacity
          style={styles.controlButton}
          onPress={handleZoomIn}
          activeOpacity={0.5}
        >
          <Ionicons name="add" size={20} color="#333" />
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.controlButton, styles.buttonSpacing]}
          onPress={handleZoomOut}
          activeOpacity={0.5}
        >
          <Ionicons name="remove" size={20} color="#333" />
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.controlButton, styles.centerButton, styles.buttonSpacing]}
          onPress={handleCenterLocation}
          activeOpacity={0.5}
        >
          <Ionicons name="locate" size={20} color="#FFFFFF" />
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.controlButton, styles.layerButton, styles.buttonSpacing]}
          onPress={handleMapLayerChange}
          activeOpacity={0.5}
        >
          <Ionicons name="layers" size={20} color="#333" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    zIndex: 1000,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  controlsContainer: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    flexDirection: 'column',
    zIndex: 100,
    backgroundColor: 'transparent',
  },
  controlButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 5,
  },
  buttonSpacing: {
    marginTop: 8,
  },
  centerButton: {
    backgroundColor: 'rgba(74, 144, 226, 0.9)',
  },
  layerButton: {
    backgroundColor: 'rgba(255, 193, 7, 0.9)',
  },
});
