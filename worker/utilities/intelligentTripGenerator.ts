/**
 * Intelligent Trip Generator
 * 
 * Generates personalized trip itineraries using:
 * 1. Researched real destination data (from cache)
 * 2. Semantic matching of user preferences
 * 3. AI synthesis with strict validation
 * 4. Real place verification and geocoding
 * 
 * This replaces the old template-based generator with a data-driven approach.
 */

import type { Env } from '../types';
import type { DestinationData, Attraction, Restaurant } from './destinationResearch';
import type { ValidationResult } from './tripValidator';
import { searchAttractionsByPreferences } from './destinationResearch';

export interface GeneratedTrip {
  title: string;
  destination: string;
  days: DayPlan[];
  estimatedBudget: {
    accommodation: number;
    food: number;
    activities: number;
    transport: number;
    total: number;
  };
  aiReasoning: string;
  highlights: string[];
  tips: string[];
  waypoints: Array<{
    latitude: number;
    longitude: number;
    label: string;
    order: number;
  }>;
}

export interface DayPlan {
  day: number;
  title: string;
  activities: Activity[];
  estimatedCost: number;
}

export interface Activity {
  time: string;
  title: string;
  location: string;
  coords: { lat: number; lon: number };
  duration: number; // minutes
  cost: number; // USD
  type: 'attraction' | 'food' | 'transport' | 'rest';
  description?: string;
}

export interface TripGenerationRequest {
  destination: string;
  duration: number;
  budget: number;
  travelers: number;
  preferences: string;
  userLocation?: string;
  lang?: string;
}

/**
 * Generate intelligent trip itinerary
 */
export async function generateIntelligentTrip(
  env: Env,
  request: TripGenerationRequest,
  destinationData: DestinationData,
  validation: ValidationResult
): Promise<GeneratedTrip> {
  console.log(`[Generator] Starting intelligent trip generation for ${request.destination}`);
  
  // Step 1: Match attractions to user preferences using semantic search
  let matchedAttractions = await searchAttractionsByPreferences(
    env,
    request.destination,
    request.preferences,
    request.duration * 4 // 4 attractions per day max
  );
  
  // If we have very few attractions, use ALL available attractions
  if (matchedAttractions.length < request.duration * 2) {
    console.log(`[Generator] Limited semantic matches (${matchedAttractions.length}), using all attractions`);
    matchedAttractions = destinationData.attractions;
  }
  
  console.log(`[Generator] Using ${matchedAttractions.length} attractions for ${request.duration} days`);
  
  // Step 2: Select best restaurants
  const selectedRestaurants = selectRestaurants(
    destinationData.restaurants,
    validation.metadata.costLevel,
    request.duration
  );
  
  // Step 3: If still insufficient data, enhance with AI-generated suggestions
  if (matchedAttractions.length < request.duration * 2) {
    console.log('[Generator] Insufficient OSM data, enhancing with AI suggestions...');
    const aiEnhanced = await enhanceWithAI(env, request, destinationData, matchedAttractions);
    matchedAttractions = aiEnhanced.attractions;
  }
  
  // Step 4: Generate day-by-day itinerary
  const days = await generateDayPlans(
    env,
    request,
    matchedAttractions,
    selectedRestaurants,
    destinationData,
    validation
  );
  
  // Step 4: Calculate budget breakdown
  const estimatedBudget = calculateBudget(days, request.duration, request.travelers, validation);
  
  // Step 5: Extract waypoints from activities
  const waypoints = extractWaypoints(days);
  
  // Step 6: Generate AI reasoning and tips
  const { aiReasoning, highlights, tips } = await generateMetadata(
    env,
    request,
    days,
    destinationData,
    validation
  );
  
  return {
    title: `${request.duration}-Day ${request.destination} Adventure`,
    destination: request.destination,
    days,
    estimatedBudget,
    aiReasoning,
    highlights,
    tips,
    waypoints,
  };
}

/**
 * Enhance with AI-generated attractions when OSM data is insufficient
 */
