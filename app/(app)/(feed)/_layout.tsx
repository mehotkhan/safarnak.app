import { Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';

export default function FeedLayout() {
  const { t } = useTranslation();
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen 
        name="[id]" 
        options={{
          headerShown: true,
          title: t('common.post'),
          presentation: 'card',
        }}
      />
    </Stack>
  );
}

