import type { RichDay, DbDay, Waypoint } from './types';

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

