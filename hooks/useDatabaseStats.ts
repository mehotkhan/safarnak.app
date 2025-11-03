/**
 * Hook to get advanced database statistics
 * 
 * Provides real-time statistics for the local Drizzle database
 */

import { useEffect, useState, useCallback } from 'react';
import { getDatabaseStats, getPendingMutationsDetails, type DatabaseStats } from '@drizzle/client';
import { sqliteStorage } from '@api';

export function useDatabaseStats() {
  const [stats, setStats] = useState<DatabaseStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [apolloCacheSize, setApolloCacheSize] = useState<number>(0);

  const fetchStats = useCallback(async () => {
    try {
      const [dbStats, cacheSize] = await Promise.all([
        getDatabaseStats(),
        sqliteStorage.getCacheSize().catch(() => 0),
      ]);

      // Add Apollo cache size to stats
      dbStats.storage.apolloCacheSize = cacheSize;
      dbStats.storage.totalSize = cacheSize; // Simplified for now

      setStats(dbStats);
      setApolloCacheSize(cacheSize);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch database stats:', error);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Initial fetch on mount only
    fetchStats().catch((error) => {
      console.error('Failed to fetch database stats:', error);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    stats,
    loading,
    apolloCacheSize,
    refetch: fetchStats,
  };
}

