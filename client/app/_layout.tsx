import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { ApolloProvider } from '@apollo/client';
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import { View, Text } from 'react-native';

import AuthWrapper from '../components/AuthWrapper';
import { LanguageProvider } from '../components/context/LanguageContext';
import { ThemeProvider as CustomThemeProvider } from '../components/context/ThemeContext';
import { useColorScheme } from '../hooks/useColorScheme';
import { persistor, store } from '../redux/store';
import { client } from '../api/client';
import { db } from '../db/database';
import migrations from '@drizzle/migrations/client/migrations';
import '../i18n';

export {
  ErrorBoundary
} from 'expo-router';

export const unstable_settings = {
  initialRouteName: 'login',
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    VazirRegular: require('../assets/fonts/Vazir-Regular.ttf'),
    VazirMedium: require('../assets/fonts/Vazir-Medium.ttf'),
    VazirBold: require('../assets/fonts/Vazir-Bold.ttf'),
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ApolloProvider client={client}>
          <RootLayoutNav />
        </ApolloProvider>
      </PersistGate>
    </Provider>
  );
}

function RootLayoutNav() {
  return (
    <LanguageProvider>
      <CustomThemeProvider>
        <RootLayoutNavContent />
      </CustomThemeProvider>
    </LanguageProvider>
  );
}

function RootLayoutNavContent() {
  const colorScheme = useColorScheme();
  const { success, error } = useMigrations(db, migrations);

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Migration error: {error.message}</Text>
      </View>
    );
  }
  
  if (!success) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Migrating...</Text>
      </View>
    );
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AuthWrapper>
        <Stack>
          <Stack.Screen name="login" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
      </AuthWrapper>
    </ThemeProvider>
  );
}