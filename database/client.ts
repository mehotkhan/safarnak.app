/**
 * Client Database Adapter
 * 
 * Expo SQLite adapter for client-side offline database.
 * Provides database instance, Apollo cache sync, and statistics.
 * 
 * Usage:
 *   import { getLocalDB, syncApolloToDrizzle } from '@database/client';
 *   const db = await getLocalDB();
 *   await syncApolloToDrizzle(apolloCache);
 */

import * as SQLite from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { Platform } from 'react-native';
import { NormalizedCacheObject } from '@apollo/client';
import { eq, sql, isNotNull, desc } from 'drizzle-orm';
import {
  clientSchema,
  cachedUsers,
  cachedTrips,
  cachedTours,
  cachedPlaces,
  cachedMessages,
  pendingMutations,
  syncMetadata,
  apolloCacheEntries,
} from './schema';

// ============================================================================
// DATABASE INSTANCE
// ============================================================================

let dbInstance: ReturnType<typeof drizzle> | null = null;
let initPromise: Promise<void> | null = null;

/**
 * Get or initialize the local database instance
 */
export async function getLocalDB(): Promise<ReturnType<typeof drizzle>> {
  if (dbInstance) return dbInstance;
  if (initPromise) {
    await initPromise;
    return dbInstance!;
  }
  initPromise = initializeDB();
  await initPromise;
  return dbInstance!;
}

async function initializeDB(): Promise<void> {
  if (Platform.OS === 'web') {
    throw new Error('Web platform not yet supported. Use Apollo cache persistence for web.');
  }

  try {
    const sqlite = await SQLite.openDatabaseAsync('safarnak_local.db');
    dbInstance = drizzle(sqlite, { schema: clientSchema });
    await runMigrations(sqlite);
    if (__DEV__) {
      console.log('✅ Local database initialized');
    }
  } catch (error) {
    console.error('❌ Failed to initialize local database:', error);
    throw error;
  }
}

