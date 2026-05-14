# Offline SQLite Architecture Review

Date: 2026-05-14

## Scope

This review covers the client-side hybrid offline system:

- Apollo normalized cache persistence.
- Expo SQLite through Drizzle ORM.
- Structured `cached_*` tables.
- AsyncStorage mutation retry queue.
- Messaging offline cache.
- Map tile metadata cache.

The review is based on current source files, not README assumptions.

## Executive Summary

The client app has a useful offline foundation: Apollo cache is restored before render, persisted into SQLite, and selected entities are mirrored into structured Drizzle tables. This gives the app fast cached reads and a path toward richer offline workflows.

The main issue is that the system is not fully unified. Apollo cache, structured SQLite tables, AsyncStorage queueing, and messaging-specific persistence each own part of the offline story. That creates duplicated mapping logic, stale structured rows, misleading stats, and a mutation queue split between declared SQLite schema and actual AsyncStorage usage.

The best cleanup path is not a rewrite. Keep Apollo cache as the server snapshot cache, choose SQLite structured tables for workflows that need local querying or pending state, and make one mutation queue canonical.

## Current Architecture

### App Bootstrap

`app/_layout.tsx` calls `initializeCachePersistence()` and waits for `cacheReady` before rendering the app. That is a strong pattern because cached Apollo data is available before route screens mount.

Relevant files:

- `app/_layout.tsx`
- `api/client.ts`

### Apollo Cache Persistence

`api/client.ts` configures `apollo3-cache-persist` with `DrizzleCacheStorage` on native platforms and AsyncStorage fallback if Drizzle persistence fails.

`api/cache-storage.ts` stores raw cache entries in `apollo_cache_entries` and mirrors selected normalized entities into structured tables:

- `cached_users`
- `cached_profiles`
- `cached_trips`
- `cached_places`
- `cached_messages`
- `cached_conversations`
- `cached_chat_messages`

This makes Apollo cache the main offline read layer for most query screens, while structured tables are available for targeted local workflows.

### Local SQLite Adapter

`database/client.ts` owns the Expo SQLite database instance and migration execution. It opens `safarnak_local_v2.db`, runs bundled Drizzle migrations, and exposes database stats.

It also still contains a deprecated `syncApolloToDrizzle()` path with its own entity transform logic.

### Structured Offline Tables

`database/schema.ts` includes client cache tables with common sync metadata:

- `cachedAt`
- `lastSyncAt`
- `pending`
- domain-specific fields such as `deletedAt` on cached trips

This schema supports richer offline behavior, but most app screens still use Apollo hooks rather than querying these tables directly.

### Messaging

Messaging is currently the strongest structured SQLite use case.

`ui/hooks/useConversations.ts`:

- Reads conversations and messages from SQLite.
- Persists network query results into `cached_conversations`, `cached_conversation_members`, and `cached_chat_messages`.
- Writes local pending messages before network send.
- Deletes the local pending row after server confirmation.
- Queues failed sends for retry.

This is close to a real offline-first workflow, but the retry queue still uses AsyncStorage.

### Map Tiles

`ui/utils/mapTileCache.ts` stores tile files in Expo FileSystem and metadata in `cached_map_tiles`. It verifies file existence, updates `lastAccessed`, supports cleanup by age and size, and avoids immediate repeated failed downloads.

## What Is Working Well

- Cache restoration happens before app render, reducing UI flicker and avoiding cache races during startup.
- Apollo cache persistence is unified into the same SQLite database instead of a separate cache database.
- Structured tables exist for entities that need local querying and pending state.
- Messaging has a practical local-first flow rather than relying only on Apollo cache.
- Map tile caching separates binary tile files from queryable metadata.
- Database stats exist and can help inspect cache behavior during development.

## Issues And Risks

### 1. Client Migrations Include Server Tables

`database/drizzle.config.client.ts` points at `database/schema.ts`, so client migrations include both server and client tables. The current client migration creates server tables such as `users`, `bookings`, and others alongside cache tables.

Risk:

- Larger local DB than needed.
- Client/server schema coupling.
- More migration blast radius for offline-only changes.
- Potential confusion about which tables are safe to use on device.

Recommendation:

- Point client migration generation at `database/client-schema.ts`.
- Regenerate client migrations from client-only tables.
- Keep server tables out of Expo SQLite unless a specific offline workflow needs a local projection.

### 2. Offline Mutation Queue Has Two Sources

`database/schema.ts` defines `pending_mutations`, but `ui/state/middleware/offlineMiddleware.ts` stores the real retry queue in AsyncStorage under `offlineMutations`.

Risk:

- SQLite stats can report zero pending mutations while AsyncStorage contains queued work.
- Retry diagnostics are split.
- Queue entries are not queryable with other local sync state.
- Future developers may build against the wrong queue.

Recommendation:

- Move the active queue into `pending_mutations`, or delete the table.
- Use one queue reader/writer for enqueue, retry, retry count, last error, and cleanup.

### 3. Entity Transform Logic Is Duplicated

Entity mapping exists in both:

- `api/cache-storage.ts`
- `database/client.ts`

