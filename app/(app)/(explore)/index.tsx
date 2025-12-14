import { useState, useCallback } from 'react';
import { View, TouchableOpacity, FlatList, ScrollView, RefreshControl } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { CustomText } from '@ui/display';
import { LoadingState, ErrorState, EmptyState } from '@ui/feedback';
import { PlaceCard, TripCard } from '@ui/cards';
import { useTheme } from '@ui/context';
import { 
  useSearchSemanticQuery, 
  useGetTrendingQuery,
  useGetPlacesQuery,
  useGetTripsQuery 
} from '@api';
import { useDebounce } from '@hooks/useDebounce';
import { useRefresh } from '@hooks/useRefresh';
import { SearchBar } from '@ui/forms';
import { TabBar } from '@ui/layout';
import { CreateFAB } from '@ui/components';

type TabType = 'discover' | 'tours' | 'places' | 'trips'; // 'tours' tab now shows hosted trips

export default function ExploreScreen() {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const router = useRouter();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<TabType>('discover');
  const debouncedSearch = useDebounce(searchQuery, 400);

  // Semantic search (when user types)
  const { data: searchData, loading: searchLoading, error: searchError, refetch: refetchSearch } = useSearchSemanticQuery({
    variables: { query: debouncedSearch || '', first: 30 },
    skip: !debouncedSearch || debouncedSearch.length < 2,
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all',
    notifyOnNetworkStatusChange: true,
  } as any);

  // Trending topics (KV-backed)
  const { data: trendingData, loading: trendingLoading, refetch: refetchTrending } = useGetTrendingQuery({
    variables: { type: 'TOPIC' as any, window: 'H1' as any, limit: 12 },
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all',
    notifyOnNetworkStatusChange: true,
  } as any);

  // Tab data queries
  const { data: toursData, loading: toursLoading, error: toursError, refetch: refetchTours } = useGetTripsQuery({
    variables: { isHosted: true },
    skip: activeTab !== 'tours',
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all',
    notifyOnNetworkStatusChange: true,
  });

  const { data: placesData, loading: placesLoading, error: placesError, refetch: refetchPlaces } = useGetPlacesQuery({
    variables: { limit: 20 },
    skip: activeTab !== 'places',
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all',
    notifyOnNetworkStatusChange: true,
  });

  const { data: tripsData, loading: tripsLoading, error: tripsError, refetch: refetchTrips } = useGetTripsQuery({
    skip: activeTab !== 'trips',
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all',
    notifyOnNetworkStatusChange: true,
  });

  // Refresh hooks
  const { refreshing: toursRefreshing, onRefresh: onRefreshTours } = useRefresh(refetchTours);
  const { refreshing: placesRefreshing, onRefresh: onRefreshPlaces } = useRefresh(refetchPlaces);
  const { refreshing: tripsRefreshing, onRefresh: onRefreshTrips } = useRefresh(refetchTrips);
  const { refreshing: trendingRefreshing, onRefresh: onRefreshTrending } = useRefresh(refetchTrending);

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
      router.push(`/(app)/(home)/${entityId}` as any);
    } else if (entityType === 'TRIP') {
      // All trips (including hosted) use the same route
      router.push(`/(app)/(trips)/${entityId}` as any);
    } else if (entityType === 'PLACE') {
      router.push(`/(app)/(explore)/places/${entityId}` as any);
    } else if (entityType === 'LOCATION') {
      router.push(`/(app)/(explore)/locations/${entityId}` as any);
    }
  }, [router]);

  const handleTrendingPress = useCallback((topic: string) => {
    setSearchQuery(topic);
  }, []);

  const handlePlacePress = useCallback((placeId: string) => {
    router.push(`/(app)/(explore)/places/${placeId}` as any);
  }, [router]);

  const handleTripPress = useCallback((tripId: string) => {
    // Handle both regular trips and hosted trips (unified Trip model)
    router.push(`/(app)/(trips)/${tripId}` as any);
  }, [router]);

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
      // Handle both regular trips and hosted trips
      if ((entity as any)?.isHosted) {
        title = (entity as any)?.title || t('explore.untitledTour');
        subtitle = (entity as any)?.location || t('explore.tour');
        icon = 'map-outline';
      } else {
        title = entity?.destination || t('explore.untitledTrip');
        subtitle = entity?.status || t('explore.trip');
        icon = 'airplane-outline';
      }
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
        className="border-b border-gray-100 px-4 py-3 dark:border-neutral-800"
        activeOpacity={0.7}
      >
        <View className="flex-row items-center">
          <View className="mr-3 size-10 items-center justify-center rounded-full bg-gray-100 dark:bg-neutral-800">
            <Ionicons name={icon} size={20} color={isDark ? '#9ca3af' : '#6b7280'} />
          </View>
          <View className="flex-1">
            <CustomText weight="medium" className="mb-0.5 text-base text-gray-900 dark:text-gray-100" numberOfLines={2}>
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

  const renderTabContent = () => {
    // Tours Tab
    if (activeTab === 'tours') {
      const tours = toursData?.getTrips || [];
      const isInitialLoad = !tours.length && toursLoading;

      // Data-first: show data if it exists, only show loading if no data
      if (tours.length > 0) {
        return (
          <FlatList
            data={tours}
            keyExtractor={(item: any) => `tour-${item.id}`}
            renderItem={({ item }: any) => (
              <TripCard
                trip={item}
                onPress={() => handleTripPress(item.id)}
              />
            )}
            contentContainerStyle={{ padding: 16 }}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={toursRefreshing}
                onRefresh={onRefreshTours}
              />
            }
          />
        );
      }

      if (isInitialLoad) {
        return <LoadingState message={t('common.loading')} className="py-20" />;
      }

      if (toursError) {
        return (
          <ErrorState
            title={t('common.error')}
            message={toursError.message || t('explore.error.message')}
            onRetry={refetchTours}
            className="py-20"
          />
        );
      }

      if (tours.length === 0) {
        return (
          <EmptyState
            icon="map-outline"
            title={t('explore.empty.tours')}
            description={t('explore.empty.toursDescription')}
            iconSize={64}
            className="py-20"
          />
        );
      }

    }

    // Places Tab
    if (activeTab === 'places') {
      const places = placesData?.getPlaces || [];
      const isInitialLoad = !places.length && placesLoading;

      // Data-first: show data if it exists, only show loading if no data
      if (places.length > 0) {
        return (
          <FlatList
            data={places}
            keyExtractor={(item: any) => `place-${item.id}`}
            renderItem={({ item }: any) => (
              <PlaceCard
                place={item}
                onPress={() => handlePlacePress(item.id)}
                variant="detailed"
              />
            )}
            contentContainerStyle={{ padding: 16 }}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={placesRefreshing}
                onRefresh={onRefreshPlaces}
              />
            }
          />
        );
      }

      if (isInitialLoad) {
        return <LoadingState message={t('common.loading')} className="py-20" />;
      }

      if (placesError) {
        return (
          <ErrorState
            title={t('common.error')}
            message={placesError.message || t('explore.error.message')}
            onRetry={refetchPlaces}
            className="py-20"
          />
        );
      }

      if (places.length === 0) {
        return (
          <EmptyState
            icon="location-outline"
            title={t('explore.empty.places')}
            description={t('explore.empty.placesDescription')}
            iconSize={64}
            className="py-20"
          />
        );
      }

    }

    // Trips Tab
    if (activeTab === 'trips') {
      const trips = tripsData?.getTrips || [];
      const isInitialLoad = !trips.length && tripsLoading;

      // Data-first: show data if it exists, only show loading if no data
      if (trips.length > 0) {
        return (
          <FlatList
            data={trips}
            keyExtractor={(item: any) => `trip-${item.id}`}
            renderItem={({ item }: any) => (
              <TripCard
                trip={item}
                onPress={() => handleTripPress(item.id)}
              />
            )}
            contentContainerStyle={{ padding: 16 }}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={tripsRefreshing}
                onRefresh={onRefreshTrips}
              />
            }
          />
        );
      }

      if (isInitialLoad) {
        return <LoadingState message={t('common.loading')} className="py-20" />;
      }

      if (tripsError) {
        return (
          <ErrorState
            title={t('common.error')}
            message={tripsError.message || t('explore.error.message')}
            onRetry={refetchTrips}
            className="py-20"
          />
        );
      }

      if (trips.length === 0) {
        return (
          <EmptyState
            icon="airplane-outline"
            title={t('explore.empty.trips')}
            description={t('explore.empty.tripsDescription')}
            iconSize={64}
            className="py-20"
          />
        );
      }

    }

    // Discover Tab (default)
    const isTrendingInitialLoad = !trendingTopics.length && trendingLoading;

    return (
      <ScrollView 
        showsVerticalScrollIndicator={false} 
        className="flex-1"
        refreshControl={
          <RefreshControl
            refreshing={trendingRefreshing}
            onRefresh={onRefreshTrending}
          />
        }
      >
        {/* Trending Topics */}
        <View className="px-4 py-6">
          <View className="mb-3 flex-row items-center justify-between">
            <CustomText weight="bold" className="text-xl text-gray-900 dark:text-gray-100">
              {t('explore.trending')}
            </CustomText>
          </View>
          <CustomText className="mb-4 text-sm text-gray-600 dark:text-gray-400">
            {t('explore.trendingDescription')}
          </CustomText>

          {isTrendingInitialLoad ? (
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
                    className="flex-row items-center rounded-full border border-primary/20 bg-primary/10 px-4 py-2.5"
                    activeOpacity={0.7}
                  >
                    <CustomText weight="medium" className="mr-1.5 text-primary">
                      #{label}
                    </CustomText>
                    {score > 1 && (
                      <View className="rounded-full bg-primary/20 px-1.5 py-0.5">
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
        <View className="border-t border-gray-200 px-4 py-6 dark:border-neutral-800">
          <CustomText weight="bold" className="mb-4 text-xl text-gray-900 dark:text-gray-100">
            {t('explore.discover')}
          </CustomText>
          
          {/* Shareable Trips - Featured */}
          <TouchableOpacity
            onPress={() => router.push('/(app)/(explore)/shareable-trips' as any)}
            className="mb-3 flex-row items-center rounded-xl border-2 p-4"
            style={{ 
              backgroundColor: isDark ? '#1e3a5f' : '#eff6ff',
              borderColor: isDark ? '#3b82f6' : '#60a5fa'
            }}
            activeOpacity={0.7}
          >
            <View className="mr-4 size-12 items-center justify-center rounded-full" style={{ backgroundColor: '#3b82f6' }}>
              <Ionicons name="compass" size={24} color="#fff" />
            </View>
            <View className="flex-1">
              <CustomText weight="bold" className="mb-0.5 text-base" style={{ color: isDark ? '#60a5fa' : '#1e40af' }}>
                {t('explore.shareableTrips')}
              </CustomText>
              <CustomText className="text-sm" style={{ color: isDark ? '#93c5fd' : '#3b82f6' }}>
                {t('explore.shareableTripsDescription')}
              </CustomText>
            </View>
            <Ionicons name="chevron-forward" size={20} color={isDark ? '#60a5fa' : '#3b82f6'} />
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={() => setActiveTab('tours')}
            className="mb-3 flex-row items-center rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-neutral-800 dark:bg-neutral-900"
            activeOpacity={0.7}
          >
            <View className="mr-4 size-12 items-center justify-center rounded-full bg-primary/10">
              <Ionicons name="map" size={24} color="#3b82f6" />
            </View>
            <View className="flex-1">
              <CustomText weight="bold" className="mb-0.5 text-base text-gray-900 dark:text-gray-100">
                {t('explore.browseTours')}
              </CustomText>
              <CustomText className="text-sm text-gray-600 dark:text-gray-400">
                {t('explore.browseToursDescription')}
              </CustomText>
            </View>
            <Ionicons name="chevron-forward" size={20} color={isDark ? '#6b7280' : '#9ca3af'} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setActiveTab('places')}
            className="mb-3 flex-row items-center rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-neutral-800 dark:bg-neutral-900"
            activeOpacity={0.7}
          >
            <View className="mr-4 size-12 items-center justify-center rounded-full bg-primary/10">
              <Ionicons name="location" size={24} color="#3b82f6" />
            </View>
            <View className="flex-1">
              <CustomText weight="bold" className="mb-0.5 text-base text-gray-900 dark:text-gray-100">
                {t('explore.browsePlaces')}
              </CustomText>
              <CustomText className="text-sm text-gray-600 dark:text-gray-400">
                {t('explore.browsePlacesDescription')}
              </CustomText>
            </View>
            <Ionicons name="chevron-forward" size={20} color={isDark ? '#6b7280' : '#9ca3af'} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setActiveTab('trips')}
            className="mb-3 flex-row items-center rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-neutral-800 dark:bg-neutral-900"
            activeOpacity={0.7}
          >
            <View className="mr-4 size-12 items-center justify-center rounded-full bg-primary/10">
              <Ionicons name="airplane" size={24} color="#3b82f6" />
            </View>
            <View className="flex-1">
              <CustomText weight="bold" className="mb-0.5 text-base text-gray-900 dark:text-gray-100">
                {t('explore.browseTrips')}
              </CustomText>
              <CustomText className="text-sm text-gray-600 dark:text-gray-400">
                {t('explore.browseTripsDescription')}
              </CustomText>
            </View>
            <Ionicons name="chevron-forward" size={20} color={isDark ? '#6b7280' : '#9ca3af'} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push('/(app)/(explore)/map-comparison' as any)}
            className="flex-row items-center rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-neutral-800 dark:bg-neutral-900"
            activeOpacity={0.7}
          >
            <View className="mr-4 size-12 items-center justify-center rounded-full bg-primary/10">
              <Ionicons name="globe" size={24} color="#3b82f6" />
            </View>
            <View className="flex-1">
              <CustomText weight="bold" className="mb-0.5 text-base text-gray-900 dark:text-gray-100">
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

  const renderContent = () => {
    // Searching state (overrides tabs)
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
            <View className="bg-gray-50 px-4 py-3 dark:bg-neutral-900">
              <CustomText className="text-sm text-gray-600 dark:text-gray-400">
                {t('explore.resultsCount', { count: searchResults.length })}
              </CustomText>
            </View>
          }
        />
      );
    }

    // Tab content
    return renderTabContent();
  };

  return (
    <View className="flex-1 bg-white dark:bg-black">
      <Stack.Screen options={{ title: t('explore.title'), headerShown: false }} />
      
      {/* Compact Header */}
      <View className="border-b border-gray-200 bg-white px-4 pb-3 pt-12 dark:border-neutral-800 dark:bg-black">
        <View className="mb-3 flex-row items-center justify-between">
          <CustomText weight="bold" className="text-2xl text-black dark:text-white">
            {t('explore.title')}
          </CustomText>
        </View>

        {/* Search Bar */}
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder={t('explore.searchPlaceholder')}
          className="mb-3"
        />

        {/* Tabs (hidden when searching) */}
        {!debouncedSearch && (
          <TabBar
            tabs={[
              { id: 'discover', label: t('explore.categories.discover') },
              { id: 'tours', label: t('explore.categories.tours') },
              { id: 'places', label: t('explore.categories.places') },
              { id: 'trips', label: t('explore.categories.trips') },
            ]}
            activeTab={activeTab}
            onTabChange={(tabId) => setActiveTab(tabId as TabType)}
            variant="segmented"
          />
        )}
      </View>

      {/* Content */}
      {renderContent()}

      {/* FAB */}
      <CreateFAB
        options={[
          {
            id: 'experience',
            label: 'Create Experience',
            translationKey: 'feed.newPost.title',
            icon: 'create-outline',
            createRoute: '/(app)/compose/experience',
          },
          {
            id: 'trip',
            label: 'Create Trip',
            translationKey: 'plan.createPlan',
            icon: 'airplane-outline',
            createRoute: '/(app)/compose/trip',
          },
          {
            id: 'place',
            label: 'Add Place',
            translationKey: 'places.addPlace',
            icon: 'location-outline',
            createRoute: '/(app)/compose/place',
          },
        ]}
      />
    </View>
  );
}