async function runMigrations(sqlite: SQLite.SQLiteDatabase): Promise<void> {
  try {
    await sqlite.execAsync(`
      CREATE TABLE IF NOT EXISTS cached_users (
        id TEXT PRIMARY KEY NOT NULL,
        name TEXT NOT NULL,
        username TEXT NOT NULL,
        email TEXT,
        phone TEXT,
        avatar TEXT,
        is_active INTEGER DEFAULT 1,
        created_at TEXT DEFAULT (CURRENT_TIMESTAMP),
        updated_at TEXT DEFAULT (CURRENT_TIMESTAMP),
        cached_at INTEGER DEFAULT (strftime('%s', 'now')),
        last_sync_at INTEGER,
        pending INTEGER DEFAULT 0
      );

      CREATE TABLE IF NOT EXISTS cached_trips (
        id TEXT PRIMARY KEY NOT NULL,
        user_id TEXT NOT NULL,
        title TEXT,
        destination TEXT,
        start_date TEXT,
        end_date TEXT,
        budget REAL,
        travelers INTEGER NOT NULL DEFAULT 1,
        preferences TEXT,
        accommodation TEXT,
        status TEXT NOT NULL DEFAULT 'in_progress',
        ai_reasoning TEXT,
        itinerary TEXT,
        coordinates TEXT,
        created_at TEXT DEFAULT (CURRENT_TIMESTAMP),
        updated_at TEXT DEFAULT (CURRENT_TIMESTAMP),
        cached_at INTEGER DEFAULT (strftime('%s', 'now')),
        last_sync_at INTEGER,
        pending INTEGER DEFAULT 0,
        deleted_at INTEGER
      );

      CREATE TABLE IF NOT EXISTS cached_tours (
        id TEXT PRIMARY KEY NOT NULL,
        title TEXT NOT NULL,
        location TEXT NOT NULL,
        price REAL NOT NULL,
        rating REAL NOT NULL DEFAULT 0,
        reviews INTEGER NOT NULL DEFAULT 0,
        duration INTEGER NOT NULL,
        category TEXT NOT NULL,
        description TEXT,
        short_description TEXT,
        currency TEXT DEFAULT 'USD',
        duration_type TEXT DEFAULT 'days',
        coordinates TEXT,
        difficulty TEXT DEFAULT 'easy',
        highlights TEXT,
        inclusions TEXT,
        max_participants INTEGER,
        min_participants INTEGER DEFAULT 1,
        image_url TEXT,
        gallery TEXT,
        tags TEXT,
        is_active INTEGER DEFAULT 1,
        is_featured INTEGER DEFAULT 0,
        created_at TEXT DEFAULT (CURRENT_TIMESTAMP),
        updated_at TEXT DEFAULT (CURRENT_TIMESTAMP),
        cached_at INTEGER DEFAULT (strftime('%s', 'now')),
        last_sync_at INTEGER
      );

      CREATE TABLE IF NOT EXISTS cached_places (
        id TEXT PRIMARY KEY NOT NULL,
        name TEXT NOT NULL,
        location TEXT NOT NULL,
        distance REAL,
        rating REAL NOT NULL DEFAULT 0,
        reviews INTEGER NOT NULL DEFAULT 0,
        type TEXT NOT NULL,
        is_open INTEGER NOT NULL DEFAULT 1,
        description TEXT NOT NULL,
        tips TEXT,
        coordinates TEXT NOT NULL,
        phone TEXT,
        website TEXT,
        hours TEXT,
        created_at TEXT DEFAULT (CURRENT_TIMESTAMP),
        updated_at TEXT DEFAULT (CURRENT_TIMESTAMP),
        cached_at INTEGER DEFAULT (strftime('%s', 'now')),
        last_sync_at INTEGER
      );

      CREATE TABLE IF NOT EXISTS cached_messages (
        id TEXT PRIMARY KEY NOT NULL,
        content TEXT NOT NULL,
        user_id TEXT,
        type TEXT DEFAULT 'text',
        metadata TEXT,
        is_read INTEGER DEFAULT 0,
        created_at TEXT DEFAULT (CURRENT_TIMESTAMP),
        cached_at INTEGER DEFAULT (strftime('%s', 'now')),
        last_sync_at INTEGER,
        pending INTEGER DEFAULT 0
      );

      CREATE TABLE IF NOT EXISTS pending_mutations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        operation_name TEXT NOT NULL,
        variables TEXT NOT NULL,
        mutation TEXT NOT NULL,
        queued_at INTEGER DEFAULT (strftime('%s', 'now')),
        retries INTEGER DEFAULT 0,
        last_error TEXT
      );

      CREATE TABLE IF NOT EXISTS sync_metadata (
        entity_type TEXT PRIMARY KEY NOT NULL,
        last_sync_at INTEGER,
        schema_version INTEGER DEFAULT 1
      );

      CREATE TABLE IF NOT EXISTS apollo_cache_entries (
        key TEXT PRIMARY KEY NOT NULL,
        value TEXT NOT NULL,
        entity_type TEXT,
        entity_id TEXT,
        updated_at INTEGER DEFAULT (strftime('%s', 'now'))
      );

      CREATE INDEX IF NOT EXISTS idx_cached_trips_user_id ON cached_trips(user_id);
      CREATE INDEX IF NOT EXISTS idx_cached_trips_destination ON cached_trips(destination);
      CREATE INDEX IF NOT EXISTS idx_cached_trips_status ON cached_trips(status);
      CREATE INDEX IF NOT EXISTS idx_cached_trips_cached_at ON cached_trips(cached_at);
      CREATE INDEX IF NOT EXISTS idx_cached_tours_category ON cached_tours(category);
      CREATE INDEX IF NOT EXISTS idx_cached_places_type ON cached_places(type);
      CREATE INDEX IF NOT EXISTS idx_cached_places_location ON cached_places(location);
      CREATE INDEX IF NOT EXISTS idx_pending_mutations_queued_at ON pending_mutations(queued_at);
      CREATE INDEX IF NOT EXISTS idx_apollo_cache_entity ON apollo_cache_entries(entity_type, entity_id);
      CREATE INDEX IF NOT EXISTS idx_apollo_cache_updated_at ON apollo_cache_entries(updated_at);
    `);

    if (__DEV__) {
      console.log('✅ Local database migrations completed');
    }
  } catch (error) {
    console.error('❌ Database migration failed:', error);
    throw error;
  }
}

// Export schema for use in queries
export const schema = clientSchema;

// ============================================================================
// APOLLO CACHE SYNC
// ============================================================================

const ENTITY_TYPE_TO_TABLE = {
  User: cachedUsers,
  Trip: cachedTrips,
  Tour: cachedTours,
  Place: cachedPlaces,
  Message: cachedMessages,
} as const;

