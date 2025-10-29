import { ApolloProvider } from '@apollo/client';
import AuthWrapper from '@components/AuthWrapper';
import { LanguageProvider } from '@components/context/LanguageContext';
import { ThemeProvider as CustomThemeProvider } from '@components/context/ThemeContext';
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
import '../i18n';
import '../global.css';

export { ErrorBoundary } from 'expo-router';

export const unstable_settings = {
  initialRouteName: 'auth',
};

SplashScreen.preventAutoHideAsync();

// Suppress harmless shadowOffset warning from react-native-reanimated
// This is a known issue with react-native-reanimated and React Native's New Architecture
// The warning is cosmetic and doesn't affect functionality
if (__DEV__) {
  const originalWarn = console.warn;
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
    originalWarn.apply(console, args);
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
    return (
      <ThemeProvider value={isDark ? DarkTheme : DefaultTheme}>
        <AuthWrapper>
          <Stack>
            <Stack.Screen name='auth' options={{ headerShown: false }} />
            <Stack.Screen name='(tabs)' options={{ headerShown: false }} />
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
                <ThemedApp />
              </CustomThemeProvider>
            </LanguageProvider>
          </ApolloProvider>
        </PersistGate>
      </Provider>
    </SafeAreaProvider>
  );
}
