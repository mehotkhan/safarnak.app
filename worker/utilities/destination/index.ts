/**
 * Destination Research Module
 * 
 * Builds DestinationData from external APIs:
 * - OpenTripMap: Attractions and POIs (primary source)
 * - Wikivoyage/Wikipedia: Travel guide content
 * - Open-Meteo: Weather forecasts (no API key needed)
 * 
 * Cache-first approach with KV storage
 * AI does NOT research - it consumes this structured data
 */

import type { Env } from '../../types';
import type { 
  DestinationData, 
  Attraction, 
  FoodSpot, 
  DestinationFacts,
  LegacyDestinationData,
  Restaurant,
} from './types';
import { attractionToLegacy, foodSpotToLegacy } from './types';
import {
  geocodeDestination as otmGeocode,
  listAttractions as otmListAttractions,
  listFoodSpots as otmListFoodSpots,
  getPlacesDetails as otmGetPlacesDetails,
  getPrimaryKind,
  type OtmPlace,
  type OtmPlaceDetails,
} from '../external/opentripmap';
import { getTravelGuideInfo } from '../external/wikivoyage';
import {
  getTripWeather,
  type TripDayWeather,
} from '../external/openmeteo';
import { indexAttractionsInVectorize } from './indexVector';

// Re-export types for convenience
export type { 
  DestinationData, 
  Attraction, 
  FoodSpot, 
  DestinationFacts,
  ForecastDay,
  TransportInfo,
  // Legacy types for backward compatibility
  LegacyAttraction,
  Restaurant,
  LegacyDestinationData,
} from './types';

// Cache TTL: 24 hours
const CACHE_TTL = 86400;

/**
 * Generate cache key for destination
 */
function getCacheKey(destination: string, lang: string): string {
  const slug = destination.toLowerCase().trim().replace(/\s+/g, '-');
  return `destination:${slug}:${lang}`;
}

/**
 * Generate destination ID/slug
 */
function getDestinationSlug(name: string, country: string): string {
  const nameSlug = name.toLowerCase().trim().replace(/\s+/g, '-');
  const countryCode = country.substring(0, 2).toLowerCase();
  return `${nameSlug}-${countryCode}`;
}

/**
 * Research a destination - main entry point
 * Cache-first approach with external API fallback
 * 
 * @param env - Worker environment
 * @param destination - City/destination name
 * @param tripDays - Number of trip days (for weather forecast)
 * @param lang - Language code
 */
