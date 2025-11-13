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

IMPORTANT: All text fields (reasoning, attractions) must be in Persian/Farsi (فارسی).

Analyze the preferences and respond ONLY with valid JSON (no markdown, no explanation):
{
  "travelStyle": "adventure|luxury|budget|cultural|relaxation|family",
  "interests": ["nature", "food", "history", "adventure", "art", "nightlife"],
  "pacePreference": "slow|moderate|fast",
  "budgetLevel": "budget|moderate|luxury",
  "mustSeeAttractions": ["جاذبه اول", "جاذبه دوم"],
  "dietaryNeeds": ["vegetarian", "halal", "none"],
  "transportPreferences": ["walking", "public_transport", "car", "bike"],
  "reasoning": "تحلیل کوتاه دو جمله‌ای از خواسته‌های مسافر به فارسی"
}`;
}

/**
 * Step 5: Itinerary Generation (Main AI Task)
 * Generates day-by-day detailed itinerary with activities
 */
export function buildItineraryGenerationPrompt(input: TripAnalysisInput, analysis: any): string {
  const duration = calculateTripDuration(input.startDate, input.endDate);
  const destination = input.destination || 'the chosen destination';
  
  return `You are a professional travel itinerary planner. Create a detailed ${duration}-day trip itinerary for ${destination}.

Destination: ${destination}
Travelers: ${input.travelers} ${input.travelers === 1 ? 'person' : 'people'}
Budget: ${input.budget ? `$${input.budget}` : 'Moderate'}
Travel Style: ${analysis?.travelStyle || 'balanced'}
Interests: ${analysis?.interests?.join(', ') || 'general sightseeing'}
Dates: ${input.startDate || 'Flexible'} to ${input.endDate || 'Flexible'}

CRITICAL: All text content (title, activities, reasoning, highlights, tips) MUST be written in Persian/Farsi (فارسی).
Create a realistic, well-paced itinerary with specific attractions, restaurants, and activities.

Respond ONLY with valid JSON (no markdown, no explanation):
{
  "title": "سفر به ${destination}",
  "destination": "${destination}",
  "days": [
    {
      "day": 1,
      "title": "عنوان روز به فارسی (مثال: ورود و مرکز تاریخی)",
      "activities": [
        "صبح: فعالیت با مکان مشخص و پیشنهاد زمانی",
        "بعدازظهر: فعالیت با مکان مشخص",
        "شب: فعالیت با توصیه رستوران یا مکان"
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
  "aiReasoning": "توضیح 2-3 جمله‌ای به فارسی درباره اینکه چرا این برنامه سفر متناسب با نیازهای مسافر است",
  "highlights": ["نکته برجسته اول", "نکته برجسته دوم", "نکته برجسته سوم"],
  "tips": ["نکته کاربردی اول", "نکته کاربردی دوم", "نکته کاربردی سوم"]
}`;
}

/**
 * Step 6: Recommendations & Optimization
 * Optimizes the itinerary and adds specific venue recommendations
 */
export function buildRecommendationsPrompt(destination: string, itinerary: any, analysis: any): string {
  return `You are a local travel expert for ${destination}. Provide specific venue recommendations.

Destination: ${destination}
Itinerary: ${JSON.stringify(itinerary.days || [])}
Travel Style: ${analysis?.travelStyle || 'balanced'}
Interests: ${analysis?.interests?.join(', ') || 'general'}

CRITICAL: All text content (reason, specialty, tips, location names) MUST be in Persian/Farsi (فارسی).
Add specific venue recommendations with Persian descriptions.

Respond ONLY with valid JSON (no markdown):
{
  "restaurants": [
    {"name": "نام رستوران", "cuisine": "نوع غذا", "priceRange": "$$", "bestFor": "lunch|dinner", "reason": "دلیل توصیه به فارسی"}
  ],
  "cafes": [
    {"name": "نام کافه", "specialty": "قهوه/شیرینی", "location": "منطقه", "bestTime": "morning|afternoon"}
  ],
  "accommodations": [
    {"name": "نام هتل", "type": "hotel|hostel|airbnb", "pricePerNight": 100, "neighborhood": "نام محله", "reason": "دلیل توصیه به فارسی"}
  ],
  "transportation": {
    "bestOption": "public_transport|taxi|walking|bike",
    "passes": ["کارت ۷ روزه مترو: ۳۵ دلار", "کارت توریستی شهر: ۵۰ دلار"],
    "tips": ["نکته حمل‌ونقل به فارسی", "نکته دوم به فارسی"]
  },
  "localTips": ["نکته محلی اول", "نکته محلی دوم", "نکته ایمنی/فرهنگی"]
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

CRITICAL: All text content (understood, titles, activities, reasoning) MUST be in Persian/Farsi (فارسی).
Understand what the user wants and generate updated trip data in Persian.

Respond ONLY with valid JSON (no markdown):
{
  "understood": "خلاصه فارسی از درخواست کاربر",
  "modifications": {
    "destination": "New destination if changed, or null",
    "budget": "New budget if changed, or null",
    "travelers": "New number if changed, or null",
    "preferences": "Updated preferences if changed, or null"
  },
  "updatedItinerary": [
    {
      "day": 1,
      "title": "عنوان روز به فارسی",
      "activities": ["فعالیت اول", "فعالیت دوم", "فعالیت سوم"]
    }
  ],
  "aiReasoning": "توضیح تغییرات انجام شده بر اساس درخواست کاربر به فارسی"
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
  const destination = input.destination || 'مقصد شما';
  const duration = calculateTripDuration(input.startDate, input.endDate);
  
  const days = [];
  for (let i = 1; i <= Math.min(duration, 7); i++) {
    days.push({
      day: i,
      title: i === 1 ? 'ورود و کاوش' : i === duration ? 'خروج' : `فعالیت‌های روز ${i}`,
      activities: [
        `صبح: بازدید از جاذبه‌های اصلی ${destination}`,
        `بعدازظهر: بازدید از بازارهای محلی و مکان‌های فرهنگی`,
        `شب: لذت بردن از غذاهای محلی در رستوران‌های پیشنهادی`
      ]
    });
  }
  
  return {
    title: `سفر به ${destination}`,
    destination,
    days,
    estimatedBudget: {
      accommodation: Math.round((input.budget || 1000) * 0.4),
      food: Math.round((input.budget || 1000) * 0.3),
      activities: Math.round((input.budget || 1000) * 0.2),
      transport: Math.round((input.budget || 1000) * 0.1),
      total: input.budget || 1000
    },
    aiReasoning: `یک برنامه سفر متعادل ${duration} روزه برای ${destination} بر اساس ترجیحات شما ایجاد شد.`,
    highlights: ['غذاهای محلی', 'تجربیات فرهنگی', 'جاذبه‌های اصلی'],
    tips: ['جاذبه‌ها را از قبل رزرو کنید', 'غذاهای محلی را امتحان کنید', 'عبارات ابتدایی محلی را یاد بگیرید']
  };
}

