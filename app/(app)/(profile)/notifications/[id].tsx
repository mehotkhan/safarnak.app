import { useState } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { useDateTime } from '@utils/datetime';
import { Ionicons } from '@expo/vector-icons';
import { CustomText } from '@components/ui/CustomText';
import CustomButton from '@components/ui/CustomButton';
import { useTheme } from '@components/context/ThemeContext';
import Colors from '@constants/Colors';

// Mock notification data
const mockNotifications: any = {
  '1': {
    id: '1',
    type: 'trip',
    title: 'Trip Plan Ready',
    message: 'Your Tokyo trip plan has been generated and is ready for review.',
    longMessage: 'We\'ve successfully generated your personalized itinerary for Tokyo! The plan includes 7 days of activities, accommodation recommendations, and estimated costs. Check it out now and start preparing for your adventure.',
    time: '2025-11-20T10:30:00Z',
    read: false,
    actionUrl: '/(app)/(trips)/1',
    actionLabel: 'View Trip',
  },
  '2': {
    id: '2',
    type: 'tour',
    title: 'New Tour Available',
    message: 'Cherry Blossom Tour is now available for booking in your preferred location.',
    longMessage: 'Great news! We\'ve just added a new Cherry Blossom Tour to Tokyo that matches your travel preferences. This 7-day tour includes guided visits to the most beautiful cherry blossom viewing spots, traditional tea ceremonies, and authentic Japanese cuisine. Book now to secure your spot for spring 2025!',
    time: '2025-11-19T15:00:00Z',
    read: false,
    actionUrl: '/(app)/(explore)/tours/1',
    actionLabel: 'View Tour',
  },
  '3': {
    id: '3',
    type: 'message',
    title: 'Message from Support',
    message: 'Your subscription has been successfully upgraded to Pro plan.',
    longMessage: 'Thank you for upgrading to our Pro plan! You now have access to:\n\n• Advanced AI trip planning\n• Unlimited trip generations\n• Priority customer support\n• Offline maps\n• Custom itinerary templates\n\nEnjoy your enhanced Safarnak experience!',
    time: '2025-11-18T09:00:00Z',
    read: true,
    actionUrl: '/(app)/(profile)/subscription',
    actionLabel: 'View Subscription',
  },
};

export default function NotificationDetailScreen() {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { formatRelativeTime } = useDateTime();
  const notificationId = Array.isArray(id) ? id[0] : id;
  const [notification] = useState(mockNotifications[notificationId] || mockNotifications['1']);

  const getIconName = (type: string) => {
    switch (type) {
      case 'trip':
        return 'airplane';
      case 'tour':
        return 'map';
      case 'message':
        return 'mail';
      case 'payment':
        return 'card';
      default:
        return 'notifications';
    }
  };

  const getIconColor = () => {
    return isDark ? Colors.dark.primary : Colors.light.primary;
  };


  const handleAction = () => {
    if (notification.actionUrl) {
      router.push(notification.actionUrl as any);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      t('notifications.deleteTitle'),
      t('notifications.deleteMessage'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.delete'),
          style: 'destructive',
          onPress: () => {
            router.back();
          },
        },
      ]
    );
  };

  return (
    <ScrollView className="flex-1 bg-white dark:bg-black">
      <Stack.Screen
        options={{
          title: t('notifications.details'),
          headerShown: true,
          headerRight: () => (
            <TouchableOpacity onPress={handleDelete} className="p-2">
              <Ionicons name="trash-outline" size={22} color="#ef4444" />
            </TouchableOpacity>
          ),
        }}
      />

      <View className="px-6 py-6">
        {/* Icon and Title */}
        <View className="items-center mb-6">
          <View
            className="w-20 h-20 rounded-full items-center justify-center mb-4"
            style={{ backgroundColor: getIconColor() + '20' }}
          >
            <Ionicons
              name={getIconName(notification.type) as any}
              size={40}
              color={getIconColor()}
            />
          </View>
          <CustomText
            weight="bold"
            className="text-2xl text-black dark:text-white text-center mb-2"
          >
            {notification.title}
          </CustomText>
          <CustomText className="text-sm text-gray-500 dark:text-gray-400">
            {formatRelativeTime(notification.time)}
          </CustomText>
        </View>

        {/* Message */}
        <View className="bg-gray-50 dark:bg-neutral-900 rounded-2xl p-6 mb-6">
          <CustomText className="text-base text-gray-700 dark:text-gray-300 leading-6">
            {notification.longMessage}
          </CustomText>
        </View>

        {/* Action Button */}
        {notification.actionUrl && notification.actionLabel && (
          <View className="mb-4">
            <CustomButton
              title={notification.actionLabel}
              onPress={handleAction}
              IconLeft={() => (
                <Ionicons
                  name="arrow-forward"
                  size={20}
                  color="#fff"
                  style={{ marginRight: 8 }}
                />
              )}
            />
          </View>
        )}

        {/* Mark as Read */}
        {!notification.read && (
          <View className="mb-4">
            <CustomButton
              title={t('notifications.markAsRead')}
              onPress={() => {
                Alert.alert(t('common.success'), t('notifications.markedAsRead'));
              }}
              bgVariant="secondary"
              IconLeft={() => (
                <Ionicons
                  name="checkmark"
                  size={20}
                  color={isDark ? '#fff' : '#000'}
                  style={{ marginRight: 8 }}
                />
              )}
            />
          </View>
        )}

        {/* Delete Button */}
        <CustomButton
          title={t('notifications.deleteNotification')}
          onPress={handleDelete}
          bgVariant="danger"
          IconLeft={() => (
            <Ionicons
              name="trash-outline"
              size={20}
              color="#fff"
              style={{ marginRight: 8 }}
            />
          )}
        />
      </View>
    </ScrollView>
  );
}

