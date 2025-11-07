import { View, ScrollView, TouchableOpacity } from 'react-native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { CustomText } from '@components/ui/CustomText';
import { useTheme } from '@components/context/ThemeContext';

export default function SettingsLayout() {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const router = useRouter();
  const segments = useSegments();
  
  // Get current tab from segments - last segment is the current page
  const lastSegment = segments[segments.length - 1];
  const selectedTab = lastSegment === 'settings' || !lastSegment || lastSegment === '(profile)' ? 'index' : lastSegment;

  const tabs = [
    { key: 'index', label: t('settings.general', { defaultValue: 'General' }), icon: 'settings-outline', route: '/(app)/(profile)/settings' },
    { key: 'preferences', label: t('settings.preferences', { defaultValue: 'Preferences' }), icon: 'heart-outline', route: '/(app)/(profile)/settings/preferences' },
    { key: 'privacy', label: t('settings.privacy', { defaultValue: 'Privacy' }), icon: 'shield-outline', route: '/(app)/(profile)/settings/privacy' },
    { key: 'notifications', label: t('settings.notifications', { defaultValue: 'Notifications' }), icon: 'notifications-outline', route: '/(app)/(profile)/settings/notifications' },
    { key: 'devices', label: t('settings.devices', { defaultValue: 'Devices' }), icon: 'phone-portrait-outline', route: '/(app)/(profile)/settings/devices' },
  ];

  const handleTabPress = (route: string) => {
    router.push(route as any);
  };

  return (
    <>
      <Stack
        screenOptions={{
          headerShown: true,
          title: t('profile.settings'),
          header: () => (
            <View className="bg-white dark:bg-black border-b border-gray-200 dark:border-neutral-800">
              {/* Compact Tab Bar */}
              <View className="px-4 py-7">
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View className="flex-row gap-2">
                    {tabs.map(tab => (
                      <TouchableOpacity
                        key={tab.key}
                        onPress={() => handleTabPress(tab.route)}
                        className={`flex-row items-center px-3 py-2 rounded-full ${
                          selectedTab === tab.key
                            ? 'bg-primary'
                            : 'bg-gray-100 dark:bg-neutral-900'
                        }`}
                      >
                        <Ionicons
                          name={tab.icon as any}
                          size={16}
                          color={selectedTab === tab.key ? '#fff' : (isDark ? '#9ca3af' : '#6b7280')}
                          style={{ marginRight: 6 }}
                        />
                        <CustomText
                          weight="medium"
                          className={`text-xs ${
                            selectedTab === tab.key
                              ? 'text-white'
                              : 'text-gray-600 dark:text-gray-400'
                          }`}
                        >
                          {tab.label}
                        </CustomText>
                      </TouchableOpacity>
                    ))}
                  </View>
                </ScrollView>
              </View>
            </View>
          ),
        }}
      />
    </>
  );
}
