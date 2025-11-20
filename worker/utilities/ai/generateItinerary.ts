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
import { getModelConfig } from './models';

export interface ItineraryGenerationResult {
  itinerary: any;
  analysis: any;
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
  // Step 1: Preference analysis
  const analysisPrompt = buildPreferenceAnalysisPrompt(input);
  const analysisConfig = getModelConfig('PREFERENCE_ANALYSIS');
  const analysisResponse: any = await env.AI.run(analysisConfig.model, {
    prompt: analysisPrompt,
    max_tokens: analysisConfig.maxTokens,
    temperature: analysisConfig.temperature,
  });
  
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
  
  // Step 2: Itinerary generation
  const itineraryPrompt = buildItineraryGenerationPrompt(input, analysis);
  const itineraryConfig = getModelConfig('ITINERARY_GENERATION');
  const itineraryResponse: any = await env.AI.run(itineraryConfig.model, {
    prompt: itineraryPrompt,
    max_tokens: itineraryConfig.maxTokens,
    temperature: itineraryConfig.temperature,
  });
  
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
  
  return {
    itinerary,
    analysis,
  };
}

