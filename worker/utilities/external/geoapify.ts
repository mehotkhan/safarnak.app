/**
 * Geoapify Places API Client
 * POI/Places API with 500+ categories
 * Backup for OpenTripMap - especially good for restaurants/cafes
 * 
 * Docs: https://apidocs.geoapify.com/docs/places/
 * Free tier: 3000 requests/day
 * 
 * NOTE: Currently disabled (GEOAPIFY_API_KEY not required)
 * OpenTripMap provides sufficient POI coverage for MVP
 */

import type { Env } from '../../types';
import { httpGetJson } from './http';

const GEOAPIFY_BASE = 'https://api.geoapify.com/v2';

// Helper to get API key (optional)
function getApiKey(env: Env): string | undefined {
  return (env as unknown as Record<string, string | undefined>).GEOAPIFY_API_KEY;
}

/**
 * Geoapify place feature
 */
export interface GeoapifyFeature {
  type: 'Feature';
  properties: {
    place_id: string;
    name?: string;
    street?: string;
    housenumber?: string;
    postcode?: string;
    city?: string;
    district?: string;
    country?: string;
    country_code?: string;
    lon: number;
    lat: number;
    categories?: string[];
    datasource?: {
      sourcename: string;
      attribution?: string;
    };
    distance?: number;
    opening_hours?: string;
    website?: string;
    phone?: string;
    description?: string;
    wiki_and_media?: {
      wikidata?: string;
      wikipedia?: string;
    };
  };
  geometry: {
    type: 'Point';
    coordinates: [number, number]; // [lon, lat]
  };
}

/**
 * Geoapify places response
 */
export interface GeoapifyPlacesResponse {
  type: 'FeatureCollection';
  features: GeoapifyFeature[];
}

/**
 * Common place categories for travel
 */
export const PLACE_CATEGORIES = {
  // Food & Drink
  restaurants: 'catering.restaurant',
  cafes: 'catering.cafe',
  bars: 'catering.bar',
  fastFood: 'catering.fast_food',
  allFood: 'catering',
  
  // Entertainment & Leisure
  attractions: 'entertainment',
  museums: 'entertainment.museum',
  theaters: 'entertainment.culture.theatre',
  cinemas: 'entertainment.cinema',
  
  // Tourism
  tourism: 'tourism',
  hotels: 'accommodation.hotel',
  hostels: 'accommodation.hostel',
  
  // Nature & Parks
  parks: 'leisure.park',
  beaches: 'beach',
  nature: 'natural',
  
  // Shopping
  shopping: 'commercial',
  malls: 'commercial.shopping_mall',
  supermarkets: 'commercial.supermarket',
  
  // Services
  atms: 'service.financial.atm',
  pharmacies: 'healthcare.pharmacy',
  gasStations: 'service.vehicle.fuel',
} as const;

/**
 * Search for places around coordinates
 * @param lat - Latitude
 * @param lon - Longitude
 * @param categories - Comma-separated category string (e.g., "catering.restaurant,catering.cafe")
 * @param radius - Search radius in meters (default 5000)
 * @param limit - Max results (default 50)
 */
export async function searchPlaces(
  env: Env,
  lat: number,
  lon: number,
  categories: string,
  radius = 5000,
  limit = 50
): Promise<GeoapifyFeature[]> {
  const apiKey = getApiKey(env);
  if (!apiKey) {
    console.log('[Geoapify] Skipped - no API key configured');
    return [];
  }

  const url = new URL(`${GEOAPIFY_BASE}/places`);
  url.searchParams.set('categories', categories);
  url.searchParams.set('filter', `circle:${lon},${lat},${radius}`);
  url.searchParams.set('limit', String(limit));
  url.searchParams.set('apiKey', apiKey);

  try {
    const response = await httpGetJson<GeoapifyPlacesResponse>(url.toString());
    // Filter out unnamed places
    return response.features.filter(f => f.properties.name);
  } catch (err) {
    console.warn('[Geoapify] Search places failed:', err);
    return [];
  }
}

/**
 * Search for restaurants around coordinates
 */
export async function searchRestaurants(
  env: Env,
  lat: number,
  lon: number,
  radius = 5000,
  limit = 30
): Promise<GeoapifyFeature[]> {
  return searchPlaces(env, lat, lon, PLACE_CATEGORIES.restaurants, radius, limit);
}

/**
 * Search for all food spots (restaurants, cafes, bars)
 */
export async function searchFoodSpots(
  env: Env,
  lat: number,
  lon: number,
  radius = 5000,
  limit = 50
): Promise<GeoapifyFeature[]> {
  return searchPlaces(env, lat, lon, PLACE_CATEGORIES.allFood, radius, limit);
}

/**
 * Search for attractions and entertainment
 */
export async function searchAttractions(
  env: Env,
  lat: number,
  lon: number,
  radius = 10000,
  limit = 50
): Promise<GeoapifyFeature[]> {
  const categories = [
    PLACE_CATEGORIES.attractions,
    PLACE_CATEGORIES.tourism,
    PLACE_CATEGORIES.museums,
  ].join(',');
  
  return searchPlaces(env, lat, lon, categories, radius, limit);
}

/**
 * Search for hotels and accommodation
 */
export async function searchAccommodation(
  env: Env,
  lat: number,
  lon: number,
  radius = 5000,
  limit = 30
): Promise<GeoapifyFeature[]> {
  return searchPlaces(env, lat, lon, 'accommodation', radius, limit);
}

/**
 * Geocode a place name to coordinates
 */
export async function geocode(
  env: Env,
  text: string,
  lang = 'en'
): Promise<GeoapifyFeature | null> {
  const apiKey = getApiKey(env);
  if (!apiKey) {
    console.log('[Geoapify] Geocode skipped - no API key configured');
    return null;
  }

  const url = new URL(`${GEOAPIFY_BASE}/geocode/search`);
  url.searchParams.set('text', text);
  url.searchParams.set('lang', lang);
  url.searchParams.set('limit', '1');
  url.searchParams.set('format', 'geojson');
  url.searchParams.set('apiKey', apiKey);

  try {
    const response = await httpGetJson<GeoapifyPlacesResponse>(url.toString());
    return response.features[0] || null;
  } catch (err) {
    console.warn('[Geoapify] Geocode failed for:', text, err);
    return null;
  }
}

/**
 * Reverse geocode coordinates to place info
 */
export async function reverseGeocode(
  env: Env,
  lat: number,
  lon: number,
  lang = 'en'
): Promise<GeoapifyFeature | null> {
  const apiKey = getApiKey(env);
  if (!apiKey) {
    console.log('[Geoapify] Reverse geocode skipped - no API key configured');
    return null;
  }

  const url = new URL(`${GEOAPIFY_BASE}/geocode/reverse`);
  url.searchParams.set('lat', String(lat));
  url.searchParams.set('lon', String(lon));
  url.searchParams.set('lang', lang);
  url.searchParams.set('format', 'geojson');
  url.searchParams.set('apiKey', apiKey);

  try {
    const response = await httpGetJson<GeoapifyPlacesResponse>(url.toString());
    return response.features[0] || null;
  } catch (err) {
    console.warn('[Geoapify] Reverse geocode failed:', err);
    return null;
  }
}

/**
 * Get primary category from categories array
 */
export function getPrimaryCategory(categories?: string[]): string {
  if (!categories || categories.length === 0) return 'place';
  
  // Extract most specific category
  const sorted = [...categories].sort((a, b) => b.split('.').length - a.split('.').length);
  const primary = sorted[0];
  
  // Return last part (most specific)
  const parts = primary.split('.');
  return parts[parts.length - 1] || 'place';
}

