import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import React, { useCallback, useEffect, useRef } from 'react';
import { ActivityIndicator, View } from 'react-native';

import { restoreUser, setLoading } from '@state/slices/authSlice';
import { useAppDispatch, useAppSelector } from '@state/hooks';

const USER_STORAGE_KEY = '@safarnak_user';
const DEVICE_KEY_PAIR_KEY = '@safarnak_device_keypair';
const USERNAME_KEY = '@safarnak_username';

export default function AuthWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useAppDispatch();
  const { isAuthenticated, isLoading, user } = useAppSelector(state => state.auth);
  const hasRedirected = useRef(false);

  const checkAuthStatus = useCallback(async () => {
    try {
      // Check AsyncStorage for user data and token
      const savedUser = await AsyncStorage.getItem(USER_STORAGE_KEY);
      if (savedUser) {
        const userData = JSON.parse(savedUser);
        
        // Load device key pair if available
        let deviceKeyPair = null;
        try {
          const storedKeyPair = await AsyncStorage.getItem(DEVICE_KEY_PAIR_KEY);
          if (storedKeyPair) {
            deviceKeyPair = JSON.parse(storedKeyPair);
          }
        } catch (err) {
          console.warn('[AuthWrapper] Failed to load device key pair:', err);
        }

        dispatch(
          restoreUser({
            user: userData.user || null,
            token: userData.token || null,
            deviceKeyPair: deviceKeyPair || undefined,
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

  // Only redirect on initial auth check, not when user data updates
  useEffect(() => {
    if (!isLoading && !hasRedirected.current) {
      hasRedirected.current = true;
      
      // Small delay to ensure navigator is ready
      const timer = setTimeout(() => {
        // Check if user is authenticated AND active
        if (isAuthenticated && user && user.status === 'active') {
          // Navigate to main app (home) - only on initial load
          router.replace('/(app)/(home)' as any);
        } else {
          // Check if user has stored username
          AsyncStorage.getItem(USERNAME_KEY).then(() => {
            // Always go to unified welcome screen (handles both new and returning users)
            router.replace('/(auth)/welcome' as any);
          }).catch(() => {
            // On error, default to welcome
            router.replace('/(auth)/welcome' as any);
          });
        }
      }, 100); // Small delay to ensure navigator is mounted
      
      return () => {
        clearTimeout(timer);
      };
    }
    // Return undefined if condition not met
    return undefined;
  }, [isLoading, isAuthenticated, user]); // Include dependencies but only redirect once

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-white dark:bg-black">
        <ActivityIndicator size="large" color="#8b5cf6" />
      </View>
    );
  }

  return <>{children}</>;
}
