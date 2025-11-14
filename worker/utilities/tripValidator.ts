/**
 * Trip Validation Service
 * 
 * Validates trip feasibility before generation:
 * - Destination reachability from user location
 * - Date/duration reasonableness
 * - Budget alignment with destination costs
 * - User preferences achievability
 */

import type { Env } from '../types';
import type { DestinationData } from './destinationResearch';

export interface ValidationResult {
  feasible: boolean;
  confidence: 'high' | 'medium' | 'low';
  warnings: string[];
  adjustments: {
    suggestedDuration?: number;
    suggestedBudget?: number;
    alternativeDestinations?: string[];
  };
  metadata: {
    travelTimeHours?: number;
    costLevel: 'budget' | 'mid' | 'luxury';
    seasonalNote?: string;
  };
}

export interface TripRequest {
  destination: string;
  startDate?: string;
  endDate?: string;
  duration?: number; // days
  budget?: number; // USD
  travelers: number;
  preferences: string;
  userLocation?: string; // "lat,lon" or city name
}

/**
 * Validate trip request feasibility
 */
export async function validateTripRequest(
  env: Env,
  request: TripRequest,
  destinationData: DestinationData
): Promise<ValidationResult> {
  const warnings: string[] = [];
  const adjustments: ValidationResult['adjustments'] = {};
  let confidence: 'high' | 'medium' | 'low' = 'high';
  
  // Calculate duration
  const duration = request.duration || calculateDuration(request.startDate, request.endDate);
  
  // Validate duration
  if (duration < 1) {
    warnings.push('Trip duration is too short (less than 1 day)');
    adjustments.suggestedDuration = 3;
    confidence = 'low';
  } else if (duration > 30) {
    warnings.push('Trip duration is very long (over 30 days) - consider breaking into multiple trips');
    adjustments.suggestedDuration = 14;
    confidence = 'medium';
  }
  
  // Validate budget
  const costLevel = determineCostLevel(request.budget, duration, request.travelers, destinationData);
  const minBudget = destinationData.facts.avgCost[costLevel] * duration * request.travelers;
  
  if (request.budget && request.budget < minBudget * 0.7) {
    warnings.push(`Budget may be insufficient for ${duration} days in ${destinationData.facts.city}`);
    adjustments.suggestedBudget = Math.ceil(minBudget);
    confidence = confidence === 'high' ? 'medium' : 'low';
  }
  
  // Validate seasonal timing
  if (request.startDate) {
    const month = new Date(request.startDate).toLocaleString('en-US', { month: 'short' });
    if (destinationData.facts.bestMonths.length > 0 && 
        !destinationData.facts.bestMonths.includes(month)) {
      warnings.push(`${month} is not the ideal season for ${destinationData.facts.city}`);
      confidence = confidence === 'high' ? 'medium' : confidence;
    }
  }
  
  // Validate destination has enough attractions
  if (destinationData.attractions.length < 3) {
    warnings.push('Limited attraction data available for this destination');
    confidence = 'low';
  }
  
  // Check user location reachability (if provided)
  let travelTimeHours: number | undefined;
  if (request.userLocation) {
    try {
      travelTimeHours = await estimateTravelTime(
        request.userLocation,
        `${destinationData.facts.coordinates.lat},${destinationData.facts.coordinates.lon}`
      );
      
      if (travelTimeHours && travelTimeHours > 24) {
        warnings.push(`Long travel time from your location (~${Math.round(travelTimeHours)}h) - consider adding travel days`);
        if (duration < 5) {
          adjustments.suggestedDuration = duration + 2;
        }
      }
    } catch (error) {
      console.warn('[Validator] Failed to estimate travel time:', error);
    }
  }
  
  // Determine if feasible
  const feasible = warnings.length === 0 || confidence !== 'low';
  
  return {
    feasible,
    confidence,
    warnings,
    adjustments,
    metadata: {
      travelTimeHours,
      costLevel,
      seasonalNote: destinationData.facts.climate,
    },
  };
}

/**
 * Calculate trip duration from dates
 */
function calculateDuration(startDate?: string, endDate?: string): number {
  if (!startDate || !endDate) return 7; // Default 7 days
  
  try {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // Inclusive
    return Math.max(1, Math.min(diffDays, 30));
  } catch {
    return 7;
  }
}

/**
 * Determine cost level based on budget
 */
function determineCostLevel(
  budget: number | undefined,
  duration: number,
  travelers: number,
  destinationData: DestinationData
): 'budget' | 'mid' | 'luxury' {
  if (!budget) return 'mid';
  
  const dailyPerPerson = budget / duration / travelers;
  const costs = destinationData.facts.avgCost;
  
  if (dailyPerPerson <= costs.budget * 1.2) return 'budget';
  if (dailyPerPerson <= costs.mid * 1.2) return 'mid';
  return 'luxury';
}

/**
 * Estimate travel time between two locations (simplified)
 * In production, would use real routing APIs
 */
async function estimateTravelTime(
  from: string,
  to: string
): Promise<number | undefined> {
  try {
    // Parse coordinates
    const parseCoords = (loc: string) => {
      const parts = loc.split(',').map(s => parseFloat(s.trim()));
      if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
        return { lat: parts[0], lon: parts[1] };
      }
      return null;
    };
    
    const fromCoords = parseCoords(from);
    const toCoords = parseCoords(to);
    
    if (!fromCoords || !toCoords) return undefined;
    
    // Calculate great-circle distance (Haversine formula)
    const R = 6371; // Earth radius in km
    const dLat = (toCoords.lat - fromCoords.lat) * Math.PI / 180;
    const dLon = (toCoords.lon - fromCoords.lon) * Math.PI / 180;
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(fromCoords.lat * Math.PI / 180) * Math.cos(toCoords.lat * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distanceKm = R * c;
    
    // Estimate travel time (assuming average flight speed of 800 km/h including airport time)
    const travelTimeHours = distanceKm / 800 + 3; // +3 hours for airport/boarding
    
    return travelTimeHours;
  } catch (error) {
    console.error('[Validator] Travel time estimation failed:', error);
    return undefined;
  }
}

