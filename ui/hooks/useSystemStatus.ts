import { useEffect, useState } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { drizzleCacheStorage } from '@api';

export interface SystemStatus {
  isOnline: boolean;
  isBackendReachable: boolean;
  cacheSize: number;
  cacheKeys: number;
  networkType: string | null;
}

/**
 * Hook to get comprehensive system status including:
 * - Network connectivity
 * - Backend reachability
 * - SQLite cache statistics
 */
export function useSystemStatus() {
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [networkType, setNetworkType] = useState<string | null>(null);
  const [cacheSize, setCacheSize] = useState<number>(0);
  const [cacheKeys, setCacheKeys] = useState<number>(0);
  
  // Start with true (optimistic) - will be updated after first check
  const [isBackendReachable, setIsBackendReachable] = useState<boolean>(true);

  const updateNetworkStatus = async () => {
    const state = await NetInfo.fetch();
    setIsOnline(state.isConnected ?? false);
    setNetworkType(state.type || null);
  };

  const updateCacheStats = async () => {
    try {
      const size = await drizzleCacheStorage.getCacheSize();
      const keys = await drizzleCacheStorage.getAllKeys();
      setCacheSize(size);
      setCacheKeys(keys.length);
    } catch (error) {
      console.error('Error fetching cache stats:', error);
    }
  };

  const checkBackendReachability = async () => {
    try {
      // Use the existing backend reachability check function for consistency
      const { checkBackendReachable } = await import('./useGraphBackendReachable');
      const reachable = await checkBackendReachable();
      setIsBackendReachable(reachable);
    } catch {
      setIsBackendReachable(false);
    }
  };

  useEffect(() => {
    // Initial fetch on mount only (wrapped in async to avoid lint error)
    (async () => {
      await updateNetworkStatus();
      await updateCacheStats();
      await checkBackendReachability();
    })().catch((error) => {
      console.error('Error initializing system status:', error);
    });

    // Listen to network changes (event-based, not polling)
    const unsubscribe = NetInfo.addEventListener(async (state) => {
      const connected = state.isConnected ?? false;
      setIsOnline(connected);
      setNetworkType(state.type || null);
      
      // When network state changes, check backend reachability
      if (connected) {
        // Network is connected, check if backend is reachable
        await checkBackendReachability().catch(() => {
          setIsBackendReachable(false);
        });
      } else {
        // Network is disconnected, backend is definitely not reachable
        setIsBackendReachable(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return {
    isOnline,
    isBackendReachable,
    networkType,
    cacheSize,
    cacheKeys,
    refetch: async () => {
      await Promise.all([
        updateNetworkStatus(),
        updateCacheStats(),
        checkBackendReachability(),
      ]);
    },
  };
}

