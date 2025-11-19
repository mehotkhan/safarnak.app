/**
 * Semantic search for attractions using Vectorize
 */

import type { Env } from '../../types';
import type { Attraction } from '../destination/types';
import { embedText } from './embed';

/**
 * Search attractions by user preferences using semantic search
 */
export async function searchAttractionsByPreferences(
  env: Env,
  destination: string,
  preferences: string,
  limit: number = 10
): Promise<Attraction[]> {
  try {
    // Step 1: Generate embedding for user preferences
    const vector = await embedText(env, preferences);
    
    if (vector.length === 0) {
      console.warn('[SearchAttractions] Failed to generate preference embedding');
      return [];
    }
    
    // Step 2: Search Vectorize
    const results: any = await env.VECTORIZE.query(vector, {
      topK: limit,
      filter: { city: destination.toLowerCase() },
      returnMetadata: true,
    });
    
    // Step 3: Convert back to Attraction objects
    const attractions: Attraction[] = (results.matches || []).map((match: any) => {
      const [lat, lon] = match.metadata.coords.split(',').map(parseFloat);
      return {
        id: match.id,
        name: match.metadata.name,
        type: match.metadata.type,
        coords: { lat, lon },
        rating: match.metadata.rating,
        cost: match.metadata.cost,
        duration: 60,
        tags: match.metadata.tags ? match.metadata.tags.split(',') : [],
      };
    });
    
    console.log(`[SearchAttractions] Found ${attractions.length} matching attractions via semantic search`);
    return attractions;
  } catch (error) {
    console.error('[SearchAttractions] Semantic search failed:', error);
    return [];
  }
}

