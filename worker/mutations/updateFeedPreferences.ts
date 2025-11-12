import { getServerDB, feedPreferences } from '@database/server';
import type { GraphQLContext } from '../types';
import { eq } from 'drizzle-orm';

interface FeedFilterInput {
  entityTypes?: string[];
  topics?: string[];
  followingOnly?: boolean;
  circleOnly?: boolean;
  mutedUserIds?: string[];
}

export const updateFeedPreferences = async (
  _parent: unknown,
  { input }: { input: FeedFilterInput },
  context: GraphQLContext
) => {
  const db = getServerDB(context.env.DB);
  const userId = context.userId;
  if (!userId) {
    throw new Error('Not authenticated');
  }

  const entityTypes = input.entityTypes ?? ['POST', 'TRIP', 'TOUR', 'PLACE', 'LOCATION'];
  const topics = input.topics ?? [];
  const followingOnly = Boolean(input.followingOnly ?? false);
  const circleOnly = Boolean(input.circleOnly ?? false);
  const mutedUserIds = input.mutedUserIds ?? [];

  // Upsert preferences
  const existing = await db.select().from(feedPreferences).where(eq(feedPreferences.userId, userId)).get();
  if (existing) {
    await db
      .update(feedPreferences)
      .set({
        entityTypes: JSON.stringify(entityTypes),
        topics: JSON.stringify(topics),
        followingOnly,
        circleOnly,
        mutedUserIds: JSON.stringify(mutedUserIds),
        updatedAt: new Date().toISOString(),
      })
      .where(eq(feedPreferences.userId, userId))
      .run();
  } else {
    await db
      .insert(feedPreferences)
      .values({
        userId,
        entityTypes: JSON.stringify(entityTypes),
        topics: JSON.stringify(topics),
        followingOnly,
        circleOnly,
        mutedUserIds: JSON.stringify(mutedUserIds),
        updatedAt: new Date().toISOString(),
      })
      .run();
  }

  return {
    entityTypes,
    topics,
    followingOnly,
    circleOnly,
    mutedUserIds,
  };
};


