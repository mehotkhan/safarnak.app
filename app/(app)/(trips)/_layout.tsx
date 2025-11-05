import { Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';

export default function TripsLayout() {
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
          title: t('plan.form.title'),
          presentation: 'modal',
        }}
      />
      <Stack.Screen 
        name="[id]/index" 
        options={{
          headerShown: true,
          title: t('tripDetail.tripDetails'),
          presentation: 'card',
        }}
      />
      <Stack.Screen 
        name="[id]/edit" 
        options={{
          headerShown: true,
          title: t('plan.editPlan'),
          presentation: 'modal',
        }}
      />
      <Stack.Screen 
        name="[id]/map" 
        options={{
          headerShown: true,
          title: t('map.map'),
          presentation: 'card',
        }}
      />
    </Stack>
  );
}

