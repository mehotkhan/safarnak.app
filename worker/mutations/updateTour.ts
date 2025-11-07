import { eq } from 'drizzle-orm';
import { getServerDB, tours } from '@database/server';
import type { GraphQLContext } from '../types';

interface UpdateTourInput {
  title?: string;
  description?: string;
  shortDescription?: string;
  price?: number;
  currency?: string;
  duration?: number;
  durationType?: string;
  location?: string;
  coordinates?: { latitude: number; longitude: number };
  category?: string;
  difficulty?: string;
  highlights?: string[];
  inclusions?: string[];
  maxParticipants?: number;
  minParticipants?: number;
  imageUrl?: string;
  gallery?: string[];
  tags?: string[];
  isActive?: boolean;
  isFeatured?: boolean;
}

export const updateTour = async (
  _: any,
  { id, input }: { id: string; input: UpdateTourInput },
  context: GraphQLContext
) => {
  const db = getServerDB(context.env.DB);

  // Check if tour exists
  const existing = await db
    .select()
    .from(tours)
    .where(eq(tours.id, id))
    .get();

  if (!existing) {
    throw new Error('Tour not found');
  }

  // Build update object
  const updateData: any = {};

  if (input.title !== undefined) updateData.title = input.title;
  if (input.description !== undefined) updateData.description = input.description;
  if (input.shortDescription !== undefined) updateData.shortDescription = input.shortDescription;
  if (input.price !== undefined) updateData.price = Math.round(input.price * 100);
  if (input.currency !== undefined) updateData.currency = input.currency;
  if (input.duration !== undefined) updateData.duration = input.duration;
  if (input.durationType !== undefined) updateData.durationType = input.durationType;
  if (input.location !== undefined) updateData.location = input.location;
  if (input.coordinates !== undefined) updateData.coordinates = JSON.stringify(input.coordinates);
  if (input.category !== undefined) updateData.category = input.category;
  if (input.difficulty !== undefined) updateData.difficulty = input.difficulty;
  if (input.highlights !== undefined) updateData.highlights = JSON.stringify(input.highlights);
  if (input.inclusions !== undefined) updateData.inclusions = JSON.stringify(input.inclusions);
  if (input.maxParticipants !== undefined) updateData.maxParticipants = input.maxParticipants;
  if (input.minParticipants !== undefined) updateData.minParticipants = input.minParticipants;
  if (input.imageUrl !== undefined) updateData.imageUrl = input.imageUrl;
  if (input.gallery !== undefined) updateData.gallery = JSON.stringify(input.gallery);
  if (input.tags !== undefined) updateData.tags = JSON.stringify(input.tags);
  if (input.isActive !== undefined) updateData.isActive = input.isActive;
  if (input.isFeatured !== undefined) updateData.isFeatured = input.isFeatured;

  // Update updatedAt timestamp
  updateData.updatedAt = new Date().toISOString();

  try {
    const result = await db
      .update(tours)
      .set(updateData)
      .where(eq(tours.id, id))
      .returning()
      .get();

    // Parse JSON fields and convert price/rating from integer to float
    return {
      ...result,
      price: result.price ? result.price / 100 : 0,
      rating: result.rating ? result.rating / 10 : 0,
      highlights: result.highlights ? JSON.parse(result.highlights || '[]') : [],
      inclusions: result.inclusions ? JSON.parse(result.inclusions || '[]') : [],
      gallery: result.gallery ? JSON.parse(result.gallery || '[]') : [],
      tags: result.tags ? JSON.parse(result.tags || '[]') : [],
      coordinates: result.coordinates ? JSON.parse(result.coordinates || '{}') : null,
    };
  } catch (error: any) {
    console.error('updateTour failed', {
      id,
      error: error?.stack || String(error),
    });
    throw new Error('Failed to update tour');
  }
};

