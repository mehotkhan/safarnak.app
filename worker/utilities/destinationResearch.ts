/**
 * Destination Research Service
 * 
 * Fetches and caches real destination data from multiple sources:
 * - Wikipedia/Wikidata for facts
 * - OpenStreetMap/Nominatim for places
 * - AI for synthesis and enrichment
 * 
 * Caching strategy:
 * - KV: Destination facts, attractions, restaurants (24h TTL)
 * - Vectorize: Semantic search for place matching
 */

import type { Env } from '../types';

export interface DestinationFacts {
  city: string;
  country: string;
  coordinates: { lat: number; lon: number };
  timezone: string;
  currency: string;
  language: string;
  avgCost: {
    budget: number;  // USD per day
    mid: number;
    luxury: number;
  };
  bestMonths: string[];
  climate: string;
  population?: number;
  fetchedAt: string;
}

export interface Attraction {
  id: string;
  name: string;
  type: 'historical' | 'museum' | 'park' | 'religious' | 'entertainment' | 'shopping' | 'nature';
  coords: { lat: number; lon: number };
  rating: number;
  cost: number; // USD
  hours?: string;
  duration: number; // minutes
  tags: string[];
  description?: string;
  address?: string;
  website?: string;
  phone?: string;
}

export interface Restaurant {
  id: string;
  name: string;
  coords: { lat: number; lon: number };
  cuisine: string;
  priceRange: '$' | '$$' | '$$$' | '$$$$';
  rating: number;
  specialties: string[];
  hours?: string;
  address?: string;
  phone?: string;
  website?: string;
}

export interface TransportInfo {
  airport?: string;
  metro: boolean;
  taxi: {
    avgCost: number;
    apps: string[];
  };
  bus: {
    avgCost: number;
  };
  bike?: {
    available: boolean;
    cost: number;
  };
}

export interface DestinationData {
  facts: DestinationFacts;
  attractions: Attraction[];
  restaurants: Restaurant[];
  transport: TransportInfo;
}

/**
 * Research a destination - cache-first approach
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
  
  // Fetch from multiple sources in parallel
  const [facts, attractions, restaurants, transport] = await Promise.all([
    fetchDestinationFacts(env, destination),
    fetchAttractions(env, destination),
    fetchRestaurants(env, destination),
    fetchTransportInfo(env, destination),
  ]);
  
  const data: DestinationData = {
    facts,
    attractions,
    restaurants,
    transport,
  };
  
  // Cache for 24 hours
  await env.KV.put(cacheKey, JSON.stringify(data), {
    expirationTtl: 86400,
  });
  
  // Index attractions in Vectorize for semantic search
  await indexAttractionsInVectorize(env, destination, attractions);
  
  console.log(`[Research] Cached ${destination}: ${attractions.length} attractions, ${restaurants.length} restaurants`);
  
  return data;
}

/**
 * Fetch destination facts from Wikipedia/Wikidata + AI
 */
