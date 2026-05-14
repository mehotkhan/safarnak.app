## Home Feed and Search Roadmap (with Vectorize, KV, DO, Queues, R2)

### Purpose
Design and implement a semi‑realtime, Twitter‑style home feed and a powerful search experience for Safarnak, with a phased rollout. Leverage Cloudflare Vectorize for semantic search and personalization, KV for fast caches and counters, Durable Objects for subscriptions/fan‑out and per‑user aggregation, Queues for async indexing and enrichment, and R2 for media.

---

### Current Status
- Phase 1 (Feed MVP): ✅ Implemented
- Phase 1b (Search MVP - Lexical): ✅ Implemented
- Phase 2 (Personalization, follow graph, boosts; KV trending): ✅ Implemented
- Phase 2 (DO rollup + cron): ✅ Implemented (TrendingRollup + 10‑min cron)
- Phase 3 (Semantic Search foundations): ✅ Implemented (Vectorize/AI/Queue bindings, producers/consumer, `searchSemantic`)
- Remaining:
  - Extend trending to PLACE/USER (optional)
  - Optional subscription batching DO for event coalescing
  - Embeddings backfill job for existing content (one‑time utility)

---

### Why Vectorize, KV, Durable Objects, Queues, R2
- **Vectorize**: Semantic search across posts/trips/tours/places/locations; related content; multilingual embeddings (English + Persian). Later: user/topic embeddings for personalized ranking.
- **KV**: Low‑latency caches for trending, suggestions, search autosuggest, rate‑limit counters, “new items” counts, feature flags, and user preference snapshots.
- **Durable Objects (DO)**: 
  - SubscriptionPool (already used) for GraphQL subscriptions.
  - A FeedAggregator DO (per user) to collect incoming events, deduplicate, compute top‑3 “new items” banner, and apply per‑user filters.
- **Queues**: Async job pipeline for embedding generation, search indexing, fan‑out precomputation, and backfill/reindex tasks.
- **R2**: Media storage for posts/trips; store thumbnails and attach vector metadata tokens if needed.

---

### Data Model (Server, D1 unless noted)
- `feed_events`:
  - id (uuid), entityType (POST/TRIP/TOUR/PLACE/LOCATION), entityId, actorId, verb (CREATED/UPDATED), topics (TEXT[]), visibility (PUBLIC/FOLLOWERS/CIRCLE), createdAt, rank FLOAT (for boosted recency)
- `feed_preferences`:
  - userId, entityTypes[], topics[], followingOnly BOOL, circleOnly BOOL, mutedUserIds[]
- `follow_edges`: followerId, followeeId
- `close_friends`: userId, friendId
- `search_index`: entityType, entityId, title, text, tags, locationName, createdAt, updatedAt, lang, tokens, trigrams
- Vectorize (Cloudflare):
  - Index: `FEED_SEARCH_INDEX` (multilingual embeddings). Dimensions per model used.
  - Namespace fields: entityType, entityId, lang, topics, visibility, createdAt
- KV namespaces:
  - `FEED_CACHE`: per‑user new‑items counters, lastSeen cursors, banner counts
  - `SEARCH_CACHE`: autosuggest, recent popular queries, entity/type facet counts
  - `TRENDING_CACHE`: top topics/locations/users; expiry small (1–5 min)
  - `PREF_CACHE`: snapshot of per‑user FeedFilter for fast DO boot
- Queues:
  - `EMBED_QUEUE`: enqueue text to embed (title/body/tags); write results to Vectorize + `search_index`
  - `REINDEX_QUEUE`: backfill after schema/embedding model changes

---

