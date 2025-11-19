/**
 * Feedback persistence utilities
 * Appends user feedback to trip metadata
 */

import type { Env } from '../../types';
import { getServerDB } from '@database/server';
import { trips } from '@database/server';
import { eq } from 'drizzle-orm';

/**
 * Append user feedback to trip metadata
 * Returns updated metadata object
 */
export async function appendTripFeedback(
  env: Env,
  tripId: string,
  currentMetadata: string | null,
  userMessage: string
): Promise<Record<string, any>> {
  // Parse existing metadata
  let metadata: Record<string, any> = {};
  if (currentMetadata) {
    try {
      metadata = JSON.parse(currentMetadata) || {};
    } catch (error) {
      console.warn('[PersistFeedback] Failed to parse metadata:', error);
      metadata = {};
    }
  }
  
  // Get or initialize feedback array
  const feedbackArray = Array.isArray(metadata.feedback) ? metadata.feedback : [];
  
  // Append new feedback entry
  feedbackArray.push({
    message: userMessage,
    at: new Date().toISOString(),
  });
  
  // Update metadata
  metadata.feedback = feedbackArray;
  
  // Persist to database
  const db = getServerDB(env.DB);
  await db
    .update(trips)
    .set({ metadata: JSON.stringify(metadata) })
    .where(eq(trips.id, tripId))
    .run();
  
  return metadata;
}

