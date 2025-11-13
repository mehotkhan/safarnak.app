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

IMPORTANT: All text fields (reasoning, attractions) must be in Persian/Farsi (فارسی).
When analyzing, consider the user's starting location to suggest realistic travel options (flights, trains, nearby attractions).

Analyze the preferences and respond ONLY with valid JSON (no markdown, no explanation):
{
  "travelStyle": "adventure|luxury|budget|cultural|relaxation|family",
  "interests": ["nature", "food", "history", "adventure", "art", "nightlife"],
  "pacePreference": "slow|moderate|fast",
  "budgetLevel": "budget|moderate|luxury",
  "mustSeeAttractions": ["جاذبه اول", "جاذبه دوم"],
  "dietaryNeeds": ["vegetarian", "halal", "none"],
  "transportPreferences": ["walking", "public_transport", "car", "bike"],
  "reasoning": "تحلیل کوتاه دو جمله‌ای از خواسته‌های مسافر به فارسی که شامل اشاره به موقعیت فعلی کاربر نیز باشد"
}`;
}

/**
 * Step 5: Itinerary Generation (Main AI Task)
 * Generates day-by-day detailed itinerary with activities
 */
export function buildItineraryGenerationPrompt(input: TripAnalysisInput, analysis: any): string {
  const duration = calculateTripDuration(input.startDate, input.endDate);
  const destination = input.destination || 'the chosen destination';
  
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

CRITICAL REQUIREMENTS:
1. ALL text (title, activities, reasoning, highlights, tips) MUST be in Persian/Farsi (فارسی)
2. Use REAL place names from ${destination} (actual restaurants, museums, landmarks, streets)
3. Generate EXACTLY ${duration} days (days array must have ${duration} items, numbered 1 to ${duration})
4. Include specific addresses and real locations that exist in ${destination}
5. Mention actual restaurant names, hotel names, and attraction names from ${destination}
6. Provide at LEAST 4 detailed activities per day with exact times (صبح، ظهر، بعدازظهر، شب)
7. Tailor arrival/departure times based on the user's starting location when possible

Example of REAL places (use actual places like these):
- For Paris: "برج ایفل"، "موزه لوور"، "رستوران Le Jules Verne"
- For Tokyo: "معبد سنسوجی"، "بازار تسوکیجی"، "رستوران Ichiran"  
- For Istanbul: "مسجد آبی"، "کاخ توپکاپی"، "رستوران Hamdi"

Respond ONLY with valid JSON (no markdown, no explanation):
{
  "title": "سفر ${duration} روزه به ${destination}",
  "destination": "${destination}",
  "days": [
    {
      "day": 1,
      "title": "ورود و بازدید از مرکز تاریخی",
      "activities": [
        "صبح ۹:۰۰: بازدید از [نام واقعی جاذبه] - آدرس دقیق",
        "ظهر ۱۲:۳۰: ناهار در رستوران [نام واقعی] - غذای محلی معروف",
        "بعدازظهر ۳:۰۰: گشت و گذار در [نام واقعی خیابان/محله]",
        "غروب ۵:۳۰: فعالیت فرهنگی/هنری در [نام واقعی مکان]",
        "شب ۸:۰۰: شام در [نام واقعی رستوران]"
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
  "aiReasoning": "این برنامه ${duration} روزه برای ${destination} شامل بازدید از مهم‌ترین جاذبه‌ها و تجربه فرهنگ محلی است",
  "highlights": ["نام واقعی جاذبه برتر اول", "نام واقعی جاذبه برتر دوم", "نام واقعی جاذبه برتر سوم"],
  "tips": ["نکته کاربردی درباره ${destination}", "توصیه درباره حمل‌ونقل", "نکته فرهنگی یا ایمنی"]
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
Traveler Starting Location: ${userLocation || 'نامشخص (مختصات یا شهر)'}

CRITICAL REQUIREMENTS:
1. ALL text (reason, specialty, tips, neighborhoods) MUST be in Persian/Farsi (فارسی)
2. Use ONLY REAL place names that actually exist in ${destination}
3. Include real restaurant names, cafe names, and hotel names
4. Mention real neighborhoods and districts in ${destination}
5. Provide 3-5 recommendations per category minimum

Examples of REAL places format:
- Restaurant: "رستوران Le Jules Verne" (Paris), "رستوران Nusr-Et" (Istanbul)
- Cafe: "کافه Central Perk" (actual cafe name), "کافه فلور" (Cafe de Flore)
- Hotel: "هتل Ritz" (real hotel), "هتل Four Seasons" (chain hotel)

Respond ONLY with valid JSON (no markdown):
{
  "restaurants": [
    {"name": "نام واقعی رستوران", "cuisine": "نوع غذا", "priceRange": "$$", "bestFor": "lunch|dinner", "reason": "دلیل توصیه - چرا این رستوران خوب است"},
    {"name": "نام واقعی رستوران دوم", "cuisine": "نوع غذا", "priceRange": "$$$", "bestFor": "dinner", "reason": "دلیل توصیه"}
  ],
  "cafes": [
    {"name": "نام واقعی کافه", "specialty": "قهوه/شیرینی معروف", "location": "نام واقعی محله", "bestTime": "morning|afternoon"},
    {"name": "نام واقعی کافه دوم", "specialty": "تخصص", "location": "محله", "bestTime": "afternoon"}
  ],
  "accommodations": [
    {"name": "نام واقعی هتل", "type": "hotel|hostel|airbnb", "pricePerNight": 100, "neighborhood": "نام واقعی محله", "reason": "دلیل توصیه"},
    {"name": "نام واقعی هتل دوم", "type": "hotel", "pricePerNight": 150, "neighborhood": "محله", "reason": "دلیل"}
  ],
  "transportation": {
    "bestOption": "public_transport|taxi|walking|bike",
    "passes": ["نام واقعی کارت حمل‌ونقل و قیمت", "کارت دوم و قیمت"],
    "tips": ["نکته عملی درباره حمل‌ونقل در ${destination}", "نکته دوم"]
  },
  "localTips": ["نکته محلی واقعی درباره ${destination}", "نکته ایمنی یا فرهنگی", "توصیه کاربردی"]
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
- User Location (starting point): ${input.userLocation || 'نامشخص (مختصات یا شهر)'}
- Current Itinerary: ${JSON.stringify(input.currentTrip.itinerary || [])}

USER'S UPDATE REQUEST: "${input.userMessage}"

CRITICAL REQUIREMENTS:
1. ALL text (understood, titles, activities, reasoning) MUST be in Persian/Farsi (فارسی)
2. Use REAL place names from ${destination} (actual restaurants, museums, landmarks, streets)
3. Maintain the EXACT day count unless user specifically requests more/fewer days
4. Include specific times and addresses like: "صبح ۹:۰۰: بازدید از [نام واقعی جاذبه]"
5. If user adds activities, integrate them with real place names
6. If user changes destination, use real places from the NEW destination
7. Suggest realistic transitions considering user's starting location when relevant

Example of REAL places:
- Paris: "برج ایفل"، "موزه لوور"، "رستوران Le Jules Verne"
- Tokyo: "معبد سنسوجی"، "بازار تسوکیجی"، "رستوران Ichiran"  
- Istanbul: "مسجد آبی"، "کاخ توپکاپی"، "رستوران Hamdi"

Respond ONLY with valid JSON (no markdown):
{
  "understood": "خلاصه فارسی واضح از درخواست کاربر",
  "modifications": {
    "destination": "نام مقصد جدید یا null اگر تغییری نکرده",
    "budget": "عدد جدید یا null",
    "travelers": "عدد جدید یا null",
    "preferences": "متن جدید یا null"
  },
  "updatedItinerary": [
    {
      "day": 1,
      "title": "عنوان روز با اسامی واقعی",
      "activities": [
        "صبح ۹:۰۰: بازدید از [نام واقعی جاذبه] - آدرس",
        "ظهر ۱۲:۳۰: ناهار در [نام واقعی رستوران]",
        "بعدازظهر ۳:۰۰: [فعالیت واقعی]",
        "شب ۸:۰۰: شام در [نام واقعی رستوران]"
      ]
    }
  ],
  "aiReasoning": "توضیح دقیق تغییرات: چه چیزی تغییر کرد، چرا، و چگونه درخواست کاربر اعمال شد"
}

REMEMBER: 
- Keep ${currentDays} days unless user explicitly asks for more/fewer
- Use ONLY real place names from ${destination}
- All text in Persian (فارسی)
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

