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
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import { client } from '@api';
import { useColorScheme } from '@hooks/useColorScheme';
import { persistor, store } from '@store';
import '../i18n';
import '../global.css';

export { ErrorBoundary } from 'expo-router';

export const unstable_settings = {
  initialRouteName: 'auth',
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

  const colorScheme = useColorScheme();

  useEffect(() => {
    if (error) throw error;
    if (loaded) SplashScreen.hideAsync();
  }, [error, loaded]);

  if (!loaded) return null;

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ApolloProvider client={client}>
          <LanguageProvider>
            <CustomThemeProvider>
              <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
                <AuthWrapper>
                  <Stack>
                    <Stack.Screen name='auth' options={{ headerShown: false }} />
                    <Stack.Screen name='(tabs)' options={{ headerShown: false }} />
                  </Stack>
                </AuthWrapper>
              </ThemeProvider>
            </CustomThemeProvider>
          </LanguageProvider>
        </ApolloProvider>
      </PersistGate>
    </Provider>
  );
}
