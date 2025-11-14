/**
 * Trip Creation Workflow (Intelligent Pipeline)
 * 
 * New architecture:
 * - Research destination (cache-first, real data from OSM + AI)
 * - Validate feasibility (budget, dates, reachability)
 * - Generate itinerary (semantic matching + AI synthesis)
 * - Save with real coordinates and waypoints
 * 
 * Reduced to 4 steps, ~10-15s total
 */

import { WorkflowEntrypoint, WorkflowStep, WorkflowEvent } from 'cloudflare:workers';
import { eq } from 'drizzle-orm';
import type { Env } from '../types';
import { publishNotification } from '../utilities/publishNotification';
import { getServerDB } from '@database/server';
import { trips } from '@database/server';

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
          totalSteps: 7,
        status: 'processing',
          data: JSON.stringify({ status: 'research_start', destination }),
        createdAt: new Date().toISOString(),
        }
      }, this.ctx);

      const { researchDestination } = await import('../utilities/destinationResearch');
      const destinationData = await researchDestination(this.env, destination || 'Unknown');
      
      await publishNotification(this.env, 'TRIP_UPDATE', {
        tripUpdates: {
          id: `${tripId}-step-1-complete`,
          tripId,
          type: 'workflow',
          title: 'تحقیق کامل شد',
          message: `${destinationData.attractions.length} جاذبه و ${destinationData.restaurants.length} رستوران پیدا شد`,
          step: 1,
          totalSteps: 7,
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
          totalSteps: 7,
        status: 'processing',
          data: JSON.stringify({ status: 'validation_start' }),
        createdAt: new Date().toISOString(),
        }
      }, this.ctx);

      const { validateTripRequest } = await import('../utilities/tripValidator');
      
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
          totalSteps: 7,
          status: 'processing',
          data: JSON.stringify({ status: 'matching_start' }),
          createdAt: new Date().toISOString(),
        }
      }, this.ctx);

      const { searchAttractionsByPreferences } = await import('../utilities/destinationResearch');
      
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
          totalSteps: 7,
          status: 'processing',
          data: JSON.stringify({ matched: matchedAttractions.length }),
          createdAt: new Date().toISOString(),
        }
      }, this.ctx);

      return { matchedAttractions, duration };
    });

    // ========================================================================
    // STEP 4: AI Enhancement (if needed)
    // ========================================================================
    const enhancedResult = await step.do('Step 4: AI Enhancement', async () => {
      const { matchedAttractions, duration } = matchingResult;
      
      if (matchedAttractions.length >= duration * 2) {
        await publishNotification(this.env, 'TRIP_UPDATE', {
          tripUpdates: {
            id: `${tripId}-step-4-skip`,
            tripId,
            type: 'workflow',
            title: 'داده کافی',
            message: 'اطلاعات کافی از OpenStreetMap - نیازی به تکمیل ندارد',
            step: 4,
            totalSteps: 7,
            status: 'processing',
            data: JSON.stringify({ skipped: true }),
            createdAt: new Date().toISOString(),
          }
        }, this.ctx);
        return { attractions: matchedAttractions };
      }

      await publishNotification(this.env, 'TRIP_UPDATE', {
        tripUpdates: {
          id: `${tripId}-step-4`,
          tripId,
          type: 'workflow',
          title: 'تکمیل با هوش مصنوعی',
          message: 'درخواست پیشنهادات بیشتر از AI برای تکمیل برنامه...',
          step: 4,
          totalSteps: 7,
          status: 'processing',
          data: JSON.stringify({ status: 'ai_enhancement' }),
          createdAt: new Date().toISOString(),
        }
      }, this.ctx);

      // AI enhancement logic (simplified from intelligentTripGenerator)
      try {
        const prompt = `Suggest ${duration * 3} must-visit attractions in ${destination} for ${duration} days.
Preferences: ${preferences}
Budget: ${budget ? `$${budget}` : 'moderate'}

JSON only:
{
  "attractions": [
    {"name": "place name", "type": "historical|museum|park", "description": "brief", "estimatedCost": 0, "duration": 90}
  ]
}`;

        const aiResponse: any = await this.env.AI.run('@cf/meta/llama-3.1-8b-instruct-fp8', {
          prompt,
          max_tokens: 1024,
          temperature: 0.7,
        });

        const text = typeof aiResponse === 'string' ? aiResponse : 
                     aiResponse?.response || aiResponse?.generated_text || '{}';
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        const data = jsonMatch ? JSON.parse(jsonMatch[0]) : { attractions: [] };

        // Geocode AI suggestions
        const { geocodePlaceInDestination } = await import('../utilities/geocode');
        const enhanced = [];

        for (const aiAttr of (data.attractions || []).slice(0, duration * 3)) {
          try {
            const result = await geocodePlaceInDestination(aiAttr.name, destination || 'Unknown');
            if (result) {
              enhanced.push({
                id: `ai-${aiAttr.name.toLowerCase().replace(/\s+/g, '-')}`,
                name: result.label || aiAttr.name,
                type: aiAttr.type || 'entertainment',
                coords: { lat: result.latitude, lon: result.longitude },
                rating: 4.0 + Math.random() * 0.5,
                cost: aiAttr.estimatedCost || 0,
                duration: aiAttr.duration || 90,
                tags: [],
                description: aiAttr.description,
              });
            }
          } catch (err) {
            console.warn('[Workflow] Failed to geocode:', aiAttr.name, err);
          }
        }

        await publishNotification(this.env, 'TRIP_UPDATE', {
          tripUpdates: {
            id: `${tripId}-step-4-complete`,
            tripId,
            type: 'workflow',
            title: 'تکمیل شد',
            message: `${enhanced.length} جاذبه اضافی با AI پیدا و تأیید شد`,
            step: 4,
            totalSteps: 7,
            status: 'processing',
            data: JSON.stringify({ enhanced: enhanced.length }),
            createdAt: new Date().toISOString(),
          }
        }, this.ctx);

        return { attractions: [...matchedAttractions, ...enhanced] };
      } catch (error) {
        console.error('[Workflow] AI enhancement failed:', error);
        return { attractions: matchedAttractions };
      }
    });

    // ========================================================================
    // STEP 5: Generate Day Plans
    // ========================================================================
    const dayPlansResult = await step.do('Step 5: Generate Days', async () => {
      await publishNotification(this.env, 'TRIP_UPDATE', {
        tripUpdates: {
          id: `${tripId}-step-5`,
          tripId,
          type: 'workflow',
          title: 'ساخت برنامه روزانه',
          message: `ایجاد برنامه تفصیلی ${matchingResult.duration} روز با زمان‌بندی واقعی...`,
          step: 5,
          totalSteps: 7,
          status: 'processing',
          data: JSON.stringify({ status: 'day_planning' }),
          createdAt: new Date().toISOString(),
        }
      }, this.ctx);

      // Generate day plans inline (from intelligentTripGenerator logic)
      const { attractions } = enhancedResult;
      const { duration } = matchingResult;
      const days = [];
      
      // Ensure we have at least some attractions
      if (attractions.length === 0) {
        console.warn('[Workflow] No attractions available, creating minimal itinerary');
        // Create minimal days with destination center
        for (let dayNum = 1; dayNum <= duration; dayNum++) {
          const centerCoords = researchResult.destinationData.facts.coordinates;
          const minimalActivities = [
            {
              time: '09:00',
              title: 'City highlights walking tour',
              location: destination || 'City Center',
              coords: centerCoords,
              duration: 120,
              cost: 0,
              type: 'attraction',
              description: 'Morning walk to discover key sights near the center',
            },
            {
              time: '12:30',
              title: 'Lunch: try local cuisine',
              location: destination || 'Local restaurant',
              coords: centerCoords,
              duration: 60,
              cost: 15 * (travelers || 1),
              type: 'food',
              description: 'Sample regional dishes',
            },
            {
              time: '15:00',
              title: 'Afternoon exploration',
              location: destination || 'Scenic area',
              coords: centerCoords,
              duration: 90,
              cost: 0,
              type: 'attraction',
              description: 'Relaxed afternoon exploring parks and plazas',
            },
            {
              time: '19:00',
              title: 'Dinner: local specialties',
              location: destination || 'Local restaurant',
              coords: centerCoords,
              duration: 90,
              cost: 25 * (travelers || 1),
              type: 'food',
              description: 'Evening dining with regional flavors',
            },
          ];
          days.push({
            day: dayNum,
            title: `Day ${dayNum} - ${destination || 'City'} Essentials`,
            activities: minimalActivities,
            estimatedCost: minimalActivities.reduce((sum, a) => sum + (a.cost || 0), 0),
          });
        }
      } else {
        const attractionsPerDay = Math.max(2, Math.ceil(attractions.length / duration));

        for (let dayNum = 1; dayNum <= duration; dayNum++) {
          const dayAttractions = attractions.slice(
            (dayNum - 1) * attractionsPerDay,
            dayNum * attractionsPerDay
          );

          const activities = [];
          let currentTime = 9;
          let dailyCost = 0;

          // Ensure we have at least one activity per day
          if (dayAttractions.length === 0 && attractions.length > 0) {
            // Use first attraction as fallback
            dayAttractions.push(attractions[0]);
          }

          // Morning attractions
          const morningCount = Math.min(2, dayAttractions.length);
          for (let i = 0; i < morningCount; i++) {
            const attr = dayAttractions[i];
            activities.push({
              time: `${String(Math.floor(currentTime)).padStart(2, '0')}:${String(Math.floor((currentTime % 1) * 60)).padStart(2, '0')}`,
              title: `Visit ${attr.name}`,
              location: attr.name,
              coords: attr.coords,
              duration: attr.duration || 90,
              cost: attr.cost || 0,
              type: 'attraction',
              description: attr.description || `Explore ${attr.type} attraction`,
            });
            dailyCost += attr.cost || 0;
            currentTime += (attr.duration || 90) / 60 + 0.5;
          }

          // Lunch
          if (researchResult.destinationData.restaurants.length > 0) {
            const restaurant = researchResult.destinationData.restaurants[dayNum % researchResult.destinationData.restaurants.length];
            const lunchCost = validationResult.validation.metadata.costLevel === 'budget' ? 10 :
                              validationResult.validation.metadata.costLevel === 'mid' ? 20 : 40;
            activities.push({
              time: `${String(Math.floor(currentTime)).padStart(2, '0')}:${String(Math.floor((currentTime % 1) * 60)).padStart(2, '0')}`,
              title: `Lunch at ${restaurant.name}`,
              location: restaurant.name,
              coords: restaurant.coords,
              duration: 60,
              cost: lunchCost * (travelers || 1),
              type: 'food',
              description: `${restaurant.cuisine} cuisine`,
            });
            dailyCost += lunchCost * (travelers || 1);
            currentTime += 1.5;
          }

          // Afternoon attractions
          const afternoonCount = dayAttractions.length - morningCount;
          for (let i = 0; i < afternoonCount; i++) {
            const attr = dayAttractions[morningCount + i];
            activities.push({
              time: `${String(Math.floor(currentTime)).padStart(2, '0')}:${String(Math.floor((currentTime % 1) * 60)).padStart(2, '0')}`,
              title: `Explore ${attr.name}`,
              location: attr.name,
              coords: attr.coords,
              duration: attr.duration || 60,
              cost: attr.cost || 0,
              type: 'attraction',
              description: attr.description || `Visit ${attr.type} site`,
            });
            dailyCost += attr.cost || 0;
            currentTime += (attr.duration || 60) / 60 + 0.5;
          }

          days.push({
            day: dayNum,
            title: dayNum === 1 ? 'Arrival & Exploration' :
                   dayNum === duration ? 'Final Day' :
                   `Day ${dayNum} Adventures`,
            activities,
            estimatedCost: dailyCost,
          });
        }
      }

      // Extract waypoints
      const waypoints = [];
      let order = 1;
      for (const day of days) {
        for (const activity of day.activities) {
          if (activity.coords && activity.coords.lat !== 0 && activity.coords.lon !== 0) {
            waypoints.push({
              latitude: activity.coords.lat,
              longitude: activity.coords.lon,
              label: activity.location || activity.title,
              order: order++,
            });
          }
        }
      }
      // Deduplicate near-identical waypoints to avoid map clutter (especially in fallback)
      const dedupedWaypoints: { latitude: number; longitude: number; label?: string; order: number }[] = [];
      const seenWp = new Set<string>();
      for (const wp of waypoints) {
        const key = `${wp.latitude.toFixed(3)},${wp.longitude.toFixed(3)}`;
        if (!seenWp.has(key)) {
          seenWp.add(key);
          dedupedWaypoints.push(wp);
        }
      }

      // Validate days have activities
      const validDays = days.filter(d => d.activities && d.activities.length > 0);
      if (validDays.length === 0) {
        console.error('[Workflow] No valid days generated!');
        throw new Error('Failed to generate valid day plans');
      }

      console.log(`[Workflow] Generated ${validDays.length} days with ${dedupedWaypoints.length} waypoints`);
      console.log('[Workflow] Sample day:', JSON.stringify(validDays[0], null, 2));

      await publishNotification(this.env, 'TRIP_UPDATE', {
        tripUpdates: {
          id: `${tripId}-step-5-complete`,
          tripId,
          type: 'workflow',
          title: 'برنامه روزانه آماده شد',
          message: `${validDays.length} روز با ${dedupedWaypoints.length} نقطه بازدید`,
          step: 5,
          totalSteps: 7,
          status: 'processing',
          data: JSON.stringify({ days: validDays.length, waypoints: dedupedWaypoints.length }),
          createdAt: new Date().toISOString(),
        }
      }, this.ctx);

      return { days: validDays, waypoints: dedupedWaypoints };
    });

    // ========================================================================
    // STEP 6: Translation (if needed)
    // ========================================================================
    const translationResult = await step.do('Step 6: Translation', async () => {
      if (!lang || lang === 'en') {
        await publishNotification(this.env, 'TRIP_UPDATE', {
          tripUpdates: {
            id: `${tripId}-step-6-skip`,
            tripId,
            type: 'workflow',
            title: 'ترجمه نیاز نیست',
            message: 'زبان انگلیسی - بدون ترجمه',
            step: 6,
            totalSteps: 7,
            status: 'processing',
            data: JSON.stringify({ skipped: true }),
            createdAt: new Date().toISOString(),
          }
        }, this.ctx);
        return { days: dayPlansResult.days };
      }

      await publishNotification(this.env, 'TRIP_UPDATE', {
        tripUpdates: {
          id: `${tripId}-step-6`,
          tripId,
          type: 'workflow',
          title: 'ترجمه',
          message: `ترجمه برنامه سفر به ${lang}...`,
          step: 6,
          totalSteps: 7,
          status: 'processing',
          data: JSON.stringify({ status: 'translating', lang }),
          createdAt: new Date().toISOString(),
        }
      }, this.ctx);

      const { TripAI } = await import('../utilities/ai');
      const ai = new TripAI(this.env);

      const translatedDays = await Promise.all(
        dayPlansResult.days.map(async (day: any) => {
          const translatedActivities = await Promise.all(
            day.activities.map(async (activity: any) => ({
              ...activity,
              title: await ai.translateText(activity.title, lang).catch(() => activity.title),
              description: activity.description 
                ? await ai.translateText(activity.description, lang).catch(() => activity.description)
                : undefined,
            }))
          );
          return {
            ...day,
            title: await ai.translateText(day.title, lang).catch(() => day.title),
            activities: translatedActivities,
          };
        })
      );

      await publishNotification(this.env, 'TRIP_UPDATE', {
        tripUpdates: {
          id: `${tripId}-step-6-complete`,
          tripId,
          type: 'workflow',
          title: 'ترجمه کامل شد',
          message: 'برنامه سفر به زبان شما ترجمه شد',
          step: 6,
          totalSteps: 7,
          status: 'processing',
          data: JSON.stringify({ translated: true }),
          createdAt: new Date().toISOString(),
        }
      }, this.ctx);

      return { days: translatedDays };
    });

    // ========================================================================
    // STEP 7: Final Save
    // ========================================================================
    await step.do('Step 7: Save', async () => {
      const db = getServerDB(this.env.DB);
      
      const { days } = translationResult;
      const { waypoints } = dayPlansResult;
      
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
      const normalizedDays = (days as any[]).map((d: any) => ({
        day: d.day,
        title: d.title,
        activities: (Array.isArray(d.activities) ? d.activities : []).map((a: any) => {
          if (typeof a === 'string') return a;
          const parts: string[] = [];
          if (a?.time) parts.push(String(a.time));
          if (a?.title) parts.push(String(a.title));
          if (a?.location) parts.push(`@ ${String(a.location)}`);
          return parts.length > 0 ? parts.join(' - ') : 'Activity';
        }),
      }));
      
      const updateData: any = {
        title: `${matchingResult.duration}-Day ${destination} Adventure`,
        destination: destination || 'Unknown',
        aiReasoning: `Personalized ${matchingResult.duration}-day trip with ${enhancedResult.attractions.length} attractions`,
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
          attractionsCount: enhancedResult.attractions.length,
          waypointsCount: waypoints.length,
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
          step: 7,
          totalSteps: 7,
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
