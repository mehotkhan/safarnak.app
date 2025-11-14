/**
 * Trip Planning Orchestrator
 * 
 * Coordinates the complete trip planning pipeline:
 * Research → Validate → Match → Generate → Verify → Translate
 * 
 * This is the main entry point for intelligent trip creation.
 */

import type { Env } from '../types';
import { researchDestination } from './destinationResearch';
import { validateTripRequest, type TripRequest } from './tripValidator';
import { generateIntelligentTrip } from './intelligentTripGenerator';
import { TripAI } from './ai';

export interface OrchestratorResult {
  success: boolean;
  trip?: {
    title: string;
    destination: string;
    days: any[];
    coordinates: { latitude: number; longitude: number };
    waypoints: any[];
    aiReasoning: string;
    estimatedBudget: any;
    metadata: any;
  };
  error?: string;
  warnings?: string[];
}

/**
 * Orchestrate complete trip planning pipeline
 */
export async function orchestrateTripPlanning(
  env: Env,
  request: TripRequest & { lang?: string }
): Promise<OrchestratorResult> {
  const stages = {
    research: false,
    validate: false,
    generate: false,
    translate: false,
  };
  
  try {
    // ========================================================================
    // STAGE 1: RESEARCH (Cache-First)
    // ========================================================================
    console.log('[Orchestrator] Stage 1: Research destination...');
    const destinationData = await researchDestination(env, request.destination);
    stages.research = true;
    
    if (destinationData.attractions.length === 0) {
      console.warn('[Orchestrator] No attractions found, using AI fallback');
      // Fall back to AI-only generation if no research data
      return await fallbackToAIGeneration(env, request);
    }
    
    // ========================================================================
    // STAGE 2: VALIDATE
    // ========================================================================
    console.log('[Orchestrator] Stage 2: Validate trip request...');
    const validation = await validateTripRequest(env, request, destinationData);
    stages.validate = true;
    
    if (!validation.feasible) {
      return {
        success: false,
        error: `Trip not feasible: ${validation.warnings.join(', ')}`,
        warnings: validation.warnings,
      };
    }
    
    // ========================================================================
    // STAGE 3: GENERATE (Data-Driven)
    // ========================================================================
    console.log('[Orchestrator] Stage 3: Generate intelligent itinerary...');
    const duration = request.duration || calculateDuration(request.startDate, request.endDate);
    const budget = request.budget || destinationData.facts.avgCost.mid * duration * request.travelers;
    
    const generatedTrip = await generateIntelligentTrip(
      env,
      {
        destination: request.destination,
        duration,
        budget,
        travelers: request.travelers,
        preferences: request.preferences,
        userLocation: request.userLocation,
        lang: request.lang,
      },
      destinationData,
      validation
    );
    stages.generate = true;
    
    // ========================================================================
    // STAGE 4: TRANSLATE (If Needed)
    // ========================================================================
    let finalDays = generatedTrip.days;
    let finalReasoning = generatedTrip.aiReasoning;
    let finalHighlights = generatedTrip.highlights;
    let finalTips = generatedTrip.tips;
    
    if (request.lang && request.lang !== 'en') {
      console.log(`[Orchestrator] Stage 4: Translate to ${request.lang}...`);
      try {
        const ai = new TripAI(env);
        
        // Translate day titles and activity titles
        const translatedDays = await Promise.all(
          finalDays.map(async (day) => {
            const translatedActivities = await Promise.all(
              day.activities.map(async (activity: any) => ({
                ...activity,
                title: await ai.translateText(activity.title, request.lang!).catch(() => activity.title),
                description: activity.description 
                  ? await ai.translateText(activity.description, request.lang!).catch(() => activity.description)
                  : undefined,
              }))
            );
            
            return {
              ...day,
              title: await ai.translateText(day.title, request.lang!).catch(() => day.title),
              activities: translatedActivities,
            };
          })
        );
        
        finalDays = translatedDays;
        finalReasoning = await ai.translateText(generatedTrip.aiReasoning, request.lang).catch(() => generatedTrip.aiReasoning);
        
        // Translate highlights and tips
        const translatedHighlights = await Promise.all(
          generatedTrip.highlights.map(h => ai.translateText(h, request.lang!).catch(() => h))
        );
        const translatedTips = await Promise.all(
          generatedTrip.tips.map(t => ai.translateText(t, request.lang!).catch(() => t))
        );
        
        finalHighlights = translatedHighlights;
        finalTips = translatedTips;
        stages.translate = true;
      } catch (translateError) {
        console.warn('[Orchestrator] Translation failed, using English:', translateError);
      }
    }
    
    // ========================================================================
    // FINAL ASSEMBLY
    // ========================================================================
    return {
      success: true,
      trip: {
        title: generatedTrip.title,
        destination: generatedTrip.destination,
        days: finalDays,
        coordinates: {
          latitude: destinationData.facts.coordinates.lat,
          longitude: destinationData.facts.coordinates.lon,
        },
        waypoints: generatedTrip.waypoints,
        aiReasoning: finalReasoning,
        estimatedBudget: generatedTrip.estimatedBudget,
        metadata: {
          stages,
          validation,
          destinationFacts: destinationData.facts,
          cached: true,
          highlights: finalHighlights,
          tips: finalTips,
        },
      },
      warnings: validation.warnings,
    };
  } catch (error: any) {
    console.error('[Orchestrator] Pipeline failed:', error);
    
    // Try AI fallback
    console.log('[Orchestrator] Attempting AI fallback...');
    return await fallbackToAIGeneration(env, request);
  }
}

