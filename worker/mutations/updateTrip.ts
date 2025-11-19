import { eq } from 'drizzle-orm';
import { getServerDB } from '@database/server';
import { trips } from '@database/server';
import type { GraphQLContext } from '../types';

interface UpdateTripInput {
  destination?: string;
  startDate?: string;
  endDate?: string;
  budget?: number;
  travelers?: number;
  preferences?: string;
  accommodation?: string;
  status?: string;
  aiReasoning?: string;
  itinerary?: string;
  userMessage?: string; // User chat message for AI processing
  lang?: string;
}

export const updateTrip = async (
  _: any,
  { id, input }: { id: string; input: UpdateTripInput },
  context: GraphQLContext
) => {
  const db = getServerDB(context.env.DB);

  const userId = context.userId;
  if (!userId) {
    throw new Error('Not authenticated');
  }

  // Check if trip exists and user owns it
  const existing = await db
    .select()
    .from(trips)
    .where(eq(trips.id, id))
    .get();

  if (!existing) {
    throw new Error('Trip not found');
  }

  if (existing.userId !== userId) {
    throw new Error('Unauthorized');
  }

  // If userMessage is provided, trigger workflow for AI processing
  if (input.userMessage && input.userMessage.trim()) {
    try {
      // Set status to pending while processing
      await db
        .update(trips)
        .set({ 
          status: 'pending',
          updatedAt: new Date().toISOString(),
        })
        .where(eq(trips.id, id))
        .run();

      // Trigger workflow for trip update
      const workflowInstance = await context.env.TRIP_UPDATE_WORKFLOW.create({
        id: `trip-update-${id}-${Date.now()}`,
        params: {
          tripId: id.toString(),
          userId,
          userMessage: input.userMessage.trim(),
          destination: existing.destination || undefined,
          lang: input.lang,
        },
      });
      console.log('Trip update workflow started:', workflowInstance.id);
      
      // Return current trip state (will be updated by workflow)
      return {
        ...existing,
        status: 'pending',
        itinerary: existing.itinerary ? JSON.parse(existing.itinerary) : null,
        coordinates: existing.coordinates ? JSON.parse(existing.coordinates) : null,
        waypoints: existing.waypoints ? JSON.parse(existing.waypoints) : null,
      };
    } catch (workflowError: any) {
      // Log workflow error but don't fail the mutation
      console.error('Failed to start trip update workflow:', workflowError);
      // Continue with regular update
    }
  }

  // Build update object (regular update without workflow)
  const updateData: any = {
    updatedAt: new Date().toISOString(),
  };

  if (input.destination) {
    updateData.destination = input.destination;
    // Generate new waypoints when destination changes
    try {
      const { geocodeDestinationCenter } = await import('../utilities/destination/geo');
      const center = await geocodeDestinationCenter(input.destination);
      const wp = center ? [{
        latitude: center.latitude,
        longitude: center.longitude,
        label: input.destination,
      }] : [];
      updateData.waypoints = JSON.stringify(wp);
    } catch {
      updateData.waypoints = JSON.stringify([]);
    }
  }
  if (input.startDate) updateData.startDate = input.startDate;
  if (input.endDate) updateData.endDate = input.endDate;
  if (input.budget !== undefined) updateData.budget = input.budget;
  if (input.travelers) updateData.travelers = input.travelers;
  if (input.preferences) updateData.preferences = input.preferences;
  if (input.accommodation) updateData.accommodation = input.accommodation;
  if (input.status) updateData.status = input.status;
  if (input.aiReasoning) updateData.aiReasoning = input.aiReasoning;
  if (input.itinerary) updateData.itinerary = input.itinerary;

  // Update trip
  const result = await db
    .update(trips)
    .set(updateData)
    .where(eq(trips.id, id))
    .returning()
    .get();

  return {
    ...result,
    itinerary: result.itinerary ? JSON.parse(result.itinerary) : null,
    coordinates: result.coordinates ? JSON.parse(result.coordinates) : null,
    waypoints: result.waypoints ? JSON.parse(result.waypoints) : null,
  };
};

export const deleteTrip = async (
  _: any,
  { id }: { id: string },
  context: GraphQLContext
) => {
  const db = getServerDB(context.env.DB);

  const userId = context.userId;
  if (!userId) {
    throw new Error('Not authenticated');
  }

  // Check if trip exists and user owns it
  const existing = await db
    .select()
    .from(trips)
    .where(eq(trips.id, id))
    .get();

  if (!existing) {
    throw new Error('Trip not found');
  }

  if (existing.userId !== userId) {
    throw new Error('Unauthorized');
  }

  // Delete trip
  await db.delete(trips).where(eq(trips.id, id));

  return true;
};

