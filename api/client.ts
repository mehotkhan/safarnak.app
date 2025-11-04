/**
 * Apollo Client Configuration
 * 
 * Sets up Apollo Client with:
 * - GraphQL endpoint configuration
 * - Authentication link (Bearer token)
 * - Cache persistence (SQLite on native, AsyncStorage on web)
 * - Automatic Drizzle sync for offline support
 */

import { ApolloClient, InMemoryCache, createHttpLink, from, split } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { getMainDefinition } from '@apollo/client/utilities';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import { persistCache } from 'apollo3-cache-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import type { PersistentStorage } from 'apollo3-cache-persist';

// ============================================================================
// SQLite Storage Adapter (merged from sqlite-storage.ts)
// ============================================================================

// Lazy import SQLite to avoid native module errors during module resolution
let SQLite: any = null;

const getSQLite = async (): Promise<any | null> => {
  if (SQLite !== null) {
    return SQLite;
  }

  if (SQLite === null && Platform.OS === 'web') {
    return null;
  }

  try {
    const module = await import('expo-sqlite');
    
    if (!module || typeof (module as any).openDatabaseAsync !== 'function') {
      console.warn('⚠️ expo-sqlite module loaded but openDatabaseAsync function not available');
      SQLite = null;
      return null;
    }
    
    SQLite = module;
    return SQLite;
  } catch (error: any) {
    SQLite = null;
    const errorMsg = error?.message || String(error);
    if (__DEV__) {
      console.warn('⚠️ Failed to load expo-sqlite. SQLite storage will not be available:', errorMsg);
    }
    return null;
  }
};

/**
 * SQLite storage adapter for Apollo Cache Persistence
 * Stores Apollo's normalized cache in SQLite for better performance and queryability
 */
class SQLiteStorage implements PersistentStorage<string> {
  private db: any = null;
  private initialized = false;
  private initPromise: Promise<void> | null = null;
  private available = true;

  private async ensureInitialized(): Promise<void> {
    if (!this.available) return;
    if (this.initialized && this.db) return;
    if (this.initPromise) {
      await this.initPromise;
      return;
    }
    this.initPromise = this._initialize();
    await this.initPromise;
  }

  private async _initialize(): Promise<void> {
    if (Platform.OS === 'web') {
      this.available = false;
      return;
    }

    try {
      const SQLiteModule = await getSQLite();
      
      if (!SQLiteModule || typeof SQLiteModule.openDatabaseAsync !== 'function') {
        if (__DEV__) {
          console.warn('⚠️ expo-sqlite native module not available. SQLite storage disabled.');
        }
        this.available = false;
        this.initialized = false;
        this.db = null;
        return;
      }
      
      try {
        this.db = await SQLiteModule.openDatabaseAsync('apollo_cache.db');
      } catch (dbError: any) {
        console.warn('⚠️ Failed to open SQLite database:', dbError?.message || dbError);
        this.available = false;
        this.initialized = false;
        this.db = null;
        return;
      }

      if (!this.db || typeof this.db.execAsync !== 'function') {
        if (__DEV__) {
          console.warn('⚠️ SQLite database object invalid. SQLite storage disabled.');
        }
        this.available = false;
        this.initialized = false;
        this.db = null;
        return;
      }

      try {
        await this.db.execAsync(`
          CREATE TABLE IF NOT EXISTS apollo_cache (
            key TEXT PRIMARY KEY NOT NULL,
            value TEXT NOT NULL,
            updated_at INTEGER DEFAULT (strftime('%s', 'now'))
          );
          CREATE INDEX IF NOT EXISTS idx_updated_at ON apollo_cache(updated_at);
        `);

        this.initialized = true;
        if (__DEV__) {
          console.log('✅ Apollo SQLite cache initialized');
        }
      } catch (execError: any) {
        if (__DEV__) {
          console.warn('⚠️ Failed to create SQLite cache table:', execError?.message || execError);
        }
        this.available = false;
        this.initialized = false;
        this.db = null;
        return;
      }
    } catch (error: any) {
      if (__DEV__) {
        console.warn('⚠️ Failed to initialize Apollo SQLite cache:', error?.message || error);
      }
      this.available = false;
      this.initialized = false;
      this.db = null;
    }
  }

  async getItem(key: string): Promise<string | null> {
    if (!this.available) return null;
    try {
      await this.ensureInitialized();
      if (!this.db) return null;
      const result = await this.db.getFirstAsync(
        'SELECT value FROM apollo_cache WHERE key = ?',
        [key]
      ) as { value: string } | undefined;
      return result?.value ?? null;
    } catch (error) {
      console.error(`Error getting item ${key}:`, error);
      return null;
    }
  }

  async setItem(key: string, value: string): Promise<void> {
    if (!this.available) return;
    try {
      await this.ensureInitialized();
      if (!this.db) return;
      await this.db.runAsync(
        'INSERT OR REPLACE INTO apollo_cache (key, value, updated_at) VALUES (?, ?, strftime("%s", "now"))',
        [key, value]
      );
    } catch (error) {
      console.error(`Error setting item ${key}:`, error);
    }
  }

