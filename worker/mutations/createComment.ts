import { eq } from 'drizzle-orm';
import { getServerDB, comments, posts, users } from '@database/server';
import type { GraphQLContext } from '../types';

export const createComment = async (
  _: any,
  { postId, content }: { postId: string; content: string },
  context: GraphQLContext
) => {
  const db = getServerDB(context.env.DB);

  const userId = context.userId;
  if (!userId) {
    throw new Error('Not authenticated');
  }

  if (!content || content.trim().length === 0) {
    throw new Error('Comment content is required');
  }

  // Verify post exists
  const post = await db.select().from(posts).where(eq(posts.id, postId)).get();
  if (!post) {
    throw new Error('Post not found');
  }

  // Insert comment
  const result = await db
    .insert(comments)
    .values({
      id: crypto.randomUUID(),
      postId,
      userId,
      content: content.trim(),
      createdAt: new Date().toISOString(),
    })
    .returning()
    .get();

  // Fetch user for the comment
  const user = await db.select().from(users).where(eq(users.id, userId)).get();

  return {
    id: result.id,
    postId: result.postId,
    userId: result.userId,
    user: user
      ? {
          id: user.id,
          name: user.name,
          username: user.username,
          avatar: user.avatar || null,
          createdAt: user.createdAt,
        }
      : null,
    content: result.content,
    createdAt: result.createdAt,
  };
};

