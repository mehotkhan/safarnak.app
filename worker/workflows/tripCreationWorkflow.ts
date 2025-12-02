/**
 * Trip Creation Workflow (Intelligent Pipeline v2)
 * 
 * Redesigned architecture for speed and correctness:
 * 1. Research + Match (parallel) - Cache-first destination research + semantic matching
 * 2. Validate feasibility (lightweight, non-blocking)
 * 3. AI Itinerary Generation (one-shot with preferences and real places)
 * 4. Finalize + Save (translation → enrichment → waypoints → DB)
 * 
 * Key improvements:
 * - Parallel I/O for research and matching
 * - Translation happens BEFORE coordinate enrichment
 * - Shared finalization pipeline with update workflow
 * - Real places from matched attractions on first create
 */

import { WorkflowEntrypoint, WorkflowStep, WorkflowEvent } from 'cloudflare:workers';
import { eq } from 'drizzle-orm';
import type { Env } from '../types';
import { publishNotification } from '../utilities/publishNotification';
import { getServerDB } from '@database/server';
import { trips } from '@database/server';
import { researchDestination } from '../utilities/destination';
import { searchAttractionsByPreferences } from '../utilities/semantic/searchAttractions';
import { generateItineraryFromPreferences } from '../utilities/ai/generateItinerary';
import {
  calculateDurationFromDates,
  normalizeRawDaysToRich,
  finalizeItineraryForSave,
} from '../utilities/trip/itineraryShared';
import type { RichDay } from '../utilities/trip/types';

interface TripCreationParams {
  tripId: string;
  userId: string;
  destination?: string;
  startDate?: string;
  endDate?: string;
  budget?: number;
  travelers?: number;
  preferences?: string;
  accommodation?: string;
  userLocation?: string;
  lang?: string;
}


