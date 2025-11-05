import { ApolloProvider } from '@apollo/client';
import AuthWrapper from '@components/AuthWrapper';
import { LanguageProvider } from '@components/context/LanguageContext';
import { ThemeProvider as CustomThemeProvider } from '@components/context/ThemeContext';
import { NotificationWrapper } from '@components/notifications/NotificationWrapper';
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { LogBox } from 'react-native';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { client } from '@api';
import { persistor, store } from '@store';
import { useAppSelector } from '@store/hooks';
import { processQueue } from '@store/middleware/offlineMiddleware';
import NetInfo from '@react-native-community/netinfo';
import { AppState } from 'react-native';
import '../i18n';
import '../global.css';

export { ErrorBoundary } from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(auth)',
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    VazirRegular: require('../assets/fonts/Vazir-Regular.ttf'),
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    VazirMedium: require('../assets/fonts/Vazir-Medium.ttf'),
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    VazirBold: require('../assets/fonts/Vazir-Bold.ttf'),
  });

  useEffect(() => {
    if (error) throw error;
    if (loaded) SplashScreen.hideAsync();
  }, [error, loaded]);

  if (!loaded) return null;

  // Component that needs theme state (inside providers)
  function ThemedApp() {
    const isDark = useAppSelector(state => state.theme.isDark);

    // Process offline queue when connection is restored
    useEffect(() => {
      const unsubscribe = NetInfo.addEventListener(state => {
        if (state.isConnected) {
          processQueue();
        }
      });

      // Process queue on app foreground
      const subscription = AppState.addEventListener('change', nextAppState => {
        if (nextAppState === 'active') {
          NetInfo.fetch().then(state => {
            if (state.isConnected) {
              processQueue();
            }
          });
        }
      });

      // Process queue on initial mount if online
      NetInfo.fetch().then(state => {
        if (state.isConnected) {
          processQueue();
        }
      });

      return () => {
        unsubscribe();
        subscription?.remove();
      };
    }, []);

    return (
      <ThemeProvider value={isDark ? DarkTheme : DefaultTheme}>
        <AuthWrapper>
          <Stack>
            <Stack.Screen name='(auth)' options={{ headerShown: false }} />
            <Stack.Screen name='(app)' options={{ headerShown: false }} />
          </Stack>
        </AuthWrapper>
      </ThemeProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <ApolloProvider client={client}>
            <LanguageProvider>
              <CustomThemeProvider>
                {/* <NotificationWrapper> */}
                <ThemedApp />
                {/* </NotificationWrapper> */}
              </CustomThemeProvider>
            </LanguageProvider>
          </ApolloProvider>
        </PersistGate>
      </Provider>
    </SafeAreaProvider>
  );
}
