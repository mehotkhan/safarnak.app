/**
 * Extract waypoints from AI-generated itinerary
 * Uses real place names from the itinerary and geocodes them
 */

import type { Env } from '../types';
import { createTripAI } from '../utilities/ai';

export interface Waypoint {
  latitude: number;
  longitude: number;
  label?: string;
}

/**
 * Extract waypoints from itinerary activities
 * Parses place names from activity descriptions and geocodes them
 */
export async function extractWaypointsFromItinerary(
  env: Env,
  itinerary: any,
  destination: string
): Promise<Waypoint[]> {
  const waypoints: Waypoint[] = [];
  const placeNames = new Set<string>();

  // First, add the main destination center point
  try {
    const ai = createTripAI(env);
    const geoData = await ai.geocodeDestination(destination);
    if (geoData.coordinates.latitude !== 0 && geoData.coordinates.longitude !== 0) {
      waypoints.push({
        latitude: geoData.coordinates.latitude,
        longitude: geoData.coordinates.longitude,
        label: destination,
      });
    }
  } catch (error) {
    console.warn('Failed to geocode destination for waypoints:', error);
  }

  // Extract place names from itinerary activities
  if (Array.isArray(itinerary.days)) {
    for (const day of itinerary.days) {
      if (Array.isArray(day.activities)) {
        for (const activity of day.activities) {
          // Parse place names from activity text
          // Look for patterns like "بازدید از [place]", "رستوران [name]", etc.
          const text = String(activity || '');
          
          // Extract restaurant names (رستوران ...)
          const restaurantMatch = text.match(/رستوران\s+([^-\n]+)/i);
          if (restaurantMatch && restaurantMatch[1]) {
            const name = restaurantMatch[1].trim().replace(/[،,]/g, '').trim();
            if (name && name.length > 2) {
              placeNames.add(name);
            }
          }

          // Extract attraction names (بازدید از ...)
          const visitMatch = text.match(/بازدید از\s+([^-\n]+)/i);
          if (visitMatch && visitMatch[1]) {
            const name = visitMatch[1].trim().replace(/[،,]/g, '').trim();
            if (name && name.length > 2) {
              placeNames.add(name);
            }
          }

          // Extract mosque/museum names (مسجد ..., موزه ...)
          const mosqueMatch = text.match(/(مسجد|موزه|کاخ|پل|بازار|میدان)\s+([^-\n]+)/i);
          if (mosqueMatch && mosqueMatch[2]) {
            const name = `${mosqueMatch[1]} ${mosqueMatch[2]}`.trim().replace(/[،,]/g, '').trim();
            if (name && name.length > 2) {
              placeNames.add(name);
            }
          }

          // Extract any capitalized place names (for non-Persian destinations)
          const capitalizedMatch = text.match(/\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\b/g);
          if (capitalizedMatch) {
            for (const match of capitalizedMatch) {
              // Skip common words
              if (!['Morning', 'Afternoon', 'Evening', 'Night', 'Visit', 'Lunch', 'Dinner'].includes(match)) {
                placeNames.add(match);
              }
            }
          }
        }
      }
    }
  }

  // Geocode extracted place names (limit to top 10 to avoid too many API calls)
  const placeNamesArray = Array.from(placeNames).slice(0, 10);
  const ai = createTripAI(env);

  for (const placeName of placeNamesArray) {
    try {
      // Try geocoding with destination context
      const searchQuery = `${placeName}, ${destination}`;
      const geoData = await ai.geocodeDestination(searchQuery);
      
      if (geoData.coordinates.latitude !== 0 && geoData.coordinates.longitude !== 0) {
        waypoints.push({
          latitude: geoData.coordinates.latitude,
          longitude: geoData.coordinates.longitude,
          label: placeName,
        });
      }
    } catch (error) {
      console.warn(`Failed to geocode place "${placeName}":`, error);
      // Continue with next place
    }
  }

  // If we have no waypoints, use destination center
  if (waypoints.length === 0) {
    try {
      const ai = createTripAI(env);
      const geoData = await ai.geocodeDestination(destination);
      waypoints.push({
        latitude: geoData.coordinates.latitude || 0,
        longitude: geoData.coordinates.longitude || 0,
        label: destination,
      });
    } catch {
      // Fallback to empty
    }
  }

  return waypoints;
}

