import { subscribe } from 'graphql-workers-subscriptions';
import { getServerDB, followEdges, closeFriends } from '@database/server';
import { and, eq } from 'drizzle-orm';

export const feedNewEvents = {
  subscribe: subscribe('FEED_NEW_EVENTS'),
  resolve: async (payload: any, args: { filter?: any }, context: any) => {
    // payload shape: { feedNewEvents: [FeedEvent...] }
    const items = Array.isArray(payload?.feedNewEvents) ? payload.feedNewEvents : [];
    const filter = args?.filter || {};

    if (items.length === 0) return [];

    // Fast path for unauthenticated: only PUBLIC visibility and basic filters
    const userId = context.userId as string | undefined;
    if (!userId) {
      return items.filter((ev: any) => {
        if (filter.visibility && filter.visibility.length > 0 && !filter.visibility.includes(ev.visibility)) {
          return false;
        }
        if (filter.entityTypes && filter.entityTypes.length > 0 && !filter.entityTypes.includes(ev.entityType)) {
          return false;
        }
        if (filter.mutedUserIds && filter.mutedUserIds.includes(ev.actor?.id)) {
          return false;
        }
        if (filter.topics && filter.topics.length > 0 && Array.isArray(ev.topics)) {
          const set = new Set(filter.topics.map((t: string) => t.toLowerCase()));
          const match = ev.topics.some((t: string) => set.has(String(t).toLowerCase()));
          if (!match) return false;
        }
        return ev.visibility === 'PUBLIC';
      });
    }

    // Authenticated: enforce followingOnly and circleOnly via DB checks
    const db = getServerDB(context.env.DB);
    const results: any[] = [];
    for (const ev of items) {
      // Basic filters
      if (filter.visibility && filter.visibility.length > 0 && !filter.visibility.includes(ev.visibility)) {
        continue;
      }
      if (filter.entityTypes && filter.entityTypes.length > 0 && !filter.entityTypes.includes(ev.entityType)) {
        continue;
      }
      if (filter.mutedUserIds && filter.mutedUserIds.includes(ev.actor?.id)) {
        continue;
      }
      if (filter.topics && filter.topics.length > 0 && Array.isArray(ev.topics)) {
        const set = new Set(filter.topics.map((t: string) => t.toLowerCase()));
        const match = ev.topics.some((t: string) => set.has(String(t).toLowerCase()));
        if (!match) continue;
      }

      // Visibility rule: for now events are PUBLIC; future: handle FOLLOWERS/CIRCLE
      if (filter.followingOnly) {
        const f = await db
          .select()
          .from(followEdges)
          .where(and(eq(followEdges.followerId, userId), eq(followEdges.followeeId, ev.actor?.id)))
          .get();
        if (!f) continue;
      }
      if (filter.circleOnly) {
        const cf = await db
          .select()
          .from(closeFriends)
          .where(and(eq(closeFriends.userId, userId), eq(closeFriends.friendId, ev.actor?.id)))
          .get();
        if (!cf) continue;
      }
      results.push(ev);
    }
    return results;
  },
};


