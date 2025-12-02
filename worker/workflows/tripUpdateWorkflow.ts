/**
 * Trip Update Workflow (v2)
 * AI-centric workflow for updating trips based on user feedback via chat
 * 
 * Redesigned architecture aligned with creation workflow:
 * 1. Acknowledge + persist feedback
 * 2. Load full trip context + research (cache-first)
 * 3. AI update of itinerary + fields (destination/budget/preferences if changed)
 * 4. Validation (lightweight, non-blocking)
 * 5. Finalize + Save (translation → enrichment → waypoints → DB)
 * 
 * Key improvements:
 * - Shared finalization pipeline with creation workflow
 * - Translation happens BEFORE coordinate enrichment
 * - Same data shape and correctness guarantees as create
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
import type { TripUpdateInput } from '../utilities/ai/prompts';
import type { TripUpdateResult } from '../utilities/ai/updateTrip';
import {
  calculateDurationFromDates,
  normalizeRawDaysToRich,
  finalizeItineraryForSave,
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
    
    // Wrap entire workflow in try-catch to send error notification on failure
    try {

    // ========================================================================
    // STEP 1: Acknowledge
    // ========================================================================
    await step.do('Step 1: Acknowledge', async () => {
      const t0 = Date.now();
      
      const tripUpdate = {
        id: `${tripId}-update-step-1`,
        tripId,
        type: 'workflow',
        title: 'Processing Your Request',
        message: `Reviewing your request: "${userMessage.substring(0, 50)}${userMessage.length > 50 ? '...' : ''}"`,
        step: 1,
        totalSteps: 5,
        status: 'processing',
        data: JSON.stringify({ status: 'acknowledged', userMessage }),
        createdAt: new Date().toISOString(),
      };

      await publishNotification(this.env, 'TRIP_UPDATE', { tripUpdates: tripUpdate }, this.ctx);
      console.log(`[TripUpdateWorkflow] Step 1: Acknowledge completed in ${Date.now() - t0}ms`);
      return { status: 'acknowledged' };
    });

    // Small delay to allow subscription to connect
    await step.sleep('Connection delay', '0.5 seconds');

    // ========================================================================
    // STEP 2: Load + Persist Feedback + Research (parallel where possible)
    // ========================================================================
    const ctxResult = await step.do('Step 2: Load + Research', async () => {
      const t0 = Date.now();
      
      await publishNotification(this.env, 'TRIP_UPDATE', {
        tripUpdates: {
          id: `${tripId}-update-step-2`,
          tripId,
          type: 'workflow',
          title: 'Loading Trip Data',
          message: 'Loading trip context and researching destination...',
          step: 2,
          totalSteps: 5,
          status: 'processing',
          data: JSON.stringify({ status: 'loading', userMessage }),
          createdAt: new Date().toISOString(),
        }
      }, this.ctx);

      // Load trip with context
      const { trip, itinerary } = await loadTripWithContext(this.env, tripId);
      const destination = trip.destination || 'Unknown';

      // Run feedback persistence and research in parallel
      const [updatedMetadata, destinationData] = await Promise.all([
        appendTripFeedback(this.env, tripId, trip.metadata, userMessage),
        researchDestination(this.env, destination),
      ]);

      // Extract user location
      const userLocation = extractUserLocation(trip.metadata, trip.preferences);

      console.log(`[TripUpdateWorkflow] Step 2: Load + Research completed in ${Date.now() - t0}ms`);

      return { trip, itinerary, metadata: updatedMetadata, userLocation, destinationData };
    });

    // ========================================================================
    // STEP 3: AI Trip Update (Core)
    // ========================================================================
    const updateResult = await step.do('Step 3: AI Trip Update', async () => {
      const t0 = Date.now();
      
      await publishNotification(this.env, 'TRIP_UPDATE', {
        tripUpdates: {
          id: `${tripId}-update-step-3`,
          tripId,
          type: 'workflow',
          title: 'AI Redesign',
          message: 'Redesigning itinerary based on your feedback...',
          step: 3,
          totalSteps: 5,
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

      console.log(`[TripUpdateWorkflow] Step 3: AI Update completed in ${Date.now() - t0}ms`);

      if (!aiResult) {
        // Fallback: keep original itinerary, store failure reason
        console.warn('[TripUpdate] AI update failed, keeping original itinerary');
        await publishNotification(this.env, 'TRIP_UPDATE', {
          tripUpdates: {
            id: `${tripId}-update-step-3-fallback`,
            tripId,
            type: 'workflow',
            title: 'Notice',
            message: 'Could not apply changes completely. Current itinerary preserved.',
            step: 3,
            totalSteps: 5,
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

      // Normalize AI output to RichDay[] - NO enrichment here
      const updatedDays: RichDay[] = normalizeRawDaysToRich(aiResult.updatedItinerary || []);

      await publishNotification(this.env, 'TRIP_UPDATE', {
        tripUpdates: {
          id: `${tripId}-update-step-3-complete`,
          tripId,
          type: 'workflow',
          title: 'Redesign Complete',
          message: `Updated to ${updatedDays.length} days based on your feedback`,
          step: 3,
          totalSteps: 5,
          status: 'processing',
          data: JSON.stringify({ status: 'ai_update_complete', days: updatedDays.length }),
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
    // STEP 4: Validation (Lightweight, Non-blocking)
    // ========================================================================
    const validationResult = await step.do('Step 4: Validate', async () => {
      const t0 = Date.now();
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
      }, ctxResult.destinationData);

      console.log(`[TripUpdateWorkflow] Step 4: Validation completed in ${Date.now() - t0}ms`);

      if (validation.warnings && validation.warnings.length > 0) {
        await publishNotification(this.env, 'TRIP_UPDATE', {
          tripUpdates: {
            id: `${tripId}-update-step-4-warn`,
            tripId,
            type: 'workflow',
            title: 'Validation Warning',
            message: validation.warnings.join(' • '),
            step: 4,
            totalSteps: 5,
            status: 'processing',
            data: JSON.stringify({ warnings: validation.warnings }),
            createdAt: new Date().toISOString(),
          }
        }, this.ctx);
      }

      return { validation, destination, modifications };
    });

    // ========================================================================
    // STEP 5: Finalize + Save
    // Uses shared finalization pipeline (translation → enrichment → waypoints → DB)
    // ========================================================================
    await step.do('Step 5: Finalize + Save', async () => {
      const t0 = Date.now();
      const db = getServerDB(this.env.DB);
      const modifications: Modifications = validationResult.modifications || {};
      const destination = validationResult.destination;

      await publishNotification(this.env, 'TRIP_UPDATE', {
        tripUpdates: {
          id: `${tripId}-update-step-5`,
          tripId,
          type: 'workflow',
          title: 'Finalizing Updates',
          message: lang && lang !== 'en' 
            ? `Translating to ${lang} and adding coordinates...` 
            : 'Adding coordinates and saving...',
          step: 5,
          totalSteps: 5,
          status: 'processing',
          data: JSON.stringify({ status: 'finalize_start', lang: lang || 'en' }),
          createdAt: new Date().toISOString(),
        }
      }, this.ctx);

      // Get coordinates (use destination center as fallback)
      const center = await geocodeDestinationCenter(destination) || { latitude: 0, longitude: 0 };

      // Convert itinerary to RichDay[] for finalization
      const richInputDays: RichDay[] = normalizeRawDaysToRich(updateResult.itinerary as any[]);

      // Use shared finalization pipeline
      // This handles: translation → enrichment → waypoints → DB normalization
      const finalized = await finalizeItineraryForSave({
        env: this.env,
        lang,
        destination,
        destinationCenter: center,
        days: richInputDays,
        title: ctxResult.trip.title || undefined,
        aiReasoning: updateResult.aiReasoning,
      });

      console.log(`[TripUpdateWorkflow] Step 5: Finalization completed in ${Date.now() - t0}ms`);
      console.log(`[TripUpdateWorkflow] Final: ${finalized.richDays.length} days, ${finalized.waypoints.length} waypoints`);

      // Build update data
      const updateData: any = {
        destination: modifications.destination ?? ctxResult.trip.destination,
        budget: modifications.budget ?? ctxResult.trip.budget,
        travelers: modifications.travelers ?? ctxResult.trip.travelers,
        preferences: modifications.preferences ?? ctxResult.trip.preferences,
        aiReasoning: finalized.aiReasoning || updateResult.aiReasoning || `User feedback applied: ${userMessage.substring(0, 120)}`,
        itinerary: JSON.stringify(finalized.dbDays),
        coordinates: JSON.stringify(center),
        waypoints: JSON.stringify(finalized.waypoints),
        status: 'active',
        updatedAt: new Date().toISOString(),
      };

      // Merge metadata
      const meta: Record<string, any> = {
        ...ctxResult.metadata,
        userLocation: ctxResult.userLocation,
        lastUpdateAt: new Date().toISOString(),
        lastUpdateRequest: userMessage,
        pipeline: 'edit-ai-v2',
        language: lang || ctxResult.metadata?.language || 'en',
      };

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
          id: `${tripId}-update-step-5-complete`,
          tripId,
          type: 'workflow',
          title: '✅ Trip Updated!',
          message: `${finalized.richDays.length} days with ${finalized.waypoints.length} waypoints`,
          step: 5,
          totalSteps: 5,
          status: 'completed',
          data: JSON.stringify({
            status: 'completed',
            days: finalized.dbDays.length,
            waypoints: finalized.waypoints.length,
            success: updateResult.success,
          }),
          createdAt: new Date().toISOString(),
        }
      }, this.ctx);

      console.log(`✅ Trip update workflow complete: ${tripId}, success: ${updateResult.success}`);

      return { status: 'completed' };
    });
    } catch (error: any) {
      // Send error notification to user if workflow fails
      const { tripId } = event.payload;
      console.error('[TripUpdateWorkflow] Workflow failed:', error);
      
      try {
        await publishNotification(this.env, 'TRIP_UPDATE', {
          tripUpdates: {
            id: `${tripId}-update-workflow-error`,
            tripId,
            type: 'workflow',
            title: '❌ Update Error',
            message: error?.message || 'An error occurred while updating your trip. Please try again.',
            step: 0,
            totalSteps: 5,
            status: 'error',
            data: JSON.stringify({ 
              status: 'error', 
              error: error?.message || 'Unknown error',
            }),
            createdAt: new Date().toISOString(),
          }
        }, this.ctx);
      } catch (notifError) {
        console.error('[TripUpdateWorkflow] Failed to send error notification:', notifError);
      }
      
      // Re-throw to mark workflow as failed
      throw error;
    }
  }
}
