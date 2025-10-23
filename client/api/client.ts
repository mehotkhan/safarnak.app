import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import AsyncStorage from '@react-native-async-storage/async-storage';

// GraphQL endpoint
const GRAPHQL_URI = __DEV__ 
  ? 'http://192.168.1.51:8787/graphql'  // Development - use your local network IP
  : 'https://your-production-worker.workers.dev/graphql'; // Production

const httpLink = createHttpLink({
  uri: GRAPHQL_URI,
});

const authLink = setContext(async (_, { headers }) => {
  // Get the authentication token from AsyncStorage
  let token = null;
  try {
    const savedUser = await AsyncStorage.getItem('@safarnak_user');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      token = userData.token;
    }
  } catch (error) {
    console.error('Error retrieving token:', error);
  }
  
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  };
});

export const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all',
    },
    query: {
      errorPolicy: 'all',
    },
    mutate: {
      errorPolicy: 'all',
    },
  },
});
