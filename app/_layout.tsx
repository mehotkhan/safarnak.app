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
import { useFonts, loadAsync } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
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

// Polyfill Buffer for react-native-quick-crypto (must be loaded before any crypto operations)
 
if (typeof global.Buffer === 'undefined') {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  global.Buffer = require('buffer').Buffer;
}

// Disable noisy warnings in development
if (__DEV__) {
  const originalWarn = console.warn;
  console.warn = (...args) => {
    const msg = args[0];
    
    // Filter out Reanimated strict mode warnings (our code is correct)
    if (
      typeof msg === 'string' &&
      msg.includes('[Reanimated]') &&
      msg.includes('Reading from `value` during component render')
    ) {
      return;
    }
    
    // Filter out Apollo cache initialization warnings (error 51)
    // This happens briefly during cache restoration - everything works fine
    if (
      typeof msg === 'string' &&
      (msg.includes('go.apollo.dev/c/err') || msg.includes('An error occured!'))
    ) {
      return;
    }
    
    originalWarn(...args);
  };
}

export { ErrorBoundary } from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(auth)',
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  // Load essential fonts first (SpaceMono and VazirRegular)
  // These are needed for initial render
  const [essentialFontsLoaded, essentialFontsError] = useFonts({
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    VazirRegular: require('../assets/fonts/Vazir-Regular.ttf'),
  });

  // Load non-essential fonts (VazirMedium, VazirBold) asynchronously after initial render
  // These are only needed for medium/bold text weights, which are less common
  useEffect(() => {
    if (essentialFontsLoaded) {
      // Load additional fonts in background - app will use VazirRegular as fallback
      loadAsync({
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        VazirMedium: require('../assets/fonts/Vazir-Medium.ttf'),
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        VazirBold: require('../assets/fonts/Vazir-Bold.ttf'),
      }).catch((err) => {
        // Silently fail - app will continue with VazirRegular for medium/bold weights
        if (__DEV__) {
          console.warn('Failed to load additional fonts:', err);
        }
      });
    }
  }, [essentialFontsLoaded]);

  useEffect(() => {
    if (essentialFontsError) throw essentialFontsError;
    if (essentialFontsLoaded) SplashScreen.hideAsync();
  }, [essentialFontsError, essentialFontsLoaded]);

  if (!essentialFontsLoaded) return null;

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
