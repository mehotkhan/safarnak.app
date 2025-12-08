/**
 * Map Utilities
 * 
 * Utility functions for map operations.
 */

/**
 * Generate random markers within Iran's bounds
 * 
 * Iran approximate bounds:
 * - Latitude: 25.0 to 40.0
 * - Longitude: 44.0 to 63.0
 */
export function generateRandomMarkersInIran(count: number = 10): Array<{
  id: string;
  latitude: number;
  longitude: number;
  title?: string;
}> {
  const markers: Array<{
    id: string;
    latitude: number;
    longitude: number;
    title?: string;
  }> = [];

  // Iran bounds
  const minLat = 25.0;
  const maxLat = 40.0;
  const minLng = 44.0;
  const maxLng = 63.0;

  // Sample location names in Iran
  const locationNames = [
    'Tehran',
    'Isfahan',
    'Shiraz',
    'Tabriz',
    'Mashhad',
    'Yazd',
    'Kerman',
    'Ahvaz',
    'Qom',
    'Rasht',
    'Hamadan',
    'Kermanshah',
    'Zahedan',
    'Bandar Abbas',
    'Ardabil',
    'Sanandaj',
    'Qazvin',
    'Gorgan',
    'Sari',
    'Birjand',
  ];

  for (let i = 0; i < count; i++) {
    const latitude = minLat + Math.random() * (maxLat - minLat);
    const longitude = minLng + Math.random() * (maxLng - minLng);
    const nameIndex = Math.floor(Math.random() * locationNames.length);

    markers.push({
      id: `marker-${i}`,
      latitude,
      longitude,
      title: `${locationNames[nameIndex]} ${i + 1}`,
    });
  }

  return markers;
}

/**
 * Calculate center point from markers
 */
export function calculateCenterFromMarkers(
  markers: Array<{ latitude: number; longitude: number }>
): { latitude: number; longitude: number } {
  if (markers.length === 0) {
    return { latitude: 35.6892, longitude: 51.3890 }; // Tehran default
  }

  const sumLat = markers.reduce((sum, m) => sum + m.latitude, 0);
  const sumLng = markers.reduce((sum, m) => sum + m.longitude, 0);

  return {
    latitude: sumLat / markers.length,
    longitude: sumLng / markers.length,
  };
}
