/**
 * Trip Update Workflow
 * AI-centric workflow for updating trips based on user feedback via chat
 * 
 * New architecture:
 * 1. Acknowledge + persist feedback
 * 2. Load full trip context + research (cache-first)
 * 3. AI update of itinerary + fields (destination/budget/preferences if changed)
 * 4. Optional validation + translation
 * 5. Save + final TRIP_UPDATE
 */

import { WorkflowEntrypoint, WorkflowStep, WorkflowEvent } from 'cloudflare:workers';
import { eq } from 'drizzle-orm';
import type { Env } from '../types';
import { publishNotification } from '../utilities/publishNotification';
import { getServerDB } from '@database/server';
import { trips } from '@database/server';
import { researchDestination } from '../utilities/destination';
import { validateTripRequest } from '../utilities/trip/validator';
import { geocodeDestinationCenter } from '../utilities/destination/geo';
import { loadTripWithContext } from '../utilities/trip/loadTrip';
import { appendTripFeedback } from '../utilities/trip/persistFeedback';
import { applyTripUpdateWithAI } from '../utilities/ai/updateTrip';
import { translateItineraryIfNeeded } from '../utilities/ai/translate';
import type { TripUpdateInput } from '../utilities/ai/prompts';
import type { TripUpdateResult } from '../utilities/ai/updateTrip';
import {
  calculateDurationFromDates,
  buildBaseDaysForTranslation,
  normalizeDaysForDb,
  extractWaypointsFromDays,
  normalizeRawDaysToRich,
} from '../utilities/trip/itineraryShared';
import type { RichDay } from '../utilities/trip/types';

type Modifications = TripUpdateResult['modifications'];

/**
 * Extract user location from metadata or preferences
 */
function extractUserLocation(metadata?: string | null, preferences?: string | null): string | undefined {
  if (metadata) {
    try {
      const parsed = JSON.parse(metadata);
      if (parsed?.userLocation && typeof parsed.userLocation === 'string') {
        const value = parsed.userLocation.trim();
        if (value) {
          return value;
        }
      }
    } catch {
      // ignore
    }
  }

  if (preferences) {
    const match = preferences.match(/Current Location:\s*([^\n]+)/i);
    if (match?.[1]) {
      const value = match[1].trim();
      if (value) {
        return value;
      }
    }
  }

  return undefined;
}

interface TripUpdateParams {
  tripId: string;
  userId: string;
  userMessage: string;
  destination?: string;
  lang?: string;
}