  async removeItem(key: string): Promise<void> {
    if (!this.available) return;
    try {
      await this.ensureInitialized();
      if (!this.db) return;
      await this.db.runAsync('DELETE FROM apollo_cache WHERE key = ?', [key]);
    } catch (error) {
      console.error(`Error removing item ${key}:`, error);
    }
  }

  async getAllKeys(): Promise<string[]> {
    if (!this.available) return [];
    try {
      await this.ensureInitialized();
      if (!this.db) return [];
      const results = await this.db.getAllAsync(
        'SELECT key FROM apollo_cache'
      ) as Array<{ key: string }>;
      return results.map((row: { key: string }) => row.key);
    } catch (error) {
      console.error('Error getting all keys:', error);
      return [];
    }
  }

  async queryCache(query: string, params: any[] = []): Promise<any[]> {
    if (!this.available) return [];
    try {
      await this.ensureInitialized();
      if (!this.db) return [];
      return await this.db.getAllAsync(query, params);
    } catch (error) {
      console.error('Error querying cache:', error);
      return [];
    }
  }

  async getCacheSize(): Promise<number> {
    if (!this.available) return 0;
    try {
      await this.ensureInitialized();
      if (!this.db) return 0;
      const result = await this.db.getFirstAsync(
        'SELECT SUM(LENGTH(value)) as total_size FROM apollo_cache'
      ) as { total_size: number } | undefined;
      return result?.total_size ?? 0;
    } catch (error) {
      console.error('Error getting cache size:', error);
      return 0;
    }
  }

  async clearOldEntries(daysOld: number = 7): Promise<number> {
    if (!this.available) return 0;
    try {
      await this.ensureInitialized();
      if (!this.db) return 0;
      const cutoffTime = Math.floor(Date.now() / 1000) - (daysOld * 24 * 60 * 60);
      const result = await this.db.runAsync(
        'DELETE FROM apollo_cache WHERE updated_at < ?',
        [cutoffTime]
      );
      return result.changes ?? 0;
    } catch (error) {
      if (__DEV__) {
        console.error('Error clearing old entries:', error);
      }
      return 0;
    }
  }

  async clearAll(): Promise<void> {
    if (!this.available) return;
    try {
      await this.ensureInitialized();
      if (!this.db) return;
      await this.db.runAsync('DELETE FROM apollo_cache');
      this.initialized = false;
      this.db = null;
    } catch (error) {
      if (__DEV__) {
        console.error('Error clearing all cache:', error);
      }
      this.initialized = false;
      this.db = null;
    }
  }
}

export const sqliteStorage = new SQLiteStorage();

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

if (__DEV__) {
  console.log('📡 GraphQL WebSocket URI:', GRAPHQL_WS_URI);
}

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

// WebSocket link for subscriptions
const wsLink = new GraphQLWsLink(
  createClient({
    url: GRAPHQL_WS_URI,
    connectionParams: async () => {
      // Add auth token to WebSocket connection
      try {
        const savedUser = await AsyncStorage.getItem('@safarnak_user');
        if (savedUser) {
          const userData = JSON.parse(savedUser);
          const token = userData.token;
          if (token) {
            return {
              authorization: `Bearer ${token}`,
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
      opened: () => {
        if (__DEV__) {
          console.log('📡 WebSocket connection opened');
        }
      },
      closed: (event: any) => {
        if (__DEV__) {
          // Only log unexpected closes (code 1000 is normal closure)
          const code = event?.code;
          if (code !== 1000 && code !== 1001) {
            console.warn('📡 WebSocket connection closed unexpectedly:', code, event?.reason || '');
          } else {
            console.log('📡 WebSocket connection closed');
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
          } else {
            // Log as debug for connection-related errors (expected during retries)
            console.debug('📡 WebSocket connection error (will retry):', errorMessage);
          }
        }
      },
    },
  })
);

// Split link: HTTP for queries/mutations, WebSocket for subscriptions
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

// Initialize cache persistence and Drizzle sync in the background (non-blocking)
(async () => {
  try {
    if (Platform.OS !== 'web') {
      try {
        await persistCache({
          cache,
          storage: sqliteStorage,
          maxSize: 1024 * 1024 * 10, // 10MB cache size limit
          serialize: true,
          debug: false,
        });
        
        try {
          const { syncApolloToDrizzle } = await import('@database/client');
          
          const normalizedCache = cache.extract();
          if (Object.keys(normalizedCache).length > 0) {
            await syncApolloToDrizzle(normalizedCache);
            if (__DEV__) {
              console.log('✅ Initial Apollo → Drizzle sync completed');
            }
          }
          
          if (__DEV__) {
            console.log('✅ Apollo → Drizzle sync ready');
          }
        } catch (syncInitError) {
          if (__DEV__) {
            console.warn('⚠️ Drizzle sync initialization failed:', syncInitError);
          }
        }
      } catch (sqliteError) {
        if (__DEV__) {
          console.warn('⚠️ SQLite persistence failed, falling back to AsyncStorage:', sqliteError);
        }
        try {
          await persistCache({
            cache,
            storage: AsyncStorage,
            maxSize: 1024 * 1024 * 2, // 2MB for AsyncStorage
            serialize: true,
          });
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
  } catch (error) {
    if (__DEV__) {
      console.error('❌ Failed to initialize cache persistence:', error);
    }
  }
})();
