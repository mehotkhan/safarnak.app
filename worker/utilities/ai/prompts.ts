/**
 * AI Prompt Templates for Trip Planning
 * 
 * Specialized prompts designed for Cloudflare Workers AI models
 * Optimized for structured JSON outputs with minimal hallucination
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
  attractions?: Array<{ name: string; type?: string; address?: string; description?: string; tags?: string[]; rating?: number }>;
  restaurants?: Array<{ name: string; cuisine?: string; address?: string; priceRange?: string; rating?: number }>;
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
 * Step 1: AI Preference Analysis
 * Analyzes user preferences and extracts structured travel intent
 * Less guessing, more structure
 */
export function buildPreferenceAnalysisPrompt(input: TripAnalysisInput): string {
  return `You are a professional travel planner AI assistant.

Your task:
- Read the user preferences.
- Infer a *minimal* structured profile.
- Do NOT invent details that are not clearly implied.

User Preferences (raw text): "${input.preferences}"
Budget: ${input.budget ? `$${input.budget}` : 'Not specified'}
Travelers: ${input.travelers} ${input.travelers === 1 ? 'person' : 'people'}
Dates: ${input.startDate || 'Flexible'} to ${input.endDate || 'Flexible'}
Accommodation: ${input.accommodation || 'Any'}
User Location (starting point): ${input.userLocation || 'Unknown (latitude, longitude or city)'}

Rules:
- If something is unclear, pick the closest reasonable label OR use "unknown"/empty array.
- Do NOT mention these rules in the output.
- Output MUST be valid JSON and parseable with JSON.parse (no comments, no trailing commas).

Respond ONLY with valid JSON (no markdown, no explanation), matching this shape EXACTLY:

{
  "travelStyle": "adventure|luxury|budget|cultural|relaxation|family|mixed",
  "interests": ["nature", "food", "history", "adventure", "art", "nightlife", "shopping", "beach"],
  "pacePreference": "slow|moderate|fast",
  "budgetLevel": "budget|moderate|luxury|unknown",
  "mustSeeAttractions": ["attraction name 1", "attraction name 2"],
  "dietaryNeeds": ["vegetarian", "vegan", "halal", "kosher", "gluten_free", "none"],
  "transportPreferences": ["walking", "public_transport", "car", "bike", "tour_bus"],
  "reasoning": "1–3 short sentences explaining the key preferences and how the starting location affects the trip"
}`;
}

/**
 * Step 2: Itinerary Generation (Main AI Task)
 * Generates day-by-day detailed itinerary with activities
 * Handles "no real places" case + realism
 */
