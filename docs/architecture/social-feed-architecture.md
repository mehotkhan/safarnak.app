# Safarnak Social Feed Architecture

> **Complete guide to the social streaming, feed system, and real-time architecture**

---

## Table of Contents

1. [Overview](#overview)
2. [Architecture Diagram](#architecture-diagram)
3. [Core Components](#core-components)
4. [Data Flow](#data-flow)
5. [Feed System](#feed-system)
6. [Trending & Discovery](#trending--discovery)
7. [Semantic Search](#semantic-search)
8. [Real-time Subscriptions](#real-time-subscriptions)
9. [Offline-First Strategy](#offline-first-strategy)
10. [Performance & Scaling](#performance--scaling)

---

## Overview

Safarnak implements a **hybrid social feed system** combining:
- **Real-time streaming** via GraphQL subscriptions (WebSocket)
- **Cursor-based pagination** for infinite scroll
- **KV-backed trending** for discovery
- **Vectorize semantic search** for intelligent content discovery
- **Offline-first** with local SQLite cache and mutation queues

### Key Features
- ✅ Real-time feed updates without full refetch
- ✅ Semantic search across all content types
- ✅ Trending topics with decay and rollup
- ✅ Follow graph with feed filtering
- ✅ Offline mutations with automatic sync
- ✅ Dual-write cache (Apollo + Drizzle)

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           CLIENT (React Native)                          │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  ┌─────────────┐    ┌──────────────┐    ┌─────────────┐                │
│  │   Home      │    │   Explore    │    │   Profile   │                │
│  │   Feed      │    │   Search     │    │   Settings  │                │
│  └──────┬──────┘    └──────┬───────┘    └──────┬──────┘                │
│         │                   │                    │                       │
│         └───────────────────┴────────────────────┘                       │
│                             │                                            │
│                    ┌────────▼────────┐                                   │
│                    │  Apollo Client  │                                   │
│                    │  + Auth Link    │                                   │
│                    └────────┬────────┘                                   │
│                             │                                            │
│         ┌───────────────────┼───────────────────┐                       │
│         │                   │                   │                       │
│    ┌────▼─────┐      ┌──────▼──────┐    ┌──────▼──────┐               │
│    │  Cache   │      │  WebSocket  │    │   Offline   │               │
│    │ Storage  │      │Subscriptions│    │   Queue     │               │
│    └────┬─────┘      └──────┬──────┘    └──────┬──────┘               │
│         │                   │                   │                       │
│    ┌────▼─────────────┐     │                   │                       │
│    │ DrizzleCache     │     │                   │                       │
│    │ Storage          │     │                   │                       │
│    │ (Auto-sync)      │     │                   │                       │
│    └────┬─────────────┘     │                   │                       │
│         │                   │                   │                       │
│    ┌────▼─────────────┐     │                   │                       │
│    │ Expo SQLite      │     │                   │                       │
│    │ (safarnak.db)    │     │                   │                       │
│    └──────────────────┘     │                   │                       │
│                             │                   │                       │
└─────────────────────────────┼───────────────────┼───────────────────────┘
                              │                   │
                              │ HTTPS/WSS         │
                              │                   │
┌─────────────────────────────┼───────────────────┼───────────────────────┐
│                      CLOUDFLARE WORKERS                                  │
├─────────────────────────────┼───────────────────┼───────────────────────┤
│                             │                   │                       │
│                    ┌────────▼────────┐          │                       │
│                    │  GraphQL Yoga   │          │                       │
│                    │   + Auth        │          │                       │
│                    └────────┬────────┘          │                       │
│                             │                   │                       │
│         ┌───────────────────┼───────────────────┼───────────┐          │
│         │                   │                   │           │          │
│    ┌────▼─────┐      ┌──────▼──────┐    ┌──────▼──────┐   │          │
│    │ Queries  │      │ Mutations   │    │Subscriptions│   │          │
│    └────┬─────┘      └──────┬──────┘    └──────┬──────┘   │          │
│         │                   │                   │           │          │
│         │                   │                   │           │          │
│    ┌────▼──────────────┐    │              ┌────▼──────┐   │          │
│    │ getFeed           │    │              │newMessages│   │          │
│    │ searchSemantic    │    │              │feedNewEvts│   │          │
│    │ getTrending       │    │              └────┬──────┘   │          │
│    │ getFollowers      │    │                   │           │          │
│    └───────────────────┘    │                   │           │          │
│                             │                   │           │          │
│                        ┌────▼───────────────────▼───────┐   │          │
│                        │  createPost                    │   │          │
│                        │  createTrip                    │   │          │
│                        │  followUser                    │   │          │
│                        │  createReaction                │   │          │
│                        └────┬───────────────────────────┘   │          │
│                             │                               │          │
│         ┌───────────────────┼───────────────────────────────┼──────┐  │
│         │                   │                               │      │  │
│    ┌────▼─────┐      ┌──────▼──────┐    ┌─────────────┐   │      │  │
│    │    D1    │      │     KV      │    │  VECTORIZE  │   │      │  │
│    │ (SQLite) │      │  (Trending) │    │  (Search)   │   │      │  │
│    └──────────┘      └──────┬──────┘    └──────┬──────┘   │      │  │
│                             │                   │           │      │  │
│                        ┌────▼───────────────────▼───────┐   │      │  │
│                        │  Trending Utilities            │   │      │  │
│                        │  - incrementTrendingEntity     │   │      │  │
│                        │  - incrementTrendingTopic      │   │      │  │
│                        │  - readTopList                 │   │      │  │
│                        └────────────────────────────────┘   │      │  │
│                                                             │      │  │
│    ┌────────────────┐      ┌──────────────┐      ┌────────▼──┐   │  │
│    │ Durable Object │      │    Queue     │      │    AI     │   │  │
│    │SubscriptionPool│      │ EMBED_QUEUE  │      │  (bge-m3) │   │  │
│    └────────────────┘      └──────┬───────┘      └───────────┘   │  │
│                                   │                               │  │
│    ┌────────────────┐             │                               │  │
│    │ Durable Object │             │                               │  │
│    │ TrendingRollup │             │                               │  │
│    │ (Decay/Trim)   │             │                               │  │
│    └────────────────┘             │                               │  │
│                                   │                               │  │
│                              ┌────▼────────┐                      │  │
│                              │Queue Consumer                      │  │
│                              │- Generate    │                      │  │
│                              │  embeddings  │                      │  │
│                              │- Upsert to   │                      │  │
│                              │  Vectorize   │                      │  │
│                              └──────────────┘                      │  │
│                                                                    │  │
│    ┌────────────────┐                                             │  │
│    │  Cron Trigger  │                                             │  │
│    │  (*/10 * * * *)│─────────────────────────────────────────────┘  │
│    │  Compact KV    │                                                │
│    └────────────────┘                                                │
│                                                                       │
└───────────────────────────────────────────────────────────────────────┘
```

---

## Core Components

### 1. Client Layer (React Native + Expo)

#### Apollo Client Setup
```typescript
// api/client.ts
const client = new ApolloClient({
  link: ApolloLink.from([
    authLink,           // Add Bearer token
    errorLink,          // Handle errors
    splitLink,          // HTTP vs WebSocket
  ]),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          getFeed: relayStylePagination(), // Cursor-based
        },
      },
    },
  }),
  persistCache: {
    storage: new DrizzleCacheStorage(), // Auto-sync to SQLite
  },
});
```

#### DrizzleCacheStorage (Automatic Sync)
```typescript
// api/cache-storage.ts
class DrizzleCacheStorage implements PersistentStorage<string> {
  async setItem(key: string, value: string): Promise<void> {
    const db = await getLocalDB();
    
    // 1. Store raw cache entry
    await db.insert(apollo_cache_entries)
      .values({ key, value })
      .onConflictDoUpdate({ target: [apollo_cache_entries.key], set: { value } });
    
    // 2. Parse and extract entities
    const parsed = JSON.parse(value);
    const { entityType, entityId } = extractFromCacheKey(key);
    
    // 3. Sync to structured tables (cachedPosts, cachedTrips, etc.)
    if (entityType === 'Post') {
      await db.insert(cachedPosts)
        .values({ ...parsed, syncedAt: Date.now() })
        .onConflictDoUpdate({ target: [cachedPosts.id], set: parsed });
    }
    // ... similar for Trip, Tour, Place, User
  }
}
```

**Key Feature**: Every Apollo cache write automatically syncs to Drizzle tables. No manual sync needed!

### 2. Worker Layer (Cloudflare Workers)

#### GraphQL Yoga Server
```typescript
// worker/index.ts
const yoga = createYoga({
  schema: makeExecutableSchema({ typeDefs, resolvers }),
  context: async ({ request, env }) => {
    // Extract userId from Bearer token (KV lookup)
    const token = request.headers.get('authorization')?.substring(7);
    const tokenData = await env.KV.get(`token:${token}`);
    const userId = tokenData ? JSON.parse(tokenData).userId : undefined;
    
    return { env, userId, request };
  },
});
```

#### Resolvers Structure
```
worker/
├── queries/
│   ├── getFeed.ts           # Cursor-based feed with filters
│   ├── searchSemantic.ts    # Vectorize KNN search
│   ├── getTrending.ts       # KV top lists
│   ├── getFollowers.ts      # Follow graph
│   └── isFollowing.ts       # Follow status
├── mutations/
│   ├── createPost.ts        # Create + increment trending
│   ├── createTrip.ts        # Create + enqueue embedding
│   ├── followUser.ts        # Follow edge insert
│   ├── createReaction.ts    # Like/emoji reactions
│   └── updateFeedPreferences.ts
└── subscriptions/
    ├── newMessages.ts       # Chat subscriptions
    └── feedNewEvents.ts     # Real-time feed updates
```

---

## Data Flow

### 1. Creating a Post (Write Path)

```
User creates post
       │
       ▼
┌──────────────────┐
│ createPost       │
│ mutation         │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ 1. Insert to D1  │
│    posts table   │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ 2. Insert to D1  │
│  feedEvents table│
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ 3. Increment KV  │
│  trending:       │
│  - Entity (POST) │
│  - Topics (#tags)│
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ 4. Enqueue       │
│  EMBED_QUEUE     │
│  (async)         │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ 5. Publish to    │
│  Subscription    │
│  Pool (DO)       │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ 6. Return Post   │
│  to client       │
└──────────────────┘
```

**Code Example:**
```typescript
// worker/mutations/createPost.ts
export const createPost = async (_, { content, visibility }, context) => {
  const db = getServerDB(context.env.DB);
  const userId = context.userId;
  if (!userId) throw new Error('Not authenticated');
  
  // 1. Insert post
  const postId = createId();
  await db.insert(posts).values({
    id: postId,
    userId,
    content,
    visibility: visibility || 'PUBLIC',
    createdAt: new Date().toISOString(),
  });
  
  // 2. Create feed event
  await db.insert(feedEvents).values({
    id: createId(),
    entityType: 'POST',
    entityId: postId,
    verb: 'CREATED',
    actorId: userId,
    visibility: visibility || 'PUBLIC',
    createdAt: new Date().toISOString(),
  });
  
  // 3. Increment trending (KV)
  await incrementTrendingEntity(context.env, 'POST');
  
  // Extract hashtags and increment topics
  const hashtags = content.match(/#\w+/g) || [];
  for (const tag of hashtags) {
    await incrementTrendingTopic(context.env, tag.substring(1));
  }
  
  // 4. Enqueue embedding job (async)
  await enqueueEmbeddingJob(context.env, {
    entityType: 'POST',
    entityId: postId,
    text: content,
  });
  
  // 5. Publish to subscribers (handled by subscription resolver)
  
  return { id: postId, userId, content, visibility, createdAt: new Date().toISOString() };
};
```

### 2. Reading the Feed (Read Path)

```
User opens Home
       │
       ▼
┌──────────────────┐
│ getFeed query    │
│ (first: 20)      │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ 1. Apply filters │
│  - entityTypes   │
│  - followingOnly │
│  - timeWindow    │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ 2. Query D1      │
│  feedEvents      │
│  (cursor-based)  │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ 3. Enrich nodes  │
│  - Fetch entity  │
│  - Fetch actor   │
│  - Add metadata  │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ 4. Return        │
│  FeedConnection  │
│  (edges+pageInfo)│
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ 5. Client caches │
│  via Apollo      │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ 6. Auto-sync to  │
│  Drizzle SQLite  │
│  (DrizzleCache)  │
└──────────────────┘
```

**Code Example:**
```typescript
// worker/queries/getFeed.ts
export const getFeed = async (_, { first = 20, after, filter }, context) => {
  const db = getServerDB(context.env.DB);
  const userId = context.userId;
  
  // Parse cursor
  const { createdAt: cursorTime, id: cursorId } = parseCursor(after);
  
  // Build query with filters
  let query = db.select().from(feedEvents)
    .where(
      and(
        eq(feedEvents.visibility, 'PUBLIC'),
        filter?.entityTypes ? inArray(feedEvents.entityType, filter.entityTypes) : undefined,
        filter?.createdAtAfter ? gte(feedEvents.createdAt, filter.createdAtAfter) : undefined,
        cursorTime ? lt(feedEvents.createdAt, cursorTime) : undefined,
      )
    )
    .orderBy(desc(feedEvents.createdAt))
    .limit(first + 1);
  
  // If followingOnly, join with followEdges
  if (filter?.followingOnly && userId) {
    query = query.innerJoin(followEdges, eq(feedEvents.actorId, followEdges.followeeId))
      .where(eq(followEdges.followerId, userId));
  }
  
  const rows = await query.all();
  const hasNextPage = rows.length > first;
  const edges = rows.slice(0, first);
  
  // Enrich each edge with entity and actor
  const enriched = await Promise.all(edges.map(async (row) => {
    const entity = await fetchEntity(db, row.entityType, row.entityId);
    const actor = await db.select().from(users).where(eq(users.id, row.actorId)).get();
    
    return {
      cursor: toCursor(row.createdAt, row.id),
      node: {
        id: row.id,
        entityType: row.entityType,
        entityId: row.entityId,
        verb: row.verb,
        actor,
        entity,
        createdAt: row.createdAt,
      },
    };
  }));
  
  return {
    edges: enriched,
    pageInfo: {
      endCursor: enriched.length ? enriched[enriched.length - 1].cursor : null,
      hasNextPage,
    },
  };
};
```

### 3. Real-time Updates (Subscription Path)

```
New post created
       │
       ▼
┌──────────────────┐
│ Subscription     │
│ resolver fires   │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Publish to       │
│ SubscriptionPool │
│ (Durable Object) │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ DO broadcasts    │
│ to all active    │
│ WebSocket conns  │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Client receives  │
│ feedNewEvents    │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Queue event      │
│ (up to 50)       │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Show "N new"     │
│ banner           │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ User taps banner │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Prepend 3 items  │
│ to feed list     │
│ (no refetch)     │
└──────────────────┘
```

**Client Code:**
```typescript
// app/(app)/(feed)/index.tsx
useFeedNewEventsSubscription({
  variables: { filter: { entityTypes: ['POST'] } },
  onData: ({ data }) => {
    const incoming = data?.data?.feedNewEvents || [];
    setQueuedEvents((prev) => {
      const existingIds = new Set(items.map(p => p.id));
      const add = incoming.filter(ev => !existingIds.has(ev.entityId));
      const merged = [...prev, ...add];
      setNewItemsCount(Math.min(9, merged.length));
      return merged.slice(-50); // Keep last 50
    });
  },
});

const handleShowNew = () => {
  setQueuedEvents((prev) => {
    const take = prev.slice(0, 3);
    const rest = prev.slice(3);
    const mapped = take.map(enrichEventToItem);
    setItems((cur) => [...mapped, ...cur]); // Prepend
    setNewItemsCount(Math.min(9, rest.length));
    return rest;
  });
};
```

---

## Feed System

### Feed Event Schema

```sql
CREATE TABLE feed_events (
  id TEXT PRIMARY KEY,
  entity_type TEXT NOT NULL,     -- POST, TRIP, TOUR, PLACE, LOCATION
  entity_id TEXT NOT NULL,
  verb TEXT NOT NULL,             -- CREATED, UPDATED, SHARED
  actor_id TEXT NOT NULL,         -- User who performed action
  visibility TEXT NOT NULL,       -- PUBLIC, FRIENDS, PRIVATE
  topics TEXT,                    -- JSON array of hashtags/topics
  created_at TEXT NOT NULL
);

CREATE INDEX idx_feed_events_created ON feed_events(created_at DESC);
CREATE INDEX idx_feed_events_actor ON feed_events(actor_id);
CREATE INDEX idx_feed_events_entity ON feed_events(entity_type, entity_id);
```

### Feed Filtering

**FeedFilter Input:**
```graphql
input FeedFilter {
  entityTypes: [EntityType!]      # Filter by POST, TRIP, etc.
  followingOnly: Boolean          # Only from followed users
  circleOnly: Boolean             # Only from close friends
  topics: [String!]               # Filter by hashtags
  mutedUserIds: [ID!]             # Exclude these users
  createdAtAfter: String          # Time window start
  createdAtBefore: String         # Time window end
}
```

**Server-side Application:**
```typescript
// Build WHERE clause dynamically
const conditions = [
  eq(feedEvents.visibility, 'PUBLIC'),
];

if (filter?.entityTypes?.length) {
  conditions.push(inArray(feedEvents.entityType, filter.entityTypes));
}

if (filter?.followingOnly && userId) {
  // Join with followEdges
  query = query.innerJoin(followEdges, 
    and(
      eq(feedEvents.actorId, followEdges.followeeId),
      eq(followEdges.followerId, userId)
    )
  );
}

if (filter?.mutedUserIds?.length) {
  conditions.push(notInArray(feedEvents.actorId, filter.mutedUserIds));
}

if (filter?.createdAtAfter) {
  conditions.push(gte(feedEvents.createdAt, filter.createdAtAfter));
}
```

### Cursor-based Pagination

**Why Cursors?**
- Stable pagination (no missed/duplicate items)
- Efficient for large datasets
- Works with real-time updates

**Cursor Format:**
```typescript
function toCursor(createdAt: string, id: string): string {
  return btoa(`${createdAt}|${id}`);
}

function parseCursor(cursor?: string): { createdAt?: string; id?: string } {
  if (!cursor) return {};
  const [createdAt, id] = atob(cursor).split('|');
  return { createdAt, id };
}
```

**Pagination Query:**
```typescript
const { createdAt, id } = parseCursor(after);

const rows = await db.select().from(feedEvents)
  .where(
    and(
      // ... other filters
      createdAt ? lt(feedEvents.createdAt, createdAt) : undefined,
      createdAt && id ? or(
        lt(feedEvents.createdAt, createdAt),
        and(eq(feedEvents.createdAt, createdAt), lt(feedEvents.id, id))
      ) : undefined,
    )
  )
  .orderBy(desc(feedEvents.createdAt), desc(feedEvents.id))
  .limit(first + 1);

const hasNextPage = rows.length > first;
const edges = rows.slice(0, first);
```

---

## Trending & Discovery

### KV-backed Trending System

**Data Structure:**
```typescript
// KV Key: top:entity:H1
// KV Key: top:topic:D1
{
  window: 'H1',
  items: [
    { key: 'POST', label: 'POST', score: 42, updatedAt: 1699900000000 },
    { key: 'travel', label: '#travel', score: 28, updatedAt: 1699900000000 },
    // ... up to 100 items
  ]
}
```

**Increment on Write:**
```typescript
// worker/utilities/trending.ts
export async function incrementTrendingEntity(env: Env, entityType: string) {
  const windows: TimeWindow[] = ['M5', 'H1', 'D1'];
  
  for (const window of windows) {
    const key = `top:entity:${window}`;
    const current = await env.KV.get(key, 'json') as TrendingList | null;
    const items = current?.items || [];
    
    // Find or create item
    const idx = items.findIndex(i => i.key === entityType);
    if (idx >= 0) {
      items[idx].score += 1;
      items[idx].updatedAt = Date.now();
    } else {
      items.push({ key: entityType, label: entityType, score: 1, updatedAt: Date.now() });
    }
    
    // Sort and trim to top 100
    items.sort((a, b) => b.score - a.score);
    const trimmed = items.slice(0, 100);
    
    await env.KV.put(key, JSON.stringify({ window, items: trimmed }));
  }
}
```

**Read Top Lists:**
```typescript
// worker/queries/getTrending.ts
export const getTrending = async (_, { type, window, limit }, context) => {
  if (type === 'TOPIC') {
    const key = `top:topic:${window}`;
    const data = await context.env.KV.get(key, 'json') as TrendingList | null;
    const items = (data?.items || [])
      .slice(0, limit)
      .map(i => ({ key: i.key, label: `#${i.label}`, score: i.score, delta: null }));
    return { window, items };
  }
  
  // Similar for ENTITY, PLACE, USER
};
```

### Trending Rollup (Durable Object)

**Purpose:** Decay scores over time and trim lists to keep them fresh.

**Trigger:** Cron every 10 minutes (`*/10 * * * *`)

**Algorithm:**
```typescript
// worker/durable/TrendingRollup.ts
export class TrendingRollup {
  async compact() {
    const windows = ['M5', 'H1', 'D1'];
    const kinds = ['entity', 'topic'];
    const now = Date.now();
    
    const halfLives = {
      M5: 2 * 60 * 1000,      // 2 minutes
      H1: 15 * 60 * 1000,     // 15 minutes
      D1: 3 * 60 * 60 * 1000, // 3 hours
    };
    
    for (const window of windows) {
      for (const kind of kinds) {
        const key = `top:${kind}:${window}`;
        const data = await this.env.KV.get(key, 'json');
        if (!data?.items) continue;
        
        // Apply exponential decay
        const decayed = data.items.map(item => {
          const age = now - item.updatedAt;
          const decay = Math.pow(0.5, age / halfLives[window]);
          return { ...item, score: item.score * decay, updatedAt: now };
        });
        
        // Sort and trim
        decayed.sort((a, b) => b.score - a.score);
        const trimmed = decayed.slice(0, 100);
        
        await this.env.KV.put(key, JSON.stringify({ window, items: trimmed }));
      }
    }
  }
}
```

**Scheduled Handler:**
```typescript
// worker/index.ts
export default {
  async scheduled(event: ScheduledEvent, env: Env) {
    const id = env.TRENDING_ROLLUP.idFromName('global');
    const stub = env.TRENDING_ROLLUP.get(id);
    await stub.fetch('https://rollup/compact', { method: 'POST' });
  },
};
```

---

## Semantic Search

### Vectorize Integration

**Architecture:**
1. **Embedding Generation**: Workers AI (`@cf/baai/bge-m3`, 1024 dims)
2. **Async Queue**: `EMBED_QUEUE` for background processing
3. **Vector Storage**: Cloudflare Vectorize (cosine similarity)
4. **Search**: KNN query with metadata filters

### Embedding Pipeline

```
Post/Trip created
       │
       ▼
┌──────────────────┐
│ Enqueue job      │
│ EMBED_QUEUE      │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Queue consumer   │
│ (batch: 32)      │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Generate         │
│ embedding        │
│ (Workers AI)     │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Upsert to        │
│ Vectorize        │
│ (with metadata)  │
└──────────────────┘
```

**Enqueue Job:**
```typescript
// worker/utilities/embeddings.ts
export async function enqueueEmbeddingJob(env: Env, job: EmbedJob) {
  await env.EMBED_QUEUE.send({
    id: `${job.entityType}:${job.entityId}`,
    entityType: job.entityType,
    entityId: job.entityId,
    text: job.text,
    lang: job.lang || 'auto',
    model: '@cf/baai/bge-m3',
  });
}
```

**Queue Consumer:**
```typescript
// worker/index.ts
export default {
  async queue(batch: MessageBatch, env: Env) {
    for (const msg of batch.messages) {
      const { entityType, entityId, text, model } = msg.body;
      
      // Generate embedding
      const res = await env.AI.run(model, { text });
      const embedding = res?.data?.[0]?.embedding || [];
      
      if (embedding.length === 0) {
        msg.ack();
        continue;
      }
      
      // Upsert to Vectorize
      await env.VECTORIZE.upsert([{
        id: `${entityType}:${entityId}`,
        values: embedding,
        metadata: { entityType, entityId },
      }]);
      
      msg.ack();
    }
  },
};
```

**Semantic Search Query:**
```typescript
// worker/queries/searchSemantic.ts
export const searchSemantic = async (_, { query, entityTypes, first }, context) => {
  const db = getServerDB(context.env.DB);
  
  // Generate query embedding
  const res = await context.env.AI.run('@cf/baai/bge-m3', { text: query });
  const vector = res?.data?.[0]?.embedding || [];
  
  // KNN search
  const results = await context.env.VECTORIZE.query({
    vector,
    topK: Math.min(first, 50),
    filter: entityTypes?.length ? { entityType: entityTypes } : undefined,
  });
  
  // Enrich with full entities
  const edges = await Promise.all(
    results.matches.map(async (hit) => {
      const { entityType, entityId } = hit.metadata;
      const entity = await fetchEntity(db, entityType, entityId);
      const actor = entity.userId ? await fetchUser(db, entity.userId) : null;
      
      return {
        cursor: toCursor(entity.createdAt, entity.id),
        node: {
          id: `sem-${entityType}-${entityId}`,
          entityType,
          entityId,
          verb: 'CREATED',
          actor,
          entity,
          createdAt: entity.createdAt,
        },
      };
    })
  );
  
  return { edges, pageInfo: { endCursor: null, hasNextPage: false } };
};
```

### Client Integration

```typescript
// app/(app)/(explore)/index.tsx
const { data: searchData } = useSearchSemanticQuery({
  variables: { query: debouncedSearch, first: 30 },
  skip: !debouncedSearch || debouncedSearch.length < 2,
  fetchPolicy: 'cache-and-network',
});

const results = searchData?.searchSemantic?.edges || [];
```

---

## Real-time Subscriptions

### Subscription Pool (Durable Object)

**Purpose:** Manage WebSocket connections and broadcast events.

**Architecture:**
```typescript
// From graphql-workers-subscriptions
export const SubscriptionPool = createWsConnectionPoolClass({
  schema,
  wsConnectionPool: (env) => env.SUBSCRIPTION_POOL,
  subscriptionsDb: (env) => env.DB,
});
```

**Subscription Table:**
```sql
CREATE TABLE subscriptions (
  id TEXT PRIMARY KEY,
  operation TEXT NOT NULL,      -- GraphQL operation
  variables TEXT,                -- JSON variables
  connection_id TEXT NOT NULL,  -- WebSocket connection
  is_active INTEGER DEFAULT 1,
  created_at TEXT NOT NULL,
  expires_at TEXT
);
```

### Feed Subscription Resolver

```typescript
// worker/subscriptions/feedNewEvents.ts
export const feedNewEvents = {
  subscribe: async (_, { filter }, context) => {
    // Return async iterator
    return context.pubsub.asyncIterator(['FEED_NEW_EVENT']);
  },
  resolve: (payload, { filter }) => {
    // Server-side filtering
    const events = Array.isArray(payload) ? payload : [payload];
    
    return events.filter(event => {
      if (filter?.entityTypes?.length && !filter.entityTypes.includes(event.entityType)) {
        return false;
      }
      if (filter?.followingOnly && !isFollowing(event.actorId)) {
        return false;
      }
      return true;
    });
  },
};
```

**Publishing Events:**
```typescript
// In createPost mutation
await context.pubsub.publish('FEED_NEW_EVENT', {
  id: feedEventId,
  entityType: 'POST',
  entityId: postId,
  verb: 'CREATED',
  actor: { id: userId, username, name, avatar },
  entity: post,
  createdAt: new Date().toISOString(),
});
```

### Client Subscription

```typescript
// app/(app)/(feed)/index.tsx
useFeedNewEventsSubscription({
  variables: { filter: { entityTypes: ['POST'] } },
  onData: ({ data }) => {
    const events = data?.data?.feedNewEvents || [];
    // Queue events for "Show N new" banner
    setQueuedEvents(prev => [...prev, ...events].slice(-50));
    setNewItemsCount(events.length);
  },
});
```

---

## Offline-First Strategy

### Three-Layer Cache

1. **Apollo InMemoryCache** - Normalized GraphQL cache
2. **DrizzleCacheStorage** - Persistent SQLite cache (auto-sync)
3. **Offline Queue** - Pending mutations (AsyncStorage)

### Automatic Cache Sync

```typescript
// api/cache-storage.ts
class DrizzleCacheStorage implements PersistentStorage<string> {
  async setItem(key: string, value: string): Promise<void> {
    const db = await getLocalDB();
    
    // Dual-write in single transaction
    await db.transaction(async (tx) => {
      // 1. Raw cache entry
      await tx.insert(apollo_cache_entries)
        .values({ key, value })
        .onConflictDoUpdate({ target: [apollo_cache_entries.key], set: { value } });
      
      // 2. Structured entity sync
      const { entityType, entityId, data } = parseApolloKey(key, value);
      
      if (entityType === 'Post') {
        await tx.insert(cachedPosts)
          .values({ ...data, syncedAt: Date.now(), pending: false })
          .onConflictDoUpdate({ target: [cachedPosts.id], set: data });
      }
      // ... similar for other entity types
    });
  }
}
```

**Benefits:**
- Every Apollo cache write → automatic Drizzle sync
- No manual `syncToLocal()` calls needed
- Works with all generated hooks automatically
- Single transaction ensures consistency

### Offline Mutations

```typescript
// store/middleware/offlineMiddleware.ts
const offlineMiddleware: Middleware = (store) => (next) => async (action) => {
  if (action.type.endsWith('/pending')) {
    const { isOnline } = store.getState().network;
    
    if (!isOnline) {
      // Queue mutation
      const queue = await AsyncStorage.getItem('mutation_queue');
      const mutations = queue ? JSON.parse(queue) : [];
      mutations.push({ action, timestamp: Date.now() });
      await AsyncStorage.setItem('mutation_queue', JSON.stringify(mutations));
      
      // Mark as pending in local DB
      await markAsPending(action.payload);
      
      return; // Don't execute now
    }
  }
  
  return next(action);
};
```

**Sync on Reconnect:**
```typescript
// hooks/useNetworkSync.ts
useEffect(() => {
  if (isOnline && wasOffline) {
    // Process queue
    const queue = await AsyncStorage.getItem('mutation_queue');
    const mutations = queue ? JSON.parse(queue) : [];
    
    for (const { action } of mutations) {
      await dispatch(action); // Retry
    }
    
    // Clear queue
    await AsyncStorage.removeItem('mutation_queue');
  }
}, [isOnline]);
```

---

## Performance & Scaling

### Database Indexes

```sql
-- Feed queries (most critical)
CREATE INDEX idx_feed_events_created ON feed_events(created_at DESC);
CREATE INDEX idx_feed_events_actor ON feed_events(actor_id);
CREATE INDEX idx_feed_events_visibility ON feed_events(visibility);

-- Follow graph
CREATE INDEX idx_follow_edges_follower ON follow_edges(follower_id);
CREATE INDEX idx_follow_edges_followee ON follow_edges(followee_id);

-- Reactions
CREATE INDEX idx_reactions_post ON reactions(post_id);
CREATE INDEX idx_reactions_user ON reactions(user_id);

-- Comments
CREATE INDEX idx_comments_post ON comments(post_id);
```

### Query Optimization

**1. Limit Joins:**
```typescript
// Bad: N+1 queries
for (const event of events) {
  const user = await db.select().from(users).where(eq(users.id, event.actorId));
}

// Good: Single query with IN
const actorIds = events.map(e => e.actorId);
const actors = await db.select().from(users).where(inArray(users.id, actorIds));
const actorMap = new Map(actors.map(a => [a.id, a]));
```

**2. Cursor Pagination:**
- More efficient than OFFSET (no table scan)
- Stable results (no duplicates/skips)
- Works with real-time updates

**3. KV for Hot Data:**
- Trending lists (read-heavy)
- Session tokens (fast lookup)
- Rate limiting counters

### Caching Strategy

**Client:**
- Apollo cache: 5 minutes default TTL
- Drizzle cache: Persistent, sync on write
- Offline queue: Unlimited retention

**Worker:**
- KV trending: No expiration (manual decay)
- D1 query results: No caching (always fresh)
- Vectorize: Automatic index updates

### Scaling Considerations

**Current Limits:**
- D1: 100k rows/day write, 5M rows/day read
- KV: 100k writes/day, unlimited reads
- Vectorize: 30M queries/month, 5M upserts/month
- Durable Objects: 1M requests/month

**Optimization Strategies:**
1. **Batch writes** to D1 (reduce write count)
2. **KV for trending** (offload D1 reads)
3. **Vectorize for search** (avoid full-text scan)
4. **DO for subscriptions** (efficient WebSocket pooling)

---

## Summary

### Key Innovations

1. **Hybrid Feed System**
   - Cursor-based pagination for stability
   - Real-time subscriptions for freshness
   - KV-backed trending for discovery

2. **Automatic Cache Sync**
   - DrizzleCacheStorage bridges Apollo ↔ SQLite
   - No manual sync calls needed
   - Works with all generated hooks

3. **Semantic Search**
   - Vectorize KNN for intelligent discovery
   - Async embedding generation via queue
   - Metadata filtering for entity types

4. **Offline-First**
   - Three-layer cache (Apollo + Drizzle + Queue)
   - Automatic sync on reconnect
   - Optimistic UI updates

5. **Trending System**
   - KV-backed top lists (entity + topic)
   - Durable Object rollup with decay
   - Cron-triggered compaction

### Data Flow Summary

```
Write Path:  User → Mutation → D1 + KV + Queue → Subscription → Client
Read Path:   User → Query → D1 → Enrich → Apollo → Drizzle → UI
Search Path: User → Query → AI → Vectorize → D1 → Apollo → UI
Trending:    Mutation → KV increment → Cron decay → Query → UI
Realtime:    Mutation → Publish → DO → WebSocket → Client → Queue → UI
```

### Tech Stack

- **Frontend**: React Native + Apollo Client + Drizzle ORM
- **Backend**: Cloudflare Workers + GraphQL Yoga
- **Database**: D1 (SQLite) + KV + Vectorize
- **Real-time**: Durable Objects + WebSocket
- **AI**: Workers AI (bge-m3 embeddings)
- **Queue**: Cloudflare Queues

---

## Next Steps

1. **Monitoring**: Add observability for feed performance
2. **Analytics**: Track trending accuracy and search relevance
3. **Optimization**: Batch D1 writes, cache hot queries
4. **Features**: User blocking, content moderation, feed algorithms
5. **Scale**: Migrate to Hyperdrive for D1 connection pooling

---

**Last Updated:** November 13, 2025  
**Version:** 1.13.0  
**Author:** Safarnak Team

