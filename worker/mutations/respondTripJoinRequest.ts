// Mutation resolver for respondTripJoinRequest
// Allows trip host to accept or reject join requests
import { getServerDB, trips, tripParticipants, users } from '@database/server';
import type { GraphQLContext } from '../types';
import { eq, and } from 'drizzle-orm';

interface RespondTripJoinRequestInput {
  tripId: string;
  userId: string;
  decision: 'ACCEPT' | 'REJECT';
}

export const respondTripJoinRequest = async (
  _: any,
  { tripId, userId, decision }: RespondTripJoinRequestInput,
  context: GraphQLContext
) => {
  const db = getServerDB(context.env.DB);

  const hostUserId = context.userId;
  if (!hostUserId) {
    throw new Error('Not authenticated');
  }

  if (!tripId || !userId) {
    throw new Error('Trip ID and User ID are required');
  }

  if (decision !== 'ACCEPT' && decision !== 'REJECT') {
    throw new Error('Decision must be ACCEPT or REJECT');
  }

  // Get trip and verify host
  const trip = await db
    .select()
    .from(trips)
    .where(eq(trips.id, tripId))
    .get();

  if (!trip) {
    throw new Error('Trip not found');
  }

  // Verify current user is the trip host
  if (trip.userId !== hostUserId) {
    throw new Error('Only the trip host can respond to join requests');
  }

  // Find participant record
  const participant = await db
    .select()
    .from(tripParticipants)
    .where(and(eq(tripParticipants.tripId, tripId), eq(tripParticipants.userId, userId)))
    .get();

  if (!participant) {
    throw new Error('Join request not found');
  }

  // Update join status based on decision
  const newStatus = decision === 'ACCEPT' ? 'ACCEPTED' : 'REJECTED';
  
  const updated = await db
    .update(tripParticipants)
    .set({
      joinStatus: newStatus,
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

