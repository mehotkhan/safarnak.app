import { getServerDB, followEdges } from '@database/server';
import type { GraphQLContext } from '../types';
import { and, eq } from 'drizzle-orm';

export const isFollowing = async (_: unknown, { userId }: { userId: string }, context: GraphQLContext) => {
  const db = getServerDB(context.env.DB);
  const viewerId = context.userId;
  if (!viewerId) throw new Error('Not authenticated');
  const row = await db
    .select()
    .from(followEdges)
    .where(and(eq(followEdges.followerId, viewerId), eq(followEdges.followeeId, userId)))
    .get();
  return Boolean(row);
};


