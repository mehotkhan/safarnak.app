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
          title: 'تحقیق مقصد',
          message: `جستجوی اطلاعات واقعی ${destination || 'مقصد'} در OpenStreetMap...`,
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
          title: 'تحقیق کامل شد',
          message: `${destinationData.attractions.length} جاذبه و ${destinationData.restaurants.length} رستوران پیدا شد`,
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
          title: 'اعتبارسنجی',
          message: 'بررسی امکان‌پذیری بودجه، تاریخ و مدت سفر...',
        step: 2,
          totalSteps: 6,
        status: 'processing',
          data: JSON.stringify({ status: 'validation_start' }),
        createdAt: new Date().toISOString(),
        }
      }, this.ctx);

      const { validateTripRequest } = await import('../utilities/trip/validator');
      
      const calculateDuration = (start?: string, end?: string): number => {
        if (!start || !end) return 7;
        try {
          const s = new Date(start);
          const e = new Date(end);
          const diff = Math.abs(e.getTime() - s.getTime());
          return Math.max(1, Math.min(30, Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1));
        } catch {
          return 7;
        }
      };

      const validation = await validateTripRequest(this.env, {
        destination: destination || 'Unknown',
        startDate,
        endDate,
        duration: calculateDuration(startDate, endDate),
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
            title: 'توجه',
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
          title: 'تطبیق ترجیحات',
          message: 'جستجوی جاذبه‌های مناسب با علاقه‌مندی‌های شما...',
          step: 3,
          totalSteps: 6,
          status: 'processing',
          data: JSON.stringify({ status: 'matching_start' }),
          createdAt: new Date().toISOString(),
        }
      }, this.ctx);

      const calculateDuration = (start?: string, end?: string): number => {
        if (!start || !end) return 7;
        try {
          const s = new Date(start);
          const e = new Date(end);
          const diff = Math.abs(e.getTime() - s.getTime());
          return Math.max(1, Math.min(30, Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1));
        } catch {
          return 7;
        }
      };

      const duration = calculateDuration(startDate, endDate);
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
          title: 'تطبیق انجام شد',
          message: `${matchedAttractions.length} جاذبه مناسب پیدا شد`,
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
          title: 'ساخت برنامه سفر',
          message: 'ایجاد برنامه تفصیلی با هوش مصنوعی...',
          step: 4,
          totalSteps: 6,
          status: 'processing',
          data: JSON.stringify({ status: 'itinerary_generation' }),
          createdAt: new Date().toISOString(),
        }
      }, this.ctx);

      const calculateDuration = (start?: string, end?: string): number => {
        if (!start || !end) return 7;
        try {
          const s = new Date(start);
          const e = new Date(end);
          const diff = Math.abs(e.getTime() - s.getTime());
          return Math.max(1, Math.min(30, Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1));
        } catch {
          return 7;
        }
      };

      const _duration = calculateDuration(startDate, endDate);

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

      // Extract waypoints from itinerary days
      const waypoints: { latitude: number; longitude: number; label?: string; order: number }[] = [];
      let order = 1;

      // Convert itinerary days to our format and extract waypoints
      // Track which attractions have been used to avoid duplicates
      const usedAttractions = new Set<string>();
      let attractionIndex = 0;
      
      const days = (itinerary.days || []).map((day: any) => {
        const activities = (day.activities || []).map((activity: any) => {
          // Get activity text
          const activityText = typeof activity === 'string' ? activity : activity.title || activity;
          
          // Try to find matching attraction by name
          let matched = matchingResult.matchedAttractions.find((a: any) => 
            activityText.toLowerCase().includes(a.name.toLowerCase()) ||
            a.name.toLowerCase().includes(activityText.toLowerCase().split(':')[1]?.trim() || '')
          );

          // If no match found and activity looks generic, try to assign a real attraction
          if (!matched && activityText) {
            const isGeneric = /(visit|explore|see|check out|جاذبه|بازدید|کاوش|مکان)/i.test(activityText) &&
                             !matchingResult.matchedAttractions.some((a: any) => 
                               activityText.toLowerCase().includes(a.name.toLowerCase())
                             );
            
            if (isGeneric && attractionIndex < matchingResult.matchedAttractions.length) {
              // Find next unused attraction
              while (attractionIndex < matchingResult.matchedAttractions.length && 
                     usedAttractions.has(matchingResult.matchedAttractions[attractionIndex].name)) {
                attractionIndex++;
              }
              
              if (attractionIndex < matchingResult.matchedAttractions.length) {
                matched = matchingResult.matchedAttractions[attractionIndex];
                usedAttractions.add(matched.name);
                attractionIndex++;
                
                // Replace generic text with real attraction name
                const timeMatch = activityText.match(/^(\d{2}:\d{2})/);
                const time = timeMatch ? timeMatch[1] : '09:00';
                const newActivityText = `${time}: Visit ${matched.name}${matched.address ? ` - ${matched.address}` : ''}`;
                
                // Update activity text
                if (typeof activity === 'string') {
                  activity = newActivityText;
                } else {
                  activity.title = newActivityText;
                }
              }
            }
          }

          if (matched && matched.coords) {
            waypoints.push({
              latitude: matched.coords.lat,
              longitude: matched.coords.lon,
              label: matched.name,
              order: order++,
            });
            usedAttractions.add(matched.name);
          }

          // Return activity in our format
          if (typeof activity === 'string') {
            return {
              time: activity.match(/^(\d{2}:\d{2})/)?.[1] || '09:00',
              title: activity,
              location: destination || 'City',
              coords: matched?.coords || researchResult.destinationData.facts.coordinates,
              duration: 90,
              cost: 0,
              type: 'attraction',
              description: activity,
            };
          }

          return {
            time: activity.time || '09:00',
            title: activity.title || activity,
            location: activity.location || destination || 'City',
            coords: matched?.coords || researchResult.destinationData.facts.coordinates,
            duration: activity.duration || 90,
            cost: activity.cost || 0,
            type: activity.type || 'attraction',
            description: activity.description || activity.title || activity,
          };
        });

        return {
          day: day.day || 1,
          title: day.title || `Day ${day.day || 1}`,
          activities,
          estimatedCost: day.estimatedCost || 0,
        };
      });

      // If no waypoints extracted, add destination center
      if (waypoints.length === 0) {
        waypoints.push({
          latitude: researchResult.destinationData.facts.coordinates.lat,
          longitude: researchResult.destinationData.facts.coordinates.lon,
          label: destination || 'City Center',
          order: 1,
        });
      }

      await publishNotification(this.env, 'TRIP_UPDATE', {
        tripUpdates: {
          id: `${tripId}-step-4-complete`,
          tripId,
          type: 'workflow',
          title: 'برنامه آماده شد',
          message: `${days.length} روز با ${waypoints.length} نقطه بازدید`,
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
      if (!lang || lang === 'en') {
        await publishNotification(this.env, 'TRIP_UPDATE', {
          tripUpdates: {
            id: `${tripId}-step-5-skip`,
            tripId,
            type: 'workflow',
            title: 'ترجمه نیاز نیست',
            message: 'زبان انگلیسی - بدون ترجمه',
            step: 5,
            totalSteps: 6,
            status: 'processing',
            data: JSON.stringify({ skipped: true }),
            createdAt: new Date().toISOString(),
          }
        }, this.ctx);
        return { days: itineraryResult.days };
      }

      await publishNotification(this.env, 'TRIP_UPDATE', {
        tripUpdates: {
          id: `${tripId}-step-5`,
          tripId,
          type: 'workflow',
          title: 'ترجمه',
          message: `ترجمه برنامه سفر به ${lang}...`,
          step: 5,
          totalSteps: 6,
          status: 'processing',
          data: JSON.stringify({ status: 'translating', lang }),
          createdAt: new Date().toISOString(),
        }
      }, this.ctx);

      // Batch translate entire itinerary
      const translatedItinerary = await translateItineraryIfNeeded(
        this.env,
        itineraryResult.itinerary,
        lang
      );

      // Convert back to days format - preserve original string activities
      const translatedDays = (translatedItinerary.days || []).map((day: any) => {
        // If activities are already objects from previous step, keep them
        // If they're strings (from translation), convert to objects for consistency
        const activities = (day.activities || []).map((activity: any) => {
          if (typeof activity === 'string') {
            // Preserve the original string format in the title field
            return {
              time: activity.match(/^(\d{2}:\d{2})/)?.[1] || '09:00',
              title: activity, // Keep full string here - normalization will use it
              location: destination || 'City',
              coords: researchResult.destinationData.facts.coordinates,
              duration: 90,
              cost: 0,
              type: 'attraction',
              description: activity,
            };
          }
          // If already an object, preserve it but ensure title has the full string
          if (activity.title && typeof activity.title === 'string' && activity.title.includes(':')) {
            return activity; // Already has formatted title
          }
          return activity;
        });

        return {
          day: day.day || 1,
          title: day.title || `Day ${day.day || 1}`,
          activities,
          estimatedCost: day.estimatedCost || 0,
        };
      });

      await publishNotification(this.env, 'TRIP_UPDATE', {
        tripUpdates: {
          id: `${tripId}-step-5-complete`,
          tripId,
          type: 'workflow',
          title: 'ترجمه کامل شد',
          message: 'برنامه سفر به زبان شما ترجمه شد',
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
      
      // Normalize itinerary to match GraphQL schema (activities: [String!])
      // Activities from AI are strings like "09:00: Visit Eiffel Tower - address"
      // They get converted to objects for waypoint extraction, but we preserve the original string in title
      // Here we convert back to strings, preserving the original format when possible
      const normalizedDays = (days as any[]).map((d: any) => ({
        day: d.day,
        title: d.title,
        activities: (Array.isArray(d.activities) ? d.activities : []).map((a: any) => {
          // If already a string, return as-is (shouldn't happen here, but handle it)
          if (typeof a === 'string') return a;
          
          // If title already contains the full formatted activity string (e.g., "09:00: Visit Place - address"),
          // use it directly instead of reconstructing to preserve original place names
          if (a?.title && typeof a.title === 'string' && a.title.includes(':')) {
            // Check if title looks like a formatted activity string (starts with time pattern like "09:00:")
            const timePattern = /^\d{2}:\d{2}/;
            if (timePattern.test(a.title.trim())) {
              // This is the original AI-generated string with real place names - use it directly
              return a.title;
            }
          }
          
          // Otherwise, reconstruct from parts (fallback for edge cases)
          const parts: string[] = [];
          if (a?.time) parts.push(String(a.time));
          if (a?.title) parts.push(String(a.title));
          if (a?.location && a.location !== destination) parts.push(`@ ${String(a.location)}`);
          return parts.length > 0 ? parts.join(' - ') : (a?.title || 'Activity');
        }),
      }));
      
      const calculateDuration = (start?: string, end?: string): number => {
        if (!start || !end) return 7;
        try {
          const s = new Date(start);
          const e = new Date(end);
          const diff = Math.abs(e.getTime() - s.getTime());
          return Math.max(1, Math.min(30, Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1));
        } catch {
          return 7;
        }
      };

      const duration = calculateDuration(startDate, endDate);

      const updateData: any = {
        title: itineraryResult.itinerary.title || `${duration}-Day ${destination} Adventure`,
        destination: destination || 'Unknown',
        aiReasoning: itineraryResult.itinerary.aiReasoning || `Personalized ${duration}-day trip`,
        itinerary: JSON.stringify(normalizedDays),
        coordinates: JSON.stringify({
          latitude: researchResult.destinationData.facts.coordinates.lat,
          longitude: researchResult.destinationData.facts.coordinates.lon,
        }),
        waypoints: JSON.stringify(waypoints),
        budget: budget || null,
        status: 'ready',
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
      
      console.log(`[Workflow] Trip ${tripId} saved successfully with ${days.length} days`);

      // Final notification
      await publishNotification(this.env, 'TRIP_UPDATE', {
        tripUpdates: {
          id: `${tripId}-step-7`,
          tripId,
          type: 'workflow',
          title: '✅ سفر آماده است!',
          message: `${destination} - ${days.length} روز - ${waypoints.length} نقطه بازدید - با مکان‌های واقعی`,
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