async function enhanceWithAI(
  env: Env,
  request: TripGenerationRequest,
  destinationData: DestinationData,
  existingAttractions: Attraction[]
): Promise<{ attractions: Attraction[] }> {
  try {
    const prompt = `You are a travel expert. Suggest ${request.duration * 3} must-visit attractions in ${request.destination} for a ${request.duration}-day trip.

User preferences: ${request.preferences}
Budget level: ${request.budget ? `$${request.budget}` : 'moderate'}

Respond with ONLY valid JSON (no markdown):
{
  "attractions": [
    {
      "name": "exact place name",
      "type": "historical|museum|park|religious|entertainment|shopping|nature",
      "description": "brief description",
      "estimatedCost": cost in USD,
      "duration": minutes to visit,
      "tags": ["tag1", "tag2"]
    }
  ]
}`;

    const aiResponse: any = await env.AI.run('@cf/meta/llama-3.1-8b-instruct-fp8', {
      prompt,
      max_tokens: 1024,
      temperature: 0.7,
    });

    const text = typeof aiResponse === 'string' ? aiResponse : 
                 aiResponse?.response || aiResponse?.generated_text || '{}';
    
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const data = jsonMatch ? JSON.parse(jsonMatch[0]) : { attractions: [] };

    // Geocode each AI-suggested attraction
    const { geocodePlaceInDestination } = await import('./geocode');
    const enhancedAttractions: Attraction[] = [];

    for (const aiAttr of data.attractions || []) {
      try {
        const result = await geocodePlaceInDestination(
          aiAttr.name,
          request.destination
        );

        if (result) {
          enhancedAttractions.push({
            id: `${request.destination.toLowerCase()}-ai-${aiAttr.name.toLowerCase().replace(/\s+/g, '-')}`,
            name: result.label || aiAttr.name,
            type: aiAttr.type || 'entertainment',
            coords: { lat: result.latitude, lon: result.longitude },
            rating: 4.0 + Math.random() * 0.5,
            cost: aiAttr.estimatedCost || 0,
            duration: aiAttr.duration || 90,
            tags: aiAttr.tags || [],
            description: aiAttr.description,
          });
        }
      } catch (err) {
        console.warn(`[Generator] Failed to geocode AI attraction ${aiAttr.name}:`, err);
      }
    }

    console.log(`[Generator] AI enhanced with ${enhancedAttractions.length} additional attractions`);

    // Combine existing + AI-enhanced
    return {
      attractions: [...existingAttractions, ...enhancedAttractions],
    };
  } catch (error) {
    console.error('[Generator] AI enhancement failed:', error);
    return { attractions: existingAttractions };
  }
}

/**
 * Generate detailed day plans with real places and realistic timing
 */
