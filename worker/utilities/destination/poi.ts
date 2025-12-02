/**
 * Points of Interest (POI) fetching using Overpass API
 * Fetches attractions and restaurants from OpenStreetMap
 * Uses Overpass API for proper POI queries by OSM tags
 */

import type { Env } from '../../types';
import type { Attraction, Restaurant } from './types';
import { sleep } from './geo';

// Valid attraction types matching the Attraction interface
type AttractionType = Attraction['type'];

const OVERPASS_API = 'https://overpass-api.de/api/interpreter';

const USER_AGENT = 'Safarnak-Travel-App/1.0 (https://safarnak.app)';

/**
 * Build Overpass QL query for a destination area
 */
function buildOverpassQuery(destination: string, tags: string[], limit: number = 30): string {
  // Search for the city/area first, then find POIs within it
  const tagFilters = tags.map(tag => {
    const [key, value] = tag.split('=');
    return `["${key}"="${value}"]`;
  }).join('');

  return `
    [out:json][timeout:25];
    area["name"~"${destination}",i]["place"~"city|town|village"]->.searchArea;
    (
      node${tagFilters}(area.searchArea);
      way${tagFilters}(area.searchArea);
      relation${tagFilters}(area.searchArea);
    );
    out center ${limit};
  `.trim();
}

/**
 * Extract best name from OSM tags
 */
function extractName(element: any): string {
  const tags = element.tags || {};
  // Priority: name:en > name > operator > brand > ref
  return tags['name:en'] || tags.name || tags.operator || tags.brand || tags.ref || 'Unknown Place';
}

/**
 * Extract description from OSM tags
 */
function extractDescription(element: any, type?: string): string {
  const tags = element.tags || {};
  const parts: string[] = [];
  
  if (tags.description) {
    parts.push(tags.description);
  }
  
  if (tags.tourism && tags.tourism !== type) {
    parts.push(`Tourism: ${tags.tourism}`);
  }
  
  if (tags.historic) {
    parts.push(`Historic: ${tags.historic}`);
  }
  
  if (tags.opening_hours) {
    parts.push(`Hours: ${tags.opening_hours}`);
  }
  
  if (tags.website) {
    parts.push(`Website: ${tags.website}`);
  }
  
  return parts.join('. ') || `${type} in the area`;
}

/**
 * Build full address from OSM tags
 */
function buildAddress(element: any, destination: string): string {
  const tags = element.tags || {};
  const parts: string[] = [];
  
  if (tags['addr:street']) {
    let street = tags['addr:street'];
    if (tags['addr:housenumber']) {
      street = `${tags['addr:housenumber']} ${street}`;
    }
    parts.push(street);
  }
  
  if (tags['addr:suburb'] || tags['addr:district']) {
    parts.push(tags['addr:suburb'] || tags['addr:district']);
  }
  
  if (tags['addr:city']) {
    parts.push(tags['addr:city']);
  } else if (destination) {
    parts.push(destination);
  }
  
  if (tags['addr:postcode']) {
    parts.push(tags['addr:postcode']);
  }
  
  return parts.join(', ') || destination;
}

/**
 * Get coordinates from Overpass element
 */
function getCoordinates(element: any): { lat: number; lon: number } | null {
  // For nodes, coordinates are direct
  if (element.lat && element.lon) {
    return { lat: element.lat, lon: element.lon };
  }
  // For ways/relations, use center
  if (element.center?.lat && element.center?.lon) {
    return { lat: element.center.lat, lon: element.center.lon };
  }
  return null;
}

/**
 * Fetch POIs using Overpass API
 */
async function fetchPOIsFromOverpass(
  destination: string,
  tagGroups: { tags: string[]; type: AttractionType }[],
  limit: number = 30
): Promise<Attraction[]> {
  const attractions: Attraction[] = [];
  
  for (const group of tagGroups) {
    try {
      const query = buildOverpassQuery(destination, group.tags, limit);
      
      const response = await fetch(OVERPASS_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent': USER_AGENT,
        },
        body: `data=${encodeURIComponent(query)}`,
      });
      
      if (!response.ok) {
        console.warn(`[POI] Overpass query failed for ${group.type}: ${response.status}`);
        continue;
      }
      
      const data = await response.json() as any;
      const elements = data?.elements || [];
      
      console.log(`[POI] Overpass returned ${elements.length} ${group.type} elements for ${destination}`);
      
      for (const element of elements) {
        const coords = getCoordinates(element);
        if (!coords) continue;
        
        const name = extractName(element);
        if (!name || name === 'Unknown Place') continue;
        
        attractions.push({
          id: `${destination.toLowerCase()}-${element.id}`,
          name,
          // New format
          kind: group.type,
          lat: coords.lat,
          lon: coords.lon,
          shortDescription: extractDescription(element, group.type),
          // Legacy format
          type: group.type,
          coords,
          cost: 0,
          duration: 60,
          tags: group.tags.map(t => t.split('=')[1]).filter((t): t is string => !!t),
          description: extractDescription(element, group.type),
          // Shared
          rating: 4.0 + Math.random() * 0.5,
          address: buildAddress(element, destination),
        });
      }
      
      // Rate limit: wait between queries
      await sleep(500);
    } catch (err) {
      console.warn(`[POI] Overpass query failed for ${group.type}:`, err);
    }
  }
  
  return attractions;
}

