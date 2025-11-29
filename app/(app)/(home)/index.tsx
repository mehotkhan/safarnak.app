import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import {
  View,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { CustomText } from '@ui/display';
import { LoadingState } from '@ui/feedback';
import { ErrorState } from '@ui/feedback';
import { EmptyState } from '@ui/feedback';
import { FeedItem, MyTripCard } from '@ui/cards';
import { useTheme } from '@ui/context';
import { useSystemStatus } from '@hooks/useSystemStatus';
import { FAB } from '@ui/components';
import { useGetFeedQuery, useFeedNewEventsSubscription, GetPostsDocument, useCreateReactionMutation, useDeleteReactionMutation, useBookmarkPostMutation, GetFeedDocument, useGetTripsQuery } from '@api';
import { client } from '@api';
import { useAppSelector } from '@state/hooks';
import { useRefresh } from '@hooks/useRefresh';
import { Dropdown } from '@ui/forms';
import { useDateTime } from '@hooks/useDateTime';

const timeFilters = [
  { id: 'all', label: 'allTime', days: null },
  { id: 'today', label: 'today', days: 1 },
  { id: 'week', label: 'thisWeek', days: 7 },
  { id: 'month', label: 'thisMonth', days: 30 },
];

export default function HomeScreen() {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const router = useRouter();
  const { user } = useAppSelector(state => state.auth);
  const [selectedTimeFilter, setSelectedTimeFilter] = useState('all');
  const limit = 20;

  const [newItemsCount, setNewItemsCount] = useState(0);
  const [, setQueuedEvents] = useState<any[]>([]);
  const [items, setItems] = useState<any[]>([]);
  const [endCursor, setEndCursor] = useState<string | undefined>(undefined);
  const [hasNextPage, setHasNextPage] = useState<boolean>(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const { isOnline, isBackendReachable } = useSystemStatus();
  const { getNow, isFuture } = useDateTime();
  const [filterBounds, setFilterBounds] = useState<{ after?: string; before?: string }>({ after: undefined, before: undefined });
  
  // Show offline icon if offline OR backend unreachable
  const isOffline = !isOnline || !isBackendReachable;

  // Get user's trips for My Trip Card
  const { data: tripsData } = useGetTripsQuery({
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all',
  });

  // Find active or upcoming trip
  const myTrip = useMemo(() => {
    const trips = tripsData?.getTrips || [];
    if (!Array.isArray(trips)) return null;

    // First, try to find active trip
    const activeTrip = trips.find(trip => {
      if (trip.status === 'active' || trip.status === 'in_progress') {
        if (trip.startDate && trip.endDate) {
          const now = new Date();
          const start = new Date(trip.startDate);
          const end = new Date(trip.endDate);
          return now >= start && now <= end;
        }
      }
      return false;
    });

    if (activeTrip) return activeTrip;

    // Then, try to find upcoming trip
    const upcomingTrip = trips.find(trip => {
      return trip.startDate && isFuture(trip.startDate);
    });

    return upcomingTrip || null;
  }, [tripsData, isFuture]);

  // Compute stable time window bounds only when selection changes
  useEffect(() => {
    const filter = timeFilters.find(f => f.id === selectedTimeFilter);
    if (!filter || !filter.days) {
      setFilterBounds({ after: undefined, before: undefined });
      return;
    }
    const now = getNow(); // capture once
    const afterIso = now.minus({ days: filter.days }).toISO() || undefined;
    setFilterBounds({ after: afterIso, before: undefined });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTimeFilter]);

  // Track if we've loaded cached data on mount
  const hasLoadedCachedData = useRef(false);
  const [initialLoading, setInitialLoading] = useState(true);

  // Helper function to transform feed edges to items
  const transformFeedEdgesToItems = useCallback((edges: any[]) => {
    return edges
      .map((e: any) => e?.node)
      .filter(Boolean)
      .filter((n: any) => n.entityType === 'POST')
      .map((n: any) => {
        const ent = n.entity || {};
        const actor = n.actor || {};
        return {
          ...ent,
          id: ent.id,
          userId: ent.userId,
          content: ent.content,
          comments: ent.comments || [],
          commentsCount: ent.commentsCount || 0,
          reactions: ent.reactions || [],
          reactionsCount: ent.reactionsCount || 0,
          createdAt: ent.createdAt,
          user: {
            id: actor.id,
            name: actor.name,
            username: actor.username,
            avatar: actor.avatar,
            createdAt: actor.createdAt,
          },
        };
      });
  }, []);

  // Load cached data from Apollo cache immediately on mount (offline-first)
  useEffect(() => {
    if (hasLoadedCachedData.current) return;
    
    // Try to read cached feed data from Apollo cache
    // Try multiple times in case cache is still being restored
    let attempts = 0;
    const maxAttempts = 5;
    const attemptInterval = 100; // 100ms between attempts
    
    const tryLoadCache = () => {
      attempts++;
      try {
        const cachedData = client.readQuery({
          query: GetFeedDocument,
          variables: {
            first: limit,
            after: undefined,
            filter: {
              entityTypes: ['POST'] as any,
              createdAtAfter: filterBounds.after,
              createdAtBefore: filterBounds.before,
            },
          },
        });

        if (cachedData?.getFeed?.edges) {
          const cachedItems = transformFeedEdgesToItems(cachedData.getFeed.edges);
          if (cachedItems.length > 0) {
            setItems(cachedItems);
            setEndCursor(cachedData.getFeed.pageInfo?.endCursor || undefined);
            setHasNextPage(Boolean(cachedData.getFeed.pageInfo?.hasNextPage));
            hasLoadedCachedData.current = true;
            setInitialLoading(false); // We have cached data, don't show loading
            return;
          }
        }
      } catch (_error) {
        // Cache miss or not ready yet
      }
      
      // If we haven't found cached data and haven't exceeded max attempts, try again
      if (attempts < maxAttempts) {
        setTimeout(tryLoadCache, attemptInterval);
      } else {
        // No cached data found after all attempts
        setInitialLoading(false);
        if (__DEV__) {
          console.debug('[Feed] No cached data found after attempts, will fetch from network');
        }
      }
    };
    
    // Start trying immediately
    tryLoadCache();
  }, [limit, filterBounds.after, filterBounds.before, transformFeedEdgesToItems]);

  const { data, loading, error, refetch, fetchMore } = useGetFeedQuery({
    variables: {
      first: limit,
      after: undefined,
      filter: {
        entityTypes: ['POST'] as any,
        createdAtAfter: filterBounds.after,
        createdAtBefore: filterBounds.before,
      },
    },
    fetchPolicy: 'cache-and-network', // Show cached data immediately, then fetch fresh data
    errorPolicy: 'all',
    notifyOnNetworkStatusChange: true, // Notify when network fetch completes
  } as any);

  // Reset list when filter changes and refetch
  useEffect(() => {
    hasLoadedCachedData.current = false; // Reset flag when filter changes
    setItems([]);
    setEndCursor(undefined);
    setHasNextPage(false);
    setInitialLoading(true);
    
    // Try to load cached data for new filter immediately
    try {
      const cachedData = client.readQuery({
        query: GetFeedDocument,
        variables: {
          first: limit,
          after: undefined,
          filter: {
            entityTypes: ['POST'] as any,
            createdAtAfter: filterBounds.after,
            createdAtBefore: filterBounds.before,
          },
        },
      });

      if (cachedData?.getFeed?.edges) {
        const cachedItems = transformFeedEdgesToItems(cachedData.getFeed.edges);
        if (cachedItems.length > 0) {
          setItems(cachedItems);
          setEndCursor(cachedData.getFeed.pageInfo?.endCursor || undefined);
          setHasNextPage(Boolean(cachedData.getFeed.pageInfo?.hasNextPage));
          hasLoadedCachedData.current = true;
          setInitialLoading(false); // We have cached data, don't show loading
        } else {
          setInitialLoading(false);
        }
      } else {
        setInitialLoading(false);
      }
    } catch {
      // Cache miss - will fetch from network
      setInitialLoading(false);
    }
    
    refetch({
      first: limit,
      after: undefined,
      filter: {
        entityTypes: ['POST'] as any,
        createdAtAfter: filterBounds.after,
        createdAtBefore: filterBounds.before,
      },
    } as any);
  }, [filterBounds.after, filterBounds.before, refetch, limit, transformFeedEdgesToItems]);

  // Update list from query data (merges with cached data if available)
  useEffect(() => {
    if (!data?.getFeed) return;
    
    const edges = data.getFeed.edges || [];
    const newItems = transformFeedEdgesToItems(edges);
    
    // Replace with new items from network (fresh data)
    // This will merge with cached data that was already shown
    if (newItems.length > 0) {
      setItems(newItems);
      setInitialLoading(false); // We have data now, don't show loading
    }
    
    setEndCursor(data.getFeed.pageInfo?.endCursor || undefined);
    setHasNextPage(Boolean(data.getFeed.pageInfo?.hasNextPage));
  }, [data, transformFeedEdgesToItems]);

  // Subscribe and queue up to 50 new events; cap banner at 9+
  useFeedNewEventsSubscription({
    variables: { filter: { entityTypes: ['POST'] as any } },
    onData: ({ data }: { data?: any }) => {
      try {
        const incoming = (data?.data as any)?.feedNewEvents || [];
        if (!Array.isArray(incoming) || incoming.length === 0) return;
        setQueuedEvents((prev) => {
          const existingIds = new Set(items.map((p) => p.id));
          const queuedIds = new Set(prev.map((ev) => ev.entityId));
          const add = incoming.filter(
            (ev: any) => ev.entityType === 'POST' && !existingIds.has(ev.entityId) && !queuedIds.has(ev.entityId)
          );
          const merged = [...prev, ...add];
          setNewItemsCount(Math.min(9, merged.length));
          return merged.slice(-50);
        });
      } catch {
        // ignore
      }
    },
  } as any);

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

  // Use refresh hook
  const { refreshing, onRefresh } = useRefresh(async () => {
    await refetch();
  });

  const loadMore = useCallback(async () => {
    if (loadingMore || !hasNextPage || !endCursor) return;
    try {
      setLoadingMore(true);
      const res = await fetchMore({
        variables: {
          first: limit,
          after: endCursor,
          filter: {
            entityTypes: ['POST'] as any,
            createdAtAfter: filterBounds.after,
            createdAtBefore: filterBounds.before,
          },
        },
      } as any);
      const edges = (res?.data as any)?.getFeed?.edges || [];
      const next = edges
        .map((e: any) => e?.node)
        .filter(Boolean)
        .filter((n: any) => n.entityType === 'POST')
        .map((n: any) => {
          const ent = n.entity || {};
          return {
            ...ent,
            id: ent.id,
            userId: ent.userId,
            content: ent.content,
            createdAt: ent.createdAt,
          };
        });
      if (next.length) {
        setItems((prev) => [...prev, ...next]);
      }
      setEndCursor((res?.data as any)?.getFeed?.pageInfo?.endCursor);
      setHasNextPage(Boolean((res?.data as any)?.getFeed?.pageInfo?.hasNextPage));
    } finally {
      setLoadingMore(false);
    }
  }, [fetchMore, endCursor, hasNextPage, loadingMore, filterBounds.after, filterBounds.before]);

  const handleRefresh = useCallback(async () => {
    await onRefresh();
  }, [onRefresh]);

  const handleShowNew = useCallback(() => {
    setQueuedEvents((prev) => {
      const take = prev.slice(0, 3);
      const rest = prev.slice(3);
      const mapped = take.map((n: any) => {
        const ent = n.entity || {};
        const actor = n.actor || {};
        return {
          ...ent,
          id: ent.id,
          userId: ent.userId,
          content: ent.content,
          comments: ent.comments || [],
          commentsCount: ent.commentsCount || 0,
          reactions: ent.reactions || [],
          reactionsCount: ent.reactionsCount || 0,
          createdAt: ent.createdAt,
          user: {
            id: actor.id,
            name: actor.name,
            username: actor.username,
            avatar: actor.avatar,
            createdAt: actor.createdAt,
          },
        };
      });
      setItems((cur) => {
        const ids = new Set(cur.map((p) => p.id));
        const toPrepend = mapped.filter((m) => !ids.has(m.id));
        return [...toPrepend, ...cur];
      });
      const remaining = Math.min(9, rest.length);
      setNewItemsCount(remaining);
      return rest;
    });
  }, []);

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
    router.push(`/(app)/(home)/${postId}` as any);
  };

  const handleShare = () => {
    console.log('Share pressed');
    // TODO: Implement share functionality
  };

  const handleUserPress = (userId: string) => {
    // Switch to Explore tab first, then push user profile to maintain healthy history stack
    router.push('/(app)/(explore)' as any);
    setTimeout(() => {
      router.push(`/(app)/(explore)/users/${userId}` as any);
    }, 0);
  };

  const handlePostPress = (item: any) => {
    // Always navigate to post detail page
    router.push(`/(app)/(home)/${item.id}` as any);
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
    const post = items.find((p: any) => p.id === postId);
    if (!post) return;

    if (post.type === 'trip' || post.type === 'tour') {
      // Tour is now unified into Trip with isHosted flag
      router.push(`/(app)/(trips)/${post.relatedId}` as any);
    } else if (post.type === 'place') {
      router.push(`/(app)/(explore)/places/${post.relatedId}` as any);
    } else {
      // For normal posts, navigate to post detail page
      router.push(`/(app)/(home)/${postId}` as any);
    }
  }, [items, router]);

  return (
    <View className="flex-1 bg-white dark:bg-black">
      <Stack.Screen options={{ title: t('home.title'), headerShown: false }} />
      
      {/* Header with Logo - Compact */}
      <View className="px-4 pt-12 pb-2 bg-white dark:bg-black border-b border-gray-200 dark:border-neutral-800">
        <View className="flex-row items-center justify-between mb-2">
          <CustomText weight="bold" className="text-xl text-black dark:text-white">
            {t('common.appName')}
          </CustomText>
          <View className="flex-row items-center gap-2">
            {/* Timeline Filter */}
            <Dropdown
              options={timeFilters.map(f => ({ id: f.id, label: f.label }))}
              value={selectedTimeFilter}
              onChange={setSelectedTimeFilter}
              icon="time-outline"
              translationKey="feed.timeFilters"
            />

            {/* Customize Feed Preferences */}
            <TouchableOpacity
              className="w-9 h-9 items-center justify-center rounded-full bg-gray-100 dark:bg-neutral-800"
              onPress={() => router.push('/(app)/(me)/settings/preferences' as any)}
              activeOpacity={0.7}
            >
              <Ionicons
                name="options-outline"
                size={20}
                color={isDark ? '#9ca3af' : '#6b7280'}
              />
            </TouchableOpacity>

            {/* Messages Icon */}
            <TouchableOpacity
              className="w-9 h-9 items-center justify-center rounded-full bg-gray-100 dark:bg-neutral-800 relative"
              onPress={() => {
                router.push('/(app)/(inbox)/messages' as any);
              }}
              activeOpacity={0.7}
            >
              <Ionicons
                name="chatbubbles"
                size={20}
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

        {/* Travel Inspirations Button */}
        <TouchableOpacity
          onPress={() => router.push('/(app)/(home)/inspirations' as any)}
          className="mt-2 mb-2 p-3 rounded-xl flex-row items-center justify-between"
          style={{ backgroundColor: isDark ? '#1f2937' : '#f3f4f6' }}
          activeOpacity={0.7}
        >
          <View className="flex-row items-center gap-3">
            <View
              className="w-10 h-10 rounded-full items-center justify-center"
              style={{ backgroundColor: isDark ? '#374151' : '#e5e7eb' }}
            >
              <Ionicons
                name="compass"
                size={24}
                color={isDark ? '#fbbf24' : '#f59e0b'}
              />
            </View>
            <View>
              <CustomText weight="bold" className="text-base" style={{ color: isDark ? '#fff' : '#000' }}>
                {t('feed.inspirations')}
              </CustomText>
              <CustomText className="text-xs" style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>
                {t('feed.popularTrips')}
              </CustomText>
            </View>
          </View>
          <Ionicons
            name="chevron-forward"
            size={20}
            color={isDark ? '#9ca3af' : '#6b7280'}
          />
        </TouchableOpacity>
      </View>

      {/* New items banner */}
      {newItemsCount > 0 && (
        <TouchableOpacity
          onPress={handleShowNew}
          activeOpacity={0.8}
          className="mx-4 mt-3 mb-1 rounded-full bg-primary items-center justify-center"
          style={{ paddingVertical: 8 }}
        >
          <CustomText weight="bold" className="text-white">
            {newItemsCount > 3
              ? t('feed.showNewItems', { count: 3, total: newItemsCount > 9 ? '9+' : newItemsCount }) || `Show 3 new (${newItemsCount > 9 ? '9+' : newItemsCount})`
              : t('feed.showNewItem', { count: newItemsCount }) || `Show ${newItemsCount} new`}
          </CustomText>
        </TouchableOpacity>
      )}

      {/* Feed */}
      <FlatList
        data={items}
        keyExtractor={item => item.id}
        ListHeaderComponent={
          <View className="px-4">
            {/* My Trip Card */}
            <MyTripCard trip={myTrip} />
          </View>
        }
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
          // Only show loading if we don't have any items AND we're still loading
          // If we have items (cached or fresh), don't show loading spinner
          items.length === 0 && (initialLoading || loading) ? (
            <LoadingState message="Loading..." className="py-16" />
          ) : items.length === 0 && error ? (
            <ErrorState
              title={t('common.error')}
              message={String((error as any)?.message || 'Failed to load posts')}
              onRetry={() => refetch()}
            />
          ) : items.length === 0 ? (
            <EmptyState
              icon="newspaper-outline"
              title={t('feed.emptyState') || 'No posts yet'}
              description={t('feed.emptyDescription') || 'Be the first to share something!'}
            />
          ) : null
        }
      />

      {/* FAB */}
      <FAB
        options={[
          {
            id: 'experience',
            label: 'Create Experience',
            translationKey: 'feed.newPost.title',
            icon: 'create-outline',
            route: '/(app)/compose',
          },
          {
            id: 'trip',
            label: 'Create Trip',
            translationKey: 'plan.createPlan',
            icon: 'airplane-outline',
            route: '/(app)/compose',
          },
          {
            id: 'place',
            label: 'Add Place',
            translationKey: 'places.addPlace',
            icon: 'location-outline',
            route: '/(app)/compose',
          },
        ]}
      />
    </View>
  );
}

