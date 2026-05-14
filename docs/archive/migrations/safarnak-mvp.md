# Safarnak – MVP Finalization Review and Plan (Merged)

Version: 2.1.0  
Date: November 2025  
Status: Pre‑MVP Finalization  
Estimated Completion: 3–4 weeks

---

## Executive Summary
Safarnak is a well‑architected, offline‑first travel social network with a strong foundation: unified Drizzle schema across client/worker, Cloudflare Workers + GraphQL Yoga, durable WebSocket subscriptions, Apollo cache persisted and dual‑written to SQLite via Drizzle, and modern biometric auth (challenge/signature with device keys). The MVP gap is mostly about a few missing implementations, security hardening, final AI wiring (behind a safe flag), validation and error/empty/loading UX polish, and de‑scoping non‑essential features.

This document merges:
- Your existing MVP plan (mvp.md L1–L1394) and its priorities/checklists
- A focused technical review to finish the MVP efficiently with minimal risk
- Concrete corrections and additions identified during code review

---

## Strengths (Validated)
- Offline‑first architecture with automatic Apollo → Drizzle sync (single‑transaction dual write)
- Biometric authentication (RSA key pair per device) with challenge/response; KV‑backed token TTL
- Unified schema with UUIDs across server/client; adapters enforce separation (`@database/server` vs `@database/client`)
- Real‑time subscriptions via Durable Object `SubscriptionPool`
- Clean client architecture: reusable UI lib, NativeWind v4, i18n (FA/EN) with language‑only switching (RTL layout disabled on Android as per product choice)
- Landing page and Worker entry are production‑quality and branded

---

## Critical Issues and Gaps (Merged)

### 1) Bookmark mutations are placeholders (High) [MVP.md 116–154, 296–317]
- Implement `bookmarkTour` and `bookmarkPlace` like `bookmarkPost` (toggle on second call), then wire UI.

### 2) Secrets in code (High) [MVP.md 157–187]
- Move `JWT_SECRET` to Wrangler secrets. Validate presence at Worker boot. Audit other secrets/URLs.

### 3) Error boundaries missing (High) [MVP.md 189–248]
- Add `ui/utils/ErrorBoundary` and wrap primary layouts to prevent white screens on unhandled errors.

### 4) Form validation (High) [MVP.md 252–291]
- Add Zod schemas; standardize i18n error keys; show inline errors in `InputField` and `TextArea`.

### 5) Share actions unwired (Medium) [MVP.md 321–349]
- Implement `Share.share` for posts and entity deep‑links (Android verified).

### 6) Social stats and filters (Medium) [MVP.md 353–391]
- Either add stats queries or hide placeholders for MVP. Recommendation: minimal stats or defer.

### 7) Tours “owner” filter (Medium) [MVP.md 379–391]
- Defer “My Tours” until owner is modeled; keep discovery read‑only for MVP.

### 8) AI wiring finalization (Product choice) [Merged]
- Your mvp.md advises deferring AI to post‑MVP; current goal is to “do final AI wireups.”
- Recommendation: keep AI itinerary generation/workflow in MVP but guarded with a feature flag (env var). If disabled, fall back to current mock itinerary logic. This satisfies MVP scope changes quickly while minimizing risk.

### 9) Duplicate and de‑dupe fixes (Quick) [Merged]
- `worker/mutations/createTrip.ts`: remove duplicated searchIndex upsert block.
- Unify Apollo→Drizzle entity transform logic (exists in two places: `api/cache-storage.ts` and `database/client.ts`); extract a shared mapper utility (e.g., `@database/utils/entityTransform.ts`) and import in both to reduce drift.

### 10) Web cache persistence (Medium) [Merged]
- On web, Apollo persistence uses AsyncStorage shim; switch to localStorage/localforage to stabilize web caching.

### 11) Challenge rate‑limit (Medium) [Merged]
- Add light per‑username/IP rate‑limit for `requestChallenge` with KV counter or a small DO to prevent abuse.

---

## Security and Platform Hardening (Merged)
- Secrets via Wrangler secrets; enforce presence at boot.  
- Strict input validation in all mutations/queries (you’ve started this; finish remaining).  
- CORS and token flow review; short TTL with sliding refresh optional (not required for MVP).  
- Sanitize Worker logs; gate verbose logging to dev mode only.  
- Subscription cleanup is done on WS upgrade; add occasional cron cleanup (already present) and keep.

---

## Final AI Wiring (MVP‑guarded)

