/**
 * Trip Creation Workflow (Intelligent Pipeline)
 * 
 * Redesigned architecture:
 * 1. Research destination (cache-first, OSM + Wikipedia + AI)
 * 2. Validate feasibility (budget, dates, reachability)
 * 3. Semantic matching (Vectorize search for attractions)
 * 4. AI itinerary generation (one-shot with preferences)
 * 5. Translation (batch if needed)
 * 6. Save & notify
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
import { translateItineraryIfNeeded } from '../utilities/ai/translate';
import {
  calculateDurationFromDates,
  buildBaseDaysForTranslation,
  normalizeDaysForDb,
  extractWaypointsFromDays,
  normalizeRawDaysToRich,
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

    // Single source of truth for trip duration across all steps
    const duration = calculateDurationFromDates(startDate, endDate);

    // Small initial delay to allow subscription to connect
    await step.sleep('Connection delay', '0.5 seconds');

    // ========================================================================
    // STEP 1: Research Destination (Cache-First)
    // ========================================================================
    const researchResult = await step.do('Step 1: Research', async () => {
      await publishNotification(this.env, 'TRIP_UPDATE', { 
        tripUpdates: {
        id: `${tripId}-step-1`,
        tripId,
        type: 'workflow',
          title: 'Researching Destination',
          message: `Searching for real information about ${destination || 'destination'} in OpenStreetMap...`,
        step: 1,
          totalSteps: 6,
        status: 'processing',
          data: JSON.stringify({ status: 'research_start', destination }),
        createdAt: new Date().toISOString(),
        }
      }, this.ctx);

      const destinationData = await researchDestination(this.env, destination || 'Unknown');
      
      await publishNotification(this.env, 'TRIP_UPDATE', {
        tripUpdates: {
          id: `${tripId}-step-1-complete`,
          tripId,
          type: 'workflow',
          title: 'Research Complete',
          message: `Found ${destinationData.attractions.length} attractions and ${destinationData.restaurants.length} restaurants`,
          step: 1,
          totalSteps: 6,
          status: 'processing',
          data: JSON.stringify({ 
            attractions: destinationData.attractions.length,
            restaurants: destinationData.restaurants.length,
            cached: true,
          }),
          createdAt: new Date().toISOString(),
        }
      }, this.ctx);

      return { destinationData };
    });

    // ========================================================================
    // STEP 2: Validate Trip Feasibility
    // ========================================================================
    const validationResult = await step.do('Step 2: Validate', async () => {
      await publishNotification(this.env, 'TRIP_UPDATE', {
        tripUpdates: {
        id: `${tripId}-step-2`,
        tripId,
        type: 'workflow',
          title: 'Validation',
          message: 'Checking feasibility of budget, dates and trip duration...',
        step: 2,
          totalSteps: 6,
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
      }, researchResult.destinationData);

      // Show warnings to user
      if (validation.warnings && validation.warnings.length > 0) {
        await publishNotification(this.env, 'TRIP_UPDATE', {
          tripUpdates: {
            id: `${tripId}-step-2-warnings`,
            tripId,
            type: 'workflow',
            title: 'Warning',
            message: validation.warnings.join(' • '),
            step: 2,
            totalSteps: 6,
            status: 'processing',
            data: JSON.stringify({ warnings: validation.warnings }),
            createdAt: new Date().toISOString(),
          }
        }, this.ctx);
      }

      return { validation };
    });

    // ========================================================================
    // STEP 3: Semantic Matching (Vectorize Search)
    // ========================================================================
    const matchingResult = await step.do('Step 3: Match Attractions', async () => {
      await publishNotification(this.env, 'TRIP_UPDATE', {
        tripUpdates: {
          id: `${tripId}-step-3`,
          tripId,
          type: 'workflow',
          title: 'Matching Preferences',
          message: 'Searching for attractions matching your interests...',
          step: 3,
          totalSteps: 6,
          status: 'processing',
          data: JSON.stringify({ status: 'matching_start' }),
          createdAt: new Date().toISOString(),
        }
      }, this.ctx);

      let matchedAttractions = await searchAttractionsByPreferences(
        this.env,
        destination || 'Unknown',
        preferences || '',
        duration * 4
      );

      // Fallback to all attractions if semantic search returns few results
      if (matchedAttractions.length < duration * 2) {
        matchedAttractions = researchResult.destinationData.attractions;
      }

      await publishNotification(this.env, 'TRIP_UPDATE', {
        tripUpdates: {
          id: `${tripId}-step-3-complete`,
          tripId,
          type: 'workflow',
          title: 'Matching Complete',
          message: `Found ${matchedAttractions.length} suitable attractions`,
          step: 3,
          totalSteps: 6,
          status: 'processing',
          data: JSON.stringify({ matched: matchedAttractions.length }),
          createdAt: new Date().toISOString(),
        }
      }, this.ctx);

      return { matchedAttractions, duration };
    });

    // ========================================================================
    // STEP 4: AI Itinerary Generation
    // ========================================================================
    const itineraryResult = await step.do('Step 4: Generate Itinerary', async () => {
      await publishNotification(this.env, 'TRIP_UPDATE', {
        tripUpdates: {
          id: `${tripId}-step-4`,
          tripId,
          type: 'workflow',
          title: 'Generating Itinerary',
          message: 'Creating detailed itinerary with AI...',
          step: 4,
          totalSteps: 6,
          status: 'processing',
          data: JSON.stringify({ status: 'itinerary_generation' }),
          createdAt: new Date().toISOString(),
        }
      }, this.ctx);

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
        // Pass real attractions and restaurants so AI can use actual place names
        attractions: matchingResult.matchedAttractions.map((a: any) => ({
          name: a.name,
          type: a.type,
          address: a.address,
          description: a.description,
        })),
        restaurants: researchResult.destinationData.restaurants.slice(0, 15).map((r: any) => ({
          name: r.name,
          cuisine: r.cuisine,
          address: r.address,
        })),
      });

      // Robust normalization to RichDay[] – handles multiple AI output shapes
      const days: RichDay[] = normalizeRawDaysToRich(itinerary.days || []);

      // Extract waypoints using shared helper
      const fallbackCenter = {
        latitude: researchResult.destinationData.facts.coordinates.lat,
        longitude: researchResult.destinationData.facts.coordinates.lon,
      };
      const waypoints = extractWaypointsFromDays(days, fallbackCenter, destination || 'City Center');

      await publishNotification(this.env, 'TRIP_UPDATE', {
        tripUpdates: {
          id: `${tripId}-step-4-complete`,
          tripId,
          type: 'workflow',
          title: 'Itinerary Ready',
          message: `${days.length} days with ${waypoints.length} waypoints`,
          step: 4,
          totalSteps: 6,
          status: 'processing',
          data: JSON.stringify({ days: days.length, waypoints: waypoints.length }),
          createdAt: new Date().toISOString(),
        }
      }, this.ctx);

      return { days, waypoints, itinerary, analysis };
    });

    // ========================================================================
    // STEP 5: Translation (if needed)
    // ========================================================================
    const translationResult = await step.do('Step 5: Translation', async () => {
      const baseDays = buildBaseDaysForTranslation(itineraryResult.days as RichDay[]);

      if (!lang || lang === 'en') {
        await publishNotification(this.env, 'TRIP_UPDATE', {
          tripUpdates: {
            id: `${tripId}-step-5-skip`,
            tripId,
            type: 'workflow',
            title: 'Translation skipped',
            message: 'English language - no translation needed',
            step: 5,
            totalSteps: 6,
            status: 'processing',
            data: JSON.stringify({ skipped: true }),
            createdAt: new Date().toISOString(),
          }
        }, this.ctx);
        return { days: baseDays };
      }

      await publishNotification(this.env, 'TRIP_UPDATE', {
        tripUpdates: {
          id: `${tripId}-step-5`,
          tripId,
          type: 'workflow',
          title: 'Translation',
          message: `Translating itinerary to ${lang}...`,
          step: 5,
          totalSteps: 6,
          status: 'processing',
          data: JSON.stringify({ status: 'translating', lang }),
          createdAt: new Date().toISOString(),
        }
      }, this.ctx);

      const translatedItinerary = await translateItineraryIfNeeded(
        this.env,
        {
          ...(itineraryResult.itinerary || {}),
          days: baseDays,
        },
        lang
      );

      const translatedDays: RichDay[] = (translatedItinerary.days || baseDays).map((day: any) => ({
        day: day.day || 1,
        title: day.title || `Day ${day.day || 1}`,
        activities: day.activities || [],
        estimatedCost: day.estimatedCost || 0,
      }));

      await publishNotification(this.env, 'TRIP_UPDATE', {
        tripUpdates: {
          id: `${tripId}-step-5-complete`,
          tripId,
          type: 'workflow',
          title: 'Translation Complete',
          message: 'Itinerary has been translated to your language',
          step: 5,
          totalSteps: 6,
          status: 'processing',
          data: JSON.stringify({ translated: true }),
          createdAt: new Date().toISOString(),
        }
      }, this.ctx);

      return { days: translatedDays };
    });

    // ========================================================================
    // STEP 6: Final Save
    // ========================================================================
    await step.do('Step 6: Save', async () => {
      const db = getServerDB(this.env.DB);
      
      const { days } = translationResult;
      const { waypoints } = itineraryResult;
      
      // Validate before saving
      if (!days || days.length === 0) {
        console.error('[Workflow] No days to save!');
        throw new Error('No valid days generated');
      }

      console.log(`[Workflow] Saving ${days.length} days to database`);
      console.log('[Workflow] Days structure:', JSON.stringify(days.map((d: any) => ({
        day: d.day,
        title: d.title,
        activitiesCount: d.activities?.length || 0,
      })), null, 2));
      
      // Normalize itinerary to DB format using shared helper
      const dbDays = normalizeDaysForDb(translationResult.days as RichDay[]);
      
      const updateData: any = {
        title: itineraryResult.itinerary.title || `${duration}-Day ${destination} Adventure`,
        destination: destination || 'Unknown',
        aiReasoning: itineraryResult.itinerary.aiReasoning || `Personalized ${duration}-day trip`,
        itinerary: JSON.stringify(dbDays),
        coordinates: JSON.stringify({
          latitude: researchResult.destinationData.facts.coordinates.lat,
          longitude: researchResult.destinationData.facts.coordinates.lon,
        }),
        waypoints: JSON.stringify(waypoints),
        budget: budget || null,
        status: 'draft',
        updatedAt: new Date().toISOString(),
        metadata: JSON.stringify({
          validation: validationResult.validation,
          destinationFacts: researchResult.destinationData.facts,
          attractionsCount: matchingResult.matchedAttractions.length,
          waypointsCount: waypoints.length,
          analysis: itineraryResult.analysis,
          pipeline: 'create-ai-v2',
        }),
      };

      await db.update(trips).set(updateData).where(eq(trips.id, tripId)).run();
      
      console.log(`[Workflow] Trip ${tripId} saved successfully with ${days.length} days, status: ${updateData.status}`);

      // Final notification
      await publishNotification(this.env, 'TRIP_UPDATE', {
        tripUpdates: {
          id: `${tripId}-step-7`,
          tripId,
          type: 'workflow',
          title: '✅ Trip Ready!',
          message: `${destination} - ${days.length} days - ${waypoints.length} waypoints - with real places`,
          step: 6,
          totalSteps: 6,
          status: 'completed',
          data: JSON.stringify({ 
            status: 'completed', 
            destination, 
            days: days.length,
            waypoints: waypoints.length,
          }),
          createdAt: new Date().toISOString(),
        }
      }, this.ctx);

      console.log('✅ Intelligent trip workflow complete:', tripId, destination, `${days.length} days, ${waypoints.length} waypoints`);

      return { status: 'completed' };
    });
  }
}
