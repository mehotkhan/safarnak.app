import { getServerDB, followEdges, users } from '@database/server';
import type { GraphQLContext } from '../types';
import { eq, sql } from 'drizzle-orm';

export const getFollowing = async (_: unknown, { userId, first = 20 }: { userId: string; first?: number }, context: GraphQLContext) => {
  const db = getServerDB(context.env.DB);
  const edges = await db.select().from(followEdges).where(eq(followEdges.followerId, userId)).limit(first).all();
  const followeeIds = edges.map((e) => e.followeeId);
  if (followeeIds.length === 0) return [];
  const rows = await db.select().from(users).where(sql`${users.id} in (${sql.join(followeeIds)})`).all();
  return rows;
};


