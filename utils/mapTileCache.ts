/**
 * Map Tile Cache Manager
 * 
 * Handles downloading, caching, and managing map tiles for offline use.
 * Uses Expo FileSystem for file storage and Drizzle ORM for metadata.
 */

import * as FileSystem from 'expo-file-system';
import { getLocalDB } from '@database/client';
import { cachedMapTiles } from '@database/schema';
import { eq, and, sql } from 'drizzle-orm';
import NetInfo from '@react-native-community/netinfo';

export type MapLayer = 'standard' | 'satellite' | 'terrain';

interface TileKey {
  layer: MapLayer;
  z: number;
  x: number;
  y: number;
}

interface _CachedTile {
  id: string;
  layer: MapLayer;
  z: number;
  x: number;
  y: number;
  filePath: string;
  fileSize: number;
  cachedAt: number;
  lastAccessed: number;
}

// Tile URL templates
const TILE_URL_TEMPLATES: Record<MapLayer, string> = {
  standard: 'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png',
  satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
  terrain: 'https://a.tile.opentopomap.org/{z}/{x}/{y}.png',
};

// Cache directory - use FileSystem.Paths.document which returns a Directory object
// We need to get the URI string from it
const getCacheDir = () => {
  const docDir = FileSystem.Paths.document.uri;
  if (!docDir) {
    throw new Error('Document directory not available');
  }
  return `${docDir}tiles/`;
};

/**
 * Get tile URL for a given tile key
 */
function getTileUrl({ layer, z, x, y }: TileKey): string {
  const template = TILE_URL_TEMPLATES[layer];
  return template.replace('{z}', String(z)).replace('{x}', String(x)).replace('{y}', String(y));
}

/**
 * Get file path for a cached tile
 */
function getTileFilePath({ layer, z, x, y }: TileKey): string {
  return `${getCacheDir()}${layer}/${z}/${x}/${y}.png`;
}

/**
 * Get tile key from file path
 */
function _getTileKeyFromPath(filePath: string): TileKey | null {
  const match = filePath.match(/tiles\/(standard|satellite|terrain)\/(\d+)\/(\d+)\/(\d+)\.png$/);
  if (!match) return null;
  return {
    layer: match[1] as MapLayer,
    z: parseInt(match[2], 10),
    x: parseInt(match[3], 10),
    y: parseInt(match[4], 10),
  };
}

/**
 * Ensure cache directory exists
 */
async function ensureCacheDirectory(): Promise<void> {
  const cacheDir = getCacheDir();
  const dirInfo = await FileSystem.getInfoAsync(cacheDir);
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(cacheDir, { intermediates: true });
  }
  
  // Ensure layer directories exist
  for (const layer of ['standard', 'satellite', 'terrain'] as MapLayer[]) {
    const layerDir = `${cacheDir}${layer}/`;
    const layerInfo = await FileSystem.getInfoAsync(layerDir);
    if (!layerInfo.exists) {
      await FileSystem.makeDirectoryAsync(layerDir, { intermediates: true });
    }
  }
}

/**
 * Check if a tile is cached
 */
export async function isTileCached(tileKey: TileKey): Promise<boolean> {
  try {
    const db = await getLocalDB();
    // Check database
    const cached = await db
      .select()
      .from(cachedMapTiles)
      .where(
        and(
          eq(cachedMapTiles.layer, tileKey.layer),
          eq(cachedMapTiles.z, tileKey.z),
          eq(cachedMapTiles.x, tileKey.x),
          eq(cachedMapTiles.y, tileKey.y)
        )
      )
      .get();
    
    if (!cached) return false;
    
    // Verify file exists
    const fileInfo = await FileSystem.getInfoAsync(cached.filePath);
    return fileInfo.exists;
  } catch (error) {
    console.error('Error checking tile cache:', error);
    return false;
  }
}

/**
 * Get cached tile file path
 */
