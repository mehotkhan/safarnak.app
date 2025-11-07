import { Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';

export default function ToursLayout() {
  const { t } = useTranslation();
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen 
        name="new" 
        options={{
          headerShown: true,
          title: t('tours.new') || 'Create Tour',
          presentation: 'card',
        }}
      />
      <Stack.Screen 
        name="[id]" 
        options={{
          headerShown: true,
          title: t('tours.detail') || 'Tour Details',
          presentation: 'card',
        }}
      />
    </Stack>
  );
}

