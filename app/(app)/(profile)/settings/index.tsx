import { useState } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { CustomText } from '@components/ui/CustomText';
import CustomButton from '@components/ui/CustomButton';
import { LanguageSwitcher } from '@components/context/LanguageSwitcher';
import { ThemeToggle } from '@components/ui/ThemeToggle';
import { useTheme } from '@components/context/ThemeContext';
import { useSystemStatus } from '@hooks/useSystemStatus';
import { useDatabaseStats } from '@hooks/useDatabaseStats';
import { useAppDispatch } from '@store/hooks';
import { logout } from '@store/slices/authSlice';
import { clearAllUserData } from '@api';
import { persistor } from '@store';
import Colors from '@constants/Colors';

// Read version from package.json
// eslint-disable-next-line @typescript-eslint/no-require-imports
const packageJson = require('../../../../package.json');
const APP_VERSION = packageJson.version;

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

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

function StatusBadge({
  label,
  value,
  isActive,
  icon,
}: {
  label: string;
  value: string;
  isActive: boolean;
  icon: string;
}) {
  const { isDark } = useTheme();
  
  return (
    <View className="flex-row items-center justify-between p-3 bg-white dark:bg-neutral-900 rounded-xl mb-2 border border-gray-200 dark:border-neutral-800">
      <View className="flex-row items-center flex-1">
        <View
          className="w-9 h-9 rounded-full items-center justify-center mr-3"
          style={{
            backgroundColor: isActive
              ? (isDark ? '#10b98120' : '#10b98120')
              : (isDark ? '#ef444420' : '#ef444420'),
          }}
        >
          <Ionicons
            name={icon as any}
            size={18}
            color={isActive ? '#10b981' : '#ef4444'}
          />
        </View>
        <View className="flex-1">
          <CustomText className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">
            {label}
          </CustomText>
          <CustomText
            weight="medium"
            className="text-sm text-black dark:text-white"
          >
            {value}
          </CustomText>
        </View>
      </View>
      <View
        className="w-2.5 h-2.5 rounded-full"
        style={{ backgroundColor: isActive ? '#10b981' : '#ef4444' }}
      />
    </View>
  );
}

function StatCard({
  title,
  value,
  subtitle,
  icon,
  color,
}: {
  title: string;
  value: string;
  subtitle?: string;
  icon: string;
  color: string;
}) {
  return (
    <View className="bg-white dark:bg-neutral-900 rounded-xl p-3 border border-gray-200 dark:border-neutral-800">
      <View className="flex-row items-center justify-between mb-1.5">
        <CustomText className="text-xs text-gray-500 dark:text-gray-400">
          {title}
        </CustomText>
        <Ionicons name={icon as any} size={16} color={color} />
      </View>
      <CustomText
        weight="bold"
        className="text-xl text-black dark:text-white mb-0.5"
      >
        {value}
      </CustomText>
      {subtitle && (
        <CustomText className="text-xs text-gray-500 dark:text-gray-400">
          {subtitle}
        </CustomText>
      )}
    </View>
  );
}

