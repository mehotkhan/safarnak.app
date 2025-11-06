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
            await clearAllUserData();
            dispatch(logout());
            router.replace('/(auth)/login' as any);
          } catch (error) {
            if (__DEV__) {
              console.error('Error during logout:', error);
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
        {/* App Settings */}
        <View className="mb-4">
          <CustomText weight="bold" className="text-sm text-gray-500 dark:text-gray-400 mb-2 uppercase">
            {t('settings.appSettings', { defaultValue: 'App Settings' })}
          </CustomText>
          <View className="bg-white dark:bg-neutral-900 rounded-2xl px-4">
            <SettingRow
              icon="language-outline"
              title={t('profile.language')}
              subtitle={t('profile.languageSubtitle', { defaultValue: 'Change app language' })}
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
          </View>
        </View>

        {/* Data & Info */}
        <View className="mb-4">
          <CustomText weight="bold" className="text-sm text-gray-500 dark:text-gray-400 mb-2 uppercase">
            {t('settings.dataInfo', { defaultValue: 'Data & Info' })}
          </CustomText>
          <View className="bg-white dark:bg-neutral-900 rounded-2xl px-4">
            <SettingRow
              icon="server-outline"
              title={t('settings.dataManagement')}
              subtitle={t('settings.downloadDeleteData', { defaultValue: 'Download or delete your data' })}
              onPress={handleDataManagement}
              isDark={isDark}
            />
            <SettingRow
              icon="information-circle-outline"
              title={t('settings.aboutApp', { app: t('common.appName') })}
              subtitle={`${t('settings.version', { defaultValue: 'Version' })}: ${APP_VERSION}`}
              onPress={handleAbout}
              isDark={isDark}
            />
          </View>
        </View>

        {/* System Status - Network Status */}
        <View className="mb-4">
          <CustomText
            weight="bold"
            className="text-sm text-gray-500 dark:text-gray-400 mb-2 uppercase"
          >
            {t('systemStatus.network', { defaultValue: 'Network Status' })}
          </CustomText>

          <StatusBadge
            label={t('systemStatus.onlineStatus', { defaultValue: 'Online Status' })}
            value={
              isOnline
                ? t('systemStatus.online', { defaultValue: 'Online' })
                : t('systemStatus.offline', { defaultValue: 'Offline' })
            }
            isActive={isOnline}
            icon="cloud"
          />

          <StatusBadge
            label={t('systemStatus.backendStatus', {
              defaultValue: 'Backend Server',
            })}
            value={
              isBackendReachable
                ? t('systemStatus.reachable', { defaultValue: 'Reachable' })
                : t('systemStatus.unreachable', { defaultValue: 'Unreachable' })
            }
            isActive={isBackendReachable}
            icon="server"
          />

          {networkType && (
            <StatusBadge
              label={t('systemStatus.connectionType', {
                defaultValue: 'Connection Type',
              })}
              value={networkType.charAt(0).toUpperCase() + networkType.slice(1)}
              isActive={true}
              icon="wifi"
            />
          )}
        </View>

        {/* Database Storage */}
        <View className="mb-4">
          <CustomText
            weight="bold"
            className="text-sm text-gray-500 dark:text-gray-400 mb-2 uppercase"
          >
            {t('systemStatus.databaseStorage', {
              defaultValue: 'Database Storage',
            })}
          </CustomText>

          <View className="flex-row justify-between gap-3 mb-2">
            <View className="flex-1">
              <StatCard
                title={t('systemStatus.totalStorage', {
                  defaultValue: 'Total Storage',
                })}
                value={stats ? formatBytes(stats.storage.totalSize) : '0 B'}
                subtitle={t('systemStatus.unifiedDatabase', {
                  defaultValue: 'Unified DB',
                })}
                icon="server-outline"
                color={isDark ? Colors.dark.primary : Colors.light.primary}
              />
            </View>
            <View className="flex-1">
              <StatCard
                title={t('systemStatus.totalEntities', {
                  defaultValue: 'Total Entities',
                })}
                value={stats ? stats.totalEntities.toString() : '0'}
                subtitle={t('systemStatus.structuredData', {
                  defaultValue: 'Structured',
                })}
                icon="cube-outline"
                color={isDark ? Colors.dark.primary : Colors.light.primary}
              />
            </View>
          </View>

          {/* Storage Breakdown */}
          <View className="bg-white dark:bg-neutral-900 rounded-xl p-3 border border-gray-200 dark:border-neutral-800">
            <CustomText weight="medium" className="text-sm text-black dark:text-white mb-2">
              {t('systemStatus.storageBreakdown', {
                defaultValue: 'Storage Breakdown',
              })}
            </CustomText>
            <View className="space-y-1.5">
              <View className="flex-row items-center justify-between">
                <CustomText className="text-xs text-gray-600 dark:text-gray-400">
                  {t('systemStatus.apolloCacheStorage', {
                    defaultValue: 'Apollo Cache',
                  })}
                </CustomText>
                <CustomText weight="medium" className="text-xs text-black dark:text-white">
                  {stats ? formatBytes(stats.storage.apolloCacheSize) : '0 B'}
                </CustomText>
              </View>
              <View className="flex-row items-center justify-between">
                <CustomText className="text-xs text-gray-600 dark:text-gray-400">
                  {t('systemStatus.structuredDataStorage', {
                    defaultValue: 'Structured Data',
                  })}
                </CustomText>
                <CustomText weight="medium" className="text-xs text-black dark:text-white">
                  {stats ? formatBytes(stats.storage.structuredDataSize) : '0 B'}
                </CustomText>
              </View>
              {stats && stats.apolloCache.totalEntries > 0 && (
                <View className="flex-row items-center justify-between pt-1 border-t border-gray-200 dark:border-neutral-800">
                  <CustomText className="text-xs text-gray-600 dark:text-gray-400">
                    {t('systemStatus.apolloCache', {
                      defaultValue: 'Cache Entries',
                    })}
                  </CustomText>
                  <CustomText weight="medium" className="text-xs text-black dark:text-white">
                    {stats.apolloCache.totalEntries}
                  </CustomText>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Entity Stats - Compact */}
        {stats && (
          <View className="mb-4">
            <CustomText
              weight="bold"
              className="text-sm text-gray-500 dark:text-gray-400 mb-2 uppercase"
            >
              {t('systemStatus.entityBreakdown', {
                defaultValue: 'Entity Stats',
              })}
            </CustomText>

            <View className="bg-white dark:bg-neutral-900 rounded-xl p-3 border border-gray-200 dark:border-neutral-800">
              {[
                { key: 'trips', label: t('systemStatus.trips', { defaultValue: 'Trips' }), data: stats.entities.trips },
                { key: 'users', label: t('systemStatus.users', { defaultValue: 'Users' }), data: stats.entities.users },
                { key: 'messages', label: t('systemStatus.messages', { defaultValue: 'Messages' }), data: stats.entities.messages },
                { key: 'tours', label: t('systemStatus.tours', { defaultValue: 'Tours' }), data: stats.entities.tours },
                { key: 'places', label: t('systemStatus.places', { defaultValue: 'Places' }), data: stats.entities.places },
              ].map((entity, index, arr) => (
                <View
                  key={entity.key}
                  className={`flex-row items-center justify-between py-2 ${
                    index < arr.length - 1 ? 'border-b border-gray-200 dark:border-neutral-800' : ''
                  }`}
                >
                  <CustomText className="text-sm text-gray-700 dark:text-gray-300">
                    {entity.label}
                  </CustomText>
                  <View className="flex-row items-center gap-3">
                    <CustomText weight="bold" className="text-sm text-primary">
                      {entity.data.count}
                    </CustomText>
                    {entity.data.pendingCount > 0 && (
                      <View className="flex-row items-center">
                        <Ionicons name="time-outline" size={12} color="#f59e0b" />
                        <CustomText className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                          {entity.data.pendingCount}
                        </CustomText>
                      </View>
                    )}
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Info */}
        <View className="mb-4">
          <View className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-3 border border-blue-200 dark:border-blue-800">
            <View className="flex-row items-start">
              <Ionicons
                name="information-circle"
                size={20}
                color={isDark ? '#60a5fa' : '#3b82f6'}
                style={{ marginRight: 10, marginTop: 1 }}
              />
              <View className="flex-1">
                  <CustomText
                    weight="medium"
                    className="text-sm text-blue-900 dark:text-blue-200 mb-1"
                  >
                  {t('systemStatus.infoTitle', {
                    defaultValue: 'About This Database',
                  })}
                </CustomText>
                <CustomText className="text-xs text-blue-800 dark:text-blue-300 leading-4">
                  {t('systemStatus.infoDescription', {
                    defaultValue:
                      'Your data is stored in a unified Drizzle SQLite database. Data persists offline and syncs when connection is restored.',
                  })}
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
              <Ionicons
                name="log-out-outline"
                size={20}
                color="#fff"
                style={{ marginRight: 8 }}
              />
            )}
          />
        </View>

        <View className="h-4" />
      </View>
    </ScrollView>
  );
}
