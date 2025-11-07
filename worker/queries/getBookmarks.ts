import { eq } from 'drizzle-orm';
import { getServerDB, bookmarks, posts, tours, places, users } from '@database/server';
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
        if (type === 'tours') return bm.tourId !== null;
        if (type === 'places') return bm.placeId !== null;
        return true;
      })
    : userBookmarks;

  // Fetch related entities
  const bookmarksWithEntities = await Promise.all(
    filteredBookmarks.map(async (bookmark) => {
      let post = null;
      let tour = null;
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
          
          post = {
            ...postData,
            user: postUser ? {
              id: postUser.id,
              name: postUser.name,
              username: postUser.username,
              avatar: postUser.avatar,
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

      if (bookmark.tourId) {
        const tourData = await db
          .select()
          .from(tours)
          .where(eq(tours.id, bookmark.tourId))
          .get();
        
        if (tourData) {
          tour = {
            ...tourData,
            price: tourData.price ? tourData.price / 100 : 0,
            rating: tourData.rating ? tourData.rating / 10 : 0,
            highlights: tourData.highlights ? JSON.parse(tourData.highlights || '[]') : [],
            inclusions: tourData.inclusions ? JSON.parse(tourData.inclusions || '[]') : [],
            gallery: tourData.gallery ? JSON.parse(tourData.gallery || '[]') : [],
            tags: tourData.tags ? JSON.parse(tourData.tags || '[]') : [],
            coordinates: tourData.coordinates ? JSON.parse(tourData.coordinates || '{}') : null,
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
        tourId: bookmark.tourId,
        placeId: bookmark.placeId,
        post,
        tour,
        place,
        createdAt: bookmark.createdAt,
      };
    })
  );

  return bookmarksWithEntities;
};

