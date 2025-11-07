import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Image,
  Dimensions,
  Animated,
  Modal,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { CustomText } from '@components/ui/CustomText';
import { useTheme } from '@components/context/ThemeContext';
import { useSystemStatus } from '@hooks/useSystemStatus';
import { useGetPostsQuery, GetPostsDocument, useCreateReactionMutation, useDeleteReactionMutation, useBookmarkPostMutation } from '@api';
import ShareModal from '@components/ui/ShareModal';
import { useAppSelector } from '@store/hooks';

const { width } = Dimensions.get('window');

const categories = [
  { id: 'trips', label: 'trips', icon: 'airplane-outline' },
  { id: 'food', label: 'food', icon: 'restaurant-outline' },
  { id: 'culture', label: 'culture', icon: 'color-palette-outline' },
];

interface FeedItemProps {
  item: any;
  isDark: boolean;
  t: any;
  onLike: () => Promise<void>;
  onComment: () => void;
  onShare: () => void;
  onUserPress: () => void;
  onPostPress: () => void;
  onLocationPress?: () => void;
  onBookmark?: (postId: string) => Promise<void>;
  onEdit?: (postId: string) => void;
  isOwner?: boolean;
}

// Helper function to format relative time
const formatRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  return date.toLocaleDateString();
};

// Helper to get entity title and location
const getEntityInfo = (post: any) => {
  if (!post.relatedEntity) return { title: '', location: '', imageUrl: null, coordinates: null };
  
  if (post.type === 'trip') {
    return {
      title: post.relatedEntity.destination || 'Trip',
      location: post.relatedEntity.destination || '',
      imageUrl: null,
      coordinates: post.relatedEntity.tripCoordinates || null,
    };
  } else if (post.type === 'tour') {
    return {
      title: post.relatedEntity.title || 'Tour',
      location: post.relatedEntity.location || '',
      imageUrl: post.relatedEntity.imageUrl || null,
      coordinates: post.relatedEntity.tourCoordinates || null,
    };
  } else if (post.type === 'place') {
    return {
      title: post.relatedEntity.name || 'Place',
      location: post.relatedEntity.location || '',
      imageUrl: post.relatedEntity.imageUrl || null,
      coordinates: post.relatedEntity.placeCoordinates || null,
    };
  }
  return { title: '', location: '', imageUrl: null, coordinates: null };
};