export async function getCachedTilePath(tileKey: TileKey): Promise<string | null> {
  try {
    const db = await getLocalDB();
    
    const cached = await db
      .select()
      .from(cachedMapTiles)
      .where(
        and(
          eq(cachedMapTiles.layer, tileKey.layer),
          eq(cachedMapTiles.z, tileKey.z),
          eq(cachedMapTiles.x, tileKey.x),
          eq(cachedMapTiles.y, tileKey.y)
        )
      )
      .get();
    
    if (!cached) return null;
    
    // Verify file exists
    const fileInfo = await FileSystem.getInfoAsync(cached.filePath);
    if (!fileInfo.exists) {
      // File missing, remove from database
      await db.delete(cachedMapTiles).where(eq(cachedMapTiles.id, cached.id));
      return null;
    }
    
    // Update last accessed time
    await db
      .update(cachedMapTiles)
      .set({ lastAccessed: Math.floor(Date.now() / 1000) })
      .where(eq(cachedMapTiles.id, cached.id));
    
    return cached.filePath;
  } catch (error) {
    console.error('Error getting cached tile path:', error);
    return null;
  }
}

/**
 * Download and cache a tile
 */
export async function cacheTile(tileKey: TileKey): Promise<boolean> {
  try {
    // Check if already cached
    if (await isTileCached(tileKey)) {
      return true;
    }
    
    // Check network connectivity
    const netInfo = await NetInfo.fetch();
    if (!netInfo.isConnected) {
      return false; // Can't download offline
    }
    
    await ensureCacheDirectory();
    
    const tileUrl = getTileUrl(tileKey);
    const filePath = getTileFilePath(tileKey);
    
    // Ensure directory exists for this tile
    const dirPath = filePath.substring(0, filePath.lastIndexOf('/'));
    const dirInfo = await FileSystem.getInfoAsync(dirPath);
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(dirPath, { intermediates: true });
    }
    
    // Download tile
    const downloadResult = await FileSystem.downloadAsync(tileUrl, filePath);
    
    if (downloadResult.status !== 200) {
      // Clean up failed download
      const fileInfo = await FileSystem.getInfoAsync(filePath);
      if (fileInfo.exists) {
        await FileSystem.deleteAsync(filePath, { idempotent: true });
      }
      return false;
    }
    
    // Get file size
    const fileInfo = await FileSystem.getInfoAsync(filePath);
    if (!fileInfo.exists) {
      return false;
    }
    
    const fileSize = fileInfo.size || 0;
    const now = Math.floor(Date.now() / 1000);
    
    // Save to database
    const db = await getLocalDB();
    await db.insert(cachedMapTiles).values({
      layer: tileKey.layer,
      z: tileKey.z,
      x: tileKey.x,
      y: tileKey.y,
      filePath,
      fileSize,
      cachedAt: now,
      lastAccessed: now,
    });
    
    return true;
  } catch (error) {
    console.error('Error caching tile:', error);
    return false;
  }
}

/**
 * Get cache statistics
 */
export async function getCacheStats(): Promise<{
  totalTiles: number;
  totalSize: number;
  tilesByLayer: Record<MapLayer, number>;
  oldestTile: number | null;
  newestTile: number | null;
}> {
  try {
    const db = await getLocalDB();
    
    const allTiles = await db.select().from(cachedMapTiles).all();
    
    const totalTiles = allTiles.length;
    const totalSize = allTiles.reduce((sum, tile) => sum + tile.fileSize, 0);
    
    const tilesByLayer: Record<MapLayer, number> = {
      standard: 0,
      satellite: 0,
      terrain: 0,
    };
    
    let oldestTile: number | null = null;
    let newestTile: number | null = null;
    
    for (const tile of allTiles) {
      tilesByLayer[tile.layer as MapLayer]++;
      const cachedAt = tile.cachedAt;
      if (cachedAt !== null) {
        if (oldestTile === null || cachedAt < oldestTile) {
          oldestTile = cachedAt;
        }
        if (newestTile === null || cachedAt > newestTile) {
          newestTile = cachedAt;
        }
      }
    }
    
    return {
      totalTiles,
      totalSize,
      tilesByLayer,
      oldestTile,
      newestTile,
    };
  } catch (error) {
    console.error('Error getting cache stats:', error);
    return {
      totalTiles: 0,
      totalSize: 0,
      tilesByLayer: { standard: 0, satellite: 0, terrain: 0 },
      oldestTile: null,
      newestTile: null,
    };
  }
}

