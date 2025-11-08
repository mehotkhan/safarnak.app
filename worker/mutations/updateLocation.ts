// Mutation resolvers for locations
// Handles creating, updating, and deleting locations

import { eq } from 'drizzle-orm';
import { getServerDB, locations } from '@database/server';
import { createId } from '@database/utils';
import type { GraphQLContext } from '../types';

interface CreateLocationInput {
  name: string;
  country: string;
  description?: string;
  coordinates: { latitude: number; longitude: number };
  popularActivities?: string[];
  averageCost?: number;
  bestTimeToVisit?: string;
  population?: string;
}

export const createLocation = async (
  _: any,
  { input }: { input: CreateLocationInput },
  context: GraphQLContext
) => {
  const db = getServerDB(context.env.DB);

  // Validate required fields
  if (!input.name || !input.country) {
    throw new Error('Name and country are required');
  }

  if (!input.coordinates || !input.coordinates.latitude || !input.coordinates.longitude) {
    throw new Error('Coordinates are required');
  }

  try {
    // Insert location
    const result = await db
      .insert(locations)
      .values({
        id: createId(),
        name: input.name,
        country: input.country,
        description: input.description || null,
        coordinates: JSON.stringify(input.coordinates),
        popularActivities: input.popularActivities ? JSON.stringify(input.popularActivities) : JSON.stringify([]),
        averageCost: input.averageCost || null,
        bestTimeToVisit: input.bestTimeToVisit || null,
        population: input.population || null,
      })
      .returning()
      .get();

    // Parse JSON fields
    return {
      ...result,
      coordinates: result.coordinates ? JSON.parse(result.coordinates || '{}') : null,
      popularActivities: result.popularActivities ? JSON.parse(result.popularActivities || '[]') : [],
    };
  } catch (error: any) {
    console.error('[createLocation] Error:', error);
    throw new Error(`Failed to create location: ${error.message}`);
  }
};

interface UpdateLocationInput {
  name?: string;
  country?: string;
  description?: string;
  coordinates?: { latitude: number; longitude: number };
  popularActivities?: string[];
  averageCost?: number;
  bestTimeToVisit?: string;
  population?: string;
}

export const updateLocation = async (
  _: any,
  { id, input }: { id: string; input: UpdateLocationInput },
  context: GraphQLContext
) => {
  const db = getServerDB(context.env.DB);

  // Check if location exists
  const existing = await db
    .select()
    .from(locations)
    .where(eq(locations.id, id))
    .get();

  if (!existing) {
    throw new Error('Location not found');
  }

  try {
    // Build update object
    const updateData: any = {};
    if (input.name !== undefined) updateData.name = input.name;
    if (input.country !== undefined) updateData.country = input.country;
    if (input.description !== undefined) updateData.description = input.description;
    if (input.coordinates !== undefined) updateData.coordinates = JSON.stringify(input.coordinates);
    if (input.popularActivities !== undefined) updateData.popularActivities = JSON.stringify(input.popularActivities);
    if (input.averageCost !== undefined) updateData.averageCost = input.averageCost;
    if (input.bestTimeToVisit !== undefined) updateData.bestTimeToVisit = input.bestTimeToVisit;
    if (input.population !== undefined) updateData.population = input.population;
    updateData.updatedAt = new Date().toISOString();

    // Update location
    const result = await db
      .update(locations)
      .set(updateData)
      .where(eq(locations.id, id))
      .returning()
      .get();

    // Parse JSON fields
    return {
      ...result,
      coordinates: result.coordinates ? JSON.parse(result.coordinates || '{}') : null,
      popularActivities: result.popularActivities ? JSON.parse(result.popularActivities || '[]') : [],
    };
  } catch (error: any) {
    console.error('[updateLocation] Error:', error);
    throw new Error(`Failed to update location: ${error.message}`);
  }
};

export const deleteLocation = async (
  _: any,
  { id }: { id: string },
  context: GraphQLContext
) => {
  const db = getServerDB(context.env.DB);

  // Check if location exists
  const existing = await db
    .select()
    .from(locations)
    .where(eq(locations.id, id))
    .get();

  if (!existing) {
    throw new Error('Location not found');
  }

  try {
    // Delete location
    await db
      .delete(locations)
      .where(eq(locations.id, id));

    return true;
  } catch (error: any) {
    console.error('[deleteLocation] Error:', error);
    throw new Error(`Failed to delete location: ${error.message}`);
  }
};

