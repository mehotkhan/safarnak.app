import { eq, sql } from 'drizzle-orm';
import { getServerDB, posts, trips, tours, places, users, feedEvents, searchIndex } from '@database/server';
import type { GraphQLContext } from '../types';
import { incrementTrendingEntity, incrementTrendingTopic } from '../utilities/trending';
import { enqueueEmbeddingJob } from '../utilities/semantic/embeddings';

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

    // Extract simple topics (hashtags) from content
    const content = input.content || '';
    const hashtagMatches = content.match(/#([A-Za-z0-9_\u0600-\u06FF]+)/g) || [];
    const extractedTopics = Array.from(new Set(hashtagMatches.map((t) => t.replace('#', '').toLowerCase()))).slice(0, 20);

    // Upsert search index (lexical MVP)
    // Upsert search index (lexical MVP)
    try {
      const title = (input.type ? `${input.type} shared` : 'Post').trim();
      const tokens = [input.content || '', ...(input.attachments || []), ...extractedTopics].join(' ').toLowerCase();
      const existing = await db
        .select()
        .from(searchIndex)
        .where(sql`${searchIndex.entityType} = 'POST' AND ${searchIndex.entityId} = ${result.id}`)
        .get();
      if (existing) {
        await db
          .update(searchIndex)
          .set({
            title,
            text: input.content || null,
            tags: JSON.stringify(extractedTopics),
            tokens,
            updatedAt: new Date().toISOString(),
          })
          .where(sql`${searchIndex.id} = ${existing.id}`)
          .run();
      } else {
        await db
          .insert(searchIndex)
          .values({
            entityType: 'POST',
            entityId: result.id,
            title,
            text: input.content || null,
            tags: JSON.stringify(extractedTopics),
            tokens,
          })
          .run();
      }
    } catch (e) {
      console.error('searchIndex upsert failed for POST', e);
    }

    // Insert corresponding feed event (PUBLIC by default in Phase 1)
    try {
      await db
        .insert(feedEvents)
        .values({
          entityType: 'POST',
          entityId: result.id,
          actorId: userId,
          verb: 'CREATED',
          topics: JSON.stringify(extractedTopics),
          visibility: 'PUBLIC',
        })
        .run();
      // Trending increments
      try {
        await incrementTrendingEntity(context.env, 'POST');
        for (const topic of extractedTopics) {
          await incrementTrendingTopic(context.env, topic);
        }
      } catch (_) {
        // ignore KV errors for now
      }
      // Publish subscription
      context.publish('FEED_NEW_EVENTS', {
        feedNewEvents: [
          {
            id: result.id,
            entityType: 'POST',
            entityId: result.id,
            verb: 'CREATED',
            actor: {
              id: user.id,
              name: user.name,
              username: user.username,
              email: user.email,
              phone: user.phone,
              avatar: user.avatar,
              createdAt: user.createdAt,
            },
            entity: {
              __typename: 'Post',
              ...result,
              attachments: result.attachments ? JSON.parse(result.attachments || '[]') : [],
            },
            topics: extractedTopics,
            visibility: 'PUBLIC',
            createdAt: result.createdAt,
          },
        ],
      });
    } catch (publishErr) {
      console.error('Failed to publish feed event for createPost', publishErr);
    }

    // Enqueue embedding job
    try {
      const text = [input.content || '', extractedTopics.join(' ')].join(' ').trim();
      if (text) {
        await enqueueEmbeddingJob(context.env, {
          entityType: 'POST',
          entityId: result.id,
          text,
          lang: 'auto',
          model: '@cf/baai/bge-m3',
        });
      }
    } catch (e) {
      console.warn('enqueueEmbeddingJob failed for POST', e);
    }

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

