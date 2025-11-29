import { and, desc, eq, or, sql } from 'drizzle-orm';
import { getServerDB, feedEvents, users, profiles, posts, trips, places, locations, followEdges, closeFriends, comments as commentsTable, reactions as reactionsTable } from '@database/server';
import type { GraphQLContext } from '../types';

type EntityType = 'POST' | 'TRIP' | 'PLACE' | 'LOCATION'; // TOUR removed - use TRIP with isHosted

interface FeedFilter {
  entityTypes?: EntityType[];
  topics?: string[];
  followingOnly?: boolean;
  circleOnly?: boolean;
  mutedUserIds?: string[];
  visibility?: Array<'PUBLIC' | 'FOLLOWERS' | 'CIRCLE'>;
  createdAtAfter?: string;
  createdAtBefore?: string;
}

function normalizeSqlTimestamp(input?: string): string | undefined {
  if (!input) return undefined;
  try {
    // Convert ISO like 'YYYY-MM-DDTHH:mm:SS.sssZ' to 'YYYY-MM-DD HH:mm:SS'
    // Works even if fractional seconds not present
    const iso = String(input);
    const cleaned = iso.replace('T', ' ').replace('Z', '');
    return cleaned.slice(0, 19);
  } catch {
    return input;
  }
}

function parseCursor(after?: string): { createdAt?: string; id?: string } {
  if (!after) return {};
  try {
    const decoded = typeof atob === 'function' ? atob(after) : after;
    const [createdAt, id] = decoded.split('|');
    if (createdAt && id) return { createdAt, id };
  } catch {
    // ignore invalid cursor
  }
  return {};
}

function toCursor(createdAt: string, id: string): string {
  const s = `${createdAt}|${id}`;
  return typeof btoa === 'function' ? btoa(s) : s;
}