export class TripCreationWorkflow extends WorkflowEntrypoint<Env, TripCreationParams> {
  override async run(event: WorkflowEvent<TripCreationParams>, step: WorkflowStep): Promise<void> {
    const { 
      tripId,
      userId: _userId, 
      destination, 
      startDate,
      endDate,
      budget,
      travelers,
      preferences,
      accommodation: _accommodation,
      userLocation,
      lang,
    } = event.payload;
    
    // Wrap entire workflow in try-catch to send error notification on failure
    try {

    // Single source of truth for trip duration across all steps
    const duration = calculateDurationFromDates(startDate, endDate);

    // Small initial delay to allow subscription to connect
    await step.sleep('Connection delay', '0.5 seconds');

    // ========================================================================
    // STEP 1: Research + Match (PARALLEL)
    // Combines destination research and semantic matching for speed
    // ========================================================================
    const researchMatchResult = await step.do('Step 1: Research + Match', async () => {
      const t0 = Date.now();
      
      await publishNotification(this.env, 'TRIP_UPDATE', { 
        tripUpdates: {
          id: `${tripId}-step-1`,
          tripId,
          type: 'workflow',
          title: 'Researching & Matching',
          message: `Searching for real places in ${destination || 'destination'} and matching your preferences...`,
          step: 1,
          totalSteps: 4,
          status: 'processing',
          data: JSON.stringify({ status: 'research_match_start', destination }),
          createdAt: new Date().toISOString(),
        }
      }, this.ctx);

      // Run destination research and semantic matching in parallel
      const [destinationData, semanticMatches] = await Promise.all([
        researchDestination(this.env, destination || 'Unknown'),
        searchAttractionsByPreferences(
          this.env,
          destination || 'Unknown',
          preferences || '',
          duration * 4 // Request more attractions than needed
        ),
      ]);

      console.log(`[Workflow] Step 1: Research + Match completed in ${Date.now() - t0}ms`);
      const restaurants = destinationData.restaurants || destinationData.foodSpots || [];
      console.log(`[Workflow] Found ${destinationData.attractions.length} attractions, ${restaurants.length} restaurants`);
      console.log(`[Workflow] Semantic search returned ${semanticMatches.length} matches`);

      // Determine which attractions to use
      // Fallback to all attractions if semantic search returns few results
      const minAttractionsNeeded = Math.max(duration * 3, 10);
      let matchedAttractions = semanticMatches;
      
      if (matchedAttractions.length < minAttractionsNeeded) {
        console.log(`[Workflow] Semantic search returned ${matchedAttractions.length} attractions, using fallback to all ${destinationData.attractions.length} attractions`);
        matchedAttractions = destinationData.attractions;
      }
      
      if (matchedAttractions.length === 0) {
        console.warn(`[Workflow] No attractions found for ${destination}, itinerary will use generic place names`);
      } else {
        console.log(`[Workflow] Using ${matchedAttractions.length} attractions for itinerary generation`);
        console.log(`[Workflow] Sample attractions:`, matchedAttractions.slice(0, 3).map((a: any) => ({
          name: a.name,
          type: a.type,
          hasAddress: !!a.address,
        })));
      }
      
      await publishNotification(this.env, 'TRIP_UPDATE', {
        tripUpdates: {
          id: `${tripId}-step-1-complete`,
          tripId,
          type: 'workflow',
          title: 'Research Complete',
          message: `Found ${matchedAttractions.length} attractions and ${restaurants.length} restaurants`,
          step: 1,
          totalSteps: 4,
          status: 'processing',
          data: JSON.stringify({ 
            attractions: matchedAttractions.length,
            restaurants: restaurants.length,
            semanticMatches: semanticMatches.length,
            timeTaken: Date.now() - t0,
          }),
          createdAt: new Date().toISOString(),
        }
      }, this.ctx);

      return { destinationData, matchedAttractions, duration };
    });

    // ========================================================================
    // STEP 2: Validate Trip Feasibility (Lightweight, Non-blocking)
    // ========================================================================
    const validationResult = await step.do('Step 2: Validate', async () => {
      const t0 = Date.now();
      
      await publishNotification(this.env, 'TRIP_UPDATE', {
        tripUpdates: {
          id: `${tripId}-step-2`,
          tripId,
          type: 'workflow',
          title: 'Validation',
          message: 'Checking feasibility of budget, dates and trip duration...',
          step: 2,
          totalSteps: 4,
          status: 'processing',
          data: JSON.stringify({ status: 'validation_start' }),
          createdAt: new Date().toISOString(),
        }
      }, this.ctx);

      const { validateTripRequest } = await import('../utilities/trip/validator');

      const validation = await validateTripRequest(this.env, {
        destination: destination || 'Unknown',
        startDate,
        endDate,
        duration,
        budget,
        travelers: travelers || 1,
        preferences: preferences || '',
        userLocation,
      }, researchMatchResult.destinationData);

      console.log(`[Workflow] Step 2: Validation completed in ${Date.now() - t0}ms`);

      // Show warnings to user (non-blocking)
      if (validation.warnings && validation.warnings.length > 0) {
        await publishNotification(this.env, 'TRIP_UPDATE', {
          tripUpdates: {
            id: `${tripId}-step-2-warnings`,
            tripId,
            type: 'workflow',
            title: 'Warning',
            message: validation.warnings.join(' • '),
            step: 2,
            totalSteps: 4,
            status: 'processing',
            data: JSON.stringify({ warnings: validation.warnings }),
            createdAt: new Date().toISOString(),
          }
        }, this.ctx);
      }

      return { validation };
    });

    // ========================================================================
    // STEP 3: AI Itinerary Generation
    // Generates raw itinerary - NO enrichment or translation here
    // ========================================================================
    const itineraryResult = await step.do('Step 3: Generate Itinerary', async () => {
      const t0 = Date.now();
      
      await publishNotification(this.env, 'TRIP_UPDATE', {
        tripUpdates: {
          id: `${tripId}-step-3`,
          tripId,
          type: 'workflow',
          title: 'Generating Itinerary',
          message: 'Creating detailed itinerary with AI using real places...',
          step: 3,
          totalSteps: 4,
          status: 'processing',
          data: JSON.stringify({ status: 'itinerary_generation' }),
          createdAt: new Date().toISOString(),
        }
      }, this.ctx);

      const destRestaurants = researchMatchResult.destinationData.restaurants || researchMatchResult.destinationData.foodSpots || [];
      console.log(`[Workflow] Step 3: Generating itinerary with ${researchMatchResult.matchedAttractions.length} attractions and ${destRestaurants.length} restaurants`);
      
      // Generate itinerary using AI with preferences and matched attractions/restaurants
      const { itinerary, analysis } = await generateItineraryFromPreferences(this.env, {
        destination: destination || 'Unknown',
        preferences: preferences || '',
        budget,
        travelers: travelers || 1,
        startDate,
        endDate,
        accommodation: undefined,
        userLocation,
        // Pass real attractions and restaurants so AI uses actual place names
        attractions: researchMatchResult.matchedAttractions.map((a: any) => ({
          name: a.name || 'Unknown',
          type: a.type || a.kind || 'attraction',
          address: a.address || '',
          description: a.description || a.shortDescription || `${a.type || a.kind || 'attraction'} in ${destination}`,
          tags: a.tags || [],
          rating: a.rating || 0,
        })),
        restaurants: destRestaurants.slice(0, 20).map((r: any) => ({
          name: r.name || 'Restaurant',
          cuisine: r.cuisine || r.category || 'local',
          address: r.address || '',
          priceRange: r.priceRange || '$$',
          rating: r.rating || 0,
        })),
      });

      // Normalize AI output to RichDay[] - NO enrichment here
      // Enrichment happens in finalization step AFTER translation
      const days: RichDay[] = normalizeRawDaysToRich(itinerary.days || []);

      console.log(`[Workflow] Step 3: Generated ${days.length} days in ${Date.now() - t0}ms`);

      await publishNotification(this.env, 'TRIP_UPDATE', {
        tripUpdates: {
          id: `${tripId}-step-3-complete`,
          tripId,
          type: 'workflow',
          title: 'Itinerary Generated',
          message: `Created ${days.length} days of activities`,
          step: 3,
          totalSteps: 4,
          status: 'processing',
          data: JSON.stringify({ days: days.length }),
          createdAt: new Date().toISOString(),
        }
      }, this.ctx);

      // Return raw days + itinerary metadata (no waypoints yet)
      return { days, itinerary, analysis };
    });

    // ========================================================================
    // STEP 4: Finalize + Save
    // Translation → Enrichment → Waypoints → DB Save
    // Uses shared pipeline for consistency with update workflow
    // ========================================================================
    await step.do('Step 4: Finalize + Save', async () => {
      const t0 = Date.now();
      const db = getServerDB(this.env.DB);
      
      const center = {
        latitude: researchMatchResult.destinationData.facts.coordinates.lat,
        longitude: researchMatchResult.destinationData.facts.coordinates.lon,
      };

      await publishNotification(this.env, 'TRIP_UPDATE', {
        tripUpdates: {
          id: `${tripId}-step-4`,
          tripId,
          type: 'workflow',
          title: 'Finalizing Trip',
          message: lang && lang !== 'en' 
            ? `Translating to ${lang} and adding real coordinates...` 
            : 'Adding real coordinates to places...',
          step: 4,
          totalSteps: 4,
          status: 'processing',
          data: JSON.stringify({ status: 'finalize_start', lang: lang || 'en' }),
          createdAt: new Date().toISOString(),
        }
      }, this.ctx);

      // Use shared finalization pipeline
      // This handles: translation → enrichment → waypoints → DB normalization
      const finalized = await finalizeItineraryForSave({
        env: this.env,
        lang,
        destination: destination || 'Unknown',
        destinationCenter: center,
        days: itineraryResult.days as RichDay[],
        title: itineraryResult.itinerary.title,
        aiReasoning: itineraryResult.itinerary.aiReasoning,
      });

      console.log(`[Workflow] Step 4: Finalization completed in ${Date.now() - t0}ms`);
      console.log(`[Workflow] Final: ${finalized.richDays.length} days, ${finalized.waypoints.length} waypoints`);

      // Validate before saving
      if (!finalized.dbDays || finalized.dbDays.length === 0) {
        console.error('[Workflow] No days to save!');
        
        await publishNotification(this.env, 'TRIP_UPDATE', {
          tripUpdates: {
            id: `${tripId}-step-4-error`,
            tripId,
            type: 'workflow',
            title: '❌ Generation Failed',
            message: 'Failed to generate itinerary. Please try again or contact support.',
            step: 4,
            totalSteps: 4,
            status: 'error',
            data: JSON.stringify({ 
              status: 'error', 
              error: 'No valid days generated',
            }),
            createdAt: new Date().toISOString(),
          }
        }, this.ctx);
        
        throw new Error('No valid days generated');
      }

      // Build update data
      const updateData: any = {
        title: finalized.title || `${duration}-Day ${destination} Adventure`,
        destination: destination || 'Unknown',
        aiReasoning: finalized.aiReasoning || `Personalized ${duration}-day trip`,
        itinerary: JSON.stringify(finalized.dbDays),
        coordinates: JSON.stringify(center),
        waypoints: JSON.stringify(finalized.waypoints),
        budget: budget || null,
        status: 'active',
        updatedAt: new Date().toISOString(),
        metadata: JSON.stringify({
          validation: validationResult.validation,
          destinationFacts: researchMatchResult.destinationData.facts,
          attractionsCount: researchMatchResult.matchedAttractions.length,
          waypointsCount: finalized.waypoints.length,
          analysis: itineraryResult.analysis,
          pipeline: 'create-ai-v2',
          language: lang || 'en',
        }),
      };

      await db.update(trips).set(updateData).where(eq(trips.id, tripId)).run();
      
      console.log(`[Workflow] Trip ${tripId} saved successfully with ${finalized.dbDays.length} days`);

      // Final notification
      await publishNotification(this.env, 'TRIP_UPDATE', {
        tripUpdates: {
          id: `${tripId}-step-4-complete`,
          tripId,
          type: 'workflow',
          title: '✅ Trip Ready!',
          message: `${destination} - ${finalized.richDays.length} days - ${finalized.waypoints.length} waypoints - with real places`,
          step: 4,
          totalSteps: 4,
          status: 'completed',
          data: JSON.stringify({ 
            status: 'completed', 
            destination, 
            days: finalized.richDays.length,
            waypoints: finalized.waypoints.length,
          }),
          createdAt: new Date().toISOString(),
        }
      }, this.ctx);

      console.log('✅ Intelligent trip workflow complete:', tripId, destination, `${finalized.richDays.length} days, ${finalized.waypoints.length} waypoints`);

      return { status: 'completed' };
    });
    } catch (error: any) {
      // Send error notification to user if workflow fails
      const { tripId } = event.payload;
      console.error('[TripCreationWorkflow] Workflow failed:', error);
      
      try {
        await publishNotification(this.env, 'TRIP_UPDATE', {
          tripUpdates: {
            id: `${tripId}-workflow-error`,
            tripId,
            type: 'workflow',
            title: '❌ Workflow Error',
            message: error?.message || 'An error occurred while generating your trip. Please try again.',
            step: 0,
            totalSteps: 4,
            status: 'error',
            data: JSON.stringify({ 
              status: 'error', 
              error: error?.message || 'Unknown error',
            }),
            createdAt: new Date().toISOString(),
          }
        }, this.ctx);
      } catch (notifError) {
        console.error('[TripCreationWorkflow] Failed to send error notification:', notifError);
      }
      
      // Re-throw to mark workflow as failed
      throw error;
    }
  }
}
