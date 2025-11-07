import { Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';

export default function PlacesLayout() {
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
          title: t('places.new') || 'Create Place',
          presentation: 'card',
        }}
      />
      <Stack.Screen 
        name="[id]" 
        options={{
          headerShown: true,
          title: t('places.detail') || 'Place Details',
          presentation: 'card',
        }}
      />
    </Stack>
  );
}

