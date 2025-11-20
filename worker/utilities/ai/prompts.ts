/**
 * AI Prompt Templates for Trip Planning
 * 
 * Specialized prompts designed for Cloudflare Workers AI models
 * Optimized for @cf/meta/llama-3.1-8b-instruct with structured JSON outputs
 */

export interface TripAnalysisInput {
  destination?: string;
  preferences: string;
  budget?: number;
  travelers: number;
  startDate?: string;
  endDate?: string;
  accommodation?: string;
  userLocation?: string;
  attractions?: Array<{ name: string; type?: string; address?: string; description?: string }>;
  restaurants?: Array<{ name: string; cuisine?: string; address?: string }>;
}

export interface TripUpdateInput {
  currentTrip: {
    destination?: string;
    preferences?: string;
    budget?: number;
    travelers?: number;
    itinerary?: any;
  };
  userMessage: string;
  userLocation?: string;
}

/**
 * Step 3: AI Preference Analysis
 * Analyzes user preferences and extracts structured travel intent
 */
export function buildPreferenceAnalysisPrompt(input: TripAnalysisInput): string {
  return `You are a professional travel planner AI assistant. Analyze the user's travel preferences and extract structured information.

User Preferences: "${input.preferences}"
Budget: ${input.budget ? `$${input.budget}` : 'Not specified'}
Travelers: ${input.travelers} ${input.travelers === 1 ? 'person' : 'people'}
Dates: ${input.startDate || 'Flexible'} to ${input.endDate || 'Flexible'}
Accommodation: ${input.accommodation || 'Any'}
User Location (starting point): ${input.userLocation || 'Unknown (latitude, longitude or city)'}

When analyzing, consider the user's starting location to suggest realistic travel options (flights, trains, nearby attractions).

Analyze the preferences and respond ONLY with valid JSON (no markdown, no explanation):
{
  "travelStyle": "adventure|luxury|budget|cultural|relaxation|family",
  "interests": ["nature", "food", "history", "adventure", "art", "nightlife"],
  "pacePreference": "slow|moderate|fast",
  "budgetLevel": "budget|moderate|luxury",
  "mustSeeAttractions": ["attraction name 1", "attraction name 2"],
  "dietaryNeeds": ["vegetarian", "halal", "none"],
  "transportPreferences": ["walking", "public_transport", "car", "bike"],
  "reasoning": "Brief two-sentence analysis of traveler preferences and starting location"
}`;
}

/**
 * Step 5: Itinerary Generation (Main AI Task)
 * Generates day-by-day detailed itinerary with activities
 */
