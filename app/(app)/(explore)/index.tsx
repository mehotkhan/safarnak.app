import { useState, useMemo, useCallback, useEffect } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  FlatList,
  TextInput,
  Image,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { CustomText } from '@components/ui/CustomText';
import { useTheme } from '@components/context/ThemeContext';
import { useGetToursQuery, useGetPlacesQuery, useGetPostsQuery } from '@api';
import FilterModal, { TourFilters, PlaceFilters, PostFilters } from '@components/ui/FilterModal';

type TabType = 'tours' | 'places' | 'posts';

// Debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Tour Card Component
interface TourCardProps {
  tour: any;
  onPress: () => void;
  isDark: boolean;
  t: any;
}

const TourCard = ({ tour, onPress, isDark, t }: TourCardProps) => {
  const imageUrl = tour.imageUrl || tour.gallery?.[0] || 'https://via.placeholder.com/400x300';
  
  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-white dark:bg-neutral-900 rounded-2xl overflow-hidden mb-4 border border-gray-200 dark:border-neutral-800"
      activeOpacity={0.8}
    >
      <View className="h-48 bg-gray-200 dark:bg-neutral-800 relative">
        <Image
          source={{ uri: imageUrl }}
          className="w-full h-full"
          resizeMode="cover"
        />
        {tour.isFeatured && (
          <View className="absolute top-2 right-2 bg-primary px-2 py-1 rounded-full">
            <CustomText className="text-xs text-white" weight="medium">
              {t('explore.featured')}
            </CustomText>
          </View>
        )}
        {tour.category && (
          <View className="absolute top-2 left-2 bg-black/50 px-2 py-1 rounded-full">
            <CustomText className="text-xs text-white">
              {t(`explore.categories.${tour.category}`)}
            </CustomText>
          </View>
        )}
      </View>
      <View className="p-4">
        <CustomText
          weight="bold"
          className="text-lg text-black dark:text-white mb-1"
          numberOfLines={2}
        >
          {tour.title || 'Untitled Tour'}
        </CustomText>
        <View className="flex-row items-center mb-2">
          <Ionicons
            name="location-outline"
            size={14}
            color={isDark ? '#9ca3af' : '#6b7280'}
          />
          <CustomText className="text-sm text-gray-600 dark:text-gray-400 ml-1" numberOfLines={1}>
            {tour.location || 'Location not specified'}
          </CustomText>
        </View>
        <View className="flex-row items-center justify-between mb-2">
          <View className="flex-row items-center">
            <Ionicons name="star" size={16} color="#fbbf24" />
            <CustomText className="text-sm text-gray-700 dark:text-gray-300 ml-1">
              {tour.rating?.toFixed(1) || '0.0'} ({tour.reviews || 0} {t('explore.tourCard.reviews')})
            </CustomText>
          </View>
          <CustomText weight="bold" className="text-base text-primary">
            {t('explore.tourCard.from')} ${tour.price?.toFixed(0) || '0'}
          </CustomText>
        </View>
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <Ionicons
              name="time-outline"
              size={14}
              color={isDark ? '#9ca3af' : '#6b7280'}
            />
            <CustomText className="text-sm text-gray-600 dark:text-gray-400 ml-1">
              {tour.duration || 0} {tour.durationType === 'days' ? t('explore.tourCard.days') : tour.durationType === 'hours' ? t('explore.tourCard.hours') : ''}
            </CustomText>
          </View>
          {tour.difficulty && (
            <View className="bg-gray-100 dark:bg-neutral-800 px-2 py-1 rounded-full">
              <CustomText className="text-xs text-gray-600 dark:text-gray-400">
                {t(`explore.filters.${tour.difficulty}`)}
              </CustomText>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

// Place Card Component
interface PlaceCardProps {
  place: any;
  onPress: () => void;
  isDark: boolean;
  t: any;
}

const PlaceCard = ({ place, onPress, isDark, t }: PlaceCardProps) => {
  const imageUrl = place.imageUrl || 'https://via.placeholder.com/400x300';
  
  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-white dark:bg-neutral-900 rounded-2xl overflow-hidden mb-3 border border-gray-200 dark:border-neutral-800"
      activeOpacity={0.8}
    >
      <View className="flex-row">
        <View className="w-24 h-24 bg-gray-200 dark:bg-neutral-800">
          <Image
            source={{ uri: imageUrl }}
            className="w-full h-full"
            resizeMode="cover"
          />
        </View>
        <View className="flex-1 p-3">
          <View className="flex-row justify-between items-start mb-1">
            <View className="flex-1 mr-2">
              <CustomText
                weight="bold"
                className="text-base text-black dark:text-white mb-1"
                numberOfLines={1}
              >
                {place.name || 'Unnamed Place'}
              </CustomText>
              <View className="flex-row items-center mb-1">
                <Ionicons
                  name="location-outline"
                  size={12}
                  color={isDark ? '#9ca3af' : '#6b7280'}
                />
                <CustomText className="text-xs text-gray-600 dark:text-gray-400 ml-1" numberOfLines={1}>
                  {place.location || 'Location not specified'}
                </CustomText>
              </View>
            </View>
            <View
              className={`px-2 py-1 rounded-full ${
                place.isOpen
                  ? 'bg-green-100 dark:bg-green-900'
                  : 'bg-red-100 dark:bg-red-900'
              }`}
            >
              <CustomText
                className={`text-xs ${
                  place.isOpen
                    ? 'text-green-800 dark:text-green-200'
                    : 'text-red-800 dark:text-red-200'
                }`}
              >
                {place.isOpen ? t('explore.placeCard.open') : t('explore.placeCard.closed')}
              </CustomText>
            </View>
          </View>
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <Ionicons name="star" size={14} color="#fbbf24" />
              <CustomText className="text-xs text-gray-700 dark:text-gray-300 ml-1">
                {place.rating?.toFixed(1) || '0.0'} ({place.reviews || 0})
              </CustomText>
            </View>
            {place.distance != null && typeof place.distance === 'number' && (
              <CustomText className="text-xs text-gray-600 dark:text-gray-400">
                {place.distance.toFixed(1)} {t('explore.placeCard.distance')}
              </CustomText>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

// Post Card Component
interface PostCardProps {
  post: any;
  onPress: () => void;
  onUserPress: () => void;
  isDark: boolean;
  t: any;
}

const PostCard = ({ post, onPress, onUserPress, isDark, t }: PostCardProps) => {
  const formatRelativeTime = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return t('explore.posts.justNow');
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}${t('explore.posts.minutesAgo')}`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}${t('explore.posts.hoursAgo')}`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}${t('explore.posts.daysAgo')}`;
    return date.toLocaleDateString();
  };

  const getEntityInfo = () => {
    if (!post.relatedEntity) return null;
    
    if (post.type === 'trip') {
      return {
        title: post.relatedEntity.destination || 'Trip',
        imageUrl: null,
      };
    } else if (post.type === 'tour') {
      return {
        title: post.relatedEntity.title || 'Tour',
        imageUrl: post.relatedEntity.imageUrl || null,
      };
    } else if (post.type === 'place') {
      return {
        title: post.relatedEntity.name || 'Place',
        imageUrl: post.relatedEntity.imageUrl || null,
      };
    }
    return null;
  };

  const entityInfo = getEntityInfo();
  const hasImage = post.attachments?.[0] || entityInfo?.imageUrl;

  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-white dark:bg-neutral-900 rounded-2xl overflow-hidden mb-3 border border-gray-200 dark:border-neutral-800"
      activeOpacity={0.8}
    >
      {/* Header */}
      <View className="flex-row items-center p-3 border-b border-gray-100 dark:border-neutral-800">
        <TouchableOpacity onPress={onUserPress} className="flex-row items-center flex-1">
          {post.user?.avatar ? (
            <Image
              source={{ uri: post.user.avatar }}
              className="w-10 h-10 rounded-full mr-2"
            />
          ) : (
            <View className="w-10 h-10 rounded-full bg-primary/20 items-center justify-center mr-2">
              <Ionicons name="person" size={20} color="#3b82f6" />
            </View>
          )}
          <View className="flex-1">
            <CustomText weight="medium" className="text-sm text-black dark:text-white">
              {post.user?.name || post.user?.username || 'User'}
            </CustomText>
            <CustomText className="text-xs text-gray-500 dark:text-gray-400">
              {formatRelativeTime(post.createdAt)}
            </CustomText>
          </View>
        </TouchableOpacity>
        {post.type && (
          <View className="bg-primary/10 px-2 py-1 rounded-full">
            <CustomText className="text-xs text-primary">
              {t(`explore.categories.${post.type}s`)}
            </CustomText>
          </View>
        )}
      </View>

      {/* Content */}
      {hasImage && (
        <View className="h-48 bg-gray-200 dark:bg-neutral-800">
          <Image
            source={{ uri: hasImage }}
            className="w-full h-full"
            resizeMode="cover"
          />
        </View>
      )}
      
      {post.content && (
        <View className="p-3">
          <CustomText className="text-sm text-gray-700 dark:text-gray-300" numberOfLines={3}>
            {post.content}
          </CustomText>
        </View>
      )}

      {entityInfo && (
        <View className="px-3 pb-3">
          <View className="bg-gray-50 dark:bg-neutral-800 rounded-lg p-2 flex-row items-center">
            <Ionicons
              name={post.type === 'trip' ? 'airplane' : post.type === 'tour' ? 'map' : 'location'}
              size={16}
              color={isDark ? '#9ca3af' : '#6b7280'}
            />
            <CustomText className="text-xs text-gray-600 dark:text-gray-400 ml-2" numberOfLines={1}>
              {entityInfo.title}
            </CustomText>
          </View>
        </View>
      )}

      {/* Footer */}
      <View className="flex-row items-center justify-between px-3 py-2 border-t border-gray-100 dark:border-neutral-800">
        <View className="flex-row items-center">
          <Ionicons
            name="heart-outline"
            size={18}
            color={isDark ? '#9ca3af' : '#6b7280'}
          />
          <CustomText className="text-xs text-gray-600 dark:text-gray-400 ml-1">
            {post.reactionsCount || 0}
          </CustomText>
        </View>
        <View className="flex-row items-center">
          <Ionicons
            name="chatbubble-outline"
            size={18}
            color={isDark ? '#9ca3af' : '#6b7280'}
          />
          <CustomText className="text-xs text-gray-600 dark:text-gray-400 ml-1">
            {post.commentsCount || 0}
          </CustomText>
        </View>
        {post.isBookmarked && (
          <Ionicons
            name="bookmark"
            size={18}
            color="#3b82f6"
          />
        )}
      </View>
    </TouchableOpacity>
  );
};

export default function ExploreScreen() {
  const { t } = useTranslation();
  const { isDark } = useTheme();
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
  const isLoading = toursLoading || placesLoading || postsLoading;
  const currentLoading = activeTab === 'tours' ? toursLoading : activeTab === 'places' ? placesLoading : postsLoading;

  // Error state
  const currentError = activeTab === 'tours' ? toursError : activeTab === 'places' ? placesError : postsError;

  // Refresh handler
  const handleRefresh = useCallback(() => {
    if (activeTab === 'tours') {
      refetchTours();
    } else if (activeTab === 'places') {
      refetchPlaces();
    } else {
      refetchPosts();
    }
  }, [activeTab, refetchTours, refetchPlaces, refetchPosts]);

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
      return (
        <View className="flex-1 items-center justify-center py-20">
          <ActivityIndicator size="large" color="#3b82f6" />
          <CustomText className="text-gray-500 dark:text-gray-400 mt-4">
            {t('common.loading')}
          </CustomText>
        </View>
      );
    }

    if (currentError) {
      return (
        <View className="flex-1 items-center justify-center py-20 px-6">
          <Ionicons name="alert-circle-outline" size={48} color="#ef4444" />
          <CustomText weight="medium" className="text-lg text-gray-900 dark:text-white mt-4 mb-2">
            {t('explore.error.title')}
          </CustomText>
          <CustomText className="text-center text-gray-600 dark:text-gray-400 mb-4">
            {currentError.message || t('explore.error.message')}
          </CustomText>
          <TouchableOpacity
            onPress={handleRefresh}
            className="bg-primary px-6 py-3 rounded-lg"
          >
            <CustomText className="text-white" weight="medium">
              {t('common.retry')}
            </CustomText>
          </TouchableOpacity>
        </View>
      );
    }

    if (activeTab === 'tours') {
      if (currentFilteredData.length === 0) {
        return (
          <View className="flex-1 items-center justify-center py-20 px-6">
            <Ionicons name="map-outline" size={64} color={isDark ? '#4b5563' : '#9ca3af'} />
            <CustomText weight="medium" className="text-lg text-gray-900 dark:text-white mt-4 mb-2">
              {t('explore.empty.tours')}
            </CustomText>
            <CustomText className="text-center text-gray-600 dark:text-gray-400">
              {t('explore.empty.toursDescription')}
            </CustomText>
          </View>
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
                isDark={isDark}
                t={t}
              />
            );
          }}
          contentContainerStyle={{ padding: 16 }}
          refreshControl={
            <RefreshControl refreshing={toursLoading} onRefresh={handleRefresh} />
          }
        />
      );
    }

    if (activeTab === 'places') {
      if (currentFilteredData.length === 0) {
        return (
          <View className="flex-1 items-center justify-center py-20 px-6">
            <Ionicons name="location-outline" size={64} color={isDark ? '#4b5563' : '#9ca3af'} />
            <CustomText weight="medium" className="text-lg text-gray-900 dark:text-white mt-4 mb-2">
              {t('explore.empty.places')}
            </CustomText>
            <CustomText className="text-center text-gray-600 dark:text-gray-400">
              {t('explore.empty.placesDescription')}
            </CustomText>
          </View>
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
                isDark={isDark}
                t={t}
              />
            );
          }}
          contentContainerStyle={{ padding: 16 }}
          refreshControl={
            <RefreshControl refreshing={placesLoading} onRefresh={handleRefresh} />
          }
        />
      );
    }

    if (activeTab === 'posts') {
      if (currentFilteredData.length === 0) {
        return (
          <View className="flex-1 items-center justify-center py-20 px-6">
            <Ionicons name="newspaper-outline" size={64} color={isDark ? '#4b5563' : '#9ca3af'} />
            <CustomText weight="medium" className="text-lg text-gray-900 dark:text-white mt-4 mb-2">
              {t('explore.empty.posts')}
            </CustomText>
            <CustomText className="text-center text-gray-600 dark:text-gray-400">
              {t('explore.empty.postsDescription')}
            </CustomText>
          </View>
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
            const post = item as any;
            return (
              <PostCard
                post={post}
                onPress={() => handlePostPress(post.id)}
                onUserPress={() => handleUserPress(post.userId || '')}
                isDark={isDark}
                t={t}
              />
            );
          }}
          contentContainerStyle={{ padding: 16 }}
          refreshControl={
            <RefreshControl refreshing={postsLoading} onRefresh={handleRefresh} />
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
        <View className="flex-row items-center mb-4">
          <View className="flex-1 flex-row items-center bg-gray-100 dark:bg-neutral-900 rounded-full px-4 py-3 mr-3">
            <Ionicons
              name="search"
              size={20}
              color={isDark ? '#9ca3af' : '#6b7280'}
            />
            <TextInput
              placeholder={t('explore.searchPlaceholder')}
              placeholderTextColor={isDark ? '#9ca3af' : '#6b7280'}
              value={searchQuery}
              onChangeText={setSearchQuery}
              className="flex-1 ml-2 text-black dark:text-white"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons
                  name="close-circle"
                  size={20}
                  color={isDark ? '#9ca3af' : '#6b7280'}
                />
              </TouchableOpacity>
            )}
          </View>
          <TouchableOpacity
            onPress={() => setShowFilters(true)}
            className={`w-12 h-12 rounded-full items-center justify-center ${
              activeFilterCount > 0 ? 'bg-primary' : 'bg-gray-100 dark:bg-neutral-900'
            }`}
          >
            <Ionicons
              name="options-outline"
              size={24}
              color={activeFilterCount > 0 ? '#fff' : (isDark ? '#9ca3af' : '#6b7280')}
            />
            {activeFilterCount > 0 && (
              <View className="absolute -top-1 -right-1 bg-red-500 rounded-full w-5 h-5 items-center justify-center">
                <CustomText className="text-xs text-white" weight="bold">
                  {activeFilterCount}
                </CustomText>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Tabs */}
        <View className="flex-row bg-gray-100 dark:bg-neutral-900 rounded-xl p-1">
          {(['tours', 'places', 'posts'] as TabType[]).map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab)}
              className={`flex-1 py-2 rounded-lg ${
                activeTab === tab
                  ? 'bg-white dark:bg-neutral-800'
                  : ''
              }`}
            >
              <CustomText
                weight={activeTab === tab ? 'medium' : 'regular'}
                className={`text-center ${
                  activeTab === tab
                    ? 'text-primary'
                    : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                {t(`explore.categories.${tab}`)}
              </CustomText>
            </TouchableOpacity>
          ))}
        </View>
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
