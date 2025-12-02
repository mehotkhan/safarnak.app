/**
 * Semantic search for attractions using Vectorize
 * Uses BGE-M3 embeddings for multilingual semantic matching
 */

import type { Env } from '../../types';
import type { Attraction } from '../destination/types';
import { embedText } from './embed';

/**
 * Search attractions by user preferences using semantic search
 * Returns attractions with complete metadata (name, address, description)
 */
export async function searchAttractionsByPreferences(
  env: Env,
  destination: string,
  preferences: string,
  limit: number = 10
): Promise<Attraction[]> {
  try {
    // If no preferences provided, return empty to trigger fallback
    if (!preferences || preferences.trim().length === 0) {
      console.log('[SearchAttractions] No preferences provided, returning empty for fallback');
      return [];
    }
    
    // Step 1: Generate embedding for user preferences
    // Combine destination context with preferences for better matching
    const searchQuery = `${destination}: ${preferences}`;
    const vector = await embedText(env, searchQuery);
    
    if (vector.length === 0) {
      console.warn('[SearchAttractions] Failed to generate preference embedding');
      return [];
    }
    
    // Step 2: Search Vectorize with destination filter
    const results: any = await env.VECTORIZE.query(vector, {
      topK: limit,
      filter: { city: destination.toLowerCase() },
      returnMetadata: 'all', // Get all metadata
    });
    
    const matchCount = results?.matches?.length || 0;
    console.log(`[SearchAttractions] Vectorize query for "${destination}" returned ${matchCount} matches`);
    
    // Step 3: Convert back to Attraction objects with complete data
    const attractions: Attraction[] = (results.matches || []).map((match: any) => {
      try {
        const meta = match.metadata || {};
        const coordsStr = meta.coords || '0,0';
        const [lat, lon] = coordsStr.split(',').map(parseFloat);
        
        return {
          id: match.id,
          name: meta.name || 'Unknown',
          type: meta.type || 'attraction',
          coords: { 
            lat: isNaN(lat) ? 0 : lat, 
            lon: isNaN(lon) ? 0 : lon 
          },
          rating: parseFloat(meta.rating) || 4.0,
          cost: parseFloat(meta.cost) || 0,
          duration: 60,
          tags: meta.tags ? meta.tags.split(',').filter(Boolean) : [],
          // Include complete address and description
          address: meta.address || destination,
          description: meta.description || `${meta.type || 'Place'} in ${destination}`,
        };
      } catch (err) {
        console.warn('[SearchAttractions] Failed to parse match:', err, match);
        return null;
      }
    }).filter((a: Attraction | null): a is Attraction => a !== null);
    
    // Log sample for debugging
    if (attractions.length > 0) {
      console.log(`[SearchAttractions] Sample attraction:`, {
        name: attractions[0].name,
        type: attractions[0].type,
        address: attractions[0].address,
        hasDescription: !!attractions[0].description,
      });
    }
    
    console.log(`[SearchAttractions] Found ${attractions.length} matching attractions via semantic search`);
    return attractions;
  } catch (error) {
    console.error('[SearchAttractions] Semantic search failed:', error);
    // Return empty array to trigger fallback to all attractions
    return [];
  }
}

