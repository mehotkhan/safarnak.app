import React, { useState, useCallback, useMemo } from 'react';
import {
  ActivityIndicator,
  View,
  TouchableOpacity,
  Image,
  FlatList,
  RefreshControl,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { TabBar } from '@ui/layout';
import { CustomText } from '@ui/display';
import { useTheme } from '@ui/context';
import Colors from '@constants/Colors';
import { useDateTime } from '@hooks/useDateTime';
import { useMyConversations } from '@hooks/useConversations';
import { useAppSelector } from '@state/hooks';
import { useGetAlertsQuery } from '@api';

type InboxTab = 'activity' | 'messages';

export default function InboxScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { isDark } = useTheme();
  const { formatRelativeTime } = useDateTime();
  const auth = useAppSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState<InboxTab>('activity');
  const [activityRefreshing, setActivityRefreshing] = useState(false);

  const {
    data: alertsData,
    loading: alertsLoading,
    refetch: refetchAlerts,
  } = useGetAlertsQuery({
    fetchPolicy: 'cache-and-network',
  });
  const {
    conversations,
    loading: conversationsLoading,
    refreshing: conversationsRefreshing,
    refetch: refetchConversations,
  } = useMyConversations();

  const alerts = alertsData?.getAlerts ?? [];

  const handleActivityRefresh = useCallback(async () => {
    setActivityRefreshing(true);
    try {
      await refetchAlerts();
    } finally {
      setActivityRefreshing(false);
    }
  }, [refetchAlerts]);

  const getNotificationIcon = (type: string) => {
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

  const getNotificationColor = (type: string) => {
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

  const handleNotificationPress = useCallback(
    (notificationId: string) => {
      router.push(`/(app)/(inbox)/${notificationId}` as any);
    },
    [router],
  );

  const handleConversationPress = useCallback(
    (conversationId: string) => {
      router.push(`/(app)/(inbox)/messages/${conversationId}` as any);
    },
    [router],
  );

  const getConversationTitle = useCallback(
    (conversation: ReturnType<typeof useMyConversations>['conversations'][number]) => {
      if (conversation.title) return conversation.title;
      const otherMember =
        conversation.members.find((member) => member.id !== auth.user?.id) ?? conversation.members[0];
      return otherMember?.name || otherMember?.username || t('messages.untitledConversation');
    },
    [auth.user?.id, t],
  );

  const renderConversationItem = useCallback(
    ({ item }: { item: ReturnType<typeof useMyConversations>['conversations'][number] }) => (
      <TouchableOpacity
        onPress={() => handleConversationPress(item.id)}
        className="flex-row items-center px-4 py-3 border-b border-gray-200 dark:border-neutral-800"
        activeOpacity={0.7}
      >
        <View className="relative mr-3">
          <View className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 dark:bg-neutral-800">
            {item.members[0]?.avatar ? (
              <Image source={{ uri: item.members[0].avatar || undefined }} className="w-full h-full" resizeMode="cover" />
            ) : (
              <View className="w-full h-full items-center justify-center">
                <Ionicons name="person" size={24} color={isDark ? '#9ca3af' : '#6b7280'} />
              </View>
            )}
          </View>
        </View>
        <View className="flex-1">
          <View className="flex-row items-center justify-between mb-1">
            <CustomText weight="bold" className="text-base text-black dark:text-white" numberOfLines={1}>
              {getConversationTitle(item)}
            </CustomText>
            {item.lastMessageAt ? (
              <CustomText className="text-xs text-gray-500 dark:text-gray-400">
                {formatRelativeTime(item.lastMessageAt)}
              </CustomText>
            ) : null}
          </View>
          <CustomText className="text-sm text-gray-600 dark:text-gray-400" numberOfLines={1}>
            {item.lastMessagePreview || t('messages.noMessagesYet')}
          </CustomText>
        </View>
      </TouchableOpacity>
    ),
    [formatRelativeTime, getConversationTitle, handleConversationPress, isDark, t],
  );

  // Render Activity (Notifications)
  const sortedAlerts = useMemo(
    () =>
      alerts.slice().sort((a, b) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }),
    [alerts],
  );

  const renderActivity = () => {
    if (alertsLoading && sortedAlerts.length === 0) {
      return (
        <View className="flex-1 items-center justify-center py-20">
          <ActivityIndicator size="large" color={isDark ? Colors.dark.primary : Colors.light.primary} />
        </View>
      );
    }

    if (sortedAlerts.length === 0) {
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
        data={sortedAlerts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => handleNotificationPress(item.id)}
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
                {formatRelativeTime(item.createdAt)}
              </CustomText>
                </View>
              </TouchableOpacity>
        )}
        refreshControl={
          <RefreshControl refreshing={activityRefreshing} onRefresh={handleActivityRefresh} />
        }
      />
    );
  };

  // Render Messages (Conversations)
  const renderMessages = () => {
    if (conversationsLoading && conversations.length === 0) {
      return (
        <View className="flex-1 items-center justify-center py-20">
          <ActivityIndicator size="large" color={isDark ? Colors.dark.primary : Colors.light.primary} />
        </View>
      );
    }

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
        renderItem={renderConversationItem}
        refreshControl={
          <RefreshControl
            refreshing={conversationsRefreshing || conversationsLoading}
            onRefresh={refetchConversations}
          />
        }
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
