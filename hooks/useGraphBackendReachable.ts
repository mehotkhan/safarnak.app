import { useEffect, useState } from 'react';
import { AppState } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { GRAPHQL_URI_NORMALIZED } from '@api/client';

export function useGraphBackendReachable(pollMs: number = 15000) {
  const [isReachable, setIsReachable] = useState<boolean>(true);

  useEffect(() => {
    const check = async () => {
      try {
        const net = await NetInfo.fetch();
        if (!net.isConnected) {
          setIsReachable(false);
          return;
        }
        const res = await fetch(GRAPHQL_URI_NORMALIZED, { method: 'HEAD' });
        setIsReachable(res.ok);
      } catch {
        setIsReachable(false);
      }
    };
    check();
    const timer = setInterval(check, pollMs);
    const appStateSubscription = AppState.addEventListener('change', s => {
      if (s === 'active') check();
    });
    return () => {
      clearInterval(timer);
      appStateSubscription?.remove?.();
    };
  }, [pollMs]);

  return isReachable;
}


