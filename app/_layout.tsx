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

// Suppress harmless warnings
// - shadowOffset warning from react-native-reanimated (cosmetic, doesn't affect functionality)
// - "Network request failed" from whatwg-fetch (expected when offline)
// - Uncaught Apollo errors when offline
if (__DEV__) {
  const originalWarn = console.warn;
  const originalError = console.error;
  
  console.warn = (...args: any[]) => {
    const message = args[0]?.toString() || '';
    const fullMessage = args.map(arg => String(arg)).join(' ');
    // Ignore shadowOffset warnings from react-native-reanimated
    if (
      (message.includes('shadowOffset') || fullMessage.includes('shadowOffset')) &&
      (message.includes('You are setting the style') || fullMessage.includes('You are setting the style') || fullMessage.includes('as a prop'))
    ) {
      return;
    }
    // Ignore "Network request failed" warnings from whatwg-fetch (expected when offline)
    if (
      fullMessage.includes('Network request failed') ||
      fullMessage.includes('fetch.umd.js')
    ) {
      return;
    }
    originalWarn.apply(console, args);
  };
  
  // Suppress uncaught Apollo errors when offline
  console.error = (...args: any[]) => {
    const message = args[0]?.toString() || '';
    const fullMessage = args.map(arg => String(arg)).join(' ');
    
    // Suppress Apollo network errors (expected when offline)
    if (
      (message.includes('ApolloError') || fullMessage.includes('ApolloError')) &&
      (fullMessage.includes('Network request failed') || fullMessage.includes('Failed to fetch'))
    ) {
      // Only log as debug, not error
      console.debug('🌐 Apollo network error (offline/unreachable):', fullMessage);
      return;
    }
    
    // Suppress verbose WebSocket error objects (connection errors are expected during retries)
    if (
      fullMessage.includes('WebSocket') &&
      (fullMessage.includes('_bubbles') || fullMessage.includes('Symbol(') || fullMessage.includes('readyState'))
    ) {
      // These are verbose error objects from WebSocket, not actual errors
      console.debug('🌐 WebSocket connection event (expected during retries)');
      return;
    }
    
    originalError.apply(console, args);
  };
  
  // Handle uncaught promise rejections (Apollo errors)
  if (typeof ErrorUtils !== 'undefined' && ErrorUtils.getGlobalHandler) {
    const originalHandler = ErrorUtils.getGlobalHandler();
    ErrorUtils.setGlobalHandler((error: Error, isFatal?: boolean) => {
      const errorMessage = error?.message || String(error);
      const errorStack = error?.stack || '';
      
      // Suppress Apollo network errors
      if (
        (errorMessage.includes('ApolloError') || errorStack.includes('ApolloError')) &&
        (errorMessage.includes('Network request failed') || errorMessage.includes('Failed to fetch'))
      ) {
        if (__DEV__) {
          console.debug('🌐 Suppressed uncaught Apollo network error (offline):', errorMessage);
        }
        return;
      }
      
      // Call original handler for other errors
      if (originalHandler) {
        originalHandler(error, isFatal);
      }
    });
  }
  
  // Also handle unhandled promise rejections
  const originalRejectionHandler = (global as any).onunhandledrejection;
  (global as any).onunhandledrejection = (event: any) => {
    const error = event?.reason || event;
    const errorMessage = error?.message || String(error);
    const errorStack = error?.stack || '';
    
    // Suppress Apollo network errors
    if (
      (errorMessage?.includes('ApolloError') || errorStack?.includes('ApolloError')) &&
      (errorMessage?.includes('Network request failed') || errorMessage?.includes('Failed to fetch'))
    ) {
      if (__DEV__) {
        console.debug('🌐 Suppressed unhandled Apollo network error (offline):', errorMessage);
      }
      event?.preventDefault?.();
      return;
    }
    
    // Call original handler for other errors
    if (originalRejectionHandler) {
      originalRejectionHandler(event);
    }
  };
}

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
                <NotificationWrapper>
                  <ThemedApp />
                </NotificationWrapper>
              </CustomThemeProvider>
            </LanguageProvider>
          </ApolloProvider>
        </PersistGate>
      </Provider>
    </SafeAreaProvider>
  );
}
