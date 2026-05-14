# AI Trip Generator - Comprehensive Testing Checklist

## Pre-Testing Setup

### Environment Preparation
- [ ] Worker running with AI binding enabled (`yarn worker:dev`)
- [ ] Expo dev server running (`yarn start`)
- [ ] Database migrations applied (`yarn db:migrate`)
- [ ] GraphiQL accessible at `http://localhost:8787/graphql`
- [ ] Network inspector open (browser dev tools)

### Configuration Verification
- [ ] `wrangler.jsonc` has `ai` binding configured
- [ ] Worker binding `AI` is available in `Env` interface
- [ ] All AI models are accessible via Workers AI
- [ ] KV, D1, R2, Vectorize bindings working

---

## 🎯 Phase 1: Basic Functionality Tests

### Test 1.1: Simple Weekend Trip
**Scenario:** Quick weekend getaway
```graphql
mutation TestSimpleTrip {
  createTrip(input: {
    destination: "Paris"
    preferences: "Quick weekend trip, see main sights"
    budget: 800
    travelers: 2
    startDate: "2026-01-10"
    endDate: "2026-01-12"
    accommodation: "hotel"
  }) {
    id
    destination
    status
    itinerary { day title activities }
    aiReasoning
  }
}
```

**Expected Results:**
- [ ] Trip created with `status: "pending"`
- [ ] Workflow starts immediately
- [ ] AI uses FAST/PRIMARY model (not ADVANCED)
- [ ] Itinerary has 2-3 days
- [ ] Activities are Paris-specific (Eiffel Tower, Louvre, etc.)
- [ ] Total workflow time: <15 seconds
- [ ] Status changes to `"ready"` when complete
- [ ] No errors in worker logs

### Test 1.2: Week-Long Standard Trip
**Scenario:** Standard 7-day vacation
```graphql
mutation TestStandardTrip {
  createTrip(input: {
    destination: "Tokyo"
    preferences: "Food lover, interested in ramen, sushi, street food, temples"
    budget: 2500
    travelers: 2
    startDate: "2026-03-01"
    endDate: "2026-03-07"
  }) {
    id
    itinerary { day title activities }
    coordinates { latitude longitude }
  }
}
```

**Expected Results:**
- [ ] AI uses PRIMARY model
- [ ] Itinerary has 7 days
- [ ] Food-focused activities (ramen shops, sushi restaurants)
- [ ] Temple visits included
- [ ] Coordinates are Tokyo-specific (35.6762, 139.6503)
- [ ] Total time: 15-18 seconds
- [ ] Recommendations include specific restaurant names

### Test 1.3: Complex Luxury Trip
**Scenario:** Long luxury vacation with detailed preferences
```graphql
mutation TestLuxuryTrip {
  createTrip(input: {
    destination: "Maldives"
    preferences: "Luxury honeymoon, spa treatments, water sports, fine dining, romantic sunset experiences, private excursions, we love seafood and wine, prefer quiet relaxation over parties"
    budget: 12000
    travelers: 2
    startDate: "2026-06-15"
    endDate: "2026-06-25"
    accommodation: "resort"
  }) {
    id
    itinerary { day title activities }
    aiReasoning
  }
}
```

**Expected Results:**
- [ ] AI uses ADVANCED model (automatic selection)
- [ ] Log shows: "using ADVANCED model"
- [ ] Itinerary has 10 days
- [ ] Luxury activities (spa, private dining, sunset cruises)
- [ ] No party/nightlife recommendations
- [ ] Slow pace, romantic focus
- [ ] Total time: 18-25 seconds
- [ ] aiReasoning mentions "honeymoon" and "luxury"

### Test 1.4: Budget Backpacking
**Scenario:** Low-budget long trip
```graphql
mutation TestBackpackingTrip {
  createTrip(input: {
    destination: "Thailand"
    preferences: "Backpacking, budget travel, hostels, street food, beaches, meeting locals"
    budget: 600
    travelers: 1
    startDate: "2026-02-01"
    endDate: "2026-02-14"
  }) {
    id
    itinerary { day title activities }
  }
}
```

**Expected Results:**
- [ ] PRIMARY model used
- [ ] Itinerary has 14 days
- [ ] Budget-friendly activities (free beaches, street food)
- [ ] Hostel recommendations (not luxury resorts)
- [ ] Public transport focus
- [ ] Low-cost or free activities emphasized

