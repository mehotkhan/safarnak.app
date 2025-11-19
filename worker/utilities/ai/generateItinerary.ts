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

export interface ItineraryGenerationResult {
  itinerary: any;
  analysis: any;
}

/**
 * Generate itinerary from preferences
 * Handles preference analysis, itinerary generation, validation, and fallback
 */
export async function generateItineraryFromPreferences(
  env: Env,
  input: TripAnalysisInput
): Promise<ItineraryGenerationResult> {
  // Step 1: Preference analysis
  const analysisPrompt = buildPreferenceAnalysisPrompt(input);
  const analysisResponse: any = await env.AI.run('@cf/meta/llama-3.1-8b-instruct-fp8', {
    prompt: analysisPrompt,
    max_tokens: 512,
    temperature: 0.7,
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
  const itineraryResponse: any = await env.AI.run('@cf/meta/llama-3.1-8b-instruct-fp8', {
    prompt: itineraryPrompt,
    max_tokens: 2048,
    temperature: 0.8,
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

