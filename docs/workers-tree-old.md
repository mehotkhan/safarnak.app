
**Generated:** $(date)  
**Version:** 2.8.3  
**Project:** Safarnak App - Cloudflare Worker Backend

---

## Table of Contents

1. [Overview](#overview)
2. [Directory Structure](#directory-structure)
3. [Entry Point & Core Architecture](#entry-point--core-architecture)
4. [GraphQL Resolvers](#graphql-resolvers)
5. [Authentication & Security](#authentication--security)
6. [Database Operations](#database-operations)
7. [AI & Machine Learning](#ai--machine-learning)
8. [Workflows](#workflows)
9. [Subscriptions & Real-time](#subscriptions--real-time)
10. [Utilities & Helpers](#utilities--helpers)
11. [Durable Objects](#durable-objects)
12. [Static Assets & Landing Page](#static-assets--landing-page)
13. [Queue Processing](#queue-processing)
14. [Error Handling & Logging](#error-handling--logging)
15. [Performance Optimizations](#performance-optimizations)
16. [Security Considerations](#security-considerations)
17. [Dependencies & Integrations](#dependencies--integrations)

---

## Overview

The Worker directory contains the complete Cloudflare Worker backend implementation for Safarnak, a full-stack offline-first travel application. The worker serves as a GraphQL API server, handling queries, mutations, subscriptions, and background processing.

### Key Characteristics

- **Runtime:** Cloudflare Workers (Edge Computing)
- **GraphQL Server:** GraphQL Yoga v5.16.0
- **Database:** Cloudflare D1 (SQLite) via Drizzle ORM
- **Real-time:** WebSocket subscriptions via Durable Objects
- **AI Integration:** Cloudflare Workers AI
- **Vector Search:** Cloudflare Vectorize
- **Storage:** KV (sessions/cache), R2 (media), Queues (embeddings)

### Architecture Pattern

- **Monorepo Structure:** Single-root with shared GraphQL schema
- **Resolver Pattern:** Modular resolvers organized by operation type
- **Workflow Pattern:** Long-running background jobs for trip creation/updates
- **Subscription Pattern:** Real-time updates via WebSocket connections

---

## Directory Structure

```
worker/
├── index.ts                    # Main entry point & GraphQL server setup
├── types.ts                    # TypeScript type definitions
├── constants.ts               # Shared constants
├── version.ts                 # App version (2.8.3)
├── landing.html               # Landing page HTML
├── assets/                     # Static assets (favicons, logos)
│   ├── favicon-*.png
│   └── logo-*.png
├── durable/                   # Durable Objects
│   └── TrendingRollup.ts      # Trending aggregation DO
├── queries/                    # GraphQL query resolvers (24 files)
│   ├── index.ts
│   ├── me.ts
│   ├── getTrips.ts
│   ├── getFeed.ts
│   ├── getUser.ts
│   ├── search.ts
│   ├── searchSemantic.ts
│   └── ... (17 more)
├── mutations/                 # GraphQL mutation resolvers (27 files)
│   ├── index.ts
│   ├── registerUser.ts
│   ├── loginUser.ts
│   ├── createTrip.ts
│   ├── createPost.ts
│   ├── updateTrip.ts
│   └── ... (21 more)
├── subscriptions/             # GraphQL subscription resolvers (4 files)
│   ├── index.ts
│   ├── newMessages.ts
│   ├── newAlerts.ts
│   ├── tripUpdates.ts
│   └── feedNewEvents.ts
├── utilities/                 # Shared utility functions
│   ├── index.ts
│   ├── auth/                  # Authentication utilities
│   │   ├── password.ts        # PBKDF2 password hashing
│   │   └── crypto.ts          # ECDSA signature verification
│   ├── ai/                     # AI/ML utilities
│   │   ├── generateItinerary.ts
│   │   ├── generateAvatar.ts
│   │   ├── translate.ts
│   │   ├── updateTrip.ts
│   │   ├── models.ts
│   │   └── prompts.ts
│   ├── destination/           # Destination research
│   │   ├── index.ts
│   │   ├── geo.ts
│   │   ├── poi.ts
│   │   ├── wiki.ts
│   │   ├── synthesize.ts
│   │   ├── indexVector.ts
│   │   └── types.ts
│   ├── semantic/              # Semantic search
│   │   ├── embed.ts
│   │   ├── embeddings.ts
│   │   └── searchAttractions.ts
│   ├── trip/                   # Trip utilities
│   │   ├── loadTrip.ts
│   │   ├── persistFeedback.ts
│   │   ├── validator.ts
│   │   ├── itineraryShared.ts
│   │   └── types.ts
│   ├── publishNotification.ts # Notification publishing
│   └── trending.ts            # Trending algorithm
└── workflows/                 # Long-running workflows
    ├── tripCreationWorkflow.ts
    └── tripUpdateWorkflow.ts
```

**Total Files:** ~80 TypeScript files + assets

---

## Entry Point & Core Architecture

### `worker/index.ts` - Main Entry Point

The entry point sets up the GraphQL Yoga server, handles routing, and exports worker handlers.

#### Key Components

1. **GraphQL Schema Loading**
   - Uses `readGraphQLSchema()` from shared `graphql/` directory
   - Creates executable schema with resolvers

2. **Resolver Exports**
   ```typescript
   export const resolvers = {
     Query,
     Mutation,
     Subscription,
     PostRelatedEntity: { __resolveType },
     FeedEntity: { __resolveType },
   };
   ```

3. **GraphQL Yoga Configuration**
   - GraphiQL enabled with WebSocket subscriptions
   - Error logging plugins
   - Subscription cleanup on WebSocket connections
   - Context creation with authentication

4. **Authentication Middleware**
   - Extracts `userId` from `Authorization: Bearer <token>` header
   - Validates token via KV storage (`token:${token}`)
   - Token format: `{ userId, deviceId }` with 7-day TTL

5. **Request Routing**
   - `/` → Landing page HTML
   - `/graphql` → GraphQL endpoint
   - `/favicon.*` → Static favicon assets
   - `/assets/logo-*.png` → Logo assets
   - `/avatars/*` → R2 bucket avatar serving

6. **Worker Exports**
   ```typescript
   export default {
     fetch,              // HTTP request handler
     queue: workerQueue, // Queue consumer (EMBED_QUEUE)
     scheduled: workerScheduled, // Cron job (trending rollup)
   };
   ```

7. **Durable Objects Export**
   - `TrendingRollup` - Aggregates trending entities/topics

8. **Workflow Exports**
   - `TripCreationWorkflow` - Background trip planning
   - `TripUpdateWorkflow` - AI-powered trip updates

#### Subscription Handling

- Wraps subscription fetch to handle UNIQUE constraint violations
- Cleans up old/inactive subscriptions on WebSocket upgrade
- Prevents duplicate subscription IDs on reconnection

---

## GraphQL Resolvers

### Query Resolvers (24 total)

Located in `worker/queries/`, exported via `queries/index.ts`.

#### User Queries

- **`me`** - Get current authenticated user
  - Returns user profile (id, name, username, email, phone, avatar, publicKey)
  - Requires authentication

- **`getUser`** - Get user by ID
  - Public profile lookup

- **`checkUsernameAvailability`** - Check if username is available
  - Used during registration

- **`getMyDevices`** - List user's registered devices
  - Shows deviceId, publicKey, lastSeen

- **`getFollowers`** - Get user's followers
- **`getFollowing`** - Get users being followed
- **`isFollowing`** - Check follow relationship

#### Trip Queries

- **`getTrips`** - List user's trips (with optional status filter)
  - Returns trips with parsed JSON fields (itinerary, coordinates, waypoints)
  - Ordered by createdAt DESC

- **`getTrip`** - Get single trip by ID
  - Ownership verification required

#### Feed & Social Queries

- **`getFeed`** - Social feed with pagination
  - Supports filtering by entityType, topics, followingOnly, circleOnly
  - Cursor-based pagination (createdAt + id)
  - Boost scoring (following +2, close friends +3, topic match +0.5)
  - Returns feed events with actor and entity data

- **`getPosts`** - List posts (with pagination)
- **`getPost`** - Get single post with comments/reactions

- **`getBookmarks`** - Get user's bookmarked posts

#### Search Queries

- **`search`** - Lexical search (text-based)
  - Searches `searchIndex` table
  - Token-based matching

- **`searchSemantic`** - Semantic search (vector-based)
  - Uses Cloudflare Vectorize
  - Embedding-based similarity search

#### Trending Queries

- **`getTrending`** - Get trending entities/topics
  - Time windows: M5 (5 minutes), H1 (1 hour), D1 (1 day)
  - Decay algorithm applied

#### Location & Place Queries

- **`getLocations`** - List locations
- **`getPlaces`** - List places
- **`getTours`** - List tours

#### Alert Queries

- **`getAlerts`** - Get user notifications/alerts
  - Stored in `notifications` table

#### Messages Queries

- **`getMessages`** - Get chat messages
  - Conversation-based retrieval

### Mutation Resolvers (27 total)

Located in `worker/mutations/`, exported via `mutations/index.ts`.

#### Authentication Mutations

- **`requestChallenge`** - Request authentication challenge
  - Generates nonce for biometric auth
  - Stores challenge in `challenges` table with expiration

- **`registerUser`** - Register new user (biometric)
  - Validates challenge signature
  - Creates user + device entry
  - Generates token, stores in KV
  - Returns user + token

- **`loginUser`** - Login existing user (biometric)
  - Validates challenge signature
  - Creates device if new, updates lastSeen if existing
  - Generates token, stores in KV
  - Returns user + token

- **`updateUser`** - Update user profile
- **`revokeDevice`** - Revoke device access

#### Trip Mutations

- **`createTrip`** - Create new trip
  - Validates input (description, travelers)
  - Creates placeholder itinerary immediately
  - Triggers `TripCreationWorkflow` for background planning
  - Publishes feed event (PUBLIC)
  - Upserts search index
  - Enqueues embedding job
  - Returns trip with parsed JSON fields

- **`updateTrip`** - Update existing trip
  - Ownership verification
  - Updates fields (destination, budget, itinerary, etc.)
  - Triggers `TripUpdateWorkflow` if user message provided

- **`deleteTrip`** - Delete trip
  - Soft delete (sets deletedAt)

#### Post & Social Mutations

- **`createPost`** - Create social post
  - Validates related entity (trip/tour/place) if type provided
  - Extracts hashtags as topics
  - Upserts search index
  - Publishes feed event
  - Enqueues embedding job
  - Returns post with user data

- **`createComment`** - Add comment to post
- **`createReaction`** - Add reaction (like) to post
- **`deleteReaction`** - Remove reaction
- **`bookmarkPost`** - Bookmark post

#### Tour & Place Mutations

- **`createTour`** - Create tour
- **`updateTour`** - Update tour
- **`deleteTour`** - Delete tour
- **`bookTour`** - Book tour

- **`createPlace`** - Create place
- **`updatePlace`** - Update place
- **`deletePlace`** - Delete place

- **`createLocation`** - Create location
- **`updateLocation`** - Update location
- **`deleteLocation`** - Delete location

#### Social Graph Mutations

- **`followUser`** - Follow user
- **`unfollowUser`** - Unfollow user
- **`addToCloseFriends`** - Add to close friends circle
- **`removeFromCloseFriends`** - Remove from close friends

#### Feed Preferences

- **`updateFeedPreferences`** - Update user feed preferences
  - Muted users, preferred topics, etc.

#### Avatar Generation

- **`generateAvatar`** - Generate AI avatar
  - Uses Workers AI
  - Stores in R2 bucket

### Subscription Resolvers (4 total)

Located in `worker/subscriptions/`, exported via `subscriptions/index.ts`.

All subscriptions use `graphql-workers-subscriptions` library:

- **`newMessages`** - Real-time message notifications
  - Topic: `NEW_MESSAGES`

- **`newAlerts`** - Real-time alert notifications
  - Topic: `NEW_ALERTS`
  - Stored in `notifications` table

- **`tripUpdates`** - Real-time trip workflow updates
  - Topic: `TRIP_UPDATE`
  - Used by workflows to notify clients of progress

- **`feedNewEvents`** - Real-time feed events
  - Topic: `FEED_NEW_EVENTS`
  - New posts, trips, tours, places

---

## Authentication & Security

### Biometric Authentication Flow

1. **Challenge Request** (`requestChallenge`)
   - Client requests challenge for username
   - Server generates nonce, stores in `challenges` table
   - Returns nonce to client

2. **Registration/Login** (`registerUser`/`loginUser`)
   - Client signs nonce with device private key
   - Sends signature + publicKey (JWK format)
   - Server verifies signature using Web Crypto API
   - Creates/updates user/device, generates token

### Token Management

- **Token Generation:** SHA-256 hash of `userId-username-timestamp`
- **Token Storage:** KV namespace with key `token:${token}`
- **Token Format:** `{ userId, deviceId }` JSON
- **TTL:** 7 days (604,800 seconds)
- **Device Mapping:** Also stored as `device:${deviceId}:token`

### Password Hashing (Legacy)

- **Algorithm:** PBKDF2
- **Iterations:** 100,000
- **Hash Function:** SHA-256
- **Salt Length:** 16 bytes
- **Output:** Base64 encoded (salt + hash)

### Signature Verification

- **Algorithm:** ECDSA P-256
- **Message:** Challenge nonce
- **Signature Format:** Base64 DER
- **Public Key Format:** JWK (JSON Web Key)
- **Validation:** Strict JWK structure validation (kty, crv, x, y)

### Security Features

- Token-based authentication only (no x-user-id header)
- Constant-time password comparison
- Challenge expiration (time-based)
- Device-specific tokens (revocable)
- Web Crypto API for all cryptographic operations

---

## Database Operations

### Database Access Pattern

All database operations use Drizzle ORM with `getServerDB(context.env.DB)`:

```typescript
import { getServerDB, users, trips } from '@database/server';
import { eq, desc, and } from 'drizzle-orm';

const db = getServerDB(context.env.DB);
const user = await db.select().from(users).where(eq(users.id, userId)).get();
```

### Common Patterns

1. **Select Queries**
   - Single record: `.get()`
   - Multiple records: `.all()`
   - With ordering: `.orderBy(desc(field))`
   - With pagination: `.limit(n)`

2. **Insert Operations**
   - Single insert: `.insert(table).values({...}).returning().get()`
   - Bulk insert: `.insert(table).values([...]).run()`

3. **Update Operations**
   - `.update(table).set({...}).where(eq(field, value)).run()`

4. **Delete Operations**
   - Soft delete: `.update(table).set({ deletedAt: ... }).where(...)`
   - Hard delete: `.delete(table).where(...).run()`

5. **JSON Field Handling**
   - Storage: `JSON.stringify(data)`
   - Retrieval: `JSON.parse(field || '[]')`

### Transaction Support

- Drizzle ORM supports transactions via `.transaction()`
- Used in complex operations (e.g., feed event + search index update)

---

## AI & Machine Learning

### Workers AI Integration

The worker uses Cloudflare Workers AI for multiple tasks:

#### 1. Itinerary Generation (`utilities/ai/generateItinerary.ts`)

- **Model:** `@cf/meta/llama-3.1-8b-instruct` (default)
- **Process:**
  1. Preference analysis (extract travel style, interests, budget)
  2. Itinerary generation (day-by-day plan)
  3. Validation (ensure valid structure)
  4. Fallback (if validation fails)

- **Input:** Destination, preferences, dates, budget, travelers, attractions, restaurants
- **Output:** Structured itinerary with days, activities, estimated costs

#### 2. Trip Updates (`utilities/ai/updateTrip.ts`)

- **Model:** `@cf/meta/llama-3.1-8b-instruct`
- **Process:** Analyzes user feedback, updates itinerary accordingly
- **Input:** Current trip, user message, user location
- **Output:** Updated itinerary + modification summary

#### 3. Translation (`utilities/ai/translate.ts`)

- **Model:** `@cf/meta/llama-3.1-8b-instruct`
- **Process:** Translates itinerary to target language
- **Supports:** Multi-language itinerary generation

#### 4. Avatar Generation (`mutations/generateAvatar.ts`)

- **Model:** Image generation model (TBD)
- **Process:** Generates user avatar from preferences

#### 5. Destination Research (`utilities/destination/synthesize.ts`)

- **Model:** `@cf/meta/llama-3.1-8b-instruct`
- **Process:** Synthesizes destination facts (timezone, currency, language, climate)
- **Input:** Destination name, country
- **Output:** Structured destination facts

### Vector Search (Semantic Search)

#### Embedding Generation

- **Model:** `@cf/baai/bge-m3` (default, 1024 dimensions)
- **Process:**
  1. Text extracted from entities (trips, posts, places)
  2. Enqueued to `EMBED_QUEUE`
  3. Queue consumer generates embeddings
  4. Upserted to Vectorize index

#### Semantic Search (`utilities/semantic/searchAttractions.ts`)

- **Process:**
  1. Embed user preferences
  2. Query Vectorize index for similar attractions
  3. Return top matches with metadata

#### Vectorize Index Structure

- **ID Format:** `${entityType}:${entityId}`
- **Metadata:** `{ entityType, entityId, lang }`
- **Dimensions:** 1024 (for bge-m3)

---

## Workflows

### Trip Creation Workflow (`workflows/tripCreationWorkflow.ts`)

Long-running workflow for intelligent trip planning.

#### Steps

1. **Research Destination** (cache-first)
   - Geocode destination
   - Fetch attractions (OpenStreetMap)
   - Fetch restaurants (OpenStreetMap)
   - Fetch Wikipedia facts
   - Synthesize destination facts (AI)
   - Cache result for 24 hours

2. **Validate Trip Feasibility**
   - Check budget, dates, duration
   - Validate destination reachability
   - Generate warnings if needed

3. **Semantic Matching**
   - Search Vectorize for attractions matching preferences
   - Fallback to all attractions if few results

4. **AI Itinerary Generation**
   - Generate day-by-day itinerary
   - Use matched attractions and restaurants
   - Include estimated costs

5. **Translation** (if needed)
   - Translate itinerary to target language
   - Skip if English

6. **Final Save**
   - Update trip in database
   - Extract waypoints from itinerary
   - Store metadata (validation, facts, analysis)

#### Notifications

Each step publishes `TRIP_UPDATE` subscription notifications:
- Step progress (1/6, 2/6, etc.)
- Status messages
- Completion status

### Trip Update Workflow (`workflows/tripUpdateWorkflow.ts`)

AI-powered trip updates based on user feedback.

#### Steps

1. **Acknowledge** - Confirm request received
2. **Load + Persist Feedback** - Load trip, save user message
3. **Research** (optional) - Re-research destination if needed
4. **AI Trip Update** - Apply user feedback via AI
5. **Validation** (optional) - Validate updated trip
6. **Translation** (if needed) - Translate updated itinerary
7. **Save + Final Notification** - Save updates, notify completion

#### AI Update Process

- Analyzes current trip + user message
- Generates updated itinerary
- Tracks modifications (destination, budget, preferences changes)
- Provides reasoning for changes

---

## Subscriptions & Real-time

### Subscription Infrastructure

- **Library:** `graphql-workers-subscriptions` v0.1.6
- **Transport:** WebSocket (WS protocol)
- **Storage:** D1 database (`subscriptions` table)
- **Connection Pool:** Durable Object (`SUBSCRIPTION_POOL`)

### Subscription Topics

1. **`NEW_MESSAGES`** - New chat messages
2. **`NEW_ALERTS`** - User notifications/alerts
3. **`TRIP_UPDATE`** - Trip workflow progress updates
4. **`FEED_NEW_EVENTS`** - New feed events (posts, trips, tours)

### Publishing Notifications

```typescript
import { publishNotification } from '../utilities/publishNotification';

await publishNotification(env, 'TRIP_UPDATE', {
  tripUpdates: {
    id: '...',
    tripId: '...',
    type: 'workflow',
    title: '...',
    message: '...',
    step: 1,
    totalSteps: 6,
    status: 'processing',
    data: JSON.stringify({...}),
    createdAt: new Date().toISOString(),
  }
}, executionCtx);
```

### Subscription Cleanup

- Automatic cleanup of old/inactive subscriptions
- Removes subscriptions older than 30 minutes
- Handles UNIQUE constraint violations on reconnection
- Prevents subscription ID conflicts

---

## Utilities & Helpers

### Authentication Utilities (`utilities/auth/`)

#### `password.ts`
- `hashPassword(password)` - PBKDF2 hashing
- `verifyPassword(password, hash)` - Password verification
- `generateToken(userId, username)` - Token generation

#### `crypto.ts`
- `generateNonce()` - Random nonce generation
- `verifySignature(message, signature, publicKeyJwk)` - ECDSA verification
- `hashMessage(message)` - SHA-256 hashing

### Destination Research (`utilities/destination/`)

#### `index.ts` - Main Orchestrator
- `researchDestination(env, destination)` - Cache-first research
- Fetches from multiple sources (OSM, Wikipedia, AI)
- Caches result for 24 hours

#### `geo.ts`
- `geocodeDestination(env, destination)` - Geocoding via external API
- Returns coordinates + address data

#### `poi.ts`
- `fetchAttractions(env, destination, coords)` - Fetch POIs from OSM
- `fetchRestaurants(env, destination, coords)` - Fetch restaurants from OSM

#### `wiki.ts`
- `fetchWikipediaFacts(env, destination, country)` - Wikipedia data extraction

#### `synthesize.ts`
- `synthesizeFacts(env, input)` - AI synthesis of destination facts
- `synthesizeTransportInfo(env, destination, country)` - Transport info synthesis

#### `indexVector.ts`
- `indexAttractionsInVectorize(env, destination, attractions)` - Index attractions for semantic search

### Semantic Search (`utilities/semantic/`)

#### `embed.ts`
- `embedText(env, text, model)` - Generate embeddings

#### `embeddings.ts`
- `enqueueEmbeddingJob(env, job)` - Enqueue embedding generation

#### `searchAttractions.ts`
- `searchAttractionsByPreferences(env, destination, preferences, limit)` - Semantic search

### Trip Utilities (`utilities/trip/`)

#### `loadTrip.ts`
- `loadTripWithContext(env, tripId)` - Load trip with full context

#### `persistFeedback.ts`
- `appendTripFeedback(env, tripId, metadata, feedback)` - Save user feedback

#### `validator.ts`
- `validateTripRequest(env, input, destinationData)` - Validate trip feasibility

#### `itineraryShared.ts`
- Shared helpers for itinerary manipulation
- `calculateDurationFromDates()`
- `normalizeDaysForDb()`
- `extractWaypointsFromDays()`
- `normalizeRawDaysToRich()`

### Trending (`utilities/trending.ts`)

- `incrementTrendingEntity(env, entityType)` - Increment entity trending score
- `incrementTrendingTopic(env, topic)` - Increment topic trending score
- `readTopList(env, kind, window, limit)` - Read trending list

**Time Windows:**
- `M5` - 5 minutes (2m half-life)
- `H1` - 1 hour (15m half-life)
- `D1` - 1 day (3h half-life)

**Decay Algorithm:** Exponential decay based on time since last update

### Notification Publishing (`utilities/publishNotification.ts`)

- `publishNotification(env, topic, payload, executionCtx)` - Publish to subscribers
- Stores notifications in database for querying
- Uses `waitUntil` for async operations

---

## Durable Objects

### TrendingRollup (`durable/TrendingRollup.ts`)

Durable Object for aggregating and compacting trending data.

#### Methods

- **`fetch(request)`** - HTTP handler
  - `POST /compact` - Trigger compaction

- **`compact()`** - Private method
  - Decays trending scores based on half-life
  - Trims lists to top 100 items
  - Updates KV storage

#### Scheduled Execution

- Triggered via `workerScheduled` cron job
- Runs compaction periodically to keep trending data fresh

---

## Static Assets & Landing Page

### Landing Page (`landing.html`)

- **Language:** Persian (Farsi) with RTL layout
- **Features:**
  - Dark mode toggle
  - Mobile-responsive navigation
  - Hero section with gradient background
  - Feature cards
  - Community section
  - Developer resources
  - Footer with links

- **Version Injection:** `{{VERSION}}` and `{{VERSION_PLAIN}}` placeholders replaced at runtime

### Static Assets (`assets/`)

- **Favicons:** 16x16, 32x32, 192x192 PNG
- **Logos:** 64x64, 200x200 PNG
- **Served via:** Direct file imports in `index.ts`
- **Caching:** 1 day for favicons, 1 year for logos (immutable)

### Avatar Serving

- **Route:** `/avatars/*`
- **Source:** R2 bucket
- **Caching:** 1 year (immutable)
- **CORS:** Enabled for cross-origin requests

---

## Queue Processing

### Embed Queue Consumer (`workerQueue`)

Processes embedding generation jobs from `EMBED_QUEUE`.

#### Process

1. Receive batch of messages
2. For each message:
   - Extract: `{ id, entityType, entityId, text, lang, model }`
   - Generate embedding via Workers AI
   - Upsert to Vectorize index with metadata
   - Acknowledge message

#### Error Handling

- Logs vector dimension mismatches
- Does not acknowledge on error (retry)
- Handles missing/invalid embeddings gracefully

#### Model Default

- Default: `@cf/baai/bge-m3` (1024 dimensions)
- Configurable per job

---

## Error Handling & Logging

### Error Handling Patterns

1. **Try-Catch Blocks**
   - Most resolvers wrapped in try-catch
   - Log errors with context
   - Return null or throw user-friendly errors

2. **GraphQL Error Logging**
   - Plugin logs all GraphQL errors
   - Includes operation name, error message, path

3. **Validation Errors**
   - Input validation before database operations
   - Clear error messages for client

4. **Database Errors**
   - Drizzle ORM prevents SQL injection
   - Errors logged but not exposed to client

### Logging Patterns

- **Format:** `[Component] Message` (e.g., `[me] Retrieved user`)
- **Context:** Includes relevant IDs, usernames, etc.
- **Levels:** `console.log`, `console.warn`, `console.error`

### Error Messages

- **Client-Facing:** User-friendly messages (e.g., "Username already taken")
- **Internal:** Detailed logs with stack traces
- **Masked Errors:** `maskedErrors: false` in Yoga config (shows actual errors)

---

## Performance Optimizations

### Caching Strategies

1. **Destination Research**
   - KV cache for 24 hours
   - Cache key: `destination:${destination.toLowerCase()}`

2. **Trending Data**
   - KV storage with time-based decay
   - Top 100 items per window

3. **Static Assets**
   - Long cache headers (1 day to 1 year)
   - Immutable cache for logos

### Database Optimizations

1. **Indexed Queries**
   - Drizzle ORM uses indexes automatically
   - Foreign key relationships optimized

2. **Pagination**
   - Cursor-based pagination (createdAt + id)
   - Limits result sets (max 50 items)

3. **JSON Parsing**
   - Lazy parsing (only when needed)
   - Cached parsed results

### Parallel Processing

1. **Destination Research**
   - Parallel fetching of attractions, restaurants, Wikipedia

2. **Workflow Steps**
   - Independent steps can run in parallel where possible

3. **Embedding Jobs**
   - Queue-based async processing
   - Non-blocking for main request

### Subscription Optimization

1. **Cleanup**
   - Automatic cleanup of old subscriptions
   - Prevents database bloat

2. **Connection Pooling**
   - Durable Object for connection management
   - Efficient WebSocket handling

---

## Security Considerations

### Authentication Security

- ✅ Token-based authentication (no passwords in requests)
- ✅ Biometric signature verification (ECDSA P-256)
- ✅ Challenge expiration (time-based)
- ✅ Device-specific tokens (revocable)
- ✅ Constant-time password comparison (if used)

### Data Security

- ✅ Input validation on all mutations
- ✅ Ownership verification (users can only modify own data)
- ✅ SQL injection prevention (Drizzle ORM)
- ✅ XSS prevention (React Native escapes by default)

### API Security

- ✅ Authorization header required for authenticated endpoints
- ✅ Token validation on every request
- ✅ Error messages don't leak sensitive data
- ✅ CORS configured for avatar serving

### Storage Security

- ✅ Tokens stored with TTL (7 days)
- ✅ Sensitive data not logged
- ✅ R2 bucket access controlled

---

## Dependencies & Integrations

### Core Dependencies

- **GraphQL Yoga** ^5.16.0 - GraphQL server
- **graphql-workers-subscriptions** ^0.1.6 - Real-time subscriptions
- **Drizzle ORM** ^0.44.6 - Database ORM
- **@graphql-tools/schema** - Schema utilities

### Cloudflare Services

- **D1 Database** - SQLite database
- **KV Namespace** - Key-value storage (sessions, cache)
- **R2 Bucket** - Object storage (avatars)
- **Vectorize** - Vector database (embeddings)
- **Workers AI** - AI/ML models
- **Durable Objects** - Stateful objects (subscriptions, trending)
- **Queues** - Async job processing (embeddings)
- **Workflows** - Long-running background jobs

### External APIs

- **OpenStreetMap** - POI data (attractions, restaurants)
- **Wikipedia** - Destination facts
- **Geocoding API** - Address/coordinate conversion

---

## Summary Statistics

- **Total Files:** ~80 TypeScript files
- **Query Resolvers:** 24
- **Mutation Resolvers:** 27
- **Subscription Resolvers:** 4
- **Utility Modules:** 8 categories
- **Workflows:** 2 (trip creation, trip update)
- **Durable Objects:** 1 (TrendingRollup)
- **AI Models Used:** 1 primary (Llama 3.1 8B), 1 embedding (bge-m3)

---

## Future Enhancements

### Potential Improvements

1. **Caching**
   - Add Redis-like caching layer
   - Cache frequently accessed queries

2. **Rate Limiting**
   - Implement per-user rate limits
   - Protect against abuse

3. **Monitoring**
   - Add metrics collection
   - Performance monitoring

4. **Testing**
   - Unit tests for resolvers
   - Integration tests for workflows

5. **Documentation**
   - OpenAPI/Swagger docs
   - GraphQL schema documentation

---

**End of Analysis**
