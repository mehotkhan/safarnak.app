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
      <Stack.Screen 
        name="account" 
        options={{
          title: t('profile.accountTitle'),
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
        name="bookmarks" 
        options={{
          title: t('profile.bookmarksTitle'),
        }}
      />
      <Stack.Screen 
        name="notifications/[id]" 
        options={{
          title: t('notifications.details', { defaultValue: 'Notification Details' }),
        }}
      />
      <Stack.Screen 
        name="messages/[id]" 
        options={{
          title: t('messages.chat', { defaultValue: 'Chat' }),
        }}
      />
    </Stack>
  );
}

