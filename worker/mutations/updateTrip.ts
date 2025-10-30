import { drizzle } from 'drizzle-orm/d1';
import { eq } from 'drizzle-orm';
import { trips } from '@database/drizzle';
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
}

export const updateTrip = async (
  _: any,
  { id, input }: { id: string; input: UpdateTripInput },
  context: GraphQLContext
) => {
  const db = drizzle(context.env.DB);

  const userId = context.userId;
  if (!userId) {
    throw new Error('Not authenticated');
  }

  // Check if trip exists and user owns it
  const existing = await db
    .select()
    .from(trips)
    .where(eq(trips.id, parseInt(id)))
    .get();

  if (!existing) {
    throw new Error('Trip not found');
  }

  if (existing.userId !== userId) {
    throw new Error('Unauthorized');
  }

  // Build update object
  const updateData: any = {
    updatedAt: new Date().toISOString(),
  };

  if (input.destination) updateData.destination = input.destination;
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
    .where(eq(trips.id, parseInt(id)))
    .returning()
    .get();

  return {
    ...result,
    itinerary: result.itinerary ? JSON.parse(result.itinerary) : null,
    coordinates: result.coordinates ? JSON.parse(result.coordinates) : null,
  };
};

export const deleteTrip = async (
  _: any,
  { id }: { id: string },
  context: GraphQLContext
) => {
  const db = drizzle(context.env.DB);

  const userId = context.userId;
  if (!userId) {
    throw new Error('Not authenticated');
  }

  // Check if trip exists and user owns it
  const existing = await db
    .select()
    .from(trips)
    .where(eq(trips.id, parseInt(id)))
    .get();

  if (!existing) {
    throw new Error('Trip not found');
  }

  if (existing.userId !== userId) {
    throw new Error('Unauthorized');
  }

  // Delete trip
  await db.delete(trips).where(eq(trips.id, parseInt(id)));

  return true;
};

