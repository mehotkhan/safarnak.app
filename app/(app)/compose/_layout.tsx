import { Stack } from 'expo-router';

export default function ComposeLayout() {
  return (
    <Stack
      screenOptions={{
        presentation: 'modal',
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="experience" />
      <Stack.Screen name="trip" />
      <Stack.Screen name="place" />
    </Stack>
  );
}

