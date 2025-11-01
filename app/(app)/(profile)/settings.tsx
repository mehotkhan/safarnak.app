import {
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  Switch,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { CustomText } from '@components/ui/CustomText';
import { LanguageSwitcher } from '@components/context/LanguageSwitcher';
import { ThemeToggle } from '@components/ui/ThemeToggle';
import { useTheme } from '@components/context/ThemeContext';
import Colors from '@constants/Colors';
import { useState } from 'react';

interface SettingRowProps {
  icon: any;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  rightComponent?: React.ReactNode;
  isDark: boolean;
}

const SettingRow = ({ icon, title, subtitle, onPress, rightComponent, isDark }: SettingRowProps) => (
  <TouchableOpacity
    onPress={onPress}
    disabled={!onPress}
    className="flex-row items-center py-4 border-b border-gray-200 dark:border-neutral-800"
  >
    <View className="w-10 h-10 rounded-full bg-gray-100 dark:bg-neutral-900 items-center justify-center mr-3">
      <Ionicons name={icon} size={20} color={isDark ? '#9ca3af' : '#6b7280'} />
    </View>
    <View className="flex-1">
      <CustomText weight="medium" className="text-base text-black dark:text-white">
        {title}
      </CustomText>
      {subtitle && (
        <CustomText className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {subtitle}
        </CustomText>
      )}
    </View>
    {rightComponent || (
      onPress && <Ionicons name="chevron-forward" size={20} color={isDark ? '#666' : '#9ca3af'} />
    )}
  </TouchableOpacity>
);

export default function SettingsScreen() {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const [notifications, setNotifications] = useState(true);
  const [locationTracking, setLocationTracking] = useState(false);

  const handleAccountSettings = () => {
    Alert.alert(t('profile.settings'), t('settings.accountComingSoon'));
  };

  const handlePrivacy = () => {
    Alert.alert(t('profile.privacy'), t('settings.privacyComingSoon'));
  };

  const handleDataManagement = () => {
    Alert.alert(t('settings.dataManagement'), t('settings.dataManagementComingSoon'));
  };

  const handleAbout = () => {
    Alert.alert(t('settings.about'), `${t('common.appName')} v0.9.2\n\n${t('settings.aboutDescription')}`);
  };

  return (
    <ScrollView className="flex-1 bg-white dark:bg-black">
      <Stack.Screen options={{ title: t('profile.settings') }} />

      <View className="px-6 py-4">
        <CustomText weight="bold" className="text-sm text-gray-500 dark:text-gray-400 mb-2 uppercase">
          {t('me.preferences')}
        </CustomText>
        <View className="bg-white dark:bg-neutral-900 rounded-2xl px-4">
          <SettingRow
            icon="language-outline"
            title={t('profile.language')}
            subtitle={t('profile.languageSubtitle')}
            rightComponent={<LanguageSwitcher />}
            isDark={isDark}
          />
          <SettingRow
            icon={isDark ? 'moon' : 'sunny'}
            title={t('profile.theme')}
            subtitle={isDark ? t('profile.darkMode') : t('profile.lightMode')}
            rightComponent={<ThemeToggle />}
            isDark={isDark}
          />
          <SettingRow
            icon="notifications-outline"
            title={t('profile.notifications')}
            subtitle={t('settings.receivePush')}
            rightComponent={
              <Switch
                value={notifications}
                onValueChange={setNotifications}
                trackColor={{ false: '#767577', true: (isDark ? Colors.dark.primary : Colors.light.primary) }}
                thumbColor={notifications ? '#fff' : '#f4f3f4'}
              />
            }
            isDark={isDark}
          />
          <SettingRow
            icon="location-outline"
            title={t('settings.locationTracking')}
            subtitle={t('settings.allowLocation')}
            rightComponent={
              <Switch
                value={locationTracking}
                onValueChange={setLocationTracking}
                trackColor={{ false: '#767577', true: (isDark ? Colors.dark.primary : Colors.light.primary) }}
                thumbColor={locationTracking ? '#fff' : '#f4f3f4'}
              />
            }
            isDark={isDark}
          />
        </View>

        <CustomText weight="bold" className="text-sm text-gray-500 dark:text-gray-400 mb-2 mt-6 uppercase">
          {t('settings.account')}
        </CustomText>
        <View className="bg-white dark:bg-neutral-900 rounded-2xl px-4">
          <SettingRow
            icon="person-outline"
            title={t('settings.accountSettings')}
            subtitle={t('settings.manageAccount')}
            onPress={handleAccountSettings}
            isDark={isDark}
          />
          <SettingRow
            icon="shield-outline"
            title={t('profile.privacy')}
            subtitle={t('settings.privacySubtitle')}
            onPress={handlePrivacy}
            isDark={isDark}
          />
          <SettingRow
            icon="server-outline"
            title={t('settings.dataManagement')}
            subtitle={t('settings.downloadDeleteData')}
            onPress={handleDataManagement}
            isDark={isDark}
          />
        </View>

        <CustomText weight="bold" className="text-sm text-gray-500 dark:text-gray-400 mb-2 mt-6 uppercase">
          {t('settings.about')}
        </CustomText>
        <View className="bg-white dark:bg-neutral-900 rounded-2xl px-4 mb-6">
          <SettingRow
            icon="information-circle-outline"
            title={t('settings.aboutApp', { app: t('common.appName') })}
            subtitle={`${t('settings.version')}: 0.9.2`}
            onPress={handleAbout}
            isDark={isDark}
          />
        </View>
      </View>
    </ScrollView>
  );
}

