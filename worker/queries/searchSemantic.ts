import type { GraphQLContext, Env } from '../types';
import { getServerDB, posts, trips, tours, places, locations, users } from '@database/server';
import { eq } from 'drizzle-orm';

function toCursor(createdAt: string, id: string): string {
  const s = `${createdAt}|${id}`;
  return typeof btoa === 'function' ? btoa(s) : s;
}

async function embedQuery(env: Env, query: string): Promise<number[]> {
  try {
    // Multilingual small model, 1024 dimensions
    const res: any = await env.AI.run('@cf/baai/bge-m3', {
      text: query,
    });
    
    // Log the response structure for debugging
    console.log('[searchSemantic] Raw AI response structure:', {
      hasData: !!res?.data,
      dataIsArray: Array.isArray(res?.data),
      dataLength: res?.data?.length,
      data0IsArray: Array.isArray(res?.data?.[0]),
      data0Length: res?.data?.[0]?.length,
      hasEmbedding: !!res?.embedding,
      embeddingIsArray: Array.isArray(res?.embedding),
      keys: res ? Object.keys(res) : [],
    });
    
    // bge-m3 can return embeddings in different formats:
    // 1. { data: [[...]] } - 2D array where data[0] is the embedding
    // 2. { data: [{ embedding: [...] }] } - array of objects with embedding property
    // 3. { embedding: [...] } - direct embedding property
    let embedding: number[] = [];
    
    if (res?.data && Array.isArray(res.data)) {
      // Check if data[0] is an array (format 1: 2D array)
      if (res.data.length > 0 && Array.isArray(res.data[0])) {
        embedding = res.data[0];
      } 
      // Check if data[0] is an object with embedding property (format 2)
      else if (res.data.length > 0 && res.data[0]?.embedding && Array.isArray(res.data[0].embedding)) {
        embedding = res.data[0].embedding;
      }
    }
    
    // Check for direct embedding property (format 3)
    if ((!embedding || embedding.length === 0) && Array.isArray(res?.embedding)) {
      embedding = res.embedding;
    }
    
    // Final validation
    if (!Array.isArray(embedding) || embedding.length === 0) {
      console.error('[searchSemantic] Empty embedding returned for query:', query);
      console.error('[searchSemantic] Response:', JSON.stringify(res, null, 2));
      throw new Error('Failed to generate embedding: empty vector');
    }
    
    if (embedding.length !== 1024) {
      console.error('[searchSemantic] Wrong embedding dimension:', embedding.length, 'expected 1024');
      throw new Error(`Invalid embedding dimension: ${embedding.length}, expected 1024`);
    }
    
    console.log('[searchSemantic] Successfully extracted embedding with', embedding.length, 'dimensions');
    return embedding;
  } catch (error) {
    console.error('[searchSemantic] Embedding generation failed:', error);
    throw error instanceof Error ? error : new Error('Failed to generate search embedding');
  }
}

export const searchSemantic = async (
  _parent: unknown,
  { query, entityTypes, first = 20, after: _after }: { query: string; entityTypes?: string[]; first?: number; after?: string },
  context: GraphQLContext
) => {
  const db = getServerDB(context.env.DB);
  const vector = await embedQuery(context.env, query);
  
  // Validate vector before querying
  if (!Array.isArray(vector) || vector.length === 0) {
    console.error('[searchSemantic] Invalid vector passed to VECTORIZE:', {
      isArray: Array.isArray(vector),
      length: vector?.length,
      type: typeof vector,
    });
    throw new Error('Invalid embedding vector: empty or not an array');
  }
  
  if (vector.length !== 1024) {
    console.error('[searchSemantic] Vector dimension mismatch:', vector.length, 'expected 1024');
    throw new Error(`Invalid vector dimension: ${vector.length}, expected 1024`);
  }
  
  // Vectorize filters don't support arrays, so we'll filter results after querying
  // For now, query without filter and filter in code if needed
  const topK = Math.min(Math.max(first, 1), 50);

  // VECTORIZE.query takes vector as first arg, options as second arg
  const results: any = await context.env.VECTORIZE.query(vector, {
    topK: entityTypes && entityTypes.length > 0 ? topK * 2 : topK, // Get more results if filtering
  });

  const edges: any[] = [];
  const entityTypeSet = entityTypes && entityTypes.length > 0 ? new Set(entityTypes) : null;
  
  for (const hit of results?.matches || []) {
    const meta = hit?.metadata || {};
    const entityType = meta.entityType || meta.entity_type;
    const entityId = meta.entityId || meta.entity_id || meta.id;
    if (!entityType || !entityId) continue;
    
    // Filter by entityTypes if provided
    if (entityTypeSet && !entityTypeSet.has(entityType)) continue;
    let entity: any = null;
    let actor: any = null;
    if (entityType === 'POST') {
      entity = await db.select().from(posts).where(eq(posts.id, entityId)).get();
      if (entity) actor = await db.select().from(users).where(eq(users.id, entity.userId)).get();
    } else if (entityType === 'TRIP') {
      entity = await db.select().from(trips).where(eq(trips.id, entityId)).get();
      if (entity) actor = await db.select().from(users).where(eq(users.id, entity.userId)).get();
    } else if (entityType === 'TOUR') {
      entity = await db.select().from(tours).where(eq(tours.id, entityId)).get();
    } else if (entityType === 'PLACE') {
      entity = await db.select().from(places).where(eq(places.id, entityId)).get();
    } else if (entityType === 'LOCATION') {
      entity = await db.select().from(locations).where(eq(locations.id, entityId)).get();
    }
    if (!entity) continue;
    edges.push({
      cursor: toCursor(entity.createdAt || '', entity.id),
      node: {
        id: `sem-${entityType}-${entityId}`,
        entityType,
        entityId,
        verb: 'CREATED',
        actor: actor
          ? {
              id: actor.id,
              name: actor.name,
              username: actor.username,
              email: actor.email,
              phone: actor.phone,
              avatar: actor.avatar,
              createdAt: actor.createdAt,
            }
          : { id: '', name: '', username: '', createdAt: entity.createdAt },
        entity: {
          __typename:
            entityType === 'POST'
              ? 'Post'
              : entityType === 'TRIP'
              ? 'Trip'
              : entityType === 'TOUR'
              ? 'Tour'
              : entityType === 'PLACE'
              ? 'Place'
              : 'Location',
          ...entity,
        },
        topics: [],
        visibility: 'PUBLIC',
        createdAt: entity.createdAt,
      },
    });
  }

  // Limit to requested count after filtering
  const limitedEdges = edges.slice(0, first);

  return {
    edges: limitedEdges,
    pageInfo: { endCursor: limitedEdges.length ? limitedEdges[limitedEdges.length - 1].cursor : null, hasNextPage: edges.length > first },
  };
};


