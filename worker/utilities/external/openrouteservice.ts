/**
 * OpenRouteService API Client
 * OSM-based routing, directions, and isochrones
 * 
 * Docs: https://openrouteservice.org/dev/#/api-docs
 * Free tier: 2000 requests/day
 */

import type { Env } from '../../types';
import { httpPostJson } from './http';

const ORS_BASE = 'https://api.openrouteservice.org';

/**
 * Transport profile options
 */
export type OrsProfile = 
  | 'driving-car' 
  | 'driving-hgv' 
  | 'cycling-regular' 
  | 'cycling-road'
  | 'cycling-mountain'
  | 'foot-walking' 
  | 'foot-hiking'
  | 'wheelchair';

/**
 * Route summary from ORS
 */
export interface OrsRouteSummary {
  distance: number; // meters
  duration: number; // seconds
}

/**
 * Full route segment
 */
export interface OrsRoute {
  summary: OrsRouteSummary;
  geometry?: string; // Encoded polyline
  bbox?: number[];
  segments?: Array<{
    distance: number;
    duration: number;
    steps?: Array<{
      distance: number;
      duration: number;
      type: number;
      instruction: string;
      name: string;
    }>;
  }>;
}

/**
 * ORS directions response
 */
export interface OrsDirectionsResponse {
  routes: OrsRoute[];
  bbox?: number[];
  metadata?: {
    attribution: string;
    service: string;
    timestamp: number;
  };
}

/**
 * Isochrone feature
 */
export interface OrsIsochrone {
  type: 'Feature';
  properties: {
    group_index: number;
    value: number; // time in seconds or distance in meters
    center: [number, number]; // lon, lat
  };
  geometry: {
    type: 'Polygon';
    coordinates: number[][][];
  };
}

/**
 * ORS isochrones response
 */
export interface OrsIsochronesResponse {
  type: 'FeatureCollection';
  features: OrsIsochrone[];
  bbox?: number[];
}

/**
 * Get route/directions between multiple points
 * @param coordinates - Array of [longitude, latitude] pairs
 * @param profile - Transport mode (default: foot-walking)
 */
export async function getRoute(
  env: Env,
  coordinates: [number, number][],
  profile: OrsProfile = 'foot-walking'
): Promise<OrsDirectionsResponse | null> {
  if (coordinates.length < 2) {
    console.warn('[ORS] Need at least 2 coordinates for routing');
    return null;
  }

  const url = `${ORS_BASE}/v2/directions/${profile}`;

  try {
    return await httpPostJson<OrsDirectionsResponse>(
      url,
      { coordinates },
      { Authorization: env.ORS_API_KEY }
    );
  } catch (err) {
    console.warn('[ORS] Get route failed:', err);
    return null;
  }
}

/**
 * Get simple route summary (distance and duration only)
 */
export async function getRouteSummary(
  env: Env,
  from: { lat: number; lon: number },
  to: { lat: number; lon: number },
  profile: OrsProfile = 'foot-walking'
): Promise<OrsRouteSummary | null> {
  const response = await getRoute(
    env,
    [[from.lon, from.lat], [to.lon, to.lat]],
    profile
  );

  if (!response?.routes?.[0]?.summary) {
    return null;
  }

  return response.routes[0].summary;
}

/**
 * Get travel time between two points in minutes
 */
export async function getTravelTimeMinutes(
  env: Env,
  from: { lat: number; lon: number },
  to: { lat: number; lon: number },
  profile: OrsProfile = 'foot-walking'
): Promise<number | null> {
  const summary = await getRouteSummary(env, from, to, profile);
  if (!summary) return null;
  return Math.round(summary.duration / 60);
}

/**
 * Get isochrones (reachable area within time/distance)
 * @param center - Center point [longitude, latitude]
 * @param range - Time in seconds or distance in meters
 * @param rangeType - 'time' or 'distance'
 */
export async function getIsochrones(
  env: Env,
  center: [number, number],
  range: number[],
  rangeType: 'time' | 'distance' = 'time',
  profile: OrsProfile = 'foot-walking'
): Promise<OrsIsochronesResponse | null> {
  const url = `${ORS_BASE}/v2/isochrones/${profile}`;

  try {
    return await httpPostJson<OrsIsochronesResponse>(
      url,
      {
        locations: [center],
        range,
        range_type: rangeType,
      },
      { Authorization: env.ORS_API_KEY }
    );
  } catch (err) {
    console.warn('[ORS] Get isochrones failed:', err);
    return null;
  }
}

/**
 * Calculate total route for a day's activities
 * Returns total distance (km) and duration (minutes)
 */
export async function calculateDayRoute(
  env: Env,
  activities: Array<{ lat: number; lon: number }>,
  profile: OrsProfile = 'foot-walking'
): Promise<{ distanceKm: number; durationMinutes: number } | null> {
  if (activities.length < 2) {
    return { distanceKm: 0, durationMinutes: 0 };
  }

  const coordinates: [number, number][] = activities.map(a => [a.lon, a.lat]);
  const response = await getRoute(env, coordinates, profile);

  if (!response?.routes?.[0]?.summary) {
    return null;
  }

  const { distance, duration } = response.routes[0].summary;
  return {
    distanceKm: Math.round(distance / 100) / 10, // Round to 1 decimal
    durationMinutes: Math.round(duration / 60),
  };
}

/**
 * Matrix API - get travel times between multiple points
 * Useful for optimizing itinerary order
 */
export async function getMatrix(
  env: Env,
  locations: [number, number][],
  profile: OrsProfile = 'foot-walking',
  metrics: ('duration' | 'distance')[] = ['duration']
): Promise<{
  durations?: number[][];
  distances?: number[][];
} | null> {
  const url = `${ORS_BASE}/v2/matrix/${profile}`;

  try {
    return await httpPostJson(
      url,
      {
        locations,
        metrics,
      },
      { Authorization: env.ORS_API_KEY }
    );
  } catch (err) {
    console.warn('[ORS] Get matrix failed:', err);
    return null;
  }
}

