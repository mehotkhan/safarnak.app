/**
 * API Utilities
 * 
 * Contains all utility functions, types, and helpers for API operations.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { client } from './client';
import { drizzleCacheStorage } from './cache-storage';

// ============================================================================
// Types & Interfaces
// ============================================================================

export interface ApiError {
  message: string;
  code?: string;
  extensions?: Record<string, any>;
}

export interface ApiResponse<T> {
  data?: T;
  errors?: ApiError[];
  loading: boolean;
}

export interface AuthTokens {
  token: string;
  refreshToken?: string;
}

export interface ApiConfig {
  timeout: number;
  retryAttempts: number;
  retryDelay: number;
}

export const DEFAULT_API_CONFIG: ApiConfig = {
  timeout: 30000,
  retryAttempts: 3,
  retryDelay: 1000,
};

// ============================================================================
// Storage Utilities
// ============================================================================

const USER_STORAGE_KEY = '@safarnak_user';
const QUEUE_STORAGE_KEY = 'offlineMutations';
const PERSIST_ROOT_KEY = 'persist:root';

export const getStoredToken = async (): Promise<string | null> => {
  try {
    const savedUser = await AsyncStorage.getItem(USER_STORAGE_KEY);
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      return userData.token || null;
    }
  } catch (error) {
    console.error('Error retrieving token:', error);
  }
  return null;
};

export const storeUserData = async (
  user: any,
  token: string
): Promise<void> => {
  try {
    await AsyncStorage.setItem(
      USER_STORAGE_KEY,
      JSON.stringify({ user, token })
    );
  } catch (error) {
    console.error('Error storing user data:', error);
    throw error;
  }
};

export const clearUserData = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(USER_STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing user data:', error);
    throw error;
  }
};

// ============================================================================
// Error Handling Utilities
// ============================================================================

export const formatApiError = (error: any): ApiError => {
  if (error.extensions?.originalError?.message) {
    return {
      message: error.extensions.originalError.message,
      code: error.extensions.code,
      extensions: error.extensions,
    };
  }

  return {
    message: error.message || 'An unknown error occurred',
    code: error.code,
    extensions: error.extensions,
  };
};

export const isNetworkError = (error: any): boolean => {
  return error.networkError || error.message?.includes('Network');
};

export const shouldRetryRequest = (error: any, attempt: number): boolean => {
  if (attempt >= 3) return false;
  return isNetworkError(error) || error.message?.includes('timeout');
};

// ============================================================================
// Logout & Data Clearing
// ============================================================================

/**
 * Comprehensive logout function that clears all user data:
 * - SecureStore (jwtToken, username, privateKey)
 * - AsyncStorage (user data, offline queue, Redux persist)
 * - SQLite cache (Apollo cache)
 * - Apollo Client cache (in-memory)
 * - All logs and persisted state
 */
export async function clearAllUserData(): Promise<void> {
  try {
    // Clear SecureStore items (biometric auth tokens)
    try {
      await SecureStore.deleteItemAsync('jwtToken');
      await SecureStore.deleteItemAsync('username');
      await SecureStore.deleteItemAsync('privateKey');
    } catch (error) {
      // SecureStore might not be available on all platforms
      console.warn('Error clearing SecureStore:', error);
    }

    // Clear Apollo Client cache (in-memory)
    await client.cache.reset();

    // Clear Drizzle cache
    await drizzleCacheStorage.clearAll();

    // Clear all AsyncStorage keys related to user data
    const keysToRemove = [
      USER_STORAGE_KEY,
      QUEUE_STORAGE_KEY,
      PERSIST_ROOT_KEY,
    ];

    // Also try to remove any other persisted keys
    try {
      const allKeys = await AsyncStorage.getAllKeys();
      const userRelatedKeys = allKeys.filter(key => 
        key.startsWith('@safarnak_') || 
        key.startsWith('apollo-cache-persist') ||
        key === PERSIST_ROOT_KEY ||
        key === QUEUE_STORAGE_KEY
      );
      keysToRemove.push(...userRelatedKeys);
    } catch {
      // If getting all keys fails, just remove the known ones
    }

    // Remove all keys
    await AsyncStorage.multiRemove([...new Set(keysToRemove)]);
  } catch (error) {
    // Even if clearing fails, we still want to continue with logout
    console.error('Error during data cleanup:', error);
  }
}
