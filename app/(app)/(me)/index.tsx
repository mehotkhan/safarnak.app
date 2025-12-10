import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Image,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { useAppSelector } from '@state/hooks';
import { useMeQuery, useGetTripsQuery } from '@api';
import { CustomText } from '@ui/display';
import { TabBar } from '@ui/layout';
import { useTheme } from '@ui/context';
import { CreateFAB } from '@ui/components';
import { useUserLevel } from '@hooks/useUserLevel';
import { useMessagingActions } from '@hooks/useMessagingActions';

type MeTab = 'feed' | 'about' | 'saved';

export default function MeScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { isDark } = useTheme();

  const { user: reduxUser } = useAppSelector((state) => state.auth);
  const { openOrCreateDm } = useMessagingActions();
  const userLevel = useUserLevel();

  const [activeTab, setActiveTab] = useState<MeTab>('feed');
  const [refreshing, setRefreshing] = useState(false);

  // Fetch user data
  const {
    data: meData,
    loading: meLoading,
    refetch: refetchMe,
  } = useMeQuery({
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all',
    notifyOnNetworkStatusChange: true,
  });

  // Fetch trips for stats
  const { data: tripsData } = useGetTripsQuery({
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all',
    notifyOnNetworkStatusChange: true,
  });

  // Normalized user (GraphQL `me` wins over reduxUser)
  const user = useMemo(
    () => ((meData?.me || reduxUser) ?? null) as any | null,
    [meData?.me, reduxUser]
  );

  const trips = useMemo(() => tripsData?.getTrips ?? [], [tripsData]);

  // Normalize links (avoid crash if backend returns string or null)
  const userLinks: string[] = useMemo(() => {
    const raw = user?.links;

    if (!raw) return [];

    if (Array.isArray(raw)) {
      return raw
        .map((l: unknown) => (typeof l === 'string' ? l.trim() : ''))
        .filter(Boolean);
    }

    if (typeof raw === 'string') {
      return raw
        .split(/[,\n]/)
        .map((l) => l.trim())
        .filter(Boolean);
    }

    return [];
  }, [user]);

  // Normalize languages (array or string to display string)
  const userLanguagesLabel = useMemo(() => {
    const raw = user?.languages;

    if (!raw) return '';

    if (Array.isArray(raw)) {
      return raw
        .map((l: unknown) => (typeof l === 'string' ? l.trim() : ''))
        .filter(Boolean)
        .join(' • ');
    }

    if (typeof raw === 'string') {
      return raw.trim();
    }

    return '';
  }, [user]);

  // Calculate stats safely
  const stats = useMemo(() => {
    if (!user?.id || !Array.isArray(trips) || trips.length === 0) {
      return {
        tripsCreated: 0,
        hostedTrips: 0,
        placesAdded: 0,
        followers: 0,
        following: 0,
      };
    }

    const myTrips = trips.filter((trip: any) => trip?.userId === user.id);
    const hostedTrips = myTrips.filter((trip: any) => trip?.isHosted);

    // TODO: Get places count and followers/following from API
    return {
      tripsCreated: myTrips.length,
      hostedTrips: hostedTrips.length,
      placesAdded: 0,
      followers: 0,
      following: 0,
    };
  }, [trips, user?.id]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refetchMe();
    } finally {
      setRefreshing(false);
    }
  }, [refetchMe]);

  // Redirect to saved screen when saved tab is selected
  useEffect(() => {
    if (activeTab === 'saved') {
      router.push('/(app)/(me)/saved' as any);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  // Render Feed tab (user's public content)
  const renderFeed = () => (
    <View className="flex-1 items-center justify-center py-20">
      <Ionicons
        name="document-outline"
        size={64}
        color={isDark ? '#6b7280' : '#9ca3af'}
      />
      <CustomText
        weight="bold"
        className="text-lg text-gray-800 dark:text-gray-300 mt-4 mb-2 text-center"
      >
        {t('me.feed.empty') || 'No posts yet'}
      </CustomText>
      <CustomText className="text-base text-gray-600 dark:text-gray-400 text-center">
        {t('me.feed.emptyDescription') ||
          'Your public content will appear here'}
      </CustomText>
    </View>
  );

  // Render About tab
  // NOTE: Using View instead of ScrollView because it's already inside a ScrollView (nested ScrollViews crash)
  const renderAbout = () => (
    <View className="flex-1 px-6 py-4">
      {/* Bio */}
      <View className="mb-6">
        <CustomText
          weight="bold"
          className="text-lg text-black dark:text-white mb-3"
        >
          {t('me.about.bio') || 'Bio'}
        </CustomText>
        <CustomText className="text-base text-gray-700 dark:text-gray-300 leading-6">
          {user?.bio || t('me.about.noBio') || 'No bio yet'}
        </CustomText>
      </View>

      {/* Travel Style */}
      <View className="mb-6">
        <CustomText
          weight="bold"
          className="text-lg text-black dark:text-white mb-3"
        >
          {t('me.about.travelStyle') || 'Travel Style'}
        </CustomText>
        <CustomText className="text-base text-gray-700 dark:text-gray-300">
          {user?.travelStyle || t('me.about.noTravelStyle')}
        </CustomText>
      </View>

      {/* Languages */}
      <View className="mb-6">
        <CustomText
          weight="bold"
          className="text-lg text-black dark:text-white mb-3"
        >
          {t('me.about.languages') || 'Languages'}
        </CustomText>
        <CustomText className="text-base text-gray-700 dark:text-gray-300">
          {userLanguagesLabel || t('me.about.noLanguages')}
        </CustomText>
      </View>

      {/* Links */}
      {userLinks.length > 0 && (
        <View className="mb-6">
          <CustomText
            weight="bold"
            className="text-lg text-black dark:text-white mb-3"
          >
            {t('me.about.links') || 'Links'}
          </CustomText>
          {userLinks.map((link, index) => (
            <TouchableOpacity key={`${link}-${index}`} className="mb-2">
              <CustomText className="text-base text-primary">{link}</CustomText>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );

  // Render Saved tab - redirect handled by useEffect
  const renderSaved = () => null;

  // Render content based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case 'feed':
        return renderFeed();
      case 'about':
        return renderAbout();
      case 'saved':
        return renderSaved();
      default:
        return renderFeed();
    }
  };

  const handleSelfMessage = useCallback(() => {
    if (!user?.id) return;
    openOrCreateDm(user.id);
  }, [openOrCreateDm, user?.id]);

  const isLoadingInitial = meLoading && !user;

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-black">
      {/* Settings Icon in Header */}
      <View className="absolute top-12 right-4 z-10">
        <TouchableOpacity
          onPress={() => router.push('/(app)/(me)/settings' as any)}
          className="w-10 h-10 items-center justify-center rounded-full bg-gray-100 dark:bg-neutral-800"
          activeOpacity={0.7}
        >
          <Ionicons
            name="settings-outline"
            size={22}
            color={isDark ? '#9ca3af' : '#6b7280'}
          />
        </TouchableOpacity>
      </View>

      {isLoadingInitial ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator
            size="large"
            color={isDark ? '#fbbf24' : '#0f766e'}
          />
        </View>
      ) : (
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {/* Header */}
          <View className="px-6 pt-6 pb-4">
            <View className="items-center mb-4">
              {/* Avatar */}
              <View className="w-24 h-24 rounded-full overflow-hidden mb-3 bg-gray-200 dark:bg-neutral-800">
                {user?.avatar && typeof user.avatar === 'string' ? (
                  <Image
                    source={{ uri: user.avatar }}
                    className="w-full h-full"
                    resizeMode="cover"
                  />
                ) : (
                  <View className="w-full h-full items-center justify-center">
                    <Ionicons
                      name="person"
                      size={48}
                      color={isDark ? '#9ca3af' : '#6b7280'}
                    />
                  </View>
                )}
              </View>

              {/* Display Name */}
              <CustomText
                weight="bold"
                className="text-2xl text-black dark:text-white mb-1"
              >
                {user?.name || t('common.guest') || 'Guest'}
              </CustomText>

              {/* Username + User Level Badge */}
              <View className="flex-row items-center justify-center mb-2">
                <CustomText className="text-base text-gray-600 dark:text-gray-400 mr-2">
                  @{user?.username || 'guest'}
                </CustomText>
                {/* User Level Badge */}
                {(() => {
                  let badgeClass = 'px-2 py-1 rounded-full ';
                  let textClass = 'text-xs font-semibold ';
                  
                  if (userLevel === 'pro') {
                    badgeClass += 'bg-yellow-500/20 border border-yellow-500/50';
                    textClass += 'text-yellow-700 dark:text-yellow-400';
                  } else if (userLevel === 'member') {
                    badgeClass += 'bg-primary/20 border border-primary/50';
                    textClass += 'text-primary';
                  } else {
                    badgeClass += 'bg-gray-200 dark:bg-neutral-700 border border-gray-300 dark:border-neutral-600';
                    textClass += 'text-gray-600 dark:text-gray-400';
                  }
                  
                  const badgeText = userLevel === 'pro'
                    ? (t('profile.tiers.pro') || 'Pro')
                    : userLevel === 'member'
                    ? (t('profile.tiers.member') || 'Member')
                    : (t('profile.tiers.guest') || 'Guest');
                  
                  return (
                    <View className={badgeClass}>
                      <CustomText className={textClass}>
                        {badgeText}
                      </CustomText>
                    </View>
                  );
                })()}
              </View>

              {/* Home Base */}
              {user?.homeBase && typeof user.homeBase === 'string' && (
                <View className="flex-row items-center mb-2">
                  <Ionicons
                    name="location"
                    size={16}
                    color={isDark ? '#9ca3af' : '#6b7280'}
                  />
                  <CustomText className="text-sm text-gray-600 dark:text-gray-400 ml-1">
                    {user.homeBase}
                  </CustomText>
                </View>
              )}

              {/* Short Bio */}
              {user?.bio && typeof user.bio === 'string' && (
                <CustomText className="text-sm text-gray-600 dark:text-gray-400 text-center px-4 mb-4">
                  {user.bio.length > 100
                    ? `${user.bio.substring(0, 100)}...`
                    : user.bio}
                </CustomText>
              )}

              {/* Actions */}
              <View className="flex-row gap-3">
                <TouchableOpacity
                  onPress={() => router.push('/(app)/(me)/edit' as any)}
                  className="px-4 py-2 rounded-full bg-gray-100 dark:bg-neutral-800 flex-row items-center"
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name="create-outline"
                    size={18}
                    color={isDark ? '#e5e7eb' : '#374151'}
                    style={{ marginRight: 6 }}
                  />
                  <CustomText
                    className="text-sm"
                    style={{ color: isDark ? '#e5e7eb' : '#374151' }}
                  >
                    {t('me.editProfile') || 'Edit Profile'}
                  </CustomText>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => router.push('/(app)/(me)/studio' as any)}
                  className="px-4 py-2 rounded-full bg-primary flex-row items-center"
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name="grid-outline"
                    size={18}
                    color="#fff"
                    style={{ marginRight: 6 }}
                  />
                  <CustomText className="text-sm text-white">
                    {t('me.openStudio')}
                  </CustomText>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                onPress={handleSelfMessage}
                activeOpacity={0.8}
                className="mt-4 w-full flex-row items-center justify-center rounded-2xl border border-dashed border-primary/40 px-4 py-3 bg-primary/5 dark:bg-primary/10"
              >
                <Ionicons
                  name="chatbubble-ellipses-outline"
                  size={18}
                  color={isDark ? '#fbbf24' : '#d97706'}
                  style={{ marginRight: 8 }}
                />
                <View className="flex-1">
                  <CustomText
                    weight="bold"
                    className="text-sm text-primary dark:text-yellow-300"
                  >
                    {t('userProfile.selfMessageButton') || 'Message yourself'}
                  </CustomText>
                  <CustomText className="text-xs text-gray-600 dark:text-gray-400">
                    {t('userProfile.selfMessageDescription') ||
                      'Send yourself a DM to test Safarnak Messaging.'}
                  </CustomText>
                </View>
              </TouchableOpacity>
            </View>

            {/* Upgrade Cards */}
            {/* Guest → Member Upgrade Card */}
            {userLevel === 'guest' && (
              <View className="mx-6 mb-4 bg-primary/5 dark:bg-primary/10 rounded-xl p-4 border border-primary/20">
                <CustomText
                  weight="bold"
                  className="text-lg text-black dark:text-white mb-2"
                >
                  {t('profile.upgrade.guestToMember.title') ||
                    'Complete your account'}
                </CustomText>
                <CustomText className="text-sm text-gray-700 dark:text-gray-300 mb-4">
                  {t('profile.upgrade.guestToMember.description') ||
                    'Add phone and email to protect your trips and enable notifications.'}
                </CustomText>
                <TouchableOpacity
                  onPress={() =>
                    router.push('/(app)/(me)/complete-account' as any)
                  }
                  className="bg-primary rounded-lg py-3 px-4 items-center"
                  activeOpacity={0.7}
                >
                  <CustomText className="text-white font-semibold">
                    {t('profile.upgrade.guestToMember.button') ||
                      'Complete profile'}
                  </CustomText>
                </TouchableOpacity>
              </View>
            )}

            {/* Member → Pro Upgrade Card */}
            {userLevel === 'member' && (
              <View className="mx-6 mb-4 bg-yellow-500/5 dark:bg-yellow-500/10 rounded-xl p-4 border border-yellow-500/20">
                <CustomText
                  weight="bold"
                  className="text-lg text-black dark:text-white mb-2"
                >
                  {t('profile.upgrade.memberToPro.title') ||
                    'Upgrade to Safarnak Pro'}
                </CustomText>
                <CustomText className="text-sm text-gray-700 dark:text-gray-300 mb-4">
                  {t('profile.upgrade.memberToPro.description') ||
                    'Get more AI planning, priority features, and more.'}
                </CustomText>
                <TouchableOpacity
                  onPress={() =>
                    router.push('/(app)/(me)/subscription' as any)
                  }
                  className="bg-yellow-500 rounded-lg py-3 px-4 items-center"
                  activeOpacity={0.7}
                >
                  <CustomText className="text-white font-semibold">
                    {t('profile.upgrade.memberToPro.button') || 'See plans'}
                  </CustomText>
                </TouchableOpacity>
              </View>
            )}

            {/* Stats Row */}
            <View className="flex-row justify-around py-4 border-t border-b border-gray-200 dark:border-neutral-800">
              <View className="items-center">
                <CustomText
                  weight="bold"
                  className="text-lg text-black dark:text-white"
                >
                  {stats.tripsCreated}
                </CustomText>
                <CustomText className="text-xs text-gray-600 dark:text-gray-400">
                  {t('me.stats.tripsCreated') || 'Trips'}
                </CustomText>
              </View>
              <View className="items-center">
                <CustomText
                  weight="bold"
                  className="text-lg text-black dark:text-white"
                >
                  {stats.hostedTrips}
                </CustomText>
                <CustomText className="text-xs text-gray-600 dark:text-gray-400">
                  {t('me.stats.hostedTrips') || 'Hosted'}
                </CustomText>
              </View>
              <View className="items-center">
                <CustomText
                  weight="bold"
                  className="text-lg text-black dark:text-white"
                >
                  {stats.placesAdded}
                </CustomText>
                <CustomText className="text-xs text-gray-600 dark:text-gray-400">
                  {t('me.stats.placesAdded') || 'Places'}
                </CustomText>
              </View>
              <View className="items-center">
                <CustomText
                  weight="bold"
                  className="text-lg text-black dark:text-white"
                >
                  {stats.followers}
                </CustomText>
                <CustomText className="text-xs text-gray-600 dark:text-gray-400">
                  {t('me.stats.followers') || 'Followers'}
                </CustomText>
              </View>
              <View className="items-center">
                <CustomText
                  weight="bold"
                  className="text-lg text-black dark:text-white"
                >
                  {stats.following}
                </CustomText>
                <CustomText className="text-xs text-gray-600 dark:text-gray-400">
                  {t('me.stats.following') || 'Following'}
                </CustomText>
              </View>
            </View>
          </View>

          {/* Tabs */}
          <View className="px-4 pb-2">
            <TabBar
              tabs={[
                { id: 'feed', label: 'Feed', translationKey: 'me.tabs.feed' },
                { id: 'about', label: 'About', translationKey: 'me.tabs.about' },
                { id: 'saved', label: 'Saved', translationKey: 'me.tabs.saved' },
              ]}
              activeTab={activeTab}
              onTabChange={(tabId) => setActiveTab(tabId as MeTab)}
              variant="segmented"
            />
          </View>

          {/* Content */}
          <View className="flex-1" style={{ minHeight: 400 }}>
            {renderContent()}
          </View>
        </ScrollView>
      )}

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
    </SafeAreaView>
  );
}
