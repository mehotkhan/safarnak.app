import { getServerDB, followEdges } from '@database/server';
import type { GraphQLContext } from '../types';
import { and, eq } from 'drizzle-orm';

export const unfollowUser = async (_: unknown, { followeeId }: { followeeId: string }, context: GraphQLContext) => {
  const db = getServerDB(context.env.DB);
  const followerId = context.userId;
  if (!followerId) throw new Error('Not authenticated');
  await db
    .delete(followEdges)
    .where(and(eq(followEdges.followerId, followerId), eq(followEdges.followeeId, followeeId)))
    .run();
  return true;
};


