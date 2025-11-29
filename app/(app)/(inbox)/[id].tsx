import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, Stack, useLocalSearchParams } from 'expo-router';
import { useAppSelector } from '@state/hooks';
import Colors from '@constants/Colors';

// Mock notification data
const mockNotifications: Record<string, any> = {
  '1': {
    id: '1',
    type: 'social',
    title: 'Sarah Johnson used your trip',
    message: 'Your Tokyo Adventure trip was used for planning',
    fullMessage: 'Sarah Johnson has used your "Tokyo Adventure" trip as a template for their upcoming journey. Your detailed itinerary and recommendations have helped another traveler plan their perfect trip!',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    read: false,
    actionable: true,
    actionData: {
      type: 'trip',
      id: '123',
      userName: 'Sarah Johnson',
      userAvatar: null,
    },
  },
  '2': {
    id: '2',
    type: 'social',
    title: 'Mike Chen commented on your post',
    message: 'Great photos from your mountain trip!',
    fullMessage: 'Mike Chen commented: "These are absolutely stunning photos! The mountain landscapes look incredible. How was the weather during your trek? I\'m planning a similar trip next month and would love to know more about your experience."',
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
    read: false,
    actionable: true,
    actionData: {
      type: 'post',
      id: '456',
      userName: 'Mike Chen',
    },
  },
  '3': {
    id: '3',
    type: 'tour',
    title: 'New member joined your tour',
    message: 'Emma Wilson joined "Swiss Alps Adventure"',
    fullMessage: 'Good news! Emma Wilson has joined your "Swiss Alps Adventure" tour. You now have 8 members in the group. Emma is an experienced hiker and photographer based in Zurich.',
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    read: true,
    actionable: true,
    actionData: {
      type: 'tour',
      id: '789',
      tourName: 'Swiss Alps Adventure',
      userName: 'Emma Wilson',
    },
  },
};

export default function NotificationDetailScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const isDark = useAppSelector(state => state.theme.isDark);

  const colors = isDark ? Colors.dark : Colors.light;
  const notification = mockNotifications[id as string];

  if (!notification) {
    return (
      <View className='flex-1 items-center justify-center' style={{ backgroundColor: colors.background }}>
        <Ionicons
          name='alert-circle-outline'
          size={64}
          color={isDark ? '#6b7280' : '#9ca3af'}
        />
        <Text
          className='text-lg font-semibold mt-4'
          style={{ color: colors.text }}
        >
          Notification not found
        </Text>
      </View>
    );
  }

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

  const handleAction = () => {
    const { actionData } = notification;
    
    if (actionData.type === 'trip') {
      router.push(`/(app)/(trips)/${actionData.id}` as any);
    } else if (actionData.type === 'post') {
      router.push(`/(app)/(home)/${actionData.id}` as any);
    } else if (actionData.type === 'tour') {
      // Tour is now unified into Trip with isHosted flag - navigate to trip detail
      router.push(`/(app)/(trips)/${actionData.id}` as any);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      t('notifications.deleteTitle'),
      t('notifications.deleteMessage'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('notifications.deleteNotification'),
          style: 'destructive',
          onPress: () => {
            // In real app, delete notification
            router.back();
          },
        },
      ]
    );
  };

  return (
    <View className='flex-1' style={{ backgroundColor: colors.background }}>
      <Stack.Screen
        options={{
          title: t('notifications.details'),
          headerShown: true,
          headerLargeTitle: false,
          headerRight: () => (
            <TouchableOpacity onPress={handleDelete} className='mr-2'>
              <Ionicons name='trash-outline' size={22} color='#ef4444' />
            </TouchableOpacity>
          ),
        }}
      />

      <ScrollView className='flex-1'>
        {/* Header */}
        <View className='p-6 border-b' style={{ borderBottomColor: isDark ? '#333' : '#e5e7eb' }}>
          <View className='flex-row items-center gap-4 mb-4'>
            <View
              className='w-16 h-16 rounded-full items-center justify-center'
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
                className='px-3 py-1 rounded-full self-start mb-2'
                style={{ backgroundColor: `${getTypeColor(notification.type)}20` }}
              >
                <Text
                  className='text-xs font-semibold capitalize'
                  style={{ color: getTypeColor(notification.type) }}
                >
                  {notification.type}
                </Text>
              </View>
              <Text
                className='text-xs'
                style={{ color: isDark ? '#9ca3af' : '#6b7280' }}
              >
                {formatTime(notification.timestamp)}
              </Text>
            </View>
          </View>

          <Text
            className='text-2xl font-bold mb-2'
            style={{ color: colors.text }}
          >
            {notification.title}
          </Text>
        </View>

        {/* Content */}
        <View className='p-6'>
          <Text
            className='text-base leading-7'
            style={{ color: isDark ? '#d1d5db' : '#374151' }}
          >
            {notification.fullMessage}
          </Text>

          {/* Action Data Card */}
          {notification.actionData && (
            <View
              className='mt-6 p-4 rounded-xl'
              style={{ backgroundColor: isDark ? '#1f2937' : '#f9fafb' }}
            >
              <Text
                className='text-sm font-semibold mb-2'
                style={{ color: isDark ? '#9ca3af' : '#6b7280' }}
              >
                Related Information
              </Text>
              {notification.actionData.userName && (
                <View className='flex-row items-center gap-2 mb-2'>
                  <Ionicons
                    name='person'
                    size={16}
                    color={isDark ? '#9ca3af' : '#6b7280'}
                  />
                  <Text
                    className='text-sm'
                    style={{ color: colors.text }}
                  >
                    {notification.actionData.userName}
                  </Text>
                </View>
              )}
              {notification.actionData.tourName && (
                <View className='flex-row items-center gap-2'>
                  <Ionicons
                    name='flag'
                    size={16}
                    color={isDark ? '#9ca3af' : '#6b7280'}
                  />
                  <Text
                    className='text-sm'
                    style={{ color: colors.text }}
                  >
                    {notification.actionData.tourName}
                  </Text>
                </View>
              )}
            </View>
          )}

          {/* Action Buttons */}
          {notification.actionable && (
            <View className='mt-6 gap-3'>
              <TouchableOpacity
                onPress={handleAction}
                className='py-4 rounded-xl flex-row items-center justify-center gap-2'
                style={{ backgroundColor: colors.primary }}
                activeOpacity={0.8}
              >
                <Ionicons name='arrow-forward' size={20} color='#fff' />
                <Text className='text-base font-semibold text-white'>
                  View Details
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  Alert.alert(
                    t('notifications.markAsRead'),
                    t('notifications.markedAsRead')
                  );
                  router.back();
                }}
                className='py-4 rounded-xl flex-row items-center justify-center gap-2'
                style={{ backgroundColor: isDark ? '#374151' : '#f3f4f6' }}
                activeOpacity={0.8}
              >
                <Ionicons
                  name='checkmark-circle'
                  size={20}
                  color={isDark ? '#9ca3af' : '#6b7280'}
                />
                <Text
                  className='text-base font-semibold'
                  style={{ color: isDark ? '#d1d5db' : '#374151' }}
                >
                  {t('notifications.markAsRead')}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

