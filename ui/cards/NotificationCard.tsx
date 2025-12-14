import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { CustomText } from '@ui/display';
import { useTheme } from '@ui/context';
import { useDateTime } from '@hooks/useDateTime';
import Colors from '@constants/Colors';

export type NotificationType = 'social' | 'trip' | 'place' | 'post' | 'system';

export interface NotificationCardProps {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: Date | string;
  read: boolean;
  onPress?: () => void;
  onMarkRead?: () => void;
  actionData?: any;
}

/**
 * NotificationCard Component
 * 
 * Displays a notification card with icon, title, message, and timestamp.
 * Supports different notification types: social, trip, place, post, system.
 * Uses polymorphic target (targetType/targetId) for navigation.
 * 
 * @example
 * <NotificationCard
 *   id="1"
 *   type="social"
 *   title="New comment"
 *   message="Someone commented on your post"
 *   timestamp={new Date()}
 *   read={false}
 *   onPress={() => router.push('/post/123')}
 * />
 */
export const NotificationCard = React.memo<NotificationCardProps>(({
  type,
  title,
  message,
  timestamp,
  read,
  onPress,
  onMarkRead,
}) => {
  const { isDark } = useTheme();
  const { t } = useTranslation();
  const { formatRelativeTime } = useDateTime();

  const getIcon = (): keyof typeof Ionicons.glyphMap => {
    switch (type) {
      case 'social':
        return 'people';
      case 'trip':
        return 'airplane';
      case 'place':
        return 'location';
      case 'post':
        return 'document-text';
      case 'system':
        return 'settings';
      default:
        return 'notifications';
    }
  };

  const getColor = (): string => {
    switch (type) {
      case 'social':
        return '#3b82f6';
      case 'trip':
        return '#10b981';
      case 'place':
        return '#f59e0b';
      case 'post':
        return '#8b5cf6';
      case 'system':
        return '#6366f1';
      default:
        return isDark ? Colors.dark.primary : Colors.light.primary;
    }
  };

  const icon = getIcon();
  const color = getColor();
  const timestampStr = typeof timestamp === 'string' ? timestamp : timestamp.toISOString();

  return (
    <TouchableOpacity
      onPress={onPress}
      className="flex-row items-start border-b border-gray-200 p-4 dark:border-neutral-800"
      style={{
        backgroundColor: read
          ? 'transparent'
          : isDark ? '#1f2937' : '#eff6ff',
      }}
      activeOpacity={0.7}
    >
      {/* Icon */}
      <View
        className="mr-3 size-12 items-center justify-center rounded-full"
        style={{
          backgroundColor: isDark ? '#374151' : '#f3f4f6',
        }}
      >
        <Ionicons
          name={icon}
          size={24}
          color={color}
        />
      </View>

      {/* Content */}
      <View className="flex-1">
        <View className="mb-1 flex-row items-center justify-between">
          <CustomText
            weight="bold"
            className="flex-1 text-base text-black dark:text-white"
            numberOfLines={1}
          >
            {title}
          </CustomText>
          {!read && (
            <View
              className="ml-2 size-2 rounded-full"
              style={{ backgroundColor: isDark ? Colors.dark.primary : Colors.light.primary }}
            />
          )}
        </View>
        <CustomText
          className="mt-1 text-sm text-gray-600 dark:text-gray-400"
          numberOfLines={2}
        >
          {message}
        </CustomText>
        <View className="mt-2 flex-row items-center justify-between">
          <CustomText className="text-xs text-gray-500 dark:text-gray-500">
            {formatRelativeTime(timestampStr)}
          </CustomText>
          {onMarkRead && !read && (
            <TouchableOpacity
              onPress={(e) => {
                e.stopPropagation();
                onMarkRead();
              }}
              className="px-2 py-1"
            >
              <CustomText className="text-xs text-primary" weight="medium">
                {t('inbox.markRead') || 'Mark read'}
              </CustomText>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
});

NotificationCard.displayName = 'NotificationCard';

