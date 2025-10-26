import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import React, { useCallback, useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';

import { restoreUser, setLoading } from '../store/slices/authSlice';
import { useAppDispatch, useAppSelector } from '../store/hooks';
// Drizzle removed from client restore path; rely on AsyncStorage only

const USER_STORAGE_KEY = '@safarnak_user';

export default function AuthWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useAppDispatch();
  const { isAuthenticated, isLoading } = useAppSelector(state => state.auth);

  const checkAuthStatus = useCallback(async () => {
    try {
      // Restore from AsyncStorage only
      const savedUser = await AsyncStorage.getItem(USER_STORAGE_KEY);
      if (savedUser) {
        const userData = JSON.parse(savedUser);
        dispatch(
          restoreUser({
            user: userData.user || null,
            token: userData.token || 'local',
          })
        );
      } else {
        dispatch(setLoading(false));
      }
    } catch (error) {
      console.log('Error checking auth status:', error);
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        router.replace('/(tabs)');
      } else {
        router.replace('/auth/login' as any);
      }
    }
  }, [isAuthenticated, isLoading]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size='large' color='#2f95dc' />
      </View>
    );
  }

  return <>{children}</>;
}
