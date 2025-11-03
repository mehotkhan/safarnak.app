import { View, ScrollView, RefreshControl, Alert } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';

import { CustomText } from '@components/ui/CustomText';
import CustomButton from '@components/ui/CustomButton';
import { useTheme } from '@components/context/ThemeContext';
import { useSystemStatus } from '@hooks/useSystemStatus';
import { useDatabaseStats } from '@hooks/useDatabaseStats';
import { useAppDispatch } from '@store/hooks';
import { logout } from '@store/slices/authSlice';
import { clearAllUserData } from '@api';
import Colors from '@constants/Colors';
import { formatTimestamp } from '@database/client';

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
    <View className="flex-row items-center justify-between p-4 bg-white dark:bg-neutral-900 rounded-xl mb-3 border border-gray-200 dark:border-neutral-800">
      <View className="flex-row items-center flex-1">
        <View
          className="w-10 h-10 rounded-full items-center justify-center mr-3"
          style={{
            backgroundColor: isActive
              ? (isDark ? '#10b98120' : '#10b98120')
              : (isDark ? '#ef444420' : '#ef444420'),
          }}
        >
          <Ionicons
            name={icon as any}
            size={20}
            color={isActive ? '#10b981' : '#ef4444'}
          />
        </View>
        <View className="flex-1">
          <CustomText className="text-sm text-gray-500 dark:text-gray-400 mb-1">
            {label}
          </CustomText>
          <CustomText
            weight="bold"
            className="text-base text-black dark:text-white"
          >
            {value}
          </CustomText>
        </View>
      </View>
      <View
        className="w-3 h-3 rounded-full"
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
  const { isDark } = useTheme();

  return (
    <View className="bg-white dark:bg-neutral-900 rounded-xl p-4 border border-gray-200 dark:border-neutral-800">
      <View className="flex-row items-center justify-between mb-2">
        <CustomText className="text-sm text-gray-500 dark:text-gray-400">
          {title}
        </CustomText>
        <Ionicons name={icon as any} size={20} color={color} />
      </View>
      <CustomText
        weight="bold"
        className="text-2xl text-black dark:text-white mb-1"
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

function EntityStatRow({
  label,
  count,
  pending,
  deleted,
  lastSync,
  oldestCached,
  newestCached,
}: {
  label: string;
  count: number;
  pending: number;
  deleted: number;
  lastSync: number | null;
  oldestCached: number | null;
  newestCached: number | null;
}) {
  const { isDark } = useTheme();
  const { t } = useTranslation();

  return (
    <View className="bg-white dark:bg-neutral-900 rounded-xl p-4 mb-3 border border-gray-200 dark:border-neutral-800">
      <View className="flex-row items-center justify-between mb-3">
        <CustomText weight="bold" className="text-base text-black dark:text-white">
          {label}
        </CustomText>
        <View className="flex-row items-center">
          <View className="bg-primary/10 dark:bg-primary/20 px-3 py-1 rounded-full">
            <CustomText weight="bold" className="text-primary text-sm">
              {count}
            </CustomText>
          </View>
        </View>
      </View>

      <View className="flex-row flex-wrap gap-3">
        {pending > 0 && (
          <View className="flex-row items-center">
            <Ionicons name="time-outline" size={14} color="#f59e0b" />
            <CustomText className="text-xs text-gray-600 dark:text-gray-400 ml-1">
              {t('systemStatus.pendingCount')}: {pending}
            </CustomText>
          </View>
        )}
        {deleted > 0 && (
          <View className="flex-row items-center">
            <Ionicons name="trash-outline" size={14} color="#ef4444" />
            <CustomText className="text-xs text-gray-600 dark:text-gray-400 ml-1">
              {t('systemStatus.deletedCount')}: {deleted}
            </CustomText>
          </View>
        )}
        {lastSync && (
          <View className="flex-row items-center">
            <Ionicons name="sync-outline" size={14} color="#10b981" />
            <CustomText className="text-xs text-gray-600 dark:text-gray-400 ml-1">
              {t('systemStatus.lastSynced')}: {formatTimestamp(lastSync)}
            </CustomText>
          </View>
        )}
      </View>
    </View>
  );
}

export default function SystemStatusScreen() {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const {
    isOnline,
    isBackendReachable,
    networkType,
    cacheSize,
    cacheKeys,
    refetch: refetchSystemStatus,
  } = useSystemStatus();
  const { stats, loading: dbLoading, refetch: refetchStats } = useDatabaseStats();

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      // Refresh all stats simultaneously
      await Promise.all([refetchStats(), refetchSystemStatus()]);
    } catch (error) {
      console.error('Error refreshing stats:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(t('profile.logout'), t('profile.logoutConfirm'), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('profile.logout'),
        style: 'destructive',
        onPress: async () => {
          try {
            // Clear all data: AsyncStorage, SQLite cache, Apollo cache
            await clearAllUserData();
            dispatch(logout());
            router.replace('/(auth)/login' as any);
          } catch (error) {
            if (__DEV__) {
              console.error('Error during logout:', error);
            }
            // Even if cleanup fails, still logout
            dispatch(logout());
            router.replace('/(auth)/login' as any);
          }
        },
      },
    ]);
  };

  return (
    <View className="flex-1 bg-gray-50 dark:bg-black">
      <Stack.Screen
        options={{
          headerShown: true,
          title: t('systemStatus.title', { defaultValue: 'System Status' }),
        }}
      />

      <ScrollView
        className="flex-1 px-6 pt-6"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Network Status Section */}
        <View className="mb-6">
          <CustomText
            weight="bold"
            className="text-lg text-black dark:text-white mb-4"
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

        {/* Storage Breakdown */}
        <View className="mb-6">
          <CustomText
            weight="bold"
            className="text-lg text-black dark:text-white mb-4"
          >
            {t('systemStatus.storageBreakdown', {
              defaultValue: 'Storage Breakdown',
            })}
          </CustomText>

          <View className="flex-row justify-between gap-3">
            <View className="flex-1">
              <StatCard
                title={t('systemStatus.apolloCache', {
                  defaultValue: 'Apollo Cache',
                })}
                value={formatBytes(cacheSize)}
                subtitle={t('systemStatus.storedData', {
                  defaultValue: 'Normalized cache',
                })}
                icon="disc-outline"
                color={isDark ? Colors.dark.primary : Colors.light.primary}
              />
            </View>
            <View className="flex-1">
              <StatCard
                title={t('systemStatus.localDatabase', {
                  defaultValue: 'Local Database',
                })}
                value={stats ? stats.totalEntities.toString() : '0'}
                subtitle={t('systemStatus.totalEntities', {
                  defaultValue: 'Total entities',
                })}
                icon="server-outline"
                color={isDark ? Colors.dark.primary : Colors.light.primary}
              />
            </View>
          </View>
        </View>

        {/* Database Statistics - Entity Breakdown */}
        {stats && (
          <View className="mb-6">
            <CustomText
              weight="bold"
              className="text-lg text-black dark:text-white mb-4"
            >
              {t('systemStatus.entityBreakdown', {
                defaultValue: 'Entity Breakdown',
              })}
            </CustomText>

            <EntityStatRow
              label={t('systemStatus.trips', { defaultValue: 'Trips' })}
              count={stats.entities.trips.count}
              pending={stats.entities.trips.pendingCount}
              deleted={stats.entities.trips.deletedCount}
              lastSync={stats.entities.trips.lastSyncAt}
              oldestCached={stats.entities.trips.oldestCachedAt}
              newestCached={stats.entities.trips.newestCachedAt}
            />

            <EntityStatRow
              label={t('systemStatus.users', { defaultValue: 'Users' })}
              count={stats.entities.users.count}
              pending={stats.entities.users.pendingCount}
              deleted={stats.entities.users.deletedCount}
              lastSync={stats.entities.users.lastSyncAt}
              oldestCached={stats.entities.users.oldestCachedAt}
              newestCached={stats.entities.users.newestCachedAt}
            />

            <EntityStatRow
              label={t('systemStatus.messages', { defaultValue: 'Messages' })}
              count={stats.entities.messages.count}
              pending={stats.entities.messages.pendingCount}
              deleted={stats.entities.messages.deletedCount}
              lastSync={stats.entities.messages.lastSyncAt}
              oldestCached={stats.entities.messages.oldestCachedAt}
              newestCached={stats.entities.messages.newestCachedAt}
            />

            <EntityStatRow
              label={t('systemStatus.tours', { defaultValue: 'Tours' })}
              count={stats.entities.tours.count}
              pending={stats.entities.tours.pendingCount}
              deleted={stats.entities.tours.deletedCount}
              lastSync={stats.entities.tours.lastSyncAt}
              oldestCached={stats.entities.tours.oldestCachedAt}
              newestCached={stats.entities.tours.newestCachedAt}
            />

            <EntityStatRow
              label={t('systemStatus.places', { defaultValue: 'Places' })}
              count={stats.entities.places.count}
              pending={stats.entities.places.pendingCount}
              deleted={stats.entities.places.deletedCount}
              lastSync={stats.entities.places.lastSyncAt}
              oldestCached={stats.entities.places.oldestCachedAt}
              newestCached={stats.entities.places.newestCachedAt}
            />
          </View>
        )}

        {/* Pending Mutations */}
        {stats && stats.pendingMutations.total > 0 && (
          <View className="mb-6">
            <CustomText
              weight="bold"
              className="text-lg text-black dark:text-white mb-4"
            >
              {t('systemStatus.pendingMutations', {
                defaultValue: 'Pending Mutations',
              })}
            </CustomText>

            <View className="bg-white dark:bg-neutral-900 rounded-xl p-4 border border-gray-200 dark:border-neutral-800">
              <View className="flex-row items-center justify-between mb-3">
                <View className="flex-row items-center">
                  <Ionicons
                    name="time-outline"
                    size={20}
                    color="#f59e0b"
                    style={{ marginRight: 8 }}
                  />
                  <CustomText weight="bold" className="text-base text-black dark:text-white">
                    {t('systemStatus.pendingMutationsTotal', {
                      defaultValue: 'Total Pending',
                    })}
                  </CustomText>
                </View>
                <View className="bg-warning/20 dark:bg-warning/20 px-3 py-1 rounded-full">
                  <CustomText weight="bold" className="text-warning text-sm">
                    {stats.pendingMutations.total}
                  </CustomText>
                </View>
              </View>

              {stats.pendingMutations.withErrors > 0 && (
                <View className="flex-row items-center justify-between mb-2">
                  <CustomText className="text-sm text-gray-600 dark:text-gray-400">
                    {t('systemStatus.pendingMutationsErrors', {
                      defaultValue: 'With Errors',
                    })}
                  </CustomText>
                  <CustomText weight="bold" className="text-sm text-danger">
                    {stats.pendingMutations.withErrors}
                  </CustomText>
                </View>
              )}

              {stats.pendingMutations.oldestQueuedAt && (
                <View className="flex-row items-center justify-between">
                  <CustomText className="text-sm text-gray-600 dark:text-gray-400">
                    {t('systemStatus.oldestPending', {
                      defaultValue: 'Oldest Queued',
                    })}
                  </CustomText>
                  <CustomText className="text-sm text-gray-700 dark:text-gray-300">
                    {formatTimestamp(stats.pendingMutations.oldestQueuedAt)}
                  </CustomText>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Sync Status */}
        {stats && stats.syncStatus.length > 0 && (
          <View className="mb-6">
            <CustomText
              weight="bold"
              className="text-lg text-black dark:text-white mb-4"
            >
              {t('systemStatus.syncStatusByEntity', {
                defaultValue: 'Sync Status by Entity',
              })}
            </CustomText>

            {stats.syncStatus.map((sync) => (
              <View
                key={sync.entityType}
                className="bg-white dark:bg-neutral-900 rounded-xl p-4 mb-3 border border-gray-200 dark:border-neutral-800"
              >
                <View className="flex-row items-center justify-between mb-2">
                  <CustomText weight="bold" className="text-base text-black dark:text-white">
                    {sync.entityType.charAt(0).toUpperCase() + sync.entityType.slice(1)}
                  </CustomText>
                  <View className="flex-row items-center">
                    <Ionicons
                      name={sync.lastSyncAt ? 'checkmark-circle' : 'alert-circle'}
                      size={18}
                      color={sync.lastSyncAt ? '#10b981' : '#ef4444'}
                      style={{ marginRight: 6 }}
                    />
                    <CustomText className="text-xs text-gray-500 dark:text-gray-400">
                      v{sync.schemaVersion}
                    </CustomText>
                  </View>
                </View>
                <CustomText className="text-sm text-gray-600 dark:text-gray-400">
                  {t('systemStatus.lastSynced', { defaultValue: 'Last Synced' })}:{' '}
                  {sync.lastSyncAt
                    ? formatTimestamp(sync.lastSyncAt)
                    : t('systemStatus.never', { defaultValue: 'Never' })}
                </CustomText>
              </View>
            ))}
          </View>
        )}

        {/* Info Section */}
        <View className="mb-6">
          <View className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
            <View className="flex-row items-start">
              <Ionicons
                name="information-circle"
                size={24}
                color={isDark ? '#60a5fa' : '#3b82f6'}
                style={{ marginRight: 12, marginTop: 2 }}
              />
              <View className="flex-1">
                <CustomText
                  weight="bold"
                  className="text-base text-blue-900 dark:text-blue-200 mb-2"
                >
                  {t('systemStatus.infoTitle', {
                    defaultValue: 'About This System',
                  })}
                </CustomText>
                <CustomText className="text-sm text-blue-800 dark:text-blue-300 leading-5">
                  {t('systemStatus.infoDescription', {
                    defaultValue:
                      'Your data is cached locally in SQLite for offline access. When offline, the app uses cached data. Changes sync automatically when connection is restored.',
                  })}
                </CustomText>
              </View>
            </View>
          </View>
        </View>

        {/* Logout Button */}
        <View className="mb-6 px-6">
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

        <View className="h-8" />
      </ScrollView>
    </View>
  );
}

