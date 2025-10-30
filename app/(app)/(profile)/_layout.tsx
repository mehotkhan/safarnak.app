import { Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';

export default function ProfileLayout() {
  const { t } = useTranslation();
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen 
        name="trips" 
        options={{
          headerShown: true,
          title: t('me.myTrips'),
        }}
      />
      <Stack.Screen 
        name="messages" 
        options={{
          headerShown: true,
          title: t('me.inbox.title'),
        }}
      />
      <Stack.Screen 
        name="settings" 
        options={{
          headerShown: true,
          title: t('profile.settings'),
        }}
      />
    </Stack>
  );
}

