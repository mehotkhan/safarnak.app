import { useState, useMemo, useCallback } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useRouter, Stack } from 'expo-router';
import { useDateTime } from '@hooks/useDateTime';
import { Ionicons } from '@expo/vector-icons';
import { CustomText } from '@components/display';
import { useTheme } from '@components/context';
import { useGetTripsQuery } from '@api';

export default function MyTripsScreen() {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const router = useRouter();
  const { formatDate, isFuture, isPast } = useDateTime();
  const [selectedTab, setSelectedTab] = useState<'upcoming' | 'past'>('upcoming');
  const [refreshing, setRefreshing] = useState(false);

  // Fetch real trips data
  const { data, loading, error, refetch } = useGetTripsQuery({
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all',
  });

  const trips = useMemo(() => data?.getTrips ?? [], [data]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refetch();
    } finally {
      setRefreshing(false);
    }
  }, [refetch]);

  const filteredTrips = useMemo(() => {
    if (selectedTab === 'upcoming') {
      return trips.filter(trip => 
        trip.status === 'in_progress' || 
        (trip.startDate && isFuture(trip.startDate))
      );
    } else {
      return trips.filter(trip => 
        trip.status === 'completed' || 
        (trip.endDate && isPast(trip.endDate))
      );
    }
  }, [trips, selectedTab, isFuture, isPast]);

  const handleTripPress = (tripId: string) => {
    router.push(`/(app)/(trips)/${tripId}` as any);
  };

  return (
    <View className="flex-1 bg-white dark:bg-black">
      <Stack.Screen options={{ title: t('me.myTrips'), headerShown: true }} />

      {/* Tabs */}
      <View className="px-6 pt-4">
        <View className="flex-row gap-2">
          <TouchableOpacity
            onPress={() => setSelectedTab('upcoming')}
            className={`flex-1 py-3 rounded-lg ${
              selectedTab === 'upcoming'
                ? 'bg-primary'
                : 'bg-gray-100 dark:bg-neutral-900'
            }`}
          >
            <CustomText
              weight="medium"
              className={`text-center ${
                selectedTab === 'upcoming'
                  ? 'text-white'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              {t('me.tripsList.upcoming')}
            </CustomText>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setSelectedTab('past')}
            className={`flex-1 py-3 rounded-lg ${
              selectedTab === 'past'
                ? 'bg-primary'
                : 'bg-gray-100 dark:bg-neutral-900'
            }`}
          >
            <CustomText
              weight="medium"
              className={`text-center ${
                selectedTab === 'past'
                  ? 'text-white'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              {t('me.tripsList.past')}
            </CustomText>
          </TouchableOpacity>
        </View>
      </View>

      {/* Content */}
      {loading && filteredTrips.length === 0 ? (
        <View className="flex-1 items-center justify-center px-6">
          <CustomText className="text-base text-gray-600 dark:text-gray-400">
            {t('common.loading')}
          </CustomText>
        </View>
      ) : error && filteredTrips.length === 0 ? (
        <View className="flex-1 items-center justify-center px-6">
          <Ionicons
            name="alert-circle-outline"
            size={80}
            color={isDark ? '#ef4444' : '#dc2626'}
          />
          <CustomText
            weight="bold"
            className="text-xl text-gray-800 dark:text-gray-300 mt-4 mb-2 text-center"
          >
            {t('common.error')}
          </CustomText>
          <CustomText className="text-base text-gray-600 dark:text-gray-400 text-center">
            {error.message || t('common.error')}
          </CustomText>
        </View>
      ) : filteredTrips.length === 0 ? (
        <View className="flex-1 items-center justify-center px-6">
          <Ionicons
            name="airplane-outline"
            size={80}
            color={isDark ? '#4b5563' : '#d1d5db'}
          />
          <CustomText
            weight="bold"
            className="text-xl text-gray-800 dark:text-gray-300 mt-4 mb-2 text-center"
          >
            {t('me.tripsList.emptyState')}
          </CustomText>
        </View>
      ) : (
        <ScrollView 
          className="flex-1 px-6 py-4"
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {filteredTrips.map(trip => (
            <TouchableOpacity
              key={trip.id}
              onPress={() => handleTripPress(trip.id)}
              className="bg-white dark:bg-neutral-900 rounded-2xl p-4 mb-4 border border-gray-200 dark:border-neutral-800"
            >
              <CustomText
                weight="bold"
                className="text-lg text-black dark:text-white mb-2"
              >
                {trip.destination || t('me.tripsList.unnamedTrip', { defaultValue: 'Unnamed Trip' })}
              </CustomText>
              {(trip.startDate || trip.endDate) && (
                <View className="flex-row items-center mb-2">
                  <Ionicons
                    name="calendar-outline"
                    size={16}
                    color={isDark ? '#9ca3af' : '#6b7280'}
                  />
                  <CustomText className="text-sm text-gray-600 dark:text-gray-400 ml-2">
                    {trip.startDate && trip.endDate 
                      ? `${formatDate(trip.startDate, 'short')} - ${formatDate(trip.endDate, 'short')}`
                      : trip.startDate ? formatDate(trip.startDate, 'short') : trip.endDate ? formatDate(trip.endDate, 'short') : '—'}
                  </CustomText>
                </View>
              )}
              {trip.status && (
                <View className="flex-row items-center">
                  <View className={`px-2 py-1 rounded-full ${
                    trip.status === 'completed' 
                      ? 'bg-green-100 dark:bg-green-900'
                      : trip.status === 'in_progress'
                      ? 'bg-blue-100 dark:bg-blue-900'
                      : 'bg-gray-100 dark:bg-neutral-800'
                  }`}>
                    <CustomText className={`text-xs ${
                      trip.status === 'completed' 
                        ? 'text-green-800 dark:text-green-200'
                        : trip.status === 'in_progress'
                        ? 'text-blue-800 dark:text-blue-200'
                        : 'text-gray-600 dark:text-gray-400'
                    }`}>
                      {trip.status === 'completed' 
                        ? t('me.tripsList.completed', { defaultValue: 'Completed' })
                        : trip.status === 'in_progress'
                        ? t('me.tripsList.inProgress', { defaultValue: 'In Progress' })
                        : trip.status}
                    </CustomText>
                  </View>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