export function buildItineraryGenerationPrompt(input: TripAnalysisInput, analysis: any): string {
  const duration = calculateTripDuration(input.startDate, input.endDate);
  const destination = input.destination || 'the chosen destination';
  
  // Build list of real attractions to use
  let attractionsList = '';
  if (input.attractions && input.attractions.length > 0) {
    attractionsList = '\n\nREAL ATTRACTIONS AVAILABLE (USE THESE EXACT NAMES):\n';
    input.attractions.slice(0, 20).forEach((attr, idx) => {
      attractionsList += `${idx + 1}. ${attr.name}${attr.type ? ` (${attr.type})` : ''}${attr.address ? ` - ${attr.address}` : ''}\n`;
    });
  }
  
  // Build list of real restaurants to use
  let restaurantsList = '';
  if (input.restaurants && input.restaurants.length > 0) {
    restaurantsList = '\n\nREAL RESTAURANTS AVAILABLE (USE THESE EXACT NAMES):\n';
    input.restaurants.slice(0, 15).forEach((rest, idx) => {
      restaurantsList += `${idx + 1}. ${rest.name}${rest.cuisine ? ` (${rest.cuisine})` : ''}${rest.address ? ` - ${rest.address}` : ''}\n`;
    });
  }
  
  return `You are an expert travel planner with deep knowledge of ${destination}. Create EXACTLY a ${duration}-day trip itinerary.

TRIP DETAILS:
- Destination: ${destination}
- Duration: EXACTLY ${duration} days (NOT MORE, NOT LESS)
- Travelers: ${input.travelers} ${input.travelers === 1 ? 'person' : 'people'}
- Budget: ${input.budget ? `$${input.budget}` : 'Moderate'}
- Travel Style: ${analysis?.travelStyle || 'balanced'}
- Interests: ${analysis?.interests?.join(', ') || 'general sightseeing'}
- Dates: ${input.startDate || 'Flexible'} to ${input.endDate || 'Flexible'}
- User Starting Location: ${input.userLocation || 'Unknown (latitude, longitude or city)'}
${attractionsList}${restaurantsList}

CRITICAL REQUIREMENTS:
1. Use ONLY the REAL place names listed above - DO NOT invent or use generic placeholders
2. Generate EXACTLY ${duration} days (days array must have ${duration} items, numbered 1 to ${duration})
3. Include specific addresses from the lists above when available
4. Mention actual restaurant names and attraction names from the lists provided
5. Provide at LEAST 4 detailed activities per day with exact times (e.g., 09:00, 12:30, 15:00, 20:00)
6. Each activity MUST mention a specific real place name from the lists above - do NOT use generic descriptions
7. Distribute attractions and restaurants across all days evenly
8. Tailor arrival/departure times based on the user's starting location when possible
9. DO NOT generate mock or placeholder data - only use places from the lists provided above

Respond ONLY with valid JSON (no markdown, no explanation). The values can be in any language; a separate step will translate for the user:
{
  "title": "Trip ${duration} days in ${destination}",
  "destination": "${destination}",
  "days": [
    {
      "day": 1,
      "title": "Arrival and Old Town",
      "activities": [
        "09:00: Visit [REAL PLACE NAME] - address",
        "12:30: Lunch at [REAL RESTAURANT]",
        "15:00: Explore [REAL DISTRICT/STREET]",
        "20:00: Dinner at [REAL RESTAURANT]"
      ]
    }
  ],
  "estimatedBudget": {
    "accommodation": ${Math.round(((input.budget || 1000) * 0.4) / duration)},
    "food": ${Math.round(((input.budget || 1000) * 0.3) / duration)},
    "activities": ${Math.round(((input.budget || 1000) * 0.2) / duration)},
    "transport": ${Math.round(((input.budget || 1000) * 0.1) / duration)},
    "total": ${input.budget || 1000}
  },
  "aiReasoning": "Why this plan fits the user preferences and destination",
  "highlights": ["Top real highlight 1", "Top real highlight 2", "Top real highlight 3"],
  "tips": ["Practical tip for ${destination}", "Transit tip", "Cultural or safety tip"]
}

REMEMBER: Generate EXACTLY ${duration} days, not more, not less!`;
}

/**
 * Step 6: Recommendations & Optimization
 * Optimizes the itinerary and adds specific venue recommendations
 */
