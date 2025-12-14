import React, { useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, Stack, useLocalSearchParams } from 'expo-router';
import { useAppSelector } from '@state/hooks';
import Colors from '@constants/Colors';
import { useGetAlertsQuery } from '@api';
import { CustomText } from '@ui/display';

export default function NotificationDetailScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const isDark = useAppSelector((state) => state.theme.isDark);
  const colors = isDark ? Colors.dark : Colors.light;
  const { data, loading, refetch } = useGetAlertsQuery({
    fetchPolicy: 'cache-and-network',
  });

  const alerts = data?.getAlerts;

  const notification = useMemo(() => {
    if (!alerts) return undefined;
    return alerts.find((alert) => alert.id === id);
  }, [alerts, id]);

  const parsedCreatedAt = notification ? new Date(notification.createdAt) : null;

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'social':
        return 'people';
      case 'trip':
        return 'airplane';
      case 'tour':
        return 'flag';
      case 'system':
        return 'settings';
      default:
        return 'notifications';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'social':
        return '#3b82f6';
      case 'trip':
        return '#10b981';
      case 'tour':
        return '#f59e0b';
      case 'system':
        return '#6366f1';
      default:
        return colors.primary;
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (hours < 1) {
      return t('explore.posts.justNow');
    } else if (hours < 24) {
      return `${hours}${t('explore.posts.hoursAgo')}`;
    } else {
      return `${days}${t('explore.posts.daysAgo')}`;
    }
  };

  const handleNavigate = () => {
    if (!notification?.targetType || !notification.targetId) return;
    switch (notification.targetType) {
      case 'TRIP':
      case 'tour':
        router.push(`/(app)/(trips)/${notification.targetId}` as any);
        break;
      case 'POST':
        router.push(`/(app)/(home)/${notification.targetId}` as any);
        break;
      default:
        break;
    }
  };

  if (loading && !notification) {
    return (
      <View className="flex-1 items-center justify-center" style={{ backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={isDark ? Colors.dark.primary : Colors.light.primary} />
      </View>
    );
  }

  if (!notification) {
    return (
      <View className="flex-1 items-center justify-center" style={{ backgroundColor: colors.background }}>
        <Ionicons name="alert-circle-outline" size={64} color={isDark ? '#6b7280' : '#9ca3af'} />
        <CustomText weight="bold" className="mt-4 text-lg" style={{ color: colors.text }}>
          {t('inbox.notFound') || 'Notification not found'}
        </CustomText>
        <TouchableOpacity onPress={() => refetch()} className="mt-4 rounded-full bg-primary px-4 py-2">
          <Text className="font-semibold text-white">{t('common.retry') || 'Retry'}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className='flex-1' style={{ backgroundColor: colors.background }}>
      <Stack.Screen
        options={{
          title: t('notifications.details'),
          headerShown: true,
          headerLargeTitle: false,
        }}
      />

      <ScrollView className='flex-1'>
        {/* Header */}
        <View className='border-b p-6' style={{ borderBottomColor: isDark ? '#333' : '#e5e7eb' }}>
          <View className='mb-4 flex-row items-center gap-4'>
            <View
              className='size-16 items-center justify-center rounded-full'
              style={{ backgroundColor: isDark ? '#374151' : '#f3f4f6' }}
            >
              <Ionicons
                name={getTypeIcon(notification.type) as any}
                size={32}
                color={getTypeColor(notification.type)}
              />
            </View>
            <View className='flex-1'>
              <View
                className='mb-2 self-start rounded-full px-3 py-1'
                style={{ backgroundColor: `${getTypeColor(notification.type)}20` }}
              >
                <Text
                  className='text-xs font-semibold capitalize'
                  style={{ color: getTypeColor(notification.type) }}
                >
                  {notification.type}
                </Text>
              </View>
              {parsedCreatedAt && (
                <Text
                  className="text-xs"
                  style={{ color: isDark ? '#9ca3af' : '#6b7280' }}
                >
                  {formatTime(parsedCreatedAt)}
                </Text>
              )}
            </View>
          </View>

          <Text
            className='mb-2 text-2xl font-bold'
            style={{ color: colors.text }}
          >
            {notification.title}
          </Text>
        </View>

        {/* Content */}
        <View className='p-6'>
          <Text className="text-base leading-7" style={{ color: isDark ? '#d1d5db' : '#374151' }}>
            {notification.message}
          </Text>

          {notification.step && notification.totalSteps ? (
            <View className="mt-4">
              <Text className="text-sm text-gray-500 dark:text-gray-400">
                {t('notifications.progress', {
                  defaultValue: 'Step {{current}} of {{total}}',
                  current: notification.step,
                  total: notification.totalSteps,
                })}
              </Text>
            </View>
          ) : null}

          {notification.targetType && notification.targetId && (
            <View className="mt-6 gap-3">
              <TouchableOpacity
                onPress={handleNavigate}
                className="flex-row items-center justify-center gap-2 rounded-xl py-4"
                style={{ backgroundColor: colors.primary }}
                activeOpacity={0.8}
              >
                <Ionicons name="arrow-forward" size={20} color="#fff" />
                <Text className="text-base font-semibold text-white">
                  {t('inbox.viewDetails') || 'View details'}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

