// Mutation resolver for bookTour
// Handles booking a tour

import { getServerDB, tours, bookings } from '@database/server';
import { eq } from 'drizzle-orm';
import { createId } from '@database/utils';
import type { GraphQLContext } from '../types';

interface BookTourInput {
  tourId: string;
  participants: number;
  selectedDate: string;
  fullName: string;
  email: string;
  phone?: string;
  specialRequests?: string;
}

export const bookTour = async (
  _: any,
  { input }: { input: BookTourInput },
  context: GraphQLContext
) => {
  const db = getServerDB(context.env.DB);

  // Get userId from context
  const userId = context.userId;
  if (!userId) {
    throw new Error('Authentication required');
  }

  // Validate required fields
  if (!input.tourId || !input.selectedDate || !input.fullName || !input.email) {
    throw new Error('Tour ID, date, full name, and email are required');
  }

  if (!input.participants || input.participants < 1) {
    throw new Error('Participants must be at least 1');
  }

  // Check if tour exists and get price
  const tour = await db
    .select()
    .from(tours)
    .where(eq(tours.id, input.tourId))
    .get();

  if (!tour) {
    throw new Error('Tour not found');
  }

  // Calculate total price (price is stored in cents, convert to dollars for calculation)
  const tourPrice = tour.price ? tour.price / 100 : 0;
  const totalPrice = tourPrice * input.participants;

  try {
    // Create booking
    const result = await db
      .insert(bookings)
      .values({
        id: createId(),
        tourId: input.tourId,
        userId,
        participants: input.participants,
        selectedDate: input.selectedDate,
        fullName: input.fullName,
        email: input.email,
        phone: input.phone || null,
        specialRequests: input.specialRequests || null,
        totalPrice,
        status: 'pending',
      })
      .returning()
      .get();

    return {
      id: result.id,
      tourId: result.tourId,
      userId: result.userId,
      participants: result.participants,
      selectedDate: result.selectedDate,
      fullName: result.fullName,
      email: result.email,
      phone: result.phone,
      specialRequests: result.specialRequests,
      totalPrice: result.totalPrice,
      status: result.status,
      createdAt: result.createdAt || new Date().toISOString(),
    };
  } catch (error: any) {
    console.error('[bookTour] Error:', error);
    throw new Error(`Failed to create booking: ${error.message}`);
  }
};

