import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

import { client } from '@api';
import { checkBackendReachable } from '@hooks/useGraphBackendReachable';

const queueKey = 'offlineMutations';

/**
 * Queue mutation for offline processing
 * Mutations are stored in AsyncStorage and processed when connection is restored
 * Apollo's SQLite cache handles data persistence automatically
 */
export async function enqueueOfflineMutation(mutation: any) {
  try {
    const queue = JSON.parse((await AsyncStorage.getItem(queueKey)) || '[]');
    queue.push({
      ...mutation,
      queuedAt: Date.now(),
    });
    await AsyncStorage.setItem(queueKey, JSON.stringify(queue));
    if (__DEV__) {
      console.log('📦 Mutation queued for offline processing:', mutation.operationName);
    }
  } catch (error) {
    if (__DEV__) {
      console.error('❌ Failed to queue mutation:', error);
    }
  }
}

/**
 * Check if we're online and backend is reachable
 */
async function isBackendAvailable(): Promise<boolean> {
  try {
    const net = await NetInfo.fetch();
    if (!net.isConnected) {
      return false;
    }
    // Also check if backend is actually reachable
    return await checkBackendReachable();
  } catch {
    return false;
  }
}

/**
 * Process queued mutations when connection is restored
 * Integrated with Apollo's cache system - mutations sync automatically
 */
export async function processQueue(): Promise<void> {
  try {
    // Check if backend is available before processing
    const isAvailable = await isBackendAvailable();
    if (!isAvailable) {
      if (__DEV__) {
        console.log('⏸️ Backend not available, skipping queue processing');
      }
      return;
    }

    const queue = JSON.parse((await AsyncStorage.getItem(queueKey)) || '[]');
    if (queue.length === 0) return;

    if (__DEV__) {
      console.log(`🔄 Processing ${queue.length} queued mutations...`);
    }
    
    const processed: number[] = [];
    for (let i = 0; i < queue.length; i++) {
      const mutation = queue[i];
      
      // Check backend availability before each mutation
      const stillAvailable = await isBackendAvailable();
      if (!stillAvailable) {
        if (__DEV__) {
          console.log('⏸️ Backend became unavailable, stopping queue processing');
        }
        break;
      }

      try {
        await client.mutate(mutation);
        processed.push(i);
        if (__DEV__) {
          console.log(`✅ Processed mutation: ${mutation.operationName || 'unknown'}`);
        }
      } catch (error) {
        if (__DEV__) {
          console.warn(`⚠️ Failed to process mutation ${i}:`, error);
        }
        // Check if it's a network error vs other error
        const isNetworkError = (error as any)?.networkError || (error as any)?.code === 'NETWORK_ERROR';
        if (isNetworkError) {
          // Network error means backend might be down, stop processing
          if (__DEV__) {
            console.log('⏸️ Network error detected, stopping queue processing');
          }
          break;
        }
        // For other errors, keep the mutation in queue for retry
      }
    }

    // Remove successfully processed mutations
    const remaining = queue.filter((_: any, index: number) => !processed.includes(index));
    if (remaining.length > 0) {
      await AsyncStorage.setItem(queueKey, JSON.stringify(remaining));
      if (__DEV__) {
        console.log(`📦 ${remaining.length} mutations remaining in queue`);
      }
    } else {
      await AsyncStorage.removeItem(queueKey);
      if (__DEV__) {
        console.log('✅ All mutations processed successfully');
      }
    }
  } catch (error) {
    if (__DEV__) {
      console.error('❌ Error processing queue:', error);
    }
  }
}

/**
 * Redux middleware for offline mutation queuing
 * Works alongside Apollo's SQLite cache for complete offline support
 * 
 * Usage: Add meta: { offline: true } to actions that should be queued when offline
 */
export const offlineMiddleware =
  (_store: any) => (next: any) => (action: any) => {
    if (action.meta?.offline && action.type.includes('mutation')) {
      // Check both network connectivity and backend reachability
      isBackendAvailable().then(available => {
        if (!available) {
          // Queue mutation for later processing when backend becomes available
          enqueueOfflineMutation(action.payload);
          // Still dispatch action for optimistic UI updates
          // Apollo cache will persist the optimistic update to SQLite
          next(action);
        } else {
          // Backend is available: process immediately
          next(action);
        }
      });
    } else {
      next(action);
    }
  };
