import { useEffect, useState } from 'react';
import { AppState } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { GRAPHQL_URI_NORMALIZED } from '@api/client';

/**
 * Check if GraphQL backend is reachable by sending a simple introspection query
 * GraphQL endpoints don't respond to HEAD requests, so we need to send a POST with a query
 */
export async function checkBackendReachable(): Promise<boolean> {
  try {
    const net = await NetInfo.fetch();
    if (!net.isConnected) {
      return false;
    }

    // Send a simple GraphQL query to check if backend is reachable
    // Using __typename query which is lightweight and always available
    const response = await fetch(GRAPHQL_URI_NORMALIZED, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: '{ __typename }',
      }),
      // Add timeout to avoid hanging (using AbortController for React Native compatibility)
      signal: (() => {
        const controller = new AbortController();
        setTimeout(() => controller.abort(), 5000); // 5 second timeout
        return controller.signal;
      })(),
    });

    return response.ok;
  } catch (error: any) {
    // Handle timeout, network errors, etc. (silently in production)
    if (__DEV__) {
      if (error?.name === 'AbortError' || error?.name === 'TimeoutError') {
        console.warn('⚠️ Backend reachability check timed out');
      } else {
        console.warn('⚠️ Backend reachability check failed:', error?.message || error);
      }
    }
    return false;
  }
}

export function useGraphBackendReachable(pollMs: number = 15000) {
  const [isReachable, setIsReachable] = useState<boolean>(true);

  useEffect(() => {
    const check = async () => {
      const reachable = await checkBackendReachable();
      setIsReachable(reachable);
    };

    // Check immediately
    check();

    // Then check periodically
    const timer = setInterval(check, pollMs);

    // Check when app comes to foreground
    const appStateSubscription = AppState.addEventListener('change', s => {
      if (s === 'active') {
        check();
      }
    });

    return () => {
      clearInterval(timer);
      appStateSubscription?.remove?.();
    };
  }, [pollMs]);

  return isReachable;
}