/**
 * Fallback to pure AI generation if research fails
 */
async function fallbackToAIGeneration(
  env: Env,
  request: TripRequest & { lang?: string }
): Promise<OrchestratorResult> {
  try {
    const ai = new TripAI(env);
    const _duration = request.duration || calculateDuration(request.startDate, request.endDate);
    
    const analysis = await ai.analyzePreferences({
      destination: request.destination,
      preferences: request.preferences,
      budget: request.budget,
      travelers: request.travelers,
      startDate: request.startDate,
      endDate: request.endDate,
      userLocation: request.userLocation,
    });
    
    const itinerary = await ai.generateItinerary(
      {
        destination: request.destination,
        preferences: request.preferences,
        budget: request.budget,
        travelers: request.travelers,
        startDate: request.startDate,
        endDate: request.endDate,
        userLocation: request.userLocation,
      },
      analysis
    );
    
    // Translate if needed
    let finalDays = itinerary.days;
    let finalReasoning = itinerary.aiReasoning;
    
    if (request.lang && request.lang !== 'en') {
      try {
        finalReasoning = await ai.translateText(itinerary.aiReasoning, request.lang);
        finalDays = await ai.translateItinerary(itinerary.days, request.lang);
      } catch {
        // Keep English
      }
    }
    
    // Get coordinates
    const { geocodeDestinationCenter } = await import('./geocode');
    const coords = await geocodeDestinationCenter(request.destination);
    
    return {
      success: true,
      trip: {
        title: itinerary.title,
        destination: itinerary.destination,
        days: finalDays,
        coordinates: coords || { latitude: 0, longitude: 0 },
        waypoints: coords ? [{
          latitude: coords.latitude,
          longitude: coords.longitude,
          label: request.destination,
          order: 1,
        }] : [],
        aiReasoning: finalReasoning,
        estimatedBudget: itinerary.estimatedBudget,
        metadata: {
          fallback: true,
          analysis,
        },
      },
      warnings: ['Used AI fallback - limited destination data available'],
    };
  } catch (error: any) {
    console.error('[Orchestrator] Fallback also failed:', error);
    return {
      success: false,
      error: error?.message || 'Trip generation failed completely',
    };
  }
}

/**
 * Helper: Calculate duration from dates
 */
function calculateDuration(startDate?: string, endDate?: string): number {
  if (!startDate || !endDate) return 7;
  
  try {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return Math.max(1, Math.min(diffDays, 30));
  } catch {
    return 7;
  }
}

