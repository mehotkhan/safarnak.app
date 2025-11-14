/**
 * AI Service for Trip Planning
 * 
 * Uses Cloudflare Workers AI (@cf/meta/llama-3.1-8b-instruct) for:
 * - Trip preference analysis
 * - Itinerary generation
 * - Trip updates based on user messages
 * - Geocoding and recommendations
 */

import type { Env } from '../types';
import {
  buildPreferenceAnalysisPrompt,
  buildItineraryGenerationPrompt,
  buildRecommendationsPrompt,
  buildTripUpdatePrompt,
  buildGeocodingPrompt,
  extractJSON,
  validateItinerary,
  generateFallbackItinerary,
  type TripAnalysisInput,
  type TripUpdateInput,
} from './prompts';
import {
  MODEL_STRATEGY,
  shouldUseAdvancedModel,
  FALLBACK_MODELS,
  OPTIMIZATION,
} from './aiModels';
// import { generateWaypointsForDestination } from '../utils/waypointsGenerator';

/**
 * AI Service - Main class for all AI operations
 */
export class TripAI {
  constructor(private env: Env) {}

  /**
   * Translate a single text into target language using M2M100
   */
  async translateText(text: string, targetLang: string, sourceLang?: string): Promise<string> {
    if (!text || !targetLang) return text;
    try {
      const res: any = await this.env.AI.run('@cf/meta/m2m100-1.2b' as any, {
        text,
        target_lang: targetLang,
        ...(sourceLang ? { source_lang: sourceLang } : {}),
      } as any);
      const translated = typeof res === 'string'
        ? res
        : (res?.translated_text || res?.response || res?.generated_text || text);
      return translated;
    } catch (e) {
      console.warn('translateText failed, returning original text', { targetLang, error: String((e as any)?.message || e) });
      return text;
    }
  }

  /**
   * Translate itinerary structure fields (title, activities) into target language
   */
  async translateItinerary(days: any[], targetLang: string, sourceLang?: string): Promise<any[]> {
    if (!Array.isArray(days) || !targetLang) return Array.isArray(days) ? days : [];
    const translated: any[] = [];
    for (const day of days) {
      const rawTitle = String(day?.title || '');
      const activitiesSrc: string[] = Array.isArray(day?.activities) ? (day.activities as any[]).map((a: any) => String(a)) : [];
      // Reduce translation calls to one per day by bundling title + activities with clear markers
      const bundled = [
        '<<<TITLE>>>',
        rawTitle,
        '<<<ACT>>>',
        ...activitiesSrc,
        '<<<END>>>',
      ].join('\n');
      const translatedBundled = await this.translateText(bundled, targetLang, sourceLang);
      // Parse back using markers (if markers were translated, fallback to original content)
      let outTitle = rawTitle;
      let outActivities = activitiesSrc;
      try {
        const t = translatedBundled;
        const titleIdx = t.indexOf('<<<TITLE>>>');
        const actIdx = t.indexOf('<<<ACT>>>');
        const endIdx = t.indexOf('<<<END>>>');
        if (titleIdx !== -1 && actIdx !== -1 && endIdx !== -1 && actIdx > titleIdx) {
          const titleSection = t.slice(titleIdx + '<<<TITLE>>>'.length, actIdx).trim();
          const actsSection = t.slice(actIdx + '<<<ACT>>>'.length, endIdx).trim();
          outTitle = titleSection.split('\n').join(' ').trim() || rawTitle;
          outActivities = actsSection.length ? actsSection.split('\n').map(s => s.trim()).filter(Boolean) : activitiesSrc;
        } else {
          // markers missing (translated?), fallback to single-call per field for safety
          outTitle = await this.translateText(rawTitle, targetLang, sourceLang);
          const tmpActs: string[] = [];
          for (const a of activitiesSrc) {
            tmpActs.push(await this.translateText(a, targetLang, sourceLang));
          }
          outActivities = tmpActs;
        }
      } catch {
        // On any parsing or translation error, keep originals
        outTitle = rawTitle;
        outActivities = activitiesSrc;
      }
      translated.push({ ...day, title: outTitle, activities: outActivities });
    }
    return translated;
  }