/**
 * Fetch attractions from OpenStreetMap using Overpass API
 */
export async function fetchAttractions(
  env: Env,
  destination: string,
  _coords?: { lat: number; lon: number }
): Promise<Attraction[]> {
  try {
    console.log(`[POI] Fetching attractions for ${destination}`);
    
    // Define POI categories to search
    const tagGroups: { tags: string[]; type: AttractionType }[] = [
      { tags: ['tourism=attraction'], type: 'attraction' },
      { tags: ['tourism=museum'], type: 'museum' },
      { tags: ['historic=monument'], type: 'historical' },
      { tags: ['historic=castle'], type: 'historical' },
      { tags: ['historic=ruins'], type: 'historical' },
      { tags: ['tourism=viewpoint'], type: 'viewpoint' },
      { tags: ['leisure=park'], type: 'park' },
      { tags: ['amenity=place_of_worship'], type: 'religious' },
      { tags: ['tourism=artwork'], type: 'art' },
      { tags: ['tourism=gallery'], type: 'art' },
    ];
    
    const attractions = await fetchPOIsFromOverpass(destination, tagGroups, 15);
    
    // Deduplicate by coordinates (within 50m)
    const unique: Attraction[] = [];
    for (const attr of attractions) {
      const attrLat = attr.lat ?? attr.coords?.lat ?? 0;
      const attrLon = attr.lon ?? attr.coords?.lon ?? 0;
      const isDuplicate = unique.some(u => {
        const uLat = u.lat ?? u.coords?.lat ?? 0;
        const uLon = u.lon ?? u.coords?.lon ?? 0;
        return Math.abs(uLat - attrLat) < 0.0005 && Math.abs(uLon - attrLon) < 0.0005;
      });
      if (!isDuplicate) {
        unique.push(attr);
      }
    }
    
    console.log(`[POI] Found ${unique.length} unique attractions for ${destination}`);
    return unique.slice(0, 40); // Top 40 attractions
  } catch (error) {
    console.error('[POI] Failed to fetch attractions:', error);
    return [];
  }
}

/**
 * Fetch restaurants from OpenStreetMap using Overpass API
 */
export async function fetchRestaurants(
  env: Env,
  destination: string,
  _coords?: { lat: number; lon: number }
): Promise<Restaurant[]> {
  try {
    console.log(`[POI] Fetching restaurants for ${destination}`);
    
    const query = `
      [out:json][timeout:25];
      area["name"~"${destination}",i]["place"~"city|town|village"]->.searchArea;
      (
        node["amenity"="restaurant"](area.searchArea);
        way["amenity"="restaurant"](area.searchArea);
      );
      out center 25;
    `.trim();
    
    const response = await fetch(OVERPASS_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': USER_AGENT,
      },
      body: `data=${encodeURIComponent(query)}`,
    });
    
    if (!response.ok) {
      console.warn(`[POI] Failed to fetch restaurants: ${response.status}`);
      return [];
    }
    
    const data = await response.json() as any;
    const elements = data?.elements || [];
    
    console.log(`[POI] Overpass returned ${elements.length} restaurant elements for ${destination}`);
    
    const restaurants: Restaurant[] = [];
    
    for (const element of elements) {
      const coords = getCoordinates(element);
      if (!coords) continue;
      
      const name = extractName(element);
      if (!name || name === 'Unknown Place') continue;
      
      const tags = element.tags || {};
      
      // Extract cuisine
      let cuisine = 'local';
      if (tags.cuisine) {
        // Cuisine can be semicolon-separated
        cuisine = tags.cuisine.split(';')[0].trim();
      }
      
      // Extract price range
      let priceRange: '$' | '$$' | '$$$' | '$$$$' = '$$';
      if (tags['price_range']) {
        const pr = tags['price_range'];
        if (pr === 'cheap' || pr === '$') priceRange = '$';
        else if (pr === 'expensive' || pr === '$$$') priceRange = '$$$';
        else if (pr === 'luxury' || pr === '$$$$') priceRange = '$$$$';
      }
      
      restaurants.push({
        id: `${destination.toLowerCase()}-restaurant-${element.id}`,
        name,
        coords,
        cuisine,
        priceRange,
        rating: 4.0 + Math.random() * 0.5,
        specialties: tags.speciality ? [tags.speciality] : [],
        address: buildAddress(element, destination),
      });
    }
    
    console.log(`[POI] Found ${restaurants.length} restaurants for ${destination}`);
    return restaurants.slice(0, 20);
  } catch (error) {
    console.error('[POI] Failed to fetch restaurants:', error);
    return [];
  }
}
