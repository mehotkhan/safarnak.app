import { useState, useMemo, useCallback, useEffect } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { CustomText } from '@components/ui/CustomText';
import { LoadingState } from '@components/ui/LoadingState';
import { ErrorState } from '@components/ui/ErrorState';
import { EmptyState } from '@components/ui/EmptyState';
import { FeedItem } from '@components/cards';
import { useTheme } from '@components/context/ThemeContext';
import { useSystemStatus } from '@hooks/useSystemStatus';
import { useGetPostsQuery, GetPostsDocument, useCreateReactionMutation, useDeleteReactionMutation, useBookmarkPostMutation } from '@api';
import ShareModal from '@components/ui/ShareModal';
import { useAppSelector } from '@store/hooks';
import { useRefresh } from '@hooks/useRefresh';
import { useInfiniteScroll } from '@hooks/useInfiniteScroll';
import { TabBar } from '@components/ui/TabBar';
import { Dropdown } from '@components/ui/Dropdown';

const categories = [
  { id: 'trips', label: 'trips', icon: 'airplane-outline' },
  { id: 'food', label: 'food', icon: 'restaurant-outline' },
  { id: 'culture', label: 'culture', icon: 'color-palette-outline' },
];

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
  const limit = 20;

  const [showShareModal, setShowShareModal] = useState(false);

  const handleCreatePost = () => {
    setShowShareModal(true);
  };

  const { isOnline, isBackendReachable } = useSystemStatus();
  
  // Show offline icon if offline OR backend unreachable
  const isOffline = !isOnline || !isBackendReachable;

  // Calculate date filter based on time filter
  const getDateFilter = useCallback(() => {
    if (selectedTimeFilter === 'all') return { after: undefined, before: undefined };
    const filter = timeFilters.find(f => f.id === selectedTimeFilter);
    if (!filter || !filter.days) return { after: undefined, before: undefined };
    
    const now = new Date();
    const after = new Date(now.getTime() - filter.days * 24 * 60 * 60 * 1000);
    return {
      after: after.toISOString(),
      before: undefined,
    };
  }, [selectedTimeFilter]);

  // Determine post type based on selected tab
  const getPostType = useCallback(() => {
    if (selectedTab === 'tours') return 'tour';
    if (selectedTab === 'places') return 'place';
    // For 'all' tab, use category filter if selected
    if (selectedCategory === 'trips') return 'trip';
    // For 'all' tab with no category or other categories (food, culture), show all
    return undefined;
  }, [selectedTab, selectedCategory]);

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

  // Use refresh hook
  const { refreshing, onRefresh } = useRefresh(async () => {
      await refetch();
  });

  // Use infinite scroll hook
  const { loadMore, reset } = useInfiniteScroll({
    limit,
    hasNextPage: data?.getPosts?.hasNextPage || false,
    loading,
    fetchMore,
    getVariables: (newOffset) => ({
        type: postType,
        limit,
        offset: newOffset,
        after: dateFilter.after,
        before: dateFilter.before,
    }),
    });

  // Reset offset when category, tab, or time filter changes
  useEffect(() => {
    reset();
  }, [selectedCategory, selectedTab, selectedTimeFilter, reset]);

  const handleRefresh = useCallback(async () => {
    reset();
    await onRefresh();
  }, [onRefresh, reset]);

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
  }, [user, createReaction, deleteReaction]);

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
      router.push(`/(app)/(explore)/tours/${post.relatedId}` as any);
    } else if (post.type === 'place') {
      router.push(`/(app)/(explore)/places/${post.relatedId}` as any);
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
            <Dropdown
              options={timeFilters.map(f => ({ id: f.id, label: f.label }))}
              value={selectedTimeFilter}
              onChange={setSelectedTimeFilter}
              icon="time-outline"
              translationKey="feed.timeFilters"
            />

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
          <TabBar
            tabs={feedTabs}
            activeTab={selectedTab}
            onTabChange={(tabId) => {
              setSelectedTab(tabId);
                // Reset category when switching tabs (categories only work with 'all' tab)
              if (tabId !== 'all') {
                  setSelectedCategory(null);
                }
              }}
            variant="scrollable"
          />

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
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 4 }}
        ListEmptyComponent={
          loading ? (
            <LoadingState message="Loading..." className="py-16" />
          ) : error ? (
            <ErrorState
              title={t('common.error')}
              message={String((error as any)?.message || 'Failed to load posts')}
              onRetry={() => refetch()}
            />
          ) : (
            <EmptyState
              icon="newspaper-outline"
              title={t('feed.emptyState') || 'No posts yet'}
              description={t('feed.emptyDescription') || 'Be the first to share something!'}
            />
          )
        }
      />

      {/* Create Post FAB - Simple button, no expansion */}
              <TouchableOpacity
                onPress={handleCreatePost}
        className="absolute bottom-6 right-6 w-14 h-14 items-center justify-center rounded-full bg-primary shadow-lg"
              style={{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 4.65,
          elevation: 8,
          zIndex: 999,
        }}
                activeOpacity={0.8}
              >
        <Ionicons name="create-outline" size={28} color="#fff" />
              </TouchableOpacity>

      {/* Share Modal for creating normal posts */}
      <ShareModal
        visible={showShareModal}
        onClose={() => setShowShareModal(false)}
      />
    </View>
  );
}