Server (Worker):
- Replace mock itinerary/updates with Workers AI:
  - Use `env.AI.run('@cf/meta/llama-3.1-8b-instruct', { input })` to output a strict JSON schema: itinerary days, activities, budget summary, optional waypoints hints.
  - Validate JSON shape; on failure, fall back to mock path and log a soft error (no user disruption).
  - Continue enqueueing embeddings to Vectorize via existing queue; ensure index dimensions match model (1024 for `@cf/baai/bge-m3`). Already implemented in the queue consumer; keep hint logs.
- Workflows (`TripUpdateWorkflow`): replace `generateRandomTripData` with AI call; publish stepwise updates via subscriptions. Keep time‑boxed steps and statuses so the UI shows progress regardless of AI latency.

Client (RN):
- Trip create/edit pages:
  - Show step progress bound to `tripUpdates` subscription.
  - Add “Regenerate itinerary” button sending `updateTrip(userMessage)`; disable manual fields while status `pending`.
- Feature flag:
  - Read `EXPO_PUBLIC_ENABLE_AI` to enable/disable AI UI affordances (default: enabled for your goal).

Why flag? Ship MVP either way and flip remotely if needed.

---

## UX/Forms/Offline Polish (Merged)
- Validation: Centralize Zod schemas + error key mapping; display inline field errors with consistent styling.
- Errors: Add global toast/snackbar for transient errors; full‑screen `ErrorState` for hard failures.
- Loading: Use `SkeletonLoader` in lists; `LoadingState` in detail pages while above‑the‑fold fetch resolves.
- Empty States: Standardize `EmptyState` usage with helpful CTA; ensure across Trips/Tours/Places/Feed.
- Offline: Small connectivity banner (NetInfo + backend reachability); “System Status” screen using `getDatabaseStats()` to show cache entries, pending mutations, approximate storage.
- Device management: Add settings page using `getMyDevices` + `revokeDevice` mutation.
- Performance: Memoize card components and handler callbacks; virtualize lists; limit rerenders.

---

## Scope – Remove/Simplify for MVP (Merged)
Adopting your MVP.md scope reductions with clarifications:
- Defer: payments/subscriptions, bookings, complex trending DO, advanced semantic search; keep lexical search.
- Keep: follow/bookmark/share, feed, CRUD for trips/tours/places/posts/comments/reactions; offline mode.
- AI: keep itinerary generation “on” but behind feature flag; if flagged “off,” fall back to current mocks.

Database/UI cleanup targets (archive rather than delete so migrations remain consistent):
- Archive code paths and UI for payments/subscriptions/bookings (retain tables if migrations already exist; or mark as not used in Worker resolvers for MVP).

---

## Quick Wins (Today)
1) Move `JWT_SECRET` to Wrangler secrets; enforce at boot.  
2) Implement `bookmarkTour`/`bookmarkPlace` (toggle) + wire UI with optimistic updates.  
3) Add `ErrorBoundary` and wrap layouts.  
4) Replace `console.log` with a small `utils/logger` (gate debug in dev).  
5) Remove duplicated searchIndex upsert in `createTrip`.  

---

## Detailed Fix/Add List (Actionable)

### Fixes
- Duplicate searchIndex upsert in `worker/mutations/createTrip.ts` (keep single, logged path).
- Unify entity transform maps into `@database/utils/entityTransform` and import in `api/cache-storage.ts` and `database/client.ts`.
- Reduce Worker logs in production (keep `onResult` errors; gate request logs by env).
- Web cache persistence: switch to localforage/localStorage adapter in web builds.
- Rate‑limit `requestChallenge` with KV increments and expiry (low effort, prevents abuse).

### Adds
- `ErrorBoundary` and wrap in `app/_layout.tsx` around `<Stack />`.
- Device management page (list/revoke) using `getMyDevices` and `revokeDevice`.
- System Status screen using `getDatabaseStats()` and cache stats helpers already exposed.
- Share actions for posts and entity links.
- Zod validation schemas; inline error rendering in form components; i18n error key mapping.
- AI itinerary generation and workflow integration, guarded by feature flag (server+client).

---

## Testing and Release Readiness (Merged)
- Manual test plans for: auth challenge flow (+ biometric failure cases), create/edit trip with AI on/off, bookmarks toggle, feed interactions (comments/reactions), offline queue (toggle network), subscriptions reconnection (duplicate subscription handling is already guarded), and basic web build cache behavior.
- Lint/type checks in CI; minimal Sentry (optional) or rely on Wrangler logs for Worker and RN console.
- Version bump via commit conventions; APK metadata wired to package.json (already in place).

---

## Final Multi‑Phase Implementation Plan (covers @mvp.md L1–L1394)
This plan merges your Week‑based schedule with the additional AI, security, and code‑health items above. It delivers the entirety of mvp.md scope while preserving an “AI flag” escape hatch.

