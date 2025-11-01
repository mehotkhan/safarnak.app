import { useState } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { CustomText } from '@components/ui/CustomText';
import { useTheme } from '@components/context/ThemeContext';
import Colors from '@constants/Colors';

// Mock data
const mockNotificationsBase = (t: any) => ([
  {
    id: '1',
    type: 'trip',
    title: t('me.inbox.planReady'),
    message: t('me.inbox.planReadyMessage'),
    time: t('me.inbox.time.2h'),
    read: false,
  },
  {
    id: '2',
    type: 'tour',
    title: t('me.inbox.newTour'),
    message: t('me.inbox.newTourMessage'),
    time: t('me.inbox.time.1d'),
    read: false,
  },
  {
    id: '3',
    type: 'message',
    title: t('me.inbox.support'),
    message: t('me.inbox.supportMessage'),
    time: t('me.inbox.time.3d'),
    read: true,
  },
]);

const mockChatsBase = (t: any) => ([
  {
    id: '1',
    user: {
      id: '2',
      name: 'Sarah Johnson',
      username: 'sarah_travels',
      avatar: 'https://picsum.photos/seed/sarah-chat/100/100',
      isOnline: true,
    },
    lastMessage: {
      content: t('messages.mockChat1.lastMessage'),
      timestamp: '2025-11-01T14:30:00Z',
      isOwn: false,
    },
    unreadCount: 2,
    archived: false,
  },
  {
    id: '2',
    user: {
      id: '3',
      name: 'Mike Chen',
      username: 'mike_adventures',
      avatar: 'https://picsum.photos/seed/mike-chat/100/100',
      isOnline: false,
    },
    lastMessage: {
      content: t('messages.mockChat2.lastMessage'),
      timestamp: '2025-11-01T10:15:00Z',
      isOwn: true,
    },
    unreadCount: 0,
    archived: false,
  },
  {
    id: '3',
    user: {
      id: '4',
      name: 'Emma Wilson',
      username: 'emma_explorer',
      avatar: 'https://picsum.photos/seed/emma-chat/100/100',
      isOnline: true,
    },
    lastMessage: {
      content: t('messages.mockChat3.lastMessage'),
      timestamp: '2025-10-31T18:45:00Z',
      isOwn: false,
    },
    unreadCount: 5,
    archived: false,
  },
  {
    id: '4',
    user: {
      id: '5',
      name: 'David Park',
      username: 'david_wanderer',
      avatar: 'https://picsum.photos/seed/david-chat/100/100',
      isOnline: false,
    },
    lastMessage: {
      content: t('messages.mockChat4.lastMessage'),
      timestamp: '2025-10-30T12:20:00Z',
      isOwn: true,
    },
    unreadCount: 0,
    archived: false,
  },
  {
    id: '5',
    user: {
      id: '6',
      name: 'Lisa Anderson',
      username: 'lisa_nomad',
      avatar: 'https://picsum.photos/seed/lisa-chat/100/100',
      isOnline: false,
    },
    lastMessage: {
      content: t('messages.mockChat5.lastMessage'),
      timestamp: '2025-10-28T09:30:00Z',
      isOwn: false,
    },
    unreadCount: 0,
    archived: true,
  },
]);

