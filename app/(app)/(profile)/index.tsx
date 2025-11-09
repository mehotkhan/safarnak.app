import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, ScrollView, TouchableOpacity, View } from 'react-native';

import { useGetTripsQuery, useMeQuery } from '@api';
import { useTheme } from '@components/context/ThemeContext';
import { CustomText } from '@components/ui/CustomText';
import { ListItem } from '@components/ui/ListItem';
import Colors from '@constants/Colors';
import { useAppSelector } from '@store/hooks';
import { useDateTime } from '@utils/datetime';
import { copyToClipboard } from '@utils/clipboard';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const appIcon = require('@assets/images/icon.png');


export default function ProfileScreen() {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const router = useRouter();
  const { user: reduxUser } = useAppSelector(state => state.auth);
  const { formatDate } = useDateTime();
  
  // Fetch real user data
  const { data: meData, loading: meLoading } = useMeQuery({
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all',
  });
  
  // Fetch trips for stats
  const { data: tripsData, loading: tripsLoading } = useGetTripsQuery({
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all',
  });
  
  // Prioritize GraphQL user data over Redux (GraphQL has publicKey)
  const user = meData?.me || reduxUser;
  const trips = useMemo(() => tripsData?.getTrips ?? [], [tripsData]);
  
  // Calculate stats
  const stats = useMemo(() => {
    const upcomingTrips = trips.filter(trip => 
      trip.status === 'in_progress' || 
      (trip.startDate && new Date(trip.startDate) > new Date())
    );
    const pastTrips = trips.filter(trip => 
      trip.status === 'completed' || 
      (trip.endDate && new Date(trip.endDate) < new Date())
    );
    
    return {
      totalTrips: trips.length,
      upcomingTrips: upcomingTrips.length,
      pastTrips: pastTrips.length,
      // TODO: Add posts and followers when social features are implemented
      posts: 0,
      followers: 0,
    };
  }, [trips]);
  
  const statsLoading = meLoading || tripsLoading;

  const handleMyTrips = () => {
    router.push('/(app)/(profile)/trips' as any);
  };

  const handleMessages = () => {
    router.push('/(app)/(profile)/messages' as any);
  };
  
  const handleSettings = () => {
    router.push('/(app)/(profile)/settings' as any);
  };

  const handleEditProfile = () => {
    router.push('/(app)/(profile)/account?edit=true' as any);
  };

  const handleSubscription = () => {
    router.push('/(app)/(profile)/subscription' as any);
  };
  
  const handleBookmarks = () => {
    router.push('/(app)/(profile)/bookmarks' as any);
  };


  return (
    <View className="flex-1 bg-white dark:bg-black">
      <Stack.Screen 
        options={{ 
          headerShown: true,
          header: () => (
            <View className="bg-white dark:bg-black border-b border-gray-200 dark:border-neutral-800">
              <View className="flex-row items-center justify-between px-6 py-4 pt-12">
                <View className="flex-row items-center flex-1">
                  <View 
                    className="w-12 h-12 rounded-full overflow-hidden mr-3"
                    style={{ 
                      backgroundColor: isDark ? '#262626' : '#f5f5f5',
                      borderWidth: 2,
                      borderColor: isDark ? Colors.dark.primary : Colors.light.primary,
                    }}
                  >
                    <Image
                      source={appIcon}
                      className="w-full h-full"
                      resizeMode="contain"
                    />
                  </View>
                  <View className="flex-1">
                    <CustomText weight="bold" className="text-lg text-black dark:text-white">
                      {user?.name || t('profile.guest')}
                    </CustomText>
                    <CustomText className="text-sm text-gray-600 dark:text-gray-400">
                      {user?.username ? `@${user.username}` : t('profile.description')}
                    </CustomText>
                  </View>
                </View>
                <TouchableOpacity
                  onPress={handleEditProfile}
                  className="w-10 h-10 rounded-full items-center justify-center bg-gray-100 dark:bg-neutral-800"
                >
                  <Ionicons
                    name="create-outline"
                    size={20}
                    color={isDark ? '#fff' : '#000'}
                  />
                </TouchableOpacity>
              </View>
            </View>
          ),
        }} 
      />

      <ScrollView className="flex-1">
        
        {/* Stats */}
        <View className="px-6 pt-4 pb-4">
          <View className="flex-row items-center justify-around py-4 bg-gray-50 dark:bg-neutral-900 rounded-2xl">
            <TouchableOpacity 
              className="items-center flex-1"
              onPress={handleMyTrips}
              activeOpacity={0.7}
            >
              <CustomText weight="bold" className="text-xl text-black dark:text-white">
                {statsLoading ? '...' : stats.totalTrips}
              </CustomText>
              <CustomText className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {t('profile.trips')}
              </CustomText>
            </TouchableOpacity>
            <View className="w-px h-10 bg-gray-200 dark:bg-neutral-800" />
            <View className="items-center flex-1">
              <CustomText weight="bold" className="text-xl text-black dark:text-white">
                {stats.upcomingTrips}
              </CustomText>
              <CustomText className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {t('profile.upcoming')}
              </CustomText>
            </View>
            <View className="w-px h-10 bg-gray-200 dark:bg-neutral-800" />
            <View className="items-center flex-1">
              <CustomText weight="bold" className="text-xl text-black dark:text-white">
                {stats.pastTrips}
              </CustomText>
              <CustomText className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {t('profile.completed')}
              </CustomText>
            </View>
          </View>
        </View>
      {/* Subscription Card */}
      <View className="px-6 my-6">
          <View className="rounded-2xl p-4 bg-primary">
            <View className="flex-row items-center justify-between">
              <View className="flex-1">
                <CustomText weight="bold" className="text-white text-lg mb-1">
                  {t('me.subscription')}
                </CustomText>
                <CustomText className="text-white/80 text-sm mb-3">
                  {t('me.quotaRemaining', { remaining: 5, total: 10 })}
                </CustomText>
                <TouchableOpacity
                  onPress={handleSubscription}
                  className="bg-white rounded-full px-4 py-2 self-start"
                >
                  <CustomText
                    className="text-primary"
                    weight="bold"
                  >
                    {t('me.upgrade')}
                  </CustomText>
                </TouchableOpacity>
              </View>
              <Ionicons name="sparkles" size={60} color="rgba(255,255,255,0.3)" />
            </View>
          </View>
        </View>
        {/* User Account Details */}
        {user && (
          <View className="px-6 pb-4">
            <View className="bg-gray-50 dark:bg-neutral-900 rounded-2xl p-4">
              <CustomText weight="bold" className="text-base text-black dark:text-white mb-3">
                {t('profile.accountDetails') || 'Account Details'}
              </CustomText>
              
              {/* User ID */}
              <View className="mb-3">
                <CustomText className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                  {t('profile.userId') || 'User ID'}
                </CustomText>
                <TouchableOpacity
                  onPress={() => copyToClipboard(user.id, 'User ID', t)}
                  activeOpacity={0.7}
                  className="flex-row items-center"
                >
                  <CustomText className="text-sm text-gray-800 dark:text-gray-200 font-mono flex-1">
                    {user.id.substring(0, 8)}...{user.id.substring(user.id.length - 8)}
                  </CustomText>
                  <Ionicons name="copy-outline" size={16} color={isDark ? '#9ca3af' : '#6b7280'} />
                </TouchableOpacity>
              </View>

       

              {/* Member Since */}
              {user.createdAt && (
                <View>
                  <CustomText className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                    {t('profile.memberSince') || 'Member Since'}
                  </CustomText>
                  <CustomText className="text-sm text-gray-800 dark:text-gray-200">
                    {formatDate(user.createdAt, 'long')}
                  </CustomText>
                </View>
              )}
            </View>
          </View>
        )}

  

        {/* Menu - Simplified, no groupings */}
        <View className="px-6 pb-4">
          <View className="bg-white dark:bg-neutral-900 rounded-2xl px-4">
            <ListItem
              icon="bookmark-outline"
              title={t('profile.bookmarksTitle')}
              subtitle={t('profile.bookmarksSubtitle')}
              onPress={handleBookmarks}
              iconColor={isDark ? Colors.dark.primary : Colors.light.primary}
            />
            <ListItem
              icon="mail-outline"
              title={t('me.messages')}
              subtitle={t('me.messagesSubtitle')}
              onPress={handleMessages}
              badge={3}
              iconColor={isDark ? Colors.dark.primary : Colors.light.primary}
            />
            <ListItem
              icon="settings-outline"
              title={t('profile.settings')}
              subtitle={t('settings.subtitle')}
              onPress={handleSettings}
              iconColor={isDark ? Colors.dark.primary : Colors.light.primary}
            />
            <ListItem
              icon="card-outline"
              title={t('me.payments')}
              subtitle={t('me.paymentsSubtitle')}
              onPress={() => router.push('/(app)/(profile)/payments' as any)}
              iconColor={isDark ? Colors.dark.primary : Colors.light.primary}
            />
          </View>
          <View className="h-8" />
        </View>
      </ScrollView>
    </View>
  );
}
