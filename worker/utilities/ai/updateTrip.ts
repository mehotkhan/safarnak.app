/**
 * AI Trip Update
 * Core AI logic for updating trips based on user feedback
 */

import type { Env } from '../../types';
import type { TripUpdateInput } from './prompts';
import {
  buildTripUpdatePrompt,
  extractJSON,
  validateItinerary,
} from './prompts';
import { getModelConfig } from './models';

export interface TripUpdateResult {
  updatedItinerary: any; // structured itinerary as returned from AI
  modifications: {
    destination?: string | null;
    budget?: number | null;
    travelers?: number | null;
    preferences?: string | null;
  };
  aiReasoning?: string;
  understood?: string;
}

/**
 * Apply trip update using AI
 * Uses buildTripUpdatePrompt to generate updated itinerary based on user feedback
 */
export async function applyTripUpdateWithAI(
  env: Env,
  input: TripUpdateInput
): Promise<TripUpdateResult | null> {
  try {
    // Step 1: Build prompt using existing prompt builder
    const prompt = buildTripUpdatePrompt(input);
    
    // Step 2: Call Workers AI using model config
    const updateConfig = getModelConfig('TRIP_UPDATES');
    const aiResponse: any = await env.AI.run(updateConfig.model, {
      prompt,
      max_tokens: updateConfig.maxTokens,
      temperature: updateConfig.temperature,
    });
    
    // Step 3: Extract text from response
    const text = typeof aiResponse === 'string'
      ? aiResponse
      : aiResponse?.response || aiResponse?.generated_text || '{}';
    
    // Step 4: Extract JSON from response
    let json: any;
    try {
      json = extractJSON(text);
    } catch (error) {
      console.error('[UpdateTrip] Failed to extract JSON:', error);
      return null;
    }
    
    // Step 5: Validate itinerary structure
    if (!json.updatedItinerary || !Array.isArray(json.updatedItinerary)) {
      console.warn('[UpdateTrip] Invalid itinerary structure in AI response');
      return null;
    }
    
    // Validate using existing validator
    const isValid = validateItinerary({ days: json.updatedItinerary });
    if (!isValid) {
      console.warn('[UpdateTrip] Generated itinerary failed validation');
      return null;
    }
    
    // Step 6: Return structured result
    return {
      updatedItinerary: json.updatedItinerary,
      modifications: json.modifications || {},
      aiReasoning: json.aiReasoning || 'User feedback applied',
      understood: json.understood || 'Changes applied to itinerary',
    };
  } catch (error) {
    console.error('[UpdateTrip] AI update failed:', error);
    return null;
  }
}