export default function GeneralSettingsScreen() {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [refreshing, setRefreshing] = useState(false);

  // System Status hooks
  const {
    isOnline,
    isBackendReachable,
    networkType,
    refetch: refetchSystemStatus,
  } = useSystemStatus();
  const { stats, refetch: refetchStats } = useDatabaseStats();

  const handleDataManagement = () => {
    Alert.alert(t('settings.dataManagement'), t('settings.dataManagementComingSoon', { 
      defaultValue: 'Data management feature coming soon!' 
    }));
  };

  const handleAbout = () => {
    Alert.alert(t('settings.about'), `${t('common.appName')} v${APP_VERSION}\n\n${t('settings.aboutDescription', { 
      defaultValue: 'Your offline-first travel companion' 
    })}`);
  };

  const handleLogout = () => {
    Alert.alert(t('profile.logout'), t('profile.logoutConfirm'), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('profile.logout'),
        style: 'destructive',
        onPress: async () => {
          try {
            // Clear all user data (SecureStore, AsyncStorage, caches)
            await clearAllUserData();
            
            // Purge Redux persist to ensure state is completely cleared
            await persistor.purge();
            
            // Dispatch logout action to clear Redux state
            dispatch(logout());
            
            // Navigate to login page
            router.replace('/(auth)/login' as any);
          } catch (error) {
            if (__DEV__) {
              console.error('Error during logout:', error);
            }
            // Even if there's an error, try to clear state and navigate
            try {
              await persistor.purge();
            } catch (purgeError) {
              console.error('Error purging Redux persist:', purgeError);
            }
            dispatch(logout());
            router.replace('/(auth)/login' as any);
          }
        },
      },
    ]);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.all([refetchStats(), refetchSystemStatus()]);
    } catch (error) {
      console.error('Error refreshing stats:', error);
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <ScrollView
      className="flex-1 bg-white dark:bg-black"
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View className="px-4 py-4">
        {/* Removed top hero/profile button as requested */}

        {/* Quick Controls */}
        <View className="mb-4">
          <CustomText weight="bold" className="text-sm text-gray-500 dark:text-gray-400 mb-2 uppercase">
            {t('settings.quickControls', { defaultValue: 'Quick Controls' })}
          </CustomText>
          <View className="bg-white dark:bg-neutral-900 rounded-2xl p-4 border border-gray-200 dark:border-neutral-800">
            <View className="flex-row gap-3">
              <View className="flex-1">
                <View className="rounded-xl px-3 py-3 border border-gray-200 dark:border-neutral-800">
                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center">
                      <View className="w-9 h-9 rounded-full items-center justify-center mr-2" style={{ backgroundColor: isDark ? '#f59e0b20' : '#f59e0b20' }}>
                        <Ionicons name="language-outline" size={18} color={isDark ? '#fbbf24' : '#f59e0b'} />
                      </View>
                    </View>
                    <LanguageSwitcher variant="dropdownMini" />
                  </View>
                </View>
              </View>
              <View className="flex-1">
                <View className="rounded-xl px-3 py-3 border border-gray-200 dark:border-neutral-800">
                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center">
                      <View className="w-9 h-9 rounded-full items-center justify-center mr-2" style={{ backgroundColor: isDark ? '#10b98120' : '#10b98120' }}>
                        <Ionicons name={isDark ? 'moon' : 'sunny'} size={18} color={isDark ? '#10b981' : '#f59e0b'} />
                      </View>
                      <CustomText weight="medium" className="text-sm text-black dark:text-white">
                        {t('profile.theme')}
                      </CustomText>
                    </View>
                    <ThemeToggle showLabel={false} />
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Connectivity */}
        <View className="mb-4">
          <CustomText weight="bold" className="text-sm text-gray-500 dark:text-gray-400 mb-2 uppercase">
            {t('systemStatus.network')}
          </CustomText>
          <View className="bg-white dark:bg-neutral-900 rounded-2xl p-4 border border-gray-200 dark:border-neutral-800">
            <View className="flex-row gap-2 flex-wrap">
              <View className="px-3 py-2 rounded-full flex-row items-center" style={{ backgroundColor: isOnline ? (isDark ? '#10b98120' : '#10b98120') : (isDark ? '#ef444420' : '#ef444420') }}>
                <Ionicons name="cloud" size={14} color={isOnline ? '#10b981' : '#ef4444'} />
                <CustomText weight="medium" className="text-xs ml-1.5" style={{ color: isOnline ? '#10b981' : (isDark ? '#fecaca' : '#991b1b') }}>
                  {isOnline ? t('systemStatus.online') : t('systemStatus.offline')}
                </CustomText>
              </View>
              <View className="px-3 py-2 rounded-full flex-row items-center" style={{ backgroundColor: isBackendReachable ? (isDark ? '#10b98120' : '#10b98120') : (isDark ? '#ef444420' : '#ef444420') }}>
                <Ionicons name="server" size={14} color={isBackendReachable ? '#10b981' : '#ef4444'} />
                <CustomText weight="medium" className="text-xs ml-1.5" style={{ color: isBackendReachable ? '#10b981' : (isDark ? '#fecaca' : '#991b1b') }}>
                  {isBackendReachable ? t('systemStatus.reachable') : t('systemStatus.unreachable')}
                </CustomText>
              </View>
              {networkType && (
                <View className="px-3 py-2 rounded-full flex-row items-center" style={{ backgroundColor: isDark ? '#60a5fa20' : '#60a5fa20' }}>
                  <Ionicons name="wifi" size={14} color={isDark ? '#93c5fd' : '#3b82f6'} />
                  <CustomText weight="medium" className="text-xs ml-1.5" style={{ color: isDark ? '#93c5fd' : '#3b82f6' }}>
                    {t('systemStatus.connection')}: {networkType.charAt(0).toUpperCase() + networkType.slice(1)}
                  </CustomText>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Storage & Data */}
        <View className="mb-4">
          <CustomText weight="bold" className="text-sm text-gray-500 dark:text-gray-400 mb-2 uppercase">
            {t('systemStatus.databaseStorage')}
          </CustomText>
          <View className="bg-white dark:bg-neutral-900 rounded-2xl p-4 border border-gray-200 dark:border-neutral-800">
            <View className="flex-row gap-3 mb-3">
              <View className="flex-1">
                <StatCard
                  title={t('systemStatus.totalStorage')}
                  value={stats ? formatBytes(stats.storage.totalSize) : '0 B'}
                  subtitle={t('systemStatus.unifiedDatabase')}
                  icon="server-outline"
                  color={isDark ? Colors.dark.primary : Colors.light.primary}
                />
              </View>
              <View className="flex-1">
                <StatCard
                  title={t('systemStatus.totalEntities')}
                  value={stats ? stats.totalEntities.toString() : '0'}
                  subtitle={t('systemStatus.structuredData')}
                  icon="cube-outline"
                  color={isDark ? Colors.dark.primary : Colors.light.primary}
                />
              </View>
            </View>
            <View className="flex-row gap-3 mb-3">
              <View className="flex-1">
                <StatCard
                  title={t('systemStatus.apolloCache')}
                  value={stats ? String(stats.apolloCache.totalEntries) : '0'}
                  subtitle={t('systemStatus.apolloCacheStorage')}
                  icon="layers-outline"
                  color={isDark ? Colors.dark.primary : Colors.light.primary}
                />
              </View>
            </View>

            <View className="bg-white dark:bg-neutral-900 rounded-xl p-3 border border-gray-200 dark:border-neutral-800">
              <CustomText weight="medium" className="text-sm text-black dark:text-white mb-2">
                {t('systemStatus.storageBreakdown')}
              </CustomText>
              <View className="space-y-1.5">
                <View className="flex-row items-center justify-between">
                  <CustomText className="text-xs text-gray-600 dark:text-gray-400">
                    {t('systemStatus.apolloCacheStorage')}
                  </CustomText>
                  <CustomText weight="medium" className="text-xs text-black dark:text-white">
                    {stats ? formatBytes(stats.storage.apolloCacheSize) : '0 B'}
                  </CustomText>
                </View>
                <View className="flex-row items-center justify-between">
                  <CustomText className="text-xs text-gray-600 dark:text-gray-400">
                    {t('systemStatus.structuredDataStorage')}
                  </CustomText>
                  <CustomText weight="medium" className="text-xs text-black dark:text-white">
                    {stats ? formatBytes(stats.storage.structuredDataSize) : '0 B'}
                  </CustomText>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Navigation & Info */}
        <View className="mb-4">
          <CustomText weight="bold" className="text-sm text-gray-500 dark:text-gray-400 mb-2 uppercase">
            {t('settings.appSettings', { defaultValue: 'App Settings' })}
          </CustomText>
          <View className="bg-white dark:bg-neutral-900 rounded-2xl px-4 border border-gray-200 dark:border-neutral-800">
            <SettingRow
              icon="options-outline"
              title={t('settings.preferences', { defaultValue: 'Preferences' })}
              subtitle={t('profile.preferencesSubtitle')}
              onPress={() => router.push('/(app)/(profile)/settings/preferences' as any)}
              isDark={isDark}
            />
            <SettingRow
              icon="shield-outline"
              title={t('settings.privacy', { defaultValue: 'Privacy' })}
              subtitle={t('settings.privacySubtitle', { defaultValue: 'Permissions and data usage' })}
              onPress={() => router.push('/(app)/(profile)/settings/privacy' as any)}
              isDark={isDark}
            />
            <SettingRow
              icon="notifications-outline"
              title={t('settings.notifications', { defaultValue: 'Notifications' })}
              subtitle={t('profile.notificationsSubtitle')}
              onPress={() => router.push('/(app)/(profile)/settings/notifications' as any)}
              isDark={isDark}
            />
            <SettingRow
              icon="server-outline"
              title={t('settings.dataManagement', { defaultValue: 'Data Management' })}
              subtitle={t('settings.downloadDeleteData', { defaultValue: 'Download or delete your data' })}
              onPress={handleDataManagement}
              isDark={isDark}
            />
            <SettingRow
              icon="information-circle-outline"
              title={t('settings.about', { defaultValue: 'About' })}
              subtitle={`${t('settings.version', { defaultValue: 'Version' })}: ${APP_VERSION}`}
              onPress={handleAbout}
              isDark={isDark}
            />
          </View>
        </View>

        {/* Info Banner */}
        <View className="mb-4">
          <View className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-3 border border-blue-200 dark:border-blue-800">
            <View className="flex-row items-start">
              <Ionicons name="information-circle" size={20} color={isDark ? '#60a5fa' : '#3b82f6'} style={{ marginRight: 10, marginTop: 1 }} />
              <View className="flex-1">
                <CustomText weight="medium" className="text-sm text-blue-900 dark:text-blue-200 mb-1">
                  {t('systemStatus.infoTitle')}
                </CustomText>
                <CustomText className="text-xs text-blue-800 dark:text-blue-300 leading-4">
                  {t('systemStatus.infoDescription')}
                </CustomText>
              </View>
            </View>
          </View>
        </View>

        {/* Logout */}
        <View className="mb-4">
          <CustomButton
            title={t('profile.logout')}
            onPress={handleLogout}
            bgVariant="danger"
            IconLeft={() => (
              <Ionicons name="log-out-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
            )}
          />
        </View>

        <View className="h-4" />
      </View>
    </ScrollView>
  );
}
