# Safarnak Refactor Work Report

Date: 2026-05-08  
Target direction: web-first MVP, "AI Trip Workspace"  
Core product loop: Create Trip -> Edit Itinerary -> View Map -> Share Public Page -> Fork Trip -> Personalize

## Executive Summary

Safarnak has a strong technical base, but it is currently wider than the MVP loop. The repo contains a working Expo/React Native app, Cloudflare Worker backend, GraphQL schema/codegen, D1/Drizzle database, AI trip creation workflow, maps, feed/search/trending, offline cache, biometric auth, encrypted messaging, and hosted trip/group concepts.

The right refactor is not "clean everything." The right refactor is to protect one loop and isolate everything else.

Recommended MVP cut:

- Keep: trip creation, trip detail, trip edit, trip map, public trip sharing, fork/personalize, basic profile/auth.
- Isolate: social feed, encrypted messaging, inbox, complex notifications, offline mutation sync, tour/group attendance, advanced Studio.
- Do not remove broad systems immediately. Feature-flag or route-hide them first, then delete after the MVP loop is stable.

High-level estimate: this is a medium-to-large refactor, around 6-10 focused engineering weeks for one senior engineer, depending on how production-grade the public sharing/forking/auth work must be in the first release.

## Current Codebase Reality

Current app route groups:

- `app/(app)/(home)`: feed/post surfaces.
- `app/(app)/(explore)`: search, locations, places, users, shareable trips.
- `app/(app)/(trips)`: trips list, create trip, trip detail/edit/map, places/locations creation, shareable trip manager.
- `app/(app)/(inbox)`: inbox and encrypted messaging screens.
- `app/(app)/(me)`: profile/account/settings.
- `app/(app)/compose`: compose modal routes.

Current core trip files:

- `app/(app)/(trips)/new.tsx`
- `app/(app)/(trips)/index.tsx`
- `app/(app)/(trips)/[id]/index.tsx`
- `app/(app)/(trips)/[id]/edit.tsx`
- `app/(app)/(trips)/[id]/map.tsx`
- `worker/mutations/createTrip.ts`
- `worker/mutations/updateTrip.ts`
- `worker/queries/getTrips.ts`
- `database/schema.ts`
- `worker/workflows/tripCreationWorkflow.ts`
- `worker/workflows/tripUpdateWorkflow.ts`

Current trip model status:

- Trips and hosted trips are already partially unified with `trips.isHosted`.
- `trip_days` and `trip_items` exist in the database schema, but the app still heavily uses JSON fields such as `trips.itinerary`, `coordinates`, and `waypoints`.
- Shareable/public trip surfaces exist, but much of this flow is currently mock or not wired end-to-end.
- There is no clean slug-first public trip model yet.

## MVP Scope Decision

The proposed MVP routes should become the only product-critical routes:

- `/`
- `/trips`
- `/trips/new`
- `/trips/[slug]`
- `/trips/[slug]/edit`
- `/profile/[username]`

Current Expo Router routes are grouped and mostly ID-based, so the repo needs a routing translation step:

- Current: `/(app)/(trips)/[id]`
- Target: `/trips/[slug]`

Recommendation: keep ID route compatibility internally during migration, but introduce slug-aware GraphQL/API and public route behavior. Do not force a single massive route rename first.

## Work Breakdown And Estimate

### Phase 0: Scope Freeze And Feature Flags

Goal: stop non-MVP systems from steering the refactor.

Work:

- Add central feature flags, for example `constants/features.ts`.
- Hide or disable non-MVP routes from navigation.
- Keep code compiling, but stop feed/messaging/offline/social from being release blockers.
- Define MVP route inventory and ownership.
- Update README/AGENTS/docs to reflect the MVP cut.

Estimate: 2-4 days.

Risk: low. Main risk is breaking navigation assumptions in tab layout and auth redirect.

### Phase 1: Unified Trip Contract

Goal: define the clean model that UI and server agree on.

Work:

- Add canonical app-level trip types: `Trip`, `TripDay`, `TripItem`, `TripMap`.
- Decide how canonical model maps to existing D1 tables.
- Add `slug`, `summary`, `visibility`, and `forkedFromTripId` to schema.
- Decide whether `trip_days` / `trip_items` become primary storage now or stay a projection from `itinerary`.
- Add migrations and GraphQL fields.
- Create server mappers so UI consumes normalized trip data.

Estimate: 1-2 weeks.

Risk: medium-high. This touches `database/schema.ts`, GraphQL schema, generated hooks, trip resolvers, and trip screens.

### Phase 2: AI Planner Pipeline

Goal: AI output never directly controls UI or DB shape.

Target flow:

```txt
User Input -> Intent Parser -> TripCreationParams -> AI JSON Generator -> Validator -> Normalizer -> Save Trip -> Render Editor
```

Work:

- Extract current trip creation logic from `worker/mutations/createTrip.ts` and workflows into clear pipeline modules.
- Define strict AI JSON schema.
- Validate AI output before saving.
- Normalize itinerary into canonical `TripDay[]` / `TripItem[]`.
- Store workflow progress separately from final trip data.
- Keep placeholder trip behavior, but make it clearly temporary workflow state.

Estimate: 1-2 weeks.

Risk: high. This is the core product experience and currently spans mutation, workflow, AI utilities, subscriptions, and trip detail polling.

### Phase 3: MVP Screens

Goal: ship the core loop before cleaning hidden systems.

Priority screens:

1. Trip creation page.
2. Generated trip result page.
3. Timeline editor.
4. Map preview.
5. Public share page.
6. Fork button and personalize flow.

Work:

- Refactor `app/(app)/(trips)/new.tsx` into a focused planner screen.
- Split large trip detail screen into overview, timeline, map, share/fork controls.
- Build a real timeline editor against normalized trip days/items.
- Make map preview consume normalized item locations.
- Build public share route and profile route.
- Add fork mutation/query flow.

Estimate: 2-3 weeks.

Risk: medium. The screens are large, but the work can be done in vertical slices.

### Phase 4: Public Sharing And Forking

Goal: make trips reusable and viral without pulling in full social feed complexity.

Work:

- Add `visibility: private | public | unlisted`.
- Add `slug` lookup.
- Add public trip query that does not require auth.
- Add fork mutation: copy trip days/items/map into a new owner trip.
- Add attribution via `forkedFromTripId`.
- Add profile public route by username.
- Add basic SEO/web metadata if web-first release matters.

Estimate: 1-2 weeks.

Risk: medium. Auth/public boundaries need careful handling.

### Phase 5: Isolation Of Non-MVP Systems

Goal: keep advanced systems from increasing maintenance load.

Move behind flags or isolate:

- Social feed.
- Encrypted messaging.
- Inbox.
- Offline mutation sync.
- Tour/group attendance.
- Advanced notification system.
- Advanced Studio/account tools.

Work:

- Add route guards or navigation hiding.
- Keep GraphQL schema/resolvers compiling.
- Stop importing heavy hooks/screens into MVP paths.
- Mark legacy systems clearly.
- Remove stale docs and mock-only routes once replacement is stable.

Estimate: 3-6 days for isolation; longer if deleting code.

Risk: medium. The app bootstrap currently processes offline queue and initializes subscriptions/cache globally.

### Phase 6: Production Hardening

Goal: make the MVP globally publishable.

Work:

- Move sensitive auth material away from AsyncStorage where possible.
- Mask Worker errors in production.
- Replace debug release signing with real release signing.
- Fix stale `worker/version.ts`.
- Add basic monitoring/logging strategy.
- Reduce console noise and avoid logging PII.
- Add smoke tests for create/edit/map/share/fork.
- Add database indexes for slug/public trip queries.

Estimate: 1-2 weeks.

Risk: medium-high. Security and release work has a low tolerance for mistakes.

## Approximate Total Work

Conservative estimate for one senior engineer:

- MVP scope freeze: 2-4 days.
- Trip model and GraphQL/database contract: 1-2 weeks.
- AI planner pipeline: 1-2 weeks.
- MVP screens and editor/map flow: 2-3 weeks.
- Public sharing/forking/profile: 1-2 weeks.
- Isolation and production hardening: 1-2 weeks.

Total: 6-10 weeks.

Faster MVP cut, accepting more technical debt: 4-6 weeks.

Production-grade global release: 8-12 weeks.

## Biggest Risks

1. Trip model migration.

The schema already has both JSON itinerary fields and structured `trip_days` / `trip_items`. Choosing the wrong migration strategy can create duplicate sources of truth.

Recommended approach: introduce canonical mappers first, then migrate storage behind them.

2. AI output reliability.

Current AI trip creation starts with placeholder data and later workflow updates. This is fine, but final saved output must be validated and normalized.

Recommended approach: strict schema validation before save, no UI-specific AI shape.

3. Public/private data boundaries.

Public share pages and forkable trips require unauthenticated reads, but the existing trip queries are owner-authenticated.

Recommended approach: create separate public trip query/resolver with explicit visibility checks.

4. Feature sprawl.

Messaging, feed, offline sync, hosted trips, maps, and profile settings can consume weeks without improving the core loop.

Recommended approach: flags first, refactor only when MVP route needs it.

5. Production security.

Current auth stores private keys/tokens in AsyncStorage and release signing is not production-ready.

Recommended approach: treat auth storage and release signing as launch blockers, not cleanup tasks.

## Recommended First 10 Tasks

1. Create `constants/features.ts` with disabled flags for social feed, messaging, offline sync, tour attendance, advanced Studio.
2. Simplify navigation so MVP routes are the only visible release routes.
3. Add canonical shared trip types in a new small module.
4. Add `slug`, `visibility`, `summary`, and `forkedFromTripId` to the trip contract.
5. Add server trip mapper from current DB row to canonical `Trip`.
6. Refactor `getTrip` and `getTrips` to return normalized trip data.
7. Split `app/(app)/(trips)/[id]/index.tsx` into smaller view components.
8. Extract AI trip planner validator/normalizer from workflow code.
9. Build public trip query by slug with strict visibility checks.
10. Implement fork mutation by copying normalized trip data into a new owner trip.

## Suggested Target Module Shape

Do not move the whole repo at once. Introduce this structure gradually:

```txt
features/
  trip-planner/
    components/
    hooks/
    api/
    types/
    utils/
  trip-editor/
  trip-map/
  trip-share/
  trip-fork/
  profile/
  auth/
server/
  trip/
  ai/
  user/
shared/
  ui/
  types/
  utils/
```

Current `app/`, `ui/`, `worker/`, `database/`, and `graphql/` can remain while new MVP code is extracted gradually. A full `src/` move should wait until the core loop is stable.

## Clear Non-Goals For This Refactor

Not part of current MVP:

- Full social network/feed.
- Encrypted messaging.
- Advanced inbox.
- Offline-first mutation sync as a product feature.
- Tour attendance, QR/NFC, participant management.
- Complex notifications.
- Advanced Studio.
- Marketplace/tour commerce.

These may remain in the repo, but they should not block the MVP.

## Final Recommendation

Safarnak should become one sharp product first:

```txt
AI Trip Workspace = generate a trip, edit it, see it on a map, share it, fork it.
```

Every refactor task should be judged by one question:

```txt
Does this help users create, edit, share, or fork a trip?
```

If the answer is no, isolate it and move on.