  /**
   * Build route waypoints from itinerary activities by geocoding extracted place names.
   * Falls back to destination-based waypoints if insufficient high-confidence results.
   */
  async generateWaypointsFromItinerary(itinerary: { days?: any[] }, fallbackDestination?: string): Promise<{ latitude: number; longitude: number; label?: string }[]> {
    try {
      const days: any[] = Array.isArray((itinerary as any)?.days) ? (itinerary as any).days : Array.isArray(itinerary) ? (itinerary as any) : [];
      const candidates: string[] = [];
      const MAX_CANDIDATES = 8;
      for (const day of days) {
        const activities: string[] = Array.isArray(day?.activities) ? day.activities : [];
        for (const a of activities) {
          const s = String(a || '');
          // Heuristics to extract place names
          // Patterns like "09:00: Visit PLACE - address" or "Lunch at PLACE"
          const visitMatch = s.match(/(?:Visit|بازدید از)\s+([^(),-]+?)(?:\s+-|\s*\(|$)/i);
          if (visitMatch?.[1]) candidates.push(visitMatch[1].trim());
          const atMatch = s.match(/(?:at|در)\s+([^(),-]+?)(?:\s+-|\s*\(|$)/i);
          if (atMatch?.[1]) candidates.push(atMatch[1].trim());
          // Fallback: capitalized chunk between times and separator
          const generic = s.replace(/^\s*\d{1,2}:\d{2}\s*:\s*/, '').split('-')[0];
          if (generic) {
            const cleaned = generic.replace(/^(Visit|Explore|Lunch|Dinner|Breakfast)\s+/i, '').trim();
            if (cleaned && /[A-Za-z\u0600-\u06FF]/.test(cleaned)) {
              candidates.push(cleaned);
            }
          }
          if (candidates.length >= MAX_CANDIDATES) break;
        }
        if (candidates.length >= MAX_CANDIDATES) break;
      }

      // Deduplicate and compact
      const unique = Array.from(new Set(candidates.map(c => c.trim()))).filter(Boolean).slice(0, MAX_CANDIDATES);
      const waypoints: { latitude: number; longitude: number; label?: string }[] = [];
      // Resolve candidates using deterministic Nominatim geocoding
      // Lazy import to avoid circular deps
      const { geocodePlaceInDestination, geocodeDestinationCenter } = await import('./geocode');
      for (const name of unique) {
        try {
          const scoped = fallbackDestination
            ? await geocodePlaceInDestination(name, fallbackDestination)
            : null;
          if (scoped) waypoints.push(scoped);
        } catch {
          // ignore individual failures
        }
        if (waypoints.length >= 6) break;
      }

      if (waypoints.length >= 3) {
        return waypoints;
      }

      // Fallback: destination center if available
      if (fallbackDestination && typeof fallbackDestination === 'string' && fallbackDestination.trim()) {
        try {
          const center = await geocodeDestinationCenter(fallbackDestination.trim());
          if (center) {
            return [{
              latitude: center.latitude,
              longitude: center.longitude,
              label: fallbackDestination.trim(),
            }];
          }
        } catch {
          // ignore
        }
      }
      return [];
    } catch {
      // On unexpected error, return empty to avoid mock data
      return [];
    }
  }

  /**
   * Analyze user preferences and extract structured travel intent
   * Uses FAST model for quick classification
   */
  async analyzePreferences(input: TripAnalysisInput): Promise<any> {
    try {
      const config = MODEL_STRATEGY.PREFERENCE_ANALYSIS;
      const prompt = buildPreferenceAnalysisPrompt(input);
      const response = await this.runAI(prompt, {
        model: config.model,
        max_tokens: config.maxTokens,
        temperature: config.temperature,
        task: 'preference_analysis',
      });
      const analysis = extractJSON(response);
      
      // Validate and fill defaults
      return {
        travelStyle: analysis.travelStyle || 'balanced',
        interests: Array.isArray(analysis.interests) ? analysis.interests : ['sightseeing'],
        pacePreference: analysis.pacePreference || 'moderate',
        budgetLevel: analysis.budgetLevel || 'moderate',
        mustSeeAttractions: Array.isArray(analysis.mustSeeAttractions) ? analysis.mustSeeAttractions : [],
        dietaryNeeds: Array.isArray(analysis.dietaryNeeds) ? analysis.dietaryNeeds : ['none'],
        transportPreferences: Array.isArray(analysis.transportPreferences) ? analysis.transportPreferences : ['public_transport'],
        reasoning: analysis.reasoning || 'Traveler seeks a balanced experience.'
      };
    } catch (error) {
      console.error('AI preference analysis failed:', error);
      // Return sensible defaults
      return {
        travelStyle: 'balanced',
        interests: ['sightseeing', 'food', 'culture'],
        pacePreference: 'moderate',
        budgetLevel: input.budget ? (input.budget < 1000 ? 'budget' : input.budget > 3000 ? 'luxury' : 'moderate') : 'moderate',
        mustSeeAttractions: [],
        dietaryNeeds: ['none'],
        transportPreferences: ['public_transport', 'walking'],
        reasoning: input.userLocation
          ? `بر اساس موقعیت فعلی شما (${input.userLocation}) و ترجیحات ارسال‌شده، یک پروفایل متعادل ایجاد شد.`
          : 'Created a balanced travel profile based on your input.'
      };
    }
  }

  /**
   * Generate complete itinerary with day-by-day activities
   * Uses ADVANCED model for high-quality detailed planning
   */
  async generateItinerary(input: TripAnalysisInput, analysis: any): Promise<any> {
    try {
      const MS_PER_DAY = 1000 * 60 * 60 * 24;
      const durationDays = input.startDate && input.endDate
        ? Math.max(1, Math.min(30, Math.ceil((new Date(input.endDate).getTime() - new Date(input.startDate).getTime()) / MS_PER_DAY) + 1))
        : undefined;

      // Auto-select model based on trip complexity
      const useAdvanced = shouldUseAdvancedModel({
        duration: durationDays,
        budget: input.budget,
        preferencesLength: input.preferences?.length || 0,
      });

      const config = useAdvanced ? 
        MODEL_STRATEGY.ITINERARY_GENERATION : 
        MODEL_STRATEGY.TRIP_UPDATES;

      console.log(`Itinerary generation: using ${useAdvanced ? 'ADVANCED' : 'STANDARD'} model`);

      const prompt = buildItineraryGenerationPrompt(input, analysis);
      const response = await this.runAI(prompt, {
        model: config.model,
        max_tokens: config.maxTokens,
        temperature: config.temperature,
        task: 'itinerary_generation',
      });
      const itineraryData = extractJSON(response);
      
      // Validate itinerary structure
      if (!validateItinerary(itineraryData)) {
        console.warn('AI generated invalid itinerary structure, retrying...');
        throw new Error('Invalid itinerary structure from AI');
      }

      // Check for placeholder/mock data in activities
      const itineraryStr = JSON.stringify(itineraryData);
      const hasPlaceholders = itineraryStr.includes('[نام') || 
                             itineraryStr.includes('[name]') ||
                             itineraryStr.includes('جاذبه اول') ||
                             itineraryStr.includes('رستوران نام') ||
                             itineraryStr.includes('نام واقعی') ||
                             itineraryStr.includes('جاذبه برتر');
      
      if (hasPlaceholders) {
        console.warn('AI generated placeholder data, rejecting...');
        throw new Error('AI generated placeholder/mock data instead of real places');
      }
      
      return {
        title: itineraryData.title || `سفر به ${input.destination || 'مقصد شما'}`,
        destination: itineraryData.destination || input.destination || 'Destination',
        days: Array.isArray(itineraryData.days) ? itineraryData.days : [],
        estimatedBudget: itineraryData.estimatedBudget || {
          accommodation: Math.round((input.budget || 1000) * 0.4),
          food: Math.round((input.budget || 1000) * 0.3),
          activities: Math.round((input.budget || 1000) * 0.2),
          transport: Math.round((input.budget || 1000) * 0.1),
          total: input.budget || 1000
        },
        aiReasoning: itineraryData.aiReasoning || 'Generated based on your preferences.',
        highlights: Array.isArray(itineraryData.highlights) ? itineraryData.highlights : [],
        tips: Array.isArray(itineraryData.tips) ? itineraryData.tips : []
      };
    } catch (error) {
      console.error('AI itinerary generation failed:', error);
      return generateFallbackItinerary(input);
    }
  }

  /**
   * Generate recommendations for restaurants, accommodations, transport
   * Uses PRIMARY model for balanced speed/quality
   */
  async generateRecommendations(destination: string, itinerary: any, analysis: any, userLocation?: string): Promise<any> {
    try {
      const config = MODEL_STRATEGY.RECOMMENDATIONS;
      const prompt = buildRecommendationsPrompt(destination, itinerary, analysis, userLocation);
      const response = await this.runAI(prompt, {
        model: config.model,
        max_tokens: config.maxTokens,
        temperature: config.temperature,
        task: 'recommendations',
      });
      const recommendations = extractJSON(response);
      
      return {
        restaurants: Array.isArray(recommendations.restaurants) ? recommendations.restaurants.slice(0, 5) : [],
        cafes: Array.isArray(recommendations.cafes) ? recommendations.cafes.slice(0, 3) : [],
        accommodations: Array.isArray(recommendations.accommodations) ? recommendations.accommodations.slice(0, 3) : [],
        transportation: recommendations.transportation || {
          bestOption: 'public_transport',
          passes: [],
          tips: []
        },
        localTips: Array.isArray(recommendations.localTips) ? recommendations.localTips : []
      };
    } catch (error) {
      console.error('AI recommendations failed:', error);
      // Return empty recommendations (non-critical)
      return {
        restaurants: [],
        cafes: [],
        accommodations: [],
        transportation: { bestOption: 'public_transport', passes: [], tips: [] },
        localTips: []
      };
    }
  }

  /**
   * Update trip based on user's natural language message
   * Uses PRIMARY model for fast iteration
   */
  async updateTrip(input: TripUpdateInput): Promise<any> {
    try {
      const useAdvanced = shouldUseAdvancedModel({
        duration: Array.isArray(input.currentTrip.itinerary) ? input.currentTrip.itinerary.length : undefined,
        budget: input.currentTrip.budget,
        preferencesLength: input.userMessage.length,
      });

      const config = useAdvanced ? MODEL_STRATEGY.ITINERARY_GENERATION : MODEL_STRATEGY.TRIP_UPDATES;
      const prompt = buildTripUpdatePrompt(input);
      const response = await this.runAI(prompt, {
        model: config.model,
        max_tokens: config.maxTokens,
        temperature: config.temperature,
        task: 'trip_update',
      });
      const updateData = extractJSON(response);
      
      return {
        understood: updateData.understood || 'Processing your request',
        modifications: updateData.modifications || {},
        updatedItinerary: Array.isArray(updateData.updatedItinerary) ? updateData.updatedItinerary : input.currentTrip.itinerary || [],
        aiReasoning: updateData.aiReasoning || 'Updated trip based on your request'
      };
    } catch (error) {
      console.error('AI trip update failed:', error);
      // Return current trip unchanged
      return {
        understood: 'Unable to process the request',
        modifications: {},
        updatedItinerary: input.currentTrip.itinerary || [],
        aiReasoning: 'Could not update trip at this time. Please try again.'
      };
    }
  }

  /**
   * Get approximate coordinates for a destination using AI
   * Uses FAST model for simple structured output
   */
  async geocodeDestination(destination: string): Promise<any> {
    try {
      const config = MODEL_STRATEGY.GEOCODING;
      const prompt = buildGeocodingPrompt(destination);
      const response = await this.runAI(prompt, {
        model: config.model,
        max_tokens: config.maxTokens,
        temperature: config.temperature,
        task: 'geocoding',
      });
      const geoData = extractJSON(response);
      
      return {
        destination: geoData.destination || destination,
        coordinates: geoData.coordinates || { latitude: 0, longitude: 0 },
        country: geoData.country || 'Unknown',
        region: geoData.region || 'Unknown',
        confidence: geoData.confidence || 'low'
      };
    } catch (error) {
      console.error('AI geocoding failed:', error);
      // Return default coordinates (center of world map)
      return {
        destination,
        coordinates: { latitude: 20.0, longitude: 0.0 },
        country: 'Unknown',
        region: 'Unknown',
        confidence: 'low'
      };
    }
  }

  /**
   * Core AI execution method with optimized model selection
   * Calls Cloudflare Workers AI with prompt
   */
  private async runAI(
    prompt: string,
    options: {
      model?: string;
      max_tokens?: number;
      temperature?: number;
      task?: string;
    } = {}
  ): Promise<string> {
    const startTime = Date.now();
    const primaryModel = options.model || MODEL_STRATEGY.ITINERARY_GENERATION.model;
    const makeCall = async (modelToUse: string, maxTokens?: number): Promise<any> => {
      // Enforce timeout to prevent 504 stalling the whole mutation
      const timeoutMs = OPTIMIZATION.AI_TIMEOUT || 30000;
      const controller: { timedOut?: boolean } = {};
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => {
          controller.timedOut = true;
          reject(new Error('AI_TIMEOUT'));
        }, timeoutMs);
        // best-effort clear handled inside main promise via finally
      });
      const aiPromise = this.env.AI.run(modelToUse as any, {
        prompt,
        max_tokens: maxTokens || options.max_tokens || 1024,
        temperature: options.temperature || 0.7,
      } as any);
      try {
        // Race against timeout
        const response: any = await Promise.race([aiPromise, timeoutPromise]);
        return response;
      } finally {
        // Nothing to clean explicitly; relying on race only
      }
    };

