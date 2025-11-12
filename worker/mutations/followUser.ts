import { getServerDB, followEdges } from '@database/server';
import type { GraphQLContext } from '../types';
import { and, eq, sql } from 'drizzle-orm';

export const followUser = async (_: unknown, { followeeId }: { followeeId: string }, context: GraphQLContext) => {
  const db = getServerDB(context.env.DB);
  const followerId = context.userId;
  if (!followerId) throw new Error('Not authenticated');
  if (followerId === followeeId) return true;
  const exists = await db
    .select()
    .from(followEdges)
    .where(and(eq(followEdges.followerId, followerId), eq(followEdges.followeeId, followeeId)))
    .get();
  if (exists) return true;
  await db.insert(followEdges).values({ followerId, followeeId }).run();
  return true;
};