### Test 1.5: Family Trip
**Scenario:** Family with kids
```graphql
mutation TestFamilyTrip {
  createTrip(input: {
    destination: "Orlando"
    preferences: "Family with two kids ages 6 and 9, theme parks, kid-friendly activities, need rest time"
    budget: 4000
    travelers: 4
    startDate: "2026-07-10"
    endDate: "2026-07-17"
  }) {
    id
    itinerary { day title activities }
  }
}
```

**Expected Results:**
- [ ] Theme park days included (Disney, Universal)
- [ ] Rest days/half-days for kids
- [ ] Kid-friendly restaurants
- [ ] Family accommodations recommended
- [ ] Moderate pace (not rushed)
- [ ] Age-appropriate activities

---

## 🎯 Phase 2: Form Data Validation

### Test 2.1: Required Fields Only
```graphql
mutation TestMinimalData {
  createTrip(input: {
    preferences: "I want to explore a new city"
    travelers: 1
  }) {
    id
    destination
  }
}
```

**Expected Results:**
- [ ] Trip created successfully
- [ ] Destination defaults or prompts for one
- [ ] Budget assumed moderate
- [ ] Dates flexible (7-day default)
- [ ] No errors or crashes

### Test 2.2: All Optional Fields
```graphql
mutation TestAllFields {
  createTrip(input: {
    destination: "Barcelona"
    preferences: "Architecture, food, beaches"
    budget: 2000
    travelers: 2
    startDate: "2026-05-01"
    endDate: "2026-05-07"
    accommodation: "airbnb"
  }) {
    id
    destination
    budget
    travelers
    accommodation
  }
}
```

**Expected Results:**
- [ ] All fields saved to database
- [ ] accommodation field = "airbnb"
- [ ] Budget correctly stored
- [ ] Start/end dates used for duration calculation

### Test 2.3: Invalid/Edge Case Data
```graphql
mutation TestEdgeCases {
  createTrip(input: {
    destination: ""
    preferences: "x"
    budget: -100
    travelers: 0
    startDate: "invalid-date"
    endDate: "2026-01-01"
  }) {
    id
  }
}
```

**Expected Results:**
- [ ] Validation errors shown clearly
- [ ] Empty destination handled gracefully
- [ ] Negative budget rejected or defaulted
- [ ] Zero travelers rejected
- [ ] Invalid dates cause error or default

### Test 2.4: Null/Undefined Values
```graphql
mutation TestNullValues {
  createTrip(input: {
    destination: null
    preferences: "Travel"
    travelers: 1
  }) {
    id
  }
}
```

**Expected Results:**
- [ ] Null values don't crash worker
- [ ] Defaults applied where needed
- [ ] Trip still created successfully

---

## 🎯 Phase 3: AI Model Selection

### Test 3.1: Verify Fast Model Usage
**Check logs for:**
```
✅ AI request completed in 1500ms (model: @cf/meta/llama-3.1-8b-instruct, task: preference_analysis)
✅ AI request completed in 1200ms (model: @cf/meta/llama-3.1-8b-instruct, task: geocoding)
```

- [ ] Fast model used for preference analysis
- [ ] Fast model used for geocoding
- [ ] Response time < 2s per call

### Test 3.2: Verify Primary Model Usage
**For standard trips:**
```
✅ AI request completed in 4200ms (model: @cf/meta/llama-3.1-8b-instruct, task: itinerary_generation)
```

- [ ] Primary model used for standard trips
- [ ] Response time 3-5s

### Test 3.3: Verify Advanced Model Usage
**For complex trips:**
```
Itinerary generation: using ADVANCED model
✅ AI request completed in 8500ms (model: @cf/qwen/qwen1.5-14b-chat-awq, task: itinerary_generation)
```

- [ ] Advanced model selected automatically
- [ ] Log confirms "using ADVANCED model"
- [ ] Response time 8-12s
- [ ] Better quality output (more detailed)

### Test 3.4: Model Fallback
**Disable advanced model temporarily to test:**
- [ ] Falls back to primary model
- [ ] No errors or crashes
- [ ] User still gets valid itinerary

---

## 🎯 Phase 4: Parallel Execution

### Test 4.1: Step 2 Parallelism
**Monitor logs for:**
```
✅ Parallel AI analysis complete: {travelStyle: 'adventure', coordinates: {...}, parallelTime: '~2-3s'}
```

- [ ] Analysis and geocoding run simultaneously
- [ ] Total step time ~2-3s (not 4-5s)
- [ ] Both results available after Promise.all
- [ ] No race conditions

