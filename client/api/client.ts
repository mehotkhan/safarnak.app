import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import AsyncStorage from '@react-native-async-storage/async-storage';

// GraphQL endpoint
// Development: Use your machine's local network IP so mobile devices can connect
// Production: Update with your deployed worker URL
const GRAPHQL_URI = __DEV__ 
  ? 'http://192.168.1.51:8787/graphql'  // Development - use your local network IP
  : 'https://your-production-worker.workers.dev/graphql'; // Production

console.log('🌐 Apollo Client Configuration:');
console.log('📡 GraphQL URI:', GRAPHQL_URI);
console.log('🔧 Development Mode:', __DEV__);

const httpLink = createHttpLink({
  uri: GRAPHQL_URI,
});

// Add request/response logging
const loggingLink = setContext((_, { headers }) => {
  console.log('📤 GraphQL Request Headers:', headers);
  return { headers };
});

const authLink = setContext(async (_, { headers }) => {
  console.log('🔐 Getting authentication token...');
  // Get the authentication token from AsyncStorage
  let token = null;
  try {
    const savedUser = await AsyncStorage.getItem('@safarnak_user');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      token = userData.token;
      console.log('🎫 Token found:', token ? 'YES' : 'NO');
    } else {
      console.log('🎫 No saved user found');
    }
  } catch (error) {
    console.log('❌ Error retrieving token:', error);
  }
  
  const authHeaders = {
    ...headers,
    authorization: token ? `Bearer ${token}` : "",
  };
  
  console.log('🔐 Final headers:', authHeaders);
  return { headers: authHeaders };
});

export const client = new ApolloClient({
  link: authLink.concat(loggingLink).concat(httpLink),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all',
    },
    query: {
      errorPolicy: 'all',
    },
  },
  // Add request/response logging
  onError: ({ networkError, graphQLErrors }) => {
    console.log('💥 Apollo Client Error:');
    if (graphQLErrors) {
      console.log('📊 GraphQL Errors:', graphQLErrors);
    }
    if (networkError) {
      console.log('🌐 Network Error:', networkError);
      console.log('🔗 Network Error Details:', JSON.stringify(networkError, null, 2));
    }
  },
});
