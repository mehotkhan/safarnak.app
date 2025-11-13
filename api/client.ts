/**
 * Apollo Client Configuration
 * 
 * Sets up Apollo Client with:
 * - GraphQL endpoint configuration
 * - Authentication link (Bearer token)
 * - Cache persistence via Drizzle ORM (unified storage)
 * - Automatic structured table sync (no manual sync needed!)
 */

// Use direct imports for better tree-shaking (reduces bundle size)
import { ApolloClient } from '@apollo/client/core/ApolloClient.js';
import { InMemoryCache } from '@apollo/client/cache/inmemory/inMemoryCache.js';
import { createHttpLink } from '@apollo/client/link/http/createHttpLink.js';
import { from } from '@apollo/client/link/core/from.js';
import { split } from '@apollo/client/link/core/split.js';
import { setContext } from '@apollo/client/link/context/index.js';
import { onError } from '@apollo/client/link/error/index.js';
import { getMainDefinition } from '@apollo/client/utilities/graphql/getFromAST.js';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions/index.js';
import { createClient } from 'graphql-ws';
import { persistCache } from 'apollo3-cache-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { drizzleCacheStorage } from './cache-storage';

// ============================================================================
// GraphQL URI Configuration
// ============================================================================

const getDevServerHost = (): string | null => {
  const hostUri: string | undefined = (Constants.expoConfig as any)?.hostUri || (Constants as any)?.manifest?.hostUri;
  if (!hostUri) return null;
  try {
    const url = new URL(`http://${hostUri}`);
    return url.hostname || null;
  } catch {
    const parts = hostUri.split(':');
    return parts[0] || null;
  }
};

const getGraphQLURI = (): string => {
  const fromExtras = Constants.expoConfig?.extra?.graphqlUrl as string | undefined;
  if (fromExtras) {
    console.log('📡 Using GraphQL URL from app.config.js:', fromExtras);
    return fromExtras;
  }

  const fromEnv = (process.env.EXPO_PUBLIC_GRAPHQL_URL_DEV || process.env.EXPO_PUBLIC_GRAPHQL_URL) as string | undefined;
  if (fromEnv) {
    console.log('📡 Using GraphQL URL from EXPO_PUBLIC env:', fromEnv);
    return fromEnv;
  }

  const maybeHost = __DEV__ ? getDevServerHost() : null;
  const fallbackHost = maybeHost || '127.0.0.1';
  const local = `http://${fallbackHost}:8787/graphql`;
  console.log('📡 Using derived fallback GraphQL URL:', local);
  return local;
};

export const GRAPHQL_URI = getGraphQLURI();

if (__DEV__) {
  console.log('📡 GraphQL URI:', GRAPHQL_URI);
}

export const GRAPHQL_URI_NORMALIZED = GRAPHQL_URI.replace(/\/+$/, '');

// Convert HTTP URL to WebSocket URL
const getWebSocketURI = (): string => {
  const httpUrl = GRAPHQL_URI_NORMALIZED;
  // Replace http:// with ws:// and https:// with wss://
  return httpUrl.replace(/^http/, 'ws');
};

export const GRAPHQL_WS_URI = getWebSocketURI();

// ============================================================================
// Apollo Client Setup
// ============================================================================

const httpLink = createHttpLink({
  uri: GRAPHQL_URI_NORMALIZED,
  fetch: async (uri: string, options?: RequestInit) => {
    try {
      const response = await fetch(uri, options);
      return response;
    } catch (error: any) {
      // Suppress "Network request failed" warnings when offline in dev mode
      if (__DEV__ && error?.message?.includes('Network request failed')) {
        console.debug('🌐 Network request failed (offline):', uri);
      }
      throw error;
    }
  },
});

// WebSocket client with lazy connection (connects only when first subscription is used)
const wsClient = createClient({
  url: GRAPHQL_WS_URI,
  lazy: true, // Don't connect until first subscription - this is the key for fast bootup!
  connectionParams: async () => {
    // Add auth token to WebSocket connection
    try {
      // Get token from AsyncStorage (stored by useAuth hook)
      const savedUser = await AsyncStorage.getItem('@safarnak_user');
      if (savedUser) {
        const userData = JSON.parse(savedUser);
        const token = userData.token;
        if (token) {
          return {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          };
        }
      }
    } catch (error) {
      if (__DEV__) {
        console.warn('⚠️ Error retrieving auth token for WebSocket:', error);
      }
    }
    return {};
  },
  shouldRetry: () => true,
  retryAttempts: Infinity,
  retryWait: async (retries: number) => {
    const delay = 1000 * Math.min(retries + 1, 5);
    await new Promise(resolve => setTimeout(resolve, delay));
  },
  on: {
    opened: () => {},
    closed: (event: any) => {
      if (__DEV__) {
        // Only log unexpected closes (code 1000 is normal closure)
        const code = event?.code;
        if (code !== 1000 && code !== 1001) {
          console.warn('📡 WebSocket connection closed unexpectedly:', code, event?.reason || '');
        }
      }
    },
    error: (error: any) => {
      // WebSocket errors are common during connection attempts and retries
      // Only log meaningful errors, not generic connection failures
      if (__DEV__) {
        const errorMessage = error?.message || String(error);
        const errorType = error?.type || '';
        
        // Suppress common connection errors that are expected during retries
        if (
          !errorMessage.includes('connection') &&
          !errorMessage.includes('ECONNREFUSED') &&
          !errorMessage.includes('Network') &&
          errorType !== 'error'
        ) {
          console.warn('📡 WebSocket error:', errorMessage);
        }
      }
    },
  },
});

