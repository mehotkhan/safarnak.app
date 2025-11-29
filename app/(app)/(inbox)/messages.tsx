import { useState } from 'react';
import { View, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import { CustomText } from '@ui/display';
import { useDateTime } from '@hooks/useDateTime';

const createMockChats = (t: any) => [
  {
    id: '2',
    user: {
      id: '2',
      name: t('messages.mockUsers.sarah.name', { defaultValue: 'Sarah Johnson' }),
      username: t('messages.mockUsers.sarah.username', { defaultValue: 'sarah_travels' }),
      avatar: 'https://picsum.photos/seed/sarah-chat/100/100',
      isOnline: true,
    },
    lastMessage: {
      content: t('messages.mockChat1.lastMessage', { defaultValue: 'Hey! How was your trip to Tokyo?' }),
      timestamp: '2025-11-20T10:30:00Z',
      isOwn: false,
    },
    unreadCount: 2,
    archived: false,
  },
  {
    id: '3',
    user: {
      id: '3',
      name: t('messages.mockUsers.mike.name', { defaultValue: 'Mike Chen' }),
      username: t('messages.mockUsers.mike.username', { defaultValue: 'mike_explorer' }),
      avatar: 'https://picsum.photos/seed/mike-chat/100/100',
      isOnline: false,
    },
    lastMessage: {
      content: t('messages.mockChat2.lastMessage', { defaultValue: 'Great photos from your mountain trip!' }),
      timestamp: '2025-11-20T09:15:00Z',
      isOwn: true,
    },
    unreadCount: 0,
    archived: false,
  },
];

export default function DirectMessagesScreen() {
  const { t } = useTranslation();
  const { formatRelativeTime } = useDateTime();
  const router = useRouter();

  const [chats] = useState(() => createMockChats(t));

  return (
    <View className="flex-1 bg-white dark:bg-black">
      <ScrollView className="flex-1" contentContainerStyle={{ paddingVertical: 8 }}>
        {chats.map(chat => (
          <TouchableOpacity
            key={chat.id}
            className="px-4 py-3 flex-row items-center border-b border-gray-200 dark:border-neutral-800"
            activeOpacity={0.7}
            onPress={() => router.push(`/(app)/(inbox)/messages/${chat.user.id}` as any)}
          >
            <View className="w-12 h-12 rounded-full overflow-hidden mr-3 bg-gray-200 dark:bg-neutral-800">
              <Image
                source={{ uri: chat.user.avatar }}
                className="w-full h-full"
                resizeMode="cover"
              />
            </View>
            <View className="flex-1">
              <View className="flex-row items-center justify-between mb-1">
                <CustomText weight="bold" className="text-base text-black dark:text-white" numberOfLines={1}>
                  {chat.user.name}
                </CustomText>
                <CustomText className="text-xs text-gray-500 dark:text-gray-400">
                  {formatRelativeTime(chat.lastMessage.timestamp)}
                </CustomText>
              </View>
              <CustomText
                className="text-sm text-gray-600 dark:text-gray-400"
                numberOfLines={1}
              >
                {chat.lastMessage.content}
              </CustomText>
            </View>
            {chat.unreadCount > 0 && (
              <View className="ml-2 px-2 py-1 rounded-full bg-primary">
                <CustomText className="text-xs text-white" weight="bold">
                  {chat.unreadCount > 9 ? '9+' : chat.unreadCount}
                </CustomText>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}


