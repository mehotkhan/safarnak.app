import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Image,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAppSelector } from '@state/hooks';
import { ShareableTabs } from '@ui/layout/ShareableTabs';
import Colors from '@constants/Colors';

// Notification types including messages
type NotificationType = 'social' | 'trip' | 'tour' | 'system' | 'message';

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  avatar?: string;
  unreadCount?: number;
  actionData?: any;
}

// Create unified mock data (notifications + messages)
const createMockData = (t: any): Notification[] => {
  const notifications: Notification[] = [
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

  // Convert messages to notification format
  const messages: Notification[] = [
    {
      id: 'msg-1',
      type: 'message',
      title: t('messages.mockUsers.sarah.name', { defaultValue: 'Sarah Johnson' }),
      message: t('messages.mockChat1.lastMessage', { defaultValue: 'Hey! How was your trip to Tokyo?' }),
      timestamp: new Date('2025-11-20T10:30:00Z'),
      read: false,
      avatar: 'https://picsum.photos/seed/sarah-chat/100/100',
      unreadCount: 2,
    },
    {
      id: 'msg-2',
      type: 'message',
      title: t('messages.mockUsers.mike.name', { defaultValue: 'Mike Chen' }),
      message: t('messages.mockChat2.lastMessage', { defaultValue: 'Great photos from your mountain trip!' }),
      timestamp: new Date('2025-11-20T09:15:00Z'),
      read: true,
      avatar: 'https://picsum.photos/seed/mike-chat/100/100',
      unreadCount: 0,
    },
  ];

  return [...messages, ...notifications].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
};

export default function NotificationsScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const isDark = useAppSelector(state => state.theme.isDark);
  const [allItems, setAllItems] = useState(() => createMockData(t));
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
      case 'message':
        return 'chatbubble';
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
      case 'message':
        return '#8b5cf6';
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

  const filteredItems = selectedFilter === 'all' 
    ? allItems 
    : allItems.filter(item => item.type === selectedFilter);

  const filterTabs = [
    { id: 'all', label: 'All', translationKey: 'explore.categories.all' },
    { id: 'message', label: 'Messages', translationKey: 'notifications.categories.messages' },
    { id: 'social', label: 'Social', translationKey: 'notifications.categories.social' },
    { id: 'trip', label: 'Trip', translationKey: 'notifications.categories.trip' },
    { id: 'tour', label: 'Tour', translationKey: 'notifications.categories.tour' },
    { id: 'system', label: 'System', translationKey: 'notifications.categories.system' },
  ];

  return (
    <View className='flex-1' style={{ backgroundColor: colors.background }}>
      {/* Filter tabs */}
      <ShareableTabs
        tabs={filterTabs}
        activeTab={selectedFilter}
        onTabChange={(tabId) => setSelectedFilter(tabId as NotificationType | 'all')}
      />

      {/* Unified list */}
      <ScrollView
        className='flex-1'
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {filteredItems.length === 0 ? (
          <View className='items-center justify-center py-20'>
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
            {filteredItems.map((item) => (
              <TouchableOpacity
                key={item.id}
                onPress={() => {
                  setAllItems(prev =>
                    prev.map(n =>
                      n.id === item.id ? { ...n, read: true } : n
                    )
                  );
                  if (item.type === 'message' && item.id.startsWith('msg-')) {
                    const userId = item.id.replace('msg-', '');
                    if (userId) {
                      router.push(`/(app)/(notifications)/messages/${userId}` as any);
                    }
                  } else if (item.type !== 'message') {
                    router.push(`/(app)/(notifications)/${item.id}` as any);
                  }
                }}
                className='flex-row items-start px-4 py-4 border-b'
                style={{
                  backgroundColor: item.read
                    ? 'transparent'
                    : isDark ? '#1f2937' : '#eff6ff',
                  borderBottomColor: isDark ? '#333' : '#e5e7eb',
                }}
              >
                {/* Avatar for messages, icon for others */}
                {item.type === 'message' && item.avatar ? (
                  <View className='w-12 h-12 rounded-full overflow-hidden mr-3 bg-gray-200 dark:bg-neutral-800'>
                    <Image
                      source={{ uri: item.avatar }}
                      className='w-full h-full'
                      resizeMode='cover'
                    />
                  </View>
                ) : (
                  <View
                    className='w-12 h-12 rounded-full items-center justify-center mr-3'
                    style={{
                      backgroundColor: isDark ? '#374151' : '#f3f4f6',
                    }}
                  >
                    <Ionicons
                      name={getTypeIcon(item.type) as any}
                      size={24}
                      color={getTypeColor(item.type)}
                    />
                  </View>
                )}
                <View className='flex-1'>
                  <View className='flex-row items-center justify-between'>
                    <Text
                      className='font-semibold text-base flex-1'
                      style={{ color: colors.text }}
                      numberOfLines={1}
                    >
                      {item.title}
                    </Text>
                    <View className='flex-row items-center'>
                      {item.unreadCount !== undefined && item.unreadCount > 0 && (
                        <View
                          className='px-2 py-0.5 rounded-full mr-2'
                          style={{ backgroundColor: colors.primary }}
                        >
                          <Text className='text-xs text-white font-bold'>
                            {item.unreadCount > 9 ? '9+' : item.unreadCount}
                          </Text>
                        </View>
                      )}
                      {!item.read && (
                        <View
                          className='w-2 h-2 rounded-full'
                          style={{ backgroundColor: colors.primary }}
                        />
                      )}
                    </View>
                  </View>
                  <Text
                    className='text-sm mt-1'
                    style={{ color: isDark ? '#9ca3af' : '#6b7280' }}
                    numberOfLines={2}
                  >
                    {item.message}
                  </Text>
                  <Text
                    className='text-xs mt-1'
                    style={{ color: isDark ? '#6b7280' : '#9ca3af' }}
                  >
                    {formatTime(item.timestamp)}
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

