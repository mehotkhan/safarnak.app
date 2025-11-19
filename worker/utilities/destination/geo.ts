/**
 * Geocoding utilities using OpenStreetMap Nominatim
 * No API key required - respects Nominatim usage policy
 */

import type { Env } from '../../types';
import type { GeocodeResult } from './types';

const NOMINATIM_HEADERS = {
  'User-Agent': 'Safarnak-Travel-App/1.0 (https://safarnak.app)',
};

type NominatimResult = {
  lat: string;
  lon: string;
  display_name: string;
  importance?: number;
  class?: string;
  type?: string;
  address?: {
    city?: string;
    town?: string;
    village?: string;
    municipality?: string;
    state?: string;
    county?: string;
    country?: string;
  };
};

/**
 * Geocode using Nominatim (low-level function)
 */
export async function geocodeNominatim(query: string, limit = 3): Promise<NominatimResult[]> {
  const url = new URL('https://nominatim.openstreetmap.org/search');
  url.searchParams.set('q', query);
  url.searchParams.set('format', 'jsonv2');
  url.searchParams.set('addressdetails', '1');
  url.searchParams.set('limit', String(Math.max(1, Math.min(limit, 5))));

  const res = await fetch(url.toString(), {
    headers: {
      ...NOMINATIM_HEADERS,
      'Accept': 'application/json',
    },
    method: 'GET',
  });
  
  if (!res.ok) {
    throw new Error(`Nominatim error: ${res.status} ${res.statusText}`);
  }
  
  const data = (await res.json()) as NominatimResult[];
  return Array.isArray(data) ? data : [];
}

/**
 * Geocode a destination (city/country) to get coordinates and address
 */
export async function geocodeDestination(
  env: Env,
  destination: string
): Promise<GeocodeResult> {
  try {
    const items = await geocodeNominatim(destination, 1);
    
    if (!items || items.length === 0) {
      throw new Error(`Destination not found: ${destination}`);
    }
    
    const place = items[0];
    const coords = {
      lat: parseFloat(place.lat),
      lon: parseFloat(place.lon),
    };
    
    if (!Number.isFinite(coords.lat) || !Number.isFinite(coords.lon)) {
      throw new Error(`Invalid coordinates for ${destination}`);
    }
    
    return {
      coords,
      address: place.display_name || destination,
      raw: place,
    };
  } catch (error) {
    console.error('[Geo] Geocoding failed:', error);
    throw error;
  }
}

/**
 * Geocode destination center (returns simple lat/lon object)
 */
export async function geocodeDestinationCenter(destination: string): Promise<{ latitude: number; longitude: number } | null> {
  try {
    const results = await geocodeNominatim(destination, 1);
    const top = results[0];
    if (!top) return null;
    const lat = Number(top.lat);
    const lon = Number(top.lon);
    if (Number.isFinite(lat) && Number.isFinite(lon)) {
      return { latitude: lat, longitude: lon };
    }
    return null;
  } catch (error) {
    console.error('[Geo] Failed to geocode destination center:', error);
    return null;
  }
}

/**
 * Geocode a place name constrained/scoped to a destination context
 * Returns best candidate within or near the destination city/town/state when possible
 */
export async function geocodePlaceInDestination(placeName: string, destination: string): Promise<{ latitude: number; longitude: number; label: string } | null> {
  try {
    const scopedQuery = `${placeName}, ${destination}`;
    const results = await geocodeNominatim(scopedQuery, 3);
    if (!results.length) return null;

    // Prefer results whose address mentions the destination name or same state/county
    const destLower = destination.toLowerCase();
    const scored = results
      .map(r => {
        const lat = Number(r.lat);
        const lon = Number(r.lon);
        const good = Number.isFinite(lat) && Number.isFinite(lon);
        const addr = r.address || {};
        const addrStr = [
          addr.city,
          addr.town,
          addr.village,
          addr.municipality,
          addr.state,
          addr.county,
          addr.country,
        ].filter(Boolean).join(' ').toLowerCase();
        let score = (r.importance || 0);
        if (addrStr.includes(destLower)) score += 1.0;
        return { r, lat, lon, good, score };
      })
      .filter(x => x.good)
      .sort((a, b) => b.score - a.score);

    const best = scored[0];
    if (!best) return null;

    return {
      latitude: best.lat,
      longitude: best.lon,
      label: best.r.display_name || placeName,
    };
  } catch (error) {
    console.error('[Geo] Failed to geocode place in destination:', error);
    return null;
  }
}

/**
 * Helper: Sleep for rate limiting
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

