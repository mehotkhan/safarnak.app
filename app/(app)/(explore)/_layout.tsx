import { Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';

export default function ExploreLayout() {
  const { t } = useTranslation();
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen 
        name="places/[id]" 
        options={{
          headerShown: true,
          title: t('placeDetail.title'),
          presentation: 'card',
        }}
      />
      <Stack.Screen 
        name="tours/[id]" 
        options={{
          headerShown: true,
          title: t('tour.title'),
          presentation: 'card',
        }}
      />
      <Stack.Screen 
        name="users/[id]" 
        options={{
          headerShown: true,
          presentation: 'card',
        }}
      />
      <Stack.Screen 
        name="locations/[id]" 
        options={{
          headerShown: true,
          title: t('placeDetail.title'),
          presentation: 'card',
        }}
      />
    </Stack>
  );
}

