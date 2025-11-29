import { and, desc, like, or, sql } from 'drizzle-orm';
import { getServerDB, searchIndex, users, posts, trips, places, locations } from '@database/server';
import type { GraphQLContext } from '../types';
import { eq } from 'drizzle-orm';

type EntityType = 'POST' | 'TRIP' | 'PLACE' | 'LOCATION'; // TOUR removed - use TRIP with isHosted = true

interface SearchArgs {
  query: string;
  entityTypes?: EntityType[];
  topics?: string[];
  first?: number;
  after?: string;
}

function parseCursor(after?: string): { createdAt?: string; id?: string } {
  if (!after) return {};
  try {
    const decoded = typeof atob === 'function' ? atob(after) : after;
    const [createdAt, id] = decoded.split('|');
    if (createdAt && id) return { createdAt, id };
  } catch {
    // ignore
  }
  return {};
}

function toCursor(createdAt: string, id: string): string {
  const s = `${createdAt}|${id}`;
  return typeof btoa === 'function' ? btoa(s) : s;
}

export const search = async (_: unknown, args: SearchArgs, context: GraphQLContext) => {
  const db = getServerDB(context.env.DB);
  const q = args.query.trim();
  if (!q) {
    return { edges: [], pageInfo: { endCursor: null, hasNextPage: false } };
  }
  const first = Math.min(Math.max(args.first ?? 20, 1), 50);
  const { createdAt: afterCreatedAt, id: afterId } = parseCursor(args.after);

  const where: any[] = [];
  const wildcard = `%${q}%`;
  where.push(
    or(
      like(searchIndex.title, wildcard),
      like(searchIndex.text, wildcard),
      like(searchIndex.tags, wildcard),
      like(searchIndex.tokens, wildcard)
    )
  );

  if (args.entityTypes && args.entityTypes.length > 0) {
    where.push(sql`${searchIndex.entityType} in (${sql.join(args.entityTypes)})`);
  }

  if (afterCreatedAt && afterId) {
    where.push(
      or(
        sql`${searchIndex.createdAt} < ${afterCreatedAt}`,
        and(eq(searchIndex.createdAt, afterCreatedAt), sql`${searchIndex.id} < ${afterId}`)
      )
    );
  }

  const rows = await db
    .select()
    .from(searchIndex)
    .where(where.length ? (and as any)(...where) : undefined)
    .orderBy(desc(searchIndex.createdAt), desc(searchIndex.id))
    .limit(first + 1)
    .all();

  const edges: any[] = [];
  for (const row of rows.slice(0, first)) {
    // Map to FeedEvent-like node
    let entity: any = null;
    let actor: any = null;
    if (row.entityType === 'POST') {
      entity = await db.select().from(posts).where(eq(posts.id, row.entityId)).get();
      if (entity) actor = await db.select().from(users).where(eq(users.id, entity.userId)).get();
    } else if (row.entityType === 'TRIP') {
      entity = await db.select().from(trips).where(eq(trips.id, row.entityId)).get();
      if (entity) actor = await db.select().from(users).where(eq(users.id, entity.userId)).get();
    } else if (row.entityType === 'TOUR') {
      // Legacy TOUR type - now handled as TRIP with isHosted = true
      entity = await db.select().from(trips).where(eq(trips.id, row.entityId)).get();
    } else if (row.entityType === 'PLACE') {
      entity = await db.select().from(places).where(eq(places.id, row.entityId)).get();
    } else if (row.entityType === 'LOCATION') {
      entity = await db.select().from(locations).where(eq(locations.id, row.entityId)).get();
    }
    if (!entity) continue;
    const topics: string[] = row.tags ? JSON.parse(row.tags) : [];
    edges.push({
      cursor: toCursor(row.createdAt || '', row.id),
      node: {
        id: `search-${row.entityType}-${row.entityId}`,
        entityType: row.entityType,
        entityId: row.entityId,
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
          : {
              id: '',
              name: '',
              username: '',
              createdAt: row.createdAt,
            },
        entity: {
          __typename:
            row.entityType === 'POST'
              ? 'Post'
              : row.entityType === 'TRIP' || row.entityType === 'TOUR'
              ? 'Trip'
              : row.entityType === 'PLACE'
              ? 'Place'
              : 'Location',
          ...entity,
        },
        topics,
        visibility: 'PUBLIC',
        createdAt: row.createdAt,
      },
    });
  }

  const hasNextPage = rows.length > first;
  const endCursor = edges.length > 0 ? edges[edges.length - 1].cursor : null;
  return { edges, pageInfo: { endCursor, hasNextPage } };
};

export const searchSuggest = async (
  _: unknown,
  { prefix, limit = 10 }: { prefix: string; limit?: number },
  context: GraphQLContext
) => {
  const db = getServerDB(context.env.DB);
  const p = prefix.trim();
  if (!p) return [];
  const likePrefix = `${p}%`;
  // Simple lexical suggest from titles and tags
  const titles = await db
    .select({ v: searchIndex.title })
    .from(searchIndex)
    .where(and(like(searchIndex.title, likePrefix)))
    .limit(limit)
    .all();
  const tags = await db
    .select({ v: searchIndex.tags })
    .from(searchIndex)
    .where(and(like(searchIndex.tags, `%${p}%`)))
    .limit(limit)
    .all();
  const suggestions = new Set<string>();
  for (const t of titles) if (t.v) suggestions.add(t.v);
  for (const tg of tags) {
    if (!tg.v) continue;
    try {
      const arr = JSON.parse(tg.v as any) as string[];
      for (const s of arr) {
        if (s.toLowerCase().startsWith(p.toLowerCase())) suggestions.add(s);
      }
    } catch {
      // ignore
    }
  }
  return Array.from(suggestions).slice(0, limit);
};


