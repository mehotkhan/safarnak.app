/**
 * Points of Interest (POI) fetching from OpenStreetMap Nominatim
 * Fetches attractions and restaurants - no API key required
 */

import type { Env } from '../../types';
import type { Attraction, Restaurant } from './types';
import { sleep } from './geo';

const NOMINATIM_HEADERS = {
  'User-Agent': 'Safarnak-Travel-App/1.0 (https://safarnak.app)',
};

/**
 * Fetch attractions from OpenStreetMap
 */
export async function fetchAttractions(
  env: Env,
  destination: string,
  coords?: { lat: number; lon: number }
): Promise<Attraction[]> {
  try {
    const types = [
      'tourism=attraction',
      'tourism=museum',
      'historic=monument',
      'tourism=viewpoint',
      'leisure=park',
    ];
    
    const attractions: Attraction[] = [];
    
    for (const type of types) {
      try {
        const query = coords
          ? `${destination}`
          : `${destination}`;
        
        const url = `https://nominatim.openstreetmap.org/search?` +
          `q=${encodeURIComponent(query)}&${type}&format=json&limit=10&addressdetails=1`;
        
        const response = await fetch(url, {
          headers: NOMINATIM_HEADERS,
        });
        
        if (!response.ok) {
          console.warn(`[POI] Failed to fetch ${type}: ${response.status}`);
          continue;
        }
        
        const places = await response.json() as any[];
        
        if (!Array.isArray(places)) {
          continue;
        }
        
        for (const place of places) {
          if (place.lat && place.lon && place.display_name) {
            attractions.push({
              id: `${destination.toLowerCase()}-${place.osm_id}`,
              name: place.display_name.split(',')[0].trim(),
              type: type.includes('museum') ? 'museum' :
                    type.includes('park') ? 'park' :
                    type.includes('monument') ? 'historical' : 'entertainment',
              coords: {
                lat: parseFloat(place.lat),
                lon: parseFloat(place.lon),
              },
              rating: 4.0 + Math.random() * 0.5, // Placeholder - would integrate real ratings
              cost: 0,
              duration: 60,
              tags: [type.split('=')[1]],
              address: place.display_name,
            });
          }
        }
        
        // Rate limit: wait 1 second between requests
        await sleep(1000);
      } catch (err) {
        console.warn(`[POI] Failed to fetch ${type}:`, err);
      }
    }
    
    // Deduplicate by coordinates (within 100m)
    const unique: Attraction[] = [];
    for (const attr of attractions) {
      const isDuplicate = unique.some(u => 
        Math.abs(u.coords.lat - attr.coords.lat) < 0.001 &&
        Math.abs(u.coords.lon - attr.coords.lon) < 0.001
      );
      if (!isDuplicate) {
        unique.push(attr);
      }
    }
    
    return unique.slice(0, 20); // Top 20 attractions
  } catch (error) {
    console.error('[POI] Failed to fetch attractions:', error);
    return [];
  }
}

/**
 * Fetch restaurants from OpenStreetMap
 */
export async function fetchRestaurants(
  env: Env,
  destination: string,
  _coords?: { lat: number; lon: number }
): Promise<Restaurant[]> {
  try {
    const url = `https://nominatim.openstreetmap.org/search?` +
      `q=${encodeURIComponent(destination)}&amenity=restaurant&format=json&limit=15&addressdetails=1`;
    
    const response = await fetch(url, {
      headers: NOMINATIM_HEADERS,
    });
    
    if (!response.ok) {
      console.warn(`[POI] Failed to fetch restaurants: ${response.status}`);
      return [];
    }
    
    const places = await response.json() as any[];
    
    if (!Array.isArray(places)) {
      return [];
    }
    
    const restaurants: Restaurant[] = places
      .filter((p: any) => p && p.lat && p.lon && p.display_name)
      .map((place: any) => ({
        id: `${destination.toLowerCase()}-restaurant-${place.osm_id}`,
        name: place.display_name.split(',')[0].trim(),
        coords: {
          lat: parseFloat(place.lat),
          lon: parseFloat(place.lon),
        },
        cuisine: 'local',
        priceRange: '$$' as const,
        rating: 4.0 + Math.random() * 0.5,
        specialties: [],
        address: place.display_name,
      }));
    
    return restaurants.slice(0, 10);
  } catch (error) {
    console.error('[POI] Failed to fetch restaurants:', error);
    return [];
  }
}

