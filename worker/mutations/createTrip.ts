import { getServerDB } from '@database/server';
import { trips } from '@database/server';
import type { GraphQLContext } from '../types';
import { generateWaypointsForDestination } from '../utils/waypointsGenerator';

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
  const db = getServerDB(context.env.DB);

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

  // Generate waypoints for the trip route
  const waypoints = generateWaypointsForDestination(destination);

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
        status: 'pending',
        aiReasoning,
        itinerary: JSON.stringify(mockItinerary),
        coordinates: JSON.stringify(mockCoordinates),
        waypoints: JSON.stringify(waypoints),
        aiGenerated: true,
      })
      .returning()
      .get();

    // Trigger workflow for trip creation notifications
    try {
      const workflowInstance = await context.env.TRIP_CREATION_WORKFLOW.create({
        id: `trip-${result.id}`,
        params: {
          tripId: result.id.toString(),
          userId,
          destination: destination || undefined,
          preferences: description,
        },
      });
      console.log('Trip creation workflow started:', workflowInstance.id);
    } catch (workflowError: any) {
      // Log workflow error but don't fail the mutation
      console.error('Failed to start trip creation workflow:', workflowError);
    }

    return {
      ...result,
      itinerary: JSON.parse(result.itinerary || '[]'),
      coordinates: JSON.parse(result.coordinates || '{}'),
      waypoints: JSON.parse(result.waypoints || '[]'),
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
    throw new Error('plan.form.errors.generateFailed');
  }
};

