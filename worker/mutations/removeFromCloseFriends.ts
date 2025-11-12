import { getServerDB, closeFriends } from '@database/server';
import type { GraphQLContext } from '../types';
import { and, eq } from 'drizzle-orm';

export const removeFromCloseFriends = async (_: unknown, { friendId }: { friendId: string }, context: GraphQLContext) => {
  const db = getServerDB(context.env.DB);
  const userId = context.userId;
  if (!userId) throw new Error('Not authenticated');
  await db.delete(closeFriends).where(and(eq(closeFriends.userId, userId), eq(closeFriends.friendId, friendId))).run();
  return true;
};


