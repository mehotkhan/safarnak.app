/**
 * Map Tile Cache Manager
 * 
 * Handles downloading, caching, and managing map tiles for offline use.
 * Uses Expo FileSystem (new API) for file storage and Drizzle ORM for metadata.
 */

import { Directory, File as FSFile, Paths } from 'expo-file-system/next';
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

const FAILED_TILE_RETRY_INTERVAL_MS = 10_000;
const failedTileDownloads = new Map<string, number>();
let networkListenerRegistered = false;

function pruneFailedTileEntries(nowMs: number) {
  if (failedTileDownloads.size === 0) {
    return;
  }

  for (const [key, timestamp] of failedTileDownloads.entries()) {
    if (nowMs - timestamp >= FAILED_TILE_RETRY_INTERVAL_MS) {
      failedTileDownloads.delete(key);
    }
  }

  // Safety cap in case of many failures; keep most recent entries only
  if (failedTileDownloads.size > 500) {
    const sortedEntries = Array.from(failedTileDownloads.entries()).sort((a, b) => b[1] - a[1]);
    failedTileDownloads.clear();
    for (let i = 0; i < Math.min(sortedEntries.length, 200); i++) {
      const [k, value] = sortedEntries[i];
      failedTileDownloads.set(k, value);
    }
  }
}

/**
 * Get base cache directory
 */
function getCacheDirectory(): Directory {
  return new Directory(Paths.cache, 'tiles');
}

/**
 * Get tile URL for a given tile key
 */
function getTileUrl({ layer, z, x, y }: TileKey): string {
  const template = TILE_URL_TEMPLATES[layer];
  return template.replace('{z}', String(z)).replace('{x}', String(x)).replace('{y}', String(y));
}

/**
 * Get file object for a cached tile
 */
function getTileFile({ layer, z, x, y }: TileKey): FSFile {
  const cacheDir = getCacheDirectory();
  const layerDir = new Directory(cacheDir, layer);
  const zoomDir = new Directory(layerDir, String(z));
  const xDir = new Directory(zoomDir, String(x));
  return new FSFile(xDir, `${y}.png`);
}

function getTileCacheKey(tile: TileKey): string {
  return `${tile.layer}:${tile.z}:${tile.x}:${tile.y}`;
}

function isFileNode(node: Directory | FSFile): node is FSFile {
  return node instanceof FSFile;
}

async function nodeExists(node: Directory | FSFile): Promise<boolean> {
  try {
    const info = node.info();
    if (typeof info?.exists === 'boolean') {
      if (!info.exists) {
        return false;
      }

      if (isFileNode(node)) {
        const size = (info as { size?: number }).size;
        return typeof size === 'number' ? size > 0 : true;
      }

      return true;
    }

    return node.exists;
  } catch (_error) {
    return false;
  }
}