/**
 * Clear all cached tiles
 */
export async function clearCache(): Promise<boolean> {
  try {
    const db = await getLocalDB();
    
    // Get all cached tiles
    const allTiles = await db.select().from(cachedMapTiles).all();
    
    // Delete files
    for (const tile of allTiles) {
      try {
        const fileInfo = await FileSystem.getInfoAsync(tile.filePath);
        if (fileInfo.exists) {
          await FileSystem.deleteAsync(tile.filePath, { idempotent: true });
        }
      } catch (error) {
        console.error(`Error deleting tile file ${tile.filePath}:`, error);
      }
    }
    
    // Clear database
    await db.delete(cachedMapTiles);
    
    // Try to remove cache directory (may fail if not empty due to subdirectories)
    try {
      await FileSystem.deleteAsync(getCacheDir(), { idempotent: true });
    } catch (_error) {
      // Ignore - directory may not be empty
    }
    
    return true;
  } catch (error) {
    console.error('Error clearing cache:', error);
    return false;
  }
}

/**
 * Clean up old tiles based on time limit (in days)
 */
export async function cleanupOldTiles(daysOld: number): Promise<number> {
  try {
    const db = await getLocalDB();
    const cutoffTime = Math.floor(Date.now() / 1000) - daysOld * 24 * 60 * 60;
    
    // Get old tiles
    const oldTiles = await db
      .select()
      .from(cachedMapTiles)
      .where(sql`${cachedMapTiles.cachedAt} < ${cutoffTime}`)
      .all();
    
    let deletedCount = 0;
    
    // Delete files and database entries
    for (const tile of oldTiles) {
      try {
        const fileInfo = await FileSystem.getInfoAsync(tile.filePath);
        if (fileInfo.exists) {
          await FileSystem.deleteAsync(tile.filePath, { idempotent: true });
        }
        await db.delete(cachedMapTiles).where(eq(cachedMapTiles.id, tile.id));
        deletedCount++;
      } catch (error) {
        console.error(`Error deleting old tile ${tile.filePath}:`, error);
      }
    }
    
    return deletedCount;
  } catch (error) {
    console.error('Error cleaning up old tiles:', error);
    return 0;
  }
}

/**
 * Clean up cache based on size limit (LRU eviction)
 */
export async function cleanupCacheBySize(maxSizeBytes: number): Promise<number> {
  try {
    const stats = await getCacheStats();
    
    if (stats.totalSize <= maxSizeBytes) {
      return 0; // No cleanup needed
    }
    
    const db = await getLocalDB();
    
    // Get tiles sorted by last accessed (oldest first)
    const tiles = await db
      .select()
      .from(cachedMapTiles)
      .orderBy(cachedMapTiles.lastAccessed)
      .all();
    
    let currentSize = stats.totalSize;
    let deletedCount = 0;
    
    // Delete oldest tiles until under limit
    for (const tile of tiles) {
      if (currentSize <= maxSizeBytes) {
        break;
      }
      
      try {
        const fileInfo = await FileSystem.getInfoAsync(tile.filePath);
        if (fileInfo.exists) {
          await FileSystem.deleteAsync(tile.filePath, { idempotent: true });
        }
        await db.delete(cachedMapTiles).where(eq(cachedMapTiles.id, tile.id));
        currentSize -= tile.fileSize;
        deletedCount++;
      } catch (error) {
        console.error(`Error deleting tile ${tile.filePath}:`, error);
      }
    }
    
    return deletedCount;
  } catch (error) {
    console.error('Error cleaning up cache by size:', error);
    return 0;
  }
}

