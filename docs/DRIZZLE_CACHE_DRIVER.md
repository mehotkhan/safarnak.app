# Drizzle Apollo Cache Driver - Design Document

## Vision

Transform Drizzle ORM into the **single storage layer** for Apollo Client's cache, eliminating the need for a separate Apollo cache database and manual sync mechanisms.

## Current Architecture (Two-Tier)

```
Apollo Client → InMemoryCache → SQLiteStorage (apollo_cache.db)
                                    ↓
                              Manual Sync
                                    ↓
                            Drizzle ORM (safarnak_local.db)
```

**Problems:**
- Duplicate storage (Apollo cache + Drizzle cache)
- Manual sync overhead (after every query/mutation)
- Risk of data inconsistency
- Two separate databases to maintain

## Proposed Architecture (Unified)

```
Apollo Client → InMemoryCache → DrizzleCacheStorage (safarnak_local.db)
                                       ↓
                              [Structured Tables + Raw Cache]
```

**Benefits:**
- Single source of truth (Drizzle database)
- No sync needed (direct writes)
- Automatic structured + raw storage
- Better performance (no duplicate writes)

## Implementation Strategy

### 1. Apollo Cache Storage Interface

Apollo's `PersistentStorage<string>` interface requires:
- `getItem(key: string): Promise<string | null>` - Get cache entry
- `setItem(key: string, value: string): Promise<void>` - Store cache entry
- `removeItem(key: string): Promise<void>` - Delete cache entry
- `getAllKeys(): Promise<string[]>` - List all keys

Apollo stores the **entire normalized cache** as a single JSON string:
```json
{
  "User:123": { "__typename": "User", "id": "123", "name": "John", ... },
  "Trip:456": { "__typename": "Trip", "id": "456", "userId": "123", ... },
  "ROOT_QUERY": { "me": { "__ref": "User:123" }, ... }
}
```

### 2. Drizzle Schema Extension

Add a new table to store Apollo's raw normalized cache:

```typescript
// database/schema.ts
export const apolloCacheEntries = sqliteTable('apollo_cache_entries', {
  key: text('key').primaryKey(), // Apollo cache key (e.g., "User:123", "ROOT_QUERY")
  value: text('value').notNull(), // JSON string of normalized cache entry
  entityType: text('entity_type'), // Extracted __typename (null for ROOT_QUERY, etc.)
  entityId: text('entity_id'),    // Extracted ID (null for ROOT_QUERY, etc.)
  updatedAt: integer('updated_at').default(sql`(strftime('%s', 'now'))`),
});

// Index for fast entity lookups
CREATE INDEX idx_apollo_cache_entity ON apollo_cache_entries(entity_type, entity_id);
```

### 3. DrizzleCacheStorage Implementation

Create `database/drizzle-cache-storage.ts`:

```typescript
class DrizzleCacheStorage implements PersistentStorage<string> {
  private db: ReturnType<typeof drizzle> | null = null;
  
  // Initialize Drizzle connection
  async ensureInitialized() { ... }
  
  // Apollo storage interface
  async getItem(key: string): Promise<string | null> {
    // Query apollo_cache_entries table
  }
  
  async setItem(key: string, value: string): Promise<void> {
    // 1. Store raw cache entry in apollo_cache_entries
    // 2. Extract entity (if applicable) and upsert to structured table
    // 3. Update sync metadata
  }
  
  async removeItem(key: string): Promise<void> {
    // Delete from apollo_cache_entries
    // Optionally: Mark as deleted in structured table (soft delete)
  }
  
  async getAllKeys(): Promise<string[]> {
    // Query all keys from apollo_cache_entries
  }
}
```

### 4. Dual-Write Strategy

When Apollo writes via `setItem(key, value)`:

1. **Parse the cache entry** to extract entity type and ID
   - Key format: `"User:123"` → `{ entityType: "User", entityId: "123" }`
   - Value: Parse JSON to get `__typename`, fields, etc.

2. **Write to raw cache table** (for Apollo restoration)
   ```typescript
   await db.insert(apolloCacheEntries).values({
     key: "User:123",
     value: JSON.stringify({ __typename: "User", id: "123", ... }),
     entityType: "User",
     entityId: "123",
     updatedAt: now,
   }).onConflictDoUpdate({ ... });
   ```

