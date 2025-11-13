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
} from './aiModels';

/**
 * AI Service - Main class for all AI operations
 */
export class TripAI {
  constructor(private env: Env) {}

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
        reasoning: 'Created a balanced travel profile based on your input.'
      };
    }
  }

  /**
   * Generate complete itinerary with day-by-day activities
   * Uses ADVANCED model for high-quality detailed planning
   */
  async generateItinerary(input: TripAnalysisInput, analysis: any): Promise<any> {
    try {
      // Auto-select model based on trip complexity
      const useAdvanced = shouldUseAdvancedModel({
        duration: input.startDate && input.endDate ? 
          Math.ceil((new Date(input.endDate).getTime() - new Date(input.startDate).getTime()) / (1000 * 60 * 60 * 24)) : 7,
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
        console.warn('AI generated invalid itinerary structure, using fallback');
        return generateFallbackItinerary(input);
      }
      
      return {
        title: itineraryData.title || `Trip to ${input.destination}`,
        destination: itineraryData.destination || input.destination,
        days: itineraryData.days || [],
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
  async generateRecommendations(destination: string, itinerary: any, analysis: any): Promise<any> {
    try {
      const config = MODEL_STRATEGY.RECOMMENDATIONS;
      const prompt = buildRecommendationsPrompt(destination, itinerary, analysis);
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
      const config = MODEL_STRATEGY.TRIP_UPDATES;
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
    const model = options.model || MODEL_STRATEGY.ITINERARY_GENERATION.model;
    
    try {
      const response: any = await this.env.AI.run(model as any, {
        prompt,
        max_tokens: options.max_tokens || 1024,
        temperature: options.temperature || 0.7,
      });

      const duration = Date.now() - startTime;
      console.log(`AI request completed in ${duration}ms (model: ${model}, task: ${options.task || 'unknown'})`);

      // Handle different response formats
      let textResponse: string;
      if (typeof response === 'string') {
        textResponse = response;
      } else if (response && typeof response.response === 'string') {
        textResponse = response.response;
      } else if (response && typeof response.generated_text === 'string') {
        textResponse = response.generated_text;
      } else {
        throw new Error('Invalid AI response format');
      }

      return textResponse;
    } catch (error: any) {
      const duration = Date.now() - startTime;
      console.error('AI request failed:', {
        error: error?.message || String(error),
        duration,
        model,
        task: options.task
      });
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

