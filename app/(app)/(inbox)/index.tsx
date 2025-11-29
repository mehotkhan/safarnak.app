import React, { useState } from 'react';
import {
  View,
  TouchableOpacity,
  RefreshControl,
  Image,
  FlatList,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { TabBar } from '@ui/layout';
import { CustomText } from '@ui/display';
import { useTheme } from '@ui/context';
import Colors from '@constants/Colors';
import { useDateTime } from '@hooks/useDateTime';

// Notification types (Activity tab)
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

interface Conversation {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  lastMessage: string;
  timestamp: Date;
  unreadCount: number;
  isOnline?: boolean;
}

type InboxTab = 'activity' | 'messages';

// Create mock notifications (Activity)
const createMockNotifications = (): Notification[] => [
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

// Create mock conversations (Messages)
const createMockConversations = (t: any): Conversation[] => [
    {
    id: '2',
    userId: '2',
    userName: t('messages.mockUsers.sarah.name', { defaultValue: 'Sarah Johnson' }),
    userAvatar: 'https://picsum.photos/seed/sarah-chat/100/100',
    lastMessage: t('messages.mockChat1.lastMessage', { defaultValue: 'Hey! How was your trip to Tokyo?' }),
      timestamp: new Date('2025-11-20T10:30:00Z'),
      unreadCount: 2,
    isOnline: true,
    },
    {
    id: '3',
    userId: '3',
    userName: t('messages.mockUsers.mike.name', { defaultValue: 'Mike Chen' }),
    userAvatar: 'https://picsum.photos/seed/mike-chat/100/100',
    lastMessage: t('messages.mockChat2.lastMessage', { defaultValue: 'Great photos from your mountain trip!' }),
      timestamp: new Date('2025-11-20T09:15:00Z'),
      unreadCount: 0,
    isOnline: false,
    },
  ];

export default function InboxScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { isDark } = useTheme();
  const { formatRelativeTime } = useDateTime();
  const [activeTab, setActiveTab] = useState<InboxTab>('activity');
  const [refreshing, setRefreshing] = useState(false);

  // Mock data
  const [notifications, setNotifications] = useState(() => createMockNotifications());
  const [conversations] = useState(() => createMockConversations(t));

  const onRefresh = () => {
    setRefreshing(true);
    // Simulate refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const getNotificationIcon = (type: NotificationType) => {
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

  const getNotificationColor = (type: NotificationType) => {
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
        return isDark ? Colors.dark.primary : Colors.light.primary;
    }
  };

  const handleNotificationPress = (notification: Notification) => {
    // Mark as read
    setNotifications(prev =>
      prev.map(n => (n.id === notification.id ? { ...n, read: true } : n))
    );
    // Navigate to detail
    router.push(`/(app)/(inbox)/${notification.id}` as any);
  };

  const handleConversationPress = (conversation: Conversation) => {
    router.push(`/(app)/(inbox)/messages/${conversation.userId}` as any);
  };

  // Render Activity (Notifications)
  const renderActivity = () => {
    if (notifications.length === 0) {
  return (
        <View className="flex-1 items-center justify-center py-20">
            <Ionicons
            name="notifications-off-outline"
              size={64}
              color={isDark ? '#6b7280' : '#9ca3af'}
            />
          <CustomText weight="bold" className="text-lg text-gray-800 dark:text-gray-300 mt-4 mb-2 text-center">
            {t('inbox.emptyActivity') || 'No activity yet'}
          </CustomText>
          <CustomText className="text-base text-gray-600 dark:text-gray-400 text-center">
            {t('inbox.emptyActivityDescription') || 'Your notifications will appear here'}
          </CustomText>
          </View>
      );
    }

    return (
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => handleNotificationPress(item)}
            className="flex-row items-start px-4 py-4 border-b border-gray-200 dark:border-neutral-800"
                style={{
                  backgroundColor: item.read
                    ? 'transparent'
                    : isDark ? '#1f2937' : '#eff6ff',
                }}
              >
                  <View
              className="w-12 h-12 rounded-full items-center justify-center mr-3"
                    style={{
                      backgroundColor: isDark ? '#374151' : '#f3f4f6',
                    }}
                  >
                    <Ionicons
                name={getNotificationIcon(item.type) as any}
                      size={24}
                color={getNotificationColor(item.type)}
                    />
                  </View>
            <View className="flex-1">
              <View className="flex-row items-center justify-between mb-1">
                <CustomText
                  weight="bold"
                  className="text-base text-black dark:text-white flex-1"
                      numberOfLines={1}
                    >
                      {item.title}
                </CustomText>
                      {!item.read && (
                        <View
                    className="w-2 h-2 rounded-full ml-2"
                    style={{ backgroundColor: isDark ? Colors.dark.primary : Colors.light.primary }}
                        />
                      )}
                    </View>
              <CustomText
                className="text-sm text-gray-600 dark:text-gray-400 mt-1"
                    numberOfLines={2}
                  >
                    {item.message}
              </CustomText>
              <CustomText className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                {formatRelativeTime(item.timestamp.toISOString())}
              </CustomText>
                </View>
              </TouchableOpacity>
        )}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />
    );
  };

  // Render Messages (Conversations)
  const renderMessages = () => {
    if (conversations.length === 0) {
      return (
        <View className="flex-1 items-center justify-center py-20">
          <Ionicons
            name="chatbubbles-outline"
            size={64}
            color={isDark ? '#6b7280' : '#9ca3af'}
          />
          <CustomText weight="bold" className="text-lg text-gray-800 dark:text-gray-300 mt-4 mb-2 text-center">
            {t('inbox.emptyMessages') || 'No messages yet'}
          </CustomText>
          <CustomText className="text-base text-gray-600 dark:text-gray-400 text-center">
            {t('inbox.emptyMessagesDescription') || 'Start a conversation with someone'}
          </CustomText>
        </View>
      );
    }

    return (
      <FlatList
        data={conversations}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => handleConversationPress(item)}
            className="flex-row items-center px-4 py-3 border-b border-gray-200 dark:border-neutral-800"
            activeOpacity={0.7}
          >
            <View className="relative">
              <View className="w-12 h-12 rounded-full overflow-hidden mr-3 bg-gray-200 dark:bg-neutral-800">
                {item.userAvatar ? (
                  <Image
                    source={{ uri: item.userAvatar }}
                    className="w-full h-full"
                    resizeMode="cover"
                  />
                ) : (
                  <View className="w-full h-full items-center justify-center">
                    <Ionicons
                      name="person"
                      size={24}
                      color={isDark ? '#9ca3af' : '#6b7280'}
                    />
                  </View>
                )}
              </View>
              {item.isOnline && (
                <View className="absolute bottom-0 right-3 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-black" />
              )}
            </View>
            <View className="flex-1">
              <View className="flex-row items-center justify-between mb-1">
                <CustomText weight="bold" className="text-base text-black dark:text-white" numberOfLines={1}>
                  {item.userName}
                </CustomText>
                <CustomText className="text-xs text-gray-500 dark:text-gray-400">
                  {formatRelativeTime(item.timestamp.toISOString())}
                </CustomText>
              </View>
              <CustomText
                className="text-sm text-gray-600 dark:text-gray-400"
                numberOfLines={1}
              >
                {item.lastMessage}
              </CustomText>
            </View>
            {item.unreadCount > 0 && (
              <View className="ml-2 px-2 py-1 rounded-full bg-primary">
                <CustomText className="text-xs text-white" weight="bold">
                  {item.unreadCount > 9 ? '9+' : item.unreadCount}
                </CustomText>
          </View>
        )}
          </TouchableOpacity>
        )}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />
    );
  };

  return (
    <View className="flex-1 bg-white dark:bg-black">
      {/* Segmented Control: Activity / Messages */}
      <View className="px-4 pt-4 pb-2">
        <TabBar
          tabs={[
            { id: 'activity', label: t('inbox.activity') || 'Activity' },
            { id: 'messages', label: t('inbox.messages') || 'Messages' },
          ]}
          activeTab={activeTab}
          onTabChange={(tabId) => setActiveTab(tabId as InboxTab)}
          variant="segmented"
        />
      </View>

      {/* Content */}
      <View className="flex-1">
        {activeTab === 'activity' ? renderActivity() : renderMessages()}
      </View>
    </View>
  );
}
