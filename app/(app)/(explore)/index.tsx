import { useState, useMemo, useCallback } from 'react';
import {
  View,
  FlatList,
  RefreshControl,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useRouter, Stack } from 'expo-router';
import { CustomText } from '@components/ui/CustomText';
import { LoadingState } from '@components/ui/LoadingState';
import { ErrorState } from '@components/ui/ErrorState';
import { EmptyState } from '@components/ui/EmptyState';
import { TourCard, PlaceCard, PostCard } from '@components/cards';
import { useTheme } from '@components/context/ThemeContext';
import { useGetToursQuery, useGetPlacesQuery, useGetPostsQuery } from '@api';
import FilterModal, { TourFilters, PlaceFilters, PostFilters } from '@components/ui/FilterModal';
import { useDebounce } from '@hooks/useDebounce';
import { useRefresh } from '@hooks/useRefresh';
import { TabBar } from '@components/ui/TabBar';
import { SearchBar } from '@components/ui/SearchBar';

type TabType = 'tours' | 'places' | 'posts';

export default function ExploreScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  
  // State
  const [activeTab, setActiveTab] = useState<TabType>('tours');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [tourFilters, setTourFilters] = useState<TourFilters>({});
  const [placeFilters, setPlaceFilters] = useState<PlaceFilters>({});
  const [postFilters, setPostFilters] = useState<PostFilters>({});

  // Debounced search
  const debouncedSearch = useDebounce(searchQuery, 300);

  // GraphQL Queries
  const { data: toursData, loading: toursLoading, error: toursError, refetch: refetchTours } = useGetToursQuery({
    variables: {
      category: tourFilters.category,
      limit: 50,
    },
    fetchPolicy: 'cache-and-network',
  });

  const { data: placesData, loading: placesLoading, error: placesError, refetch: refetchPlaces } = useGetPlacesQuery({
    variables: {
      category: placeFilters.type,
      limit: 50,
    },
    fetchPolicy: 'cache-and-network',
  });

  const { data: postsData, loading: postsLoading, error: postsError, refetch: refetchPosts } = useGetPostsQuery({
    variables: {
      type: postFilters.type,
      limit: 20,
      offset: 0,
    },
    fetchPolicy: 'cache-and-network',
  });

  // Filter and search data
  const filteredTours = useMemo(() => {
    try {
      if (!toursData?.getTours || !Array.isArray(toursData.getTours)) return [];
      let tours = [...toursData.getTours].filter((tour: any) => tour != null);
    
    // Search filter
    if (debouncedSearch) {
      const query = debouncedSearch.toLowerCase();
      tours = tours.filter(
        (tour: any) =>
            tour?.title?.toLowerCase().includes(query) ||
            tour?.location?.toLowerCase().includes(query) ||
            tour?.description?.toLowerCase().includes(query)
      );
    }

    // Price filter
    if (tourFilters.minPrice !== undefined) {
      tours = tours.filter((tour: any) => (tour.price ?? 0) >= tourFilters.minPrice!);
    }
    if (tourFilters.maxPrice !== undefined) {
      tours = tours.filter((tour: any) => (tour.price ?? 0) <= tourFilters.maxPrice!);
    }

    // Rating filter
    if (tourFilters.minRating !== undefined) {
      tours = tours.filter((tour: any) => (tour.rating ?? 0) >= tourFilters.minRating!);
    }

    // Difficulty filter
    if (tourFilters.difficulty) {
      tours = tours.filter((tour: any) => tour.difficulty === tourFilters.difficulty);
    }

    // Sort
    if (tourFilters.sortBy) {
      tours = [...tours].sort((a: any, b: any) => {
        switch (tourFilters.sortBy) {
          case 'rating':
            return (b.rating || 0) - (a.rating || 0);
          case 'price':
            return (a.price || 0) - (b.price || 0);
          case 'newest': {
            const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
            const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
            return bTime - aTime;
          }
          case 'popular':
          default:
            return (b.reviews || 0) - (a.reviews || 0);
        }
      });
    }

    return tours;
    } catch {
      return [];
    }
  }, [toursData, debouncedSearch, tourFilters]);

  const filteredPlaces = useMemo(() => {
    try {
      if (!placesData?.getPlaces || !Array.isArray(placesData.getPlaces)) return [];
      let places = [...placesData.getPlaces].filter((place: any) => place != null);
    
    // Search filter
    if (debouncedSearch) {
      const query = debouncedSearch.toLowerCase();
      places = places.filter(
        (place: any) =>
            place?.name?.toLowerCase().includes(query) ||
            place?.location?.toLowerCase().includes(query) ||
            place?.description?.toLowerCase().includes(query)
      );
    }

    // Rating filter
    if (placeFilters.minRating !== undefined) {
      places = places.filter((place: any) => (place.rating ?? 0) >= placeFilters.minRating!);
    }

    // Open filter
    if (placeFilters.isOpen !== undefined) {
      places = places.filter((place: any) => place.isOpen === placeFilters.isOpen);
    }

    // Sort
    if (placeFilters.sortBy) {
      places = [...places].sort((a: any, b: any) => {
        switch (placeFilters.sortBy) {
          case 'rating':
            return (b.rating || 0) - (a.rating || 0);
          case 'newest': {
            const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
            const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
            return bTime - aTime;
          }
          case 'popular':
          default:
            return (b.reviews || 0) - (a.reviews || 0);
        }
      });
    }

    return places;
    } catch {
      return [];
    }
  }, [placesData, debouncedSearch, placeFilters]);

  const filteredPosts = useMemo(() => {
    try {
      if (!postsData?.getPosts?.posts || !Array.isArray(postsData.getPosts.posts)) return [];
      let posts = [...postsData.getPosts.posts].filter((post: any) => post != null);
    
    // Search filter
    if (debouncedSearch) {
      const query = debouncedSearch.toLowerCase();
      posts = posts.filter(
        (post: any) =>
            post?.content?.toLowerCase().includes(query) ||
            post?.user?.name?.toLowerCase().includes(query) ||
            post?.user?.username?.toLowerCase().includes(query)
      );
    }

    // Sort
    if (postFilters.sortBy) {
      posts = [...posts].sort((a: any, b: any) => {
        switch (postFilters.sortBy) {
          case 'newest': {
            const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
            const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
            return bTime - aTime;
          }
          case 'popular':
          default:
            return (b.reactionsCount || 0) - (a.reactionsCount || 0);
        }
      });
    }

    return posts;
    } catch {
      return [];
    }
  }, [postsData, debouncedSearch, postFilters]);

  // Loading state
  const currentLoading = activeTab === 'tours' ? toursLoading : activeTab === 'places' ? placesLoading : postsLoading;

  // Error state
  const currentError = activeTab === 'tours' ? toursError : activeTab === 'places' ? placesError : postsError;

  // Refresh handlers for each tab
  const { refreshing: toursRefreshing, onRefresh: onRefreshTours } = useRefresh(refetchTours);
  const { refreshing: placesRefreshing, onRefresh: onRefreshPlaces } = useRefresh(refetchPlaces);
  const { refreshing: postsRefreshing, onRefresh: onRefreshPosts } = useRefresh(refetchPosts);

  const handleRefresh = useCallback(() => {
    if (activeTab === 'tours') {
      onRefreshTours();
    } else if (activeTab === 'places') {
      onRefreshPlaces();
    } else {
      onRefreshPosts();
    }
  }, [activeTab, onRefreshTours, onRefreshPlaces, onRefreshPosts]);

  // Navigation handlers
  const handleTourPress = useCallback((tourId: string) => {
    router.push(`/(app)/(explore)/tours/${tourId}` as any);
  }, [router]);

  const handlePlacePress = useCallback((placeId: string) => {
    router.push(`/(app)/(explore)/places/${placeId}` as any);
  }, [router]);

  const handlePostPress = useCallback((postId: string) => {
    router.push(`/(app)/(feed)/${postId}` as any);
  }, [router]);

  const handleUserPress = useCallback((userId: string) => {
    router.push(`/(app)/(explore)/users/${userId}` as any);
  }, [router]);

  // Get current filtered data based on active tab
  const currentFilteredData = useMemo(() => {
    switch (activeTab) {
      case 'tours':
        return filteredTours;
      case 'places':
        return filteredPlaces;
      case 'posts':
        return filteredPosts;
      default:
        return [];
    }
  }, [activeTab, filteredTours, filteredPlaces, filteredPosts]);

  // Render content based on active tab
  const renderContent = () => {
    const hasData = currentFilteredData.length > 0;
    if (currentLoading && !hasData) {
      return <LoadingState message={t('common.loading')} />;
    }

    if (currentError) {
      return (
        <ErrorState
          title={t('explore.error.title')}
          message={currentError.message || t('explore.error.message')}
          iconSize={48}
          onRetry={handleRefresh}
        />
      );
    }

    if (activeTab === 'tours') {
      if (currentFilteredData.length === 0) {
        return (
          <EmptyState
            icon="map-outline"
            title={t('explore.empty.tours')}
            description={t('explore.empty.toursDescription')}
            iconSize={64}
          />
        );
      }

      return (
        <FlatList
          key={`tours-list-${activeTab}`}
          extraData={`${activeTab}-${currentFilteredData.length}`}
          data={currentFilteredData as any[]}
          keyExtractor={(item, index) => `tour-${item?.id || index}`}
          removeClippedSubviews={true}
          renderItem={({ item }) => {
            if (!item?.id) return null;
            return (
            <TourCard
              tour={item}
              onPress={() => handleTourPress(item.id)}
              variant="detailed"
            />
            );
          }}
          contentContainerStyle={{ padding: 16 }}
          refreshControl={
            <RefreshControl refreshing={toursRefreshing || toursLoading} onRefresh={handleRefresh} />
          }
        />
      );
    }

    if (activeTab === 'places') {
      if (currentFilteredData.length === 0) {
        return (
          <EmptyState
            icon="location-outline"
            title={t('explore.empty.places')}
            description={t('explore.empty.placesDescription')}
            iconSize={64}
          />
        );
      }

      return (
        <FlatList
          key={`places-list-${activeTab}`}
          extraData={`${activeTab}-${currentFilteredData.length}`}
          data={currentFilteredData as any[]}
          keyExtractor={(item, index) => `place-${item?.id || index}`}
          removeClippedSubviews={true}
          renderItem={({ item }) => {
            if (!item?.id) return null;
            return (
            <PlaceCard
              place={item}
              onPress={() => handlePlacePress(item.id)}
              variant="detailed"
            />
            );
          }}
          contentContainerStyle={{ padding: 16 }}
          refreshControl={
            <RefreshControl refreshing={placesRefreshing || placesLoading} onRefresh={handleRefresh} />
          }
        />
      );
    }

    if (activeTab === 'posts') {
      if (currentFilteredData.length === 0) {
        return (
          <EmptyState
            icon="newspaper-outline"
            title={t('explore.empty.posts')}
            description={t('explore.empty.postsDescription')}
            iconSize={64}
          />
        );
      }

      return (
        <FlatList
          key={`posts-list-${activeTab}`}
          extraData={`${activeTab}-${currentFilteredData.length}`}
          data={currentFilteredData as any[]}
          keyExtractor={(item, index) => `post-${item?.id || index}`}
          removeClippedSubviews={true}
          renderItem={({ item }) => {
            if (!item?.id) return null;
            return (
            <PostCard
              post={item}
              onPress={() => handlePostPress(item.id)}
                onUserPress={() => handleUserPress((item as any).userId || '')}
            />
            );
          }}
          contentContainerStyle={{ padding: 16 }}
          refreshControl={
            <RefreshControl refreshing={postsRefreshing || postsLoading} onRefresh={handleRefresh} />
          }
        />
      );
    }

    return null;
  };

  // Count active filters
  const getActiveFilterCount = () => {
    if (activeTab === 'tours') {
      return Object.values(tourFilters).filter(v => v !== undefined && v !== '').length;
    } else if (activeTab === 'places') {
      return Object.values(placeFilters).filter(v => v !== undefined && v !== '').length;
    } else {
      return Object.values(postFilters).filter(v => v !== undefined && v !== '').length;
    }
  };

  const activeFilterCount = getActiveFilterCount();

  return (
    <View className="flex-1 bg-white dark:bg-black">
      <Stack.Screen options={{ title: t('explore.title'), headerShown: false }} />
      
      {/* Header */}
      <View className="px-6 pt-12 pb-4 bg-white dark:bg-black border-b border-gray-200 dark:border-neutral-800">
        <CustomText
          weight="bold"
          className="text-3xl text-black dark:text-white mb-4"
        >
          {t('explore.title')}
        </CustomText>

        {/* Search Bar */}
        <SearchBar
              value={searchQuery}
              onChangeText={setSearchQuery}
          placeholder={t('explore.searchPlaceholder')}
          showFilterButton
          filterButtonBadge={activeFilterCount}
          onFilterPress={() => setShowFilters(true)}
          className="mb-4"
        />

        {/* Tabs */}
        <TabBar
          tabs={(['tours', 'places', 'posts'] as TabType[]).map(tab => ({
            id: tab,
            label: tab,
          }))}
          activeTab={activeTab}
          onTabChange={(tabId) => setActiveTab(tabId as TabType)}
          variant="segmented"
        />
      </View>

      {/* Content */}
      {renderContent()}

      {/* Filter Modal */}
      <FilterModal
        visible={showFilters}
        onClose={() => setShowFilters(false)}
        filterType={activeTab}
        tourFilters={tourFilters}
        placeFilters={placeFilters}
        postFilters={postFilters}
        onApplyFilters={(filters) => {
          if (activeTab === 'tours') {
            setTourFilters(filters as TourFilters);
          } else if (activeTab === 'places') {
            setPlaceFilters(filters as PlaceFilters);
          } else {
            setPostFilters(filters as PostFilters);
          }
        }}
      />
    </View>
  );
}
