/**
 * Main destination research orchestrator
 * Cache-first approach with multi-source data fetching
 */

import type { Env } from '../../types';
import type { DestinationData, DestinationFacts, TransportInfo } from './types';
import { geocodeDestination } from './geo';
import { fetchAttractions, fetchRestaurants } from './poi';
import { fetchWikipediaFacts } from './wiki';
import { synthesizeFacts, synthesizeTransportInfo } from './synthesize';
import { indexAttractionsInVectorize } from './indexVector';

// Re-export types for convenience
export type { DestinationData, DestinationFacts, Attraction, Restaurant, TransportInfo } from './types';

/**
 * Research a destination - cache-first approach
 * Fetches from multiple sources and caches result
 */
export async function researchDestination(
  env: Env,
  destination: string
): Promise<DestinationData> {
  const cacheKey = `destination:${destination.toLowerCase().trim()}`;
  
  // Try cache first
  const cached = await env.KV.get(cacheKey, 'json');
  if (cached) {
    console.log(`[Research] Cache HIT for ${destination}`);
    return cached as DestinationData;
  }
  
  console.log(`[Research] Cache MISS for ${destination}, fetching...`);
  
  // Step 1: Geocode destination (get coordinates)
  const geoResult = await geocodeDestination(env, destination);
  
  // Step 2: Fetch data in parallel
  const [attractions, restaurants, wikiFacts] = await Promise.all([
    fetchAttractions(env, destination, geoResult.coords),
    fetchRestaurants(env, destination, geoResult.coords),
    fetchWikipediaFacts(env, destination, geoResult.raw.address?.country),
  ]);
  
  // Step 3: Synthesize facts with AI (after we have raw data)
  const synthesizedFacts = await synthesizeFacts(env, {
    destination,
    country: geoResult.raw.address?.country,
    wikiExtract: wikiFacts ? undefined : undefined, // Could pass wiki extract if needed
  });
  
  // Step 4: Synthesize transport info
  const transport = await synthesizeTransportInfo(env, destination, geoResult.raw.address?.country);
  
  // Step 5: Compose full destination facts
  const facts: DestinationFacts = {
    city: geoResult.raw.address?.city || 
          geoResult.raw.address?.town || 
          geoResult.raw.address?.village || 
          destination,
    country: geoResult.raw.address?.country || 'Unknown',
    coordinates: geoResult.coords,
    timezone: synthesizedFacts.timezone,
    currency: synthesizedFacts.currency,
    language: synthesizedFacts.language,
    avgCost: synthesizedFacts.avgCost,
    bestMonths: synthesizedFacts.bestMonths,
    climate: synthesizedFacts.climate,
    population: synthesizedFacts.population || wikiFacts?.population,
    fetchedAt: new Date().toISOString(),
  };
  
  // Step 6: Compose full destination data
  const data: DestinationData = {
    facts,
    attractions,
    restaurants,
    transport: transport as TransportInfo,
  };
  
  // Step 7: Cache for 24 hours
  await env.KV.put(cacheKey, JSON.stringify(data), {
    expirationTtl: 86400,
  });
  
  // Step 8: Index attractions in Vectorize for semantic search
  await indexAttractionsInVectorize(env, destination, attractions);
  
  console.log(`[Research] Cached ${destination}: ${attractions.length} attractions, ${restaurants.length} restaurants`);
  
  return data;
}