### Test 4.2: Step 4 Parallelism
**Monitor logs for:**
```
✅ Parallel recommendations complete: {restaurants: 5, parallelTime: '~3-4s'}
```

- [ ] Recommendations and embeddings (placeholder) run in parallel
- [ ] Total step time ~3-4s
- [ ] Error in one doesn't block other

### Test 4.3: Error Handling in Parallel
**Force error in one thread:**
- [ ] Other thread completes successfully
- [ ] Error caught and logged
- [ ] Workflow continues
- [ ] Fallback data provided for failed thread

---

## 🎯 Phase 5: Real-Time Updates

### Test 5.1: WebSocket Subscription
**Subscribe before creating trip:**
```graphql
subscription {
  tripUpdates(tripId: "test-trip-id") {
    step
    totalSteps
    title
    message
    status
  }
}
```

- [ ] Subscription connects successfully
- [ ] Updates received for all 5 steps
- [ ] Persian messages displayed correctly
- [ ] Status changes: processing → completed
- [ ] No duplicate messages

### Test 5.2: Progress Tracking
- [ ] Step 1/5 received
- [ ] Step 2/5 received
- [ ] Step 3/5 received  
- [ ] Step 4/5 received
- [ ] Step 5/5 received
- [ ] Progress bar can be calculated (step/totalSteps)

### Test 5.3: Mobile Client UI
**In React Native app:**
- [ ] Progress bar updates smoothly
- [ ] Persian text renders correctly
- [ ] Step titles make sense
- [ ] Completion notification shows
- [ ] User can navigate away and return

---

## 🎯 Phase 6: Performance

### Test 6.1: Simple Trip Performance
- [ ] Total time < 15 seconds
- [ ] AI analysis: <2s
- [ ] Geocoding: <2s
- [ ] Itinerary: <5s
- [ ] Recommendations: <4s
- [ ] Database save: <1s

### Test 6.2: Complex Trip Performance
- [ ] Total time < 25 seconds
- [ ] Advanced model: 8-12s
- [ ] Other steps same as simple

### Test 6.3: Concurrent Trips
**Create 5 trips simultaneously:**
- [ ] All complete successfully
- [ ] No timeouts
- [ ] No database conflicts
- [ ] Reasonable response times maintained

### Test 6.4: Stress Test
**Create 20 trips in 1 minute:**
- [ ] All workflows complete
- [ ] No worker crashes
- [ ] Cloudflare AI quota not exceeded
- [ ] Database handles load

---

## 🎯 Phase 7: Error Handling & Fallbacks

### Test 7.1: AI Timeout
**Simulate slow AI response:**
- [ ] Timeout detected
- [ ] Fallback itinerary used
- [ ] User gets valid trip (even if basic)
- [ ] Error logged but not shown to user

### Test 7.2: Invalid JSON from AI
**AI returns malformed JSON:**
- [ ] JSON extraction attempts all formats
- [ ] Falls back to template if all fail
- [ ] Trip still created
- [ ] Log shows JSON parsing error

### Test 7.3: Database Connection Lost
- [ ] Error caught gracefully
- [ ] Retry attempted
- [ ] User sees meaningful error message
- [ ] Workflow can be restarted

### Test 7.4: Workflow Interruption
**Stop worker mid-workflow:**
- [ ] Trip remains in "pending" state
- [ ] Can be resumed or recreated
- [ ] No corrupted data
- [ ] Clear error in logs

---

## 🎯 Phase 8: Trip Updates

### Test 8.1: Simple Update
```graphql
mutation {
  updateTrip(
    id: "trip-123"
    input: {
      userMessage: "Add a day trip to Versailles"
    }
  ) {
    id
    itinerary { day title activities }
  }
}
```

**Expected Results:**
- [ ] AI understands request
- [ ] New day added to itinerary
- [ ] Versailles trip included
- [ ] Update workflow completes in 3-5s
- [ ] Status: pending → ready

### Test 8.2: Complex Update
```graphql
mutation {
  updateTrip(
    id: "trip-123"
    input: {
      userMessage: "Change to vegetarian restaurants and add more museums"
    }
  ) {
    id
    itinerary { day title activities }
    aiReasoning
  }
}
```

**Expected Results:**
- [ ] AI extracts two modifications
- [ ] Restaurants updated to vegetarian
- [ ] More museum visits added
- [ ] aiReasoning explains changes
- [ ] Original structure preserved

