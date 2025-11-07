import { getServerDB, tours } from '@database/server';
import type { GraphQLContext } from '../types';

interface CreateTourInput {
  title: string;
  description?: string;
  shortDescription?: string;
  price: number;
  currency?: string;
  duration: number;
  durationType?: string;
  location: string;
  coordinates?: { latitude: number; longitude: number };
  category: string;
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

export const createTour = async (
  _: any,
  { input }: { input: CreateTourInput },
  context: GraphQLContext
) => {
  const db = getServerDB(context.env.DB);

  // Validate required fields
  if (!input.title || !input.location || !input.category) {
    throw new Error('Title, location, and category are required');
  }

  if (!input.price || input.price <= 0) {
    throw new Error('Price must be greater than 0');
  }

  if (!input.duration || input.duration <= 0) {
    throw new Error('Duration must be greater than 0');
  }

  try {
    // Insert tour
    const result = await db
      .insert(tours)
      .values({
        title: input.title,
        description: input.description || null,
        shortDescription: input.shortDescription || null,
        price: Math.round(input.price * 100), // Convert dollars to cents
        currency: input.currency || 'USD',
        duration: input.duration,
        durationType: input.durationType || 'days',
        location: input.location,
        coordinates: input.coordinates ? JSON.stringify(input.coordinates) : null,
        category: input.category,
        difficulty: input.difficulty || 'easy',
        highlights: input.highlights ? JSON.stringify(input.highlights) : null,
        inclusions: input.inclusions ? JSON.stringify(input.inclusions) : null,
        maxParticipants: input.maxParticipants || null,
        minParticipants: input.minParticipants || 1,
        imageUrl: input.imageUrl || null,
        gallery: input.gallery ? JSON.stringify(input.gallery) : null,
        tags: input.tags ? JSON.stringify(input.tags) : null,
        isActive: input.isActive !== undefined ? input.isActive : true,
        isFeatured: input.isFeatured !== undefined ? input.isFeatured : false,
      })
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
    console.error('createTour failed', {
      title: input.title,
      location: input.location,
      category: input.category,
      error: error?.stack || String(error),
    });
    throw new Error('Failed to create tour');
  }
};

