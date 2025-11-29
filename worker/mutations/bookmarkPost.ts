import { eq, and } from 'drizzle-orm';
import { getServerDB, bookmarks, posts } from '@database/server';
import type { GraphQLContext } from '../types';

export const bookmarkPost = async (
  _: any,
  { postId }: { postId: string },
  context: GraphQLContext
) => {
  const db = getServerDB(context.env.DB);

  const userId = context.userId;
  if (!userId) {
    throw new Error('Not authenticated');
  }

  // Verify post exists
  const post = await db.select().from(posts).where(eq(posts.id, postId)).get();
  if (!post) {
    throw new Error('Post not found');
  }

  // Check if already bookmarked
  const existing = await db
    .select()
    .from(bookmarks)
    .where(
      and(
        eq(bookmarks.userId, userId),
        eq(bookmarks.postId, postId)
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
    postId,
    tripId: null, // Changed from tourId to tripId
    placeId: null,
    createdAt: new Date().toISOString(),
  });

  return true;
};

