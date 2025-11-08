import { useMemo, useCallback, useState } from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { CustomText } from '@components/ui/CustomText';
import { useTheme } from '@components/context/ThemeContext';
import { useGetToursQuery } from '@api';
import { useAppSelector } from '@store/hooks';
import Colors from '@constants/Colors';

interface TourCardProps {
  tour: any;
  onPress: () => void;
  isDark: boolean;
  t: any;
}

const TourCard = ({ tour, onPress, isDark, t }: TourCardProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-white dark:bg-neutral-900 rounded-2xl p-4 mb-4 border border-gray-200 dark:border-neutral-800"
    >
      <View className="flex-row justify-between items-start mb-3">
        <View className="flex-1">
          <CustomText
            weight="bold"
            className="text-lg text-black dark:text-white mb-1"
          >
            {tour?.title || '—'}
          </CustomText>
          <CustomText className="text-sm text-gray-600 dark:text-gray-400">
            {tour?.location || '—'}
          </CustomText>
        </View>
        <View className="px-3 py-1 rounded-full bg-primary/10">
          <CustomText className="text-xs text-primary">
            ${tour?.price?.toFixed(0) || 0}
          </CustomText>
        </View>
      </View>

      <View className="flex-row items-center mb-2">
        <Ionicons
          name="time-outline"
          size={16}
          color={isDark ? '#9ca3af' : '#6b7280'}
        />
        <CustomText className="text-sm text-gray-600 dark:text-gray-400 ml-2">
          {tour?.duration || 0} {tour?.durationType || 'days'}
        </CustomText>
        <Ionicons
          name="star-outline"
          size={16}
          color={isDark ? '#9ca3af' : '#6b7280'}
          style={{ marginLeft: 16 }}
        />
        <CustomText className="text-sm text-gray-600 dark:text-gray-400 ml-2">
          {tour?.rating?.toFixed(1) || '0.0'} ({tour?.reviews || 0})
        </CustomText>
      </View>

      <CustomText className="text-sm text-gray-500 dark:text-gray-500" numberOfLines={2}>
        {tour?.description || tour?.shortDescription || '—'}
      </CustomText>
    </TouchableOpacity>
  );
};

export default function ToursManagementScreen() {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const router = useRouter();
  const { user } = useAppSelector(state => state.auth);
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
    router.push('/(app)/(trips)/tours/new' as any);
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
              isDark={isDark}
              t={t}
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

