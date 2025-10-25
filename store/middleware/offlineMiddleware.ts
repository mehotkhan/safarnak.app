import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

import { client } from '../../api';

const queueKey = 'offlineMutations';

async function queueMutation(mutation: any) {
  const queue = JSON.parse((await AsyncStorage.getItem(queueKey)) || '[]');
  queue.push(mutation);
  await AsyncStorage.setItem(queueKey, JSON.stringify(queue));
  // Optionally perform local optimistic updates here via Redux
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function _processQueue() {
  const queue = JSON.parse((await AsyncStorage.getItem(queueKey)) || '[]');
  for (const mutation of queue) {
    try {
      await client.mutate(mutation);
      // Sync back to Drizzle if needed
    } catch {
      // Retry logic
    }
  }
  await AsyncStorage.removeItem(queueKey);
}

export const offlineMiddleware =
  (_store: any) => (next: any) => (action: any) => {
    if (action.meta?.offline && action.type.includes('mutation')) {
      NetInfo.fetch().then(state => {
        if (!state.isConnected) {
          queueMutation(action.payload);
        } else {
          next(action);
        }
      });
    } else {
      next(action);
    }
  };

// In _layout.tsx or useEffect: NetInfo.addEventListener((state) => { if (state.isConnected) processQueue(); });