export function buildItineraryGenerationPrompt(input: TripAnalysisInput, analysis: any): string {
  const duration = calculateTripDuration(input.startDate, input.endDate);
  const destination = input.destination || 'the chosen destination';

  const hasAttractions = !!(input.attractions && input.attractions.length);
  const hasRestaurants = !!(input.restaurants && input.restaurants.length);
  const hasRealPlaces = hasAttractions || hasRestaurants;

  // Build list of real attractions to use
  let attractionsList = '';
  if (hasAttractions) {
    attractionsList += '\n\n=== REAL ATTRACTIONS - YOU MUST USE THESE EXACT NAMES ===\n';
    input.attractions!.slice(0, 40).forEach((attr, idx) => {
      const parts: string[] = [`${idx + 1}. ${attr.name}`];
      if (attr.type) parts.push(`(${attr.type})`);
      if (attr.address) {
        // Use first part of address (usually the place name or street)
        const addrParts = attr.address.split(',');
        parts.push(`- ${addrParts[0].trim()}`);
      }
      if (attr.description) parts.push(`- ${attr.description}`);
      attractionsList += parts.join(' ') + '\n';
    });
    attractionsList += '\nCRITICAL: Every activity MUST reference one of these real attraction names above. Do NOT invent new place names.\n';
  }

  // Build list of real restaurants to use
  let restaurantsList = '';
  if (hasRestaurants) {
    restaurantsList += '\n\n=== REAL RESTAURANTS - YOU MUST USE THESE EXACT NAMES ===\n';
    input.restaurants!.slice(0, 30).forEach((rest, idx) => {
      const parts: string[] = [`${idx + 1}. ${rest.name}`];
      if (rest.cuisine) parts.push(`(${rest.cuisine})`);
      if (rest.address) {
        const addrParts = rest.address.split(',');
        parts.push(`- ${addrParts[0].trim()}`);
      }
      if (rest.priceRange) parts.push(`- ${rest.priceRange}`);
      restaurantsList += parts.join(' ') + '\n';
    });
    restaurantsList += '\nCRITICAL: Every meal activity MUST reference one of these real restaurant names above. Do NOT invent new restaurant names.\n';
  }

  const realPlacesRules = hasRealPlaces
    ? `CRITICAL RULES FOR USING REAL PLACES:
1. You MUST use ONLY the real place names listed in the sections above. Do NOT invent, guess, or create new place names.
2. Every single activity MUST reference at least one real attraction or restaurant from the provided lists.
3. Copy the exact names as written - do not modify, shorten, or paraphrase them.
4. If an activity mentions a place, it MUST be one from the lists above.
5. You can reuse places across multiple days if it makes sense, but vary the activities at each place.
6. If you cannot find a suitable place from the lists for a specific activity, choose the closest match from the lists rather than inventing a name.`
    : `1. Use well-known, realistic places and neighborhoods in ${destination} (landmarks, districts, real-looking venues).
2. Do NOT use placeholders like "[RESTAURANT]" or "Some Cafe". Always give a concrete name (even if it is an approximate guess).
3. Prefer famous, central, or plausible places over obscure random names.`;

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

REALISM RULES:
${realPlacesRules}
4. Respect realistic opening hours: museums typically 09:00–18:00, nightlife after 20:00 etc.
5. Avoid "teleporting": do not schedule far apart places with only 15–30 minutes between them.
6. Group activities by area/neighborhood to reduce back-and-forth.
7. Include reasonable breaks for food, rest, and transfers (no 10-hour non-stop blocks).
8. If arrival/departure times are unknown, assume midday arrival on day 1 and evening departure on the last day.

OUTPUT RULES:
- Generate EXACTLY ${duration} days (the "days" array MUST have ${duration} items, numbered 1 to ${duration}).
- Provide at least 4 detailed activities per day with exact times (e.g., "09:00", "13:30", "16:00", "20:00").
- Use clear, concise activity descriptions.

Respond ONLY with valid JSON (no markdown, no explanation). The values can be in any language; a separate step will translate for the user:

{
  "title": "Trip ${duration} days in ${destination}",
  "destination": "${destination}",
  "days": [
    {
      "day": 1,
      "title": "Arrival and Old Town",
      "activities": [
        "09:00: Visit [EXACT NAME FROM ATTRACTIONS LIST] - [address from list]",
        "12:30: Lunch at [EXACT NAME FROM RESTAURANTS LIST]",
        "15:00: Explore [EXACT NAME FROM ATTRACTIONS LIST]",
        "20:00: Dinner at [EXACT NAME FROM RESTAURANTS LIST]"
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
  "aiReasoning": "Why this plan fits the user preferences, budget level, and destination layout",
  "highlights": ["Top real highlight 1", "Top real highlight 2", "Top real highlight 3"],
  "tips": ["Practical tip for ${destination}", "Transit tip", "Cultural or safety tip"]
}`;
}

/**
 * Step 3: Recommendations & Optimization
 * Optimizes the itinerary and adds specific venue recommendations
 * Stop over-promising "ONLY real" data - bias toward plausible/known places
 */
export function buildRecommendationsPrompt(
  destination: string,
  itinerary: any,
  analysis: any,
  userLocation?: string
): string {
  return `You are a local travel expert for ${destination}.

Destination: ${destination}
Itinerary (day-by-day, may contain real place names already): ${JSON.stringify(itinerary.days || [])}
Travel Style: ${analysis?.travelStyle || 'balanced'}
Interests: ${analysis?.interests?.join(', ') || 'general'}
Traveler Starting Location: ${userLocation || 'Unknown (coordinates or city name)'}

Rules:
1. Prefer well-known, realistic restaurants, cafes, hotels, and neighborhoods in ${destination}.
2. Reuse or extend places already mentioned in the itinerary when it makes sense.
3. Avoid obvious placeholders like "Nice Restaurant", "Some Cafe", or "[PLACE]".
4. If you are not sure about a very specific venue, prefer a famous area + typical venue type rather than an invented name.
5. Keep prices and descriptions realistic for a traveler with the given budget level.

Respond ONLY with valid JSON (no markdown):

{
  "restaurants": [
    {
      "name": "Realistic restaurant name",
      "cuisine": "Cuisine type",
      "priceRange": "$|$$|$$$|$$$$",
      "bestFor": "lunch|dinner|breakfast",
      "reason": "Why this restaurant matches the itinerary and user style"
    }
  ],
  "cafes": [
    {
      "name": "Realistic cafe name",
      "specialty": "Famous coffee/pastry",
      "location": "Real or plausible neighborhood name",
      "bestTime": "morning|afternoon|evening"
    }
  ],
  "accommodations": [
    {
      "name": "Realistic hotel/apartment name",
      "type": "hotel|hostel|apartment|guesthouse",
      "pricePerNight": 100,
      "neighborhood": "Real or plausible neighborhood name",
      "reason": "Why this fits the budget and style"
    }
  ],
  "transportation": {
    "bestOption": "public_transport|taxi|walking|bike|mixed",
    "passes": ["Transit pass or card name + typical price"],
    "tips": ["Local transit tip for ${destination}", "Another practical tip"]
  },
  "localTips": [
    "Local etiquette or cultural tip",
    "Safety or scam avoidance tip",
    "Money-saving or time-saving tip"
  ]
}`;
}

/**
 * Trip Update with User Message
 * Intelligently modifies trip based on user's natural language request
 * Avoid full rewrites - keep day count and existing structure stable
 */
export function buildTripUpdatePrompt(input: TripUpdateInput): string {
  const currentDays = Array.isArray(input.currentTrip.itinerary)
    ? input.currentTrip.itinerary.length
    : 0;
  const destination = input.currentTrip.destination || 'Unknown';

  return `You are an expert travel planner for ${destination}. The user wants to modify an existing trip.

CURRENT TRIP:
- Destination: ${destination}
- Budget: ${input.currentTrip.budget ? `$${input.currentTrip.budget}` : 'Not set'}
- Travelers: ${input.currentTrip.travelers || 1}
- Current Days: ${currentDays}
- Preferences: ${input.currentTrip.preferences || 'None'}
- User Location: ${input.userLocation || 'Unknown (coordinates or city name)'}
- Current Itinerary (immutable snapshot): ${JSON.stringify(input.currentTrip.itinerary || [])}

USER'S UPDATE REQUEST:
"${input.userMessage}"

CRITICAL RULES:
1. Keep the number of days EXACTLY ${currentDays}, unless the user explicitly asks for more/fewer days.
2. Prefer minimal, precise changes: modify only the days/activities that need to change based on the request.
3. Preserve activities that the user did NOT complain about (do not rewrite the whole trip unless asked).
4. Always use realistic, concrete place names and times (e.g., "09:00: Visit [REAL ATTRACTION] - address").
5. If the user changes destination, switch all new activities to real places from the NEW destination.
6. Keep transitions realistic (no teleporting, respect meal times and opening hours).

Respond ONLY with valid JSON (no markdown). Values can be in any language:

{
  "understood": "Clear summary of the user request in 1–3 sentences",
  "modifications": {
    "destination": "new destination name or null if unchanged",
    "budget": 1234 | null,
    "travelers": 2 | null,
    "preferences": "new preferences text or null"
  },
  "updatedItinerary": [
    {
      "day": 1,
      "title": "Day title with realistic place names",
      "activities": [
        "09:00: Visit [REAL ATTRACTION] - address",
        "12:30: Lunch at [REAL RESTAURANT]",
        "15:00: [REAL ACTIVITY]",
        "20:00: Dinner at [REAL RESTAURANT]"
      ]
    }
  ],
  "aiReasoning": "Detailed explanation of what changed, which days were touched, and how the user request was applied while preserving as much of the original trip as possible"
}`;
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
