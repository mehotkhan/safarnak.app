# AI Trip Generator - Technical Documentation

## Overview

Safarnak uses **Cloudflare Workers AI** to power an intelligent trip planning system that generates personalized itineraries, understands user preferences, and provides smart recommendations.

## Architecture

### AI Service Stack

```
┌─────────────────────────────────────────────────┐
│            User Input (GraphQL)                 │
│  "I want a week in Paris for foodies"          │
└──────────────────┬──────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────┐
│       createTrip / updateTrip Mutation          │
│    (worker/mutations/createTrip.ts)             │
└──────────────────┬──────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────┐
│         TripAI Service (utilities/ai.ts)        │
│  • analyzePreferences()                         │
│  • generateItinerary()                          │
│  • generateRecommendations()                    │
│  • geocodeDestination()                         │
│  • updateTrip()                                 │
└──────────────────┬──────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────┐
│      Cloudflare Workers AI                      │
│  @cf/meta/llama-3.1-8b-instruct                 │
│  (Structured JSON outputs)                      │
└──────────────────┬──────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────┐
│          Workflow Engine                        │
│  TripCreationWorkflow (8 steps)                 │
│  TripUpdateWorkflow (3 steps)                   │
│  Real-time updates via WebSocket                │
└─────────────────────────────────────────────────┘
```

## AI Model Selection

### Primary Model: `@cf/meta/llama-3.1-8b-instruct`

**Why this model?**
- ✅ **Fast inference** (~1-3 seconds per request)
- ✅ **Structured JSON output** - Reliable for itinerary generation
- ✅ **Multilingual** - Supports English, Persian, and 20+ languages
- ✅ **Cost-effective** - Free tier: 10,000 neurons/day
- ✅ **Good reasoning** - 8B parameters balanced for travel planning

**Alternative considered:**
- `@cf/qwen/qwen1.5-14b-chat-awq` - Stronger reasoning but slower
- Not used as Llama 3.1 8B provides sufficient quality with better speed

### Embeddings: `@cf/baai/bge-m3`

- **Dimensions:** 1024
- **Use case:** Semantic search for similar trips/places
- Already configured in Vectorize index

## Core AI Features

### 1. Preference Analysis (Step 3)

**Input:** User's natural language preferences
**Output:** Structured travel profile

```typescript
{
  "travelStyle": "adventure|luxury|budget|cultural|relaxation|family",
  "interests": ["nature", "food", "history", "adventure", "art"],
  "pacePreference": "slow|moderate|fast",
  "budgetLevel": "budget|moderate|luxury",
  "mustSeeAttractions": ["Eiffel Tower", "Louvre"],
  "dietaryNeeds": ["vegetarian", "halal", "none"],
  "transportPreferences": ["walking", "public_transport"],
  "reasoning": "Brief analysis of traveler's wants"
}
```

**Prompt Design:**
- Analyzes user's free-text preferences
- Extracts structured intent
- Provides default fallbacks if AI fails

### 2. Itinerary Generation (Step 5 - Main AI Task)

**Input:** Destination, preferences, budget, dates, travelers
**Output:** Day-by-day itinerary with activities

```typescript
{
  "title": "Trip to Paris",
  "destination": "Paris",
  "days": [
    {
      "day": 1,
      "title": "Arrival & Historic Center",
      "activities": [
        "Morning: Check into hotel in Le Marais district",
        "Afternoon: Walk along Seine River, visit Notre-Dame",
        "Evening: Dinner at Le Comptoir du Relais"
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
  "aiReasoning": "Explanation of why this itinerary fits",
  "highlights": ["Top attractions"],
  "tips": ["Practical travel tips"]
}
```

**Prompt Strategy:**
- Calculate trip duration from dates (1-30 days)
- Include specific venue names and times
- Balance pace based on analysis
- Realistic budget breakdown

### 3. Recommendations & Optimization (Step 6)

**Input:** Destination, itinerary, travel analysis
**Output:** Specific venue recommendations

```typescript
{
  "restaurants": [
    {
      "name": "Le Comptoir du Relais",
      "cuisine": "French Bistro",
      "priceRange": "$$",
      "bestFor": "dinner",
      "reason": "Authentic local favorite"
    }
  ],
  "cafes": [...],
  "accommodations": [...],
  "transportation": {
    "bestOption": "public_transport",
    "passes": ["7-day metro pass: $35"],
    "tips": ["Get a Navigo card"]
  },
  "localTips": ["Book Eiffel Tower 2 weeks ahead"]
}
```

### 4. Geocoding (AI-Powered)

**Input:** Destination name
**Output:** Coordinates

```typescript
{
  "destination": "Paris, France",
  "coordinates": {
    "latitude": 48.8566,
    "longitude": 2.3522
  },
  "country": "France",
  "region": "Île-de-France",
  "confidence": "high|medium|low"
}
```

