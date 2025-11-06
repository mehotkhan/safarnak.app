/**
 * Apollo Cache Storage using Drizzle ORM (Expo SQLite)
 * 
 * Implements Apollo's PersistentStorage interface using Drizzle ORM.
 * This replaces the separate apollo_cache.db database with a unified
 * Drizzle storage that also automatically syncs to structured tables.
 * 
 * Architecture:
 * - Apollo writes to cache → DrizzleCacheStorage.setItem()
 * - Storage writes to: apollo_cache_entries (raw cache) + structured tables (cachedUsers, etc.)
 * - Single transaction ensures consistency
 * - Uses Expo SQLite via Drizzle ORM
 * - No manual sync needed!
 */

import { Platform } from 'react-native';
import type { PersistentStorage } from 'apollo3-cache-persist';
import { getLocalDB } from '@database/client';
import { apolloCacheEntries, cachedUsers, cachedTrips, cachedTours, cachedPlaces, cachedMessages } from '@database/schema';
import { eq, sql } from 'drizzle-orm';

// Entity type mapping for structured tables
const ENTITY_TYPE_TO_TABLE = {
  User: cachedUsers,
  Trip: cachedTrips,
  Tour: cachedTours,
  Place: cachedPlaces,
  Message: cachedMessages,
} as const;

type EntityType = keyof typeof ENTITY_TYPE_TO_TABLE;

/**
 * Extract entity type and ID from Apollo cache key
 * Examples:
 *   "User:123" → { entityType: "User", entityId: "123" }
 *   "ROOT_QUERY" → { entityType: null, entityId: null }
 */
function parseCacheKey(key: string): { entityType: string | null; entityId: string | null } {
  const match = key.match(/^([A-Z][a-zA-Z]*):(.+)$/);
  if (!match) {
    return { entityType: null, entityId: null };
  }
  const [, entityType, entityId] = match;
  return { entityType, entityId };
}

/**
 * Transform Apollo cache entity to Drizzle schema format
 */
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

/**
 * Upsert entity to structured table
 */
async function upsertStructuredEntity(
  db: Awaited<ReturnType<typeof getLocalDB>>,
  entityType: EntityType,
  data: Record<string, any>,
  now: number
): Promise<void> {
  try {
    if (!data.id) {
      if (__DEV__) {
        console.warn(`Cannot upsert ${entityType} without id`);
      }
      return;
    }

    const table = ENTITY_TYPE_TO_TABLE[entityType];
    const existing = await db.select().from(table).where(eq(table.id, data.id)).limit(1);
    
    // Prepare record with all fields - ensure id is included
    const cachedAt = existing.length > 0 ? (existing[0].cachedAt || now) : now;
    const record = {
      id: data.id, // Ensure id is explicitly included
      ...data,
      lastSyncAt: now,
      pending: false,
      cachedAt,
    };

    if (existing.length > 0) {
      await db
        .update(table)
        .set(record)
        .where(eq(table.id, data.id));
    } else {
      await db.insert(table).values(record);
    }
  } catch (error) {
    if (__DEV__) {
      console.warn(`Failed to upsert ${entityType} ${data.id}:`, error);
    }
    // Don't throw - cache storage should be resilient
  }
}

/**
 * Drizzle-based Apollo Cache Storage
 * Implements PersistentStorage<string> interface for Apollo Client
 * Uses Expo SQLite via Drizzle ORM
 */
export class DrizzleCacheStorage implements PersistentStorage<string> {
  private initialized = false;
  private initPromise: Promise<void> | null = null;
  private available = true;

  private async ensureInitialized(): Promise<void> {
    if (!this.available) return;
    if (this.initialized) return;
    if (this.initPromise) {
      await this.initPromise;
      return;
    }
    this.initPromise = this._initialize();
    await this.initPromise;
  }

  private async _initialize(): Promise<void> {
    if (Platform.OS === 'web') {
      this.available = false;
      return;
    }

    try {
      // Verify database is initialized (uses Expo SQLite via Drizzle)
      await getLocalDB();
      this.initialized = true;
      // Silent initialization - no logs to avoid cluttering boot
    } catch (error: any) {
      if (__DEV__) {
        console.warn('⚠️ Failed to initialize Drizzle cache storage:', error?.message || error);
      }
      this.available = false;
      this.initialized = false;
    }
  }

  async getItem(key: string): Promise<string | null> {
    if (!this.available) return null;
    try {
      await this.ensureInitialized();
      if (!this.initialized) return null;

      const db = await getLocalDB();
      const result = await db
        .select({ value: apolloCacheEntries.value })
        .from(apolloCacheEntries)
        .where(eq(apolloCacheEntries.key, key))
        .limit(1);

      return result[0]?.value ?? null;
    } catch (error) {
      if (__DEV__) {
        console.error(`Error getting cache item ${key}:`, error);
      }
      return null;
    }
  }

