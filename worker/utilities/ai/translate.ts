/**
 * Translation utilities for itineraries
 * 
 * Uses LLM (Llama) for structured translation that:
 * - Preserves JSON structure
 * - Keeps place names intact (untranslated)
 * - Translates only descriptive text
 * 
 * Fallback to M2M100 for simple text-only translation
 */

import type { Env } from '../../types';
import { AI_MODELS, AI_PRESETS } from './models';

/**
 * Input interface for translation
 * Supports title, aiReasoning, and days for full itinerary translation
 */
export interface TranslationInput {
  title?: string;
  aiReasoning?: string;
  days?: Array<{
    day?: number;
    title?: string;
    activities?: Array<string | { title?: string; description?: string; [key: string]: any }>;
    estimatedCost?: number;
    [key: string]: any;
  }>;
  [key: string]: any;
}

/**
 * Output interface for translation
 * Same structure as input but with translated text
 */
export interface TranslationOutput {
  title?: string;
  aiReasoning?: string;
  days?: Array<{
    day?: number;
    title?: string;
    activities?: Array<string | { title?: string; description?: string; [key: string]: any }>;
    estimatedCost?: number;
    [key: string]: any;
  }>;
  [key: string]: any;
}

/**
 * Language names for prompts
 */
const LANGUAGE_NAMES: Record<string, string> = {
  fa: 'Persian (Farsi)',
  ar: 'Arabic',
  de: 'German',
  fr: 'French',
  es: 'Spanish',
  it: 'Italian',
  tr: 'Turkish',
  ru: 'Russian',
  zh: 'Chinese',
  ja: 'Japanese',
  ko: 'Korean',
  pt: 'Portuguese',
  nl: 'Dutch',
  pl: 'Polish',
  hi: 'Hindi',
  ur: 'Urdu',
};

/**
 * Build translation prompt for LLM
 * Explicitly instructs to preserve JSON structure and place names
 */
function buildTranslationPrompt(itinerary: TranslationInput, targetLang: string): string {
  const langName = LANGUAGE_NAMES[targetLang] || targetLang;
  
  // Build a clean version for translation
  const cleanItinerary: Record<string, any> = {};
  
  if (itinerary.title) {
    cleanItinerary.title = itinerary.title;
  }
  
  if (itinerary.aiReasoning) {
    cleanItinerary.aiReasoning = itinerary.aiReasoning;
  }
  
  if (itinerary.days && Array.isArray(itinerary.days)) {
    cleanItinerary.days = itinerary.days.map((day) => ({
      day: day.day,
      title: day.title,
      activities: (day.activities || []).map((act) => {
        if (typeof act === 'string') return act;
        return act.title || act.description || '';
      }).filter(Boolean),
    }));
  }
  
  const jsonStr = JSON.stringify(cleanItinerary, null, 2);
  
  return `You are a professional translator. Translate the following travel itinerary from English to ${langName}.

CRITICAL RULES:
1. Output ONLY valid JSON - no markdown, no explanation, no extra text.
2. Preserve the EXACT JSON structure (same keys, same nesting).
3. DO NOT translate:
   - Place names (museums, restaurants, landmarks, streets, neighborhoods)
   - Times (09:00, 14:30, etc.)
   - Numbers and prices
   - JSON keys
4. ONLY translate:
   - Descriptive text and sentences
   - Action words (Visit, Explore, Walk, etc.) should be translated
   - Day titles can be translated but keep place names within them
5. Keep the same number of days and activities.

INPUT JSON:
${jsonStr}

OUTPUT (valid JSON in ${langName}):`;
}

/**
 * Translate itinerary using LLM for structured output
 * Falls back gracefully if translation fails
 */
export async function translateItineraryIfNeeded(
  env: Env,
  itinerary: TranslationInput,
  lang?: string
): Promise<TranslationOutput> {
  if (!lang || lang === 'en') {
    return itinerary;
  }

  const t0 = Date.now();
  console.log(`[Translate] Starting translation to ${lang}`);
  
  try {
    // Build translation prompt
    const prompt = buildTranslationPrompt(itinerary, lang);
    console.log(`[Translate] Prompt length: ${prompt.length} chars`);
    
    // Use LLM for structured translation (preserves JSON)
    const response: any = await env.AI.run(AI_MODELS.RESEARCH as any, {
      prompt,
      max_tokens: AI_PRESETS.translateItinerary.max_tokens,
      temperature: 0.2, // Low temperature for consistent translation
    });
    
    const responseText = typeof response === 'string' ? response :
                         response?.response || response?.generated_text || '';
    
    console.log(`[Translate] LLM response received in ${Date.now() - t0}ms, length: ${responseText.length}`);
    
    // Extract JSON from response
    let translated: TranslationOutput;
    try {
      // Try direct parse first
      translated = JSON.parse(responseText);
    } catch {
      // Try to extract JSON from response
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          translated = JSON.parse(jsonMatch[0]);
        } catch (e2) {
          console.warn('[Translate] Failed to parse extracted JSON:', e2);
          return itinerary;
        }
      } else {
        console.warn('[Translate] No JSON found in response');
        return itinerary;
      }
    }
    
    // Merge translated content back with original structure
    const result: TranslationOutput = {
      ...itinerary,
      title: translated.title ?? itinerary.title,
      aiReasoning: translated.aiReasoning ?? itinerary.aiReasoning,
    };
    
    // Merge days if present
    if (translated.days && Array.isArray(translated.days) && itinerary.days) {
      result.days = itinerary.days.map((origDay, i) => {
        const translatedDay = translated.days?.[i];
        if (!translatedDay) return origDay;
        
        return {
          ...origDay,
          title: translatedDay.title ?? origDay.title,
          activities: (origDay.activities || []).map((origAct, j) => {
            const translatedAct = translatedDay.activities?.[j];
            if (!translatedAct) return origAct;
            
            if (typeof origAct === 'string') {
              return typeof translatedAct === 'string' ? translatedAct : origAct;
            }
            
            // Merge translated text while preserving original metadata
            return {
              ...origAct,
              title: typeof translatedAct === 'string' ? translatedAct : 
                     (typeof translatedAct === 'object' ? (translatedAct.title ?? origAct.title) : origAct.title),
              description: typeof translatedAct === 'object' ? (translatedAct.description ?? origAct.description) : origAct.description,
            };
          }),
        };
      });
    }
    
    console.log(`[Translate] Translation complete in ${Date.now() - t0}ms`);
    return result;
  } catch (error) {
    console.error('[Translate] Translation failed:', error);
    return itinerary;
  }
}

/**
 * Simple text translation using M2M100
 * Use for single text strings, not structured data
 */
export async function translateText(
  env: Env,
  text: string,
  targetLang: string
): Promise<string> {
  if (!text || !targetLang || targetLang === 'en') {
    return text;
  }
  
  try {
    const response: any = await env.AI.run(AI_MODELS.TRANSLATION, {
      text,
      source_lang: 'en',
      target_lang: targetLang,
    });
    
    return typeof response === 'string' ? response :
           response?.translated_text || 
           response?.response || 
           text;
  } catch (error) {
    console.error('[Translate] Simple translation failed:', error);
    return text;
  }
}