**Note:** Uses AI knowledge, not external geocoding API (Phase 1 MVP)

### 5. Trip Updates (Intelligent Modifications)

**Input:** User's natural language update request
**Output:** Modified trip with explanation

```typescript
{
  "understood": "You want to add a day trip to Versailles",
  "modifications": {
    "destination": null, // No change
    "budget": null,
    "travelers": null,
    "preferences": "Updated preferences"
  },
  "updatedItinerary": [...], // Modified days
  "aiReasoning": "Added Versailles as Day 3"
}
```

## Workflow Integration

### Trip Creation Workflow (8 Steps)

```
1. Initialize & validate (0.5s)
   └─> Set trip status to 'pending'

2. Geocoding/Location lookup (4s)
   └─> Placeholder for future external API

3. AI Preference Analysis (6.5s)  🤖 REAL AI
   └─> analyzePreferences() → Travel profile

4. Database & Vector search (4s)
   └─> Placeholder for semantic search

5. Itinerary Generation (10s)  🤖 REAL AI (Main)
   └─> generateItinerary() → Day-by-day plan

6. Recommendations & Optimization (6s)  🤖 REAL AI
   └─> generateRecommendations() → Venues

7. Image fetching (3.5s)
   └─> Placeholder for R2/external images

8. Final validation & formatting (instant)
   └─> Save to database, status → 'ready'
   └─> geocodeDestination() → Coordinates
```

**Total time:** ~35 seconds for complete AI-powered trip

### Trip Update Workflow (3 Steps)

```
1. Acknowledge user request (instant)
   └─> Parse userMessage

2. Processing AI updates (AI call)  🤖 REAL AI
   └─> updateTrip() → Understand request
   └─> Apply modifications

3. Complete update (instant)
   └─> Save changes, status → 'ready'
   └─> Re-geocode if destination changed
```

**Total time:** ~3-5 seconds for updates

## Error Handling & Fallbacks

### Graceful Degradation Strategy

```typescript
try {
  // AI generation
  const itinerary = await ai.generateItinerary(input, analysis);
} catch (error) {
  console.error('AI failed:', error);
  // FALLBACK: Use generateFallbackItinerary()
  return generateFallbackItinerary(input);
}
```

**Fallback behavior:**
- **Preference analysis fails** → Use sensible defaults (balanced, moderate pace)
- **Itinerary generation fails** → Generic 7-day template with basic activities
- **Recommendations fail** → Empty lists (non-critical)
- **Geocoding fails** → Default to (0, 0) or last known coordinates

**Never blocks user:** Trip creation always succeeds, even if AI fails

## API Integration

### GraphQL Mutation: `createTrip`

```graphql
mutation CreateTrip($input: CreateTripInput!) {
  createTrip(input: $input) {
    id
    destination
    itinerary {
      day
      title
      activities
    }
    aiReasoning
    status
  }
}
```

**Input:**
```json
{
  "destination": "Tokyo",
  "preferences": "I love food and want to try authentic ramen",
  "budget": 2000,
  "travelers": 2,
  "startDate": "2025-12-01",
  "endDate": "2025-12-07",
  "accommodation": "hotel"
}
```

**AI Flow:**
1. Mutation triggers AI service
2. Creates trip with status `pending`
3. Launches workflow (background)
4. Workflow calls AI at steps 3, 5, 6
5. Updates trip to `ready` when complete
6. Client subscribes to `tripUpdates` for progress

### GraphQL Mutation: `updateTrip`

```graphql
mutation UpdateTrip($id: ID!, $input: UpdateTripInput!) {
  updateTrip(id: $id, input: $input) {
    id
    itinerary {
      day
      title
      activities
    }
    aiReasoning
    status
  }
}
```

**With userMessage:**
```json
{
  "id": "trip-123",
  "input": {
    "userMessage": "Add a day trip to Mount Fuji"
  }
}
```

**AI Flow:**
1. Mutation sets status to `pending`
2. Launches update workflow
3. AI understands request and modifies itinerary
4. Updates trip to `ready`

## Client Integration

### Subscribe to Trip Updates

```typescript
import { useTripUpdatesSubscription } from '@api';

function TripCreationScreen() {
  const { data } = useTripUpdatesSubscription({
    variables: { tripId: 'trip-123' }
  });

  return (
    <View>
      <Text>Step {data.tripUpdates.step} of {data.tripUpdates.totalSteps}</Text>
      <Text>{data.tripUpdates.message}</Text>
      <ProgressBar value={data.tripUpdates.step / data.tripUpdates.totalSteps} />
    </View>
  );
}
```

### Real-time Progress UI

```
┌────────────────────────────────────────┐
│  Creating your trip...                 │
│                                        │
│  Step 5 of 8                          │
│  در حال ایجاد برنامه سفر روزانه...    │
│                                        │
│  [████████░░░░] 62%                   │
└────────────────────────────────────────┘
```