const FeedItem = ({ 
  item, 
  isDark, 
  t, 
  onLike, 
  onComment, 
  onShare,
  onUserPress,
  onPostPress,
  onLocationPress,
  onBookmark,
  onEdit,
  isOwner = false,
}: FeedItemProps) => {
  const { user } = useAppSelector(state => state.auth);
  const [optimisticBookmarked, setOptimisticBookmarked] = useState<boolean | null>(null);
  const [showMenu, setShowMenu] = useState(false);
  
  // Use optimistic state if available, otherwise use server state
  // When refetch completes and item.isBookmarked updates, it will naturally override
  const bookmarked = optimisticBookmarked !== null ? optimisticBookmarked : (item.isBookmarked || false);
  
  // Clear optimistic state when server state updates (refetch completed)
  const prevIsBookmarkedRef = useRef(item.isBookmarked);
  useEffect(() => {
    // If server state matches optimistic state, clear optimistic state (refetch completed)
    if (optimisticBookmarked !== null && item.isBookmarked === optimisticBookmarked && prevIsBookmarkedRef.current !== item.isBookmarked) {
      prevIsBookmarkedRef.current = item.isBookmarked;
      // Use requestAnimationFrame to avoid setting state synchronously
      requestAnimationFrame(() => {
        setOptimisticBookmarked(null);
      });
    } else if (prevIsBookmarkedRef.current !== item.isBookmarked) {
      prevIsBookmarkedRef.current = item.isBookmarked;
    }
  }, [item.isBookmarked, optimisticBookmarked]);
  const entityInfo = getEntityInfo(item);
  const imageUrl = entityInfo.imageUrl || (item.attachments && item.attachments[0]) || null;

  // Generate placeholder image URL using Unsplash (travel category)
  const placeholderImageUrl = useMemo(() => {
    // Use item.id as seed, or hash it if needed
    const seed = item.id ? item.id.substring(0, 8) : 'default';
    return `https://source.unsplash.com/800x600/?travel,landscape&sig=${seed}`;
  }, [item.id]);

  // Get connected item type icon and label
  const connectedItemInfo = useMemo(() => {
    if (item.type === 'trip') {
      return { icon: 'airplane-outline', label: 'Trip', color: '#3b82f6' };
    } else if (item.type === 'tour') {
      return { icon: 'map-outline', label: 'Tour', color: '#10b981' };
    } else if (item.type === 'place') {
      return { icon: 'location-outline', label: 'Place', color: '#f59e0b' };
    }
    return null;
  }, [item.type]);

  // Check if current user has already reacted with ❤️
  const hasLiked = useMemo(() => {
    if (!user?.id || !item.reactions) return false;
    return item.reactions.some((r: any) => r.user?.id === user.id && r.emoji === '❤️');
  }, [user?.id, item.reactions]);

  const handleLike = async () => {
    await onLike();
  };

  const handleBookmark = async () => {
    if (onBookmark) {
      const newBookmarked = !bookmarked;
      setOptimisticBookmarked(newBookmarked);
      try {
        await onBookmark(item.id);
        // Optimistic state will be cleared when refetch updates item.isBookmarked
      } catch (error) {
        // Revert on error
        setOptimisticBookmarked(null);
      }
    }
  };

  const handleEdit = () => {
    if (onEdit) {
      setShowMenu(false);
      onEdit(item.id);
    }
  };

  return (
    <View className="bg-white dark:bg-neutral-900 mb-4 rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-neutral-800">
      {/* User Header */}
      <TouchableOpacity 
        onPress={onUserPress}
        className="flex-row items-center px-4 py-3"
      >
        <View className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 dark:bg-neutral-800 mr-3 border border-gray-200 dark:border-neutral-700">
          {item.user?.avatar ? (
            <Image
              source={{ uri: item.user.avatar }}
              className="w-full h-full"
              resizeMode="cover"
            />
          ) : (
            <View className="w-full h-full items-center justify-center">
              <Ionicons name="person" size={20} color={isDark ? '#9ca3af' : '#6b7280'} />
            </View>
          )}
        </View>
        <View className="flex-1">
          <View className="flex-row items-center">
            <CustomText weight="bold" className="text-base text-black dark:text-white">
              {item.user?.name || 'Unknown User'}
            </CustomText>
            {connectedItemInfo && (
              <View className="flex-row items-center ml-2 px-2 py-0.5 rounded-full" style={{ backgroundColor: `${connectedItemInfo.color}15` }}>
                <Ionicons
                  name={connectedItemInfo.icon as any}
                  size={12}
                  color={connectedItemInfo.color}
                  style={{ marginRight: 4 }}
                />
                <CustomText className="text-xs" style={{ color: connectedItemInfo.color }}>
                  {connectedItemInfo.label}
                </CustomText>
              </View>
            )}
          </View>
          <View className="flex-row items-center mt-1">
            {entityInfo.location ? (
              <TouchableOpacity
                onPress={e => {
                  e.stopPropagation();
                  onLocationPress?.();
                }}
                className="flex-row items-center"
                activeOpacity={0.7}
              >
                <Ionicons
                  name="location-outline"
                  size={14}
                  color={isDark ? '#9ca3af' : '#6b7280'}
                  style={{ marginRight: 4 }}
                />
                <CustomText className="text-sm text-gray-500 dark:text-gray-400">
                  {entityInfo.location}
                </CustomText>
              </TouchableOpacity>
            ) : null}
            <CustomText className="text-sm text-gray-400 dark:text-gray-500 ml-2">
              • {formatRelativeTime(item.createdAt)}
            </CustomText>
          </View>
        </View>
        <View className="relative">
          <TouchableOpacity 
            onPress={() => setShowMenu(!showMenu)}
            activeOpacity={0.7}
          >
            <Ionicons 
              name="ellipsis-horizontal" 
              size={20} 
              color={isDark ? '#9ca3af' : '#6b7280'} 
            />
          </TouchableOpacity>
          
          <Modal
            visible={showMenu}
            transparent
            animationType="fade"
            onRequestClose={() => setShowMenu(false)}
          >
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => setShowMenu(false)}
              className="flex-1 bg-black/50 justify-center items-center"
            >
              <TouchableOpacity
                activeOpacity={1}
                onPress={(e) => e.stopPropagation()}
                className="bg-white dark:bg-neutral-800 rounded-xl shadow-2xl border border-gray-200 dark:border-neutral-700 min-w-[160px] overflow-hidden"
              >
                {isOwner && onEdit && (
                  <TouchableOpacity
                    onPress={handleEdit}
                    className="flex-row items-center px-5 py-4 border-b border-gray-100 dark:border-neutral-700"
                    activeOpacity={0.7}
                  >
                    <Ionicons name="create-outline" size={20} color={isDark ? '#9ca3af' : '#6b7280'} />
                    <CustomText className="text-base text-gray-700 dark:text-gray-300 ml-3 font-medium">
                      {t('common.edit') || 'Edit'}
                    </CustomText>
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  onPress={() => {
                    setShowMenu(false);
                    onShare();
                  }}
                  className="flex-row items-center px-5 py-4"
                  activeOpacity={0.7}
                >
                  <Ionicons name="share-outline" size={20} color={isDark ? '#9ca3af' : '#6b7280'} />
                  <CustomText className="text-base text-gray-700 dark:text-gray-300 ml-3 font-medium">
                    {t('common.share') || 'Share'}
                  </CustomText>
                </TouchableOpacity>
              </TouchableOpacity>
            </TouchableOpacity>
          </Modal>
        </View>
      </TouchableOpacity>

      {/* Image */}
      <TouchableOpacity onPress={onPostPress} activeOpacity={0.9}>
        <View className="w-full h-80 bg-gray-200 dark:bg-neutral-800 relative overflow-hidden">
          {imageUrl ? (
            <Image
              source={{ uri: imageUrl }}
              className="w-full h-full"
              resizeMode="cover"
            />
          ) : (
            <View className="w-full h-full items-center justify-center bg-gray-100 dark:bg-neutral-800">
              <Image
                source={{ uri: placeholderImageUrl }}
                className="w-full h-full opacity-50"
                resizeMode="cover"
              />
              <View className="absolute inset-0 items-center justify-center">
                <Ionicons name="image-outline" size={48} color={isDark ? '#4b5563' : '#9ca3af'} />
                <CustomText className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  {t('feed.noImage') || 'Travel Image'}
                </CustomText>
              </View>
            </View>
          )}
        </View>
      </TouchableOpacity>

      {/* Content */}
      {item.content && (
        <View className="px-4 pt-3 pb-2">
          <CustomText className="text-base text-gray-800 dark:text-gray-200 leading-5">
            {item.content}
          </CustomText>
        </View>
      )}

      {/* Latest Comments */}
      {item.comments && item.comments.length > 0 && (
        <View className="px-4 pt-2 pb-3 border-t border-gray-100 dark:border-neutral-800">
          {item.comments.slice(0, 4).map((comment: any, index: number) => (
            <View key={comment.id || index} className="mb-2 last:mb-0">
              <View className="flex-row items-start">
                <View className="w-6 h-6 rounded-full overflow-hidden bg-gray-200 dark:bg-neutral-800 mr-2 flex-shrink-0">
                  {comment.user?.avatar ? (
                    <Image
                      source={{ uri: comment.user.avatar }}
                      className="w-full h-full"
                      resizeMode="cover"
                    />
                  ) : (
                    <View className="w-full h-full items-center justify-center">
                      <Ionicons name="person" size={12} color={isDark ? '#9ca3af' : '#6b7280'} />
                    </View>
                  )}
                </View>
                <View className="flex-1">
                  <View className="flex-row items-center mb-0.5">
                    <CustomText weight="medium" className="text-xs text-black dark:text-white mr-2">
                      {comment.user?.name || 'Unknown'}
                    </CustomText>
                    <CustomText className="text-xs text-gray-400 dark:text-gray-500">
                      {formatRelativeTime(comment.createdAt)}
                    </CustomText>
                  </View>
                  <CustomText className="text-sm text-gray-700 dark:text-gray-300 leading-4">
                    {comment.content}
                  </CustomText>
                </View>
              </View>
            </View>
          ))}
          {item.commentsCount > 4 && (
            <TouchableOpacity
              onPress={() => {
                onComment();
                onPostPress();
              }}
              className="mt-1"
              activeOpacity={0.7}
            >
              <CustomText className="text-xs text-gray-500 dark:text-gray-400">
                {t('feed.viewAllComments', { count: item.commentsCount - 4 }) || `View ${item.commentsCount - 4} more comments`}
              </CustomText>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Actions */}
      <View className="flex-row items-center px-4 py-3 border-t border-gray-100 dark:border-neutral-800">
        <TouchableOpacity 
          onPress={handleLike} 
          className="flex-row items-center mr-6"
          activeOpacity={0.7}
        >
          <Ionicons 
            name={hasLiked ? 'heart' : 'heart-outline'} 
            size={24} 
            color={hasLiked ? '#ef4444' : (isDark ? '#9ca3af' : '#6b7280')} 
          />
          <CustomText className="text-sm text-gray-700 dark:text-gray-300 ml-2 font-medium">
            {item.reactionsCount || 0}
          </CustomText>
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={() => {
            onComment();
            onPostPress();
          }} 
          className="flex-row items-center mr-6"
          activeOpacity={0.7}
        >
          <Ionicons 
            name="chatbubble-outline" 
            size={24} 
            color={isDark ? '#9ca3af' : '#6b7280'} 
          />
          <CustomText className="text-sm text-gray-700 dark:text-gray-300 ml-2 font-medium">
            {item.commentsCount || 0}
          </CustomText>
        </TouchableOpacity>
        <View className="flex-1" />
        <TouchableOpacity 
          onPress={handleBookmark}
          activeOpacity={0.7}
          disabled={!onBookmark}
        >
          <Ionicons 
            name={bookmarked ? 'bookmark' : 'bookmark-outline'} 
            size={24} 
            color={bookmarked ? '#f59e0b' : (isDark ? '#9ca3af' : '#6b7280')} 
          />
        </TouchableOpacity>
      </View>

    </View>
  );
};

const timeFilters = [
  { id: 'all', label: 'allTime', days: null },
  { id: 'today', label: 'today', days: 1 },
  { id: 'week', label: 'thisWeek', days: 7 },
  { id: 'month', label: 'thisMonth', days: 30 },
];

const feedTabs = [
  { id: 'all', label: 'all', icon: 'grid-outline' },
  { id: 'tours', label: 'tours', icon: 'map-outline' },
  { id: 'places', label: 'places', icon: 'location-outline' },
];

export default function HomeScreen() {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const router = useRouter();
  const { user } = useAppSelector(state => state.auth);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState('all');
  const [selectedTimeFilter, setSelectedTimeFilter] = useState('all');
  const [refreshing, setRefreshing] = useState(false);
  const [offset, setOffset] = useState(0);
  const [fabExpanded, setFabExpanded] = useState(false);
  const [navFabExpanded, setNavFabExpanded] = useState(false);
  const [timeFilterOpen, setTimeFilterOpen] = useState(false);
  const limit = 20;

  // FAB animation values
  const fabRotation = useMemo(() => new Animated.Value(0), []);
  const fabScale = useMemo(() => new Animated.Value(0), []);
  const navFabRotation = useMemo(() => new Animated.Value(0), []);
  const navFabScale = useMemo(() => new Animated.Value(0), []);

  // Animate Create FAB expansion
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fabRotation, {
        toValue: fabExpanded ? 1 : 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.spring(fabScale, {
        toValue: fabExpanded ? 1 : 0,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fabExpanded, fabRotation, fabScale]);

  // Animate Navigation FAB expansion
  useEffect(() => {
    Animated.parallel([
      Animated.timing(navFabRotation, {
        toValue: navFabExpanded ? 1 : 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.spring(navFabScale, {
        toValue: navFabExpanded ? 1 : 0,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, [navFabExpanded, navFabRotation, navFabScale]);

  const toggleFab = () => {
    setFabExpanded(!fabExpanded);
    if (navFabExpanded) setNavFabExpanded(false);
  };

  const toggleNavFab = () => {
    setNavFabExpanded(!navFabExpanded);
    if (fabExpanded) setFabExpanded(false);
  };

  const [showShareModal, setShowShareModal] = useState(false);

  const handleCreateTour = () => {
    setFabExpanded(false);
    router.push('/(app)/(feed)/tours/new' as any);
  };

  const handleCreatePlace = () => {
    setFabExpanded(false);
    router.push('/(app)/(feed)/places/new' as any);
  };

  const handleCreatePost = () => {
    setFabExpanded(false);
    setShowShareModal(true);
  };

  const handleNavigateToPlaces = () => {
    setNavFabExpanded(false);
    router.push('/(app)/(feed)/places' as any);
  };

  const handleNavigateToTours = () => {
    setNavFabExpanded(false);
    router.push('/(app)/(feed)/tours' as any);
  };

  const handleNavigateToArchive = () => {
    setNavFabExpanded(false);
    if (user?.id) {
      router.push(`/(app)/(explore)/users/${user.id}` as any);
    }
  };

  const rotateInterpolate = fabRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '45deg'],
  });

  const navRotateInterpolate = navFabRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '45deg'],
  });

  // Reset offset when category, tab, or time filter changes
  useEffect(() => {
    setOffset(0);
  }, [selectedCategory, selectedTab, selectedTimeFilter]);

  const { isOnline, isBackendReachable } = useSystemStatus();
  
  // Show offline icon if offline OR backend unreachable
  const isOffline = !isOnline || !isBackendReachable;

  // Calculate date filter based on time filter
  const getDateFilter = () => {
    if (selectedTimeFilter === 'all') return { after: undefined, before: undefined };
    const filter = timeFilters.find(f => f.id === selectedTimeFilter);
    if (!filter || !filter.days) return { after: undefined, before: undefined };
    
    const now = new Date();
    const after = new Date(now.getTime() - filter.days * 24 * 60 * 60 * 1000);
    return {
      after: after.toISOString(),
      before: undefined,
    };
  };

  // Determine post type based on selected tab
  const getPostType = () => {
    if (selectedTab === 'tours') return 'tour';
    if (selectedTab === 'places') return 'place';
    // For 'all' tab, use category filter if selected
    if (selectedCategory === 'trips') return 'trip';
    // For 'all' tab with no category or other categories (food, culture), show all
    return undefined;
  };

  const dateFilter = getDateFilter();
  const postType = getPostType();

  const { data, loading, error, refetch, fetchMore } = useGetPostsQuery({
    variables: {
      type: postType,
      limit,
      offset: 0,
      after: dateFilter.after,
      before: dateFilter.before,
    },
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all',
  });

  const [createReaction] = useCreateReactionMutation({
    refetchQueries: [GetPostsDocument],
    onError: (error) => {
      console.error('Reaction error:', error);
    },
  });

  const [deleteReaction] = useDeleteReactionMutation({
    refetchQueries: [GetPostsDocument],
    onError: (error) => {
      console.error('Delete reaction error:', error);
    },
  });

  const posts = useMemo(() => {
    return data?.getPosts?.posts || [];
  }, [data]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    setOffset(0);
    try {
      await refetch();
    } finally {
      setRefreshing(false);
    }
  }, [refetch]);

  const handleLoadMore = useCallback(() => {
    if (!data?.getPosts?.hasNextPage || loading) return;
    const newOffset = offset + limit;
    setOffset(newOffset);
    fetchMore({
      variables: {
        type: postType,
        limit,
        offset: newOffset,
        after: dateFilter.after,
        before: dateFilter.before,
      },
    });
  }, [data, offset, limit, loading, fetchMore, postType, dateFilter]);

  const handleLike = useCallback(async (postId: string, currentReactions: any[] = []) => {
    if (!user?.id) return;

    // Check if user already reacted with ❤️
    const userReaction = currentReactions?.find(
      (r: any) => r.user?.id === user.id && r.emoji === '❤️'
    );

    try {
      if (userReaction) {
        // Delete existing reaction
        await deleteReaction({
          variables: {
            reactionId: userReaction.id,
          },
        });
      } else {
        // Create new reaction
        await createReaction({
          variables: {
            postId,
            emoji: '❤️',
          },
        });
      }
    } catch (error) {
      console.error('Reaction error:', error);
    }
  }, [user?.id, createReaction, deleteReaction]);

  const handleComment = (postId: string) => {
    router.push(`/(app)/(feed)/${postId}` as any);
  };

  const handleShare = () => {
    console.log('Share pressed');
    // TODO: Implement share functionality
  };

  const handleUserPress = (userId: string) => {
    router.push(`/(app)/(explore)/users/${userId}` as any);
  };

  const handlePostPress = (item: any) => {
    // Always navigate to post detail page
    router.push(`/(app)/(feed)/${item.id}` as any);
  };

  const handleLocationPress = (locationId?: string) => {
    if (locationId) {
      router.push(`/(app)/(explore)/locations/${locationId}` as any);
    }
  };

  const [bookmarkPost] = useBookmarkPostMutation({
    refetchQueries: [GetPostsDocument],
    onCompleted: (data) => {
      // data.bookmarkPost returns true if bookmarked, false if unbookmarked
      console.log('Bookmark status:', data.bookmarkPost);
    },
    onError: (error) => {
      console.error('Bookmark error:', error);
    },
  });

  const handleBookmark = useCallback(async (postId: string) => {
    try {
      await bookmarkPost({
        variables: { postId },
      });
    } catch (error) {
      console.error('Bookmark error:', error);
      throw error;
    }
  }, [bookmarkPost]);

  const handleEdit = useCallback((postId: string) => {
    // Navigate to edit page based on post type
    const post = posts.find((p: any) => p.id === postId);
    if (!post) return;

    if (post.type === 'trip') {
      router.push(`/(app)/(trips)/${post.relatedId}` as any);
    } else if (post.type === 'tour') {
      router.push(`/(app)/(feed)/tours/${post.relatedId}` as any);
    } else if (post.type === 'place') {
      router.push(`/(app)/(feed)/places/${post.relatedId}` as any);
    } else {
      // For normal posts, navigate to post detail page
      router.push(`/(app)/(feed)/${postId}` as any);
    }
  }, [posts, router]);

  return (
    <View className="flex-1 bg-white dark:bg-black">
      <Stack.Screen options={{ title: t('home.title'), headerShown: false }} />
      
      {/* Header with Logo - Compact */}
      <View className="px-4 pt-10 pb-2 bg-white dark:bg-black border-b border-gray-200 dark:border-neutral-800">
        <View className="flex-row items-center justify-between mb-2">
          <CustomText weight="bold" className="text-xl text-black dark:text-white">
            {t('common.appName')}
          </CustomText>
          <View className="flex-row items-center gap-2">
            {/* Time Filter Dropdown */}
            <View style={{ position: 'relative' }}>
              <TouchableOpacity
                onPress={() => setTimeFilterOpen(!timeFilterOpen)}
                className="flex-row items-center px-3 py-1.5 rounded-full bg-gray-100 dark:bg-neutral-800"
                activeOpacity={0.7}
              >
                <Ionicons
                  name="time-outline"
                  size={18}
                  color={isDark ? '#9ca3af' : '#6b7280'}
                />
                <Ionicons
                  name={timeFilterOpen ? 'chevron-up' : 'chevron-down'}
                  size={14}
                  color={isDark ? '#9ca3af' : '#6b7280'}
                  style={{ marginLeft: 4 }}
                />
              </TouchableOpacity>

              {timeFilterOpen && (
                <>
                  <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => setTimeFilterOpen(false)}
                    className="absolute -inset-96"
                    style={{ zIndex: 998 }}
                  />
                  <View
                    className="absolute z-50 mt-2 right-0 rounded-xl bg-white dark:bg-neutral-900"
                    style={{
                      minWidth: 140,
                      paddingVertical: 4,
                      shadowColor: '#000',
                      shadowOpacity: 0.15,
                      shadowRadius: 8,
                      shadowOffset: { width: 0, height: 4 },
                      elevation: 6,
                    }}
                  >
                    {timeFilters.map((filter) => (
                      <TouchableOpacity
                        key={filter.id}
                        onPress={() => {
                          setSelectedTimeFilter(filter.id);
                          setTimeFilterOpen(false);
                        }}
                        className={`flex-row items-center px-3 py-2 ${
                          selectedTimeFilter === filter.id
                            ? 'bg-gray-50 dark:bg-neutral-800'
                            : ''
                        }`}
                      >
                        <CustomText
                          weight={selectedTimeFilter === filter.id ? 'bold' : 'regular'}
                          className={`text-sm ${
                            selectedTimeFilter === filter.id
                              ? 'text-primary'
                              : 'text-gray-700 dark:text-gray-300'
                          }`}
                        >
                          {t(`feed.timeFilters.${filter.label}`) || filter.label}
                        </CustomText>
                        {selectedTimeFilter === filter.id && (
                          <Ionicons
                            name="checkmark"
                            size={16}
                            color="#3b82f6"
                            style={{ marginLeft: 'auto' }}
                          />
                        )}
                      </TouchableOpacity>
                    ))}
                  </View>
                </>
              )}
            </View>

            {/* Messages Icon */}
            <TouchableOpacity
              className="w-9 h-9 items-center justify-center rounded-full bg-gray-100 dark:bg-neutral-800 relative"
              onPress={() => router.push('/(app)/(profile)/messages' as any)}
              activeOpacity={0.7}
            >
              <Ionicons
                name="chatbubbles"
                size={18}
                color={isDark ? '#9ca3af' : '#6b7280'}
              />
              {/* Connection Status Badge */}
              <View
                className={`absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full border-2 ${
                  isDark ? 'border-black' : 'border-white'
                } ${isOffline ? 'bg-red-500' : 'bg-green-500'}`}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Feed Tabs and Categories - Compact, Single Row */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="flex-row"
          contentContainerStyle={{ paddingLeft: 0, paddingRight: 0 }}
        >
          {feedTabs.map((tab) => (
            <TouchableOpacity
              key={tab.id}
              onPress={() => {
                setSelectedTab(tab.id);
                // Reset category when switching tabs (categories only work with 'all' tab)
                if (tab.id !== 'all') {
                  setSelectedCategory(null);
                }
              }}
              className={`flex-row items-center px-3 py-1.5 rounded-full mr-2 ${
                selectedTab === tab.id
                  ? 'bg-primary'
                  : 'bg-gray-100 dark:bg-neutral-800'
              }`}
              activeOpacity={0.7}
            >
              <Ionicons
                name={tab.icon as any}
                size={16}
                color={
                  selectedTab === tab.id
                    ? '#fff'
                    : isDark
                      ? '#9ca3af'
                      : '#6b7280'
                }
              />
              <CustomText
                weight={selectedTab === tab.id ? 'bold' : 'regular'}
                className={`ml-1.5 text-xs ${
                  selectedTab === tab.id
                    ? 'text-white'
                    : 'text-gray-700 dark:text-gray-300'
                }`}
              >
                {t(`feed.tabs.${tab.label}`) || tab.label}
              </CustomText>
            </TouchableOpacity>
          ))}

          {/* Category Pills - Only show when "All" tab is selected, inline with tabs */}
          {selectedTab === 'all' &&
            categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                onPress={() =>
                  setSelectedCategory(
                    selectedCategory === category.id ? null : category.id
                  )
                }
                className={`flex-row items-center px-3 py-1.5 rounded-full mr-2 ${
                  selectedCategory === category.id
                    ? 'bg-primary'
                    : 'bg-gray-100 dark:bg-neutral-800'
                }`}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={category.icon as any}
                  size={14}
                  color={
                    selectedCategory === category.id
                      ? '#fff'
                      : isDark
                        ? '#9ca3af'
                        : '#6b7280'
                  }
                />
                <CustomText
                  weight={selectedCategory === category.id ? 'bold' : 'regular'}
                  className={`ml-1.5 text-xs ${
                    selectedCategory === category.id
                      ? 'text-white'
                      : 'text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {t(`explore.categories.${category.label}`)}
                </CustomText>
              </TouchableOpacity>
            ))}
        </ScrollView>
      </View>

      {/* Feed */}
      <FlatList
        data={posts}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <FeedItem
            item={item}
            isDark={isDark}
            t={t}
            onLike={() => handleLike(item.id, item.reactions)}
            onComment={() => handleComment(item.id)}
            onShare={handleShare}
            onUserPress={() => handleUserPress(item.userId)}
            onPostPress={() => handlePostPress(item)}
            onBookmark={handleBookmark}
            onEdit={handleEdit}
            isOwner={user?.id === item.userId}
            onLocationPress={(() => {
              const entity = item.relatedEntity;
              if (!entity) return undefined;
              if ('tripCoordinates' in entity && entity.tripCoordinates) return () => handleLocationPress();
              if ('tourCoordinates' in entity && entity.tourCoordinates) return () => handleLocationPress();
              if ('placeCoordinates' in entity && entity.placeCoordinates) return () => handleLocationPress();
              return undefined;
            })()}
          />
        )}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 4 }}
        ListEmptyComponent={
          loading ? (
            <View className="flex-1 items-center justify-center py-16">
              <CustomText className="text-gray-500 dark:text-gray-400">Loading...</CustomText>
            </View>
          ) : error ? (
            <View className="flex-1 items-center justify-center px-6 py-12">
              <Ionicons name="warning-outline" size={64} color={isDark ? '#ef4444' : '#dc2626'} />
              <CustomText weight="bold" className="text-lg text-gray-800 dark:text-gray-300 mt-4 mb-2 text-center">
                {t('common.error')}
              </CustomText>
              <CustomText className="text-base text-gray-600 dark:text-gray-400 text-center">
                {String((error as any)?.message || 'Failed to load posts')}
              </CustomText>
            </View>
          ) : (
            <View className="flex-1 items-center justify-center px-6 py-12">
              <Ionicons name="newspaper-outline" size={80} color={isDark ? '#4b5563' : '#d1d5db'} />
              <CustomText
                weight="bold"
                className="text-xl text-gray-800 dark:text-gray-300 mt-4 mb-2 text-center"
              >
                {t('feed.emptyState') || 'No posts yet'}
              </CustomText>
              <CustomText className="text-base text-gray-600 dark:text-gray-400 text-center">
                {t('feed.emptyDescription') || 'Be the first to share something!'}
              </CustomText>
            </View>
          )
        }
      />

      {/* Backdrop overlay when FAB expanded */}
      {(fabExpanded || navFabExpanded) && (
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => {
            setFabExpanded(false);
            setNavFabExpanded(false);
          }}
          className="absolute inset-0 bg-black/20"
          style={{ zIndex: 998 }}
        />
      )}

      {/* Navigation FAB - Links to Places, Tours, Archive */}
      <View className="absolute bottom-6 right-24" style={{ zIndex: 999 }}>
        {/* Expanded Options */}
        {navFabExpanded && (
          <View className="absolute bottom-20 right-0 items-end gap-3">
            {/* User Archive Option */}
            <Animated.View
              style={{
                transform: [{ scale: navFabScale }],
                opacity: navFabScale,
              }}
            >
              <TouchableOpacity
                onPress={handleNavigateToArchive}
                className="flex-row items-center bg-white dark:bg-neutral-800 px-4 py-3 rounded-full shadow-lg border border-gray-200 dark:border-neutral-700"
                activeOpacity={0.8}
                disabled={!user?.id}
              >
                <View className="w-10 h-10 items-center justify-center rounded-full bg-primary/10 mr-3">
                  <Ionicons name="archive-outline" size={20} color={isDark ? '#60a5fa' : '#3b82f6'} />
                </View>
                <CustomText weight="medium" className="text-base text-black dark:text-white">
                  {t('feed.nav.archive') || 'My Archive'}
                </CustomText>
              </TouchableOpacity>
            </Animated.View>

            {/* Tours List Option */}
            <Animated.View
              style={{
                transform: [{ scale: navFabScale }],
                opacity: navFabScale,
              }}
            >
              <TouchableOpacity
                onPress={handleNavigateToTours}
                className="flex-row items-center bg-white dark:bg-neutral-800 px-4 py-3 rounded-full shadow-lg border border-gray-200 dark:border-neutral-700"
                activeOpacity={0.8}
              >
                <View className="w-10 h-10 items-center justify-center rounded-full bg-primary/10 mr-3">
                  <Ionicons name="map-outline" size={20} color={isDark ? '#60a5fa' : '#3b82f6'} />
                </View>
                <CustomText weight="medium" className="text-base text-black dark:text-white">
                  {t('feed.nav.tours') || 'Tours'}
                </CustomText>
              </TouchableOpacity>
            </Animated.View>

            {/* Places List Option */}
            <Animated.View
              style={{
                transform: [{ scale: navFabScale }],
                opacity: navFabScale,
              }}
            >
              <TouchableOpacity
                onPress={handleNavigateToPlaces}
                className="flex-row items-center bg-white dark:bg-neutral-800 px-4 py-3 rounded-full shadow-lg border border-gray-200 dark:border-neutral-700"
                activeOpacity={0.8}
              >
                <View className="w-10 h-10 items-center justify-center rounded-full bg-primary/10 mr-3">
                  <Ionicons name="location-outline" size={20} color={isDark ? '#60a5fa' : '#3b82f6'} />
                </View>
                <CustomText weight="medium" className="text-base text-black dark:text-white">
                  {t('feed.nav.places') || 'Places'}
                </CustomText>
              </TouchableOpacity>
            </Animated.View>
          </View>
        )}

        {/* Main Navigation FAB Button */}
        <TouchableOpacity
          onPress={toggleNavFab}
          className="w-14 h-14 items-center justify-center rounded-full bg-gray-600 dark:bg-gray-700 shadow-lg"
          activeOpacity={0.8}
        >
          <Animated.View
            style={{
              transform: [{ rotate: navRotateInterpolate }],
            }}
          >
            <Ionicons name="navigate" size={28} color="#fff" />
          </Animated.View>
        </TouchableOpacity>
      </View>

      {/* Multi-Add FAB - Create Post, Place, Tour */}
      <View className="absolute bottom-6 right-6" style={{ zIndex: 999 }}>
        {/* Expanded Options */}
        {fabExpanded && (
          <View className="absolute bottom-20 right-0 items-end gap-3">
            {/* Create Post Option */}
            <Animated.View
              style={{
                transform: [{ scale: fabScale }],
                opacity: fabScale,
              }}
            >
              <TouchableOpacity
                onPress={handleCreatePost}
                className="flex-row items-center bg-white dark:bg-neutral-800 px-4 py-3 rounded-full shadow-lg border border-gray-200 dark:border-neutral-700"
                activeOpacity={0.8}
              >
                <View className="w-10 h-10 items-center justify-center rounded-full bg-primary/10 mr-3">
                  <Ionicons name="create-outline" size={20} color={isDark ? '#60a5fa' : '#3b82f6'} />
                </View>
                <CustomText weight="medium" className="text-base text-black dark:text-white">
                  {t('feed.create.post') || 'Post'}
                </CustomText>
              </TouchableOpacity>
            </Animated.View>

            {/* Create Place Option */}
            <Animated.View
              style={{
                transform: [{ scale: fabScale }],
                opacity: fabScale,
              }}
            >
              <TouchableOpacity
                onPress={handleCreatePlace}
                className="flex-row items-center bg-white dark:bg-neutral-800 px-4 py-3 rounded-full shadow-lg border border-gray-200 dark:border-neutral-700"
                activeOpacity={0.8}
              >
                <View className="w-10 h-10 items-center justify-center rounded-full bg-primary/10 mr-3">
                  <Ionicons name="location" size={20} color={isDark ? '#60a5fa' : '#3b82f6'} />
                </View>
                <CustomText weight="medium" className="text-base text-black dark:text-white">
                  {t('feed.create.place') || 'Place'}
                </CustomText>
              </TouchableOpacity>
            </Animated.View>

            {/* Create Tour Option */}
            <Animated.View
              style={{
                transform: [{ scale: fabScale }],
                opacity: fabScale,
              }}
            >
              <TouchableOpacity
                onPress={handleCreateTour}
                className="flex-row items-center bg-white dark:bg-neutral-800 px-4 py-3 rounded-full shadow-lg border border-gray-200 dark:border-neutral-700"
                activeOpacity={0.8}
              >
                <View className="w-10 h-10 items-center justify-center rounded-full bg-primary/10 mr-3">
                  <Ionicons name="map" size={20} color={isDark ? '#60a5fa' : '#3b82f6'} />
                </View>
                <CustomText weight="medium" className="text-base text-black dark:text-white">
                  {t('feed.create.tour') || 'Tour'}
                </CustomText>
              </TouchableOpacity>
            </Animated.View>
          </View>
        )}

        {/* Main FAB Button */}
        <TouchableOpacity
          onPress={toggleFab}
          className="w-14 h-14 items-center justify-center rounded-full bg-primary shadow-lg"
          activeOpacity={0.8}
        >
          <Animated.View
            style={{
              transform: [{ rotate: rotateInterpolate }],
            }}
          >
            <Ionicons name="add" size={28} color="#fff" />
          </Animated.View>
        </TouchableOpacity>
      </View>

      {/* Share Modal for creating normal posts */}
      <ShareModal
        visible={showShareModal}
        onClose={() => setShowShareModal(false)}
      />
    </View>
  );
}

