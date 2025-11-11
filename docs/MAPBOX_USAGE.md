# Mapbox MapView Usage Guide

## Overview

`MapboxMapView` is a native map component built on **Mapbox Maps SDK v11.16.2** for Android/iOS. It provides superior performance, offline capabilities, and native feel compared to WebView-based solutions.

## Features

✅ **Native Performance** - Built on Mapbox GL Native SDK  
✅ **Offline Maps** - Download regions for offline use  
✅ **4 Map Styles** - Streets, Satellite, Outdoors, Dark  
✅ **Curved Routes** - Smooth Bezier-curved routes between waypoints  
✅ **Custom Markers** - Type-based waypoint markers with labels  
✅ **User Location** - Real-time GPS tracking with heading indicator  
✅ **Touch Controls** - Zoom, pan, rotate, pitch gestures  
✅ **Auto-center** - Fit bounds to show all waypoints  
✅ **Dark Mode** - Automatic theme switching  

## Installation

Already installed! ✅ Package: `@rnmapbox/maps@10.2.7`

### Environment Setup

Add to your `.env` file (do not commit real tokens):

```bash
EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN=YOUR_MAPBOX_PUBLIC_TOKEN
RNMAPBOX_MAPS_DOWNLOAD_TOKEN=YOUR_MAPBOX_SECRET_DOWNLOADS_TOKEN
```

Tokens are read at runtime/build from `.env` ✅

## Basic Usage

```typescript
import MapboxMapView from '@components/MapboxMapView';
import * as Location from 'expo-location';

export default function MyScreen() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  
  const waypoints = [
    { latitude: 35.6892, longitude: 51.3890, label: 'Tehran' },
    { latitude: 35.7219, longitude: 51.3347, label: 'Darband' },
  ];

  return (
    <MapboxMapView
      location={location}
      waypoints={waypoints}
      showControls={true}
      showUserLocation={true}
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `location` | `Location.LocationObject \| null` | `null` | User's current location |
| `waypoints` | `Waypoint[]` | `[]` | Array of waypoints to display |
| `showControls` | `boolean` | `true` | Show zoom/center/style controls |
| `autoCenter` | `boolean` | `false` | Auto-fit bounds when waypoints change |
| `followUserLocation` | `boolean` | `false` | Auto-follow user as they move |
| `showUserLocation` | `boolean` | `true` | Show user location marker |
| `onRegionChange` | `function` | - | Callback when map region changes |

### Waypoint Type

```typescript
interface Waypoint {
  latitude: number;
  longitude: number;
  label?: string; // Optional label
  type?: 'start' | 'end' | 'waypoint' | 'place'; // Optional marker type
}
```

## Usage Examples

### Trip Map with Route

```typescript
import MapboxMapView from '@components/MapboxMapView';
import { useGetTripQuery } from '@api';

export default function TripMapScreen() {
  const { data } = useGetTripQuery({ variables: { id: tripId } });
  const trip = data?.getTrip;
  
  const waypoints = trip?.waypoints?.map(wp => ({
    latitude: wp.latitude,
    longitude: wp.longitude,
    label: wp.label,
    type: 'waypoint' as const,
  })) || [];
  
  return (
    <View className="flex-1">
      <MapboxMapView
        location={null}
        waypoints={waypoints}
        showControls={true}
        autoCenter={true}
      />
    </View>
  );
}
```

### Live Tracking Map

```typescript
import MapboxMapView from '@components/MapboxMapView';
import * as Location from 'expo-location';

export default function TrackingScreen() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const loc = await Location.getCurrentPositionAsync({});
        setLocation(loc);
      }
    })();
  }, []);
  
  return (
    <MapboxMapView
      location={location}
      waypoints={[]}
      showControls={true}
      followUserLocation={true}
      showUserLocation={true}
    />
  );
}
```

### Embedded Mini Map (No Controls)

```typescript
<View className="h-64 rounded-lg overflow-hidden">
  <MapboxMapView
    location={location}
    waypoints={waypoints}
    showControls={false}
    autoCenter={true}
  />
</View>
```

## Map Styles

Available styles (cycle through with layers button):

1. **Streets** - Default Mapbox streets style (v12)
2. **Satellite** - Satellite imagery with street labels (v12)
3. **Outdoors** - Topographic style for hiking/travel (v12)
4. **Dark** - Dark theme for night mode (v11)

## Offline Maps

To enable offline maps, users need to download regions. Here's how:

```typescript
import Mapbox from '@rnmapbox/maps';

// Download a region for offline use
async function downloadOfflineMap(regionName: string, bounds: [[number, number], [number, number]]) {
  const pack = await Mapbox.offlineManager.createPack({
    name: regionName,
    styleURL: 'mapbox://styles/mapbox/streets-v12',
    minZoom: 10,
    maxZoom: 16,
    bounds: {
      ne: bounds[1],
      sw: bounds[0],
    },
  });
  
  // Monitor download progress
  pack.onProgress((progress) => {
    console.log(`Downloaded: ${progress.percentage}%`);
  });
  
  return pack;
}
```

## Performance Tips

1. **Waypoint Limit**: Keep waypoints under 100 for smooth performance
2. **Route Simplification**: For long routes, simplify coordinates
3. **Marker Clustering**: Use Mapbox clustering for many markers
4. **Memory**: Be mindful of offline map sizes (can be 10-100MB per region)

## Comparison: Mapbox vs Leaflet

| Feature | Mapbox (Native) | Leaflet (WebView) |
|---------|----------------|-------------------|
| **Performance** | ⚡ Native - 60fps | 🐌 WebView - 30fps |
| **Offline Maps** | ✅ Full support | ❌ Manual tile caching |
| **3D/Tilt** | ✅ Yes | ❌ No |
| **Bundle Size** | ~15MB | ~1MB |
| **Gestures** | ✅ Native feel | ⚠️ WebView delay |
| **Battery Usage** | ✅ Optimized | ⚠️ Higher (WebView) |
| **Customization** | ✅ Full Mapbox Studio | ⚠️ Limited |

## When to Use Which?

### Use **MapboxMapView** (Native) when:
- Building primary map features
- Need offline maps
- Want best performance
- Need 3D/tilt views
- Building for production

### Use **MapView** (Leaflet) when:
- Quick prototyping
- Simple maps
- Need custom tile servers
- Web compatibility is priority
- Don't need offline support

## Troubleshooting

### Map not showing?

1. **Check token**: Verify `EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN` in `.env`
2. **Rebuild app**: After adding Mapbox, run `npx expo prebuild`
3. **Check logs**: Look for Mapbox errors in console
4. **Test token**: Visit https://account.mapbox.com/ to verify token is active

### Build errors?

Run clean build:
```bash
yarn clean
npx expo prebuild --clean
yarn android
```

### Offline maps not working?

- Ensure `RNMapboxMapsDownloadToken` is set in `app.config.js` ✅
- Check storage permissions
- Verify bounds are valid
- Monitor download progress

## Resources

- [Mapbox Android SDK Docs](https://docs.mapbox.com/android/maps/guides/)
- [@rnmapbox/maps GitHub](https://github.com/rnmapbox/maps)
- [Mapbox Studio](https://studio.mapbox.com/) - Create custom styles
- [Mapbox Account](https://account.mapbox.com/) - Manage tokens

## Migration from Leaflet

Both components have the same interface, so switching is easy:

```diff
- import MapView from '@components/MapView';
+ import MapboxMapView from '@components/MapboxMapView';

- <MapView
+ <MapboxMapView
    location={location}
    waypoints={waypoints}
    showControls={true}
  />
```

That's it! The props are compatible. 🎉

