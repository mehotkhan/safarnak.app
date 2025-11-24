import { useMemo, useCallback, useState } from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { CustomText } from '@ui/display';
import { useTheme } from '@ui/context';
import { TourCard } from '@ui/cards';
import { useGetToursQuery } from '@api';
import Colors from '@constants/Colors';

export default function ToursManagementScreen() {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);

  const { data, loading, error, refetch } = useGetToursQuery({
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all',
  });

  const allTours = useMemo(() => data?.getTours ?? [], [data]);

  // Filter by current user (for now show all, since tours don't have ownerId)
  // TODO: Add ownerId to tours schema or filter by another method
  const myTours = useMemo(() => {
    return allTours;
  }, [allTours]);

  const onRefresh = useCallback(async () => {
    try {
      setRefreshing(true);
      await refetch();
    } finally {
      setRefreshing(false);
    }
  }, [refetch]);

  const handleTourPress = useCallback((tourId: string) => {
    router.push(`/(app)/(explore)/tours/${tourId}` as any);
  }, [router]);

  const handleCreateTour = useCallback(() => {
    router.push('/(app)/(create)/tours/new' as any);
  }, [router]);

  return (
    <View className="flex-1 bg-white dark:bg-black">
      <Stack.Screen options={{ title: t('trips.tabs.tours') || 'My Tours', headerShown: false }} />

      {loading && myTours.length === 0 ? (
        <View className="flex-1 items-center justify-center py-20">
          <ActivityIndicator size="large" color={isDark ? Colors.dark.primary : Colors.light.primary} />
          <CustomText className="text-gray-500 dark:text-gray-400 mt-4">
            {t('common.loading')}
          </CustomText>
        </View>
      ) : error && myTours.length === 0 ? (
        <View className="flex-1 items-center justify-center px-6 py-20">
          <Ionicons name="warning-outline" size={64} color={isDark ? '#ef4444' : '#dc2626'} />
          <CustomText weight="bold" className="text-lg text-gray-800 dark:text-gray-300 mt-4 mb-2 text-center">
            {t('common.error')}
          </CustomText>
          <CustomText className="text-base text-gray-600 dark:text-gray-400 text-center">
            {String((error as any)?.message || t('tours.errors.loadFailed') || 'Failed to load tours')}
          </CustomText>
        </View>
      ) : myTours.length === 0 ? (
        <View className="flex-1 items-center justify-center px-6 py-20">
          <Ionicons name="map-outline" size={80} color={isDark ? '#4b5563' : '#d1d5db'} />
          <CustomText weight="bold" className="text-xl text-gray-800 dark:text-gray-300 mt-4 mb-2 text-center">
            {t('trips.tabs.toursEmpty') || 'No tours yet'}
          </CustomText>
          <CustomText className="text-base text-gray-600 dark:text-gray-400 text-center mb-4">
            {t('trips.tabs.toursEmptyDescription') || 'Create your first tour'}
          </CustomText>
          <TouchableOpacity
            onPress={handleCreateTour}
            className="bg-primary px-6 py-3 rounded-lg"
          >
            <CustomText className="text-white" weight="medium">
              {t('trips.tabs.toursCreate') || 'Create Tour'}
            </CustomText>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={myTours}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <TourCard
              tour={item}
              onPress={() => handleTourPress(item.id)}
              variant="compact"
            />
          )}
          refreshing={refreshing}
          onRefresh={onRefresh}
          ListHeaderComponent={
            <View className="px-6 pt-12 pb-4 mb-3 bg-white dark:bg-black border-b border-gray-200 dark:border-neutral-800">
              <CustomText
                weight="bold"
                className="text-3xl text-black dark:text-white mb-2"
              >
                {t('trips.tabs.tours') || 'My Tours'}
              </CustomText>
              <CustomText className="text-base text-gray-600 dark:text-gray-400">
                {t('trips.tabs.toursDescription') || 'Manage your tours'}
              </CustomText>
            </View>
          }
          contentContainerStyle={{ padding: 24, paddingTop: 0 }}
        />
      )}
    </View>
  );
}

