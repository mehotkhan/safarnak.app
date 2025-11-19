/**
 * Trip loading utilities
 * Handles D1 read and basic parsing
 */

import type { Env } from '../../types';
import { getServerDB } from '@database/server';
import { trips } from '@database/server';
import { eq } from 'drizzle-orm';

export interface TripContext {
  trip: any;
  itinerary: any[];
  metadata: Record<string, any>;
}

/**
 * Load trip with full context (itinerary + metadata parsed)
 */
export async function loadTripWithContext(
  env: Env,
  tripId: string
): Promise<TripContext> {
  const db = getServerDB(env.DB);
  const trip = await db.select().from(trips).where(eq(trips.id, tripId)).get();
  
  if (!trip) {
    throw new Error('Trip not found');
  }
  
  // Parse itinerary JSON if exists
  let itinerary: any[] = [];
  if (trip.itinerary) {
    try {
      const parsed = JSON.parse(trip.itinerary);
      itinerary = Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.warn('[LoadTrip] Failed to parse itinerary:', error);
      itinerary = [];
    }
  }
  
  // Parse metadata JSON
  let metadata: Record<string, any> = {};
  if (trip.metadata) {
    try {
      metadata = JSON.parse(trip.metadata) || {};
    } catch (error) {
      console.warn('[LoadTrip] Failed to parse metadata:', error);
      metadata = {};
    }
  }
  
  return {
    trip,
    itinerary,
    metadata,
  };
}