export class TripUpdateWorkflow extends WorkflowEntrypoint<Env, TripUpdateParams> {
  override async run(event: WorkflowEvent<TripUpdateParams>, step: WorkflowStep): Promise<void> {
    const { tripId, userId: _userId, userMessage, destination: _destination, lang } = event.payload;

    // ========================================================================
    // STEP 1: Acknowledge
    // ========================================================================
    await step.do('Step 1: Acknowledge', async () => {
      const tripUpdate = {
        id: `${tripId}-update-step-1`,
        tripId,
        type: 'workflow',
        title: 'Processing Your Request',
        message: `Reviewing your request: "${userMessage.substring(0, 50)}${userMessage.length > 50 ? '...' : ''}"`,
        step: 1,
        totalSteps: 7,
        status: 'processing',
        data: JSON.stringify({ status: 'acknowledged', userMessage }),
        createdAt: new Date().toISOString(),
      };

      await publishNotification(this.env, 'TRIP_UPDATE', { tripUpdates: tripUpdate }, this.ctx);
      return { status: 'acknowledged' };
    });

    // Small delay to allow subscription to connect
    await step.sleep('Connection delay', '0.5 seconds');

    // ========================================================================
    // STEP 2: Load + Persist Feedback
    // ========================================================================
    const ctxResult = await step.do('Step 2: Load + Persist Feedback', async () => {
      await publishNotification(this.env, 'TRIP_UPDATE', {
        tripUpdates: {
          id: `${tripId}-update-step-2`,
          tripId,
          type: 'workflow',
          title: 'Saving Your Feedback',
          message: 'Saving and preparing data for itinerary redesign...',
          step: 2,
          totalSteps: 7,
          status: 'processing',
          data: JSON.stringify({ status: 'feedback_saved', userMessage }),
          createdAt: new Date().toISOString(),
        }
      }, this.ctx);

      // Load trip with context
      const { trip, itinerary } = await loadTripWithContext(this.env, tripId);

      // Persist feedback
      const updatedMetadata = await appendTripFeedback(this.env, tripId, trip.metadata, userMessage);

      // Extract user location
      const userLocation = extractUserLocation(trip.metadata, trip.preferences);

      return { trip, itinerary, metadata: updatedMetadata, userLocation };
    });

    // ========================================================================
    // STEP 3: Research (Optional / Lightweight)
    // ========================================================================
    const researchResult = await step.do('Step 3: Research', async () => {
      const destination = ctxResult.trip.destination || 'Unknown';
      await publishNotification(this.env, 'TRIP_UPDATE', {
        tripUpdates: {
          id: `${tripId}-update-step-3`,
          tripId,
          type: 'workflow',
          title: 'Re-researching Destination',
          message: `Updating destination information: ${destination}...`,
          step: 3,
          totalSteps: 7,
          status: 'processing',
          data: JSON.stringify({ status: 'research', destination }),
          createdAt: new Date().toISOString(),
        }
      }, this.ctx);

      // Cache-first research (non-blocking, used for validation)
      const destinationData = await researchDestination(this.env, destination);
      return { destinationData };
    });

    // ========================================================================
    // STEP 4: AI Trip Update (Core)
    // ========================================================================
    const updateResult = await step.do('Step 4: AI Trip Update', async () => {
      await publishNotification(this.env, 'TRIP_UPDATE', {
        tripUpdates: {
          id: `${tripId}-update-step-4`,
          tripId,
          type: 'workflow',
          title: 'AI Redesign',
          message: 'Redesigning itinerary based on your feedback...',
          step: 4,
          totalSteps: 7,
          status: 'processing',
          data: JSON.stringify({ status: 'ai_update' }),
          createdAt: new Date().toISOString(),
        }
      }, this.ctx);

      // Build TripUpdateInput
      const input: TripUpdateInput = {
        currentTrip: {
          destination: ctxResult.trip.destination,
          preferences: ctxResult.trip.preferences,
          budget: ctxResult.trip.budget ?? undefined,
          travelers: ctxResult.trip.travelers ?? 1,
          itinerary: ctxResult.itinerary,
        },
        userMessage,
        userLocation: ctxResult.userLocation,
      };

      // Apply AI update
      const aiResult = await applyTripUpdateWithAI(this.env, input);

      if (!aiResult) {
        // Fallback: keep original itinerary, store failure reason
        console.warn('[TripUpdate] AI update failed, keeping original itinerary');
        await publishNotification(this.env, 'TRIP_UPDATE', {
          tripUpdates: {
            id: `${tripId}-update-step-4-fallback`,
            tripId,
            type: 'workflow',
            title: 'Notice',
            message: 'Could not apply changes completely. Current itinerary preserved.',
            step: 4,
            totalSteps: 7,
            status: 'processing',
            data: JSON.stringify({ status: 'fallback', reason: 'ai_update_failed' }),
            createdAt: new Date().toISOString(),
          }
        }, this.ctx);

        return {
          success: false,
          itinerary: ctxResult.itinerary,
          modifications: {} as Modifications,
          aiReasoning: `User feedback received but could not apply changes fully: ${userMessage.substring(0, 100)}`,
        };
      }

      // Ensure itinerary is RichDay[] format (robust normalizer)
      const updatedDays: RichDay[] = normalizeRawDaysToRich(aiResult.updatedItinerary || []);

      await publishNotification(this.env, 'TRIP_UPDATE', {
        tripUpdates: {
          id: `${tripId}-update-step-4-complete`,
          tripId,
          type: 'workflow',
          title: 'Redesign Complete',
          message: 'Itinerary updated based on your feedback',
          step: 4,
          totalSteps: 7,
          status: 'processing',
          data: JSON.stringify({ status: 'ai_update_complete' }),
          createdAt: new Date().toISOString(),
        }
      }, this.ctx);

      return {
        success: true,
        itinerary: updatedDays,
        modifications: aiResult.modifications,
        aiReasoning: aiResult.aiReasoning,
        understood: aiResult.understood,
      };
    });

    // ========================================================================
    // STEP 5: Validation (Optional, Non-blocking)
    // ========================================================================
    const _validationResult = await step.do('Step 5: Validate', async () => {
      const modifications: Modifications = updateResult.modifications || {};
      const destination = modifications.destination ?? ctxResult.trip.destination ?? 'Unknown';
      // Use duration helper if dates available, otherwise use itinerary length
      const duration = ctxResult.trip.startDate && ctxResult.trip.endDate
        ? calculateDurationFromDates(ctxResult.trip.startDate, ctxResult.trip.endDate)
        : (Array.isArray(updateResult.itinerary) ? updateResult.itinerary.length : 
           (Array.isArray(ctxResult.itinerary) ? ctxResult.itinerary.length : 7));
      const budget = modifications.budget ?? ctxResult.trip.budget ?? undefined;
      const travelers = modifications.travelers ?? ctxResult.trip.travelers ?? 1;
      const preferences = modifications.preferences ?? 
                         ((ctxResult.trip.preferences || '') + ' ' + userMessage);

      const validation = await validateTripRequest(this.env, {
        destination,
        duration,
        budget,
        travelers,
        preferences,
        userLocation: ctxResult.userLocation,
      }, researchResult.destinationData);

      if (validation.warnings && validation.warnings.length > 0) {
        await publishNotification(this.env, 'TRIP_UPDATE', {
          tripUpdates: {
            id: `${tripId}-update-step-5-warn`,
            tripId,
            type: 'workflow',
            title: 'Validation Warning',
            message: validation.warnings.join(' • '),
            step: 5,
            totalSteps: 7,
            status: 'processing',
            data: JSON.stringify({ warnings: validation.warnings }),
            createdAt: new Date().toISOString(),
          }
        }, this.ctx);
      }

      return { validation };
    });

    // ========================================================================
    // STEP 6: Translation (Batch)
    // ========================================================================
    const translationResult = await step.do('Step 6: Translation', async () => {
      const baseDays = buildBaseDaysForTranslation(updateResult.itinerary as RichDay[]);

      if (!lang || lang === 'en') {
        await publishNotification(this.env, 'TRIP_UPDATE', {
          tripUpdates: {
            id: `${tripId}-update-step-6-skip`,
            tripId,
            type: 'workflow',
            title: 'Translation Not Needed',
            message: 'English language - no translation needed',
            step: 6,
            totalSteps: 7,
            status: 'processing',
            data: JSON.stringify({ skipped: true }),
            createdAt: new Date().toISOString(),
          }
        }, this.ctx);
        return { itinerary: baseDays };
      }

      await publishNotification(this.env, 'TRIP_UPDATE', {
        tripUpdates: {
          id: `${tripId}-update-step-6`,
          tripId,
          type: 'workflow',
          title: 'Translation',
          message: `Translating itinerary to ${lang}...`,
          step: 6,
          totalSteps: 7,
          status: 'processing',
          data: JSON.stringify({ status: 'translating', lang }),
          createdAt: new Date().toISOString(),
        }
      }, this.ctx);

      const translated = await translateItineraryIfNeeded(
        this.env,
        { days: baseDays },
        lang
      );

      const translatedDays: RichDay[] = (translated.days || baseDays).map((day: any) => ({
        day: day.day || 1,
        title: day.title || `Day ${day.day || 1}`,
        activities: day.activities || [],
        estimatedCost: day.estimatedCost || 0,
      }));

      await publishNotification(this.env, 'TRIP_UPDATE', {
        tripUpdates: {
          id: `${tripId}-update-step-6-complete`,
          tripId,
          type: 'workflow',
          title: 'Translation Complete',
          message: 'Itinerary has been translated to your language',
          step: 6,
          totalSteps: 7,
          status: 'processing',
          data: JSON.stringify({ translated: true }),
          createdAt: new Date().toISOString(),
        }
      }, this.ctx);

      return { itinerary: translatedDays };
    });

    // ========================================================================
    // STEP 7: Save + Final Notification
    // ========================================================================
    await step.do('Step 7: Save', async () => {
      const db = getServerDB(this.env.DB);
      const modifications: Modifications = updateResult.modifications || {};
      const destination = modifications.destination ?? ctxResult.trip.destination ?? 'Unknown';

      // Normalize itinerary to DB format using shared helper
      const richDays: RichDay[] = (translationResult.itinerary || []).map((d: any) => ({
        day: d.day || 1,
        title: d.title || `Day ${d.day || 1}`,
        activities: d.activities || [],
        estimatedCost: d.estimatedCost || 0,
      }));

      const dbDays = normalizeDaysForDb(richDays);

      // Get coordinates (use destination center as fallback)
      const center = await geocodeDestinationCenter(destination) || { latitude: 0, longitude: 0 };

      // Extract waypoints using shared helper
      const waypoints = extractWaypointsFromDays(richDays, center, destination);

      // Build update data
      const updateData: any = {
        destination: modifications.destination ?? ctxResult.trip.destination,
        budget: modifications.budget ?? ctxResult.trip.budget,
        travelers: modifications.travelers ?? ctxResult.trip.travelers,
        preferences: modifications.preferences ?? ctxResult.trip.preferences,
        aiReasoning: updateResult.aiReasoning || `User feedback applied: ${userMessage.substring(0, 120)}`,
        itinerary: JSON.stringify(dbDays),
        coordinates: JSON.stringify(center),
        waypoints: JSON.stringify(waypoints),
        status: 'draft',
        updatedAt: new Date().toISOString(),
      };

      // Merge metadata
      const meta: Record<string, any> = {
        ...ctxResult.metadata,
        userLocation: ctxResult.userLocation,
        lastUpdateAt: new Date().toISOString(),
        lastUpdateRequest: userMessage,
        pipeline: 'edit-ai-v2',
      };

      if (lang && typeof lang === 'string' && lang.trim()) {
        meta.language = lang.trim();
      }

      if (!updateResult.success) {
        meta.lastUpdateError = 'ai_update_failed';
      }

      updateData.metadata = JSON.stringify(meta);

      // Save to database
      await db
        .update(trips)
        .set(updateData)
        .where(eq(trips.id, tripId))
        .run();

      // Send final notification
      await publishNotification(this.env, 'TRIP_UPDATE', {
        tripUpdates: {
          id: `${tripId}-update-step-7`,
          tripId,
          type: 'workflow',
          title: '✅ Trip Updated!',
          message: `Itinerary redesigned based on your feedback.`,
          step: 7,
          totalSteps: 7,
          status: 'completed',
          data: JSON.stringify({
            status: 'completed',
            days: dbDays.length,
            waypoints: waypoints.length,
            success: updateResult.success,
          }),
          createdAt: new Date().toISOString(),
        }
      }, this.ctx);

      console.log(`✅ Trip update workflow complete: ${tripId}, success: ${updateResult.success}`);

      return { status: 'completed' };
    });
  }
}