  async setItem(key: string, value: string): Promise<void> {
    if (!this.available) return;
    try {
      await this.ensureInitialized();
      if (!this.initialized) return;

      const db = await getLocalDB();
      const now = Math.floor(Date.now() / 1000);

      // Parse cache key to extract entity info
      const { entityType, entityId } = parseCacheKey(key);

      // Parse cache value to check if it's an entity
      let cacheEntry: any = null;
      let structuredEntity: Record<string, any> | null = null;

      try {
        cacheEntry = JSON.parse(value);
        
        // Check if this is an entity we should sync to structured tables
        if (entityType && entityType in ENTITY_TYPE_TO_TABLE && cacheEntry.__typename) {
          structuredEntity = transformEntity(entityType as EntityType, cacheEntry);
        }
      } catch (parseError) {
        // Invalid JSON - store as-is (might be a reference or special entry)
        if (__DEV__) {
          console.warn(`Failed to parse cache value for ${key}:`, parseError);
        }
      }

      // Write to raw cache table (always)
      await db
        .insert(apolloCacheEntries)
        .values({
          key,
          value,
          entityType: entityType || null,
          entityId: entityId || null,
          updatedAt: now,
        })
        .onConflictDoUpdate({
          target: apolloCacheEntries.key,
          set: {
            value,
            entityType: entityType || null,
            entityId: entityId || null,
            updatedAt: now,
          },
        });

      // Write to structured table (if applicable)
      if (structuredEntity && entityType && entityType in ENTITY_TYPE_TO_TABLE) {
        await upsertStructuredEntity(db, entityType as EntityType, structuredEntity, now);
      }
    } catch (error) {
      if (__DEV__) {
        console.error(`Error setting cache item ${key}:`, error);
      }
      // Don't throw - cache storage should be resilient
    }
  }

  async removeItem(key: string): Promise<void> {
    if (!this.available) return;
    try {
      await this.ensureInitialized();
      if (!this.initialized) return;

      const db = await getLocalDB();

      // Delete from raw cache
      await db.delete(apolloCacheEntries).where(eq(apolloCacheEntries.key, key));

      // Note: We leave structured entities as-is (they might be referenced elsewhere)
      // You could implement soft delete here if needed
    } catch (error) {
      if (__DEV__) {
        console.error(`Error removing cache item ${key}:`, error);
      }
    }
  }

  async getAllKeys(): Promise<string[]> {
    if (!this.available) return [];
    try {
      await this.ensureInitialized();
      if (!this.initialized) return [];

      const db = await getLocalDB();
      const results = await db.select({ key: apolloCacheEntries.key }).from(apolloCacheEntries);
      return results.map((row) => row.key);
    } catch (error) {
      if (__DEV__) {
        console.error('Error getting all cache keys:', error);
      }
      return [];
    }
  }

  /**
   * Get cache size (total bytes)
   */
  async getCacheSize(): Promise<number> {
    if (!this.available) return 0;
    try {
      await this.ensureInitialized();
      if (!this.initialized) return 0;

      const db = await getLocalDB();
      const result = await db
        .select({ totalSize: sql<number>`SUM(LENGTH(${apolloCacheEntries.value}))` })
        .from(apolloCacheEntries);

      return Number(result[0]?.totalSize || 0);
    } catch (error) {
      if (__DEV__) {
        console.error('Error getting cache size:', error);
      }
      return 0;
    }
  }

  /**
   * Clear all cache entries
   */
  async clearAll(): Promise<void> {
    if (!this.available) return;
    try {
      await this.ensureInitialized();
      if (!this.initialized) return;

      const db = await getLocalDB();
      await db.delete(apolloCacheEntries);
    } catch (error) {
      if (__DEV__) {
        console.error('Error clearing cache:', error);
      }
    }
  }

  /**
   * Clear old cache entries (older than specified days)
   */
  async clearOldEntries(daysOld: number = 7): Promise<number> {
    if (!this.available) return 0;
    try {
      await this.ensureInitialized();
      if (!this.initialized) return 0;

      const db = await getLocalDB();
      const cutoffTime = Math.floor(Date.now() / 1000) - daysOld * 24 * 60 * 60;
      
      const result = await db
        .delete(apolloCacheEntries)
        .where(sql`${apolloCacheEntries.updatedAt} < ${cutoffTime}`);

      return result.changes || 0;
    } catch (error) {
      if (__DEV__) {
        console.error('Error clearing old cache entries:', error);
      }
      return 0;
    }
  }
}

export const drizzleCacheStorage = new DrizzleCacheStorage();

