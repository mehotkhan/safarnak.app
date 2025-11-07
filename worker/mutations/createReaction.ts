import { eq, and } from 'drizzle-orm';
import { getServerDB, reactions, posts, comments, users } from '@database/server';
import type { GraphQLContext } from '../types';

export const createReaction = async (
  _: any,
  { postId, commentId, emoji }: { postId?: string; commentId?: string; emoji: string },
  context: GraphQLContext
) => {
  const db = getServerDB(context.env.DB);

  const userId = context.userId;
  if (!userId) {
    throw new Error('Not authenticated');
  }

  if (!emoji || emoji.trim().length === 0) {
    throw new Error('Emoji is required');
  }

  if (!postId && !commentId) {
    throw new Error('Either postId or commentId is required');
  }

  if (postId && commentId) {
    throw new Error('Cannot react to both post and comment');
  }

  // Verify post or comment exists
  if (postId) {
    const post = await db.select().from(posts).where(eq(posts.id, postId)).get();
    if (!post) {
      throw new Error('Post not found');
    }
  }

  if (commentId) {
    const comment = await db.select().from(comments).where(eq(comments.id, commentId)).get();
    if (!comment) {
      throw new Error('Comment not found');
    }
  }

  // Check if user already reacted with this emoji
  const existing = await db
    .select()
    .from(reactions)
    .where(
      and(
        eq(reactions.userId, userId),
        postId ? eq(reactions.postId, postId) : eq(reactions.commentId, commentId!),
        eq(reactions.emoji, emoji)
      )
    )
    .get();

  if (existing) {
    // Return existing reaction
    const user = await db.select().from(users).where(eq(users.id, userId)).get();
    return {
      id: existing.id,
      postId: existing.postId || null,
      commentId: existing.commentId || null,
      userId: existing.userId,
      user: user
        ? {
            id: user.id,
            name: user.name,
            username: user.username,
            createdAt: user.createdAt,
          }
        : null,
      emoji: existing.emoji,
      createdAt: existing.createdAt,
    };
  }

  // Insert reaction
  const result = await db
    .insert(reactions)
    .values({
      id: crypto.randomUUID(),
      postId: postId || null,
      commentId: commentId || null,
      userId,
      emoji: emoji.trim(),
      createdAt: new Date().toISOString(),
    })
    .returning()
    .get();

  // Fetch user for the reaction
  const user = await db.select().from(users).where(eq(users.id, userId)).get();

  return {
    id: result.id,
    postId: result.postId || null,
    commentId: result.commentId || null,
    userId: result.userId,
    user: user
      ? {
          id: user.id,
          name: user.name,
          username: user.username,
          createdAt: user.createdAt,
        }
      : null,
    emoji: result.emoji,
    createdAt: result.createdAt,
  };
};