### GraphQL (shared additions)
```graphql
enum EntityType { POST TRIP TOUR PLACE LOCATION }
enum FeedVerb { CREATED UPDATED }
enum Visibility { PUBLIC FOLLOWERS CIRCLE }

union FeedEntity = Post | Trip | Tour | Place | Location

type FeedEvent {
  id: ID!
  entityType: EntityType!
  entityId: ID!
  verb: FeedVerb!
  actor: User!
  entity: FeedEntity!
  topics: [String!]!
  visibility: Visibility!
  createdAt: String!
}

type FeedEdge { cursor: String!, node: FeedEvent! }
type PageInfo { endCursor: String, hasNextPage: Boolean! }
type FeedConnection { edges: [FeedEdge!]!, pageInfo: PageInfo! }

input GeoFilter { lat: Float!, lng: Float!, radiusKm: Float! }

input FeedFilter {
  entityTypes: [EntityType!]
  topics: [String!]
  followingOnly: Boolean
  circleOnly: Boolean
  mutedUserIds: [ID!]
  visibility: [Visibility!]
  geo: GeoFilter
}

type FeedPreferences {
  entityTypes: [EntityType!]!
  topics: [String!]!
  followingOnly: Boolean!
  circleOnly: Boolean!
  mutedUserIds: [ID!]!
}

type Query {
  getFeed(first: Int = 20, after: String, filter: FeedFilter): FeedConnection!
  getFeedPreferences: FeedPreferences!
  search(
    query: String!
    entityTypes: [EntityType!]
    topics: [String!]
    first: Int = 20
    after: String
  ): FeedConnection!
  searchSemantic(
    query: String!
    entityTypes: [EntityType!]
    topics: [String!]
    first: Int = 20
    after: String
  ): FeedConnection!
  searchSuggest(prefix: String!, limit: Int = 10): [String!]!
}

type Mutation {
  updateFeedPreferences(input: FeedFilter!): FeedPreferences!
}

type Subscription {
  feedNewEvents(filter: FeedFilter): [FeedEvent!]!
}
```

---

### Home Page UX (client)
- Tabs/segments: “Following” and “For You”.
- Top chip row: topics, entity type filters, close‑friends toggle.
- Semi‑realtime: queue incoming events from subscription, show sticky “Show 3 new” banner; prepend on tap.
- Infinite scroll (time‑based cursor).
- Offline‑first: loads from Apollo/Drizzle cache; subscription no‑ops when offline.

---

### Search Page UX (client)
- Unified search across all entities; filters for type, topics, time, location.
- Suggest/autocomplete (KV‑backed).
- Results ranked by BM25‑like score + recency (Phase 1), hybrid lexical + vectors (Phase 2).
- Optional “Related” module powered by Vectorize KNN on current result/entity.

---

### Phases and Tasks

#### Phase 0 — Foundations
- Goals:
  - Add shared GraphQL schema types and operations (feed, preferences, search).
  - Create D1 tables: `feed_events`, `feed_preferences`, `search_index` (+ follow/close friends if missing).
  - Wire create/update resolvers to emit `FeedEvent`.
  - Add Workers bindings: KV namespaces, Queues, Vectorize, R2.
- Tasks:
  - [ ] Update `graphql/schema.graphql` with Feed/Search types and operations.
  - [ ] Run `yarn codegen` and fix any typing issues.
  - [ ] Update `database/schema.ts` with new tables and exports.
  - [ ] `yarn db:generate` → `yarn db:migrate`.
  - [ ] Update `wrangler.toml`:
    - [ ] `kv_namespaces` (FEED_CACHE, SEARCH_CACHE, TRENDING_CACHE, PREF_CACHE)
    - [ ] `queues.producers/consumers` (EMBED_QUEUE, REINDEX_QUEUE)
    - [ ] `vectorize` binding (FEED_SEARCH_INDEX)
    - [ ] `r2_buckets` (MEDIA)
  - [ ] Add Worker utility for safe input validation and auth context reuse.

#### Phase 1 — Home Feed MVP
- Goals:
  - `getFeed`, `feedNewEvents`, `getFeedPreferences/updateFeedPreferences`
  - Client home page with top banner (cap 3 new), filters, and infinite scroll.
  - Server ranking = recency (+small boosts later).
- Server:
  - [ ] Implement `getFeed` query with filters and `(createdAt desc, id desc)` pagination.
  - [ ] Publish `FeedEvent` on create/update resolvers; enforce visibility/following.
  - [ ] Implement `feedNewEvents` subscription with filter application.
  - [ ] Implement `getFeedPreferences/updateFeedPreferences` using D1 + KV snapshot.
  - [ ] DO: FeedAggregator (per user) to buffer events, dedupe, and compute banner counts (optional in 1.0, recommended).
  - [ ] KV: per‑user last seen cursor + “new items count”.
