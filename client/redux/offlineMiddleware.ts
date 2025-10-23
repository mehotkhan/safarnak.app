import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { client } from '../api/client'; // Apollo

const queueKey = 'offlineMutations';

async function queueMutation(mutation: any) {
  let queue = JSON.parse(await AsyncStorage.getItem(queueKey) || '[]');
  queue.push(mutation);
  await AsyncStorage.setItem(queueKey, JSON.stringify(queue));
  // Optionally perform local optimistic updates here via Redux
}

async function processQueue() {
  const queue = JSON.parse(await AsyncStorage.getItem(queueKey) || '[]');
  for (const mutation of queue) {
    try {
      await client.mutate(mutation);
      // Sync back to Drizzle if needed
    } catch (error) {
      // Retry logic
    }
  }
  await AsyncStorage.removeItem(queueKey);
}

export const offlineMiddleware = (store: any) => (next: any) => (action: any) => {
  if (action.meta?.offline && action.type.includes('mutation')) {
    NetInfo.fetch().then((state) => {
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
