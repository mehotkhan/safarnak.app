import { View } from '../../components/ui/Themed';
import * as Location from 'expo-location';
import { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

export default function HomeScreen() {
  const { t } = useTranslation();
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const webViewRef = useRef<WebView>(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        Alert.alert('Permission Denied', 'Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

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

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
      <style>
        body { margin: 0; padding: 0; }
        #map { width: 100%; height: 100vh; }
      </style>
    </head>
    <body>
      <div id="map"></div>
      <script>
        var map = L.map('map').setView([${location?.coords.latitude || 37.78825}, ${location?.coords.longitude || -122.4324}], 13);
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19
        }).addTo(map);

        var marker;
        ${location ? `
          marker = L.marker([${location.coords.latitude}, ${location.coords.longitude}])
            .addTo(map)
            .bindPopup('Your Location')
            .openPopup();
        ` : ''}
      </script>
    </body>
    </html>
  `;

  return (
    <View style={styles.container}>
      <WebView
        ref={webViewRef}
        source={{ html: htmlContent }}
        style={styles.map}
        javaScriptEnabled={true}
        domStorageEnabled={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  map: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});