- Client:
  - [ ] Home screen using generated hooks.
  - [ ] New‑items queue + sticky “Show 3 new” banner logic.
  - [ ] Filter chips + preferences persistence (Redux + mutation).
  - [ ] Edge cases: dedupe, pagination merge, offline.
- Acceptance:
  - [ ] User sees a stable feed with realtime banner, preferences persist, and scrolling works.

#### Phase 1b — Search MVP (Lexical)
- Goals:
  - Unified search with LIKE/trigram across title/body/tags.
  - Search page UI with filters and pagination.
  - Suggest/autocomplete via KV.
- Server:
  - [ ] Build `search_index` writer on create/update (sync path).
  - [ ] Implement `search` query with simple scoring (match count + recency).
  - [ ] KV: `searchSuggest` using prefix keys; rotate top queries periodically.
- Client:
  - [ ] Search screen with input, filters, and result list (FeedConnection).
  - [ ] Autosuggest dropdown connected to `searchSuggest`.
- Acceptance:
  - [ ] User can search across entities with usable results and suggestions.

#### Phase 2 — Personalization & Ranking Upgrades
- Goals:
  - Affinity boosts (following, close friends), topic boosts, basic downrank (mutes).
  - Trending caches (KV) and surface trending topics/places.
  - Backpressure and batching in subscriptions.
- Follow Graph (required groundwork for boosts/filters):
  - Add follow graph and close‑friends relations and expose GraphQL operations.
  - Enforce `followingOnly` and `circleOnly` in `getFeed` and `feedNewEvents`.
- Server:
  - [ ] Add rank formula: recency + affinity + topic match.
  - [ ] KV: trending counters from events; compaction job to produce top lists.
  - [ ] Subscription batching: coalesce events into 10–30s windows per user.
  - [ ] Add D1 tables:
    - `follow_edges(followerId TEXT, followeeId TEXT, createdAt INTEGER)` with UNIQUE `(followerId, followeeId)` and index on `(followeeId, createdAt DESC)`
    - `close_friends(userId TEXT, friendId TEXT, createdAt INTEGER)` with UNIQUE `(userId, friendId)`
  - [ ] GraphQL:
    - Mutations: `followUser(followeeId: ID!): Boolean!`, `unfollowUser(followeeId: ID!): Boolean!`, `addToCloseFriends(friendId: ID!): Boolean!`, `removeFromCloseFriends(friendId: ID!): Boolean!`
    - Queries: `isFollowing(userId: ID!): Boolean!`, `getFollowers(userId: ID!, first: Int, after: String)`, `getFollowing(userId: ID!, first: Int, after: String)`
  - [ ] Feed integration:
    - Apply `followingOnly` filter using `follow_edges`
    - Apply `circleOnly` filter using `close_friends`
- Client:
  - [ ] “Following” vs “For You” segment behavior.
  - [ ] Trending chipset and surface module.
- Acceptance:
  - [ ] Feeds feel more personal; trending works and updates periodically.

#### Phase 3 — Semantic Search (Vectorize) & Hybrid Ranking
- Goals:
  - Use Workers AI for multilingual embeddings (e.g., `@cf/baai/bge-m3`) for EN/FA.
  - Write embeddings via Queues to Vectorize.
  - Implement `searchSemantic` using KNN in Vectorize.
  - Hybrid ranking (lexical + vector) and related content panels.
- Server:
  - [ ] Queue embed jobs on create/update; handle retries.
  - [ ] Vectorize write path with metadata (entityType, entityId, lang, topics, createdAt).
  - [ ] Implement `searchSemantic` (KNN) and hybrid rerank (weighted blend).
  - [ ] Related entities endpoint (KNN by entity vector).
- Client:
  - [ ] Toggle “semantic” mode and “related” sections.
  - [ ] Multilingual support awareness in UI.
