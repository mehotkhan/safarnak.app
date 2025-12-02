import type { RichDay, DbDay, Waypoint, ActivityObject } from './types';
import type { Env } from '../../types';
import { geocodePlaceInDestination } from '../destination/geo';
import { sleep } from '../destination/geo';
import { translateItineraryIfNeeded } from '../ai/translate';

// ============================================================================
// TYPES FOR SHARED FINALIZATION PIPELINE
// ============================================================================

/**
 * Parameters for the shared finalization pipeline
 * Used by both TripCreationWorkflow and TripUpdateWorkflow
 */
export interface FinalizeItineraryParams {
  env: Env;
  lang?: string;
  destination: string;
  destinationCenter: { latitude: number; longitude: number };
  days: RichDay[];
  title?: string;
  aiReasoning?: string;
}

/**
 * Result of the finalization pipeline
 * Contains all data needed for database save
 */
export interface FinalizeItineraryResult {
  richDays: RichDay[];
  dbDays: DbDay[];
  waypoints: Waypoint[];
  title: string;
  aiReasoning: string;
}

// ============================================================================
// SHARED FINALIZATION PIPELINE
// ============================================================================

/**
 * Unified finalization pipeline for both create and update workflows
 * 
 * Pipeline:
 * 1. Build base days for translation (text-only structure)
 * 2. Translate if needed (title + aiReasoning + days)
 * 3. Merge translated text back into full RichDay[]
 * 4. Enrich with coordinates AFTER translation (names are final)
 * 5. Extract waypoints and normalize for DB
 * 
 * @param params - Finalization parameters
 * @returns FinalizeItineraryResult with all data for database save
 */
export async function finalizeItineraryForSave(
  params: FinalizeItineraryParams
): Promise<FinalizeItineraryResult> {
  const { env, lang, destination, destinationCenter, days, title, aiReasoning } = params;

  const t0 = Date.now();
  console.log(`[FinalizeItinerary] Starting finalization for ${destination}, lang=${lang || 'en'}, days=${days.length}`);

  // 1) Build base days for translation (text-only / minimal structure)
  const baseDays = buildBaseDaysForTranslation(days);
  console.log(`[FinalizeItinerary] Built ${baseDays.length} base days for translation in ${Date.now() - t0}ms`);

  // 2) Translate (or skip if lang is 'en' or undefined)
  let translated: { days?: any[]; title?: string; aiReasoning?: string } = {
    days: baseDays,
    title,
    aiReasoning,
  };

  if (lang && lang !== 'en') {
    const t1 = Date.now();
    const translationInput = {
      title,
      aiReasoning,
      days: baseDays,
    };
    translated = await translateItineraryIfNeeded(env, translationInput, lang);
    console.log(`[FinalizeItinerary] Translation completed in ${Date.now() - t1}ms`);
  }

  // 3) Merge translated text back into full RichDay[]
  // Preserve coordinates, tags, ids, and other metadata from original days
  const mergedRichDays: RichDay[] = days.map((rawDay, i) => {
    const translatedDay = translated.days?.[i];
    
    const mergedActivities: Array<string | ActivityObject> = (rawDay.activities || []).map((act, j) => {
      const translatedAct = translatedDay?.activities?.[j];
      
      // If activity is a string, use translated version or original
      if (typeof act === 'string') {
        return typeof translatedAct === 'string' ? translatedAct : act;
      }
      
      // If activity is an object, merge translated text while preserving coords/metadata
      if (typeof act === 'object') {
        const translatedTitle = typeof translatedAct === 'string' 
          ? translatedAct 
          : (translatedAct?.title ?? act.title);
        const translatedDescription = typeof translatedAct === 'object'
          ? (translatedAct?.description ?? act.description)
          : act.description;
          
        return {
          ...act,
          title: translatedTitle,
          description: translatedDescription,
          // Preserve coordinates, location, time, type, etc.
        };
      }
      
      return act;
    });

    return {
      ...rawDay,
      title: translatedDay?.title ?? rawDay.title,
      activities: mergedActivities,
    };
  });

  console.log(`[FinalizeItinerary] Merged ${mergedRichDays.length} days with translations`);

  // 4) Enrich with coordinates AFTER translation (names are final now)
  const t2 = Date.now();
  const enrichedDays = await enrichActivitiesWithCoordinates(env, mergedRichDays, destination);
  console.log(`[FinalizeItinerary] Enriched activities with coordinates in ${Date.now() - t2}ms`);

  // 5) Extract waypoints and normalize for DB
  const waypoints = extractWaypointsFromDays(enrichedDays, destinationCenter, destination);
  const dbDays = normalizeDaysForDb(enrichedDays);

  console.log(`[FinalizeItinerary] Complete: ${enrichedDays.length} days, ${waypoints.length} waypoints, total time: ${Date.now() - t0}ms`);

  return {
    richDays: enrichedDays,
    dbDays,
    waypoints,
    title: translated.title ?? title ?? `Trip to ${destination}`,
    aiReasoning: translated.aiReasoning ?? aiReasoning ?? '',
  };
}