export async function researchDestination(
  env: Env,
  destination: string,
  tripDays = 7,
  lang = 'en'
): Promise<DestinationData> {
  const cacheKey = getCacheKey(destination, lang);
  
  // Try cache first
  try {
    const cached = await env.KV.get(cacheKey, 'json');
    if (cached) {
      console.log(`[Research] Cache HIT for ${destination}`);
      return cached as DestinationData;
    }
  } catch (err) {
    console.warn('[Research] Cache read error:', err);
  }
  
  console.log(`[Research] Cache MISS for ${destination}, fetching from APIs...`);
  const t0 = Date.now();

  // Step 1: Geocode destination to get coordinates
  const geoResult = await otmGeocode(env, destination, lang);
  
  if (!geoResult) {
    console.error(`[Research] Failed to geocode: ${destination}`);
    // Return minimal fallback data
    return createFallbackDestination(destination, lang, cacheKey);
  }

  const center = { lat: geoResult.lat, lon: geoResult.lon };
  const country = geoResult.country || 'Unknown';

  console.log(`[Research] Geocoded ${destination} to ${center.lat}, ${center.lon}`);

  // Step 2: Fetch data in parallel
  const [
    wikiInfo,
    otmAttractions,
    otmFood,
    weather,
  ] = await Promise.all([
    // Wikivoyage/Wikipedia summary and guide
    getTravelGuideInfo(destination, lang).catch((wikiErr: unknown) => {
      console.warn('[Research] Wiki info failed:', wikiErr);
      return { 
        summary: `Travel information about ${destination}`,
        seeDo: undefined,
        eat: undefined,
        sleep: undefined,
      };
    }),
    
    // OpenTripMap attractions
    otmListAttractions(env, center.lat, center.lon, { lang, limit: 60, rate: 2 })
      .catch((otmErr: unknown) => {
        console.warn('[Research] OTM attractions failed:', otmErr);
        return [] as OtmPlace[];
      }),
    
    // OpenTripMap food spots
    otmListFoodSpots(env, center.lat, center.lon, { lang, limit: 40 })
      .catch(err => {
        console.warn('[Research] OTM food failed:', err);
        return [] as OtmPlace[];
      }),
    
    // Weather forecast
    getTripWeather(center.lat, center.lon, Math.min(tripDays, 14), geoResult.timezone || 'auto')
      .catch(err => {
        console.warn('[Research] Weather failed:', err);
        return [] as TripDayWeather[];
      }),
  ]);

  // Step 3: Enrich top attractions with details (limit to top 15 by importance)
  const topAttractionIds = otmAttractions
    .sort((a: OtmPlace, b: OtmPlace) => (b.rate || 0) - (a.rate || 0))
    .slice(0, 15)
    .map((a: OtmPlace) => a.xid);

  let enrichedDetails: OtmPlaceDetails[] = [];
  if (topAttractionIds.length > 0) {
    enrichedDetails = await otmGetPlacesDetails(env, topAttractionIds, lang, 50);
  }

  // Step 4: Map to Attraction format
  const attractions: Attraction[] = otmAttractions.map((otm: OtmPlace) => {
    const details = enrichedDetails.find((d: OtmPlaceDetails) => d.xid === otm.xid);
    return mapOtmToAttraction(otm, details);
  });

  // Step 5: Map food spots from OpenTripMap
  const foodSpots: FoodSpot[] = otmFood.map(mapOtmToFoodSpot);

  // Step 6: Build destination facts
  const facts: DestinationFacts = {
    city: geoResult.name || destination,
    country,
    coordinates: center,
    timezone: geoResult.timezone,
    population: geoResult.population,
    // These would need AI synthesis or additional API - simplified for now
    avgCost: { budget: 50, mid: 100, luxury: 250 },
    bestMonths: [],
  };

  // Step 7: Build legacy restaurants from foodSpots
  const restaurants: Restaurant[] = foodSpots.map(f => ({
    id: f.id,
    name: f.name,
    coords: { lat: f.lat, lon: f.lon },
    cuisine: f.cuisine || 'local',
    priceRange: (f.priceLevel ? ['$', '$$', '$$$', '$$$$'][f.priceLevel - 1] : '$$') as '$' | '$$' | '$$$' | '$$$$',
    rating: f.rating || 4.0,
    specialties: [],
    address: f.address,
    website: f.website,
  }));

  // Step 8: Build complete DestinationData
  const data: DestinationData = {
    id: getDestinationSlug(geoResult.name || destination, country),
    name: geoResult.name || destination,
    country,
    center,
    summary: wikiInfo.summary,
    travelGuide: {
      seeDo: wikiInfo.seeDo,
      eat: wikiInfo.eat,
      sleep: wikiInfo.sleep,
    },
    attractions,
    foodSpots,
    restaurants, // Legacy compatibility
    forecast: weather.length > 0 ? {
      days: weather,
      timezone: geoResult.timezone,
    } : undefined,
    facts,
    fetchedAt: new Date().toISOString(),
    cacheKey,
  };

  console.log(`[Research] Built DestinationData in ${Date.now() - t0}ms: ${attractions.length} attractions, ${foodSpots.length} food spots`);

  // Step 9: Cache result
  try {
    await env.KV.put(cacheKey, JSON.stringify(data), {
      expirationTtl: CACHE_TTL,
    });
    console.log(`[Research] Cached ${destination} for ${CACHE_TTL}s`);
  } catch (cacheErr) {
    console.warn('[Research] Cache write error:', cacheErr);
  }

  // Step 10: Index attractions in Vectorize (async, non-blocking)
  indexAttractionsInVectorize(env, destination, attractions).catch((indexErr: unknown) => {
    console.warn('[Research] Vectorize indexing failed:', indexErr);
  });

  return data;
}

/**
 * Map OpenTripMap place to Attraction
 * Includes both new format (lat/lon/kind) and legacy format (coords/type) for compatibility
 */
