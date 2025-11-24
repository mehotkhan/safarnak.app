import React, { useMemo } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAppSelector, useAppDispatch } from '@state/hooks';
import { logout } from '@state/slices/authSlice';
import { useMeQuery, useGetTripsQuery } from '@api';
import { CustomText } from '@ui/display';
import { useRefresh } from '@hooks/useRefresh';
import { useDateTime } from '@hooks/useDateTime';
import Colors from '@constants/Colors';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProfileScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const isDark = useAppSelector(state => state.theme.isDark);
  const { user: reduxUser } = useAppSelector(state => state.auth);
  const { isFuture } = useDateTime();

  const colors = isDark ? Colors.dark : Colors.light;

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
  const activeTripsCount = useMemo(() => {
    return trips.filter(trip => 
      trip.status === 'in_progress' || 
      (trip.startDate && isFuture(trip.startDate))
    ).length;
  }, [trips, isFuture]);
  
  const memberSince = user?.createdAt 
    ? new Date(user.createdAt).getFullYear()
    : new Date().getFullYear();

  // Pull-to-refresh
  const { refreshing, onRefresh } = useRefresh(async () => {
    await refetchMe();
  });

  const handleLogout = () => {
    Alert.alert(
      t('profile.logout'),
      t('profile.logoutConfirm'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('profile.logout'),
          style: 'destructive',
          onPress: async () => {
            dispatch(logout());
            router.replace('/(auth)/welcome' as any);
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView className='flex-1' style={{ backgroundColor: colors.background }}>
      <ScrollView
        className='flex-1'
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View className='px-6 pt-6 pb-4'>
          {/* Avatar & Name */}
          <View className='items-center mb-4'>
            <View
              className='w-24 h-24 rounded-full items-center justify-center mb-3'
              style={{ backgroundColor: isDark ? '#374151' : '#e5e7eb' }}
            >
              <Ionicons
                name='person'
                size={48}
                color={isDark ? '#9ca3af' : '#6b7280'}
              />
            </View>
            <CustomText weight='bold' className='text-2xl mb-1' style={{ color: colors.text }}>
              {user?.name || t('profile.guest')}
            </CustomText>
            <CustomText className='text-base mb-2' style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>
              @{user?.username || 'guest'}
            </CustomText>
            <CustomText className='text-sm mb-3' style={{ color: isDark ? '#6b7280' : '#9ca3af' }}>
              {t('profile.memberSince')} {memberSince} · {activeTripsCount} {t('me.tripsList.inProgress')}
            </CustomText>

            {/* Edit profile button */}
            <TouchableOpacity
              onPress={() => router.push('/(app)/(profile)/edit' as any)}
              className='px-4 py-2 rounded-full bg-gray-100 dark:bg-neutral-800 flex-row items-center'
              activeOpacity={0.7}
            >
              <Ionicons
                name='create-outline'
                size={18}
                color={isDark ? '#e5e7eb' : '#374151'}
                style={{ marginRight: 6 }}
              />
              <CustomText className='text-sm' style={{ color: isDark ? '#e5e7eb' : '#374151' }}>
                {t('profile.edit.title', { defaultValue: 'Edit Profile' })}
              </CustomText>
            </TouchableOpacity>
          </View>
        </View>

        {/* My Safarnak Section */}
        <View className='px-6 pb-4'>
          <CustomText
            weight='bold'
            className='text-lg mb-3'
            style={{ color: isDark ? '#9ca3af' : '#6b7280' }}
          >
            {t('profile.sections.mySafarnak', { defaultValue: 'My Safarnak' })}
          </CustomText>
          <View
            className='rounded-2xl overflow-hidden'
            style={{ backgroundColor: isDark ? '#1f2937' : '#fff' }}
          >
            {/* Saved */}
                  <TouchableOpacity
              onPress={() => router.push('/(app)/(profile)/saved' as any)}
              className='flex-row items-center p-4 border-b'
              style={{ borderBottomColor: isDark ? '#374151' : '#f3f4f6' }}
              activeOpacity={0.7}
            >
              <View
                className='w-10 h-10 rounded-full items-center justify-center mr-3'
                style={{ backgroundColor: isDark ? '#374151' : '#f3f4f6' }}
                  >
                    <Ionicons
                  name='bookmark'
                  size={22}
                  color={colors.primary}
                />
              </View>
              <View className='flex-1'>
                <CustomText weight='bold' className='text-base' style={{ color: colors.text }}>
                  {t('me.saved')}
                  </CustomText>
                <CustomText className='text-sm' style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>
                  {t('me.savedSubtitle')}
                          </CustomText>
              </View>
              <Ionicons
                name='chevron-forward'
                size={20}
                color={isDark ? '#6b7280' : '#9ca3af'}
              />
            </TouchableOpacity>

            {/* History */}
            <TouchableOpacity
              onPress={() => router.push('/(app)/(profile)/history' as any)}
              className='flex-row items-center p-4 border-b'
              style={{ borderBottomColor: isDark ? '#374151' : '#f3f4f6' }}
              activeOpacity={0.7}
            >
              <View
                className='w-10 h-10 rounded-full items-center justify-center mr-3'
                style={{ backgroundColor: isDark ? '#374151' : '#f3f4f6' }}
              >
                    <Ionicons
                  name='time'
                  size={22}
                  color={colors.primary}
                />
              </View>
              <View className='flex-1'>
                <CustomText weight='bold' className='text-base' style={{ color: colors.text }}>
                  {t('me.history')}
                </CustomText>
                <CustomText className='text-sm' style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>
                  {t('me.historySubtitle')}
                </CustomText>
            </View>
              <Ionicons
                name='chevron-forward'
                size={20}
                color={isDark ? '#6b7280' : '#9ca3af'}
              />
            </TouchableOpacity>

            {/* Subscription & Billing */}
            <TouchableOpacity 
              onPress={() => router.push('/(app)/(profile)/subscription' as any)}
              className='flex-row items-center p-4'
              activeOpacity={0.7}
            >
              <View
                className='w-10 h-10 rounded-full items-center justify-center mr-3'
                style={{ backgroundColor: isDark ? '#374151' : '#f3f4f6' }}
              >
                <Ionicons
                  name='diamond'
                  size={22}
                  color={colors.primary}
                />
            </View>
              <View className='flex-1'>
                <CustomText weight='bold' className='text-base' style={{ color: colors.text }}>
                  {t('me.subscription')}
                </CustomText>
                <CustomText className='text-sm' style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>
                  {t('profile.subscriptionSubtitle')}
                </CustomText>
              </View>
              <Ionicons
                name='chevron-forward'
                size={20}
                color={isDark ? '#6b7280' : '#9ca3af'}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* App & Security Section */}
        <View className='px-6 pb-6'>
          <CustomText
            weight='bold'
            className='text-lg mb-3'
            style={{ color: isDark ? '#9ca3af' : '#6b7280' }}
          >
            {t('profile.sections.appSecurity', { defaultValue: 'App & Security' })}
          </CustomText>
          <View className='rounded-2xl overflow-hidden' style={{ backgroundColor: isDark ? '#1f2937' : '#fff' }}>
            {/* Settings */}
            <TouchableOpacity
              onPress={() => router.push('/(app)/(profile)/settings' as any)}
              className='flex-row items-center p-4 border-b'
              style={{ borderBottomColor: isDark ? '#374151' : '#f3f4f6' }}
              activeOpacity={0.7}
            >
              <View
                className='w-10 h-10 rounded-full items-center justify-center mr-3'
                style={{ backgroundColor: isDark ? '#374151' : '#f3f4f6' }}
              >
                <Ionicons
                  name='settings'
                  size={22}
                  color={isDark ? '#9ca3af' : '#6b7280'}
                />
              </View>
              <View className='flex-1'>
                <CustomText weight='bold' className='text-base' style={{ color: colors.text }}>
                  {t('profile.settings')}
              </CustomText>
                <CustomText className='text-sm' style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>
                  {t('settings.subtitle')}
                </CustomText>
              </View>
              <Ionicons
                name='chevron-forward'
                size={20}
                color={isDark ? '#6b7280' : '#9ca3af'}
              />
            </TouchableOpacity>

            {/* Devices & Security */}
                <TouchableOpacity
              onPress={() => router.push('/(app)/(profile)/settings/devices' as any)}
              className='flex-row items-center p-4 border-b'
              style={{ borderBottomColor: isDark ? '#374151' : '#f3f4f6' }}
                  activeOpacity={0.7}
            >
              <View
                className='w-10 h-10 rounded-full items-center justify-center mr-3'
                style={{ backgroundColor: isDark ? '#374151' : '#f3f4f6' }}
              >
                <Ionicons
                  name='phone-portrait'
                  size={22}
                  color={isDark ? '#9ca3af' : '#6b7280'}
                />
              </View>
              <View className='flex-1'>
                <CustomText weight='bold' className='text-base' style={{ color: colors.text }}>
                  {t('settings.devices')}
                  </CustomText>
                <CustomText className='text-sm' style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>
                  {t('settings.devicesInfoTitle')}
                  </CustomText>
                </View>
              <Ionicons
                name='chevron-forward'
                size={20}
                color={isDark ? '#6b7280' : '#9ca3af'}
              />
            </TouchableOpacity>

            {/* Logout */}
            <TouchableOpacity
              onPress={handleLogout}
              className='flex-row items-center p-4'
              activeOpacity={0.7}
            >
              <View
                className='w-10 h-10 rounded-full items-center justify-center mr-3'
                style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)' }}
              >
                <Ionicons
                  name='log-out'
                  size={22}
                  color='#ef4444'
                />
            </View>
              <View className='flex-1'>
                <CustomText weight='bold' className='text-base' style={{ color: '#ef4444' }}>
                  {t('profile.logout')}
                </CustomText>
          </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