- Acceptance:
  - [ ] Semantic search returns relevant cross‑language results; hybrid improves relevance.

#### Phase 4 — Reliability, Scale, and Analytics
- Goals:
  - Rate‑limiting, abuse detection, and quotas (KV counters).
  - DO fan‑out pipeline and per‑user aggregator stability.
  - Observability and analytics (logs, basic metrics).
- Server:
  - [ ] Rate‑limit mutations and search calls (sliding window in KV).
  - [ ] DO: robust reconnection and snapshot restore from KV/PREF_CACHE.
  - [ ] Queues: dead‑letter for failed embeddings/index writes.
  - [ ] Analytics: capture search queries, click‑through (privacy‑aware).
- Client:
  - [ ] Telemetry hooks (opt‑in), performance tracing for feed/search screens.
- Acceptance:
  - [ ] System remains responsive under load; errors isolated and recoverable.

---

### Wrangling (Bindings reference)
In `wrangler.toml` (illustrative):
```toml
kv_namespaces = [
  { binding = "FEED_CACHE", id = "xxxx" },
  { binding = "SEARCH_CACHE", id = "xxxx" },
  { binding = "TRENDING_CACHE", id = "xxxx" },
  { binding = "PREF_CACHE", id = "xxxx" }
]

[[queues.producers]]
binding = "EMBED_QUEUE"
queue = "embed-queue"

[[queues.consumers]]
queue = "embed-queue"
max_batch_size = 50

[[vectorize]]
binding = "FEED_SEARCH_INDEX"
index_name = "feed-search-index"

[[r2_buckets]]
binding = "MEDIA"
bucket_name = "safarnak-media"
```

---

### Acceptance Criteria Summary (Phase 1)
- Feed:
  - Stable, paginated feed by recency with per‑user filters and visibility rules.
  - Realtime banner capping to 3 new items; batching avoids UI churn.
  - Preferences persisted server‑side and reflected client‑side immediately.
- Search:
  - Unified search with LIKE/trigram, typed filters, suggestions.
  - Pagination and dedupe across entities.
- Infra:
  - Migrations applied; bindings configured; codegen up to date.

---

### Risks & Mitigations
- Embedding costs / rate limits: batch in Queues, backoff, and cache results.
- Multilingual accuracy: choose `@cf/baai/bge-m3` (multilingual) and allow model override.
- Privacy of close‑friends data: enforce audience filters at write and read; never leak via search.
- Backpressure on subscriptions: batch at DO level and cap client queue lengths.
- Cache incoherence: include short TTLs, event‑driven invalidation on create/update.

---

### Out of Scope (for now)
- Advanced geospatial indexing beyond radius filters.
- Ads/promoted ranking.
- Full analytics pipeline beyond basic counters/logs.

---

### Next Steps (to kick off)
1) Phase 0 tasks, then Phase 1 Feed MVP and Phase 1b Search MVP.
2) Confirm Vectorize/KV/DO/Queues/R2 bindings and envs.
3) Iterate on ranking and UX after initial user feedback.

---

## Multi‑Phase Database & Infra Migrations

This section translates the roadmap into actionable migrations for D1 (Drizzle), client SQLite auto‑migrations, and infra bindings changes. Follow per‑phase steps; do not manually edit generated files.

### Conventions
- Naming: Drizzle migration files `migrations/YYYYMMDDHHMM_add_<name>.sql`
- Run order:
  - Server: `yarn db:generate` → review → `yarn db:migrate`
  - Client: auto‑migrated on app init via `database/client.ts`
- After GraphQL schema/ops changes: `yarn codegen`
- Keep path aliases; no relative imports

