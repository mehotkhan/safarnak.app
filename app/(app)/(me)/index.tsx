import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Image,
  ActivityIndicator,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAppSelector } from '@state/hooks';
import { useMeQuery, useGetTripsQuery } from '@api';
import { CustomText } from '@ui/display';
import { TabBar } from '@ui/layout';
import { useTheme } from '@ui/context';
import Colors from '@constants/Colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FAB } from '@ui/components';
import { useUserLevel } from '@hooks/useUserLevel';

type MeTab = 'feed' | 'about' | 'saved';

export default function MeScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { isDark } = useTheme();
  const { user: reduxUser } = useAppSelector(state => state.auth);
  const userLevel = useUserLevel();
  const [activeTab, setActiveTab] = useState<MeTab>('feed');
  const [refreshing, setRefreshing] = useState(false);

  // Fetch user data
  const { data: meData, refetch: refetchMe } = useMeQuery({
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all',
  });
  
  // Fetch trips for stats
  const { data: tripsData } = useGetTripsQuery({
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all',
  });

  const user = meData?.me || reduxUser;
  const trips = useMemo(() => tripsData?.getTrips ?? [], [tripsData]);
  
  // Calculate stats
  const stats = useMemo(() => {
    const myTrips = trips.filter((trip: any) => trip.userId === user?.id);
    const hostedTrips = myTrips.filter((trip: any) => trip.isHosted);
    // TODO: Get places count and followers/following from API
    return {
      tripsCreated: myTrips.length,
      hostedTrips: hostedTrips.length,
      placesAdded: 0, // TODO: Phase 8-9
      followers: 0, // TODO: Phase 8-9
      following: 0, // TODO: Phase 8-9
    };
  }, [trips, user?.id]);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
    await refetchMe();
    } finally {
      setRefreshing(false);
    }
  };

  // Redirect to saved screen when saved tab is selected
  useEffect(() => {
    if (activeTab === 'saved') {
      router.push('/(app)/(me)/saved' as any);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  // Render Feed tab (user's public content)
  const renderFeed = () => {
    // TODO: Fetch user's posts and public/hosted trips
    const feedItems: any[] = []; // Placeholder

    if (feedItems.length === 0) {
      return (
        <View className="flex-1 items-center justify-center py-20">
          <Ionicons
            name="document-outline"
            size={64}
            color={isDark ? '#6b7280' : '#9ca3af'}
          />
          <CustomText weight="bold" className="text-lg text-gray-800 dark:text-gray-300 mt-4 mb-2 text-center">
            {t('me.feed.empty') || 'No posts yet'}
          </CustomText>
          <CustomText className="text-base text-gray-600 dark:text-gray-400 text-center">
            {t('me.feed.emptyDescription') || 'Your public content will appear here'}
          </CustomText>
        </View>
      );
    }

    // TODO: Implement feed items rendering when API is ready
    // For now, show empty state
    return (
      <View className="flex-1 items-center justify-center py-20">
        <Ionicons
          name="document-outline"
          size={64}
          color={isDark ? '#6b7280' : '#9ca3af'}
        />
        <CustomText weight="bold" className="text-lg text-gray-800 dark:text-gray-300 mt-4 mb-2 text-center">
          {t('me.feed.empty') || 'No posts yet'}
        </CustomText>
        <CustomText className="text-base text-gray-600 dark:text-gray-400 text-center">
          {t('me.feed.emptyDescription') || 'Your public content will appear here'}
        </CustomText>
      </View>
    );
  };

  // Render About tab
  const renderAbout = () => {
    return (
      <ScrollView className="flex-1 px-6 py-4">
        {/* Bio */}
        <View className="mb-6">
          <CustomText weight="bold" className="text-lg text-black dark:text-white mb-3">
            {t('me.about.bio') || 'Bio'}
          </CustomText>
          <CustomText className="text-base text-gray-700 dark:text-gray-300 leading-6">
            {(user as any)?.bio || t('me.about.noBio') || 'No bio yet'}
          </CustomText>
        </View>

        {/* Travel Style */}
        <View className="mb-6">
          <CustomText weight="bold" className="text-lg text-black dark:text-white mb-3">
            {t('me.about.travelStyle') || 'Travel Style'}
          </CustomText>
          <CustomText className="text-base text-gray-700 dark:text-gray-300">
            {(user as any)?.travelStyle || t('me.about.noTravelStyle')}
          </CustomText>
        </View>

        {/* Languages */}
        <View className="mb-6">
          <CustomText weight="bold" className="text-lg text-black dark:text-white mb-3">
            {t('me.about.languages') || 'Languages'}
          </CustomText>
          <CustomText className="text-base text-gray-700 dark:text-gray-300">
            {(user as any)?.languages || t('me.about.noLanguages')}
          </CustomText>
        </View>

        {/* Links */}
        {(user as any)?.links && (user as any).links.length > 0 && (
          <View className="mb-6">
            <CustomText weight="bold" className="text-lg text-black dark:text-white mb-3">
              {t('me.about.links') || 'Links'}
            </CustomText>
            {(user as any).links.map((link: string, index: number) => (
              <TouchableOpacity key={index} className="mb-2">
                <CustomText className="text-base text-primary">
                  {link}
                </CustomText>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    );
  };

  // Render Saved tab - redirect to saved screen
  const renderSaved = () => {
    return (
      <View className="flex-1 items-center justify-center py-20">
        <ActivityIndicator size="large" color={isDark ? Colors.dark.primary : Colors.light.primary} />
        <CustomText className="text-sm text-gray-600 dark:text-gray-400 mt-4">
          {t('common.loading') || 'Loading...'}
        </CustomText>
      </View>
    );
  };

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

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Header */}
        <View className="px-6 pt-6 pb-4">
          <View className="items-center mb-4">
            {/* Avatar */}
            <View className="w-24 h-24 rounded-full overflow-hidden mb-3 bg-gray-200 dark:bg-neutral-800">
              {(user as any)?.avatar ? (
                <Image
                  source={{ uri: (user as any).avatar }}
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
            <CustomText weight="bold" className="text-2xl text-black dark:text-white mb-1">
              {user?.name || t('common.guest') || 'Guest'}
            </CustomText>

            {/* Username + User Level Badge */}
            <View className="flex-row items-center justify-center mb-2">
              <CustomText className="text-base text-gray-600 dark:text-gray-400 mr-2">
              @{user?.username || 'guest'}
            </CustomText>
              {/* User Level Badge */}
              <View
                className={`px-2 py-1 rounded-full ${
                  userLevel === 'pro'
                    ? 'bg-yellow-500/20 border border-yellow-500/50'
                    : userLevel === 'member'
                    ? 'bg-primary/20 border border-primary/50'
                    : 'bg-gray-200 dark:bg-neutral-700 border border-gray-300 dark:border-neutral-600'
                }`}
              >
                <CustomText
                  className={`text-xs font-semibold ${
                    userLevel === 'pro'
                      ? 'text-yellow-700 dark:text-yellow-400'
                      : userLevel === 'member'
                      ? 'text-primary'
                      : 'text-gray-600 dark:text-gray-400'
                  }`}
                >
                  {userLevel === 'pro'
                    ? t('profile.tiers.pro') || 'Pro'
                    : userLevel === 'member'
                    ? t('profile.tiers.member') || 'Member'
                    : t('profile.tiers.guest') || 'Guest'}
                </CustomText>
              </View>
            </View>

            {/* Home Base */}
            {(user as any)?.homeBase && (
              <View className="flex-row items-center mb-2">
              <Ionicons
                  name="location"
                  size={16}
                  color={isDark ? '#9ca3af' : '#6b7280'}
                />
                <CustomText className="text-sm text-gray-600 dark:text-gray-400 ml-1">
                  {(user as any).homeBase}
                          </CustomText>
              </View>
            )}

            {/* Short Bio */}
            {(user as any)?.bio && (
              <CustomText className="text-sm text-gray-600 dark:text-gray-400 text-center px-4 mb-4">
                {(user as any).bio.length > 100 ? `${(user as any).bio.substring(0, 100)}...` : (user as any).bio}
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
                <CustomText className="text-sm" style={{ color: isDark ? '#e5e7eb' : '#374151' }}>
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
        </View>

        {/* Upgrade Cards */}
        {/* Guest → Member Upgrade Card */}
        {userLevel === 'guest' && (
          <View className="mx-6 mb-4 bg-primary/5 dark:bg-primary/10 rounded-xl p-4 border border-primary/20">
            <CustomText weight="bold" className="text-lg text-black dark:text-white mb-2">
              {t('profile.upgrade.guestToMember.title') || 'Complete your account'}
            </CustomText>
            <CustomText className="text-sm text-gray-700 dark:text-gray-300 mb-4">
              {t('profile.upgrade.guestToMember.description') || 
                'Add phone and email to protect your trips and enable notifications.'}
            </CustomText>
            <TouchableOpacity
              onPress={() => router.push('/(app)/(me)/complete-account' as any)}
              className="bg-primary rounded-lg py-3 px-4 items-center"
              activeOpacity={0.7}
            >
              <CustomText className="text-white font-semibold">
                {t('profile.upgrade.guestToMember.button') || 'Complete profile'}
              </CustomText>
            </TouchableOpacity>
          </View>
        )}

        {/* Member → Pro Upgrade Card */}
        {userLevel === 'member' && (
          <View className="mx-6 mb-4 bg-yellow-500/5 dark:bg-yellow-500/10 rounded-xl p-4 border border-yellow-500/20">
            <CustomText weight="bold" className="text-lg text-black dark:text-white mb-2">
              {t('profile.upgrade.memberToPro.title') || 'Upgrade to Safarnak Pro'}
            </CustomText>
            <CustomText className="text-sm text-gray-700 dark:text-gray-300 mb-4">
              {t('profile.upgrade.memberToPro.description') || 
                'Get more AI planning, priority features, and more.'}
            </CustomText>
            <TouchableOpacity
              onPress={() => router.push('/(app)/(me)/subscription' as any)}
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
              <CustomText weight="bold" className="text-lg text-black dark:text-white">
                {stats.tripsCreated}
              </CustomText>
              <CustomText className="text-xs text-gray-600 dark:text-gray-400">
                {t('me.stats.tripsCreated') || 'Trips'}
          </CustomText>
              </View>
            <View className="items-center">
              <CustomText weight="bold" className="text-lg text-black dark:text-white">
                {stats.hostedTrips}
              </CustomText>
              <CustomText className="text-xs text-gray-600 dark:text-gray-400">
                {t('me.stats.hostedTrips') || 'Hosted'}
                </CustomText>
              </View>
            <View className="items-center">
              <CustomText weight="bold" className="text-lg text-black dark:text-white">
                {stats.placesAdded}
                  </CustomText>
              <CustomText className="text-xs text-gray-600 dark:text-gray-400">
                {t('me.stats.placesAdded') || 'Places'}
                  </CustomText>
                </View>
            <View className="items-center">
              <CustomText weight="bold" className="text-lg text-black dark:text-white">
                {stats.followers}
              </CustomText>
              <CustomText className="text-xs text-gray-600 dark:text-gray-400">
                {t('me.stats.followers') || 'Followers'}
              </CustomText>
            </View>
            <View className="items-center">
              <CustomText weight="bold" className="text-lg text-black dark:text-white">
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
        <View className="flex-1 min-h-[400px]">
          {renderContent()}
        </View>
      </ScrollView>

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
    </SafeAreaView>
  );
}
