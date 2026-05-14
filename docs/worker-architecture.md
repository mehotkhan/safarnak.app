## Worker Architecture (New Design)

This document describes the **refactored Cloudflare Worker backend** for Safarnak, focusing on a domain-driven, layered structure that keeps GraphQL resolvers thin and domain logic centralized.

---

## 1) High-level Layout

- `worker/index.ts`
  - Minimal entry: wires `fetch`, `queue`, and `scheduled` to handlers in `worker/server/handlers.ts`.
  - Re-exports `resolvers`, `schema`, `SubscriptionPool`, `TrendingRollup`, and workflows for Wrangler types.

- `worker/server/`
  - `graphqlServer.ts`: GraphQL Yoga + schema + subscriptions wiring.
  - `router.ts`: HTTP routing for `/`, `/graphql`, favicons, logo assets, `/avatars/*`.
  - `handlers.ts`: `fetchHandler`, `queueHandler`, `scheduledHandler` using router + storage helpers.

- `worker/domains/` (pure domain logic – no GraphQL types)
  - `home/`: feed, posts, trending.
  - `explore/`: search, semantic search, places/tours/locations.
  - `notifications/`: alerts.
  - `me/`: user-centric data (profile, devices, followers, bookmarks, messages).
  - `social/`: follow graph + feed preferences + messages.
  - `create/`: placeholder for future “create” flows.

- `worker/queries/`
  - GraphQL **Query** resolvers – now thin adapters that re-export domain services.
  - Organized by domain: `home/`, `explore/`, `notifications/`, `me/`.
  - `index.ts` merges domain exports into the `Query` object.

- `worker/mutations/`
  - GraphQL **Mutation** resolvers – thin adapters.
  - Structured by concern:
    - `auth/`: `requestChallenge`, `registerUser`, `loginUser`, `updateUser`, `revokeDevice`.
    - `trips/`, `tours/`, `places/`, `locations/`, `posts/`, `social/`, `avatars/`.
  - `index.ts` merges all modules into the `Mutation` object.

- `worker/subscriptions/`
  - Unchanged in spirit; still owns GraphQL subscription resolvers.

- `worker/storage/`
  - `d1.ts`: helpers for subscription cleanup + DB access.
  - `kv.ts`: helpers for session tokens + device tokens (read/write/delete).
  - `vector.ts`: helpers for Vectorize upsert/query.

- `worker/utilities/`
  - Shared helpers: auth crypto, AI utilities, destination research, semantic embeddings, trip helpers, trending, notification publishing.

---

## 2) Request Flow

### 2.1 HTTP / GraphQL

1. **Cloudflare runtime → `worker/index.ts`**
   - For `fetch`: calls `fetchHandler` in `worker/server/handlers.ts`.

2. **`fetchHandler` → `router.ts`**
   - Routes:
     - `/` → versioned landing page (`landing.html` + `APP_VERSION`).
     - `/graphql` (and WS upgrades) → `wrappedSubscriptionsFetch` from `graphqlServer.ts`.
     - `/favicon.*`, `/assets/logo-*.png` → static assets.
     - `/avatars/*` → avatar proxy from R2 with caching + CORS.

3. **`graphqlServer.ts`**
   - Builds Yoga schema via `makeExecutableSchema` using:
     - `typeDefs` from `@graphql/schema-loader`.
     - `resolvers` from `worker/` (`Query`, `Mutation`, `Subscription`, union resolvers).
   - Adds plugins:
     - Logging for all requests.
     - Error logging for GraphQL errors.
     - Subscription cleanup using `cleanupSubscriptions()` on WS upgrades.
   - `context`:
     - Reads `Authorization: Bearer <token>`.
     - Uses `readSessionToken()` from `worker/storage/kv.ts` to resolve `userId`.
     - Wraps `env`, `executionCtx`, `userId`, `request` in Yoga context.

4. **Resolvers**
   - `worker/queries/*` and `worker/mutations/*` are now **1–2 line adapters**:
     - Import from `@worker/domains/<domain>/services`.
     - Re-export the appropriate function so the resolver map stays the same.
   - Example:
     - `worker/queries/home/getFeed.ts` → `export { getFeed } from '@worker/domains/home/services';`

5. **Domain services**
   - Implement real logic under `worker/domains/*`:
     - Receive `GraphQLContext` or `Env` + parameters.
     - Use `@database/server`, `@worker/storage/*`, and `@worker/utilities/*`.

---

## 3) Background Work

### 3.1 Queue (embeddings)

- `queueHandler` in `server/handlers.ts`:
  - Reads jobs from `EMBED_QUEUE`.
  - Uses `env.AI.run()` to generate embeddings.
  - Uses `upsertEmbedding()` from `worker/storage/vector.ts` to write to Vectorize.
  - Logs diagnostic info on failures; does not `ack` failed messages so they retry.

