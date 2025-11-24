import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAppSelector } from '@state/hooks';
import Colors from '@constants/Colors';

// Mock notification types
type NotificationType = 'social' | 'trip' | 'tour' | 'system';

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionData?: any;
}

// Mock data for notifications
const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'social',
    title: 'Sarah Johnson used your trip',
    message: 'Your Tokyo Adventure trip was used for planning',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    read: false,
  },
  {
    id: '2',
    type: 'social',
    title: 'Mike Chen commented on your post',
    message: 'Great photos from your mountain trip!',
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
    read: false,
  },
  {
    id: '3',
    type: 'tour',
    title: 'New member joined your tour',
    message: 'Emma Wilson joined "Swiss Alps Adventure"',
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    read: true,
  },
  {
    id: '4',
    type: 'trip',
    title: 'AI has a suggestion for your trip',
    message: 'Better route found for your Paris trip',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    read: true,
  },
  {
    id: '5',
    type: 'system',
    title: 'Weather alert',
    message: 'Rain expected during your Barcelona trip dates',
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    read: true,
  },
];

export default function NotificationsScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const isDark = useAppSelector(state => state.theme.isDark);
  const [notifications, setNotifications] = useState(mockNotifications);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<NotificationType | 'all'>('all');

  const colors = isDark ? Colors.dark : Colors.light;

  const onRefresh = () => {
    setRefreshing(true);
    // Simulate refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const getTypeIcon = (type: NotificationType) => {
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

  const getTypeColor = (type: NotificationType) => {
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

  const filteredNotifications = selectedFilter === 'all' 
    ? notifications 
    : notifications.filter(n => n.type === selectedFilter);

  const filters: Array<{ key: NotificationType | 'all'; label: string }> = [
    { key: 'all', label: t('explore.categories.all') },
    { key: 'social', label: t('notifications.categories.social') },
    { key: 'trip', label: t('notifications.categories.trip') },
    { key: 'tour', label: t('notifications.categories.tour') },
    { key: 'system', label: t('notifications.categories.system') },
  ];

  return (
    <View className='flex-1' style={{ backgroundColor: colors.background }}>
      {/* Filter tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className='border-b'
        style={{ 
          borderBottomColor: isDark ? '#333' : '#e5e7eb',
          maxHeight: 50,
        }}
      >
        <View className='flex-row px-4 py-2 gap-2'>
          {filters.map((filter) => (
            <TouchableOpacity
              key={filter.key}
              onPress={() => setSelectedFilter(filter.key)}
              className='px-4 py-2 rounded-full'
              style={{
                backgroundColor:
                  selectedFilter === filter.key
                    ? colors.primary
                    : isDark ? '#374151' : '#f3f4f6',
              }}
            >
              <Text
                className='font-medium'
                style={{
                  color:
                    selectedFilter === filter.key
                      ? '#fff'
                      : colors.text,
                }}
              >
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Notifications list */}
      <ScrollView
        className='flex-1'
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {filteredNotifications.length === 0 ? (
          <View className='flex-1 items-center justify-center py-20'>
            <Ionicons
              name='notifications-off-outline'
              size={64}
              color={isDark ? '#6b7280' : '#9ca3af'}
            />
            <Text
              className='text-lg font-semibold mt-4'
              style={{ color: colors.text }}
            >
              {t('me.inbox.emptyState')}
            </Text>
          </View>
        ) : (
          <View className='py-2'>
            {filteredNotifications.map((notification) => (
              <TouchableOpacity
                key={notification.id}
                onPress={() => {
                  // Mark as read
                  setNotifications(prev =>
                    prev.map(n =>
                      n.id === notification.id ? { ...n, read: true } : n
                    )
                  );
                  // Navigate to detail page
                  router.push(`/(app)/(notifications)/${notification.id}` as any);
                }}
                className='flex-row items-start px-4 py-4 border-b'
                style={{
                  backgroundColor: notification.read
                    ? 'transparent'
                    : isDark ? '#1f2937' : '#eff6ff',
                  borderBottomColor: isDark ? '#333' : '#e5e7eb',
                }}
              >
                {/* Icon */}
                <View
                  className='w-12 h-12 rounded-full items-center justify-center mr-3'
                  style={{
                    backgroundColor: isDark ? '#374151' : '#f3f4f6',
                  }}
                >
                  <Ionicons
                    name={getTypeIcon(notification.type) as any}
                    size={24}
                    color={getTypeColor(notification.type)}
                  />
                </View>

                {/* Content */}
                <View className='flex-1'>
                  <View className='flex-row items-center justify-between'>
                    <Text
                      className='font-semibold text-base flex-1'
                      style={{ color: colors.text }}
                      numberOfLines={1}
                    >
                      {notification.title}
                    </Text>
                    {!notification.read && (
                      <View
                        className='w-2 h-2 rounded-full ml-2'
                        style={{ backgroundColor: colors.primary }}
                      />
                    )}
                  </View>
                  <Text
                    className='text-sm mt-1'
                    style={{ color: isDark ? '#9ca3af' : '#6b7280' }}
                    numberOfLines={2}
                  >
                    {notification.message}
                  </Text>
                  <Text
                    className='text-xs mt-1'
                    style={{ color: isDark ? '#6b7280' : '#9ca3af' }}
                  >
                    {formatTime(notification.timestamp)}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

