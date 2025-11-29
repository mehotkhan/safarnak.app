import { useEffect } from 'react';
import { useRouter, useLocalSearchParams, Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { View, ActivityIndicator } from 'react-native';
import { CustomText } from '@ui/display';

/**
 * Shareable Trip Detail Redirect
 * 
 * This page redirects to the unified trip detail page.
 * All trip details (personal, shareable, hosted) use the same detail page.
 */
export default function ShareableTripDetailRedirect() {
  const { t } = useTranslation();
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const tripId = Array.isArray(id) ? id[0] : id;

  useEffect(() => {
    if (tripId) {
      // Redirect to unified trip detail page
      router.replace(`/(app)/(trips)/${tripId}` as any);
    } else {
      // If no ID, go back
      router.back();
    }
  }, [tripId, router]);

  return (
    <View className="flex-1 items-center justify-center bg-white dark:bg-black">
      <Stack.Screen options={{ headerShown: false }} />
      <ActivityIndicator size="large" />
      <CustomText className="text-gray-600 dark:text-gray-400 mt-4">
        {t('common.loading')}
      </CustomText>
    </View>
  );
}
