# Safarnak Database Architecture

This document describes all database patterns and storage systems used in the Safarnak travel app. Our architecture leverages the Cloudflare stack for a globally distributed, offline-first experience.

## Table of Contents
- [Overview](#overview)
- [D1 (Relational Database)](#d1-relational-database)
- [KV (Key-Value Store)](#kv-key-value-store)
- [Vectorize (Vector Database)](#vectorize-vector-database)
- [R2 (Object Storage)](#r2-object-storage)
- [Durable Objects (Real-Time State)](#durable-objects-real-time-state)
- [Integration Patterns](#integration-patterns)
- [Development Workflow](#development-workflow)

---

## Overview

Safarnak uses a multi-storage architecture optimized for different data types:

- **D1 (SQLite)**: Relational data via Drizzle ORM
- **KV**: Sessions, API caches
- **Vectorize**: AI embeddings for semantic search
- **R2**: Media files (avatars, images, documents)
- **Durable Objects**: Real-time subscriptions and WebSocket state

All systems integrate with Cloudflare Workers and are accessible via the GraphQL API.

---

## D1 (Relational Database)

### Purpose
Primary relational database for structured data. Uses SQLite via Cloudflare D1, managed through Drizzle ORM.

### Schema Location
- **File**: `database/schema.ts` (unified schema with UUIDs)
- **Migrations**: `migrations/` (server-only, located at project root)

### Tables

#### Core Tables
- **users**: User accounts, credentials, profiles
- **tours**: Travel packages and experiences
- **messages**: Real-time communication
- **subscriptions**: GraphQL subscription management

#### Travel & Planning
- **trips**: User travel plans
- **itineraries**: Day-by-day trip schedules
- **plans**: Trip maps and AI-generated plans
- **thoughts**: AI reasoning logs for trips

#### User Data
- **userPreferences**: Travel preferences, dietary restrictions (+ embedding ref)
- **userSubscriptions**: Membership tiers (free/member/pro)
- **devices**: User device tracking
- **notifications**: Push notifications and alerts

#### Social & Content
- **posts**: User-generated content (shared trips/tours/plans)
- **comments**: Post comments
- **reactions**: Emoji reactions on posts/comments

#### Locations & Places
- **locations**: Cities, countries, regions (+ embedding ref)
- **places**: Hotels, restaurants, attractions (+ embedding ref)

#### Financial
- **payments**: Payment records with currency (default: IRR/Toman)

### Key Features
- **UUID IDs**: All tables use UUID (text) IDs for consistency across server and client
- **TypeScript**: Full type safety via Drizzle schema
- **Relations**: Defined via `relations()` for type-safe joins
- **JSON Fields**: Complex data stored as JSON (coordinates, metadata, arrays)
- **Timestamps**: Auto-managed via `sql\`(CURRENT_TIMESTAMP)\``
- **Currency**: Default IRR (Iranian Rial/Toman)
- **Unified Schema**: Single source of truth with shared field definitions
- **Adapters**: Clean separation via `server.ts` (D1) and `client.ts` (SQLite)

### Access Pattern

**Server (Cloudflare Workers)**:
```typescript
import { getServerDB } from '@database/server';
import { users, trips } from '@database/server';
import { eq } from 'drizzle-orm';

// In worker resolver
const db = getServerDB(context.env.DB);
const user = await db.select().from(users).where(eq(users.id, userId)).get();
// userId is a UUID string - no conversions needed!
```

**Client (React Native Expo)**:
```typescript
import { getLocalDB, syncApolloToDrizzle } from '@database/client';
import { cachedTrips } from '@database/client';
import { eq } from 'drizzle-orm';

// Get local database
const db = await getLocalDB();
const trips = await db.select().from(cachedTrips).where(eq(cachedTrips.userId, userId)).all();

// Sync Apollo cache to Drizzle (automatic via enhanced hooks)
await syncApolloToDrizzle(apolloCache);
```

### UUID System

All tables use **UUID (text) IDs** for consistency:
- **Server**: UUIDs generated via `createId()` (uses `crypto.randomUUID()` in Workers)
- **Client**: Same UUID format - perfect sync compatibility
- **GraphQL**: UUIDs match `ID!` scalar type perfectly
- **No conversions**: IDs are strings everywhere - eliminates parseInt/toString bugs

### Commands
```bash
yarn db:generate    # Generate migration from schema changes
yarn db:migrate     # Apply migrations to local D1
yarn db:studio      # Open Drizzle Studio GUI
```

---

## KV (Key-Value Store)

### Purpose
Fast, edge-cached storage for sessions and external API caches. No schema enforcement; uses TypeScript interfaces for type safety.

### Key Patterns

#### Sessions
- **Pattern**: `session:{userId}:{deviceId}`
- **Example**: `session:123:abc-device-id`
- **Value Structure**:
```typescript
interface Session {
  userId: number;           // FK to D1 users.id
  token: string;            // JWT or auth token
  expiresAt: string;        // ISO timestamp
  ipAddress?: string;       // Optional, for security
  userAgent?: string;       // Optional
}
```

#### API Caches
- **Pattern**: `cache:{apiType}:{hash(query)}`
- **Example**: `cache:tripadvisor:sha256("Tehran hotels")`
- **Value Structure**:
```typescript
interface CacheEntry {
  data: any;                // JSON from external API
  fetchedAt: string;        // ISO timestamp
  expiresAt: string;        // TTL
  source: string;           // "tripadvisor" | "web-search" | etc.
}
```

### Technical Details
- **TTL**: Set via `expirationTtl` parameter (seconds)
- **Limits**: 1MB per value, global edge replication
- **Indexing**: Use prefixed keys for listing

### Access Pattern
```typescript
// Read
const session = await env.KV.get(`session:${userId}:${deviceId}`, { type: 'json' });

// Write with TTL (24 hours)
await env.KV.put(
  `session:${userId}:${deviceId}`,
  JSON.stringify(sessionData),
  { expirationTtl: 86400 }
);

// List by prefix
const sessions = await env.KV.list({ prefix: `session:${userId}:` });

// Delete
await env.KV.delete(`session:${userId}:${deviceId}`);
```

### Use Cases
- Auth sessions (quick lookup at edge)
- TripAdvisor API response caching
- Web search result caching
- Temporary data storage

---

## Vectorize (Vector Database)

### Purpose
Store AI embeddings for similarity-based semantic search. Enables intelligent recommendations matching user preferences to destinations, places, and activities.

### Index Setup
```typescript
// Create index (via Wrangler or dashboard)
// Dimension matches AI model (e.g., 768 for sentence-transformers)
await vectorize.createIndex({
  name: 'safarnak-embeddings',
  dimension: 768
});
```

### Vector Object Structure
```typescript
interface Embedding {
  id: string;               // Unique: "pref:123", "dest:456", "place:789"
  values: number[];         // Embedding vector (768 or 1536 dims)
  metadata?: {
    type: 'preference' | 'destination' | 'place' | 'activity';
    userId?: number;        // For user preferences
    locationId?: number;    // For places/destinations
    timestamp: string;      // ISO, for freshness
  };
}
```

### ID Patterns
- User preferences: `pref:{userId}`
- Destinations: `dest:{locationId}`
- Places: `place:{placeId}`
- Activities: `activity:{activityId}`

### Technical Details
- **Dimensions**: Must match AI model (768 for MiniLM, 1536 for OpenAI ada-002)
- **Limits**: 5M vectors per index, 1MB per vector
- **Filters**: Metadata-based queries
- **Integration**: Store embedding reference in D1 (e.g., `userPreferences.embedding`, `locations.embedding`)

### Access Pattern
```typescript
// Insert embeddings
await env.VECTORIZE.insert([
  {
    id: `pref:${userId}`,
    values: embeddingVector,
    metadata: { type: 'preference', userId, timestamp: new Date().toISOString() }
  }
]);

// Query for similar items
const results = await env.VECTORIZE.query(queryVector, {
  topK: 10,
  filter: { type: 'destination' },
  returnValues: true,
  returnMetadata: true
});

// Delete
await env.VECTORIZE.deleteByIds([`pref:${userId}`]);
```

### Use Cases
- Match user travel preferences to destinations
- Find similar places based on descriptions
- Recommend activities based on user interests
- Semantic search for trip planning

---

## R2 (Object Storage)

### Purpose
Blob storage for media files. No schema; uses path-based organization.

### Key Patterns

#### Avatars
- **Pattern**: `avatars/user-{userId}.{ext}`
- **Example**: `avatars/user-123.jpg`

#### Tour/Post Galleries
- **Pattern**: `media/{type}/{id}/{filename}`
- **Example**: `media/tour/456/gallery-1.png`

#### Maps & Documents
- **Pattern**: `maps/trip-{tripId}/plan-map.{ext}`
- **Example**: `maps/trip-789/plan-map.json`

#### Attachments
- **Pattern**: `attachments/{type}/{id}/{filename}`
- **Example**: `attachments/post/101/document.pdf`

### Object Metadata
```typescript
interface R2Metadata {
  contentType: string;      // "image/jpeg", "application/pdf"
  userId?: string;          // For access control
  uploadedAt: string;       // ISO timestamp
  size: number;             // Bytes
}
```

### Technical Details
- **Limits**: 5TB per object max, unlimited storage
- **Access Control**: Public bucket or signed URLs
- **CDN**: Automatic edge caching via Cloudflare
- **Integration**: Store URLs in D1 (e.g., `users.avatar`, `tours.imageUrl`, `posts.attachments`)

### Access Pattern
```typescript
// Upload
await env.R2.put(
  `avatars/user-${userId}.jpg`,
  imageBuffer,
  {
    httpMetadata: { contentType: 'image/jpeg' },
    customMetadata: { userId: userId.toString(), uploadedAt: new Date().toISOString() }
  }
);

// Download
const object = await env.R2.get(`avatars/user-${userId}.jpg`);
if (object) {
  const imageBuffer = await object.arrayBuffer();
  const metadata = object.customMetadata;
}

// List objects
const list = await env.R2.list({ prefix: 'media/tour/456/' });

// Delete
await env.R2.delete(`avatars/user-${userId}.jpg`);

// Generate presigned URL (for direct uploads)
const uploadUrl = await env.R2.createMultipartUpload(`uploads/${key}`);
```

### Use Cases
- User avatar uploads
- Tour gallery images
- AI-generated trip maps
- User-uploaded place photos
- Document attachments (PDFs, etc.)

---

## Durable Objects (Real-Time State)

### Purpose
Persistent, stateful objects for real-time features. Manages WebSocket connections for GraphQL subscriptions and live notifications.

### Class Structure
```typescript
export class SubscriptionPool extends DurableObject {
  state: DurableObjectState;
  connections: Map<string, WebSocket>;
  
  constructor(state: DurableObjectState, env: Env) {
    super(state, env);
    this.state = state;
    this.connections = new Map();
  }
  
  async fetch(request: Request) {
    // Handle WebSocket upgrades
    // Manage subscription lifecycle
  }
}
```

### State Fields
```typescript
interface DurableObjectState {
  connections: Map<string, WebSocket>;    // Client connections by ID
  topic: string;                          // "trip:123-updates", "tour:456-chat"
  subscribers: Set<number>;               // User IDs subscribed
  lastEvent?: any;                        // Cached last message/event
  metadata?: {
    filter?: string;
    createdAt: string;
  };
}
```

### Technical Details
- **ID Generation**: `env.SUBSCRIPTION_POOL.idFromName('topic-name')`
- **Limits**: 128MB RAM, 1GB storage per object
- **Storage**: `this.state.storage.put(key, value)` for persistence
- **Global Distribution**: Automatic routing to nearest instance
- **Integration**: Sync with D1 `subscriptions` table

### Access Pattern
```typescript
// Get Durable Object instance
const id = env.SUBSCRIPTION_POOL.idFromName(`trip:${tripId}`);
const stub = env.SUBSCRIPTION_POOL.get(id);

// Send message to all subscribers
await stub.fetch(new Request('http://internal/broadcast', {
  method: 'POST',
  body: JSON.stringify({ event: 'update', data: tripData })
}));

// Inside Durable Object
async webSocketMessage(ws: WebSocket, message: string) {
  const data = JSON.parse(message);
  // Broadcast to all connections
  this.connections.forEach(conn => {
    if (conn !== ws) conn.send(message);
  });
}
```

### Use Cases
- GraphQL subscription connections (`newMessages`, `tripUpdates`)
- Real-time tour group chat
- Live trip plan collaboration
- Push notification distribution
- WebSocket connection management

---

## Integration Patterns

### D1 + Vectorize
Store embedding reference in D1, query Vectorize for similarity:
```typescript
// Store reference in D1
await db.update(userPreferences)
  .set({ embedding: `pref:${userId}` })
  .where(eq(userPreferences.userId, userId));

// Query Vectorize using that reference
const similar = await env.VECTORIZE.query(userVector, {
  topK: 10,
  filter: { type: 'destination' }
});
```

### D1 + R2
Store R2 URLs in D1 for easy access:
```typescript
// Upload to R2
const key = `avatars/user-${userId}.jpg`;
await env.R2.put(key, imageBuffer);

// Store URL in D1
await db.update(users)
  .set({ avatar: `https://r2.safarnak.app/${key}` })
  .where(eq(users.id, userId));
```

### KV + D1
Cache frequently accessed D1 data in KV:
```typescript
// Try KV first
let tour = await env.KV.get(`tour:${tourId}`, { type: 'json' });

if (!tour) {
  // Fallback to D1
  tour = await db.select().from(tours).where(eq(tours.id, tourId)).get();
  
  // Cache for 1 hour
  await env.KV.put(`tour:${tourId}`, JSON.stringify(tour), { expirationTtl: 3600 });
}
```

### Durable Objects + D1
Sync subscription state between DO and D1:
```typescript
// Record subscription in D1
await db.insert(subscriptions).values({
  id: crypto.randomUUID(),
  userId,
  topic: `trip:${tripId}`,
  connectionId: durableObjectId
});

// Notify Durable Object
const stub = env.SUBSCRIPTION_POOL.get(id);
await stub.fetch(new Request('http://internal/subscribe', {
  method: 'POST',
  body: JSON.stringify({ userId, topic })
}));
```

---

## Development Workflow

### Initial Setup
```bash
# Install dependencies
yarn install

# Apply D1 migrations
yarn db:migrate

# Start local development
yarn dev
```

### Schema Changes (D1)
```bash
# 1. Edit database/schema.ts
# 2. Generate migration
yarn db:generate

# 3. Apply migration
yarn db:migrate

# 4. Verify in Drizzle Studio
yarn db:studio
```

### Testing Storage Systems

#### KV (Local)
```bash
# Uses Miniflare for local KV simulation
yarn worker:dev

# Test in GraphQL playground
# http://localhost:8787/graphql
```

#### R2 (Local)
```bash
# Configure local R2 bucket in wrangler.toml
[[r2_buckets]]
binding = "R2"
bucket_name = "safarnak-dev"

# Test uploads via Worker
```

#### Vectorize (Production Only)
```bash
# Create index in Cloudflare dashboard
# Test via deployed Worker
```

### Deployment
```bash
# Deploy Worker with all bindings
yarn worker:deploy

# Migrations run automatically via wrangler.toml
```

---

## Best Practices

### Performance
- **Cache D1 queries in KV** for hot paths
- **Use Vectorize filters** to reduce result set size
- **Serve R2 via CDN** with appropriate cache headers
- **Batch Durable Object operations** to reduce round trips

### Security
- **Validate all inputs** before storage operations
- **Use signed URLs** for sensitive R2 objects
- **Check user permissions** before KV/R2 access
- **Rate limit** Durable Object connections

### Cost Optimization
- **Set appropriate TTLs** on KV entries
- **Clean up expired sessions** regularly
- **Compress large R2 objects** before upload
- **Limit Vectorize index size** to essentials

### Monitoring
- **Track KV hit rates** to optimize caching
- **Monitor R2 bandwidth** and adjust CDN settings
- **Log Vectorize query performance**
- **Alert on Durable Object errors**

---

## Type Definitions

### Worker Environment
```typescript
interface Env {
  // D1 Database
  DB: D1Database;
  
  // KV Namespace
  KV: KVNamespace;
  
  // Vectorize Index
  VECTORIZE: VectorizeIndex;
  
  // R2 Bucket
  R2: R2Bucket;
  
  // Durable Object
  SUBSCRIPTION_POOL: DurableObjectNamespace;
}
```

### Common Types
```typescript
// For KV session storage
interface Session {
  userId: number;
  token: string;
  expiresAt: string;
  ipAddress?: string;
  userAgent?: string;
}

// For Vectorize embeddings
interface Embedding {
  id: string;
  values: number[];
  metadata?: {
    type: 'preference' | 'destination' | 'place' | 'activity';
    userId?: number;
    locationId?: number;
    timestamp: string;
  };
}

// For R2 metadata
interface MediaMetadata {
  contentType: string;
  userId?: string;
  uploadedAt: string;
  size: number;
}
```

---

## Resources

- [Drizzle ORM Docs](https://orm.drizzle.team/)
- [Cloudflare D1 Docs](https://developers.cloudflare.com/d1/)
- [Cloudflare KV Docs](https://developers.cloudflare.com/kv/)
- [Cloudflare Vectorize Docs](https://developers.cloudflare.com/vectorize/)
- [Cloudflare R2 Docs](https://developers.cloudflare.com/r2/)
- [Durable Objects Docs](https://developers.cloudflare.com/durable-objects/)

---

**Last Updated**: Based on schema v0.8.0 with full multi-storage architecture.

