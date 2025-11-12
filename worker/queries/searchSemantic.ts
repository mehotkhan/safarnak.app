import type { GraphQLContext, Env } from '../types';
import { getServerDB, posts, trips, tours, places, locations, users } from '@database/server';
import { eq } from 'drizzle-orm';

function toCursor(createdAt: string, id: string): string {
  const s = `${createdAt}|${id}`;
  return typeof btoa === 'function' ? btoa(s) : s;
}

async function embedQuery(env: Env, query: string): Promise<number[]> {
  // Multilingual small model, inexpensive
  const res: any = await env.AI.run('@cf/baai/bge-m3', {
    text: query,
  });
  // bge-m3 returns { data: [ { embedding: number[] } ] } or similar
  const embedding = res?.data?.[0]?.embedding || res?.embedding || [];
  return embedding;
}

export const searchSemantic = async (
  _parent: unknown,
  { query, entityTypes, first = 20, after: _after }: { query: string; entityTypes?: string[]; first?: number; after?: string },
  context: GraphQLContext
) => {
  const db = getServerDB(context.env.DB);
  const vector = await embedQuery(context.env, query);
  const filter = entityTypes && entityTypes.length > 0 ? { entityType: entityTypes } : undefined;
  const topK = Math.min(Math.max(first, 1), 50);

  const results: any = await context.env.VECTORIZE.query({
    vector,
    topK,
    filter,
  } as any);

  const edges: any[] = [];
  for (const hit of results?.matches || []) {
    const meta = hit?.metadata || {};
    const entityType = meta.entityType || meta.entity_type;
    const entityId = meta.entityId || meta.entity_id || meta.id;
    if (!entityType || !entityId) continue;
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

  return {
    edges,
    pageInfo: { endCursor: edges.length ? edges[edges.length - 1].cursor : null, hasNextPage: false },
  };
};


