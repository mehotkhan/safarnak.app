import { ApolloProvider } from '@apollo/client';
import { AuthWrapper } from '@ui/auth';
import { LanguageProvider } from '@ui/context';
import { ThemeProvider as CustomThemeProvider } from '@ui/context';
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import { useFonts, loadAsync } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View } from 'react-native';

import { client, initializeCachePersistence } from '@api';
import { persistor, store } from '@state';
import { useAppSelector } from '@state/hooks';
import { processQueue } from '@state/middleware/offlineMiddleware';
import { useLanguage } from '@ui/context';
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
  const originalError = console.error;
  
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
  
  console.error = (...args) => {
    const msg = args[0];
    
    // Filter out Expo Router navigation warnings during initial mount
    // This happens when router tries to navigate before Stack is ready - harmless
    if (
      typeof msg === 'string' &&
      (msg.includes("The action 'REPLACE'") || 
       msg.includes("was not handled by any navigator") ||
       msg.includes("Do you have a route named 'index'"))
    ) {
      return;
    }
    
    originalError(...args);
  };
}

export { ErrorBoundary } from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(auth)',
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  // Load essential fonts first (Vazirmatn Regular - optimized successor to Vazir)
  // Vazirmatn fonts are 58% smaller than old Vazir fonts (120KB vs 286KB per font)
  const [essentialFontsLoaded, essentialFontsError] = useFonts({
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    VazirRegular: require('../assets/fonts/Vazirmatn-Regular.ttf'),
  });

  // Cache restoration state - must complete before rendering ApolloProvider
  const [cacheReady, setCacheReady] = useState(false);

  // Restore Apollo cache before app renders
  useEffect(() => {
    let mounted = true;
    initializeCachePersistence()
      .catch(() => {
        // Silently fail - cache persistence is optional, app can continue
      })
      .finally(() => {
        if (mounted) {
          setCacheReady(true);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  // Load non-essential fonts (VazirMedium, VazirBold) asynchronously after initial render
  // These are only needed for medium/bold text weights, which are less common
  useEffect(() => {
    if (essentialFontsLoaded) {
      // Load additional fonts in background - app will use VazirRegular as fallback
      loadAsync({
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        VazirMedium: require('../assets/fonts/Vazirmatn-Medium.ttf'),
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        VazirBold: require('../assets/fonts/Vazirmatn-Bold.ttf'),
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
    if (essentialFontsLoaded && cacheReady) SplashScreen.hideAsync();
  }, [essentialFontsError, essentialFontsLoaded, cacheReady]);

  // Wait for both fonts and cache to be ready
  if (!essentialFontsLoaded || !cacheReady) {
    // IMPORTANT: this should be very light and static
    // No loading placeholders - just a minimal background
    return <View style={{ flex: 1, backgroundColor: '#000' }} />;
  }

  // Component that needs theme state (inside providers)
  function ThemedApp() {
    const isDark = useAppSelector(state => state.theme.isDark);
    const { isRTL } = useLanguage();

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
      <View style={{ flex: 1, direction: isRTL ? 'rtl' : 'ltr' }}>
        <ThemeProvider value={isDark ? DarkTheme : DefaultTheme}>
          <AuthWrapper>
            <Stack>
              <Stack.Screen name='(auth)' options={{ headerShown: false }} />
              <Stack.Screen name='(app)' options={{ headerShown: false }} />
            </Stack>
          </AuthWrapper>
        </ThemeProvider>
      </View>
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
