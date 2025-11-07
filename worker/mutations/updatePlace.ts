import { eq } from 'drizzle-orm';
import { getServerDB, places } from '@database/server';
import type { GraphQLContext } from '../types';

interface UpdatePlaceInput {
  name?: string;
  location?: string;
  description?: string;
  type?: string;
  coordinates?: { latitude: number; longitude: number };
  distance?: number;
  tips?: string[];
  phone?: string;
  website?: string;
  hours?: string;
  price?: number;
  locationId?: string;
  imageUrl?: string;
  isOpen?: boolean;
}

export const updatePlace = async (
  _: any,
  { id, input }: { id: string; input: UpdatePlaceInput },
  context: GraphQLContext
) => {
  const db = getServerDB(context.env.DB);

  // Check if place exists
  const existing = await db
    .select()
    .from(places)
    .where(eq(places.id, id))
    .get();

  if (!existing) {
    throw new Error('Place not found');
  }

  // Build update object
  const updateData: any = {};

  if (input.name !== undefined) updateData.name = input.name;
  if (input.location !== undefined) updateData.location = input.location;
  if (input.description !== undefined) updateData.description = input.description;
  if (input.type !== undefined) updateData.type = input.type;
  if (input.coordinates !== undefined) updateData.coordinates = JSON.stringify(input.coordinates);
  if (input.distance !== undefined) updateData.distance = input.distance;
  if (input.tips !== undefined) updateData.tips = JSON.stringify(input.tips);
  if (input.phone !== undefined) updateData.phone = input.phone;
  if (input.website !== undefined) updateData.website = input.website;
  if (input.hours !== undefined) updateData.hours = input.hours;
  if (input.price !== undefined) updateData.price = input.price;
  if (input.locationId !== undefined) updateData.locationId = input.locationId;
  if (input.imageUrl !== undefined) updateData.imageUrl = input.imageUrl;
  if (input.isOpen !== undefined) updateData.isOpen = input.isOpen;

  try {
    const result = await db
      .update(places)
      .set(updateData)
      .where(eq(places.id, id))
      .returning()
      .get();

    // Parse JSON fields and convert rating from integer to float
    return {
      ...result,
      rating: result.rating ? result.rating / 10 : 0,
      tips: result.tips ? JSON.parse(result.tips || '[]') : [],
      coordinates: result.coordinates ? JSON.parse(result.coordinates || '{}') : null,
    };
  } catch (error: any) {
    console.error('updatePlace failed', {
      id,
      error: error?.stack || String(error),
    });
    throw new Error('Failed to update place');
  }
};