export const getFeed = async (
  _parent: unknown,
  args: { first?: number; after?: string; filter?: FeedFilter },
  context: GraphQLContext
) => {
  const db = getServerDB(context.env.DB);
  const first = Math.min(Math.max(args.first ?? 20, 1), 50);
  const { createdAt: afterCreatedAt, id: afterId } = parseCursor(args.after);
  const filter = args.filter || {};

  // Base where: public visibility only for Phase 1
  const whereClauses: any[] = [];
  if (filter.visibility && filter.visibility.length > 0) {
    whereClauses.push(sql`${feedEvents.visibility} in (${sql.join(filter.visibility)})`);
  } else {
    whereClauses.push(eq(feedEvents.visibility, 'PUBLIC'));
  }

  if (filter.entityTypes && filter.entityTypes.length > 0) {
    whereClauses.push(sql`${feedEvents.entityType} in (${sql.join(filter.entityTypes)})`);
  }

  if (filter.mutedUserIds && filter.mutedUserIds.length > 0) {
    // exclude muted actorIds
    whereClauses.push(sql`${feedEvents.actorId} not in (${sql.join(filter.mutedUserIds)})`);
  }

  // time window
  const createdAtAfter = normalizeSqlTimestamp(filter.createdAtAfter);
  const createdAtBefore = normalizeSqlTimestamp(filter.createdAtBefore);
  if (createdAtAfter) {
    whereClauses.push(sql`${feedEvents.createdAt} >= ${createdAtAfter}`);
  }
  if (createdAtBefore) {
    whereClauses.push(sql`${feedEvents.createdAt} <= ${createdAtBefore}`);
  }

  // followingOnly: actorId must be in viewer's followees
  if (filter.followingOnly && context.userId) {
    const sub = sql`select ${followEdges.followeeId} from ${followEdges} where ${followEdges.followerId} = ${context.userId}`;
    whereClauses.push(sql`${feedEvents.actorId} in (${sub})`);
  }
  // circleOnly: actorId must be in viewer's close friends
  if (filter.circleOnly && context.userId) {
    const sub = sql`select ${closeFriends.friendId} from ${closeFriends} where ${closeFriends.userId} = ${context.userId}`;
    whereClauses.push(sql`${feedEvents.actorId} in (${sub})`);
  }

  if (afterCreatedAt && afterId) {
    // createdAt/id pagination (strictly older than cursor)
    whereClauses.push(
      or(
        sql`${feedEvents.createdAt} < ${afterCreatedAt}`,
        and(eq(feedEvents.createdAt, afterCreatedAt), sql`${feedEvents.id} < ${afterId}`)
      )
    );
  }

  const rows = await db
    .select()
    .from(feedEvents)
    .where(whereClauses.length ? (and as any)(...whereClauses) : undefined)
    .orderBy(desc(feedEvents.createdAt), desc(feedEvents.id))
    .limit(first + 1)
    .all();

  const edges: any[] = [];
  for (const row of rows.slice(0, first)) {
    // actor
    const actor = await db.select().from(users).where(eq(users.id, row.actorId)).get();
    const actorProfile = actor ? await db.select().from(profiles).where(eq(profiles.userId, actor.id)).get() : null;
    // entity
    let entity: any = null;
    if (row.entityType === 'POST') {
      const post = await db.select().from(posts).where(eq(posts.id, row.entityId)).get();
      if (post) {
        // Load comments (with users), reactions (with users)
        const postComments = await db
          .select()
          .from(commentsTable)
          .where(eq(commentsTable.postId, post.id))
          .all();
        const commentsWithUsers = await Promise.all(
          postComments.map(async (c) => {
            const cu = await db.select().from(users).where(eq(users.id, c.userId)).get();
            const cuProfile = cu ? await db.select().from(profiles).where(eq(profiles.userId, cu.id)).get() : null;
            return {
              ...c,
              user: cu
                ? { id: cu.id, name: cuProfile?.displayName || cu.username, username: cu.username, avatar: cuProfile?.avatarUrl || null }
                : null,
            };
          })
        );
        const postReactions = await db
          .select()
          .from(reactionsTable)
          .where(eq(reactionsTable.postId, post.id))
          .all();
        const reactionsWithUsers = await Promise.all(
          postReactions.map(async (r) => {
            const ru = await db.select().from(users).where(eq(users.id, r.userId)).get();
            const ruProfile = ru ? await db.select().from(profiles).where(eq(profiles.userId, ru.id)).get() : null;
            return {
              ...r,
              user: ru ? { id: ru.id, name: ruProfile?.displayName || ru.username, username: ru.username } : null,
            };
          })
        );
        entity = {
          ...post,
          attachments: post.attachments ? JSON.parse(post.attachments || '[]') : [],
          comments: commentsWithUsers,
          commentsCount: commentsWithUsers.length,
          reactions: reactionsWithUsers,
          reactionsCount: reactionsWithUsers.length,
        };
      }
    } else if (row.entityType === 'TRIP') {
      entity = await db.select().from(trips).where(eq(trips.id, row.entityId)).get();
    } else if (row.entityType === 'TOUR') {
      // Tour removed - use Trip with isHosted instead
      entity = await db.select().from(trips).where(eq(trips.id, row.entityId)).get();
    } else if (row.entityType === 'PLACE') {
      entity = await db.select().from(places).where(eq(places.id, row.entityId)).get();
    } else if (row.entityType === 'LOCATION') {
      entity = await db.select().from(locations).where(eq(locations.id, row.entityId)).get();
    }

    if (!actor || !entity) continue;

    const topics: string[] = row.topics ? JSON.parse(row.topics) : [];
    // Compute simple boosts
    let boost = 0;
    if (context.userId) {
      // following boost
      const f = await db
        .select()
        .from(followEdges)
        .where(and(eq(followEdges.followerId, context.userId), eq(followEdges.followeeId, row.actorId)))
        .get();
      if (f) boost += 1;
      const cf = await db
        .select()
        .from(closeFriends)
        .where(and(eq(closeFriends.userId, context.userId), eq(closeFriends.friendId, row.actorId)))
        .get();
      if (cf) boost += 2;
    }
    // topic match boost vs filter.topics
    if (filter.topics && filter.topics.length > 0 && topics.length > 0) {
      const set = new Set(filter.topics.map((t) => t.toLowerCase()));
      const matches = topics.filter((t) => set.has(String(t).toLowerCase())).length;
      boost += 0.5 * matches;
    }
    edges.push({
      cursor: toCursor(row.createdAt || '', row.id),
      node: {
        id: row.id,
        entityType: row.entityType,
        entityId: row.entityId,
        verb: row.verb,
        actor: {
          id: actor.id,
          name: actorProfile?.displayName || actor.username,
          username: actor.username,
          email: actor.email,
          phone: actorProfile?.phone || null,
          avatar: actorProfile?.avatarUrl || null,
          createdAt: actor.createdAt,
        },
        entity: {
          __typename: row.entityType === 'POST' ? 'Post' :
                      row.entityType === 'TRIP' || row.entityType === 'TOUR' ? 'Trip' : // TOUR -> Trip
                      row.entityType === 'PLACE' ? 'Place' : 'Location',
          ...entity,
        },
        topics,
        visibility: row.visibility || 'PUBLIC',
        createdAt: row.createdAt,
        _score: boost, // internal only, not exposed in schema
      },
    });
  }

  // Sort by createdAt desc then by boost desc
  edges.sort((a, b) => {
    const ca = a.node.createdAt || '';
    const cb = b.node.createdAt || '';
    if (ca > cb) return -1;
    if (ca < cb) return 1;
    const sa = a.node._score || 0;
    const sb = b.node._score || 0;
    return sb - sa;
  });

  const hasNextPage = rows.length > first;
  const endCursor =
    edges.length > 0 ? edges[edges.length - 1].cursor : undefined;

  return {
    edges,
    pageInfo: {
      endCursor,
      hasNextPage,
    },
  };
};