async function ensureDirectoryExists(directory: Directory): Promise<void> {
  try {
    directory.create({ intermediates: true, idempotent: true });
  } catch (error) {
    const infoExists = await nodeExists(directory);
    if (!infoExists) {
      throw error;
    }
  }
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
  try {
    const cacheDir = getCacheDirectory();
    await ensureDirectoryExists(cacheDir);

    // Ensure layer directories exist
    for (const layer of ['standard', 'satellite', 'terrain'] as MapLayer[]) {
      const layerDir = new Directory(cacheDir, layer);
      await ensureDirectoryExists(layerDir);
    }
  } catch (error) {
    console.error('Error ensuring cache directory:', error);
    throw error;
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
    
    // Verify file exists using new API
    const file = getTileFile(tileKey);
    return await nodeExists(file);
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
    
    // Verify file exists using new API
    const file = getTileFile(tileKey);
    if (!(await nodeExists(file))) {
      // File missing, remove from database
      await db.delete(cachedMapTiles).where(eq(cachedMapTiles.id, cached.id));
      return null;
    }
    
    // Update last accessed time
    await db
      .update(cachedMapTiles)
      .set({ lastAccessed: Math.floor(Date.now() / 1000) })
      .where(eq(cachedMapTiles.id, cached.id));
    
    return file.uri;
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

    ensureNetworkListener();

    const cacheKey = getTileCacheKey(tileKey);
    const lastFailure = failedTileDownloads.get(cacheKey);
    const nowMs = Date.now();
    pruneFailedTileEntries(nowMs);
    if (lastFailure && nowMs - lastFailure < FAILED_TILE_RETRY_INTERVAL_MS) {
      return false;
    }

    await ensureCacheDirectory();

    const tileUrl = getTileUrl(tileKey);
    const cacheDir = getCacheDirectory();
    const layerDir = new Directory(cacheDir, tileKey.layer);
    const zoomDir = new Directory(layerDir, String(tileKey.z));
    const xDir = new Directory(zoomDir, String(tileKey.x));

    await ensureDirectoryExists(layerDir);
    await ensureDirectoryExists(zoomDir);
    await ensureDirectoryExists(xDir);

    const targetFile = getTileFile(tileKey);

    try {
      await FSFile.downloadFileAsync(tileUrl, targetFile, {
        idempotent: true,
      });
    } catch (error) {
      try {
        if (await nodeExists(targetFile)) {
          targetFile.delete();
        }
      } catch (deleteError) {
        console.warn('Failed to clean up after download error:', deleteError);
      }

      failedTileDownloads.set(cacheKey, nowMs);
      pruneFailedTileEntries(nowMs);

      console.warn('Tile download failed:', tileKey, error);
      return false;
    }

    failedTileDownloads.delete(cacheKey);
    pruneFailedTileEntries(Date.now());

    const fileSize = typeof targetFile.size === 'number' ? targetFile.size : 0;
    
    const now = Math.floor(Date.now() / 1000);
    
    // Save to database
    const db = await getLocalDB();
    await db.insert(cachedMapTiles).values({
      layer: tileKey.layer,
      z: tileKey.z,
      x: tileKey.x,
      y: tileKey.y,
      filePath: targetFile.uri,
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
    
    // Delete files using new API
    for (const tile of allTiles) {
      try {
        // Reconstruct file path from tile data
        const tileKey: TileKey = {
          layer: tile.layer as MapLayer,
          z: tile.z,
          x: tile.x,
          y: tile.y,
        };
        const file = getTileFile(tileKey);
        
        if (await nodeExists(file)) {
          file.delete();
        }
      } catch (error) {
        console.error(`Error deleting tile file ${tile.filePath}:`, error);
      }
    }
    
    // Clear database
    await db.delete(cachedMapTiles);
    
    // Try to remove cache directory (with recursive delete)
    try {
      const cacheDir = getCacheDirectory();
      if (await nodeExists(cacheDir)) {
        await cacheDir.delete();
      }
    } catch (error) {
      console.warn('Could not delete cache directory:', error);
      // Ignore - some files may be locked or in use
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
    
    // Delete files and database entries using new API
    for (const tile of oldTiles) {
      try {
        // Reconstruct tile key
        const tileKey: TileKey = {
          layer: tile.layer as MapLayer,
          z: tile.z,
          x: tile.x,
          y: tile.y,
        };
        const file = getTileFile(tileKey);
        
        if (await nodeExists(file)) {
          file.delete();
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
    
    // Delete oldest tiles until under limit using new API
    for (const tile of tiles) {
      if (currentSize <= maxSizeBytes) {
        break;
      }
      
      try {
        // Reconstruct tile key
        const tileKey: TileKey = {
          layer: tile.layer as MapLayer,
          z: tile.z,
          x: tile.x,
          y: tile.y,
        };
        const file = getTileFile(tileKey);
        
        if (await nodeExists(file)) {
          file.delete();
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

function ensureNetworkListener() {
  if (networkListenerRegistered) {
    return;
  }

  NetInfo.addEventListener((state) => {
    if (state.isConnected) {
      failedTileDownloads.clear();
    }
  });

  networkListenerRegistered = true;
}