async function fetchDestinationFacts(
  env: Env,
  destination: string
): Promise<DestinationFacts> {
  try {
    // Use Nominatim to get basic geo data
    const geoResponse = await fetch(
      `https://nominatim.openstreetmap.org/search?` +
      `q=${encodeURIComponent(destination)}&format=json&limit=1&addressdetails=1`,
      {
        headers: {
          'User-Agent': 'Safarnak-Travel-App/1.0 (https://safarnak.app)',
        },
      }
    );
    
    const geoData = await geoResponse.json() as any[];
    if (!geoData || geoData.length === 0) {
      throw new Error(`Destination not found: ${destination}`);
    }
    
    const place = geoData[0];
    const coords = {
      lat: parseFloat(place.lat),
      lon: parseFloat(place.lon),
    };
    
    // Use AI to synthesize facts about the destination
    const prompt = `You are a travel expert. Provide factual information about ${destination} in JSON format.

Respond with ONLY valid JSON (no markdown):
{
  "timezone": "timezone identifier (e.g., Asia/Tehran)",
  "currency": "currency code (e.g., USD, IRR)",
  "language": "primary language",
  "avgCost": {
    "budget": daily cost in USD for budget travelers,
    "mid": daily cost in USD for mid-range travelers,
    "luxury": daily cost in USD for luxury travelers
  },
  "bestMonths": ["month names when weather is best"],
  "climate": "brief climate description",
  "population": approximate population number
}`;
    
    const aiResponse: any = await env.AI.run('@cf/meta/llama-3.1-8b-instruct-fp8', {
      prompt,
      max_tokens: 512,
      temperature: 0.3,
    });
    
    const text = typeof aiResponse === 'string' ? aiResponse : 
                 aiResponse?.response || aiResponse?.generated_text || '{}';
    
    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const aiData = jsonMatch ? JSON.parse(jsonMatch[0]) : {};
    
    return {
      city: place.address?.city || place.address?.town || place.address?.village || destination,
      country: place.address?.country || 'Unknown',
      coordinates: coords,
      timezone: aiData.timezone || 'UTC',
      currency: aiData.currency || 'USD',
      language: aiData.language || 'English',
      avgCost: aiData.avgCost || { budget: 30, mid: 60, luxury: 150 },
      bestMonths: aiData.bestMonths || [],
      climate: aiData.climate || '',
      population: aiData.population,
      fetchedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error('[Research] Failed to fetch destination facts:', error);
    // Return minimal fallback
    return {
      city: destination,
      country: 'Unknown',
      coordinates: { lat: 0, lon: 0 },
      timezone: 'UTC',
      currency: 'USD',
      language: 'English',
      avgCost: { budget: 30, mid: 60, luxury: 150 },
      bestMonths: [],
      climate: '',
      fetchedAt: new Date().toISOString(),
    };
  }
}

/**
 * Fetch real attractions from OpenStreetMap
 */
async function fetchAttractions(
  env: Env,
  destination: string
): Promise<Attraction[]> {
  try {
    // Search for tourist attractions, museums, monuments in the area
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
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?` +
          `q=${encodeURIComponent(destination)}&${type}&format=json&limit=10&addressdetails=1`,
          {
            headers: {
              'User-Agent': 'Safarnak-Travel-App/1.0 (https://safarnak.app)',
            },
          }
        );
        
        const places = await response.json() as any[];
        
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
              rating: 4.0 + Math.random(), // Placeholder - would integrate real ratings
              cost: 0,
              duration: 60,
              tags: [type.split('=')[1]],
              address: place.display_name,
            });
          }
        }
        
        // Rate limit: wait 1 second between requests
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (err) {
        console.warn(`[Research] Failed to fetch ${type}:`, err);
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
    console.error('[Research] Failed to fetch attractions:', error);
    return [];
  }
}

/**
 * Fetch restaurants from OpenStreetMap
 */
async function fetchRestaurants(
  env: Env,
  destination: string
): Promise<Restaurant[]> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?` +
      `q=${encodeURIComponent(destination)}&amenity=restaurant&format=json&limit=15&addressdetails=1`,
      {
        headers: {
          'User-Agent': 'Safarnak-Travel-App/1.0 (https://safarnak.app)',
        },
      }
    );
    
    const places = await response.json();
    
    // Ensure places is an array
    if (!Array.isArray(places)) {
      console.warn('[Research] Nominatim returned non-array for restaurants:', typeof places);
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
        rating: 4.0 + Math.random(),
        specialties: [],
        address: place.display_name,
      }));
    
    return restaurants.slice(0, 10);
  } catch (error) {
    console.error('[Research] Failed to fetch restaurants:', error);
    return [];
  }
}

/**
 * Fetch transport info (AI-based for now)
 */
