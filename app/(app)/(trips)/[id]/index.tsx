import { useMemo, useState, useCallback, useEffect } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  Share,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useRouter, useLocalSearchParams, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { CustomText } from '@components/ui/CustomText';
import CustomButton from '@components/ui/CustomButton';
import { useTheme } from '@components/context/ThemeContext';
import MapView from '@components/MapView';
import { useGetTripQuery } from '@api';
import Colors from '@constants/Colors';

export default function TripDetailScreen() {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const tripId = useMemo(() => (Array.isArray(id) ? id[0] : id) as string, [id]);
  const [refreshing, setRefreshing] = useState(false);
  
  // Use cache-first for offline support, with skip if no tripId
  const { data, loading, error, refetch } = useGetTripQuery({
    variables: { id: tripId },
    skip: !tripId,
    fetchPolicy: 'cache-and-network', // Try cache first, then network
    errorPolicy: 'all', // Return partial data even on error
  });
  
  const trip = data?.getTrip as any;
  const showMap = !!trip?.coordinates;
  const isPending = trip?.status === 'pending';

  // Auto-refresh if trip is pending (every 3 seconds)
  useEffect(() => {
    if (!isPending) return;
    
    const interval = setInterval(() => {
      refetch();
    }, 3000); // Refresh every 3 seconds while pending

    return () => clearInterval(interval);
  }, [isPending, refetch]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refetch();
    } finally {
      setRefreshing(false);
    }
  }, [refetch]);

  // Loading state
  if (loading && !trip) {
    return (
      <View className="flex-1 bg-white dark:bg-black">
        <Stack.Screen
          options={{
            title: t('plan.viewPlan'),
            headerShown: true,
          }}
        />
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={isDark ? Colors.dark.primary : Colors.light.primary} />
          <CustomText className="text-gray-600 dark:text-gray-400 mt-4">
            {t('common.loading')}
          </CustomText>
        </View>
      </View>
    );
  }

  // Error state
  if (error && !trip) {
    return (
      <View className="flex-1 bg-white dark:bg-black">
        <Stack.Screen
          options={{
            title: t('plan.viewPlan'),
            headerShown: true,
          }}
        />
        <ScrollView 
          className="flex-1 px-6 py-12"
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
          <View className="items-center">
            <Ionicons name="warning-outline" size={64} color="#ef4444" />
            <CustomText weight="bold" className="text-lg text-gray-800 dark:text-gray-300 mt-4 mb-2 text-center">
              {t('common.error')}
            </CustomText>
            <CustomText className="text-base text-gray-600 dark:text-gray-400 text-center mb-4">
              {(error as any)?.message || t('plan.errors.loadFailed')}
            </CustomText>
            <CustomButton
              title={t('common.retry')}
              onPress={onRefresh}
              IconLeft={() => (
                <Ionicons name="refresh" size={20} color="#fff" style={{ marginRight: 8 }} />
              )}
            />
          </View>
        </ScrollView>
      </View>
    );
  }

  // No trip data
  if (!trip && !loading) {
    return (
      <View className="flex-1 bg-white dark:bg-black">
        <Stack.Screen
          options={{
            title: t('plan.viewPlan'),
            headerShown: true,
          }}
        />
        <View className="flex-1 items-center justify-center px-6">
          <Ionicons name="document-outline" size={64} color={isDark ? '#4b5563' : '#d1d5db'} />
          <CustomText weight="bold" className="text-lg text-gray-800 dark:text-gray-300 mt-4 mb-2 text-center">
            {t('plan.notFound')}
          </CustomText>
          <CustomText className="text-base text-gray-600 dark:text-gray-400 text-center mb-4">
            {t('plan.tripNotFound')}
          </CustomText>
          <CustomButton
            title={t('common.back')}
            onPress={() => router.back()}
            bgVariant="secondary"
          />
        </View>
      </View>
    );
  }

  const handleRegenerate = () => {
    Alert.alert(
      t('plan.form.regenerate'),
      t('plan.form.regenerateConfirm'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.ok'),
          onPress: () => {
            // Implement regeneration logic
            Alert.alert(t('common.success'), t('plan.form.regenerated'));
          },
        },
      ]
    );
  };

  const handleEdit = () => {
    Alert.alert(t('common.edit'), t('plan.form.editComingSoon'));
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: t('plan.shareMessage', {
          destination: trip.destination || '',
          startDate: trip.startDate || '',
          endDate: trip.endDate || '',
        }),
        title: trip.destination || t('plan.title'),
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      t('plan.deletePlan'),
      t('plan.deleteConfirm'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.delete'),
          style: 'destructive',
          onPress: () => {
            router.back();
          },
        },
      ]
    );
  };

  const location = trip?.coordinates ? { coords: trip.coordinates } : undefined;

  return (
    <View className="flex-1 bg-white dark:bg-black">
      <Stack.Screen
        options={{
          title: (trip?.destination as string) || t('plan.viewPlan'),
          headerShown: true,
          headerRight: () => (
            <View className="flex-row items-center">
              <TouchableOpacity onPress={handleShare} className="p-2">
                <Ionicons name="share-outline" size={22} color={isDark ? '#fff' : '#000'} />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleDelete} className="p-2">
                <Ionicons name="trash-outline" size={22} color="#ef4444" />
              </TouchableOpacity>
            </View>
          ),
        }}
      />

      <ScrollView 
        className="flex-1"
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Map View */}
        {showMap && location && (
          <View className="h-64 bg-gray-100 dark:bg-neutral-900">
            <MapView location={location as any} />
          </View>
        )}

        <View className="px-6 py-4">
          {/* Pending Status Banner */}
          {trip?.status === 'pending' && (
            <View className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-2xl p-4 mb-4">
              <View className="flex-row items-center">
                <ActivityIndicator size="small" color={isDark ? '#fbbf24' : '#f59e0b'} style={{ marginRight: 12 }} />
                <View className="flex-1">
                  <CustomText weight="bold" className="text-base text-yellow-800 dark:text-yellow-200 mb-1">
                    {t('plan.form.processing')}
                  </CustomText>
                  <CustomText className="text-sm text-yellow-700 dark:text-yellow-300">
                    {t('plan.form.waitingMessage')}
                  </CustomText>
                </View>
              </View>
            </View>
          )}

          {/* Trip Info */}
          <View className="bg-gray-50 dark:bg-neutral-900 rounded-2xl p-4 mb-4">
            <View className="flex-row items-center mb-3">
              <Ionicons
                name="information-circle"
                size={20}
                color={isDark ? Colors.dark.primary : Colors.light.primary}
              />
              <CustomText
                weight="bold"
                className="text-base text-black dark:text-white ml-2"
              >
                {t('tripDetail.tripDetails')}
              </CustomText>
            </View>
            <View className="flex-row items-center mb-2">
              <Ionicons
                name="people-outline"
                size={16}
                color={isDark ? '#9ca3af' : '#6b7280'}
              />
              <CustomText className="text-sm text-gray-600 dark:text-gray-400 ml-2">
                {trip?.travelers} {trip?.travelers === 1 ? t('tripDetail.traveler') : t('tripDetail.travelers')}
              </CustomText>
            </View>
            <View className="flex-row items-center mb-2">
              <Ionicons
                name="wallet-outline"
                size={16}
                color={isDark ? '#9ca3af' : '#6b7280'}
              />
              <CustomText className="text-sm text-gray-600 dark:text-gray-400 ml-2">
                {trip?.budget ? `$${trip.budget}` : '—'} {t('tripDetail.budget')}
              </CustomText>
            </View>
            <View className="flex-row items-center">
              <Ionicons
                name="heart-outline"
                size={16}
                color={isDark ? '#9ca3af' : '#6b7280'}
              />
              <CustomText className="text-sm text-gray-600 dark:text-gray-400 ml-2">
                {trip?.preferences || '—'}
              </CustomText>
            </View>
          </View>

          {/* AI Reasoning */}
          <View className="mb-4">
            <View className="flex-row items-center mb-3">
              <Ionicons
                name="sparkles"
                size={20}
                color={isDark ? Colors.dark.primary : Colors.light.primary}
              />
              <CustomText
                weight="bold"
                className="text-base text-black dark:text-white ml-2"
              >
                {t('tripDetail.aiReasoning')}
              </CustomText>
            </View>
            <CustomText className="text-base text-gray-700 dark:text-gray-300 leading-6">
              {trip?.aiReasoning || '—'}
            </CustomText>
          </View>

          {/* Itinerary */}
          <View className="mb-4">
            <CustomText
              weight="bold"
              className="text-lg text-black dark:text-white mb-3"
            >
              {t('tripDetail.itinerary')}
            </CustomText>
            {(trip?.itinerary || []).map((day: any) => (
              <View
                key={day.day}
                className="bg-gray-50 dark:bg-neutral-900 rounded-2xl p-4 mb-3"
              >
                <CustomText
                  weight="bold"
                  className="text-base text-black dark:text-white mb-2"
                >
                  {t('tripDetail.day')} {day.day}: {day.title}
                </CustomText>
                {(day.activities as string[]).map((activity: string, index: number) => (
                  <View key={index} className="flex-row items-start mb-1">
                    <CustomText className="text-gray-600 dark:text-gray-400 mr-2">
                      •
                    </CustomText>
                    <CustomText className="text-sm text-gray-700 dark:text-gray-300 flex-1">
                      {activity}
                    </CustomText>
                  </View>
                ))}
              </View>
            ))}
          </View>

          {/* Action Buttons */}
          <View className="gap-3 mb-6">
            <CustomButton
              title={t('plan.form.regenerate')}
              onPress={handleRegenerate}
              IconLeft={() => (
                <Ionicons
                  name="refresh"
                  size={20}
                  color="#fff"
                  style={{ marginRight: 8 }}
                />
              )}
            />
            <CustomButton
              title={t('common.edit')}
              onPress={handleEdit}
              bgVariant="secondary"
              IconLeft={() => (
                <Ionicons
                  name="create-outline"
                  size={20}
                  color={isDark ? '#fff' : '#000'}
                  style={{ marginRight: 8 }}
                />
              )}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