/**
 * Normalize raw AI itinerary days to RichDay[] format
 * Handles multiple AI output shapes: activities, plan, items, or array of activities
 * This is the "adapter" between "whatever the model returns" and RichDay[]
 */
export function normalizeRawDaysToRich(rawDays: any): RichDay[] {
  if (!Array.isArray(rawDays)) return [];

  return rawDays.map((d: any, index: number) => {
    const dayNumber = d?.day ?? index + 1;
    const title = d?.title ?? `Day ${dayNumber}`;

    let activities: any[] = [];

    // Most common case (what update AI already uses)
    if (Array.isArray(d?.activities)) {
      activities = d.activities;
    }
    // Some models use "plan"
    else if (Array.isArray(d?.plan)) {
      activities = d.plan;
    }
    // Or "items"
    else if (Array.isArray(d?.items)) {
      activities = d.items;
    }
    // Or even the day object itself is just an array of activities
    else if (Array.isArray(d)) {
      activities = d;
    }
    // Otherwise: no activities

    return {
      day: dayNumber,
      title,
      activities,
      estimatedCost: d?.estimatedCost ?? 0,
    };
  });
}

/**
 * Calculate inclusive trip duration in days from start and end dates
 * Returns a value between 1 and 30
 */
export function calculateDurationFromDates(startDate?: string, endDate?: string): number {
  if (!startDate || !endDate) return 7;
  try {
    const s = new Date(startDate);
    const e = new Date(endDate);
    const diff = Math.abs(e.getTime() - s.getTime());
    // inclusive days (e.g., 1–3 = 3 days)
    return Math.max(1, Math.min(30, Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1));
  } catch {
    return 7;
  }
}

/**
 * Build canonical "base days for translation"
 * Converts RichDay[] to a format suitable for translation (activities as strings)
 * This is what you translate in both workflows
 */
export function buildBaseDaysForTranslation(days: RichDay[]): RichDay[] {
  return days.map((d) => ({
    day: d.day,
    title: d.title,
    activities: (d.activities || []).map((a) => {
      if (typeof a === 'string') return a;

      if (a?.title && typeof a.title === 'string') {
        return a.title;
      }

      const parts: string[] = [];
      if (a.time) parts.push(String(a.time));
      if (a.title) parts.push(String(a.title));
      if (a.location) parts.push(`@ ${String(a.location)}`);
      return parts.length > 0 ? parts.join(' - ') : 'Activity';
    }),
    estimatedCost: d.estimatedCost,
  }));
}

/**
 * Normalize RichDay[] to DbDay[] format for database storage
 * Converts activities to string[] format
 */
export function normalizeDaysForDb(days: RichDay[]): DbDay[] {
  return days.map((d) => ({
    day: d.day || 1,
    title: d.title || `Day ${d.day || 1}`,
    activities: (d.activities || []).map((a) => {
      if (typeof a === 'string') return a;

      const parts: string[] = [];
      if (a.time) parts.push(String(a.time));
      if (a.title) parts.push(String(a.title));
      if (a.location) parts.push(`@ ${String(a.location)}`);
      return parts.length ? parts.join(' - ') : 'Activity';
    }),
  }));
}

/**
 * Extract waypoints from RichDay[] activities
 * Looks for coords in activity objects and creates waypoints
 * Falls back to center if no waypoints found
 */
export function extractWaypointsFromDays(
  days: RichDay[],
  fallbackCenter: { latitude: number; longitude: number },
  defaultLabel: string
): Waypoint[] {
  const waypoints: Waypoint[] = [];
  let order = 1;

  for (const day of days) {
    for (const activity of day.activities || []) {
      if (typeof activity === 'object' && activity.coords) {
        const c = activity.coords as any;
        const lat = c.lat ?? c.latitude;
        const lon = c.lon ?? c.longitude;
        if (typeof lat === 'number' && typeof lon === 'number') {
          waypoints.push({
            latitude: lat,
            longitude: lon,
            label: activity.location || activity.title || defaultLabel,
            order: order++,
          });
        }
      }
    }
  }

  if (!waypoints.length) {
    waypoints.push({
      latitude: fallbackCenter.latitude,
      longitude: fallbackCenter.longitude,
      label: defaultLabel,
      order: 1,
    });
  }

  return waypoints;
}

/**
 * Parse place name from activity string
 * Handles formats like:
 * - "09:00: Visit [PLACE NAME] - address"
 * - "12:30: Lunch at [RESTAURANT NAME]"
 * - "15:00: Explore [DISTRICT/STREET]"
 * - "09:00 - Visit Museum of Art"
 */
