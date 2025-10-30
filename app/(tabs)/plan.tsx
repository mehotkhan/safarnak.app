import { CustomText } from '@components/ui/CustomText';
import { Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';
import {
  View,
  ScrollView,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '@components/context/ThemeContext';
import { useMemo, useCallback, useState } from 'react';
import { useGetTripsQuery } from '@api';

// Live data via GraphQL

interface TripCardProps {
  trip: any;
  onPress: () => void;
  isDark: boolean;
  t: any;
}

const TripCard = ({ trip, onPress, isDark, t }: TripCardProps) => {
  const statusColor =
    trip.status === 'in_progress'
      ? 'bg-blue-100 dark:bg-blue-900'
      : 'bg-green-100 dark:bg-green-900';
  const statusTextColor =
    trip.status === 'in_progress'
      ? 'text-blue-800 dark:text-blue-200'
      : 'text-green-800 dark:text-green-200';

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
            {trip?.destination || '—'}
          </CustomText>
          <CustomText className="text-sm text-gray-600 dark:text-gray-400">
            {(trip?.startDate as string) || '—'} - {(trip?.endDate as string) || '—'}
          </CustomText>
        </View>
        <View className={`px-3 py-1 rounded-full ${statusColor}`}>
          <CustomText className={`text-xs ${statusTextColor}`}>
            {t(`plan.${trip?.status === 'in_progress' ? 'inProgress' : 'completed'}`)}
          </CustomText>
        </View>
      </View>

      <View className="flex-row items-center mb-2">
        <Ionicons
          name="people-outline"
          size={16}
          color={isDark ? '#9ca3af' : '#6b7280'}
        />
        <CustomText className="text-sm text-gray-600 dark:text-gray-400 ml-2">
          {trip?.travelers ?? 1} {trip?.travelers === 1 ? 'traveler' : 'travelers'}
        </CustomText>
        <Ionicons
          name="wallet-outline"
          size={16}
          color={isDark ? '#9ca3af' : '#6b7280'}
          style={{ marginLeft: 16 }}
        />
        <CustomText className="text-sm text-gray-600 dark:text-gray-400 ml-2">
          {trip?.budget ? `$${trip.budget}` : '—'}
        </CustomText>
      </View>

      <CustomText className="text-sm text-gray-500 dark:text-gray-500">
        {trip?.preferences || '—'}
      </CustomText>
    </TouchableOpacity>
  );
};

export default function PlanScreen() {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const router = useRouter();
  const { data, loading, error, refetch } = useGetTripsQuery();
  const trips = useMemo(() => data?.getTrips ?? [], [data]);
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(async () => {
    try {
      setRefreshing(true);
      await refetch();
    } finally {
      setRefreshing(false);
    }
  }, [refetch]);

  const handleCreateTrip = () => {
    router.push('/plan/create-trip' as any);
  };

  const handleTripPress = (tripId: string) => {
    router.push(`/plan/trip-detail/${tripId}` as any);
  };

  return (
    <View className="flex-1 bg-white dark:bg-black">
      <Stack.Screen options={{ title: t('plan.title'), headerShown: false }} />

      <FlatList
        data={trips}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TripCard
            trip={item}
            onPress={() => handleTripPress(item.id)}
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
              {t('plan.title')}
            </CustomText>
            <CustomText className="text-base text-gray-600 dark:text-gray-400">
              {t('plan.description')}
            </CustomText>
          </View>
        }
        ListEmptyComponent={
          loading ? (
            <View className="flex-1 items-center justify-center py-16">
              <ActivityIndicator size="large" color={isDark ? '#4aa3d9' : '#0077be'} />
            </View>
          ) : (
            <View className="flex-1 items-center justify-center px-6 py-12">
              <Ionicons name="airplane-outline" size={80} color={isDark ? '#4b5563' : '#d1d5db'} />
              <CustomText
                weight="bold"
                className="text-xl text-gray-800 dark:text-gray-300 mt-4 mb-2 text-center"
              >
                {t('plan.emptyState')}
              </CustomText>
              <CustomText className="text-base text-gray-600 dark:text-gray-400 text-center">
                {t('plan.description')}
              </CustomText>
            </View>
          )
        }
        contentContainerStyle={{ padding: 24, paddingTop: 0 }}
      />

      {/* Floating Action Button */}
      <TouchableOpacity
        onPress={handleCreateTrip}
        className="absolute bottom-8 right-6 w-16 h-16 bg-primary dark:bg-primary rounded-full items-center justify-center shadow-lg"
        style={{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 4.65,
          elevation: 8,
        }}
      >
        <Ionicons name="add" size={32} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

