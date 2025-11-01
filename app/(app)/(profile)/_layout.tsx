import { Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';

export default function ProfileLayout() {
  const { t } = useTranslation();
  return (
    <Stack
      screenOptions={{
        headerShown: true,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen 
        name="trips" 
        options={{
          title: t('me.myTrips'),
        }}
      />
      <Stack.Screen 
        name="messages" 
        options={{
          title: t('me.inbox.title'),
        }}
      />
      <Stack.Screen 
        name="settings" 
        options={{
          title: t('profile.settings'),
        }}
      />
    </Stack>
  );
}

