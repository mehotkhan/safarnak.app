import { eq } from 'drizzle-orm';
import { getServerDB, bookmarks, posts, trips, places, users, profiles } from '@database/server';
import type { GraphQLContext } from '../types';

export const getBookmarks = async (
  _: any,
  { type }: { type?: string },
  context: GraphQLContext
) => {
  const db = getServerDB(context.env.DB);

  const userId = context.userId;
  if (!userId) {
    throw new Error('Not authenticated');
  }

  // Get all bookmarks for user
  const userBookmarks = await db
    .select()
    .from(bookmarks)
    .where(eq(bookmarks.userId, userId))
    .all();

  // Filter by type if specified
  const filteredBookmarks = type
    ? userBookmarks.filter((bm) => {
        if (type === 'posts') return bm.postId !== null;
        if (type === 'trips' || type === 'tours') return bm.tripId !== null; // tours -> trips
        if (type === 'places') return bm.placeId !== null;
        return true;
      })
    : userBookmarks;

  // Fetch related entities
  const bookmarksWithEntities = await Promise.all(
    filteredBookmarks.map(async (bookmark) => {
      let post = null;
      let trip = null; // Changed from tour to trip
      let place = null;

      if (bookmark.postId) {
        const postData = await db
          .select()
          .from(posts)
          .where(eq(posts.id, bookmark.postId))
          .get();
        
        if (postData) {
          const postUser = await db
            .select()
            .from(users)
            .where(eq(users.id, postData.userId))
            .get();
          const postUserProfile = postUser ? await db
            .select()
            .from(profiles)
            .where(eq(profiles.userId, postUser.id))
            .get() : null;
          
          post = {
            ...postData,
            user: postUser ? {
              id: postUser.id,
              name: postUserProfile?.displayName || postUser.username,
              username: postUser.username,
              avatar: postUserProfile?.avatarUrl || null,
              createdAt: postUser.createdAt,
            } : null,
            attachments: postData.attachments ? JSON.parse(postData.attachments || '[]') : [],
            comments: [],
            commentsCount: 0,
            reactions: [],
            reactionsCount: 0,
          };
        }
      }

      if (bookmark.tripId) {
        const tripData = await db
          .select()
          .from(trips)
          .where(eq(trips.id, bookmark.tripId))
          .get();
        
        if (tripData) {
          trip = {
            ...tripData,
            price: (tripData as any).price ? ((tripData as any).price / 100) : null,
            rating: (tripData as any).rating ? ((tripData as any).rating / 10) : 0,
            highlights: (tripData as any).highlights ? JSON.parse((tripData as any).highlights || '[]') : [],
            inclusions: (tripData as any).inclusions ? JSON.parse((tripData as any).inclusions || '[]') : [],
            gallery: (tripData as any).gallery ? JSON.parse((tripData as any).gallery || '[]') : [],
            tags: (tripData as any).tags ? JSON.parse((tripData as any).tags || '[]') : [],
            coordinates: tripData.coordinates ? JSON.parse(tripData.coordinates || '{}') : null,
            itinerary: tripData.itinerary ? JSON.parse(tripData.itinerary || '[]') : null,
            waypoints: tripData.waypoints ? JSON.parse(tripData.waypoints || '[]') : null,
          };
        }
      }

      if (bookmark.placeId) {
        const placeData = await db
          .select()
          .from(places)
          .where(eq(places.id, bookmark.placeId))
          .get();
        
        if (placeData) {
          place = {
            ...placeData,
            rating: placeData.rating ? placeData.rating / 10 : 0,
            tips: placeData.tips ? JSON.parse(placeData.tips || '[]') : [],
            coordinates: placeData.coordinates ? JSON.parse(placeData.coordinates || '{}') : null,
          };
        }
      }

      return {
        id: bookmark.id,
        userId: bookmark.userId,
        postId: bookmark.postId,
        tripId: bookmark.tripId, // Changed from tourId
        placeId: bookmark.placeId,
        post,
        trip, // Changed from tour
        place,
        createdAt: bookmark.createdAt,
      };
    })
  );

  return bookmarksWithEntities;
};