### Phase 1: Critical Fixes and Security (Days 1–5) — Implements MVP.md Week 1 and Quick Wins
- Secrets & Environment
  - Move `JWT_SECRET` to Wrangler secrets; assert presence.
  - Audit for hardcoded config; gate logs in prod.
  - Add light rate‑limit to `requestChallenge`.
- Missing Implementations
  - Implement `bookmarkTour`, `bookmarkPlace` resolvers (toggle); add optimistic UI; refetch `GetBookmarks`.
  - Implement Share via `Share.share` with deep‑link targets.
- Error Handling
  - Add `ErrorBoundary`; standardize error surfaces; add basic `logger` utility.
- Form Validation
  - Install Zod/resolvers; add schemas for Trip/Post/User update; connect to `InputField`/`TextArea` with inline errors.
- Code Health Quick Fixes
  - Remove duplicate searchIndex upsert in `createTrip`.
  - Extract shared entity transform util and replace duplicate logic in `api/cache-storage` and `database/client`.

Deliverables: secure secrets, bookmarks working end‑to‑end, basic share, error boundaries, validated forms, de‑dupe fixes.

### Phase 2: Core UX & Offline Polish (Days 6–12) — Implements MVP.md Week 2
- Forms & UX
  - Sectioned forms, better placeholders/hints; date picker UX.
  - Image picker for posts (respect constants and size/type limits).
  - Draft saving for long forms (optional; nice‑to‑have).
- Errors/Loading/Empty States
  - Standardize i18n error messages; retry on failed mutations.
  - Skeletons for lists; `LoadingState` for details; consistent `EmptyState` with CTA.
- Offline Experience
  - Network banner; System Status screen using `getDatabaseStats()`; queue visibility improvements.

Deliverables: cohesive forms, consistent error/loading/empty UX, visible offline status and storage stats.

### Phase 3: AI Wiring + Device Management + Performance (Days 13–21) — Merged scope
- AI Finalization (Feature‑flagged)
  - Trip creation: call Workers AI; validate JSON; fall back to mock on parse error; enqueue embeddings.
  - Trip updates workflow: replace random generator with AI; stream step updates; keep time‑boxed steps.
  - Client: progress UI on create/edit; “Regenerate itinerary” with disabled fields while `pending`.
  - Add `EXPO_PUBLIC_ENABLE_AI`/`ENABLE_AI` env flags; default enabled per current goal.
- Device Management
  - Settings page listing `getMyDevices`; allow `revokeDevice` and confirm token invalidation.
- Performance/Polish
  - Memoize cards; virtualize lists; ensure handlers are stable; clean up logs in production.
  - Web Apollo persistence: localforage/localStorage adapter.

Deliverables: AI itinerary (on flag), workflow progress UI, device settings, smoother lists, stable web cache.

### Phase 4: Beta & Launch Prep (Days 22–28) — Implements MVP.md Week 4
- Testing
  - Manual end‑to‑end for all flows; offline/slow network; edge cases; multi‑device auth tests.
  - Beta with ≥10 users; triage and fix must‑fix issues.
- Performance
  - Image caching/progressive loading; startup profiling; bundle trimming if necessary.
- Docs & Release
  - Update README, CONTRIBUTING, environment setup; GraphQL operations list; release notes/changelog.
  - Optional: Sentry for RN + Worker error tracking.

Deliverables: beta‑level stability and documentation; ready for store submission/testing.

---

## Success Metrics (Unchanged)
- Crash rate < 1%, API error rate < 2%, initial load < 2s on mid‑range Android, offline usage tracked; core engagement: trips created/day, posts shared/day, retention.

---

## Post‑MVP Roadmap (Unchanged, staged)
- Notifications, direct messaging, advanced filters, collaboration, payments/booking/subscriptions, trending DO, semantic search, AI recommendations, offline map tiles (full), AR/live location, exports.

---

## Appendix: Notes from Landing Page and Worker Review
- Landing page is production‑ready; version placeholders are correctly replaced by Worker at `/`.
- Worker serves avatar assets from R2 with cache and CORS headers.
- Subscriptions cleanup runs on WS upgrade; cron scheduled compact for `TrendingRollup` already present.
- GraphQL logging hooks: keep error logs; reduce request logs in prod.
- KV token storage format differs between old password flow and new biometric flow—prefer the biometric paths only; remove or archive legacy password login/register ops to reduce surface area and confusion.

---

## Final Recommendation
Stay laser‑focused on the MVP scope above. Keep AI enabled but safely guarded; flip off instantly if needed. Ship the critical fixes (secrets, bookmarks, error boundary, validation) first, then polish UX/offline, then complete AI/workflows and device management, and finally stabilize for beta. This plan merges and fulfills everything in @mvp.md (L1–L1394) while incorporating pragmatic, code‑informed corrections for a fast, safe ship.