The deprecated sync path already diverges from the active cache storage path. Example: trip `budget` is parsed as `parseFloat` in one place and `parseInt` in the other.

Risk:

- Structured cache values differ depending on sync path.
- Future schema changes require multiple updates.
- Subtle numeric and JSON field drift.

Recommendation:

- Extract a shared client mapper, for example `database/client-mappers.ts`.
- Use it from `DrizzleCacheStorage` and any one-time migration/sync utility.
- Delete the deprecated sync path once no callers remain.

### 4. Raw Cache And Structured Writes Are Not Transactional

`DrizzleCacheStorage.setItem()` writes `apollo_cache_entries`, then upserts a structured row. The file comment says this is a single transaction, but the current implementation does not wrap the two writes in a transaction.

Risk:

- Raw Apollo cache can succeed while structured mirror fails.
- Structured tables become incomplete under SQLite errors, app interruption, or schema mismatch.

Recommendation:

- Wrap raw cache write and structured upsert in a SQLite transaction.
- Keep structured upsert failures visible in development.

### 5. Structured Cache Rows Can Become Stale

`removeItem()` deletes the raw Apollo cache entry but intentionally leaves structured rows behind.

Risk:

- SQLite local query results can show entities Apollo no longer has.
- Cache stats can overstate current useful offline data.
- Logout or account switches may leave user-specific structured data unless all paths are cleared.

Recommendation:

- Define ownership rules per table.
- For pure mirrors, delete or mark stale when Apollo removes the source entity.
- For local-first workflow tables, keep independent lifecycle fields such as `pending`, `deletedAt`, and `lastSyncAt`.

### 6. Indexed Local Read Paths Are Thin

The schema defines primary keys, but several hot offline reads need explicit indexes:

- `cached_chat_messages(conversation_id, created_at)`
- `cached_conversations(last_message_at)`
- `cached_conversation_members(conversation_id)`
- `cached_map_tiles(layer, z, x, y)` as a unique index
- `apollo_cache_entries(entity_type, entity_id)`

Risk:

- Local reads become slow as cache grows.
- Map tile duplicate rows are possible during concurrent downloads.

Recommendation:

- Add indexes to client cached tables during the client migration cleanup.

### 7. AsyncStorage Still Carries Sensitive And Sync-Critical State

Auth, device key material, Redux persistence, and the offline queue are in AsyncStorage. This is already called out as a known security risk for auth material, but it also affects offline durability and observability.

Risk:

- Sensitive material is easier to extract than SecureStore/keychain-backed data.
- Sync-critical queue state is outside the SQLite sync model.

Recommendation:

- Move auth secrets/key material toward SecureStore.
- Move retry queue state into SQLite.
- Keep AsyncStorage for low-risk preferences only.

## Recommended Cleanup Plan

### Phase 1: Make Boundaries Explicit

- Document Apollo cache as the server snapshot cache.
- Document structured SQLite tables as local workflow/read-model tables.
- Add a short ownership note near `database/client-schema.ts`.

### Phase 2: Fix Client Migration Scope

- Change `database/drizzle.config.client.ts` to use `database/client-schema.ts`.
- Regenerate client migrations.
- Verify the generated migration contains only client cache/local tables.

### Phase 3: Canonicalize Offline Mutation Queue

- Move `enqueueOfflineMutation()` and `processQueue()` to use `pending_mutations`.
- Track retries and `lastError`.
- Add a small migration-safe queue reader for diagnostics.
- Remove AsyncStorage `offlineMutations` after a one-time migration if existing installs matter.

### Phase 4: Consolidate Mappers

- Extract Apollo-to-local entity mappers.
- Use the same mapper from cache persistence and any manual migration helper.
- Remove deprecated duplicate sync logic.

### Phase 5: Add Indexes And Lifecycle Rules

- Add local indexes for conversations, messages, map tiles, and Apollo entity lookup.
- Add clear stale-row rules for structured mirrors.
- Add a cache cleanup path that handles both raw Apollo cache and mirror tables.

### Phase 6: Validate With Focused Tests

- Cold start with cached feed/trips/messages and backend unavailable.
- Send message offline, restart app, reconnect, verify one server message and no duplicate local pending row.
- Clear user data and verify raw Apollo cache, structured tables, queue, and sensitive AsyncStorage state are cleared.
- Download tiles, restart app, verify local tile path resolution and LRU cleanup.

## Cleanup Priorities

1. Fix client migration source.
2. Use one offline mutation queue.
3. Consolidate entity mappers.
4. Add transaction around raw cache and structured writes.
5. Add indexes for local read paths.
6. Move sensitive auth material out of AsyncStorage.

## Files To Watch During Refactors

- `app/_layout.tsx`
- `api/client.ts`
- `api/cache-storage.ts`
- `database/client.ts`
- `database/client-schema.ts`
- `database/drizzle.config.client.ts`
- `database/schema.ts`
- `ui/state/middleware/offlineMiddleware.ts`
- `ui/hooks/useConversations.ts`
- `ui/utils/mapTileCache.ts`