const wsLink = new GraphQLWsLink(wsClient);

// Split link: HTTP for queries/mutations, WebSocket for subscriptions
// The lazy: true option above ensures no connection until first subscription
const splitLink = split(
  ({ query }: any) => {
    const definition = getMainDefinition(query);
    return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
  },
  wsLink,
  httpLink
);

const authLink = setContext(async (_, { headers }) => {
  try {
    // Get token from AsyncStorage (stored by useAuth hook)
    const savedUser = await AsyncStorage.getItem('@safarnak_user');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      const token = userData.token;
      if (token) {
        return {
          headers: {
            ...headers,
            authorization: `Bearer ${token}`,
          },
        };
      }
    }
  } catch (error) {
    if (__DEV__) {
      console.warn('⚠️ Error retrieving auth token:', error);
    }
  }
  return { headers };
});

/**
 * Error Link - Suppresses network errors when offline/backend unreachable
 */
const errorLink = onError(({ graphQLErrors, networkError, operation }: any) => {
  // Suppress network errors when offline (expected behavior)
  if (networkError) {
    const isNetworkFailure = 
      networkError.message?.includes('Network request failed') ||
      networkError.message?.includes('Failed to fetch') ||
      networkError.message?.includes('NetworkError') ||
      networkError.name === 'NetworkError' ||
      networkError.message?.includes('TypeError');
    
    if (isNetworkFailure) {
      // Suppress the error - errorPolicy: 'all' allows partial data
      // This prevents Apollo from throwing uncaught promise rejections
      if (__DEV__) {
        console.debug('🌐 Network request failed (offline/unreachable):', operation?.operationName);
      }
      // Error is handled by errorPolicy: 'all', no need to throw
      return;
    }
  }
  
  // Log GraphQL errors in dev mode (but don't suppress them)
  if (graphQLErrors && __DEV__) {
    graphQLErrors.forEach((error: any) => {
      console.warn(`[GraphQL error]: Message: ${error.message}, Location: ${error.locations}, Path: ${error.path}`);
    });
  }
});

const cache = new InMemoryCache();

export const client = new ApolloClient({
  link: from([errorLink, authLink, splitLink]),
  cache,
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
      errorPolicy: 'all',
    },
    query: {
      fetchPolicy: 'cache-first',
      errorPolicy: 'all',
    },
    mutate: {
      errorPolicy: 'all',
    },
  },
});

// Lazy cache persistence initialization
// Deferred to avoid blocking app bootup
let cachePersistenceInitialized = false;
let cachePersistencePromise: Promise<void> | null = null;

export async function initializeCachePersistence(): Promise<void> {
  if (cachePersistenceInitialized) return;
  if (cachePersistencePromise) return cachePersistencePromise;
  
  cachePersistencePromise = (async () => {
    try {
      if (Platform.OS !== 'web') {
        try {
          // Use Drizzle cache storage - automatically syncs to structured tables
          await persistCache({
            cache,
            storage: drizzleCacheStorage,
            maxSize: 1024 * 1024 * 10, // 10MB cache size limit
            serialize: true,
            debug: false,
          });
          
          if (__DEV__) {
            console.log('✅ Apollo cache persistence initialized');
          }
        } catch (drizzleError) {
          if (__DEV__) {
            console.warn('⚠️ Drizzle cache persistence failed, falling back to AsyncStorage:', drizzleError);
          }
          try {
            // Fallback to AsyncStorage if Drizzle fails
            await persistCache({
              cache,
              storage: AsyncStorage,
              maxSize: 1024 * 1024 * 2, // 2MB for AsyncStorage
              serialize: true,
            });
            if (__DEV__) {
              console.log('✅ Apollo cache persistence via AsyncStorage initialized');
            }
          } catch (asyncError) {
            if (__DEV__) {
              console.error('❌ Failed to persist cache with AsyncStorage:', asyncError);
            }
          }
        }
      } else {
        // Web platform: use AsyncStorage directly
        await persistCache({
          cache,
          storage: AsyncStorage,
          maxSize: 1024 * 1024 * 2,
          serialize: true,
        });
      }
      cachePersistenceInitialized = true;
    } catch (error) {
      if (__DEV__) {
        console.error('❌ Failed to initialize cache persistence:', error);
      }
    }
  })();
  
  return cachePersistencePromise;
}

// Initialize cache persistence after a delay to avoid blocking app bootup
if (Platform.OS !== 'web') {
  setTimeout(() => {
    initializeCachePersistence().catch(() => {
      // Silently fail - cache persistence is optional
    });
  }, 2000); // 2 second delay
}
