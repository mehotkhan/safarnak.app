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

Analyze the preferences and respond ONLY with valid JSON (no markdown, no explanation):
{
  "travelStyle": "adventure|luxury|budget|cultural|relaxation|family",
  "interests": ["nature", "food", "history", "adventure", "art", "nightlife"],
  "pacePreference": "slow|moderate|fast",
  "budgetLevel": "budget|moderate|luxury",
  "mustSeeAttractions": ["attraction1", "attraction2"],
  "dietaryNeeds": ["vegetarian", "halal", "none"],
  "transportPreferences": ["walking", "public_transport", "car", "bike"],
  "reasoning": "Brief 2-sentence analysis of what the traveler wants"
}`;
}

/**
 * Step 5: Itinerary Generation (Main AI Task)
 * Generates day-by-day detailed itinerary with activities
 */
export function buildItineraryGenerationPrompt(input: TripAnalysisInput, analysis: any): string {
  const duration = calculateTripDuration(input.startDate, input.endDate);
  const destination = input.destination || 'the chosen destination';
  
  return `You are a professional travel itinerary planner. Create a detailed ${duration}-day trip itinerary.

Destination: ${destination}
Travelers: ${input.travelers} ${input.travelers === 1 ? 'person' : 'people'}
Budget: ${input.budget ? `$${input.budget}` : 'Moderate'}
Travel Style: ${analysis?.travelStyle || 'balanced'}
Interests: ${analysis?.interests?.join(', ') || 'general sightseeing'}
Dates: ${input.startDate || 'Flexible'} to ${input.endDate || 'Flexible'}

Create a realistic, well-paced itinerary. Include specific attractions, restaurants, and activities.

Respond ONLY with valid JSON (no markdown, no explanation):
{
  "title": "Trip to ${destination}",
  "destination": "${destination}",
  "days": [
    {
      "day": 1,
      "title": "Day title (e.g., Arrival & Historic Center)",
      "activities": [
        "Morning: Activity with specific location and time suggestion",
        "Afternoon: Activity with specific location",
        "Evening: Activity with restaurant/venue recommendation"
      ]
    }
  ],
  "estimatedBudget": {
    "accommodation": 500,
    "food": 300,
    "activities": 200,
    "transport": 100,
    "total": 1100
  },
  "aiReasoning": "2-3 sentence explanation of why this itinerary fits the traveler's needs",
  "highlights": ["Top highlight 1", "Top highlight 2", "Top highlight 3"],
  "tips": ["Practical tip 1", "Practical tip 2", "Practical tip 3"]
}`;
}

/**
 * Step 6: Recommendations & Optimization
 * Optimizes the itinerary and adds specific venue recommendations
 */
export function buildRecommendationsPrompt(destination: string, itinerary: any, analysis: any): string {
  return `You are a local travel expert. Optimize this trip itinerary and add specific recommendations.

Destination: ${destination}
Itinerary: ${JSON.stringify(itinerary.days || [])}
Travel Style: ${analysis?.travelStyle || 'balanced'}
Interests: ${analysis?.interests?.join(', ') || 'general'}

Add specific venue recommendations and optimize the schedule.

Respond ONLY with valid JSON (no markdown):
{
  "restaurants": [
    {"name": "Restaurant Name", "cuisine": "Type", "priceRange": "$$", "bestFor": "lunch|dinner", "reason": "Why recommended"}
  ],
  "cafes": [
    {"name": "Cafe Name", "specialty": "Coffee/Pastries", "location": "Area", "bestTime": "morning|afternoon"}
  ],
  "accommodations": [
    {"name": "Hotel/Hostel Name", "type": "hotel|hostel|airbnb", "pricePerNight": 100, "neighborhood": "Area name", "reason": "Why recommended"}
  ],
  "transportation": {
    "bestOption": "public_transport|taxi|walking|bike",
    "passes": ["7-day metro pass: $35", "City tourist card: $50"],
    "tips": ["Transportation tip 1", "Transportation tip 2"]
  },
  "localTips": ["Local insider tip 1", "Local insider tip 2", "Safety/cultural tip"]
}`;
}

/**
 * Trip Update with User Message
 * Intelligently modifies trip based on user's natural language request
 */
export function buildTripUpdatePrompt(input: TripUpdateInput): string {
  return `You are a travel planning assistant. The user wants to modify their trip.

Current Trip:
- Destination: ${input.currentTrip.destination || 'Unknown'}
- Preferences: ${input.currentTrip.preferences || 'None'}
- Budget: ${input.currentTrip.budget || 'Not set'}
- Travelers: ${input.currentTrip.travelers || 1}
- Current Itinerary: ${JSON.stringify(input.currentTrip.itinerary || [])}

User Request: "${input.userMessage}"

Understand what the user wants to change and generate updated trip data.

Respond ONLY with valid JSON (no markdown):
{
  "understood": "Brief restatement of what user wants to change",
  "modifications": {
    "destination": "New destination if changed, or null",
    "budget": "New budget if changed, or null",
    "travelers": "New number if changed, or null",
    "preferences": "Updated preferences if changed, or null"
  },
  "updatedItinerary": [
    {
      "day": 1,
      "title": "Day title",
      "activities": ["Activity 1", "Activity 2", "Activity 3"]
    }
  ],
  "aiReasoning": "Explanation of changes made based on user request"
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
 */
function calculateTripDuration(startDate?: string, endDate?: string): number {
  if (!startDate || !endDate) {
    return 7; // Default 1 week
  }
  
  try {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
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
      title: i === 1 ? 'Arrival & Exploration' : i === duration ? 'Departure' : `Day ${i} Activities`,
      activities: [
        `Morning: Explore ${destination}'s main attractions`,
        `Afternoon: Visit local markets and cultural sites`,
        `Evening: Enjoy local cuisine at recommended restaurants`
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
    aiReasoning: `Created a balanced ${duration}-day itinerary for ${destination} based on your preferences.`,
    highlights: ['Local cuisine', 'Cultural experiences', 'Main attractions'],
    tips: ['Book attractions in advance', 'Try local food', 'Learn basic local phrases']
  };
}

