/**
 * Vectorize indexing for attractions
 * Indexes attractions for semantic search
 */

import type { Env } from '../../types';
import type { Attraction } from './types';

/**
 * Index attractions in Vectorize for semantic search
 */
export async function indexAttractionsInVectorize(
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
      console.log(`[IndexVector] Indexed ${vectors.length} attractions in Vectorize`);
    }
  } catch (error) {
    console.error('[IndexVector] Failed to index in Vectorize:', error);
  }
}

