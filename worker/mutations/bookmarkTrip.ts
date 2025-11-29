import { eq, and } from 'drizzle-orm';
import { getServerDB, bookmarks, trips } from '@database/server';
import type { GraphQLContext } from '../types';

export const bookmarkTrip = async (
  _: any,
  { tripId }: { tripId: string },
  context: GraphQLContext
) => {
  const db = getServerDB(context.env.DB);

  const userId = context.userId;
  if (!userId) {
    throw new Error('Not authenticated');
  }

  // Verify trip exists
  const trip = await db.select().from(trips).where(eq(trips.id, tripId)).get();
  if (!trip) {
    throw new Error('Trip not found');
  }

  // Check if already bookmarked
  const existing = await db
    .select()
    .from(bookmarks)
    .where(
      and(
        eq(bookmarks.userId, userId),
        eq(bookmarks.tripId, tripId)
      )
    )
    .get();

  if (existing) {
    // Remove bookmark
    await db.delete(bookmarks).where(eq(bookmarks.id, existing.id));
    return false;
  }

  // Add bookmark
  await db.insert(bookmarks).values({
    id: crypto.randomUUID(),
    userId,
    postId: null,
    tripId,
    placeId: null,
    createdAt: new Date().toISOString(),
  });

  return true;
};