### Phase 0 — Foundations (Schema + Bindings)
- D1 Tables (server, `database/schema.ts`):
  - `feed_events`:
    - Columns: `id TEXT PK`, `entityType TEXT`, `entityId TEXT`, `actorId TEXT`, `verb TEXT`, `topics TEXT`, `visibility TEXT`, `createdAt INTEGER`, `rank REAL`
    - Indexes:
      - `idx_feed_events_createdAt_desc` on `(createdAt DESC, id DESC)`
      - `idx_feed_events_entity` on `(entityType, entityId)`
      - `idx_feed_events_actor_createdAt` on `(actorId, createdAt DESC)`
      - `idx_feed_events_visibility_createdAt` on `(visibility, createdAt DESC)`
  - `feed_preferences`:
    - Columns: `userId TEXT PK`, `entityTypes TEXT`, `topics TEXT`, `followingOnly INTEGER`, `circleOnly INTEGER`, `mutedUserIds TEXT`, `updatedAt INTEGER`
  - `search_index`:
    - Columns: `entityType TEXT`, `entityId TEXT`, `title TEXT`, `text TEXT`, `tags TEXT`, `locationName TEXT`, `createdAt INTEGER`, `updatedAt INTEGER`, `lang TEXT`, `tokens TEXT`, `trigrams TEXT`
    - Indexes:
      - `idx_search_index_entity` on `(entityType, entityId)` UNIQUE
      - `idx_search_index_createdAt` on `(createdAt DESC)`
      - Optional LIKE helpers: `tokens`, `trigrams`
  - Follow graph (if missing):
    - `follow_edges(followerId TEXT, followeeId TEXT, createdAt INTEGER)` with index `(followerId, followeeId)` UNIQUE, `(followeeId, createdAt DESC)`
    - `close_friends(userId TEXT, friendId TEXT, createdAt INTEGER)` with unique `(userId, friendId)`
- Client (SQLite, `database/client.ts` auto‑migrate):
  - Add cached mirror if needed:
    - `cachedFeedEvents(id TEXT PK, entityType TEXT, entityId TEXT, ... , createdAt INTEGER, syncedAt INTEGER)`
    - Index `(createdAt DESC, id DESC)` for fast local pagination
  - Ensure `DrizzleCacheStorage` maps feed entities properly
- Infra (wrangler.toml):
  - Add KV namespaces: FEED_CACHE, SEARCH_CACHE, TRENDING_CACHE, PREF_CACHE
  - Add Queues: EMBED_QUEUE (+ consumer block), REINDEX_QUEUE (optional now)
  - Add Vectorize binding: FEED_SEARCH_INDEX
  - Add R2 bucket binding: MEDIA
- Actions:
  - Update `database/schema.ts` with new tables
  - `yarn db:generate` → review SQL → `yarn db:migrate`
  - Update `wrangler.toml` with bindings
  - `yarn codegen` after GraphQL schema updates

### Phase 1 — Home Feed MVP (DB + GraphQL)
- D1:
  - Verify `feed_events` and indexes exist
  - Add minimal computed `rank` default (same as recency); populate via `UPDATE` if needed
- GraphQL:
  - Add `getFeed`, `feedNewEvents`, `getFeedPreferences`, `updateFeedPreferences`
  - Ensure resolvers publish `FeedEvent` on create/update
- Client:
  - Ensure local cache tables exist; verify pagination paths use `(createdAt,id)` cursors
- Actions:
  - `yarn db:migrate` if schema changed
  - `yarn codegen`

### Phase 1b — Search MVP (Lexical)
- D1:
  - Confirm `search_index` and indexes exist
  - Add triggers or write‑path hooks in resolvers to upsert search rows on create/update
- Infra:
  - KV `SEARCH_CACHE` keys for `searchSuggest:*` with TTL 2–10m
- Actions:
  - Backfill `search_index` from existing entities (ad‑hoc script/worker job)

### Phase 2 — Personalization, Trending, Ranking
- D1:
  - Optional: add `engagement` counters table for server‑side scoring (likes/comments/shares per entity)
    - `engagement(entityType TEXT, entityId TEXT, likes INTEGER, comments INTEGER, shares INTEGER, impressions INTEGER, updatedAt INTEGER)`
    - Index `(entityType, entityId)` PK/UNIQUE
  - Add `topic_stats(topic TEXT, window TEXT, bucketTs INTEGER, count INTEGER, uniqueAuthors INTEGER)` if precomputing in D1 (optional; KV‑only is fine)