type EntityType = keyof typeof ENTITY_TYPE_TO_TABLE;

/**
 * Sync Apollo normalized cache to Drizzle local database
 * 
 * @deprecated This function is no longer needed. DrizzleCacheStorage automatically
 * syncs to structured tables when Apollo writes to cache. This function is kept
 * for backward compatibility and migration purposes only.
 */
export async function syncApolloToDrizzle(cache: NormalizedCacheObject): Promise<void> {
  try {
    const db = await getLocalDB();
    const now = Math.floor(Date.now() / 1000);

    for (const [key, data] of Object.entries(cache)) {
      if (!data || typeof data !== 'object') continue;

      const match = key.match(/^([A-Z][a-zA-Z]*):(.+)$/);
      if (!match) continue;

      const [, entityType, entityId] = match;
      if (!(entityType in ENTITY_TYPE_TO_TABLE)) continue;

      const table = ENTITY_TYPE_TO_TABLE[entityType as EntityType];
      const transformed = transformEntity(entityType as EntityType, data);
      if (!transformed) continue;

      await upsertEntity(db, table, transformed, now);
    }

    if (__DEV__) {
      console.log('✅ Synced Apollo cache to Drizzle');
    }
  } catch (error) {
    console.error('❌ Failed to sync Apollo cache to Drizzle:', error);
    throw error;
  }
}

function transformEntity(entityType: EntityType, data: any): Record<string, any> | null {
  try {
    switch (entityType) {
      case 'User':
        return {
          id: String(data.id || ''),
          name: data.name || '',
          username: data.username || '',
          email: data.email || null,
          phone: data.phone || null,
          avatar: data.avatar || null,
          isActive: data.isActive !== false,
          createdAt: data.createdAt || new Date().toISOString(),
          updatedAt: data.updatedAt || new Date().toISOString(),
        };
      case 'Trip':
        return {
          id: String(data.id || ''),
          userId: String(data.userId || ''),
          title: data.title || null,
          destination: data.destination || null,
          startDate: data.startDate || null,
          endDate: data.endDate || null,
          budget: data.budget ? parseFloat(String(data.budget)) : null,
          travelers: data.travelers || 1,
          preferences: data.preferences || null,
          accommodation: data.accommodation || null,
          status: data.status || 'in_progress',
          aiReasoning: data.aiReasoning || null,
          itinerary: data.itinerary ? JSON.stringify(data.itinerary) : null,
          coordinates: data.coordinates ? JSON.stringify(data.coordinates) : null,
          createdAt: data.createdAt || new Date().toISOString(),
          updatedAt: data.updatedAt || new Date().toISOString(),
        };
      case 'Tour':
        return {
          id: String(data.id || ''),
          title: data.title || '',
          location: data.location || '',
          price: parseFloat(String(data.price || 0)),
          rating: parseFloat(String(data.rating || 0)),
          reviews: parseInt(String(data.reviews || 0), 10),
          duration: parseInt(String(data.duration || 0), 10),
          category: data.category || '',
          description: data.description || '',
          highlights: data.highlights ? JSON.stringify(data.highlights) : null,
          inclusions: data.inclusions ? JSON.stringify(data.inclusions) : null,
          maxParticipants: data.maxParticipants ? parseInt(String(data.maxParticipants), 10) : null,
          difficulty: data.difficulty || 'easy',
          createdAt: data.createdAt || new Date().toISOString(),
          updatedAt: data.updatedAt || new Date().toISOString(),
        };
      case 'Place':
        return {
          id: String(data.id || ''),
          name: data.name || '',
          location: data.location || '',
          distance: data.distance ? parseFloat(String(data.distance)) : null,
          rating: parseFloat(String(data.rating || 0)),
          reviews: parseInt(String(data.reviews || 0), 10),
          type: data.category || data.type || '',
          isOpen: data.isOpen !== false,
          description: data.description || '',
          tips: data.tips ? JSON.stringify(data.tips) : null,
          coordinates: data.coordinates ? JSON.stringify(data.coordinates) : null,
          phone: data.phone || null,
          website: data.website || null,
          hours: data.hours || null,
          createdAt: data.createdAt || new Date().toISOString(),
          updatedAt: data.updatedAt || new Date().toISOString(),
        };
      case 'Message':
        return {
          id: String(data.id || ''),
          content: data.content || '',
          userId: data.userId ? String(data.userId) : null,
          type: data.type || 'text',
          metadata: data.metadata ? JSON.stringify(data.metadata) : null,
          isRead: data.isRead === true,
          createdAt: data.createdAt || new Date().toISOString(),
        };
      default:
        return null;
    }
  } catch (error) {
    if (__DEV__) {
      console.warn(`Failed to transform ${entityType}:`, error);
    }
    return null;
  }
}

