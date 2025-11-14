import { useMemo, useState, useCallback, useEffect } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useRouter, useLocalSearchParams, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { CustomText } from '@ui/display';
import { CustomButton } from '@ui/forms';
import { useTheme } from '@ui/context';
import {
  useGetUserQuery,
  useGetPostsQuery,
  useGetTripsQuery,
  useIsFollowingQuery,
  useFollowUserMutation,
  useUnfollowUserMutation,
  useGetFollowersQuery,
  useGetFollowingQuery,
} from '@api';
import { useAppSelector } from '@state/hooks';
import { useDateTime } from '@hooks/useDateTime';
import Colors from '@constants/Colors';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const appIcon = require('@assets/images/icon.webp');

export default function UserProfileScreen() {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const userId = useMemo(() => (Array.isArray(id) ? id[0] : id) as string, [id]);
  const { user: currentUser } = useAppSelector(state => state.auth);
  const [selectedTab, setSelectedTab] = useState<'posts' | 'trips'>('posts');
  const [isFollowing, setIsFollowing] = useState(false);
  const { formatDate } = useDateTime();

  // GraphQL queries
  const { data, loading, error, refetch: refetchUser } = useGetUserQuery({
    variables: { id: userId },
    skip: !userId,
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all',
  });

  const user = data?.getUser as any;

  // Fetch user's posts
  const { data: postsData, refetch: refetchPosts } = useGetPostsQuery({
    variables: { limit: 20, offset: 0 },
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all',
  });

  // Fetch user's trips
  const { data: tripsData, refetch: refetchTrips } = useGetTripsQuery({
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all',
  });
  // Followers/Following data for counters
  const { data: followersData, refetch: refetchFollowers } = useGetFollowersQuery({
    variables: { userId: userId as string },
    skip: !userId,
    fetchPolicy: 'cache-and-network',
  } as any);
  const { data: followingData, refetch: refetchFollowing } = useGetFollowingQuery({
    variables: { userId: userId as string },
    skip: !userId,
    fetchPolicy: 'cache-and-network',
  } as any);
  const followersCount = followersData?.getFollowers?.length || 0;
  const followingCount = followingData?.getFollowing?.length || 0;

  // Is following state
  const { data: isFollowingData, refetch: refetchIsFollowing } = useIsFollowingQuery({
    variables: { userId: userId as string },
    skip: !userId,
    fetchPolicy: 'cache-and-network',
  } as any);

  // Sync local state when query returns
  useEffect(() => {
    if (typeof isFollowingData?.isFollowing === 'boolean') {
      setIsFollowing(isFollowingData.isFollowing);
    }
  }, [isFollowingData?.isFollowing]);

  // Mutations
  const [followUser] = useFollowUserMutation();
  const [unfollowUser] = useUnfollowUserMutation();

  // Pull-to-refresh
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(async () => {
    try {
      setRefreshing(true);
      await Promise.all([
        refetchUser(),
        refetchPosts(),
        refetchTrips(),
        refetchFollowers(),
        refetchFollowing(),
        refetchIsFollowing(),
      ]);
    } finally {
      setRefreshing(false);
    }
  }, [refetchUser, refetchPosts, refetchTrips, refetchFollowers, refetchFollowing, refetchIsFollowing]);

  // Filter posts and trips by user
  const userPosts = useMemo(() => {
    if (!postsData?.getPosts?.posts || !userId) return [];
    return postsData.getPosts.posts.filter((post: any) => post.userId === userId).slice(0, 9);
  }, [postsData, userId]);

  const userTrips = useMemo(() => {
    if (!tripsData?.getTrips || !userId) return [];
    return tripsData.getTrips.filter((trip: any) => trip.userId === userId);
  }, [tripsData, userId]);

  const handleFollow = async () => {
    if (!userId) return;
    try {
      if (isFollowing) {
        await unfollowUser({ variables: { followeeId: userId as string } } as any);
        setIsFollowing(false);
      } else {
        await followUser({ variables: { followeeId: userId as string } } as any);
        setIsFollowing(true);
      }
      // Refresh counts/state
      await Promise.all([refetchFollowers(), refetchIsFollowing()]);
    } catch (_e) {
      // revert on failure
      setIsFollowing((prev) => !prev);
    }
  };

  const handleMessage = () => {
    router.push(`/(app)/(profile)/messages/${userId}` as any);
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white dark:bg-black">
        <ActivityIndicator size="large" color={isDark ? Colors.dark.primary : Colors.light.primary} />
        <CustomText className="text-gray-500 dark:text-gray-400 mt-4">
          {t('common.loading')}
        </CustomText>
      </View>
    );
  }

  if (error || !user) {
    return (
      <View className="flex-1 items-center justify-center px-6 bg-white dark:bg-black">
        <Ionicons name="warning-outline" size={64} color={isDark ? '#ef4444' : '#dc2626'} />
        <CustomText weight="bold" className="text-lg text-gray-800 dark:text-gray-300 mt-4 mb-2 text-center">
          {t('common.error')}
        </CustomText>
        <CustomText className="text-base text-gray-600 dark:text-gray-400 text-center">
          {String((error as any)?.message || t('common.errorMessage') || 'User not found')}
        </CustomText>
        <TouchableOpacity
          onPress={() => router.back()}
          className="mt-4 bg-primary px-6 py-3 rounded-lg"
        >
          <CustomText className="text-white" weight="medium">
            {t('common.back') || 'Go Back'}
          </CustomText>
        </TouchableOpacity>
      </View>
    );
  }

  const isOwnProfile = currentUser?.id === userId;
  const joinedDate = user.createdAt ? formatDate(user.createdAt, 'long') : '';

  return (
    <ScrollView className="flex-1 bg-white dark:bg-black" refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
      <Stack.Screen 
        options={{ 
          title: user.username || 'User', 
          headerShown: true,
          headerBackVisible: true,
        }} 
      />

      {/* Header */}
      <View className="px-6 py-6 border-b border-gray-200 dark:border-neutral-800">
        <View className="flex-row items-start mb-4">
          {/* Avatar */}
          <View className="w-20 h-20 rounded-full overflow-hidden bg-white dark:bg-neutral-800 border-2 border-primary mr-4">
            <Image
              source={appIcon}
              className="w-full h-full"
              resizeMode="contain"
            />
          </View>

          {/* Stats */}
          <View className="flex-1 flex-row justify-around">
            <View className="items-center">
              <CustomText weight="bold" className="text-xl text-black dark:text-white">
                {userPosts.length}
              </CustomText>
              <CustomText className="text-sm text-gray-600 dark:text-gray-400">
                {t('userProfile.posts')}
              </CustomText>
            </View>
            <View className="items-center">
              <CustomText weight="bold" className="text-xl text-black dark:text-white">
                {followersCount}
              </CustomText>
              <CustomText className="text-sm text-gray-600 dark:text-gray-400">
                {t('userProfile.followers')}
              </CustomText>
            </View>
            <View className="items-center">
              <CustomText weight="bold" className="text-xl text-black dark:text-white">
                {followingCount}
              </CustomText>
              <CustomText className="text-sm text-gray-600 dark:text-gray-400">
                {t('userProfile.following')}
              </CustomText>
            </View>
          </View>
        </View>

        {/* User Info */}
        <CustomText weight="bold" className="text-xl text-black dark:text-white mb-1">
          {user.name}
        </CustomText>
        {user.avatar && (
          <View className="mb-3">
            <Image
              source={{ uri: user.avatar }}
              className="w-16 h-16 rounded-full"
              resizeMode="cover"
            />
          </View>
        )}

        {joinedDate && (
          <View className="flex-row items-center mb-3">
            <Ionicons name="calendar-outline" size={14} color={isDark ? '#9ca3af' : '#6b7280'} />
            <CustomText className="text-sm text-gray-600 dark:text-gray-400 ml-2">
              {t('userProfile.joined')} {joinedDate}
            </CustomText>
          </View>
        )}

        {/* Action Buttons */}
        {!isOwnProfile && (
          <View className="flex-row gap-3 mt-4">
            <View className="flex-1">
              <CustomButton
                title={isFollowing ? t('userProfile.following') : t('userProfile.follow')}
                onPress={handleFollow}
                bgVariant={isFollowing ? 'secondary' : 'primary'}
                IconLeft={() => (
                  <Ionicons
                    name={isFollowing ? 'checkmark' : 'person-add'}
                    size={16}
                    color={isFollowing ? (isDark ? '#fff' : '#000') : '#fff'}
                    style={{ marginRight: 8 }}
                  />
                )}
              />
            </View>
            <View className="flex-1">
              <CustomButton
                title={t('userProfile.message')}
                onPress={handleMessage}
                bgVariant="secondary"
                IconLeft={() => (
                  <Ionicons
                    name="mail-outline"
                    size={16}
                    color={isDark ? '#fff' : '#000'}
                    style={{ marginRight: 8 }}
                  />
                )}
              />
            </View>
          </View>
        )}
      </View>

      {/* Tabs */}
      <View className="flex-row border-b border-gray-200 dark:border-neutral-800">
        <TouchableOpacity
          onPress={() => setSelectedTab('posts')}
          className={`flex-1 py-4 items-center border-b-2 ${
            selectedTab === 'posts'
              ? 'border-primary'
              : 'border-transparent'
          }`}
        >
          <CustomText
            weight={selectedTab === 'posts' ? 'bold' : 'regular'}
            className={
              selectedTab === 'posts'
                ? 'text-primary'
                : 'text-gray-600 dark:text-gray-400'
            }
          >
            {t('userProfile.posts')}
          </CustomText>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setSelectedTab('trips')}
          className={`flex-1 py-4 items-center border-b-2 ${
            selectedTab === 'trips'
              ? 'border-primary'
              : 'border-transparent'
          }`}
        >
          <CustomText
            weight={selectedTab === 'trips' ? 'bold' : 'regular'}
            className={
              selectedTab === 'trips'
                ? 'text-primary'
                : 'text-gray-600 dark:text-gray-400'
            }
          >
            {t('userProfile.trips')}
          </CustomText>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View className="px-6 py-4">
        {selectedTab === 'posts' ? (
          userPosts.length > 0 ? (
            <View className="flex-row flex-wrap gap-2">
              {userPosts.map((post: any) => (
                <TouchableOpacity
                  key={post.id}
                  onPress={() => router.push(`/(app)/(feed)/${post.id}` as any)}
                  className="w-[32%] aspect-square bg-gray-200 dark:bg-neutral-800 rounded-lg items-center justify-center"
                >
                  {post.attachments && post.attachments.length > 0 ? (
                    <Image
                      source={{ uri: post.attachments[0] }}
                      className="w-full h-full rounded-lg"
                      resizeMode="cover"
                    />
                  ) : (
                    <Ionicons name="image-outline" size={40} color={isDark ? '#666' : '#9ca3af'} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <View className="items-center justify-center py-12">
              <Ionicons name="image-outline" size={64} color={isDark ? '#4b5563' : '#d1d5db'} />
              <CustomText className="text-gray-600 dark:text-gray-400 mt-4">
                {t('userProfile.noPosts') || 'No posts yet'}
              </CustomText>
            </View>
          )
        ) : (
          userTrips.length > 0 ? (
            <View>
              {userTrips.map((trip: any) => (
                <TouchableOpacity
                  key={trip.id}
                  onPress={() => router.push(`/(app)/(trips)/${trip.id}` as any)}
                  className="bg-white dark:bg-neutral-900 rounded-2xl p-4 mb-3 border border-gray-200 dark:border-neutral-800"
                >
                  <CustomText weight="bold" className="text-lg text-black dark:text-white mb-1">
                    {trip.destination || 'Untitled Trip'}
                  </CustomText>
                  {trip.startDate && (
                    <CustomText className="text-sm text-gray-600 dark:text-gray-400">
                      {formatDate(trip.startDate, 'short')}
                      {trip.endDate && ` - ${formatDate(trip.endDate, 'short')}`}
                    </CustomText>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <View className="items-center justify-center py-12">
              <Ionicons name="airplane-outline" size={64} color={isDark ? '#4b5563' : '#d1d5db'} />
              <CustomText className="text-gray-600 dark:text-gray-400 mt-4">
                {t('userProfile.noTrips') || 'No trips yet'}
              </CustomText>
            </View>
          )
        )}
      </View>
    </ScrollView>
  );
}

