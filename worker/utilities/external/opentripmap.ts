/**
 * OpenTripMap API Client
 * Global POI database built on OSM with 10M+ attractions
 * 
 * Docs: https://opentripmap.io/docs
 * Free tier for non-commercial use
 */

import type { Env } from '../../types';
import { httpGetJson } from './http';

const OTM_BASE = 'https://api.opentripmap.com/0.1';

/**
 * OpenTripMap place from radius search
 */
export interface OtmPlace {
  xid: string;
  name: string;
  kinds: string; // comma-separated: "historic,architecture,churches"
  rate: number;  // 1-7 popularity
  point: { lat: number; lon: number };
  dist?: number; // distance from search center
}

/**
 * OpenTripMap place with full details
 */
export interface OtmPlaceDetails extends OtmPlace {
  osm?: string;
  wikidata?: string;
  address?: {
    city?: string;
    road?: string;
    house_number?: string;
    suburb?: string;
    country?: string;
    postcode?: string;
    state?: string;
  };
  wikipedia_extracts?: {
    title?: string;
    text?: string;
    html?: string;
  };
  preview?: {
    source?: string;
    width?: number;
    height?: number;
  };
  url?: string;
  info?: {
    descr?: string;
    image?: string;
  };
}

/**
 * OpenTripMap geoname result
 */
export interface OtmGeoname {
  name: string;
  country: string;
  lat: number;
  lon: number;
  population?: number;
  timezone?: string;
}

/**
 * Geocode a city/destination name to coordinates
 */
export async function geocodeDestination(
  env: Env,
  name: string,
  lang = 'en'
): Promise<OtmGeoname | null> {
  const url = new URL(`${OTM_BASE}/${lang}/places/geoname`);
  url.searchParams.set('apikey', env.OPENTRIPMAP_API_KEY);
  url.searchParams.set('name', name);

  try {
    const result = await httpGetJson<OtmGeoname>(url.toString());
    return result;
  } catch (err) {
    console.warn('[OpenTripMap] Geocode failed for:', name, err);
    return null;
  }
}

/**
 * List attractions around coordinates
 * @param radius - Search radius in meters (default 15km)
 * @param limit - Max results (default 80)
 * @param rate - Minimum popularity 1-7 (default 2 = medium+)
 * @param kinds - Filter by kinds (comma-separated, e.g. "museums,historic")
 */
export async function listAttractions(
  env: Env,
  lat: number,
  lon: number,
  options: {
    lang?: string;
    radius?: number;
    limit?: number;
    rate?: number;
    kinds?: string;
  } = {}
): Promise<OtmPlace[]> {
  const { lang = 'en', radius = 15000, limit = 80, rate = 2, kinds } = options;

  const url = new URL(`${OTM_BASE}/${lang}/places/radius`);
  url.searchParams.set('apikey', env.OPENTRIPMAP_API_KEY);
  url.searchParams.set('lat', String(lat));
  url.searchParams.set('lon', String(lon));
  url.searchParams.set('radius', String(radius));
  url.searchParams.set('limit', String(limit));
  url.searchParams.set('rate', String(rate));
  url.searchParams.set('format', 'json');
  
  if (kinds) {
    url.searchParams.set('kinds', kinds);
  }

  try {
    const places = await httpGetJson<OtmPlace[]>(url.toString());
    // Filter out unnamed places
    return places.filter(p => p.name && p.name.trim().length > 0);
  } catch (err) {
    console.warn('[OpenTripMap] List attractions failed:', err);
    return [];
  }
}

/**
 * List restaurants and food spots around coordinates
 */
export async function listFoodSpots(
  env: Env,
  lat: number,
  lon: number,
  options: {
    lang?: string;
    radius?: number;
    limit?: number;
  } = {}
): Promise<OtmPlace[]> {
  const { lang = 'en', radius = 10000, limit = 50 } = options;

  // OpenTripMap kinds for food: foods, restaurants, cafes, bars
  return listAttractions(env, lat, lon, {
    lang,
    radius,
    limit,
    rate: 1, // Include more food spots (lower rate)
    kinds: 'foods,restaurants,cafes,bars,fast_food',
  });
}

/**
 * Get detailed information about a specific place
 */
export async function getPlaceDetails(
  env: Env,
  xid: string,
  lang = 'en'
): Promise<OtmPlaceDetails | null> {
  const url = `${OTM_BASE}/${lang}/places/xid/${xid}?apikey=${env.OPENTRIPMAP_API_KEY}`;

  try {
    const details = await httpGetJson<OtmPlaceDetails>(url);
    return details;
  } catch (err) {
    console.warn('[OpenTripMap] Get place details failed for:', xid, err);
    return null;
  }
}

/**
 * Get details for multiple places (batch)
 * Note: OpenTripMap doesn't have batch API, so we fetch sequentially with delays
 */
export async function getPlacesDetails(
  env: Env,
  xids: string[],
  lang = 'en',
  delayMs = 100
): Promise<OtmPlaceDetails[]> {
  const details: OtmPlaceDetails[] = [];

  for (const xid of xids) {
    const detail = await getPlaceDetails(env, xid, lang);
    if (detail) {
      details.push(detail);
    }
    // Rate limit
    if (delayMs > 0) {
      await new Promise(r => setTimeout(r, delayMs));
    }
  }

  return details;
}

/**
 * Parse kinds string into array
 */
export function parseKinds(kinds: string): string[] {
  return kinds.split(',').map(k => k.trim()).filter(Boolean);
}

/**
 * Get primary kind from kinds string
 */
export function getPrimaryKind(kinds: string): string {
  const kindsArray = parseKinds(kinds);
  // Priority order for display
  const priority = [
    'museums', 'historic', 'architecture', 'natural', 'cultural',
    'religion', 'art', 'viewpoint', 'gardens', 'beaches',
  ];
  
  for (const p of priority) {
    if (kindsArray.some(k => k.includes(p))) {
      return p;
    }
  }
  
  return kindsArray[0] || 'attraction';
}

