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
import Colors from '@constants/Colors';
import { useGetToursQuery } from '@api';

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
            ${tour?.price || 0}
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
          {tour?.rating || 0} ({tour?.reviews || 0})
        </CustomText>
      </View>

      <CustomText className="text-sm text-gray-500 dark:text-gray-500" numberOfLines={2}>
        {tour?.description || tour?.shortDescription || '—'}
      </CustomText>
    </TouchableOpacity>
  );
};

export default function ToursScreen() {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const router = useRouter();
  const { data, loading, error, refetch } = useGetToursQuery({
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all',
  });
  const tours = useMemo(() => data?.getTours ?? [], [data]);
  const [refreshing, setRefreshing] = useState(false);
  
  const onRefresh = useCallback(async () => {
    try {
      setRefreshing(true);
      await refetch();
    } finally {
      setRefreshing(false);
    }
  }, [refetch]);

  const handleCreateTour = () => {
    router.push('/(app)/(feed)/tours/new' as any);
  };

  const handleTourPress = (tourId: string) => {
    router.push(`/(app)/(feed)/tours/${tourId}` as any);
  };

  return (
    <View className="flex-1 bg-white dark:bg-black">
      <Stack.Screen options={{ title: t('tours.title') || 'Tours', headerShown: false }} />

      <FlatList
        data={tours}
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
              {t('tours.title') || 'Tours'}
            </CustomText>
            <CustomText className="text-base text-gray-600 dark:text-gray-400">
              {t('tours.description') || 'Discover amazing tours'}
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
                {String((error as any)?.message || t('tours.errors.loadFailed') || 'Failed to load tours')}
              </CustomText>
            </View>
          ) : (
            <View className="flex-1 items-center justify-center px-6 py-12">
              <Ionicons name="map-outline" size={80} color={isDark ? '#4b5563' : '#d1d5db'} />
              <CustomText
                weight="bold"
                className="text-xl text-gray-800 dark:text-gray-300 mt-4 mb-2 text-center"
              >
                {t('tours.emptyState') || 'No tours yet'}
              </CustomText>
              <CustomText className="text-base text-gray-600 dark:text-gray-400 text-center">
                {t('tours.emptyDescription') || t('tours.description') || 'Create your first tour'}
              </CustomText>
            </View>
          )
        }
        contentContainerStyle={{ padding: 24, paddingTop: 0 }}
      />

      {/* Floating Action Button */}
      <TouchableOpacity
        onPress={handleCreateTour}
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

