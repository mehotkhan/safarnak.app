import { drizzle } from 'drizzle-orm/d1';
import { eq, desc } from 'drizzle-orm';
import { trips } from '@database/schema';
import type { Env, GraphQLContext } from '../types';

export const getTrips = async (
  _: any,
  { status }: { status?: string },
  context: GraphQLContext
) => {
  const db = drizzle(context.env.DB);

  // Get user ID from context (assuming auth middleware sets this)
  const userId = context.userId;
  if (!userId) {
    throw new Error('Not authenticated');
  }

  // Build query
  const query = db
    .select()
    .from(trips)
    .where(eq(trips.userId, userId))
    .orderBy(desc(trips.createdAt));

  const results = await query.all();

  // Filter by status if provided
  const filteredResults = status
    ? results.filter(trip => trip.status === status)
    : results;

  // Parse JSON fields
  return filteredResults.map(trip => ({
    ...trip,
    itinerary: trip.itinerary ? JSON.parse(trip.itinerary) : null,
    coordinates: trip.coordinates ? JSON.parse(trip.coordinates) : null,
  }));
};

export const getTrip = async (
  _: any,
  { id }: { id: string },
  context: GraphQLContext
) => {
  const db = drizzle(context.env.DB);

  const userId = context.userId;
  if (!userId) {
    throw new Error('Not authenticated');
  }

  const result = await db
    .select()
    .from(trips)
    .where(eq(trips.id, parseInt(id)))
    .get();

  if (!result) {
    throw new Error('Trip not found');
  }

  // Verify ownership
  if (result.userId !== userId) {
    throw new Error('Unauthorized');
  }

  // Parse JSON fields
  return {
    ...result,
    itinerary: result.itinerary ? JSON.parse(result.itinerary) : null,
    coordinates: result.coordinates ? JSON.parse(result.coordinates) : null,
  };
};