export function buildRecommendationsPrompt(destination: string, itinerary: any, analysis: any, userLocation?: string): string {
  return `You are a local travel expert for ${destination} with deep knowledge of the city's restaurants, cafes, and hotels.

Destination: ${destination}
Itinerary: ${JSON.stringify(itinerary.days || [])}
Travel Style: ${analysis?.travelStyle || 'balanced'}
Interests: ${analysis?.interests?.join(', ') || 'general'}
Traveler Starting Location: ${userLocation || 'Unknown (coordinates or city name)'}

CRITICAL REQUIREMENTS:
1. Use ONLY REAL place names that actually exist in ${destination}
2. Include real restaurant names, cafe names, and hotel names
3. Mention real neighborhoods and districts in ${destination}
4. Provide 3-5 recommendations per category minimum

Examples of REAL places format:
- Restaurant: "Le Jules Verne" (Paris), "Nusr-Et" (Istanbul)
- Cafe: "Central Perk" (actual cafe name), "Cafe de Flore" (Paris)
- Hotel: "Ritz Hotel" (real hotel), "Four Seasons" (chain hotel)

Respond ONLY with valid JSON (no markdown):
{
  "restaurants": [
    {"name": "Real restaurant name", "cuisine": "Cuisine type", "priceRange": "$$", "bestFor": "lunch|dinner", "reason": "Why this restaurant is recommended"},
    {"name": "Second real restaurant name", "cuisine": "Cuisine type", "priceRange": "$$$", "bestFor": "dinner", "reason": "Recommendation reason"}
  ],
  "cafes": [
    {"name": "Real cafe name", "specialty": "Famous coffee/pastry", "location": "Real neighborhood name", "bestTime": "morning|afternoon"},
    {"name": "Second real cafe name", "specialty": "Specialty", "location": "Neighborhood", "bestTime": "afternoon"}
  ],
  "accommodations": [
    {"name": "Real hotel name", "type": "hotel|hostel|airbnb", "pricePerNight": 100, "neighborhood": "Real neighborhood name", "reason": "Why this accommodation is recommended"},
    {"name": "Second real hotel name", "type": "hotel", "pricePerNight": 150, "neighborhood": "Neighborhood", "reason": "Reason"}
  ],
  "transportation": {
    "bestOption": "public_transport|taxi|walking|bike",
    "passes": ["Real transit pass + price", "Second pass + price"],
    "tips": ["Practical local transit tip for ${destination}", "Another tip"]
  },
  "localTips": ["Real local tip for ${destination}", "Cultural/safety note", "Practical recommendation"]
}

REMEMBER: Use ONLY real place names from ${destination}, not generic examples!`;
}

/**
 * Trip Update with User Message
 * Intelligently modifies trip based on user's natural language request
 */
export function buildTripUpdatePrompt(input: TripUpdateInput): string {
  const currentDays = Array.isArray(input.currentTrip.itinerary) ? input.currentTrip.itinerary.length : 0;
  const destination = input.currentTrip.destination || 'Unknown';
  
  return `You are an expert travel planner for ${destination}. The user wants to modify their existing trip based on their message.

CURRENT TRIP DETAILS:
- Destination: ${destination}
- Budget: ${input.currentTrip.budget ? `$${input.currentTrip.budget}` : 'Not set'}
- Travelers: ${input.currentTrip.travelers || 1}
- Current Days: ${currentDays}
- Preferences: ${input.currentTrip.preferences || 'None'}
- User Location (starting point): ${input.userLocation || 'Unknown (coordinates or city name)'}
- Current Itinerary: ${JSON.stringify(input.currentTrip.itinerary || [])}

USER'S UPDATE REQUEST: "${input.userMessage}"

CRITICAL REQUIREMENTS:
1. Use REAL place names from ${destination} (actual restaurants, museums, landmarks, streets)
2. Maintain the EXACT day count unless user specifically requests more/fewer days
3. Include specific times and addresses (e.g., "09:00: Visit [REAL ATTRACTION] - address")
4. If user adds activities, integrate them with real place names
5. If user changes destination, use real places from the NEW destination
6. Suggest realistic transitions considering user's starting location when relevant

Example of REAL places:
- Paris: "Eiffel Tower", "Louvre Museum", "Le Jules Verne Restaurant"
- Tokyo: "Senso-ji Temple", "Tsukiji Market", "Ichiran Restaurant"
- Istanbul: "Blue Mosque", "Topkapi Palace", "Hamdi Restaurant"

Respond ONLY with valid JSON (no markdown). The values can be in any language; a separate step will translate for the user:
{
  "understood": "Clear summary of the user request",
  "modifications": {
    "destination": "new destination name or null if unchanged",
    "budget": "new number or null",
    "travelers": "new number or null",
    "preferences": "new text or null"
  },
  "updatedItinerary": [
    {
      "day": 1,
      "title": "Day title with REAL place names",
      "activities": [
        "09:00: Visit [REAL ATTRACTION] - address",
        "12:30: Lunch at [REAL RESTAURANT]",
        "15:00: [REAL ACTIVITY]",
        "20:00: Dinner at [REAL RESTAURANT]"
      ]
    }
  ],
  "aiReasoning": "Detailed explanation of what changed, why, and how the user's request was applied"
}

REMEMBER: 
- Keep ${currentDays} days unless user explicitly asks for more/fewer
- Use ONLY real place names from ${destination}
- Include specific times and addresses`;
}