function mapOtmToAttraction(place: OtmPlace, details?: OtmPlaceDetails): Attraction {
  const kind = getPrimaryKind(place.kinds);
  const description = details?.wikipedia_extracts?.text?.substring(0, 200) || 
                      details?.info?.descr?.substring(0, 200);
  const address = details?.address ? formatAddress(details.address) : undefined;
  
  return {
    id: place.xid,
    name: place.name,
    // New format
    kind,
    lat: place.point.lat,
    lon: place.point.lon,
    shortDescription: description,
    importance: place.rate,
    imageUrl: details?.preview?.source,
    // Legacy format
    type: mapKindToLegacyType(kind),
    coords: { lat: place.point.lat, lon: place.point.lon },
    cost: 0,
    duration: 60,
    tags: place.kinds.split(',').map(k => k.trim()).filter(Boolean),
    description,
    // Shared
    rating: place.rate ? place.rate / 7 * 5 : 4.0,
    address,
    website: details?.url,
  };
}

/**
 * Map kind string to legacy type
 */
function mapKindToLegacyType(kind: string): Attraction['type'] {
  const kindLower = kind.toLowerCase();
  if (kindLower.includes('museum')) return 'museum';
  if (kindLower.includes('historic') || kindLower.includes('monument')) return 'historical';
  if (kindLower.includes('park') || kindLower.includes('garden')) return 'park';
  if (kindLower.includes('church') || kindLower.includes('mosque') || kindLower.includes('temple')) return 'religious';
  if (kindLower.includes('viewpoint')) return 'viewpoint';
  if (kindLower.includes('art') || kindLower.includes('gallery')) return 'art';
  if (kindLower.includes('shop') || kindLower.includes('market')) return 'shopping';
  if (kindLower.includes('nature') || kindLower.includes('beach')) return 'nature';
  return 'attraction';
}

/**
 * Map OpenTripMap food place to FoodSpot
 */
function mapOtmToFoodSpot(place: OtmPlace): FoodSpot {
  const kinds = place.kinds.toLowerCase();
  let category = 'restaurant';
  if (kinds.includes('cafe')) category = 'cafe';
  else if (kinds.includes('bar')) category = 'bar';
  else if (kinds.includes('fast_food')) category = 'fast_food';

  return {
    id: place.xid,
    name: place.name,
    category,
    lat: place.point.lat,
    lon: place.point.lon,
    rating: place.rate ? place.rate / 7 * 5 : undefined,
  };
}


/**
 * Format OTM address object to string
 */
function formatAddress(addr: OtmPlaceDetails['address']): string {
  if (!addr) return '';
  const parts: string[] = [];
  if (addr.road) {
    parts.push(addr.house_number ? `${addr.house_number} ${addr.road}` : addr.road);
  }
  if (addr.suburb) parts.push(addr.suburb);
  if (addr.city) parts.push(addr.city);
  return parts.join(', ');
}

/**
 * Create fallback destination when APIs fail
 */
function createFallbackDestination(destination: string, lang: string, cacheKey: string): DestinationData {
  return {
    id: destination.toLowerCase().replace(/\s+/g, '-'),
    name: destination,
    country: 'Unknown',
    center: { lat: 0, lon: 0 },
    summary: `Travel information about ${destination}`,
    attractions: [],
    foodSpots: [],
    facts: {
      city: destination,
      country: 'Unknown',
      coordinates: { lat: 0, lon: 0 },
      avgCost: { budget: 50, mid: 100, luxury: 250 },
    },
    fetchedAt: new Date().toISOString(),
    cacheKey,
  };
}

/**
 * Convert new DestinationData to legacy format
 * For backward compatibility with existing code
 */
export function toLegacyFormat(data: DestinationData): LegacyDestinationData {
  return {
    facts: {
      ...data.facts,
      fetchedAt: data.fetchedAt,
    },
    attractions: data.attractions.map((a: Attraction) => attractionToLegacy(a)),
    restaurants: data.foodSpots.map((f: FoodSpot) => foodSpotToLegacy(f)),
    transport: {
      metro: false,
      taxi: { avgCost: 10, apps: [] },
      bus: { avgCost: 2 },
    },
  };
}

/**
 * Invalidate cache for a destination
 */
export async function invalidateCache(env: Env, destination: string, lang = 'en'): Promise<void> {
  const cacheKey = getCacheKey(destination, lang);
  await env.KV.delete(cacheKey);
  console.log(`[Research] Cache invalidated for ${destination}`);
}