async function upsertEntity(
  db: Awaited<ReturnType<typeof getLocalDB>>,
  table: any,
  data: Record<string, any>,
  now: number
): Promise<void> {
  try {
    const existing = await db.select().from(table).where(eq(table.id, data.id)).limit(1);
    const record = { ...data, lastSyncAt: now, pending: false };

    if (existing.length > 0) {
      await db
        .update(table)
        .set({ ...record, cachedAt: existing[0].cachedAt || now })
        .where(eq(table.id, data.id));
    } else {
      await db.insert(table).values({ ...record, cachedAt: now });
    }
  } catch (error) {
    if (__DEV__) {
      console.warn(`Failed to upsert ${data.id}:`, error);
    }
  }
}

// ============================================================================
// DATABASE STATISTICS
// ============================================================================

export interface EntityStats {
  count: number;
  pendingCount: number;
  deletedCount: number;
  lastSyncAt: number | null;
  oldestCachedAt: number | null;
  newestCachedAt: number | null;
}

export interface ApolloCacheStats {
  totalEntries: number;
  entityEntries: number;
  rootEntries: number;
  totalSize: number;
  oldestEntry: number | null;
  newestEntry: number | null;
  entriesByType: Record<string, number>;
}

export interface DatabaseStats {
  entities: {
    trips: EntityStats;
    users: EntityStats;
    messages: EntityStats;
    tours: EntityStats;
    places: EntityStats;
  };
  totalEntities: number;
  apolloCache: ApolloCacheStats;
  pendingMutations: {
    total: number;
    withErrors: number;
    oldestQueuedAt: number | null;
  };
  syncStatus: Array<{
    entityType: string;
    lastSyncAt: number | null;
    schemaVersion: number;
  }>;
  storage: {
    totalSize: number;
    apolloCacheSize: number;
    structuredDataSize: number;
  };
}

/**
 * Get comprehensive database statistics
 */