function parsePlaceNameFromActivity(activity: string): string | null {
  if (typeof activity !== 'string') return null;
  
  // Try to extract place name from common patterns
  // Pattern 1: "TIME: Visit [PLACE] - address" or "TIME: Visit PLACE - address"
  const visitMatch = activity.match(/(?:visit|explore|see|tour|check out)\s+(?:\[)?([^-\]]+?)(?:\])?(?:\s*-\s*|$)/i);
  if (visitMatch && visitMatch[1]) {
    return visitMatch[1].trim();
  }
  
  // Pattern 2: "TIME: Lunch/Dinner at [PLACE]" or "TIME: Lunch/Dinner at PLACE"
  const restaurantMatch = activity.match(/(?:lunch|dinner|breakfast|eat|dine)\s+(?:at|in)\s+(?:\[)?([^-\]]+?)(?:\])?(?:\s*-\s*|$)/i);
  if (restaurantMatch && restaurantMatch[1]) {
    return restaurantMatch[1].trim();
  }
  
  // Pattern 3: "TIME - Activity @ PLACE" or "TIME - Activity @ [PLACE]"
  const atMatch = activity.match(/@\s*(?:\[)?([^-\]]+?)(?:\])?(?:\s*-\s*|$)/i);
  if (atMatch && atMatch[1]) {
    return atMatch[1].trim();
  }
  
  // Pattern 4: Extract text after time and before dash (if present)
  // "09:00 - Place Name" or "09:00: Place Name"
  const timeMatch = activity.match(/^\d{1,2}:\d{2}[\s:]+(.+?)(?:\s*-\s*|$)/i);
  if (timeMatch && timeMatch[1]) {
    const text = timeMatch[1].trim();
    // Remove common prefixes
    const cleaned = text.replace(/^(?:visit|explore|see|tour|check out|go to|lunch at|dinner at|breakfast at|eat at|dine at)\s+/i, '');
    if (cleaned && cleaned.length > 2) {
      return cleaned;
    }
  }
  
  return null;
}

/**
 * Enrich activities with coordinates by parsing place names and geocoding them
 * Converts string activities to objects with coords when place names are found
 * Rate-limited to avoid overwhelming geocoding API
 */
export async function enrichActivitiesWithCoordinates(
  env: Env,
  days: RichDay[],
  destination: string
): Promise<RichDay[]> {
  if (!destination) return days;
  
  const enrichedDays: RichDay[] = [];
  const geocodeCache = new Map<string, { latitude: number; longitude: number; label: string } | null>();
  
  for (const day of days) {
    const enrichedActivities: Array<string | import('./types').ActivityObject> = [];
    
    for (const activity of day.activities || []) {
      // If already an object with coords, keep it
      if (typeof activity === 'object' && activity.coords) {
        enrichedActivities.push(activity);
        continue;
      }
      
      // If it's already an object without coords, try to extract place name from title/location
      if (typeof activity === 'object') {
        const placeName = activity.location || activity.title;
        if (placeName && typeof placeName === 'string') {
          // Check cache first
          let coords = geocodeCache.get(placeName);
          if (coords === undefined) {
            coords = await geocodePlaceInDestination(placeName, destination);
            geocodeCache.set(placeName, coords);
            // Rate limit: small delay between geocoding requests
            await sleep(100);
          }
          
          if (coords) {
            enrichedActivities.push({
              ...activity,
              coords: { latitude: coords.latitude, longitude: coords.longitude },
              location: coords.label || activity.location || activity.title,
            });
          } else {
            enrichedActivities.push(activity);
          }
        } else {
          enrichedActivities.push(activity);
        }
        continue;
      }
      
      // If it's a string, try to parse place name and geocode
      if (typeof activity === 'string') {
        const placeName = parsePlaceNameFromActivity(activity);
        
        if (placeName) {
          // Check cache first
          let coords = geocodeCache.get(placeName);
          if (coords === undefined) {
            coords = await geocodePlaceInDestination(placeName, destination);
            geocodeCache.set(placeName, coords);
            // Rate limit: small delay between geocoding requests
            await sleep(100);
          }
          
          if (coords) {
            // Parse time from activity string if present
            const timeMatch = activity.match(/^(\d{1,2}:\d{2})/);
            const time = timeMatch ? timeMatch[1] : undefined;
            
            // Extract title (everything after time)
            const titleMatch = activity.match(/^\d{1,2}:\d{2}[\s:]+(.+)/);
            const title = titleMatch ? titleMatch[1].trim() : activity;
            
            enrichedActivities.push({
              time,
              title,
              location: coords.label || placeName,
              coords: { latitude: coords.latitude, longitude: coords.longitude },
            });
          } else {
            // Couldn't geocode, keep as string
            enrichedActivities.push(activity);
          }
        } else {
          // No place name found, keep as string
          enrichedActivities.push(activity);
        }
      } else {
        // Unknown type, keep as is
        enrichedActivities.push(activity);
      }
    }
    
    enrichedDays.push({
      ...day,
      activities: enrichedActivities,
    });
  }
  
  return enrichedDays;
}