async function generateDayPlans(
  env: Env,
  request: TripGenerationRequest,
  attractions: Attraction[],
  restaurants: Restaurant[],
  destinationData: DestinationData,
  validation: ValidationResult
): Promise<DayPlan[]> {
  const days: DayPlan[] = [];
  
  // Ensure we have at least some attractions
  if (attractions.length === 0) {
    console.warn('[Generator] No attractions available, creating minimal itinerary');
    // Create a minimal day with destination center
    for (let dayNum = 1; dayNum <= request.duration; dayNum++) {
      days.push({
        day: dayNum,
        title: `Day ${dayNum} - Explore ${request.destination}`,
        activities: [{
          time: '09:00',
          title: `Explore ${request.destination}`,
          location: request.destination,
          coords: destinationData.facts.coordinates,
          duration: 240,
          cost: 0,
          type: 'attraction',
          description: 'Free exploration day',
        }],
        estimatedCost: 50,
      });
    }
    return days;
  }
  
  const attractionsPerDay = Math.max(2, Math.ceil(attractions.length / request.duration));
  
  for (let dayNum = 1; dayNum <= request.duration; dayNum++) {
    const dayAttractions = attractions.slice(
      (dayNum - 1) * attractionsPerDay,
      dayNum * attractionsPerDay
    );
    
    const activities: Activity[] = [];
    let currentTime = 9; // Start at 9 AM
    let dailyCost = 0;
    
    // Morning activities (at least 1-2 attractions)
    const morningCount = Math.min(2, dayAttractions.length);
    for (let i = 0; i < morningCount; i++) {
      const attr = dayAttractions[i];
      activities.push({
        time: `${String(Math.floor(currentTime)).padStart(2, '0')}:${String(Math.floor((currentTime % 1) * 60)).padStart(2, '0')}`,
        title: `Visit ${attr.name}`,
        location: attr.name,
        coords: attr.coords,
        duration: attr.duration || 90,
        cost: attr.cost || 0,
        type: 'attraction',
        description: attr.description || `Explore ${attr.type} attraction`,
      });
      
      dailyCost += attr.cost || 0;
      currentTime += (attr.duration || 90) / 60 + 0.5; // Activity + travel time
    }
    
    // Lunch
    if (restaurants.length > 0) {
      const restaurant = restaurants[dayNum % restaurants.length];
      const lunchCost = validation.metadata.costLevel === 'budget' ? 10 :
                        validation.metadata.costLevel === 'mid' ? 20 : 40;
      
      activities.push({
        time: `${String(Math.floor(currentTime)).padStart(2, '0')}:${String(Math.floor((currentTime % 1) * 60)).padStart(2, '0')}`,
        title: `Lunch at ${restaurant.name}`,
        location: restaurant.name,
        coords: restaurant.coords,
        duration: 60,
        cost: lunchCost * request.travelers,
        type: 'food',
        description: `${restaurant.cuisine} cuisine`,
      });
      
      dailyCost += lunchCost * request.travelers;
      currentTime += 1.5;
    }
    
    // Afternoon activities
    const afternoonCount = dayAttractions.length - morningCount;
    for (let i = 0; i < afternoonCount; i++) {
      const attr = dayAttractions[morningCount + i];
      activities.push({
        time: `${String(Math.floor(currentTime)).padStart(2, '0')}:${String(Math.floor((currentTime % 1) * 60)).padStart(2, '0')}`,
        title: `Explore ${attr.name}`,
        location: attr.name,
        coords: attr.coords,
        duration: attr.duration || 60,
        cost: attr.cost || 0,
        type: 'attraction',
        description: attr.description || `Visit ${attr.type} site`,
      });
      
      dailyCost += attr.cost || 0;
      currentTime += (attr.duration || 60) / 60 + 0.5;
    }
    
    // Dinner
    if (restaurants.length > 0) {
      const restaurant = restaurants[(dayNum + 1) % restaurants.length];
      const dinnerCost = validation.metadata.costLevel === 'budget' ? 15 :
                         validation.metadata.costLevel === 'mid' ? 30 : 60;
      
      activities.push({
        time: `${String(Math.floor(currentTime)).padStart(2, '0')}:${String(Math.floor((currentTime % 1) * 60)).padStart(2, '0')}`,
        title: `Dinner at ${restaurant.name}`,
        location: restaurant.name,
        coords: restaurant.coords,
        duration: 90,
        cost: dinnerCost * request.travelers,
        type: 'food',
        description: `${restaurant.cuisine} dining experience`,
      });
      
      dailyCost += dinnerCost * request.travelers;
    }
    
    days.push({
      day: dayNum,
      title: dayNum === 1 ? 'Arrival & Exploration' :
             dayNum === request.duration ? 'Final Day & Departure' :
             `Day ${dayNum} Adventures`,
      activities,
      estimatedCost: dailyCost,
    });
  }
  
  return days;
}

/**
 * Select restaurants based on cost level and variety
 */
function selectRestaurants(
  restaurants: Restaurant[],
  costLevel: 'budget' | 'mid' | 'luxury',
  duration: number
): Restaurant[] {
  const priceMap = {
    budget: ['$', '$$'],
    mid: ['$$', '$$$'],
    luxury: ['$$$', '$$$$'],
  };
  
  const suitable = restaurants.filter(r => 
    priceMap[costLevel].includes(r.priceRange)
  );
  
  // Return enough for 2 meals per day
  return suitable.slice(0, duration * 2);
}

