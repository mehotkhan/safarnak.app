import { View } from 'react-native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { CustomText } from '@ui/display';
import { ShareableTabs } from '@ui/layout/ShareableTabs';

export default function SettingsLayout() {
  const { t } = useTranslation();
  const router = useRouter();
  const segments = useSegments();
  
  // Get current tab from segments - last segment is the current page
  const lastSegment = segments[segments.length - 1];
  const selectedTab = lastSegment === 'settings' || !lastSegment || lastSegment === '(profile)' ? 'index' : lastSegment;

  const tabs = [
    { key: 'index', label: 'General', translationKey: 'settings.general', route: '/(app)/(profile)/settings' },
    { key: 'preferences', label: 'Preferences', translationKey: 'settings.preferences', route: '/(app)/(profile)/settings/preferences' },
    { key: 'privacy', label: 'Privacy', translationKey: 'settings.privacy', route: '/(app)/(profile)/settings/privacy' },
    { key: 'notifications', label: 'Notifications', translationKey: 'settings.notifications', route: '/(app)/(profile)/settings/notifications' },
  ];

  const handleTabPress = (tabId: string) => {
    const tab = tabs.find(t => t.key === tabId);
    if (tab) {
      router.push(tab.route as any);
    }
  };

  return (
    <>
      <Stack
        screenOptions={{
          headerShown: true,
          title: t('profile.settings'),
          header: () => (
            <View className="bg-white dark:bg-black border-b border-gray-200 dark:border-neutral-800">
              {/* Page Header */}
              <View className="px-4 pt-12 pb-3">
                <CustomText weight="bold" className="text-2xl text-black dark:text-white">
                  {t('profile.settings')}
                </CustomText>
              </View>
              {/* Tab Bar */}
              <ShareableTabs
                tabs={tabs.map(tab => ({
                  id: tab.key,
                  label: tab.label,
                  translationKey: tab.translationKey,
                }))}
                activeTab={selectedTab}
                onTabChange={handleTabPress}
              />
            </View>
          ),
        }}
      />
    </>
  );
}