    const parseResponse = (response: any): string => {
      if (typeof response === 'string') return response;
      if (response && typeof response.response === 'string') return response.response;
      if (response && typeof response.generated_text === 'string') return response.generated_text;
      throw new Error('Invalid AI response format');
    };

    const tryOnce = async (modelToUse: string, maxTokens?: number) => {
      const response = await makeCall(modelToUse, maxTokens);
      const text = parseResponse(response);
      const duration = Date.now() - startTime;
      console.log(`AI request completed in ${duration}ms (model: ${modelToUse}, task: ${options.task || 'unknown'})`);
      return text;
    };

    try {
      return await tryOnce(primaryModel);
    } catch (error: any) {
      const duration = Date.now() - startTime;
      const errMsg = error?.message || String(error);
      console.error('AI request failed:', {
        error: errMsg,
        duration,
        model: primaryModel,
        task: options.task
      });
      // Fallback on 504/timeout/upstream errors
      const isTimeout = errMsg.includes('AI_TIMEOUT') || /504|Gateway Time-out|gateway timeout/i.test(errMsg);
      const fallbackModel = (FALLBACK_MODELS as any)[primaryModel];
      if (fallbackModel || isTimeout) {
        try {
          const chosen = fallbackModel || MODEL_STRATEGY.TRIP_UPDATES.model;
          // Use smaller max tokens on fallback to reduce latency risk
          const reducedTokens = Math.min(options.max_tokens || 1024, 1024);
          console.warn(`Retrying with fallback model: ${chosen} (task: ${options.task || 'unknown'})`);
          return await tryOnce(chosen, reducedTokens);
        } catch (fallbackError: any) {
          const fduration = Date.now() - startTime;
          console.error('AI fallback failed:', {
            error: fallbackError?.message || String(fallbackError),
            duration: fduration,
            model: fallbackModel || MODEL_STRATEGY.TRIP_UPDATES.model,
            task: options.task
          });
          throw fallbackError;
        }
      }
      throw error;
    }
  }
}