export default function MessagesScreen() {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState<'notifications' | 'chats'>('notifications');
  const [showArchived, setShowArchived] = useState(false);
  const [chats, setChats] = useState(mockChatsBase(t));

  const getIconName = (type: string) => {
    switch (type) {
      case 'trip':
        return 'airplane';
      case 'tour':
        return 'map';
      case 'message':
        return 'mail';
      default:
        return 'notifications';
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (hours < 1) return t('messages.time.justNow');
    if (hours < 24) return t('messages.time.hoursAgo', { count: hours });
    if (days === 1) return t('messages.time.yesterday');
    if (days < 7) return t('messages.time.daysAgo', { count: days });
    return date.toLocaleDateString();
  };

  const handleArchiveChat = (chatId: string) => {
    setChats(prevChats =>
      prevChats.map(chat =>
        chat.id === chatId ? { ...chat, archived: !chat.archived } : chat
      )
    );
  };

  const handleDeleteChat = (chatId: string) => {
    Alert.alert(
      t('messages.deleteChat'),
      t('messages.deleteChatConfirm'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.delete'),
          style: 'destructive',
          onPress: () => {
            setChats(prevChats => prevChats.filter(chat => chat.id !== chatId));
          },
        },
      ]
    );
  };

  const mockNotifications = mockNotificationsBase(t);
  const filteredChats = chats.filter(chat => 
    showArchived ? chat.archived : !chat.archived
  );

  return (
    <View className="flex-1 bg-white dark:bg-black">
      <Stack.Screen options={{ title: t('me.inbox.title'), headerShown: true }} />

      {/* Tabs */}
      <View className="flex-row gap-2 px-6 pt-4">
          <TouchableOpacity
            onPress={() => setSelectedTab('notifications')}
            className={`flex-1 py-3 rounded-lg ${
              selectedTab === 'notifications'
                ? 'bg-primary'
                : 'bg-gray-100 dark:bg-neutral-900'
            }`}
          >
            <CustomText
              weight="medium"
              className={`text-center ${
                selectedTab === 'notifications'
                  ? 'text-white'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              {t('me.inbox.notifications')}
            </CustomText>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setSelectedTab('chats')}
            className={`flex-1 py-3 rounded-lg ${
              selectedTab === 'chats'
                ? 'bg-primary'
                : 'bg-gray-100 dark:bg-neutral-900'
            }`}
          >
            <CustomText
              weight="medium"
              className={`text-center ${
                selectedTab === 'chats'
                  ? 'text-white'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              {t('me.inbox.chats')}
            </CustomText>
          </TouchableOpacity>
      </View>

      {/* Content */}
      {selectedTab === 'notifications' ? (
        <ScrollView className="flex-1 px-6 py-4">
          {mockNotifications.map(notification => (
            <TouchableOpacity
              key={notification.id}
              onPress={() => router.push(`/(app)/(profile)/notifications/${notification.id}` as any)}
              className={`flex-row p-4 mb-3 rounded-2xl border ${
                notification.read
                  ? 'bg-white dark:bg-neutral-900 border-gray-200 dark:border-neutral-800'
                  : 'bg-primary/10 dark:bg-primary/20 border-primary/40'
              }`}
            >
              <View
                className={`w-12 h-12 rounded-full items-center justify-center mr-4 ${
                  notification.read
                    ? 'bg-gray-100 dark:bg-neutral-800'
                    : 'bg-primary/15 dark:bg-primary/25'
                }`}
              >
                <Ionicons
                  name={getIconName(notification.type) as any}
                  size={24}
                  color={
                    notification.read
                      ? (isDark ? '#9ca3af' : '#6b7280')
                      : (isDark ? Colors.dark.primary : Colors.light.primary)
                  }
                />
              </View>
              <View className="flex-1">
                <CustomText
                  weight="bold"
                  className="text-base text-black dark:text-white mb-1"
                >
                  {notification.title}
                </CustomText>
                <CustomText className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  {notification.message}
                </CustomText>
                <CustomText className="text-xs text-gray-500 dark:text-gray-500">
                  {notification.time}
                </CustomText>
              </View>
              {!notification.read && (
                <View className="w-3 h-3 bg-primary rounded-full" />
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      ) : (
        <View className="flex-1">
          {/* Archive Toggle */}
          <View className="px-6 py-3 flex-row items-center justify-between border-b border-gray-200 dark:border-neutral-800">
            <CustomText weight="medium" className="text-base text-black dark:text-white">
              {showArchived ? t('messages.archived') : t('messages.chats')}
            </CustomText>
            <TouchableOpacity
              onPress={() => setShowArchived(!showArchived)}
              className="flex-row items-center"
            >
              <Ionicons
                name={showArchived ? 'chatbubbles' : 'archive'}
                size={20}
                color={isDark ? Colors.dark.primary : Colors.light.primary}
              />
              <CustomText
                weight="medium"
                className="text-primary ml-2"
              >
                {showArchived ? t('messages.showActive') : t('messages.showArchived')}
              </CustomText>
            </TouchableOpacity>
          </View>

          {/* Chat List */}
          {filteredChats.length === 0 ? (
            <View className="flex-1 items-center justify-center px-6">
              <Ionicons
                name="chatbubbles-outline"
                size={80}
                color={isDark ? '#4b5563' : '#d1d5db'}
              />
              <CustomText
                weight="bold"
                className="text-xl text-gray-800 dark:text-gray-300 mt-4 mb-2 text-center"
              >
                {showArchived ? t('messages.noArchivedChats') : t('me.inbox.emptyState')}
              </CustomText>
            </View>
          ) : (
            <ScrollView className="flex-1 px-6 py-4">
              {filteredChats.map(chat => (
                <TouchableOpacity
                  key={chat.id}
                  onPress={() => router.push(`/(app)/(profile)/messages/${chat.id}` as any)}
                  onLongPress={() => {
                    Alert.alert(
                      chat.user.name,
                      t('messages.chatOptions'),
                      [
                        {
                          text: chat.archived ? t('messages.unarchive') : t('messages.archive'),
                          onPress: () => handleArchiveChat(chat.id),
                        },
                        {
                          text: t('common.delete'),
                          style: 'destructive',
                          onPress: () => handleDeleteChat(chat.id),
                        },
                        { text: t('common.cancel'), style: 'cancel' },
                      ]
                    );
                  }}
                  className={`flex-row p-4 mb-3 rounded-2xl border ${
                    chat.unreadCount > 0
                      ? 'bg-primary/10 dark:bg-primary/20 border-primary/40'
                      : 'bg-white dark:bg-neutral-900 border-gray-200 dark:border-neutral-800'
                  }`}
                >
                  {/* Avatar */}
                  <View className="relative mr-4">
                    <View className="w-14 h-14 rounded-full bg-gray-200 dark:bg-neutral-800 items-center justify-center">
                      <Ionicons
                        name="person"
                        size={28}
                        color={isDark ? '#9ca3af' : '#6b7280'}
                      />
                    </View>
                    {chat.user.isOnline && (
                      <View className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-black" />
                    )}
                  </View>

                  {/* Chat Info */}
                  <View className="flex-1">
                    <View className="flex-row items-center justify-between mb-1">
                      <CustomText
                        weight="bold"
                        className="text-base text-black dark:text-white flex-1"
                      >
                        {chat.user.name}
                      </CustomText>
                      <CustomText className="text-xs text-gray-500 dark:text-gray-400">
                        {formatTime(chat.lastMessage.timestamp)}
                      </CustomText>
                    </View>
                    <View className="flex-row items-center">
                      {chat.lastMessage.isOwn && (
                        <Ionicons
                          name="checkmark-done"
                          size={16}
                          color={isDark ? '#9ca3af' : '#6b7280'}
                          style={{ marginRight: 4 }}
                        />
                      )}
                      <CustomText
                        className={`text-sm flex-1 ${
                          chat.unreadCount > 0
                            ? 'text-black dark:text-white font-medium'
                            : 'text-gray-600 dark:text-gray-400'
                        }`}
                        numberOfLines={1}
                      >
                        {chat.lastMessage.content}
                      </CustomText>
                    </View>
                  </View>

                  {/* Unread Badge */}
                  {chat.unreadCount > 0 && (
                    <View className="ml-3 w-6 h-6 bg-primary rounded-full items-center justify-center">
                      <CustomText className="text-xs text-white" weight="bold">
                        {chat.unreadCount > 9 ? '9+' : chat.unreadCount}
                      </CustomText>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>
      )}
    </View>
  );
}

