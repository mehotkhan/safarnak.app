/**
 * AI Itinerary Generation
 * Centralized itinerary generation using prompts and validation
 */

import type { Env } from '../../types';
import type { TripAnalysisInput } from './prompts';
import {
  buildPreferenceAnalysisPrompt,
  buildItineraryGenerationPrompt,
  extractJSON,
  validateItinerary,
  generateFallbackItinerary,
} from './prompts';
import { 
  getModelConfig, 
  getItineraryConfig, 
  shouldUseAdvancedModel,
} from './models';

export interface ItineraryGenerationResult {
  itinerary: any;
  analysis: any;
}

/**
 * Calculate trip duration from dates
 */
function calculateDuration(startDate?: string, endDate?: string): number {
  if (!startDate || !endDate) return 7;
  try {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.max(1, Math.min(30, Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1));
  } catch {
    return 7;
  }
}

/**
 * Generate itinerary from preferences
 * Handles preference analysis, itinerary generation, validation, and fallback
 * @param env - Cloudflare environment
 * @param input - Trip analysis input including preferences, dates, and optional attractions/restaurants
 */
export async function generateItineraryFromPreferences(
  env: Env,
  input: TripAnalysisInput
): Promise<ItineraryGenerationResult> {
  const t0 = Date.now();
  const duration = calculateDuration(input.startDate, input.endDate);
  
  // Determine if we should use pro model
  const usePro = shouldUseAdvancedModel({
    duration,
    budget: input.budget,
    preferencesLength: input.preferences?.length || 0,
  });
  
  console.log(`[GenerateItinerary] Starting generation: ${duration} days, pro=${usePro}`);
  
  // Step 1: Preference analysis (fast model)
  const analysisPrompt = buildPreferenceAnalysisPrompt(input);
  const analysisConfig = getModelConfig('PREFERENCE_ANALYSIS');
  
  const t1 = Date.now();
  const analysisResponse: any = await env.AI.run(analysisConfig.model as any, {
    prompt: analysisPrompt,
    max_tokens: analysisConfig.maxTokens,
    temperature: analysisConfig.temperature,
  });
  console.log(`[GenerateItinerary] Preference analysis completed in ${Date.now() - t1}ms`);
  
  const analysisText = typeof analysisResponse === 'string' ? analysisResponse :
                       analysisResponse?.response || analysisResponse?.generated_text || '{}';
  
  let analysis: any;
  try {
    analysis = extractJSON(analysisText);
  } catch (error) {
    console.warn('[GenerateItinerary] Failed to parse analysis, using defaults:', error);
    analysis = {
      travelStyle: 'balanced',
      interests: [],
      pacePreference: 'moderate',
      budgetLevel: 'moderate',
      mustSeeAttractions: [],
      dietaryNeeds: [],
      transportPreferences: [],
      reasoning: 'Default analysis',
    };
  }
  
  // Step 2: Itinerary generation (dynamic config based on duration & quality tier)
  const itineraryPrompt = buildItineraryGenerationPrompt(input, analysis);
  const itineraryConfig = getItineraryConfig(duration, { pro: usePro });
  
  console.log(`[GenerateItinerary] Using model: ${itineraryConfig.model}, max_tokens: ${itineraryConfig.maxTokens}`);
  
  const t2 = Date.now();
  const itineraryResponse: any = await env.AI.run(itineraryConfig.model as any, {
    prompt: itineraryPrompt,
    max_tokens: itineraryConfig.maxTokens,
    temperature: itineraryConfig.temperature,
  });
  console.log(`[GenerateItinerary] Itinerary generation completed in ${Date.now() - t2}ms`);
  
  const itineraryText = typeof itineraryResponse === 'string' ? itineraryResponse :
                        itineraryResponse?.response || itineraryResponse?.generated_text || '{}';
  
  let itinerary: any;
  try {
    itinerary = extractJSON(itineraryText);
    
    // Step 3: Validate itinerary
    if (!validateItinerary(itinerary)) {
      console.warn('[GenerateItinerary] Generated itinerary failed validation, using fallback');
      itinerary = generateFallbackItinerary(input);
    }
  } catch (error) {
    console.warn('[GenerateItinerary] Failed to parse itinerary, using fallback:', error);
    itinerary = generateFallbackItinerary(input);
  }
  
  console.log(`[GenerateItinerary] Total generation time: ${Date.now() - t0}ms`);
  
  return {
    itinerary,
    analysis,
  };
}

