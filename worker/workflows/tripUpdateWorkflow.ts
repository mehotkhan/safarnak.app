/**
 * Trip Update Workflow
 * Executes a workflow when a trip is updated via AI chat and sends notifications via WebSocket
 */

import { WorkflowEntrypoint, WorkflowStep, WorkflowEvent } from 'cloudflare:workers';
import { eq } from 'drizzle-orm';
import type { Env } from '../types';
import { publishNotification } from '../utilities/publishNotification';
import { getServerDB } from '@database/server';
import { trips } from '@database/server';
import { researchDestination, searchAttractionsByPreferences } from '../utilities/destinationResearch';
import { validateTripRequest } from '../utilities/tripValidator';
import { geocodeDestinationCenter, geocodePlaceInDestination } from '../utilities/geocode';
import { TripAI } from '../utilities/ai';

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

    // Step 1: Acknowledge user request
    await step.do('Step 1: Acknowledge user request', async () => {
      const tripUpdate = {
        id: `${tripId}-update-step-1`,
        tripId,
        type: 'workflow',
        title: 'در حال پردازش درخواست شما',
        message: `در حال بررسی درخواست شما: "${userMessage.substring(0, 50)}${userMessage.length > 50 ? '...' : ''}"`,
        step: 1,
        totalSteps: 3,
        status: 'processing',
        data: JSON.stringify({ status: 'acknowledged', userMessage }),
        createdAt: new Date().toISOString(),
      };

      await publishNotification(this.env, 'TRIP_UPDATE', { tripUpdates: tripUpdate }, this.ctx);

      return { status: 'acknowledged' };
    });

    // Wait 1 second
    await step.sleep('Wait 1 second', '1 second');

    // Step 2: Persist feedback and load current trip context
    const ctxResult = await step.do('Step 2: Persist feedback', async () => {
      const tripUpdate = {
        id: `${tripId}-update-step-2`,
        tripId,
        type: 'workflow',
        title: 'ثبت بازخورد شما',
        message: 'در حال ذخیره و آماده‌سازی داده‌ها برای بازطراحی برنامه...',
        step: 2,
        totalSteps: 7,
        status: 'processing',
        data: JSON.stringify({ status: 'feedback_saved', userMessage }),
        createdAt: new Date().toISOString(),
      };

      await publishNotification(this.env, 'TRIP_UPDATE', { tripUpdates: tripUpdate }, this.ctx);

      // Fetch current trip and persist feedback in metadata
      const db = getServerDB(this.env.DB);
      const currentTrip = await db.select().from(trips).where(eq(trips.id, tripId)).get();
      
      if (!currentTrip) {
        throw new Error('Trip not found');
      }

      // Merge feedback into metadata
      let metadataPayload: Record<string, any> = {};
      if (currentTrip.metadata) {
        try { metadataPayload = JSON.parse(currentTrip.metadata) || {}; } catch { /* ignore */ }
      }
      const feedbackArray = Array.isArray(metadataPayload.feedback) ? metadataPayload.feedback : [];
      feedbackArray.push({
        message: userMessage,
        at: new Date().toISOString(),
      });
      metadataPayload.feedback = feedbackArray;
      await db.update(trips).set({ metadata: JSON.stringify(metadataPayload) }).where(eq(trips.id, tripId)).run();

      // Parse current itinerary
      let currentItinerary: any[] = [];
      try { currentItinerary = currentTrip.itinerary ? JSON.parse(currentTrip.itinerary) : []; } catch { /* ignore */ }

      const userLocation = extractUserLocation(currentTrip.metadata, currentTrip.preferences);
      return { currentTrip, currentItinerary, userLocation };
    });

    // Step 3: Research (cache-first)
    const researchResult = await step.do('Step 3: Research', async () => {
      const destination = ctxResult.currentTrip.destination || 'Unknown';
      await publishNotification(this.env, 'TRIP_UPDATE', { tripUpdates: {
        id: `${tripId}-update-step-3`,
        tripId,
        type: 'workflow',
        title: 'تحقیق مجدد مقصد',
        message: `در حال به‌روزرسانی اطلاعات مقصد: ${destination} ...`,
        step: 3, totalSteps: 7, status: 'processing',
        data: JSON.stringify({ status: 'research', destination }),
        createdAt: new Date().toISOString(),
      }}, this.ctx);
      const destinationData = await researchDestination(this.env, destination);
      return { destinationData };
    });

    // Step 4: Validate (non-blocking)
    const validationResult = await step.do('Step 4: Validate', async () => {
      const destination = ctxResult.currentTrip.destination || 'Unknown';
      const duration = Array.isArray(ctxResult.currentItinerary) && ctxResult.currentItinerary.length > 0
        ? ctxResult.currentItinerary.length
        : 7;
      const validation = await validateTripRequest(this.env, {
        destination,
        duration,
        budget: ctxResult.currentTrip.budget ?? undefined,
        travelers: ctxResult.currentTrip.travelers ?? 1,
        preferences: (ctxResult.currentTrip.preferences || '') + ' ' + userMessage,
        userLocation: ctxResult.userLocation,
      }, researchResult.destinationData);
      if (validation.warnings?.length) {
        await publishNotification(this.env, 'TRIP_UPDATE', { tripUpdates: {
          id: `${tripId}-update-step-4-warn`,
          tripId, type: 'workflow',
          title: 'هشدار اعتبارسنجی',
          message: validation.warnings.join(' • '),
          step: 4, totalSteps: 7, status: 'processing',
          data: JSON.stringify({ warnings: validation.warnings }),
          createdAt: new Date().toISOString(),
        }}, this.ctx);
      }
      return { validation };
    });

    // Step 5: Match + AI Enhancement
    const attractionsResult = await step.do('Step 5: Match & Enhance', async () => {
      const destination = ctxResult.currentTrip.destination || 'Unknown';
      const duration = Array.isArray(ctxResult.currentItinerary) && ctxResult.currentItinerary.length > 0
        ? ctxResult.currentItinerary.length
        : 7;
      let matched = await searchAttractionsByPreferences(this.env, destination, (ctxResult.currentTrip.preferences || '') + ' ' + userMessage, duration * 4);
      if (matched.length < duration * 2) {
        // AI enhancement: ask for more and geocode
        const ai = new TripAI(this.env);
        const prompt = `Suggest ${duration * 3} must-visit attractions in ${destination} with JSON list (name,type,description,duration,cost).`;
        try {
          const resp: any = await (ai as any).runAI?.('text_generation', prompt) || {};
          const text = resp?.response || resp?.generated_text || '';
          const m = text.match(/\{[\s\S]*\}/);
          const data = m ? JSON.parse(m[0]) : { attractions: [] };
          const enhanced: any[] = [];
          for (const a of (data.attractions || []).slice(0, duration * 3)) {
            const g = await geocodePlaceInDestination(a.name, destination);
            if (g) {
              enhanced.push({
                id: `ai-${a.name.toLowerCase().replace(/\s+/g, '-')}`,
                name: g.label || a.name,
                type: a.type || 'entertainment',
                coords: { lat: g.latitude, lon: g.longitude },
                rating: 4.2,
                cost: a.estimatedCost || 0,
                duration: a.duration || 90,
                tags: [],
                description: a.description,
              });
            }
          }
          matched = [...matched, ...enhanced];
        } catch (_e) {
          // ignore enhancement failure
        }
      }
      return { attractions: matched };
    });

    // Step 6: Generate Day Plans (with restaurants)
    const dayPlansResult = await step.do('Step 6: Generate Days', async () => {
      const destination = ctxResult.currentTrip.destination || 'Unknown';
      const duration = attractionsResult.attractions.length > 0
        ? Math.max(1, Math.ceil(attractionsResult.attractions.length / 3))
        : (Array.isArray(ctxResult.currentItinerary) && ctxResult.currentItinerary.length > 0 ? ctxResult.currentItinerary.length : 7);
      const restaurants = researchResult.destinationData.restaurants || [];
      const days: any[] = [];
      if (attractionsResult.attractions.length === 0) {
        const center = await geocodeDestinationCenter(destination) || { latitude: 0, longitude: 0 };
        for (let dayNum = 1; dayNum <= duration; dayNum++) {
          days.push({
            day: dayNum,
            title: `Day ${dayNum} - ${destination} Essentials`,
            activities: [
              { time: '09:00', title: 'City highlights walking tour', location: destination, coords: { lat: center.latitude, lon: center.longitude }, duration: 120, cost: 0, type: 'attraction' },
              { time: '12:30', title: 'Lunch: try local cuisine', location: destination, coords: { lat: center.latitude, lon: center.longitude }, duration: 60, cost: 15 * (ctxResult.currentTrip.travelers || 1), type: 'food' },
              { time: '15:00', title: 'Afternoon exploration', location: destination, coords: { lat: center.latitude, lon: center.longitude }, duration: 90, cost: 0, type: 'attraction' },
              { time: '19:00', title: 'Dinner: local specialties', location: destination, coords: { lat: center.latitude, lon: center.longitude }, duration: 90, cost: 25 * (ctxResult.currentTrip.travelers || 1), type: 'food' },
            ],
            estimatedCost: 40 * (ctxResult.currentTrip.travelers || 1),
          });
        }
      } else {
        const perDay = Math.max(2, Math.ceil(attractionsResult.attractions.length / duration));
        for (let dayNum = 1; dayNum <= duration; dayNum++) {
          const slice = attractionsResult.attractions.slice((dayNum - 1) * perDay, dayNum * perDay);
          const activities: any[] = [];
          let currentTime = 9;
          let cost = 0;
          const morningCount = Math.min(2, slice.length || 1);
          for (let i = 0; i < morningCount; i++) {
            const a = slice[i] || attractionsResult.attractions[0];
            activities.push({ time: `${String(Math.floor(currentTime)).padStart(2,'0')}:00`, title: `Visit ${a.name}`, location: a.name, coords: a.coords, duration: a.duration || 90, cost: a.cost || 0, type: 'attraction' });
            cost += a.cost || 0; currentTime += (a.duration || 90) / 60 + 0.5;
          }
          if (restaurants.length > 0) {
            const r = restaurants[dayNum % restaurants.length];
            const lunch = validationResult.validation.metadata.costLevel === 'budget' ? 10 : validationResult.validation.metadata.costLevel === 'mid' ? 20 : 40;
            activities.push({ time: `${String(Math.floor(currentTime)).padStart(2,'0')}:30`, title: `Lunch at ${r.name}`, location: r.name, coords: r.coords, duration: 60, cost: lunch * (ctxResult.currentTrip.travelers || 1), type: 'food' });
            cost += lunch * (ctxResult.currentTrip.travelers || 1); currentTime += 1.5;
          }
          for (let i = morningCount; i < slice.length; i++) {
            const a = slice[i];
            activities.push({ time: `${String(Math.floor(currentTime)).padStart(2,'0')}:00`, title: `Explore ${a.name}`, location: a.name, coords: a.coords, duration: a.duration || 60, cost: a.cost || 0, type: 'attraction' });
            cost += a.cost || 0; currentTime += (a.duration || 60) / 60 + 0.5;
          }
          days.push({ day: dayNum, title: dayNum === 1 ? 'Arrival & Exploration' : dayNum === duration ? 'Final Day' : `Day ${dayNum} Adventures`, activities, estimatedCost: cost });
        }
      }
      // Waypoints + dedupe
      const rawWps: any[] = [];
      let order = 1;
      for (const d of days) for (const act of d.activities) {
        if (act?.coords?.lat && act?.coords?.lon) rawWps.push({ latitude: act.coords.lat, longitude: act.coords.lon, label: act.location || act.title, order: order++ });
      }
      const deduped: any[] = []; const seen = new Set<string>();
      for (const w of rawWps) { const k = `${w.latitude.toFixed(3)},${w.longitude.toFixed(3)}`; if (!seen.has(k)) { seen.add(k); deduped.push(w);} }
      return { days, waypoints: deduped };
    });

    // Step 7: Translate & Save
    await step.do('Step 7: Translate & Save', async () => {
      const db = getServerDB(this.env.DB);

      const destination = ctxResult.currentTrip.destination || 'Unknown';

      // Optional translation (titles + activities) then normalize to strings
      let days = dayPlansResult.days;
      if (lang && typeof lang === 'string' && lang.trim()) {
        try {
          const ai = new TripAI(this.env);
          days = await Promise.all(days.map(async (day: any) => {
            const translatedActivities = await Promise.all(day.activities.map(async (a: any) => ({
              ...a,
              title: await ai.translateText(a.title, lang).catch(() => a.title),
              description: a.description ? await ai.translateText(a.description, lang).catch(() => a.description) : undefined,
            })));
            return { ...day, title: await ai.translateText(day.title, lang).catch(() => day.title), activities: translatedActivities };
          }));
        } catch { /* ignore translation failure */ }
      }
      const normalizedDays = (days as any[]).map((d: any) => ({
        day: d.day,
        title: d.title,
        activities: (Array.isArray(d.activities) ? d.activities : []).map((a: any) => {
          if (typeof a === 'string') return a;
          const parts: string[] = [];
          if (a?.time) parts.push(String(a.time));
          if (a?.title) parts.push(String(a.title));
          if (a?.location) parts.push(`@ ${String(a.location)}`);
          return parts.length ? parts.join(' - ') : 'Activity';
        }),
      }));

      // Coordinates fallback
      const center = await geocodeDestinationCenter(destination) || { latitude: 0, longitude: 0 };

      const updateData: any = {
        destination,
        budget: ctxResult.currentTrip.budget,
        travelers: ctxResult.currentTrip.travelers,
        preferences: ctxResult.currentTrip.preferences,
        aiReasoning: `User feedback applied: ${userMessage.substring(0, 120)}`,
        itinerary: JSON.stringify(normalizedDays),
        coordinates: JSON.stringify(center),
        waypoints: JSON.stringify(dayPlansResult.waypoints),
        status: 'ready',
        updatedAt: new Date().toISOString(),
      };

      // Merge metadata
      let meta: Record<string, any> = {};
      if (ctxResult.currentTrip.metadata) { try { meta = JSON.parse(ctxResult.currentTrip.metadata) || {}; } catch (_err) { meta = {}; } }
      if (ctxResult.userLocation) meta.userLocation = ctxResult.userLocation;
      if (lang && typeof lang === 'string' && lang.trim()) meta.language = lang.trim();
      meta.lastUpdateAt = new Date().toISOString();
      meta.lastUpdateRequest = userMessage;
      meta.pipeline = 'edit-7-steps';
      updateData.metadata = JSON.stringify(meta);

      await db
        .update(trips)
        .set(updateData)
        .where(eq(trips.id, tripId))
        .run();

      // Send final trip update
      const tripUpdate = {
        id: `${tripId}-update-step-7`,
        tripId,
        type: 'workflow',
        title: 'سفر به‌روزرسانی شد!',
        message: `بازطراحی برنامه سفر براساس بازخورد شما انجام شد.`,
        step: 7,
        totalSteps: 7,
        status: 'completed',
        data: JSON.stringify({ 
          status: 'completed', 
          days: normalizedDays.length,
          waypoints: dayPlansResult.waypoints.length,
        }),
        createdAt: new Date().toISOString(),
      };

      await publishNotification(this.env, 'TRIP_UPDATE', { tripUpdates: tripUpdate }, this.ctx);

      return { status: 'completed' };
    });
  }
}