async function fetchTransportInfo(
  env: Env,
  destination: string
): Promise<TransportInfo> {
  try {
    const prompt = `What are the main transportation options in ${destination}? Respond with JSON only:
{
  "airport": "airport code or null",
  "metro": true/false,
  "taxi": {"avgCost": number in USD, "apps": ["app names"]},
  "bus": {"avgCost": number in USD}
}`;
    
    const aiResponse: any = await env.AI.run('@cf/meta/llama-3.1-8b-instruct-fp8', {
      prompt,
      max_tokens: 256,
      temperature: 0.3,
    });
    
    const text = typeof aiResponse === 'string' ? aiResponse : 
                 aiResponse?.response || aiResponse?.generated_text || '{}';
    
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const data = jsonMatch ? JSON.parse(jsonMatch[0]) : {};
    
    return {
      airport: data.airport || undefined,
      metro: data.metro || false,
      taxi: data.taxi || { avgCost: 10, apps: [] },
      bus: data.bus || { avgCost: 2 },
    };
  } catch (error) {
    console.error('[Research] Failed to fetch transport info:', error);
    return {
      metro: false,
      taxi: { avgCost: 10, apps: [] },
      bus: { avgCost: 2 },
    };
  }
}

/**
 * Index attractions in Vectorize for semantic search
 */
async function indexAttractionsInVectorize(
  env: Env,
  destination: string,
  attractions: Attraction[]
): Promise<void> {
  try {
    const vectors = [];
    
    for (const attr of attractions) {
      // Create searchable text
      const text = `${attr.name} ${attr.type} ${attr.tags.join(' ')} ${attr.description || ''}`;
      
      // Generate embedding
      const embedding: any = await env.AI.run('@cf/baai/bge-m3', { text });
      const vector = embedding?.data?.[0] || embedding?.embedding || [];
      
      if (vector.length > 0) {
        vectors.push({
          id: attr.id,
          values: vector,
          metadata: {
            city: destination.toLowerCase(),
            name: attr.name,
            type: attr.type,
            tags: attr.tags.join(','),
            cost: attr.cost,
            rating: attr.rating,
            coords: `${attr.coords.lat},${attr.coords.lon}`,
          },
        });
      }
    }
    
    if (vectors.length > 0) {
      await env.VECTORIZE.upsert(vectors);
      console.log(`[Research] Indexed ${vectors.length} attractions in Vectorize`);
    }
  } catch (error) {
    console.error('[Research] Failed to index in Vectorize:', error);
  }
}

/**
 * Search attractions by user preferences (semantic search)
 */
export async function searchAttractionsByPreferences(
  env: Env,
  destination: string,
  preferences: string,
  limit: number = 10
): Promise<Attraction[]> {
  try {
    // Generate embedding for user preferences
    const embedding: any = await env.AI.run('@cf/baai/bge-m3', { 
      text: preferences 
    });
    const vector = embedding?.data?.[0] || embedding?.embedding || [];
    
    if (vector.length === 0) {
      console.warn('[Research] Failed to generate preference embedding');
      return [];
    }
    
    // Search Vectorize
    const results: any = await env.VECTORIZE.query(vector, {
      topK: limit,
      filter: { city: destination.toLowerCase() },
      returnMetadata: true,
    });
    
    // Convert back to Attraction objects
    const attractions: Attraction[] = results.matches?.map((match: any) => {
      const [lat, lon] = match.metadata.coords.split(',').map(parseFloat);
      return {
        id: match.id,
        name: match.metadata.name,
        type: match.metadata.type,
        coords: { lat, lon },
        rating: match.metadata.rating,
        cost: match.metadata.cost,
        duration: 60,
        tags: match.metadata.tags.split(','),
      };
    }) || [];
    
    console.log(`[Research] Found ${attractions.length} matching attractions via semantic search`);
    return attractions;
  } catch (error) {
    console.error('[Research] Semantic search failed:', error);
    return [];
  }
}

