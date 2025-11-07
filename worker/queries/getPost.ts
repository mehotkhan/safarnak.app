import { eq, desc, and } from 'drizzle-orm';
import { getServerDB, posts, users, comments, reactions, trips, tours, places, bookmarks } from '@database/server';
import type { GraphQLContext } from '../types';

export const getPost = async (
  _: any,
  { id }: { id: string },
  context: GraphQLContext
) => {
  const db = getServerDB(context.env.DB);

  // Get post
  const post = await db
    .select()
    .from(posts)
    .where(eq(posts.id, id))
    .get();

  if (!post) {
    throw new Error('Post not found');
  }

  // Get user
  const user = await db
    .select()
    .from(users)
    .where(eq(users.id, post.userId))
    .get();

  if (!user) {
    throw new Error('User not found');
  }

  // Get comments
  const postComments = await db
    .select()
    .from(comments)
    .where(eq(comments.postId, post.id))
    .orderBy(desc(comments.createdAt))
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
    user: {
      id: user.id,
      name: user.name,
      username: user.username,
      avatar: user.avatar,
      createdAt: user.createdAt,
    },
    attachments: post.attachments ? JSON.parse(post.attachments || '[]') : [],
    comments: commentsWithUsers,
    commentsCount: commentsWithUsers.length,
    reactions: reactionsWithUsers,
    reactionsCount: reactionsWithUsers.length,
    isBookmarked,
    relatedEntity,
  };
};

