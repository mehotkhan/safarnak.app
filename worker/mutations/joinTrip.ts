// Mutation resolver for joinTrip
// Handles joining both personal group trips and hosted trips
// Safarnak does NOT process in-app payments for trips/tours.
// Booking = joinTrip + manual coordination outside the app.
import { getServerDB, trips, tripParticipants, users } from '@database/server';
import type { GraphQLContext } from '../types';
import { eq, and } from 'drizzle-orm';

interface JoinTripInput {
  tripId: string;
  message?: string;
  participantsCount?: number;
}

export const joinTrip = async (
  _: any,
  { tripId, message, participantsCount }: JoinTripInput,
  context: GraphQLContext
) => {
  // Check user activation status
  const { assertActiveUser } = await import('../utilities/auth/assertActiveUser');
  await assertActiveUser(context);

  const db = getServerDB(context.env.DB);
  const userId = context.userId!; // Safe after assertActiveUser

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

  const isHosted = (trip as any).isHosted === 1 || (trip as any).isHosted === true;

  // Check if trip is hosted
  if (isHosted) {
    // Handle hosted trip join
    const joinPolicy = (trip as any).joinPolicy || 'open';
    const maxParticipants = (trip as any).maxParticipants;
    const minParticipants = (trip as any).minParticipants || 1;
    const participants = participantsCount || 1;

    // Validate participants count
    if (participants < minParticipants) {
      throw new Error(`Minimum ${minParticipants} participant(s) required`);
    }
    if (maxParticipants && participants > maxParticipants) {
      throw new Error(`Maximum ${maxParticipants} participant(s) allowed`);
    }

    // Check join policy
    if (joinPolicy === 'invite_only') {
      throw new Error('This trip is invite-only');
    }

    // Check if user already has a participant record
    const existingParticipant = await db
      .select()
      .from(tripParticipants)
      .where(and(eq(tripParticipants.tripId, tripId), eq(tripParticipants.userId, userId)))
      .get();

    let participant;
    if (existingParticipant) {
      // Update existing participant record
      const newStatus = joinPolicy === 'open' ? 'ACCEPTED' : 'REQUESTED';
      participant = await db
        .update(tripParticipants)
        .set({
          joinStatus: newStatus,
          notes: message || null,
          updatedAt: new Date().toISOString(),
        })
        .where(eq(tripParticipants.id, existingParticipant.id))
        .returning()
        .get();
    } else {
      // Create new participant record
      const newStatus = joinPolicy === 'open' ? 'ACCEPTED' : 'REQUESTED';
      participant = await db
        .insert(tripParticipants)
        .values({
          id: crypto.randomUUID(),
          tripId,
          userId,
          role: 'MEMBER',
          joinStatus: newStatus,
          notes: message || null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })
        .returning()
        .get();
    }

    // Fetch user for response
    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .get();

    return {
      ...participant,
      user: user || null,
    };
  } else {
    // Handle personal group trip join
    // Check if user already has a participant record
    const existingParticipant = await db
      .select()
      .from(tripParticipants)
      .where(and(eq(tripParticipants.tripId, tripId), eq(tripParticipants.userId, userId)))
      .get();

    let participant;
    if (existingParticipant) {
      // Update existing participant record
      participant = await db
        .update(tripParticipants)
        .set({
          joinStatus: 'ACCEPTED',
          notes: message || null,
          updatedAt: new Date().toISOString(),
        })
        .where(eq(tripParticipants.id, existingParticipant.id))
        .returning()
        .get();
    } else {
      // Create new participant record
      participant = await db
        .insert(tripParticipants)
        .values({
          id: crypto.randomUUID(),
          tripId,
          userId,
          role: 'MEMBER',
          joinStatus: 'ACCEPTED',
          notes: message || null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })
        .returning()
        .get();
    }

    // Fetch user for response
    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .get();

    return {
      ...participant,
      user: user || null,
    };
  }
};