### 3.2 Scheduled (TrendingRollup)

- `scheduledHandler` in `server/handlers.ts`:
  - Signature matches Wrangler runtime: `(controller, env, executionCtx)`.
  - Calls the `TrendingRollup` Durable Object to compact trending data.

---

## 4) Storage Layer

### 4.1 D1 (`worker/storage/d1.ts`)

- `cleanupSubscriptions(db, minutes?)`:
  - Deletes inactive/expired/old subscriptions using `prepare().run()` and returns the number of changes.
- `cleanupDuplicateSubscriptions(db, minutes?)`:
  - Deletes old inactive subscriptions to mitigate UNIQUE constraint issues.
- `getWorkerDb(env)`:
  - Thin wrapper around `env.DB` for places that only know `Env`.

Used in:
- `graphqlServer.ts` for subscription cleanup plugins and duplicate-subscription retries.

### 4.2 KV (`worker/storage/kv.ts`)

- Token + device helpers:
  - `readSessionToken(env, token)` → `{ userId, deviceId? } | null`.
  - `writeSessionToken(env, token, payload, ttlSeconds?)`.
  - `deleteSessionToken(env, token)`.
  - `writeDeviceToken(env, deviceId, token, ttlSeconds?)`.
  - `readDeviceToken(env, deviceId)`.
  - `deleteDeviceToken(env, deviceId)`.

Used in:
- `graphqlServer.ts` context auth (via `readSessionToken`).
- Auth mutations:
  - `registerUser`, `loginUser` (biometric) → `writeSessionToken` + `writeDeviceToken`.
  - `revokeDevice` → `readDeviceToken` + `deleteSessionToken` + `deleteDeviceToken`.

### 4.3 Vectorize (`worker/storage/vector.ts`)

- `upsertEmbedding(env, record)` / `upsertEmbeddings(env, records)`:
  - Wraps `env.VECTORIZE.upsert`.
- `queryEmbeddings(env, vector, options)`:
  - Wraps `env.VECTORIZE.query`.

Used in:
- `queueHandler` (embeddings for entities).
- `domains/explore/searchSemantic` (semantic search).
- `utilities/semantic/searchAttractions`.
- `utilities/destination/indexVector` (pre-index attractions).

---

## 5) Domain Responsibilities

### 5.1 `domains/home`

- `getFeed`:
  - Builds feed edges from `feedEvents` + related entities (posts/trips/tours/places/locations).
  - Respects visibility, muted users, following/circle filters, and cursor pagination.
- `getPosts` / `getPost`:
  - Post lists and details, with comments/reactions, user info, and related entities.
- `getTrending`:
  - Reads KV-based trending lists via `readTopList`.
  - Falls back to D1 aggregates over `feedEvents` if needed.

### 5.2 `domains/explore`

- `search`:
  - Text search over the search index, returns feed-like connection.
- `searchSemantic`:
  - Embeds query text, uses `queryEmbeddings` for semantic ranking, then hydrates entities from D1.
- `getPlaces`, `getTours`, `getLocations`:
  - Listing and detail queries for discovery surfaces.

### 5.3 `domains/notifications`

- `getAlerts`:
  - Fetches user notifications/alerts with auth checks.

### 5.4 `domains/me`

- `me`:
  - Current user profile.
- `getUser`:
  - Public user profile.
- `getMyDevices`, `getFollowers`, `getFollowing`, `isFollowing`, `getBookmarks`, `getMessages`:
  - All user-centric read operations grouped in one place.

### 5.5 `domains/social`

- `addMessage`:
  - Inserts messages and publishes `NEW_MESSAGES` subscription events.
- `followUser`, `unfollowUser`, `addToCloseFriends`, `removeFromCloseFriends`:
  - Manage follow graph and close-friends circle with ownership checks.
- `updateFeedPreferences`:
  - Stores user feed preferences to influence home feed behavior.

### 5.6 `domains/create`

- Currently a **stub** (`services.ts` exports nothing).
- Reserved for future “create trip / tour / place / location” orchestration services.

---

## 6) Design Goals Recap

- **GraphQL resolvers are thin**:
  - They mostly re-export domain services, so the resolver layer is easy to read and maintain.
- **Domain logic is centralized**:
  - Each tab/area (Home, Explore, Notifications, Me, Social) has a dedicated `domains/*` folder.
- **Storage access is consistent**:
  - D1, KV, and Vectorize access are funneled through `worker/storage/*`.
- **Safer auth & subscriptions**:
  - Token handling uses typed helpers, and subscription cleanup is shared + testable.
- **Legacy paths removed**:
  - Old password-based `login`/`register` mutations and unused `create` query namespace have been removed to reduce noise.

This design keeps the worker entry light, makes behavior easier to reason about (by domain), and positions the codebase for future growth (more AI features, richer workflows) without bloating the GraphQL layer.










