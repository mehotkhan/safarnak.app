/**
 * MapLibre Style Definitions
 * 
 * Free map styles using raster tile sources compatible with MapLibre GL.
 * Uses the same free tile sources as the Leaflet map component.
 */

/**
 * Generate a MapLibre style JSON for Satellite imagery
 * 
 * Note: Most free satellite imagery services now require API keys or have restrictions.
 * This uses a hybrid approach with OSM tiles styled to look more satellite-like,
 * or you can replace with a paid service like MapTiler/Mapbox if needed.
 * 
 * Alternative: For true satellite imagery, consider:
 * - MapTiler (free tier available)
 * - Mapbox (free tier available)
 * - Or use the terrain layer which provides elevation data
 */
export function getSatelliteStyle(): object {
  // Using a hybrid approach: OSM tiles with minimal styling for a cleaner look
  // This provides a satellite-like appearance without requiring API keys
  // For production, consider using MapTiler or Mapbox satellite styles
  return {
    version: 8,
    sources: {
      'satellite-hybrid': {
        type: 'raster',
        tiles: [
          'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png',
          'https://b.tile.openstreetmap.org/{z}/{x}/{y}.png',
          'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png',
        ],
        tileSize: 256,
        attribution:
          '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      },
    },
    layers: [
      {
        id: 'satellite-hybrid-layer',
        type: 'raster',
        source: 'satellite-hybrid',
        minzoom: 0,
        maxzoom: 19,
        paint: {
          'raster-brightness-min': 0.8,
          'raster-brightness-max': 1.2,
          'raster-saturation': 0.3, // Reduced saturation for more satellite-like appearance
        },
      },
    ],
    glyphs: 'https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf',
  };
}

/**
 * Generate a MapLibre style JSON for OpenTopoMap (Terrain)
 * Free topographic map - no API key required
 */
export function getTerrainStyle(): object {
  return {
    version: 8,
    sources: {
      opentopomap: {
        type: 'raster',
        tiles: [
          'https://a.tile.opentopomap.org/{z}/{x}/{y}.png',
          'https://b.tile.opentopomap.org/{z}/{x}/{y}.png',
          'https://c.tile.opentopomap.org/{z}/{x}/{y}.png',
        ],
        tileSize: 256,
        attribution:
          'Map data: © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: © <a href="https://opentopomap.org">OpenTopoMap</a>',
      },
    },
    layers: [
      {
        id: 'opentopomap-layer',
        type: 'raster',
        source: 'opentopomap',
        minzoom: 0,
        maxzoom: 17,
      },
    ],
    glyphs: 'https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf',
  };
}

/**
 * Generate a MapLibre style JSON for OpenStreetMap (Standard)
 * Free standard map - no API key required
 */
export function getStandardStyle(): object {
  return {
    version: 8,
    sources: {
      'osm-tiles': {
        type: 'raster',
        tiles: [
          'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png',
          'https://b.tile.openstreetmap.org/{z}/{x}/{y}.png',
          'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png',
        ],
        tileSize: 256,
        attribution:
          '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      },
    },
    layers: [
      {
        id: 'osm-tiles-layer',
        type: 'raster',
        source: 'osm-tiles',
        minzoom: 0,
        maxzoom: 19,
      },
    ],
    glyphs: 'https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf',
  };
}

/**
 * Get style object or URL for a layer type
 */
export function getStyleForLayer(layer: 'standard' | 'satellite' | 'terrain' | 'dark' | 'streets'): string | object {
  switch (layer) {
    case 'satellite':
      return getSatelliteStyle();
    case 'terrain':
      return getTerrainStyle();
    case 'standard':
      return getStandardStyle();
    case 'dark':
      // Using LFMaps Positron as a light alternative (can be styled as dark)
      return 'https://data.lfmaps.fr/styles/positron';
    case 'streets':
      // Using LFMaps Bright for streets
      return 'https://data.lfmaps.fr/styles/bright';
    default:
      return getStandardStyle();
  }
}
