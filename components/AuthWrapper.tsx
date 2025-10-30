import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import React, { useCallback, useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';

import { restoreUser, setLoading } from '@store/slices/authSlice';
import { useAppDispatch, useAppSelector } from '@store/hooks';

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
        // Navigate to main app (feed)
        router.replace('/(app)/(feed)' as any);
      } else {
        router.replace('/(auth)/welcome' as any);
      }
    }
  }, [isAuthenticated, isLoading]);

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-white dark:bg-black">
        <ActivityIndicator size="large" color="#8b5cf6" />
      </View>
    );
  }

  return <>{children}</>;
}
