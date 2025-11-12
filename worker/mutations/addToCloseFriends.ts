import { getServerDB, closeFriends } from '@database/server';
import type { GraphQLContext } from '../types';
import { and, eq } from 'drizzle-orm';

export const addToCloseFriends = async (_: unknown, { friendId }: { friendId: string }, context: GraphQLContext) => {
  const db = getServerDB(context.env.DB);
  const userId = context.userId;
  if (!userId) throw new Error('Not authenticated');
  if (userId === friendId) return true;
  const exists = await db
    .select()
    .from(closeFriends)
    .where(and(eq(closeFriends.userId, userId), eq(closeFriends.friendId, friendId)))
    .get();
  if (exists) return true;
  await db.insert(closeFriends).values({ userId, friendId }).run();
  return true;
};


