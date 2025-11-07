import { CustomText } from '@components/ui/CustomText';
import { Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';
import {
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '@components/context/ThemeContext';
import { useMemo, useCallback, useState } from 'react';
import { useGetPlacesQuery } from '@api';
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
            {place?.rating || 0}
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

export default function PlacesScreen() {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const router = useRouter();
  const { data, loading, error, refetch } = useGetPlacesQuery({
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all',
  });
  const places = useMemo(() => data?.getPlaces ?? [], [data]);
  const [refreshing, setRefreshing] = useState(false);
  
  const onRefresh = useCallback(async () => {
    try {
      setRefreshing(true);
      await refetch();
    } finally {
      setRefreshing(false);
    }
  }, [refetch]);

  const handleCreatePlace = () => {
    router.push('/(app)/(feed)/places/new' as any);
  };

  const handlePlacePress = (placeId: string) => {
    router.push(`/(app)/(feed)/places/${placeId}` as any);
  };

  return (
    <View className="flex-1 bg-white dark:bg-black">
      <Stack.Screen options={{ title: t('places.title') || 'Places', headerShown: false }} />

      <FlatList
        data={places}
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
              {t('places.title') || 'Places'}
            </CustomText>
            <CustomText className="text-base text-gray-600 dark:text-gray-400">
              {t('places.description') || 'Discover amazing places'}
            </CustomText>
          </View>
        }
        ListEmptyComponent={
          loading ? (
            <View className="flex-1 items-center justify-center py-16">
              <ActivityIndicator size="large" color={isDark ? Colors.dark.primary : Colors.light.primary} />
            </View>
          ) : error ? (
            <View className="flex-1 items-center justify-center px-6 py-12">
              <Ionicons name="warning-outline" size={64} color={isDark ? '#ef4444' : '#dc2626'} />
              <CustomText weight="bold" className="text-lg text-gray-800 dark:text-gray-300 mt-4 mb-2 text-center">
                {t('common.error')}
              </CustomText>
              <CustomText className="text-base text-gray-600 dark:text-gray-400 text-center">
                {String((error as any)?.message || t('places.errors.loadFailed') || 'Failed to load places')}
              </CustomText>
            </View>
          ) : (
            <View className="flex-1 items-center justify-center px-6 py-12">
              <Ionicons name="location-outline" size={80} color={isDark ? '#4b5563' : '#d1d5db'} />
              <CustomText
                weight="bold"
                className="text-xl text-gray-800 dark:text-gray-300 mt-4 mb-2 text-center"
              >
                {t('places.emptyState') || 'No places yet'}
              </CustomText>
              <CustomText className="text-base text-gray-600 dark:text-gray-400 text-center">
                {t('places.emptyDescription') || t('places.description') || 'Create your first place'}
              </CustomText>
            </View>
          )
        }
        contentContainerStyle={{ padding: 24, paddingTop: 0 }}
      />

      {/* Floating Action Button */}
      <TouchableOpacity
        onPress={handleCreatePlace}
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

