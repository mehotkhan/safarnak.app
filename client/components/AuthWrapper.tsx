import { useAppDispatch, useAppSelector } from '../store/hooks';
import { restoreUser, setLoading } from '../redux/authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
// Drizzle removed from client restore path; rely on AsyncStorage only

const USER_STORAGE_KEY = '@safarnak_user';

export default function AuthWrapper({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const { isAuthenticated, isLoading } = useAppSelector((state) => state.auth);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        router.replace('/(tabs)');
      } else {
        router.replace('/login');
      }
    }
  }, [isAuthenticated, isLoading]);

  const checkAuthStatus = async () => {
    try {
      // Restore from AsyncStorage only
      const savedUser = await AsyncStorage.getItem(USER_STORAGE_KEY);
      if (savedUser) {
        const userData = JSON.parse(savedUser);
        dispatch(restoreUser({ 
          user: userData.user || null, 
          token: userData.token || 'local' 
        }));
      } else {
        dispatch(setLoading(false));
      }
    } catch (error) {
      console.log('Error checking auth status:', error);
      dispatch(setLoading(false));
    }
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#2f95dc" />
      </View>
    );
  }

  return <>{children}</>;
}