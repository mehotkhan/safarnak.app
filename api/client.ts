import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

// Attempt to infer the LAN host used by Metro/Expo for better dev defaults
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

// Get GraphQL URL from environment variables or fallback to sensible dev defaults
const getGraphQLURI = (): string => {
  // Preferred: value embedded by app.config.js extras
  const fromExtras = Constants.expoConfig?.extra?.graphqlUrl as string | undefined;
  if (fromExtras) {
    console.log('📡 Using GraphQL URL from app.config.js:', fromExtras);
    return fromExtras;
  }

  // Secondary: EXPO_PUBLIC_* envs (Expo inlines these at build time)
  const fromEnv = (process.env.EXPO_PUBLIC_GRAPHQL_URL_DEV || process.env.EXPO_PUBLIC_GRAPHQL_URL) as string | undefined;
  if (fromEnv) {
    console.log('📡 Using GraphQL URL from EXPO_PUBLIC env:', fromEnv);
    return fromEnv;
  }

  // Dev fallback: derive from Metro host if available, else localhost
  const maybeHost = __DEV__ ? getDevServerHost() : null;
  const fallbackHost = maybeHost || '127.0.0.1';
  const local = `http://${fallbackHost}:8787/graphql`;
  console.log('📡 Using derived fallback GraphQL URL:', local);
  return local;
};

export const GRAPHQL_URI = getGraphQLURI();

console.log('GraphQL URI:', GRAPHQL_URI);

// Normalize dev URIs to reachable hosts across simulators/emulators/devices
const normalizeDevUri = (uri: string) => {
  try {
    if (!__DEV__) return uri;
    const u = new URL(uri);

    // If Expo uses special 198.18.0.1 host, prefer LAN host if known
    const devHost = getDevServerHost();
    if (u.hostname === '198.18.0.1' && devHost) {
      u.hostname = devHost;
      return u.toString();
    }

    // Localhost handling
    const isLocal = u.hostname === '127.0.0.1' || u.hostname === 'localhost';
    if (!isLocal) return uri;

    if (Platform.OS === 'android') {
      // Android emulator loopback
      u.hostname = '10.0.2.2';
      return u.toString();
    }

    // On physical devices (Expo Go), replace with LAN host if available
    if (devHost && Platform.OS !== 'web') {
      u.hostname = devHost;
      return u.toString();
    }
  } catch {
    return uri;
  }
  return uri;
};

export const GRAPHQL_URI_NORMALIZED = normalizeDevUri(GRAPHQL_URI);

const httpLink = createHttpLink({
  uri: GRAPHQL_URI_NORMALIZED,
  // Add error handling
  fetch: (uri, options) => {
    console.log('GraphQL Request:', { uri, options });
    return fetch(uri, options).catch(error => {
      console.error('GraphQL Network Error:', error);
      throw error;
    });
  },
});

const authLink = setContext(async (_, { headers }) => {
  // Get the authentication token from AsyncStorage
  let token = null;
  let userId = null as string | null;
  try {
    const savedUser = await AsyncStorage.getItem('@safarnak_user');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      token = userData.token;
      userId = userData.user?.id?.toString?.() ?? null;
    }
  } catch (error) {
    console.error('Error retrieving token:', error);
  }

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
      'x-user-id': userId ?? '',
    },
  };
});

export const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all',
      fetchPolicy: 'network-only', // Always try network first
    },
    query: {
      errorPolicy: 'all',
      fetchPolicy: 'network-only', // Always try network first
    },
    mutate: {
      errorPolicy: 'all',
    },
  },
});
