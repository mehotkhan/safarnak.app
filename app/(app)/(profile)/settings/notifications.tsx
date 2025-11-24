import { useState } from 'react';
import { View, ScrollView, Switch } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { CustomText } from '@ui/display';
import { useTheme } from '@ui/context';
import Colors from '@constants/Colors';

interface ToggleRowProps {
  icon: any;
  title: string;
  subtitle: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  isDark: boolean;
}

const ToggleRow = ({ 
  icon, 
  title, 
  subtitle, 
  value, 
  onValueChange, 
  isDark,
}: ToggleRowProps) => {
  const color = isDark ? Colors.dark.primary : Colors.light.primary;
  
  return (
    <View className="flex-row items-center py-4 border-b border-gray-200 dark:border-neutral-800">
      <View
        className="w-10 h-10 rounded-full items-center justify-center mr-3"
        style={{ backgroundColor: color + '20' }}
      >
        <Ionicons name={icon} size={20} color={color} />
      </View>
      <View className="flex-1">
        <CustomText weight="medium" className="text-base text-black dark:text-white">
          {title}
        </CustomText>
        <CustomText className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {subtitle}
        </CustomText>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: '#767577', true: color }}
        thumbColor={value ? '#fff' : '#f4f3f4'}
      />
    </View>
  );
};

export default function NotificationsScreen() {
  const { t } = useTranslation();
  const { isDark } = useTheme();

  const [pushNotifications, setPushNotifications] = useState(true);
  const [tripUpdates, setTripUpdates] = useState(true);
  const [tourBookings, setTourBookings] = useState(true);
  const [messages, setMessages] = useState(true);
  const [promotional, setPromotional] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(false);

  return (
    <ScrollView className="flex-1 bg-white dark:bg-black">
      <View className="px-4 py-4">
        <View className="mb-4">
          <CustomText
            weight="bold"
            className="text-sm text-gray-500 dark:text-gray-400 mb-2 uppercase"
          >
            {t('settings.notifications', { defaultValue: 'Notifications' })}
          </CustomText>
          <View className="bg-white dark:bg-neutral-900 rounded-2xl px-4">
            <ToggleRow
              icon="notifications-outline"
              title={t('profile.notifications.enablePush', { defaultValue: 'Enable Push Notifications' })}
              subtitle={t('profile.notifications.enablePushSubtitle', { 
                defaultValue: 'Receive notifications on your device' 
              })}
              value={pushNotifications}
              onValueChange={setPushNotifications}
              isDark={isDark}
            />
            <ToggleRow
              icon="airplane-outline"
              title={t('profile.notifications.tripUpdates', { defaultValue: 'Trip Updates' })}
              subtitle={t('profile.notifications.tripUpdatesSubtitle', { 
                defaultValue: 'Notifications about your trips' 
              })}
              value={tripUpdates}
              onValueChange={setTripUpdates}
              isDark={isDark}
            />
            <ToggleRow
              icon="map-outline"
              title={t('profile.notifications.tourBookings', { defaultValue: 'Tour Bookings' })}
              subtitle={t('profile.notifications.tourBookingsSubtitle', { 
                defaultValue: 'Notifications about tour bookings' 
              })}
              value={tourBookings}
              onValueChange={setTourBookings}
              isDark={isDark}
            />
            <ToggleRow
              icon="mail-outline"
              title={t('profile.notifications.messages', { defaultValue: 'Messages' })}
              subtitle={t('profile.notifications.messagesSubtitle', { 
                defaultValue: 'Notifications about new messages' 
              })}
              value={messages}
              onValueChange={setMessages}
              isDark={isDark}
            />
            <ToggleRow
              icon="megaphone-outline"
              title={t('profile.notifications.promotional', { defaultValue: 'Promotional' })}
              subtitle={t('profile.notifications.promotionalSubtitle', { 
                defaultValue: 'Special offers and promotions' 
              })}
              value={promotional}
              onValueChange={setPromotional}
              isDark={isDark}
            />
            <ToggleRow
              icon="mail-outline"
              title={t('profile.notifications.enableEmail', { defaultValue: 'Email Notifications' })}
              subtitle={t('profile.notifications.enableEmailSubtitle', { 
                defaultValue: 'Receive notifications via email' 
              })}
              value={emailNotifications}
              onValueChange={setEmailNotifications}
              isDark={isDark}
            />
          </View>
        </View>

        <View className="h-4" />
      </View>
    </ScrollView>
  );
}

