import { getServerDB, followEdges, users } from '@database/server';
import type { GraphQLContext } from '../types';
import { eq, sql } from 'drizzle-orm';

export const getFollowers = async (_: unknown, { userId, first = 20 }: { userId: string; first?: number }, context: GraphQLContext) => {
  const db = getServerDB(context.env.DB);
  const edges = await db.select().from(followEdges).where(eq(followEdges.followeeId, userId)).limit(first).all();
  const followerIds = edges.map((e) => e.followerId);
  if (followerIds.length === 0) return [];
  const rows = await db.select().from(users).where(sql`${users.id} in (${sql.join(followerIds)})`).all();
  return rows;
};


