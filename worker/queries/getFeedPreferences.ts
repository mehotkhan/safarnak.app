import { getServerDB, feedPreferences } from '@database/server';
import type { GraphQLContext } from '../types';
import { eq } from 'drizzle-orm';

export const getFeedPreferences = async (
  _parent: unknown,
  _args: unknown,
  context: GraphQLContext
) => {
  const db = getServerDB(context.env.DB);
  const userId = context.userId;
  if (!userId) {
    throw new Error('Not authenticated');
  }

  const row = await db.select().from(feedPreferences).where(eq(feedPreferences.userId, userId)).get();
  const entityTypes = row?.entityTypes ? JSON.parse(row.entityTypes) : ['POST', 'TRIP', 'TOUR', 'PLACE', 'LOCATION'];
  const topics = row?.topics ? JSON.parse(row.topics) : [];
  const mutedUserIds = row?.mutedUserIds ? JSON.parse(row.mutedUserIds) : [];

  return {
    entityTypes,
    topics,
    followingOnly: Boolean(row?.followingOnly ?? false),
    circleOnly: Boolean(row?.circleOnly ?? false),
    mutedUserIds,
  };
};


