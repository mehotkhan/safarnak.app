import { drizzle } from 'drizzle-orm/d1';
import { trips } from '@database/drizzle';
import type { GraphQLContext } from '../types';

interface CreateTripInput {
  destination?: string;
  startDate?: string;
  endDate?: string;
  budget?: number;
  travelers: number;
  preferences?: string;
  accommodation?: string;
}

export const createTrip = async (
  _: any,
  { input }: { input: CreateTripInput },
  context: GraphQLContext
) => {
  const db = drizzle(context.env.DB);

  const userId = context.userId;
  if (!userId) {
    throw new Error('Not authenticated');
  }

  // Normalize optional fields
  const description = input.preferences?.trim();
  const destination = input.destination?.trim();
  const accommodation = input.accommodation ?? 'hotel';

  // Validate input - only description and travelers are required
  if (!description || description.length < 10) {
    throw new Error('Trip description is required and must be at least 10 characters');
  }

  const travelers = input.travelers ?? 1;
  if (!travelers || travelers < 1) {
    throw new Error('Number of travelers must be at least 1');
  }

  // Generate AI reasoning and itinerary (mock for now)
  const aiReasoning = `Based on your preferences for ${description || 'general travel'}, I've designed a trip to ${destination || 'your chosen destination'} that balances culture, activities, and relaxation.`;
  
  const mockItinerary = [
    {
      day: 1,
      title: 'Arrival & Exploration',
      activities: ['Check into accommodation', 'Local orientation walk', 'Welcome dinner'],
    },
    {
      day: 2,
      title: 'Main Attractions',
      activities: ['Visit top landmarks', 'Cultural experience', 'Local cuisine tasting'],
    },
  ];

  // Mock coordinates (would be fetched from geocoding API)
  const mockCoordinates = {
    latitude: 35.6762,
    longitude: 139.6503,
  };

  try {
    // Insert trip
    const result = await db
      .insert(trips)
      .values({
        userId,
        title: destination || 'Untitled Trip',
        destination: destination || 'Untitled Trip',
        startDate: input.startDate,
        endDate: input.endDate,
        budget: input.budget != null ? Math.round(Number(input.budget)) : null,
        travelers,
        preferences: description,
        accommodation,
        status: 'in_progress',
        aiReasoning,
        itinerary: JSON.stringify(mockItinerary),
        coordinates: JSON.stringify(mockCoordinates),
        aiGenerated: true,
      })
      .returning()
      .get();

    return {
      ...result,
      itinerary: JSON.parse(result.itinerary || '[]'),
      coordinates: JSON.parse(result.coordinates || '{}'),
    };
  } catch (error: any) {
    // Log internal error details for observability without leaking to client
    console.error('createTrip failed', {
      userId,
      destination,
      hasDates: Boolean(input.startDate || input.endDate),
      travelers,
      error: error?.stack || String(error),
    });
    // Return a client-facing error key used by the app i18n layer
    throw new Error('plan.form.errors.generatefailed');
  }
};

