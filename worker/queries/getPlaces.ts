import { eq, desc } from 'drizzle-orm';
import { getServerDB, places } from '@database/server';
import type { GraphQLContext } from '../types';

export const getPlaces = async (
  _: any,
  { category, limit }: { category?: string; limit?: number },
  context: GraphQLContext
) => {
  const db = getServerDB(context.env.DB);

  // Build query
  let query = db
    .select()
    .from(places)
    .orderBy(desc(places.createdAt));

  if (category) {
    query = query.where(eq(places.type, category)) as any;
  }

  const results = await query.limit(limit || 100).all();

  // Parse JSON fields and convert rating from integer to float
  return results.map(place => ({
    ...place,
    rating: place.rating ? place.rating / 10 : 0, // Convert integer rating to float
    tips: place.tips ? JSON.parse(place.tips || '[]') : [],
    coordinates: place.coordinates ? JSON.parse(place.coordinates || '{}') : null,
  }));
};

export const getPlace = async (
  _: any,
  { id }: { id: string },
  context: GraphQLContext
) => {
  const db = getServerDB(context.env.DB);

  const result = await db
    .select()
    .from(places)
    .where(eq(places.id, id))
    .get();

  if (!result) {
    throw new Error('Place not found');
  }

  // Parse JSON fields and convert rating from integer to float
  return {
    ...result,
    rating: result.rating ? result.rating / 10 : 0, // Convert integer rating to float
    tips: result.tips ? JSON.parse(result.tips || '[]') : [],
    coordinates: result.coordinates ? JSON.parse(result.coordinates || '{}') : null,
  };
};

