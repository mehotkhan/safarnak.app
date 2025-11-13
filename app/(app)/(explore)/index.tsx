import { useState, useCallback } from 'react';
import { View, TouchableOpacity, FlatList, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { CustomText } from '@ui/display';
import { LoadingState, ErrorState, EmptyState } from '@ui/feedback';
import { useTheme } from '@ui/context';
import { useSearchSemanticQuery, useGetTrendingQuery } from '@api';
import { useDebounce } from '@hooks/useDebounce';
import { SearchBar } from '@ui/forms';

export default function ExploreScreen() {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const router = useRouter();
  
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 400);

  // Semantic search (when user types)
  const { data: searchData, loading: searchLoading, error: searchError, refetch: refetchSearch } = useSearchSemanticQuery({
    variables: { query: debouncedSearch || '', first: 30 },
    skip: !debouncedSearch || debouncedSearch.length < 2,
    fetchPolicy: 'cache-and-network',
  } as any);

  // Trending topics (KV-backed)
  const { data: trendingData, loading: trendingLoading } = useGetTrendingQuery({
    variables: { type: 'TOPIC' as any, window: 'H1' as any, limit: 12 },
    fetchPolicy: 'cache-and-network',
  } as any);

  const searchResults = (searchData?.searchSemantic?.edges || [])
    .map((e: any) => e?.node)
    .filter(Boolean);

  const trendingTopics = (trendingData?.getTrending?.items || [])
    .filter((item: any) => item?.key && item?.score > 0);

  const handleResultPress = useCallback((item: any) => {
    const entityType = item?.entityType;
    const entityId = item?.entityId;
    if (!entityType || !entityId) return;

    if (entityType === 'POST') {
      router.push(`/(app)/(feed)/${entityId}` as any);
    } else if (entityType === 'TRIP') {
      router.push(`/(app)/(trips)/${entityId}` as any);
    } else if (entityType === 'TOUR') {
      router.push(`/(app)/(explore)/tours/${entityId}` as any);
    } else if (entityType === 'PLACE') {
      router.push(`/(app)/(explore)/places/${entityId}` as any);
    } else if (entityType === 'LOCATION') {
      router.push(`/(app)/(explore)/locations/${entityId}` as any);
    }
  }, [router]);

  const handleTrendingPress = useCallback((topic: string) => {
    setSearchQuery(topic);
  }, []);

  const renderSearchResult = useCallback(({ item }: { item: any }) => {
    const entity = item?.entity || {};
    const entityType = item?.entityType || '';
    const actor = item?.actor;

    let title = '';
    let subtitle = '';
    let icon: any = 'document-text-outline';

    if (entityType === 'POST') {
      title = entity?.content?.substring(0, 80) || t('explore.untitled');
      subtitle = actor?.username ? `@${actor.username}` : t('explore.anonymousUser');
      icon = 'chatbubble-outline';
    } else if (entityType === 'TRIP') {
      title = entity?.destination || t('explore.untitledTrip');
      subtitle = entity?.status || t('explore.trip');
      icon = 'airplane-outline';
    } else if (entityType === 'TOUR') {
      title = entity?.title || t('explore.untitledTour');
      subtitle = entity?.location || t('explore.tour');
      icon = 'map-outline';
    } else if (entityType === 'PLACE') {
      title = entity?.name || t('explore.untitledPlace');
      subtitle = entity?.type || t('explore.place');
      icon = 'location-outline';
    } else if (entityType === 'LOCATION') {
      title = entity?.city || entity?.country || t('explore.untitledLocation');
      subtitle = t('explore.location');
      icon = 'globe-outline';
    }

    return (
      <TouchableOpacity
        onPress={() => handleResultPress(item)}
        className="px-4 py-3 border-b border-gray-100 dark:border-neutral-800"
        activeOpacity={0.7}
      >
        <View className="flex-row items-center">
          <View className="w-10 h-10 rounded-full bg-gray-100 dark:bg-neutral-800 items-center justify-center mr-3">
            <Ionicons name={icon} size={20} color={isDark ? '#9ca3af' : '#6b7280'} />
          </View>
          <View className="flex-1">
            <CustomText weight="medium" className="text-base text-gray-900 dark:text-gray-100 mb-0.5" numberOfLines={2}>
              {title}
            </CustomText>
            <CustomText className="text-sm text-gray-500 dark:text-gray-400">
              {subtitle}
            </CustomText>
          </View>
          <Ionicons name="chevron-forward" size={18} color={isDark ? '#6b7280' : '#9ca3af'} />
        </View>
      </TouchableOpacity>
    );
  }, [t, isDark, handleResultPress]);

  const renderContent = () => {
    // Searching state
    if (debouncedSearch && debouncedSearch.length >= 2) {
      if (searchLoading && searchResults.length === 0) {
        return <LoadingState message={t('explore.searching')} className="py-20" />;
      }

      if (searchError) {
        return (
          <ErrorState
            title={t('common.error')}
            message={searchError.message || t('explore.searchError')}
            onRetry={() => refetchSearch()}
            className="py-20"
          />
        );
      }

      if (searchResults.length === 0) {
        return (
          <EmptyState
            icon="search-outline"
            title={t('explore.noResults')}
            description={t('explore.noResultsDescription')}
            iconSize={64}
            className="py-20"
          />
        );
      }

      return (
        <FlatList
          data={searchResults}
          keyExtractor={(item, index) => `result-${item?.entityId || index}`}
          renderItem={renderSearchResult}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <View className="px-4 py-3 bg-gray-50 dark:bg-neutral-900">
              <CustomText className="text-sm text-gray-600 dark:text-gray-400">
                {t('explore.resultsCount', { count: searchResults.length })}
              </CustomText>
            </View>
          }
        />
      );
    }

    // Default state: Trending topics
    return (
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        {/* Trending Topics */}
        <View className="px-4 py-6">
          <CustomText weight="bold" className="text-xl text-gray-900 dark:text-gray-100 mb-3">
            {t('explore.trending')}
          </CustomText>
          <CustomText className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            {t('explore.trendingDescription')}
          </CustomText>

          {trendingLoading ? (
            <LoadingState message={t('common.loading')} className="py-8" />
          ) : trendingTopics.length > 0 ? (
            <View className="flex-row flex-wrap gap-2">
              {trendingTopics.map((item: any) => {
                const label = item.label?.replace(/^#/, '') || item.key;
                const score = Math.round(item.score || 0);
                return (
                  <TouchableOpacity
                    key={item.key}
                    onPress={() => handleTrendingPress(label)}
                    className="px-4 py-2.5 rounded-full bg-primary/10 border border-primary/20 flex-row items-center"
                    activeOpacity={0.7}
                  >
                    <CustomText weight="medium" className="text-primary mr-1.5">
                      #{label}
                    </CustomText>
                    {score > 1 && (
                      <View className="px-1.5 py-0.5 rounded-full bg-primary/20">
                        <CustomText className="text-xs text-primary" weight="bold">
                          {score}
                        </CustomText>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          ) : (
            <EmptyState
              icon="trending-up-outline"
              title={t('explore.noTrending')}
              description={t('explore.noTrendingDescription')}
              iconSize={48}
              className="py-8"
            />
          )}
        </View>

        {/* Quick Actions */}
        <View className="px-4 py-6 border-t border-gray-200 dark:border-neutral-800">
          <CustomText weight="bold" className="text-xl text-gray-900 dark:text-gray-100 mb-4">
            {t('explore.discover')}
          </CustomText>
          
          <TouchableOpacity
            onPress={() => router.push('/(app)/(explore)/tours' as any)}
            className="flex-row items-center p-4 mb-3 rounded-xl bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800"
            activeOpacity={0.7}
          >
            <View className="w-12 h-12 rounded-full bg-primary/10 items-center justify-center mr-4">
              <Ionicons name="map" size={24} color="#3b82f6" />
            </View>
            <View className="flex-1">
              <CustomText weight="bold" className="text-base text-gray-900 dark:text-gray-100 mb-0.5">
                {t('explore.browseTours')}
              </CustomText>
              <CustomText className="text-sm text-gray-600 dark:text-gray-400">
                {t('explore.browseToursDescription')}
              </CustomText>
            </View>
            <Ionicons name="chevron-forward" size={20} color={isDark ? '#6b7280' : '#9ca3af'} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push('/(app)/(explore)/places' as any)}
            className="flex-row items-center p-4 mb-3 rounded-xl bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800"
            activeOpacity={0.7}
          >
            <View className="w-12 h-12 rounded-full bg-primary/10 items-center justify-center mr-4">
              <Ionicons name="location" size={24} color="#3b82f6" />
            </View>
            <View className="flex-1">
              <CustomText weight="bold" className="text-base text-gray-900 dark:text-gray-100 mb-0.5">
                {t('explore.browsePlaces')}
              </CustomText>
              <CustomText className="text-sm text-gray-600 dark:text-gray-400">
                {t('explore.browsePlacesDescription')}
              </CustomText>
            </View>
            <Ionicons name="chevron-forward" size={20} color={isDark ? '#6b7280' : '#9ca3af'} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push('/(app)/(explore)/map-comparison' as any)}
            className="flex-row items-center p-4 rounded-xl bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800"
            activeOpacity={0.7}
          >
            <View className="w-12 h-12 rounded-full bg-primary/10 items-center justify-center mr-4">
              <Ionicons name="globe" size={24} color="#3b82f6" />
            </View>
            <View className="flex-1">
              <CustomText weight="bold" className="text-base text-gray-900 dark:text-gray-100 mb-0.5">
                {t('explore.mapComparison')}
              </CustomText>
              <CustomText className="text-sm text-gray-600 dark:text-gray-400">
                {t('explore.mapComparisonDescription')}
              </CustomText>
            </View>
            <Ionicons name="chevron-forward" size={20} color={isDark ? '#6b7280' : '#9ca3af'} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  };

  return (
    <View className="flex-1 bg-white dark:bg-black">
      <Stack.Screen options={{ title: t('explore.title'), headerShown: false }} />
      
      {/* Compact Header */}
      <View className="px-4 pt-12 pb-3 bg-white dark:bg-black border-b border-gray-200 dark:border-neutral-800">
        <View className="flex-row items-center justify-between mb-3">
          <CustomText weight="bold" className="text-2xl text-black dark:text-white">
            {t('explore.title')}
          </CustomText>
        </View>

        {/* Search Bar */}
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder={t('explore.searchPlaceholder')}
          className="mb-0"
        />
      </View>

      {/* Content */}
      {renderContent()}
    </View>
  );
}
