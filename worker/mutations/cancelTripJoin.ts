// Mutation resolver for cancelTripJoin
// Allows a user to cancel their join request or participation in a trip
import { getServerDB, trips, tripParticipants, users } from '@database/server';
import type { GraphQLContext } from '../types';
import { eq, and } from 'drizzle-orm';

export const cancelTripJoin = async (
  _: any,
  { tripId }: { tripId: string },
  context: GraphQLContext
) => {
  const db = getServerDB(context.env.DB);

  const userId = context.userId;
  if (!userId) {
    throw new Error('Not authenticated');
  }

  if (!tripId) {
    throw new Error('Trip ID is required');
  }

  // Get trip
  const trip = await db
    .select()
    .from(trips)
    .where(eq(trips.id, tripId))
    .get();

  if (!trip) {
    throw new Error('Trip not found');
  }

  // Find existing participant record
  const participant = await db
    .select()
    .from(tripParticipants)
    .where(and(eq(tripParticipants.tripId, tripId), eq(tripParticipants.userId, userId)))
    .get();

  if (!participant) {
    throw new Error('You are not a participant in this trip');
  }

  // Update join status to cancelled by user
  const updated = await db
    .update(tripParticipants)
    .set({
      joinStatus: 'CANCELLED_BY_USER',
      updatedAt: new Date().toISOString(),
    })
    .where(eq(tripParticipants.id, participant.id))
    .returning()
    .get();

  // Fetch user for response
  const user = await db
    .select()
    .from(users)
    .where(eq(users.id, userId))
    .get();

  return {
    ...updated,
    user: user || null,
  };
};

