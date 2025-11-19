/**
 * Translation utilities for itineraries
 * Batch translation using M2M100
 */

import type { Env } from '../../types';

/**
 * Translate itinerary if needed
 * If lang is 'en' or not provided, returns original
 * Otherwise translates the entire itinerary JSON in one batch call
 */
export async function translateItineraryIfNeeded(
  env: Env,
  itinerary: any,
  lang?: string
): Promise<any> {
  if (!lang || lang === 'en') {
    return itinerary;
  }
  
  try {
    // Convert itinerary to JSON string for batch translation
    const itineraryJson = JSON.stringify(itinerary, null, 2);
    
    // Translate the entire JSON string
    const translationResponse: any = await env.AI.run('@cf/meta/m2m100-1.2b', {
      text: itineraryJson,
      source_lang: 'en',
      target_lang: lang,
    });
    
    const translatedText = typeof translationResponse === 'string' ? translationResponse :
                          translationResponse?.translated_text || 
                          translationResponse?.response || 
                          translationResponse?.generated_text || 
                          itineraryJson;
    
    // Try to parse translated JSON
    try {
      const translated = JSON.parse(translatedText);
      return translated;
    } catch (_parseError) {
      // If parsing fails, try to extract JSON from response
      const jsonMatch = translatedText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      // If all else fails, return original
      console.warn('[Translate] Failed to parse translated JSON, returning original');
      return itinerary;
    }
  } catch (error) {
    console.error('[Translate] Translation failed:', error);
    return itinerary;
  }
}