/**
 * Helper: Create TripAI instance
 */
export function createTripAI(env: Env): TripAI {
  return new TripAI(env);
}

/**
 * Complete trip generation pipeline
 * Combines all AI steps into one function for create mutation
 */
export async function generateCompleteTrip(env: Env, input: TripAnalysisInput): Promise<any> {
  const ai = createTripAI(env);
  
  try {
    // Step 1: Analyze preferences
    const analysis = await ai.analyzePreferences(input);
    console.log('AI analysis complete:', analysis.travelStyle);
    
    // Step 2: Generate itinerary (main content)
    const itinerary = await ai.generateItinerary(input, analysis);
    console.log('AI itinerary complete:', itinerary.days.length, 'days');
    
    // Step 3: Get recommendations (optional, can fail gracefully)
    let recommendations;
    try {
      recommendations = await ai.generateRecommendations(
        input.destination || itinerary.destination,
        itinerary,
        analysis
      );
      console.log('AI recommendations complete');
    } catch (error) {
      console.warn('Recommendations failed, continuing without them:', error);
      recommendations = {
        restaurants: [],
        cafes: [],
        accommodations: [],
        transportation: { bestOption: 'public_transport', passes: [], tips: [] },
        localTips: []
      };
    }
    
    // Step 4: Get coordinates (if needed)
    let coordinates = { latitude: 0, longitude: 0 };
    if (input.destination) {
      try {
        const geoData = await ai.geocodeDestination(input.destination);
        coordinates = geoData.coordinates;
        console.log('AI geocoding complete:', coordinates);
      } catch (error) {
        console.warn('Geocoding failed, using defaults:', error);
      }
    }
    
    return {
      title: itinerary.title,
      destination: itinerary.destination,
      startDate: input.startDate,
      endDate: input.endDate,
      budget: itinerary.estimatedBudget.total,
      travelers: input.travelers,
      accommodation: input.accommodation || 'hotel',
      preferences: input.preferences,
      aiReasoning: itinerary.aiReasoning,
      itinerary: itinerary.days,
      coordinates,
      recommendations,
      analysis
    };
  } catch (error) {
    console.error('Complete trip generation failed:', error);
    // Return fallback
    return {
      title: `Trip to ${input.destination || 'Destination'}`,
      destination: input.destination || 'Destination',
      startDate: input.startDate,
      endDate: input.endDate,
      budget: input.budget || 1000,
      travelers: input.travelers,
      accommodation: input.accommodation || 'hotel',
      preferences: input.preferences,
      aiReasoning: 'Created a basic trip plan. AI generation encountered an error.',
      itinerary: generateFallbackItinerary(input).days,
      coordinates: { latitude: 0, longitude: 0 },
      recommendations: {
        restaurants: [],
        cafes: [],
        accommodations: [],
        transportation: { bestOption: 'public_transport', passes: [], tips: [] },
        localTips: []
      },
      analysis: {
        travelStyle: 'balanced',
        interests: ['sightseeing'],
        pacePreference: 'moderate',
        budgetLevel: 'moderate',
        mustSeeAttractions: [],
        dietaryNeeds: ['none'],
        transportPreferences: ['public_transport'],
        reasoning: 'Default analysis'
      }
    };
  }
}

