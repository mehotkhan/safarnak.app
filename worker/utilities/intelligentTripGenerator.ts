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
  const matchedAttractions = await searchAttractionsByPreferences(
    env,
    request.destination,
    request.preferences,
    request.duration * 4 // 4 attractions per day max
  );
  
  console.log(`[Generator] Matched ${matchedAttractions.length} attractions via semantic search`);
  
  // Step 2: Select best restaurants
  const selectedRestaurants = selectRestaurants(
    destinationData.restaurants,
    validation.metadata.costLevel,
    request.duration
  );
  
  // Step 3: Generate day-by-day itinerary
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
  const attractionsPerDay = Math.ceil(attractions.length / request.duration);
  
  for (let dayNum = 1; dayNum <= request.duration; dayNum++) {
    const dayAttractions = attractions.slice(
      (dayNum - 1) * attractionsPerDay,
      dayNum * attractionsPerDay
    );
    
    const activities: Activity[] = [];
    let currentTime = 9; // Start at 9 AM
    let dailyCost = 0;
    
    // Morning activities
    for (let i = 0; i < Math.min(2, dayAttractions.length); i++) {
      const attr = dayAttractions[i];
      activities.push({
        time: `${String(Math.floor(currentTime)).padStart(2, '0')}:${String(Math.floor((currentTime % 1) * 60)).padStart(2, '0')}`,
        title: `Visit ${attr.name}`,
        location: attr.name,
        coords: attr.coords,
        duration: attr.duration || 90,
        cost: attr.cost || 0,
        type: 'attraction',
        description: `Explore ${attr.type} attraction`,
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
    for (let i = 2; i < dayAttractions.length; i++) {
      const attr = dayAttractions[i];
      activities.push({
        time: `${String(Math.floor(currentTime)).padStart(2, '0')}:${String(Math.floor((currentTime % 1) * 60)).padStart(2, '0')}`,
        title: `Explore ${attr.name}`,
        location: attr.name,
        coords: attr.coords,
        duration: attr.duration || 60,
        cost: attr.cost || 0,
        type: 'attraction',
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
      if (activity.type === 'attraction' || activity.type === 'food') {
        waypoints.push({
          latitude: activity.coords.lat,
          longitude: activity.coords.lon,
          label: activity.location,
          order: order++,
        });
      }
    }
  }
  
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

