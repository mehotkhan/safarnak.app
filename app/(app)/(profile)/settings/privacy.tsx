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

export default function PrivacyScreen() {
  const { t } = useTranslation();
  const { isDark } = useTheme();

  const [profileVisibility, setProfileVisibility] = useState(true);
  const [activityStatus, setActivityStatus] = useState(true);
  const [dataSharing, setDataSharing] = useState(false);
  const [analytics, setAnalytics] = useState(true);
  const [locationTracking, setLocationTracking] = useState(false);

  return (
    <ScrollView className="flex-1 bg-white dark:bg-black">
      <View className="px-4 py-4">
        <View className="mb-4">
          <View className="bg-white dark:bg-neutral-900 rounded-2xl px-4">
            <ToggleRow
              icon="eye-outline"
              title={t('profile.privacy.publicProfile', { defaultValue: 'Public Profile' })}
              subtitle={t('profile.privacy.publicProfileSubtitle', { 
                defaultValue: 'Allow others to view your profile' 
              })}
              value={profileVisibility}
              onValueChange={setProfileVisibility}
              isDark={isDark}
            />
            <ToggleRow
              icon="radio-button-on-outline"
              title={t('profile.privacy.showActivity', { defaultValue: 'Show Activity Status' })}
              subtitle={t('profile.privacy.showActivitySubtitle', { 
                defaultValue: 'Show when you are online' 
              })}
              value={activityStatus}
              onValueChange={setActivityStatus}
              isDark={isDark}
            />
            <ToggleRow
              icon="location-outline"
              title={t('profile.privacy.locationTracking', { defaultValue: 'Location Tracking' })}
              subtitle={t('profile.privacy.locationTrackingSubtitle', { 
                defaultValue: 'Allow location access for better trip recommendations' 
              })}
              value={locationTracking}
              onValueChange={setLocationTracking}
              isDark={isDark}
            />
            <ToggleRow
              icon="share-outline"
              title={t('profile.privacy.dataSharing', { defaultValue: 'Data Sharing' })}
              subtitle={t('profile.privacy.dataSharingSubtitle', { 
                defaultValue: 'Share anonymized data to improve our services' 
              })}
              value={dataSharing}
              onValueChange={setDataSharing}
              isDark={isDark}
            />
            <ToggleRow
              icon="analytics-outline"
              title={t('profile.privacy.analytics', { defaultValue: 'Analytics' })}
              subtitle={t('profile.privacy.analyticsSubtitle', { 
                defaultValue: 'Help us improve by sharing usage analytics' 
              })}
              value={analytics}
              onValueChange={setAnalytics}
              isDark={isDark}
            />
          </View>
        </View>

        <View className="h-4" />
      </View>
    </ScrollView>
  );
}