export async function getDatabaseStats(): Promise<DatabaseStats> {
  try {
    const db = await getLocalDB();

    // Helper to get entity stats
    const getEntityStats = async (table: any, hasPending = false, hasDeleted = false) => {
      const [count] = await db.select({ count: sql<number>`count(*)` }).from(table);
      const [lastSync] = await db.select({ lastSync: sql<number>`max(${table.lastSyncAt})` }).from(table);
      const [cachedRange] = await db
        .select({
          oldest: sql<number>`min(${table.cachedAt})`,
          newest: sql<number>`max(${table.cachedAt})`,
        })
        .from(table);

      let pendingCount = 0;
      if (hasPending) {
        const [pending] = await db.select({ count: sql<number>`count(*)` }).from(table).where(eq(table.pending, true));
        pendingCount = pending?.count || 0;
      }

      let deletedCount = 0;
      if (hasDeleted) {
        const [deleted] = await db.select({ count: sql<number>`count(*)` }).from(table).where(isNotNull(table.deletedAt));
        deletedCount = deleted?.count || 0;
      }

      return {
        count: count?.count || 0,
        pendingCount,
        deletedCount,
        lastSyncAt: lastSync?.lastSync || null,
        oldestCachedAt: cachedRange?.oldest || null,
        newestCachedAt: cachedRange?.newest || null,
      };
    };

    const [trips, users, messages, tours, places] = await Promise.all([
      getEntityStats(cachedTrips, true, true),
      getEntityStats(cachedUsers, true, false),
      getEntityStats(cachedMessages, true, false),
      getEntityStats(cachedTours, false, false),
      getEntityStats(cachedPlaces, false, false),
    ]);

    const [pendingTotal] = await db.select({ count: sql<number>`count(*)` }).from(pendingMutations);
    const [pendingWithErrors] = await db.select({ count: sql<number>`count(*)` }).from(pendingMutations).where(isNotNull(pendingMutations.lastError));
    const [pendingOldest] = await db.select({ oldest: sql<number>`min(${pendingMutations.queuedAt})` }).from(pendingMutations);
    const syncStatus = await db.select().from(syncMetadata);

    // Get Apollo cache statistics
    const [apolloTotal] = await db.select({ count: sql<number>`count(*)` }).from(apolloCacheEntries);
    const [apolloEntityCount] = await db.select({ count: sql<number>`count(*)` }).from(apolloCacheEntries).where(isNotNull(apolloCacheEntries.entityType));
    const [apolloRootCount] = await db.select({ count: sql<number>`count(*)` }).from(apolloCacheEntries).where(sql`${apolloCacheEntries.entityType} IS NULL`);
    const [apolloSize] = await db.select({ totalSize: sql<number>`SUM(LENGTH(${apolloCacheEntries.value}))` }).from(apolloCacheEntries);
    const [apolloTimeRange] = await db.select({
      oldest: sql<number>`min(${apolloCacheEntries.updatedAt})`,
      newest: sql<number>`max(${apolloCacheEntries.updatedAt})`,
    }).from(apolloCacheEntries);
    
    // Get entries by entity type
    const entriesByTypeResult = await db
      .select({
        entityType: apolloCacheEntries.entityType,
        count: sql<number>`count(*)`,
      })
      .from(apolloCacheEntries)
      .where(isNotNull(apolloCacheEntries.entityType))
      .groupBy(apolloCacheEntries.entityType);
    
    const entriesByType: Record<string, number> = {};
    entriesByTypeResult.forEach((row) => {
      if (row.entityType) {
        entriesByType[row.entityType] = Number(row.count || 0);
      }
    });

    const apolloCacheStats: ApolloCacheStats = {
      totalEntries: Number(apolloTotal?.count || 0),
      entityEntries: Number(apolloEntityCount?.count || 0),
      rootEntries: Number(apolloRootCount?.count || 0),
      totalSize: Number(apolloSize?.totalSize || 0),
      oldestEntry: apolloTimeRange?.oldest || null,
      newestEntry: apolloTimeRange?.newest || null,
      entriesByType,
    };

    // Calculate structured data size (approximate)
    const structuredDataSize = apolloCacheStats.totalSize; // For now, use same as cache size

    return {
      entities: { trips, users, messages, tours, places },
      totalEntities: trips.count + users.count + messages.count + tours.count + places.count,
      apolloCache: apolloCacheStats,
      pendingMutations: {
        total: pendingTotal?.count || 0,
        withErrors: pendingWithErrors?.count || 0,
        oldestQueuedAt: pendingOldest?.oldest || null,
      },
      syncStatus: syncStatus.map((s) => ({
        entityType: s.entityType,
        lastSyncAt: s.lastSyncAt || null,
        schemaVersion: s.schemaVersion || 1,
      })),
      storage: {
        totalSize: apolloCacheStats.totalSize + structuredDataSize,
        apolloCacheSize: apolloCacheStats.totalSize,
        structuredDataSize,
      },
    };
  } catch (error) {
    console.error('Failed to get database stats:', error);
    const empty = { count: 0, pendingCount: 0, deletedCount: 0, lastSyncAt: null, oldestCachedAt: null, newestCachedAt: null };
    return {
      entities: { trips: empty, users: empty, messages: empty, tours: empty, places: empty },
      totalEntities: 0,
      pendingMutations: { total: 0, withErrors: 0, oldestQueuedAt: null },
      syncStatus: [],
      apolloCache: {
        totalEntries: 0,
        entityEntries: 0,
        rootEntries: 0,
        totalSize: 0,
        oldestEntry: null,
        newestEntry: null,
        entriesByType: {},
      },
      storage: { totalSize: 0, apolloCacheSize: 0, structuredDataSize: 0 },
    };
  }
}

/**
 * Get pending mutations with details
 */
export async function getPendingMutationsDetails() {
  try {
    const db = await getLocalDB();
    return await db.select().from(pendingMutations).orderBy(desc(pendingMutations.queuedAt)).limit(10);
  } catch (error) {
    console.error('Failed to get pending mutations details:', error);
    return [];
  }
}

/**
 * Format timestamp to human-readable format
 */
export function formatTimestamp(timestamp: number | null): string {
  if (!timestamp) return 'Never';
  const diff = Math.floor(Date.now() / 1000) - timestamp;
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}
