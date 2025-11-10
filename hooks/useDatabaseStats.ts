/**
 * Hook to get advanced database statistics
 * 
 * Provides real-time statistics for the local Drizzle database
 */

import { useEffect, useState, useCallback } from 'react';
import { getDatabaseStats, type DatabaseStats } from '@database/client';

export function useDatabaseStats() {
  const [stats, setStats] = useState<DatabaseStats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    try {
      const dbStats = await getDatabaseStats();
      setStats(dbStats);
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
    refetch: fetchStats,
  };
}

