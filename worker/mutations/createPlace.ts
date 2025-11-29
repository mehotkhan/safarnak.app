import { getServerDB, places } from '@database/server';
import type { GraphQLContext } from '../types';

interface CreatePlaceInput {
  name: string;
  location: string;
  description: string;
  type: string;
  coordinates: { latitude: number; longitude: number };
  distance?: number;
  tips?: string[];
  phone?: string;
  website?: string;
  hours?: string;
  price?: number;
  locationId?: string;
  imageUrl?: string;
}

export const createPlace = async (
  _: any,
  { input }: { input: CreatePlaceInput },
  context: GraphQLContext
) => {
  // Check user activation status
  const { assertActiveUser } = await import('../utilities/auth/assertActiveUser');
  await assertActiveUser(context);

  const db = getServerDB(context.env.DB);
  const userId = context.userId!; // Safe after assertActiveUser

  // Validate required fields
  if (!input.name || !input.location || !input.description || !input.type) {
    throw new Error('Name, location, description, and type are required');
  }

  if (!input.coordinates || !input.coordinates.latitude || !input.coordinates.longitude) {
    throw new Error('Coordinates with latitude and longitude are required');
  }

  try {
    // Insert place
    const result = await db
      .insert(places)
      .values({
        name: input.name,
        location: input.location,
        description: input.description,
        type: input.type,
        coordinates: JSON.stringify(input.coordinates),
        distance: input.distance || null,
        tips: input.tips ? JSON.stringify(input.tips) : null,
        phone: input.phone || null,
        website: input.website || null,
        hours: input.hours || null,
        price: input.price || null,
        locationId: input.locationId || null,
        ownerId: userId || null,
        imageUrl: input.imageUrl || null,
        isOpen: true,
        rating: 0,
        reviews: 0,
      })
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
    console.error('createPlace failed', {
      name: input.name,
      location: input.location,
      type: input.type,
      error: error?.stack || String(error),
    });
    throw new Error('Failed to create place');
  }
};