/**
 * Geocoding Prompt (if external API not available)
 * Uses AI to suggest approximate coordinates for destinations
 */
export function buildGeocodingPrompt(destination: string): string {
  return `You are a geography expert. Provide the approximate geographic coordinates for this location.

Location: "${destination}"

Respond ONLY with valid JSON (no markdown):
{
  "destination": "${destination}",
  "coordinates": {
    "latitude": 0.0,
    "longitude": 0.0
  },
  "country": "Country name",
  "region": "Region/State name",
  "confidence": "high|medium|low"
}`;
}

/**
 * Helper: Calculate trip duration from dates
 * Returns the exact number of days between start and end dates (inclusive)
 */
function calculateTripDuration(startDate?: string, endDate?: string): number {
  if (!startDate || !endDate) {
    return 7; // Default 1 week
  }
  
  try {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    // Add 1 to make it inclusive (e.g., Jan 1 to Jan 3 = 3 days, not 2)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return Math.max(1, Math.min(diffDays, 30)); // Between 1 and 30 days
  } catch {
    return 7;
  }
}

/**
 * Post-processing: Extract JSON from AI response
 * Handles cases where AI returns markdown or extra text
 */
export function extractJSON(response: string): any {
  try {
    // Try direct parse first
    return JSON.parse(response);
  } catch {
    // Try to extract JSON from markdown code blocks
    const jsonMatch = response.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[1]);
    }
    
    // Try to find JSON object in text
    const objectMatch = response.match(/\{[\s\S]*\}/);
    if (objectMatch) {
      return JSON.parse(objectMatch[0]);
    }
    
    throw new Error('No valid JSON found in response');
  }
}

/**
 * Validate itinerary structure
 */
export function validateItinerary(data: any): boolean {
  if (!data || typeof data !== 'object') return false;
  if (!Array.isArray(data.days)) return false;
  if (data.days.length === 0) return false;
  
  // Check each day has required fields
  for (const day of data.days) {
    if (!day.day || !day.title || !Array.isArray(day.activities)) {
      return false;
    }
    if (day.activities.length === 0) return false;
  }
  
  return true;
}

/**
 * Generate fallback itinerary if AI fails
 */
export function generateFallbackItinerary(input: TripAnalysisInput): any {
  const destination = input.destination || 'Your Destination';
  const duration = calculateTripDuration(input.startDate, input.endDate);
  
  const days = [];
  for (let i = 1; i <= Math.min(duration, 7); i++) {
    days.push({
      day: i,
      title: i === 1 ? 'Arrival and Exploration' : i === duration ? 'Departure' : `Day ${i} Activities`,
      activities: [
        `09:00: Visit main attractions in ${destination}`,
        `14:00: Explore local markets and cultural sites`,
        `19:00: Enjoy local cuisine at recommended restaurants`
      ]
    });
  }
  
  return {
    title: `Trip to ${destination}`,
    destination,
    days,
    estimatedBudget: {
      accommodation: Math.round((input.budget || 1000) * 0.4),
      food: Math.round((input.budget || 1000) * 0.3),
      activities: Math.round((input.budget || 1000) * 0.2),
      transport: Math.round((input.budget || 1000) * 0.1),
      total: input.budget || 1000
    },
    aiReasoning: `A balanced ${duration}-day trip plan for ${destination} has been created based on your preferences.`,
    highlights: ['Local cuisine', 'Cultural experiences', 'Main attractions'],
    tips: ['Book attractions in advance', 'Try local foods', 'Learn basic local phrases']
  };
}