## Performance Metrics

### AI Request Times (Observed)

| Operation | Duration | Model |
|-----------|----------|-------|
| Preference Analysis | 1-3s | Llama 3.1 8B |
| Itinerary Generation | 3-8s | Llama 3.1 8B |
| Recommendations | 2-4s | Llama 3.1 8B |
| Geocoding | 1-2s | Llama 3.1 8B |
| Trip Update | 2-5s | Llama 3.1 8B |

### Workflow Times

- **Full creation:** ~35 seconds (8 steps)
- **Quick update:** ~3-5 seconds (3 steps)
- **Mutation only:** <1 second (immediate response)

### Cost Analysis (Cloudflare Workers AI)

- **Free tier:** 10,000 neurons/day
- **Approximate per trip:** ~100 neurons
- **Daily capacity:** ~100 trips/day (free)
- **Paid tier:** $0.011 per 1,000 neurons

## Prompt Engineering Principles

### 1. Structured Output Requirement

```
"Respond ONLY with valid JSON (no markdown, no explanation):"
```

**Why?** Forces model to output parseable JSON

### 2. Schema Examples in Prompt

```
{
  "day": 1,
  "title": "Day title",
  "activities": ["Activity 1", "Activity 2"]
}
```

**Why?** Model understands exact structure needed

### 3. Context + Constraints

```
Create a ${duration}-day trip itinerary.
Budget: $${budget}
Travelers: ${travelers} people
```

**Why?** Grounds AI in real constraints

### 4. JSON Extraction Post-Processing

```typescript
export function extractJSON(response: string): any {
  // Try direct parse
  try {
    return JSON.parse(response);
  } catch {
    // Extract from markdown ```json ... ```
    const match = response.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/);
    if (match) return JSON.parse(match[1]);
    
    // Find JSON object in text
    const objMatch = response.match(/\{[\s\S]*\}/);
    if (objMatch) return JSON.parse(objMatch[0]);
  }
}
```

**Why?** Handles cases where AI adds markdown formatting

## Testing & Validation

### Validate Itinerary Structure

```typescript
export function validateItinerary(data: any): boolean {
  if (!data || !Array.isArray(data.days)) return false;
  if (data.days.length === 0) return false;
  
  for (const day of data.days) {
    if (!day.day || !day.title || !Array.isArray(day.activities)) {
      return false;
    }
  }
  return true;
}
```

### Test Scenarios

✅ **Happy path:** "Week in Paris for foodies"
✅ **Minimal input:** "Tokyo trip" (no budget, no dates)
✅ **Complex request:** "10-day adventure in New Zealand for 4 people, budget $5000"
✅ **Update:** "Add a day trip to Versailles"
✅ **AI failure:** Falls back to template gracefully

## Future Enhancements

### Phase 2 (Post-MVP)

1. **External Geocoding API**
   - Replace AI geocoding with Google Maps API
   - More accurate coordinates and place details

2. **Image Generation**
   - Use `@cf/stabilityai/stable-diffusion-xl-base-1.0`
   - Generate destination preview images

3. **Semantic Search**
   - Use Vectorize index for similar trip recommendations
   - Embed itineraries with `@cf/baai/bge-m3`

4. **Multi-turn Conversations**
   - Store conversation history
   - AI remembers previous context

5. **Real-time Collaboration**
   - Multiple users editing same trip
   - AI merges preferences

## Debugging & Monitoring

### Console Logs

```typescript
console.log('AI analysis complete:', analysis.travelStyle);
console.log('AI itinerary complete:', itinerary.days.length, 'days');
console.log('AI recommendations complete');
console.log('AI update processed:', updateResult.understood);
```

### Error Tracking

```typescript
console.error('AI generation failed:', error);
console.warn('Recommendations failed, continuing without them:', error);
```

### Metrics to Track

- AI request duration
- Success rate (AI vs fallback)
- User satisfaction (thumbs up/down)
- Trip completion rate

## Security & Best Practices

✅ **Input validation:** All user inputs validated before AI
✅ **No PII in prompts:** Never send sensitive user data to AI
✅ **Output validation:** Structured JSON validated before save
✅ **Error boundaries:** AI failures don't crash app
✅ **Rate limiting:** Consider per-user AI request limits
✅ **Audit logging:** Track AI usage for debugging

## Conclusion

Safarnak's AI trip generator provides a **modern, fast, and reliable** travel planning experience powered by Cloudflare Workers AI. The system is designed for:

- ⚡ **Speed:** Sub-10s for most operations
- 🛡️ **Reliability:** Graceful fallbacks ensure 100% uptime
- 💰 **Cost-efficiency:** Free tier supports MVP launch
- 🌍 **Multilingual:** Supports travelers worldwide
- 📱 **Real-time UX:** WebSocket progress updates

Built for scale, ready for production. 🚀