3. **Transform and upsert to structured table** (for SQL queries)
   ```typescript
   if (entityType === "User") {
     const transformed = transformUserEntity(parsedValue);
     await db.insert(cachedUsers).values({
       ...transformed,
       cachedAt: now,
       lastSyncAt: now,
     }).onConflictDoUpdate({ ... });
   }
   ```

### 5. Cache Restoration

On app startup, Apollo calls `getAllKeys()` and `getItem()` for each key:

```typescript
// Apollo restore flow
const keys = await storage.getAllKeys();
const cache: NormalizedCacheObject = {};
for (const key of keys) {
  const value = await storage.getItem(key);
  if (value) {
    cache[key] = JSON.parse(value);
  }
}
cache.restore(cache); // Restore to InMemoryCache
```

Our Drizzle storage handles this automatically - no changes needed!

### 6. Querying Cached Data

**Option A: Via Apollo Cache** (normalized, references)
```typescript
const user = client.cache.readFragment({
  id: "User:123",
  fragment: gql`fragment UserFragment on User { id name }`
});
```

**Option B: Via Drizzle** (structured, SQL queries)
```typescript
const db = await getLocalDB();
const users = await db.select().from(cachedUsers)
  .where(eq(cachedUsers.id, "123"));
```

Both query the same underlying data source!

## Migration Path

### Phase 1: Add Drizzle Cache Storage (Parallel)
- Add `apolloCacheEntries` table to schema
- Implement `DrizzleCacheStorage` class
- Keep existing `SQLiteStorage` as fallback
- Test with new storage alongside existing

### Phase 2: Switch Primary Storage
- Update `api/client.ts` to use `DrizzleCacheStorage` instead of `SQLiteStorage`
- Remove `syncApolloToDrizzle()` calls (no longer needed)
- Update enhanced hooks to remove sync logic

### Phase 3: Cleanup
- Remove old `SQLiteStorage` class
- Remove `syncApolloToDrizzle()` function
- Remove `apollo_cache.db` database file
- Update documentation

## Benefits

1. **Single Source of Truth**: Drizzle is the only database
2. **No Sync Overhead**: Direct writes, no post-query sync needed
3. **Automatic Structure**: Entities automatically stored in structured tables
4. **Better Performance**: One write path instead of two
5. **Type Safety**: Drizzle provides type-safe queries
6. **Flexible Queries**: Can query via Apollo cache OR Drizzle SQL
7. **Cleaner Code**: Remove sync logic from enhanced hooks

## Edge Cases

### ROOT_QUERY and Other Special Keys
- Keys like `"ROOT_QUERY"`, `"ROOT_MUTATION"` don't map to entities
- Store in `apollo_cache_entries` with `entityType: null`, `entityId: null`
- Don't attempt structured table upsert

### References in Cache
- Apollo uses references like `{ "__ref": "User:123" }`
- Don't store references as entities
- Only store actual entity objects

### Cache Invalidation
- Apollo's `cache.evict()` calls `removeItem()`
- Mark as deleted in structured table (soft delete) or hard delete
- Update sync metadata accordingly

### Partial Updates
- Apollo may update single fields
- Read existing value, merge, write back
- Update structured table accordingly

## Performance Considerations

1. **Batch Writes**: Apollo may write many keys at once during restore
   - Consider batching Drizzle inserts
   - Use transactions for atomicity

2. **Indexes**: Ensure proper indexes on:
   - `apollo_cache_entries.key` (primary key, already indexed)
   - `apollo_cache_entries.entity_type, entity_id` (composite index)
   - `apollo_cache_entries.updated_at` (for cleanup)

3. **Cache Size Limits**: Apollo has `maxSize` option
   - Implement LRU eviction if needed
   - Clean up old entries based on `updated_at`

4. **Async Operations**: Storage operations are async
   - Use connection pooling if needed
   - Handle errors gracefully

## Testing Strategy

1. **Unit Tests**: Test `DrizzleCacheStorage` methods in isolation
2. **Integration Tests**: Test with real Apollo Client
3. **Migration Tests**: Test data migration from old storage
4. **Performance Tests**: Measure write/read performance
5. **Offline Tests**: Ensure cache works offline

## Next Steps

1. ✅ Design document (this file)
2. ⏳ Add `apolloCacheEntries` table to schema
3. ⏳ Implement `DrizzleCacheStorage` class
4. ⏳ Add migration logic (if needed)
5. ⏳ Update `api/client.ts` to use new storage
6. ⏳ Remove sync logic from enhanced hooks
7. ⏳ Test thoroughly
8. ⏳ Update documentation

