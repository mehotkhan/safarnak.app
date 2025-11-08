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
import { CustomText } from '@components/ui/CustomText';
import { useTheme } from '@components/context/ThemeContext';
import { useGetPlacesQuery } from '@api';
import { useAppSelector } from '@store/hooks';
import Colors from '@constants/Colors';

interface PlaceCardProps {
  place: any;
  onPress: () => void;
  isDark: boolean;
  t: any;
}

const PlaceCard = ({ place, onPress, isDark, t }: PlaceCardProps) => {
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
            {place?.name || '—'}
          </CustomText>
          <View className="flex-row items-center">
            <Ionicons
              name="location-outline"
              size={16}
              color={isDark ? '#9ca3af' : '#6b7280'}
            />
            <CustomText className="text-sm text-gray-600 dark:text-gray-400 ml-2">
              {place?.location || '—'}
            </CustomText>
          </View>
        </View>
        <View className="flex-row items-center">
          <Ionicons name="star" size={16} color="#fbbf24" />
          <CustomText className="text-sm text-gray-600 dark:text-gray-400 ml-1">
            {place?.rating?.toFixed(1) || '0.0'}
          </CustomText>
        </View>
      </View>

      <CustomText className="text-sm text-gray-500 dark:text-gray-500" numberOfLines={2}>
        {place?.description || '—'}
      </CustomText>

      {place?.isOpen !== undefined && (
        <View className="flex-row items-center mt-2">
          <View className={`w-2 h-2 rounded-full mr-2 ${place.isOpen ? 'bg-green-500' : 'bg-red-500'}`} />
          <CustomText className="text-xs text-gray-500 dark:text-gray-400">
            {place.isOpen ? (t('places.open') || 'Open') : (t('places.closed') || 'Closed')}
          </CustomText>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default function PlacesManagementScreen() {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const router = useRouter();
  const { user } = useAppSelector(state => state.auth);
  const [refreshing, setRefreshing] = useState(false);

  const { data, loading, error, refetch } = useGetPlacesQuery({
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all',
  });

  const allPlaces = useMemo(() => data?.getPlaces ?? [], [data]);

  // Filter by current user (ownerId)
  const myPlaces = useMemo(() => {
    if (!user?.id) return [];
    return allPlaces.filter((place: any) => place.ownerId === user.id);
  }, [allPlaces, user?.id]);

  const onRefresh = useCallback(async () => {
    try {
      setRefreshing(true);
      await refetch();
    } finally {
      setRefreshing(false);
    }
  }, [refetch]);

  const handlePlacePress = useCallback((placeId: string) => {
    router.push(`/(app)/(explore)/places/${placeId}` as any);
  }, [router]);

  const handleCreatePlace = useCallback(() => {
    router.push('/(app)/(trips)/places/new' as any);
  }, [router]);

  return (
    <View className="flex-1 bg-white dark:bg-black">
      <Stack.Screen options={{ title: t('trips.tabs.places') || 'My Places', headerShown: false }} />

      {loading && myPlaces.length === 0 ? (
        <View className="flex-1 items-center justify-center py-20">
          <ActivityIndicator size="large" color={isDark ? Colors.dark.primary : Colors.light.primary} />
          <CustomText className="text-gray-500 dark:text-gray-400 mt-4">
            {t('common.loading')}
          </CustomText>
        </View>
      ) : error && myPlaces.length === 0 ? (
        <View className="flex-1 items-center justify-center px-6 py-20">
          <Ionicons name="warning-outline" size={64} color={isDark ? '#ef4444' : '#dc2626'} />
          <CustomText weight="bold" className="text-lg text-gray-800 dark:text-gray-300 mt-4 mb-2 text-center">
            {t('common.error')}
          </CustomText>
          <CustomText className="text-base text-gray-600 dark:text-gray-400 text-center">
            {String((error as any)?.message || t('places.errors.loadFailed') || 'Failed to load places')}
          </CustomText>
        </View>
      ) : myPlaces.length === 0 ? (
        <View className="flex-1 items-center justify-center px-6 py-20">
          <Ionicons name="location-outline" size={80} color={isDark ? '#4b5563' : '#d1d5db'} />
          <CustomText weight="bold" className="text-xl text-gray-800 dark:text-gray-300 mt-4 mb-2 text-center">
            {t('trips.tabs.placesEmpty') || 'No places yet'}
          </CustomText>
          <CustomText className="text-base text-gray-600 dark:text-gray-400 text-center mb-4">
            {t('trips.tabs.placesEmptyDescription') || 'Create your first place'}
          </CustomText>
          <TouchableOpacity
            onPress={handleCreatePlace}
            className="bg-primary px-6 py-3 rounded-lg"
          >
            <CustomText className="text-white" weight="medium">
              {t('trips.tabs.placesCreate') || 'Create Place'}
            </CustomText>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={myPlaces}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <PlaceCard
              place={item}
              onPress={() => handlePlacePress(item.id)}
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
                {t('trips.tabs.places') || 'My Places'}
              </CustomText>
              <CustomText className="text-base text-gray-600 dark:text-gray-400">
                {t('trips.tabs.placesDescription') || 'Manage your places'}
              </CustomText>
            </View>
          }
          contentContainerStyle={{ padding: 24, paddingTop: 0 }}
        />
      )}
    </View>
  );
}

