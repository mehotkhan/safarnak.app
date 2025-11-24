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
      <Stack.Screen 
        name="index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen 
        name="saved" 
        options={{
          title: t('me.saved'),
        }}
      />
      <Stack.Screen 
        name="history" 
        options={{
          title: t('me.history'),
        }}
      />
      <Stack.Screen 
        name="subscription" 
        options={{
          title: t('me.subscription'),
        }}
      />
      <Stack.Screen 
        name="payments" 
        options={{
          title: t('me.payments'),
        }}
      />
      <Stack.Screen 
        name="settings" 
        options={{
          title: t('profile.settings'),
          headerShown: false,
        }}
      />
    </Stack>
  );
}

