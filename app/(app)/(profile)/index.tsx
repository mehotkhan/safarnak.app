import { View, Image, TouchableOpacity, ScrollView } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { useMemo } from 'react';

import { CustomText } from '@components/ui/CustomText';
import { useAppSelector } from '@store/hooks';
import { useTheme } from '@components/context/ThemeContext';
import Colors from '@constants/Colors';
import { useMeQuery, useGetTripsQuery } from '@api';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const appIcon = require('@assets/images/icon.png');

interface MenuItemProps {
  icon: any;
  title: string;
  subtitle?: string;
  onPress: () => void;
  isDark: boolean;
  badge?: number;
  color?: string;
}

const MenuItem = ({
  icon,
  title,
  subtitle,
  onPress,
  isDark,
  badge,
  color = isDark ? '#9ca3af' : '#6b7280',
}: MenuItemProps) => (
  <TouchableOpacity
    onPress={onPress}
    className="flex-row items-center py-4 border-b border-gray-200 dark:border-neutral-800"
  >
    <View
      className="w-10 h-10 rounded-full items-center justify-center mr-4"
      style={{ backgroundColor: color + '20' }}
    >
      <Ionicons name={icon} size={20} color={color} />
    </View>
    <View className="flex-1">
      <CustomText
        weight="medium"
        className="text-base text-black dark:text-white"
      >
        {title}
      </CustomText>
      {subtitle && (
        <CustomText className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {subtitle}
        </CustomText>
      )}
    </View>
    {badge !== undefined && badge > 0 && (
      <View className="w-6 h-6 bg-red-500 rounded-full items-center justify-center mr-3">
        <CustomText className="text-xs text-white" weight="bold">
          {badge > 9 ? '9+' : badge}
        </CustomText>
      </View>
    )}
    <Ionicons
      name="chevron-forward"
      size={20}
      color={isDark ? '#666' : '#9ca3af'}
    />
  </TouchableOpacity>
);

export default function ProfileScreen() {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const router = useRouter();
  const { user: reduxUser } = useAppSelector(state => state.auth);
  
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

        {/* Menu - Simplified, no groupings */}
        <View className="px-6 pb-4">
          <View className="bg-white dark:bg-neutral-900 rounded-2xl px-4">
            <MenuItem
              icon="bookmark-outline"
              title={t('profile.bookmarksTitle')}
              subtitle={t('profile.bookmarksSubtitle')}
              onPress={handleBookmarks}
              isDark={isDark}
              color={isDark ? Colors.dark.primary : Colors.light.primary}
            />
            <MenuItem
              icon="mail-outline"
              title={t('me.messages')}
              subtitle={t('me.messagesSubtitle')}
              onPress={handleMessages}
              isDark={isDark}
              badge={3}
              color={isDark ? Colors.dark.primary : Colors.light.primary}
            />
            <MenuItem
              icon="settings-outline"
              title={t('profile.settings')}
              subtitle={t('settings.subtitle')}
              onPress={handleSettings}
              isDark={isDark}
              color={isDark ? Colors.dark.primary : Colors.light.primary}
            />
            <MenuItem
              icon="card-outline"
              title={t('me.payments')}
              subtitle={t('me.paymentsSubtitle')}
              onPress={() => router.push('/(app)/(profile)/payments' as any)}
              isDark={isDark}
              color={isDark ? Colors.dark.primary : Colors.light.primary}
            />
            <MenuItem
              icon="stats-chart-outline"
              title={t('systemStatus.title', { defaultValue: 'System Status' })}
              subtitle={t('systemStatus.subtitle', {
                defaultValue: 'Network & Cache Stats',
              })}
              onPress={() => router.push('/(app)/(profile)/system-status' as any)}
              isDark={isDark}
              color={isDark ? Colors.dark.primary : Colors.light.primary}
            />
          </View>
          <View className="h-8" />
        </View>
      </ScrollView>
    </View>
  );
}
