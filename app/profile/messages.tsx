import { useState } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { CustomText } from '@components/ui/CustomText';
import { useTheme } from '@components/context/ThemeContext';

// Mock data
const mockNotifications = [
  {
    id: '1',
    type: 'trip',
    title: 'Trip Plan Ready',
    message: 'Your Tokyo trip plan has been generated',
    time: '2 hours ago',
    read: false,
  },
  {
    id: '2',
    type: 'tour',
    title: 'New Tour Available',
    message: 'Cherry Blossom Tour is now available for booking',
    time: '1 day ago',
    read: false,
  },
  {
    id: '3',
    type: 'message',
    title: 'Message from Support',
    message: 'Your subscription has been upgraded',
    time: '3 days ago',
    read: true,
  },
];

export default function MessagesScreen() {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState<'notifications' | 'chats'>('notifications');

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
                      ? isDark
                        ? '#9ca3af'
                        : '#6b7280'
                      : '#0077be'
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
            {t('me.inbox.emptyState')}
          </CustomText>
        </View>
      )}
    </View>
  );
}

