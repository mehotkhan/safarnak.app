/**
 * WebSocket Connection Monitor Hook
 * 
 * Monitors WebSocket connection state and automatically reconnects
 * when network connectivity is restored.
 */

import { useEffect, useState } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { getWebSocketState, reconnectWebSocket, getActiveSubscriptionsCount } from '@/api/client';

export function useWebSocketMonitor() {
  const [connectionState, setConnectionState] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected');
  const [activeSubscriptions, setActiveSubscriptions] = useState(0);

  useEffect(() => {
    // Poll connection state every 2 seconds
    const interval = setInterval(() => {
      setConnectionState(getWebSocketState());
      setActiveSubscriptions(getActiveSubscriptionsCount());
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Listen for network state changes
    const unsubscribe = NetInfo.addEventListener(state => {
      const isConnected = state.isConnected && state.isInternetReachable !== false;
      
      if (isConnected) {
        // Network is back, check if we need to reconnect
        const wsState = getWebSocketState();
        const activeSubs = getActiveSubscriptionsCount();
        
        if (wsState === 'disconnected' && activeSubs > 0) {
          console.log('📡 Network restored, reconnecting WebSocket...');
          // Wait a bit for network to stabilize
          setTimeout(() => {
            reconnectWebSocket();
          }, 1000);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  return {
    connectionState,
    activeSubscriptions,
    reconnect: reconnectWebSocket,
  };
}

