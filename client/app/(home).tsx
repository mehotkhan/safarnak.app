import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAppSelector } from '../redux/store';
import { useQuery } from '@apollo/client';
import { db } from '../db/database';
import { users } from '../db/schema';
import { eq } from 'drizzle-orm';
import { GET_MESSAGES_QUERY, ME_QUERY } from '../api/queries';

export default function HomeScreen() {
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  
  // Apollo queries
  const { data: messagesData, loading: messagesLoading, error: messagesError } = useQuery(GET_MESSAGES_QUERY, {
    skip: !isAuthenticated,
  });
  
  const { data: meData, loading: meLoading, error: meError } = useQuery(ME_QUERY, {
    skip: !isAuthenticated,
  });

  // Example Drizzle query for local data
  const getLocalUserData = async () => {
    if (user?.email) {
      try {
        const localUser = await db.select().from(users).where(eq(users.email, user.email)).limit(1);
        return localUser[0];
      } catch (error) {
        console.error('Error fetching local user:', error);
        return null;
      }
    }
    return null;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Safarnak!</Text>
      
      {isAuthenticated && user ? (
        <View style={styles.userInfo}>
          <Text style={styles.userText}>Hello, {user.name}!</Text>
          <Text style={styles.emailText}>Email: {user.email}</Text>
          
          {(messagesLoading || meLoading) && <Text>Loading data...</Text>}
          {(messagesError || meError) && (
            <Text style={styles.errorText}>
              Error: {messagesError?.message || meError?.message}
            </Text>
          )}
          {messagesData && (
            <Text style={styles.dataText}>
              Messages: {messagesData.getMessages.length} messages
            </Text>
          )}
          {meData && (
            <Text style={styles.dataText}>
              Server User: {meData.me?.name || 'Not authenticated'}
            </Text>
          )}
        </View>
      ) : (
        <Text style={styles.notLoggedIn}>Please log in to continue</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  userInfo: {
    alignItems: 'center',
  },
  userText: {
    fontSize: 18,
    marginBottom: 10,
  },
  emailText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  errorText: {
    color: 'red',
    marginTop: 10,
  },
  dataText: {
    fontSize: 12,
    marginTop: 10,
    textAlign: 'center',
  },
  notLoggedIn: {
    fontSize: 16,
    color: '#666',
  },
});
