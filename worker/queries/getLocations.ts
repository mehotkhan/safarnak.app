// Query resolvers for locations
// Handles retrieving locations list and single location

import { eq, desc } from 'drizzle-orm';
import { getServerDB, locations } from '@database/server';
import type { GraphQLContext } from '../types';

export const getLocations = async (
  _: any,
  { limit }: { limit?: number },
  context: GraphQLContext
) => {
  const db = getServerDB(context.env.DB);

  const results = await db
    .select()
    .from(locations)
    .orderBy(desc(locations.createdAt))
    .limit(limit || 100)
    .all();

  // Parse JSON fields
  return results.map(location => ({
    ...location,
    coordinates: location.coordinates ? JSON.parse(location.coordinates || '{}') : null,
    popularActivities: location.popularActivities ? JSON.parse(location.popularActivities || '[]') : [],
  }));
};

export const getLocation = async (
  _: any,
  { id }: { id: string },
  context: GraphQLContext
) => {
  const db = getServerDB(context.env.DB);

  const result = await db
    .select()
    .from(locations)
    .where(eq(locations.id, id))
    .get();

  if (!result) {
    throw new Error('Location not found');
  }

  // Parse JSON fields
  return {
    ...result,
    coordinates: result.coordinates ? JSON.parse(result.coordinates || '{}') : null,
    popularActivities: result.popularActivities ? JSON.parse(result.popularActivities || '[]') : [],
  };
};

