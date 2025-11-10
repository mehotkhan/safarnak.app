import { eq, and, desc } from 'drizzle-orm';
import { getServerDB, tours } from '@database/server';
import type { GraphQLContext } from '../types';

export const getTours = async (
  _: any,
  { category, limit }: { category?: string; limit?: number },
  context: GraphQLContext
) => {
  const db = getServerDB(context.env.DB);

  // Build where conditions
  const conditions = [eq(tours.isActive, true)];
  if (category) {
    conditions.push(eq(tours.category, category));
  }

  // Build query
  const query = db
    .select()
    .from(tours)
    .where(and(...conditions))
    .orderBy(desc(tours.createdAt));

  const results = await query.limit(limit || 100).all();

  // Parse JSON fields and convert price/rating from integer to float
  return results.map(tour => ({
    ...tour,
    price: tour.price ? tour.price / 100 : 0, // Convert cents to dollars
    rating: tour.rating ? tour.rating / 10 : 0, // Convert integer rating to float
    highlights: tour.highlights ? JSON.parse(tour.highlights || '[]') : [],
    inclusions: tour.inclusions ? JSON.parse(tour.inclusions || '[]') : [],
    gallery: tour.gallery ? JSON.parse(tour.gallery || '[]') : [],
    tags: tour.tags ? JSON.parse(tour.tags || '[]') : [],
    coordinates: tour.coordinates ? JSON.parse(tour.coordinates || '{}') : null,
  }));
};

export const getTour = async (
  _: any,
  { id }: { id: string },
  context: GraphQLContext
) => {
  const db = getServerDB(context.env.DB);

  const result = await db
    .select()
    .from(tours)
    .where(eq(tours.id, id))
    .get();

  if (!result) {
    throw new Error('Tour not found');
  }

  // Parse JSON fields and convert price/rating from integer to float
  return {
    ...result,
    price: result.price ? result.price / 100 : 0, // Convert cents to dollars
    rating: result.rating ? result.rating / 10 : 0, // Convert integer rating to float
    highlights: result.highlights ? JSON.parse(result.highlights || '[]') : [],
    inclusions: result.inclusions ? JSON.parse(result.inclusions || '[]') : [],
    gallery: result.gallery ? JSON.parse(result.gallery || '[]') : [],
    tags: result.tags ? JSON.parse(result.tags || '[]') : [],
    coordinates: result.coordinates ? JSON.parse(result.coordinates || '{}') : null,
  };
};

