import { eq } from 'drizzle-orm';
import { getServerDB, posts, trips, tours, places, users } from '@database/server';
import type { GraphQLContext } from '../types';

interface CreatePostInput {
  content?: string;
  attachments?: string[];
  type?: string;
  relatedId?: string;
}

export const createPost = async (
  _: any,
  { input }: { input: CreatePostInput },
  context: GraphQLContext
) => {
  const db = getServerDB(context.env.DB);

  const userId = context.userId;
  if (!userId) {
    throw new Error('Not authenticated');
  }

  // Validate: if type is provided, relatedId must also be provided (and vice versa)
  if ((input.type && !input.relatedId) || (!input.type && input.relatedId)) {
    throw new Error('Type and relatedId must both be provided together, or both omitted for a normal post');
  }

  // Validate that the related entity exists (if type and relatedId are provided)
  let relatedEntity = null;
  if (input.type && input.relatedId) {
    if (input.type === 'trip') {
      relatedEntity = await db
        .select()
        .from(trips)
        .where(eq(trips.id, input.relatedId))
        .get();
      if (!relatedEntity) {
        throw new Error('Trip not found');
      }
      // Verify ownership for trips
      if (relatedEntity.userId !== userId) {
        throw new Error('Unauthorized: You can only share your own trips');
      }
    } else if (input.type === 'tour') {
      relatedEntity = await db
        .select()
        .from(tours)
        .where(eq(tours.id, input.relatedId))
        .get();
      if (!relatedEntity) {
        throw new Error('Tour not found');
      }
    } else if (input.type === 'place') {
      relatedEntity = await db
        .select()
        .from(places)
        .where(eq(places.id, input.relatedId))
        .get();
      if (!relatedEntity) {
        throw new Error('Place not found');
      }
      // Verify ownership for places (if ownerId is set)
      if (relatedEntity.ownerId && relatedEntity.ownerId !== userId) {
        throw new Error('Unauthorized: You can only share your own places');
      }
    } else {
      throw new Error('Invalid type. Must be trip, tour, or place');
    }
  }

  try {
    // Get user first
    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .get();

    if (!user) {
      throw new Error('User not found');
    }

    // Insert post
    const result = await db
      .insert(posts)
      .values({
        userId,
        content: input.content || null,
        attachments: input.attachments ? JSON.stringify(input.attachments) : null,
        type: input.type || null,
        relatedId: input.relatedId || null,
      })
      .returning()
      .get();

    // Return post with user and parsed attachments
    return {
      ...result,
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        avatar: user.avatar,
        createdAt: user.createdAt,
      },
      attachments: result.attachments ? JSON.parse(result.attachments || '[]') : [],
      comments: [],
      commentsCount: 0,
      reactions: [],
      reactionsCount: 0,
    };
  } catch (error: any) {
    console.error('createPost failed', {
      userId,
      type: input.type,
      relatedId: input.relatedId,
      error: error?.stack || String(error),
    });
    throw new Error('Failed to create post');
  }
};