- KV / DO:
  - Sharded counters in KV for trending increments
  - DO (TrendingRollup): rollup, velocity calc, and top‑K publish to KV `top:*`
- GraphQL:
  - Add `getTrending` query (topics/places/users/entities with window arg)
- Actions:
  - `yarn db:migrate` if engagement tables added

### Phase 3 — Semantic Search (Vectorize) & Hybrid
- Vectorize:
  - Create index `FEED_SEARCH_INDEX` with chosen model dimension
  - Queue write path: enqueue EMBED_QUEUE for text to embed
- D1:
  - Optional `embeddings_meta(entityType, entityId, vectorId TEXT, model TEXT, lang TEXT, updatedAt INTEGER)` to track external vector ids and model version
  - Index `(entityType, entityId)` UNIQUE
- Actions:
  - Queue backfill for existing content (REINDEX_QUEUE)

### Phase 4 — Reliability & Analytics
- D1:
  - Optional `rate_limits(subject TEXT, window TEXT, bucketTs INTEGER, count INTEGER)`
  - `search_queries(query TEXT, lang TEXT, ts INTEGER, count INTEGER)` (aggregated, privacy‑aware)
- KV:
  - Sliding‑window counters for API limits
- Actions:
  - Migrate only if analytics storage chosen beyond logs

---

## Wrangler Bindings Migration Checklist

- Add/update in `wrangler.toml`:
  - KV namespaces:
    - FEED_CACHE, SEARCH_CACHE, TRENDING_CACHE, PREF_CACHE
  - Queues:
    - Producer + consumer for EMBED_QUEUE (and REINDEX_QUEUE if used)
  - Vectorize:
    - FEED_SEARCH_INDEX → index name set in account
  - R2:
    - MEDIA bucket for uploads/thumbnails
- Verify env var access in Worker entry (`worker/index.ts`) and utilities
- Deploy a staging environment first; validate bindings via `wrangler dev` and `wrangler tail`

---

## Personalization Page Update Plan (Profile)

### Goals
- Modernize the personalization UX to align with the new feed architecture.
- Persist preferences server‑side (`feed_preferences`) and mirror locally for instant UX.
- Support EN/FA, accessibility, and offline behavior.

### UX Scope
- Sections:
  - Topics: selectable chips with search; show “Trending topics” (from `getTrending`)
  - Entity types: multi‑select (Trip/Tour/Place/Location/Post)
  - Feed mode: toggles for “Following only”, “Close friends only”
  - Muted users/tags: list with add/remove
  - Region/language hints (optional)
- Interactions:
  - Optimistic save on change; debounce and call `updateFeedPreferences`
  - “Reset to defaults” action
  - Inline status (“Saved”, “Retry”) with automatic retry if offline

### Data & API
- Read: `getFeedPreferences`
- Write: `updateFeedPreferences(input: FeedFilter!)`
- State: Redux slice caches last successful preferences; rehydrates on app start
- Autosuggest topics:
  - Use `searchSuggest(prefix)` and `getTrending(type: TOPIC)` to seed chips

### Client Implementation
- File: `app/(app)/(profile)/personalization.tsx` (or existing screen path)
- Hooks:
  - `useGetFeedPreferencesQuery`, `useUpdateFeedPreferencesMutation`
  - Local state with optimistic updates; rollback if mutation fails
- Styling: NativeWind v4 chips/toggles with theme support
- i18n: `@locales` keys for labels and hints; avoid hardcoded strings

### Validation & Defaults
- Defaults:
  - `entityTypes`: all enabled
  - `followingOnly`: false
  - `circleOnly`: false
  - `topics`: empty
  - `mutedUserIds`: empty
- Validation:
  - Cap topics to reasonable limit (e.g., 50)
  - Ensure `followingOnly` and `circleOnly` are not both true unless semantics are “AND”

### QA Checklist
- Offline:
  - Preferences view loads cached values when offline; writes queue until online
- Feed linkage:
  - Home screen re‑reads preferences on focus and applies filters to query & subscription
- Accessibility:
  - Focus order, screen reader labels, sufficient contrast
- i18n:
  - EN/FA correctness, truncation handling in chip lists


