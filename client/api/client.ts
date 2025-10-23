import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

// Get GraphQL URL from environment variables or fallback to defaults
const getGraphQLURI = (): string => {
  // Check if we have environment variables from EAS build
  const envGraphQLUrl = Constants.expoConfig?.extra?.GRAPHQL_URL;
  if (envGraphQLUrl) {
    return envGraphQLUrl;
  }
  
  // Fallback to development/production detection
  if (__DEV__) {
    // Development - use your local network IP
    return 'http://192.168.1.51:8787/graphql';
  } else {
    // Production - use your custom domain
    return 'https://safarnak.mohet.ir/graphql';
  }
};

const GRAPHQL_URI = getGraphQLURI();

console.log('GraphQL URI:', GRAPHQL_URI);

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
