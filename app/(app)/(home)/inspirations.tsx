import React, { useState, useCallback } from 'react';
import {
  View,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, Stack } from 'expo-router';
import { CustomText } from '@ui/display';
import { useTheme } from '@ui/context';
import { TripCard } from '@ui/cards';
import { useGetTripsQuery } from '@api';
import { useRefresh } from '@hooks/useRefresh';

type FilterType = 'all' | 'nature' | 'adventure' | 'culture' | 'relaxation';

export default function InspirationsScreen() {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const router = useRouter();
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('all');

  // Fetch all trips - filter for public/shareable trips on client side
  // TODO: Add isPublic filter to GraphQL query when backend supports it
  const { data: tripsData, loading, error, refetch } = useGetTripsQuery({
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all',
  });

  const { refreshing, onRefresh } = useRefresh(refetch);

  // Filter trips: only show public/shareable trips (for now, show all trips)
  // When backend supports isPublic field, filter: trip.isPublic === true
  const allTrips = (tripsData?.getTrips || []).filter((_trip: any) => {
    // For now, show all trips as inspirations
    // TODO: Filter by trip.isPublic === true when backend supports it
    return true;
  });

  // Simple filter by destination/category (client-side filtering)
  // TODO: Replace with proper category/tag filtering when backend supports it
  const filteredTrips = allTrips.filter((trip: any) => {
    if (selectedFilter === 'all') return true;
    // Simple keyword matching for now
    const destination = (trip.destination || '').toLowerCase();
    const description = (trip.description || '').toLowerCase();
    const preferences = (trip.preferences || '').toLowerCase();
    const searchText = `${destination} ${description} ${preferences}`;
    
    const filterKeywords: Record<FilterType, string[]> = {
      all: [],
      nature: ['nature', 'forest', 'mountain', 'hiking', 'outdoor', 'wildlife'],
      adventure: ['adventure', 'trekking', 'hiking', 'explore', 'active'],
      culture: ['culture', 'heritage', 'history', 'traditional', 'local'],
      relaxation: ['beach', 'relax', 'spa', 'peaceful', 'quiet'],
    };
    
    const keywords = filterKeywords[selectedFilter] || [];
    return keywords.some(keyword => searchText.includes(keyword));
  });

  const handleTripPress = useCallback((tripId: string) => {
    router.push(`/(app)/(trips)/${tripId}` as any);
  }, [router]);

  const filters: { id: FilterType; label: string; translationKey: string }[] = [
    { id: 'all', label: 'All', translationKey: 'explore.categories.all' },
    { id: 'nature', label: 'Nature', translationKey: 'explore.categories.nature' },
    { id: 'adventure', label: 'Adventure', translationKey: 'explore.categories.adventure' },
    { id: 'culture', label: 'Culture', translationKey: 'explore.categories.culture' },
    { id: 'relaxation', label: 'Relaxation', translationKey: 'explore.categories.relaxation' },
  ];

  const renderEmpty = () => (
    <View className="flex-1 items-center justify-center px-6 py-20">
      <Ionicons name="compass-outline" size={64} color={isDark ? '#6b7280' : '#9ca3af'} />
      <CustomText weight="bold" className="mb-2 mt-4 text-center text-lg text-gray-800 dark:text-gray-300">
        {t('explore.noShareableTrips') || 'No shareable trips yet'}
      </CustomText>
      <CustomText className="text-center text-base text-gray-600 dark:text-gray-400">
        {t('explore.noShareableTripsDescription') || 'Check back later for inspiring trip ideas from the community'}
      </CustomText>
    </View>
  );

  return (
    <View className="flex-1 bg-white dark:bg-black">
      <Stack.Screen
        options={{
          title: t('feed.inspirations'),
          headerShown: true,
          headerLargeTitle: false,
        }}
      />

      {/* Filter tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="border-b border-gray-200 dark:border-neutral-800"
        contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 12 }}
      >
        <View className="flex-row gap-2">
          {filters.map((filter) => (
            <TouchableOpacity
              key={filter.id}
              onPress={() => setSelectedFilter(filter.id)}
              className={`rounded-full px-4 py-2 ${
                selectedFilter === filter.id
                  ? 'bg-primary'
                  : 'bg-gray-100 dark:bg-neutral-800'
              }`}
              activeOpacity={0.7}
            >
              <CustomText
                className={`text-xs ${
                  selectedFilter === filter.id
                    ? 'text-white'
                    : 'text-gray-700 dark:text-gray-300'
                }`}
                weight={selectedFilter === filter.id ? 'medium' : 'regular'}
              >
                {t(filter.translationKey, { defaultValue: filter.label })}
              </CustomText>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Trips list */}
      {loading && filteredTrips.length === 0 ? (
        <View className="flex-1 items-center justify-center py-20">
          <Ionicons name="hourglass-outline" size={48} color={isDark ? '#6b7280' : '#9ca3af'} />
          <CustomText className="mt-4 text-gray-600 dark:text-gray-400">
            {t('common.loading')}
          </CustomText>
        </View>
      ) : error && filteredTrips.length === 0 ? (
        <View className="flex-1 items-center justify-center px-6 py-20">
          <Ionicons name="warning-outline" size={64} color="#ef4444" />
          <CustomText weight="bold" className="mb-2 mt-4 text-center text-lg text-gray-800 dark:text-gray-300">
            {t('common.error')}
          </CustomText>
          <CustomText className="text-center text-base text-gray-600 dark:text-gray-400">
            {(error as any)?.message || t('common.error')}
          </CustomText>
        </View>
      ) : filteredTrips.length === 0 ? (
        renderEmpty()
      ) : (
        <FlatList
          data={filteredTrips}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TripCard
              trip={item}
              onPress={() => handleTripPress(item.id)}
            />
          )}
          contentContainerStyle={{ padding: 16 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={renderEmpty}
        />
      )}
    </View>
  );
}
