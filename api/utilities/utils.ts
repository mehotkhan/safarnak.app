// API utility functions
// Helper functions for API operations

import AsyncStorage from '@react-native-async-storage/async-storage';
import { ApiError } from '../api-types';

const USER_STORAGE_KEY = '@safarnak_user';

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
