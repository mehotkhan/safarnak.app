import { eq, and, desc, gte, lte, sql } from 'drizzle-orm';
import { getServerDB, posts, users, comments, reactions, trips, tours, places, bookmarks } from '@database/server';
import type { GraphQLContext } from '../types';

export const getPosts = async (
  _: any,
  { 
    type, 
    limit = 20, 
    offset = 0, 
    after, 
    before 
  }: { 
    type?: string; 
    limit?: number; 
    offset?: number; 
    after?: string; 
    before?: string;
  },
  context: GraphQLContext
) => {
  const db = getServerDB(context.env.DB);

  // Build where conditions
  const conditions = [];
  if (type) {
    conditions.push(eq(posts.type, type));
  }
  if (after) {
    conditions.push(gte(posts.createdAt, after));
  }
  if (before) {
    conditions.push(lte(posts.createdAt, before));
  }

  // Build base query
  let query = db
    .select()
    .from(posts)
    .orderBy(desc(posts.createdAt));

  // Apply all conditions
  if (conditions.length > 0) {
    query = query.where(and(...conditions)) as any;
  }

  // Get total count before pagination
  const allPosts = await query.all();
  const totalCount = allPosts.length;

  // Apply pagination
  const paginatedPosts = allPosts.slice(offset, offset + limit);

  // Fetch related data for each post
  const postsWithData = await Promise.all(
    paginatedPosts.map(async (post) => {
      // Get user
      const user = await db
        .select()
        .from(users)
        .where(eq(users.id, post.userId))
        .get();

      // Get comments (limit to 4 latest)
      const postComments = await db
        .select()
        .from(comments)
        .where(eq(comments.postId, post.id))
        .orderBy(desc(comments.createdAt))
        .limit(4)
        .all();

      const commentsWithUsers = await Promise.all(
        postComments.map(async (comment) => {
          const commentUser = await db
            .select()
            .from(users)
            .where(eq(users.id, comment.userId))
            .get();
          return {
            ...comment,
            user: commentUser ? {
              id: commentUser.id,
              name: commentUser.name,
              username: commentUser.username,
              avatar: commentUser.avatar,
            } : null,
          };
        })
      );

      // Get reactions
      const postReactions = await db
        .select()
        .from(reactions)
        .where(eq(reactions.postId, post.id))
        .all();

      const reactionsWithUsers = await Promise.all(
        postReactions.map(async (reaction) => {
          const reactionUser = await db
            .select()
            .from(users)
            .where(eq(users.id, reaction.userId))
            .get();
          return {
            ...reaction,
            user: reactionUser ? {
              id: reactionUser.id,
              name: reactionUser.name,
              username: reactionUser.username,
            } : null,
          };
        })
      );

      // Check if post is bookmarked by current user
      let isBookmarked = false;
      if (context.userId) {
        const bookmark = await db
          .select()
          .from(bookmarks)
          .where(
            and(
              eq(bookmarks.userId, context.userId),
              eq(bookmarks.postId, post.id)
            )
          )
          .get();
        isBookmarked = !!bookmark;
      }

      // Get related entity based on type
      let relatedEntity = null;
      if (post.type && post.relatedId) {
        if (post.type === 'trip') {
          const trip = await db
            .select()
            .from(trips)
            .where(eq(trips.id, post.relatedId))
            .get();
          if (trip) {
            relatedEntity = {
              ...trip,
              __typename: 'Trip',
              itinerary: trip.itinerary ? JSON.parse(trip.itinerary || '[]') : null,
              coordinates: trip.coordinates ? JSON.parse(trip.coordinates || '{}') : null,
              waypoints: trip.waypoints ? JSON.parse(trip.waypoints || '[]') : null,
            };
          }
        } else if (post.type === 'tour') {
          const tour = await db
            .select()
            .from(tours)
            .where(eq(tours.id, post.relatedId))
            .get();
          if (tour) {
            relatedEntity = {
              ...tour,
              __typename: 'Tour',
              price: tour.price ? tour.price / 100 : 0,
              rating: tour.rating ? tour.rating / 10 : 0,
              highlights: tour.highlights ? JSON.parse(tour.highlights || '[]') : [],
              inclusions: tour.inclusions ? JSON.parse(tour.inclusions || '[]') : [],
              gallery: tour.gallery ? JSON.parse(tour.gallery || '[]') : [],
              tags: tour.tags ? JSON.parse(tour.tags || '[]') : [],
              coordinates: tour.coordinates ? JSON.parse(tour.coordinates || '{}') : null,
            };
          }
        } else if (post.type === 'place') {
          const place = await db
            .select()
            .from(places)
            .where(eq(places.id, post.relatedId))
            .get();
          if (place) {
            relatedEntity = {
              ...place,
              __typename: 'Place',
              rating: place.rating ? place.rating / 10 : 0,
              tips: place.tips ? JSON.parse(place.tips || '[]') : [],
              coordinates: place.coordinates ? JSON.parse(place.coordinates || '{}') : null,
            };
          }
        }
      }

      return {
        ...post,
        user: user ? {
          id: user.id,
          name: user.name,
          username: user.username,
          avatar: user.avatar,
          createdAt: user.createdAt,
        } : null,
        attachments: post.attachments ? JSON.parse(post.attachments || '[]') : [],
        comments: commentsWithUsers,
        commentsCount: commentsWithUsers.length,
        reactions: reactionsWithUsers,
        reactionsCount: reactionsWithUsers.length,
        isBookmarked,
        relatedEntity,
      };
    })
  );

  // Calculate pagination info
  const hasNextPage = offset + limit < totalCount;
  const hasPreviousPage = offset > 0;
  const nextOffset = hasNextPage ? offset + limit : null;
  const previousOffset = hasPreviousPage ? Math.max(0, offset - limit) : null;

  return {
    posts: postsWithData,
    totalCount,
    hasNextPage,
    hasPreviousPage,
    nextOffset,
    previousOffset,
  };
};