/**
 * Calculate realistic budget breakdown
 */
function calculateBudget(
  days: DayPlan[],
  duration: number,
  travelers: number,
  validation: ValidationResult
): GeneratedTrip['estimatedBudget'] {
  const activitiesCost = days.reduce((sum, day) => sum + day.estimatedCost, 0);
  
  const accommodationPerNight = validation.metadata.costLevel === 'budget' ? 30 :
                                 validation.metadata.costLevel === 'mid' ? 80 : 200;
  const accommodation = accommodationPerNight * duration * travelers;
  
  const transportDaily = validation.metadata.costLevel === 'budget' ? 10 :
                         validation.metadata.costLevel === 'mid' ? 20 : 50;
  const transport = transportDaily * duration * travelers;
  
  return {
    accommodation,
    food: Math.round(activitiesCost * 0.6), // Food is ~60% of daily activities cost
    activities: Math.round(activitiesCost * 0.4),
    transport,
    total: accommodation + activitiesCost + transport,
  };
}

/**
 * Extract waypoints from day plans
 */
function extractWaypoints(days: DayPlan[]): GeneratedTrip['waypoints'] {
  const waypoints: GeneratedTrip['waypoints'] = [];
  let order = 1;
  
  for (const day of days) {
    for (const activity of day.activities) {
      // Include all activities with valid coordinates
      if (activity.coords && activity.coords.lat !== 0 && activity.coords.lon !== 0) {
        waypoints.push({
          latitude: activity.coords.lat,
          longitude: activity.coords.lon,
          label: activity.location || activity.title,
          order: order++,
        });
      }
    }
  }
  
  console.log(`[Generator] Extracted ${waypoints.length} waypoints from ${days.length} days`);
  
  return waypoints;
}

/**
 * Generate AI reasoning, highlights, and tips
 */
async function generateMetadata(
  env: Env,
  request: TripGenerationRequest,
  days: DayPlan[],
  destinationData: DestinationData,
  validation: ValidationResult
): Promise<{ aiReasoning: string; highlights: string[]; tips: string[] }> {
  try {
    const attractions = days.flatMap(d => 
      d.activities.filter(a => a.type === 'attraction').map(a => a.location)
    ).slice(0, 5);
    
    const prompt = `You are a travel expert. Based on this ${request.duration}-day trip to ${request.destination}, provide:

Trip includes: ${attractions.join(', ')}
User preferences: ${request.preferences}
Budget level: ${validation.metadata.costLevel}

Respond with JSON only:
{
  "reasoning": "2-3 sentence explanation of why this itinerary matches the user's preferences",
  "highlights": ["highlight 1", "highlight 2", "highlight 3"],
  "tips": ["practical tip 1", "practical tip 2", "practical tip 3"]
}`;
    
    const aiResponse: any = await env.AI.run('@cf/meta/llama-3.1-8b-instruct-fp8', {
      prompt,
      max_tokens: 512,
      temperature: 0.7,
    });
    
    const text = typeof aiResponse === 'string' ? aiResponse : 
                 aiResponse?.response || aiResponse?.generated_text || '{}';
    
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const data = jsonMatch ? JSON.parse(jsonMatch[0]) : {};
    
    return {
      aiReasoning: data.reasoning || `Personalized ${request.duration}-day itinerary for ${request.destination}`,
      highlights: data.highlights || attractions.slice(0, 3),
      tips: data.tips || ['Book attractions in advance', 'Try local cuisine', 'Use public transport'],
    };
  } catch (error) {
    console.error('[Generator] Failed to generate metadata:', error);
    return {
      aiReasoning: `Customized ${request.duration}-day trip to ${request.destination}`,
      highlights: ['Cultural experiences', 'Local cuisine', 'Historical sites'],
      tips: ['Stay hydrated', 'Respect local customs', 'Keep emergency contacts handy'],
    };
  }
}

