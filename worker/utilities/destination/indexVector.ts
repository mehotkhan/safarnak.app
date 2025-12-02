/**
 * Vectorize indexing for attractions
 * Indexes attractions for semantic search using BGE-M3 embeddings
 */

import type { Env } from '../../types';
import type { Attraction } from './types';
import { AI_MODELS } from '../ai/models';

/**
 * Index attractions in Vectorize for semantic search
 * Stores complete metadata including name, address, description for retrieval
 */
export async function indexAttractionsInVectorize(
  env: Env,
  destination: string,
  attractions: Attraction[]
): Promise<void> {
  try {
    if (attractions.length === 0) {
      console.log(`[IndexVector] No attractions to index for ${destination}`);
      return;
    }

    const vectors: Array<{
      id: string;
      values: number[];
      metadata: Record<string, string | number>;
    }> = [];
    
    for (const attr of attractions) {
      // Get coordinates - support both formats
      const lat = attr.lat ?? attr.coords?.lat ?? 0;
      const lon = attr.lon ?? attr.coords?.lon ?? 0;
      
      // Get type/kind - support both formats
      const type = attr.type || attr.kind || 'attraction';
      
      // Get description - support both formats
      const description = attr.description || attr.shortDescription || '';
      
      // Get tags
      const tags = attr.tags?.join(' ') || attr.kind || '';
      
      // Create rich searchable text including all relevant fields
      const searchText = [
        attr.name,
        type,
        tags,
        description,
        attr.address || '',
      ].filter(Boolean).join(' ');
      
      // Generate embedding using BGE-M3
      const embedding: any = await env.AI.run(AI_MODELS.EMBEDDINGS as any, { text: searchText });
      const vector = embedding?.data?.[0] || embedding?.embedding || [];
      
      if (vector.length > 0) {
        vectors.push({
          id: attr.id,
          values: vector,
          metadata: {
            city: destination.toLowerCase(),
            name: attr.name,
            type: type,
            tags: attr.tags?.join(',') || attr.kind || '',
            cost: attr.cost || 0,
            rating: attr.rating || 4.0,
            coords: `${lat},${lon}`,
            // Include address and description for complete retrieval
            address: attr.address || destination,
            description: description.substring(0, 200), // Limit size
          },
        });
      }
    }
    
    if (vectors.length > 0) {
      // Batch upsert for efficiency
      const batchSize = 50;
      for (let i = 0; i < vectors.length; i += batchSize) {
        const batch = vectors.slice(i, i + batchSize);
        await env.VECTORIZE.upsert(batch);
      }
      console.log(`[IndexVector] Indexed ${vectors.length} attractions for ${destination} in Vectorize`);
    }
  } catch (error) {
    console.error('[IndexVector] Failed to index in Vectorize:', error);
  }
}
