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
import { LocationCard } from '@ui/cards';
import { useGetLocationsQuery } from '@api';
import Colors from '@constants/Colors';

export default function LocationsManagementScreen() {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);

  // GraphQL query for locations
  const { data, loading, error, refetch } = useGetLocationsQuery({
    variables: { limit: 100 },
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all',
  });

  const locations = useMemo(() => data?.getLocations ?? [], [data]);

  const onRefresh = useCallback(async () => {
    try {
      setRefreshing(true);
      await refetch();
    } finally {
      setRefreshing(false);
    }
  }, [refetch]);

  const handleLocationPress = useCallback((locationId: string) => {
    router.push(`/(app)/(explore)/locations/${locationId}` as any);
  }, [router]);

  const handleCreateLocation = useCallback(() => {
    router.push('/(app)/(trips)/locations/new' as any);
  }, [router]);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white dark:bg-black">
        <ActivityIndicator size="large" color={isDark ? Colors.dark.primary : Colors.light.primary} />
        <CustomText className="mt-4 text-gray-500 dark:text-gray-400">
          {t('common.loading')}
        </CustomText>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center bg-white px-6 dark:bg-black">
        <Ionicons name="warning-outline" size={64} color={isDark ? '#ef4444' : '#dc2626'} />
        <CustomText weight="bold" className="mb-2 mt-4 text-center text-lg text-gray-800 dark:text-gray-300">
          {t('common.error')}
        </CustomText>
        <CustomText className="text-center text-base text-gray-600 dark:text-gray-400">
          {String((error as any)?.message || t('common.errorMessage') || 'An error occurred')}
        </CustomText>
        <TouchableOpacity
          onPress={() => refetch()}
          className="mt-4 rounded-lg bg-primary px-6 py-3"
        >
          <CustomText className="text-white" weight="medium">
            {t('common.retry') || 'Retry'}
          </CustomText>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white dark:bg-black">
      <Stack.Screen options={{ title: t('trips.tabs.locations') || 'Locations', headerShown: false }} />

      {locations.length === 0 ? (
        <View className="flex-1 items-center justify-center px-6 py-20">
          <Ionicons name="globe-outline" size={80} color={isDark ? '#4b5563' : '#d1d5db'} />
          <CustomText weight="bold" className="mb-2 mt-4 text-center text-xl text-gray-800 dark:text-gray-300">
            {t('trips.tabs.locationsEmpty') || 'No locations yet'}
          </CustomText>
          <CustomText className="mb-4 text-center text-base text-gray-600 dark:text-gray-400">
            {t('trips.tabs.locationsEmptyDescription') || 'Create your first location'}
          </CustomText>
          <TouchableOpacity
            onPress={handleCreateLocation}
            className="rounded-lg bg-primary px-6 py-3"
          >
            <CustomText className="text-white" weight="medium">
              {t('trips.tabs.locationsCreate') || 'Create Location'}
            </CustomText>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={locations}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <LocationCard
              location={item}
              onPress={() => handleLocationPress(item.id)}
            />
          )}
          refreshing={refreshing}
          onRefresh={onRefresh}
          ListHeaderComponent={
            <View className="mb-3 border-b border-gray-200 bg-white px-6 pb-4 pt-12 dark:border-neutral-800 dark:bg-black">
              <CustomText
                weight="bold"
                className="mb-2 text-3xl text-black dark:text-white"
              >
                {t('trips.tabs.locations') || 'Locations'}
              </CustomText>
              <CustomText className="text-base text-gray-600 dark:text-gray-400">
                {t('trips.tabs.locationsDescription') || 'Manage locations archive'}
              </CustomText>
            </View>
          }
          contentContainerStyle={{ padding: 24, paddingTop: 0 }}
        />
      )}
    </View>
  );
}

