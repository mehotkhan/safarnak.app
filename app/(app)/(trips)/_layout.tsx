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
      {/* Tours Management */}
      <Stack.Screen 
        name="tours/index" 
        options={{
          headerShown: true,
          title: t('trips.tabs.tours') || 'My Tours',
        }}
      />
      <Stack.Screen 
        name="tours/new" 
        options={{
          headerShown: true,
          title: t('tours.new') || 'Create Tour',
          presentation: 'modal',
        }}
      />
      {/* Places Management */}
      <Stack.Screen 
        name="places/index" 
        options={{
          headerShown: true,
          title: t('trips.tabs.places') || 'My Places',
        }}
      />
      <Stack.Screen 
        name="places/new" 
        options={{
          headerShown: true,
          title: t('places.new') || 'Create Place',
          presentation: 'modal',
        }}
      />
      {/* Locations Management */}
      <Stack.Screen 
        name="locations/index" 
        options={{
          headerShown: true,
          title: t('trips.tabs.locations') || 'Locations',
        }}
      />
      <Stack.Screen 
        name="locations/new" 
        options={{
          headerShown: true,
          title: t('locations.new') || 'Create Location',
          presentation: 'modal',
        }}
      />
    </Stack>
  );
}

