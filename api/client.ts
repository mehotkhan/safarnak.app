import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

// Get GraphQL URL from environment variables or fallback to defaults
const getGraphQLURI = (): string => {
  // Check if we have environment variables from EAS build
  const envGraphQLUrl = Constants.expoConfig?.extra?.graphqlUrl;
  if (envGraphQLUrl) {
    console.log('Using EAS GraphQL URL:', envGraphQLUrl);
    return envGraphQLUrl;
  }

  // Fallback to development/production detection
  if (process.env.NODE_ENV === 'development') {
    // Development - use your local network IP
    console.log('Using development GraphQL URL');
    return 'http://192.168.1.51:8787/graphql';
  } else {
    // Production - use your custom domain
    console.log('Using production GraphQL URL');
    return 'https://safarnak.mohet.ir/graphql';
  }
};

const GRAPHQL_URI = getGraphQLURI();

console.log('GraphQL URI:', GRAPHQL_URI);

const httpLink = createHttpLink({
  uri: GRAPHQL_URI,
  // Add timeout and error handling for production
  fetchOptions: {
    timeout: 30000, // 30 second timeout
  },
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
      authorization: token ? `Bearer ${token}` : '',
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