---

## 🎯 Phase 9: Data Persistence

### Test 9.1: Verify Database Save
**After trip creation, query database:**
```typescript
const trip = await db.select().from(trips).where(eq(trips.id, tripId)).get();
```

- [ ] All form fields saved
- [ ] itinerary JSON is valid
- [ ] Coordinates saved correctly
- [ ] Waypoints array saved
- [ ] metadata contains recommendations
- [ ] status = "ready"
- [ ] timestamps set correctly

### Test 9.2: Query Trip Data
```graphql
query {
  getTrip(id: "trip-123") {
    id
    destination
    itinerary { day title activities }
    coordinates { latitude longitude }
    waypoints { latitude longitude label }
  }
}
```

- [ ] All data returned correctly
- [ ] JSON fields parsed properly
- [ ] No null/undefined values where not expected

---

## 🎯 Phase 10: Edge Cases

### Test 10.1: Same-Day Trip
```graphql
mutation {
  createTrip(input: {
    destination: "Local city"
    preferences: "Day trip"
    startDate: "2026-01-15"
    endDate: "2026-01-15"
    travelers: 1
  }) {
    itinerary { day activities }
  }
}
```

- [ ] Handles 1-day trip correctly
- [ ] Single day itinerary generated
- [ ] Activities appropriate for day trip

### Test 10.2: Very Long Trip
```graphql
mutation {
  createTrip(input: {
    destination: "Around the world"
    preferences: "Long backpacking trip"
    startDate: "2026-01-01"
    endDate: "2026-03-31"
    travelers: 1
  }) {
    itinerary { day title }
  }
}
```

- [ ] Handles 90-day trip (or caps at 30)
- [ ] Reasonable itinerary structure
- [ ] Doesn't timeout
- [ ] Uses advanced model

### Test 10.3: Non-English Destination
```graphql
mutation {
  createTrip(input: {
    destination: "京都" // Kyoto in Japanese
    preferences: "Traditional Japanese experience"
    travelers: 2
  }) {
    destination
    itinerary { day activities }
  }
}
```

- [ ] Non-Latin characters handled
- [ ] AI understands destination
- [ ] Itinerary is culturally appropriate

---

## ✅ Success Criteria

### Must Pass (Blocking Issues)
- [ ] All Phase 1 tests pass (basic functionality)
- [ ] Phase 2 tests pass (form validation)
- [ ] Phase 7 tests pass (error handling)
- [ ] No crashes or unhandled errors
- [ ] Database integrity maintained

### Should Pass (Important but not blocking)
- [ ] Phase 3 tests pass (model selection)
- [ ] Phase 4 tests pass (parallel execution)
- [ ] Phase 5 tests pass (real-time updates)
- [ ] Phase 6 performance targets met

### Nice to Have (Enhancements)
- [ ] Phase 8 tests pass (updates)
- [ ] Phase 9 tests pass (data persistence)
- [ ] Phase 10 edge cases handled

---

## 📊 Test Results Template

```
Date: _______________
Tester: _______________
Environment: Development / Staging / Production

Phase 1: __ / 5 passed
Phase 2: __ / 4 passed
Phase 3: __ / 4 passed
Phase 4: __ / 3 passed
Phase 5: __ / 3 passed
Phase 6: __ / 4 passed
Phase 7: __ / 4 passed
Phase 8: __ / 2 passed
Phase 9: __ / 2 passed
Phase 10: __ / 3 passed

Total: __ / 38 tests passed

Blocking Issues: _______________
Notes: _______________
```

---

## 🚀 Next Steps After Testing

1. **If all tests pass:**
   - [ ] Document any performance improvements
   - [ ] Update README with new workflow info
   - [ ] Deploy to staging environment
   - [ ] Run smoke tests in staging
   - [ ] Deploy to production

2. **If tests fail:**
   - [ ] Document failed tests
   - [ ] Create GitHub issues for each failure
   - [ ] Prioritize fixes (blocking → important → nice-to-have)
   - [ ] Fix and re-test
   - [ ] Update this checklist with lessons learned

3. **Post-deployment monitoring:**
   - [ ] Monitor Cloudflare AI usage (stay under free tier)
   - [ ] Track average workflow completion time
   - [ ] Monitor error rates in production
   - [ ] Collect user feedback on itinerary quality
   - [ ] A/B test different AI models if needed

---

**Happy Testing! 🎉**

