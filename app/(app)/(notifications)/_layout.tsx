import { Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';

export default function NotificationsLayout() {
  const { t } = useTranslation();

  return (
    <Stack
      screenOptions={{
        headerShown: true,
      }}
    >
      <Stack.Screen
        name='index'
        options={{
          title: t('common.notifications'),
          headerLargeTitle: true,
        }}
      />
      <Stack.Screen
        name='[id]'
        options={{
          title: t('notifications.details'),
          presentation: 'modal',
        }}
      />
    </Stack>
  );
}

