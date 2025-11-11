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
import { CustomText } from '@components/display';
import { StatCard } from '@components/display';
import { CustomButton } from '@components/forms';
import { LanguageSwitcher } from '@components/context';
import { ThemeToggle } from '@components/theme';
import { useTheme } from '@components/context';
import { useSystemStatus } from '@hooks/useSystemStatus';
import { useDatabaseStats } from '@hooks/useDatabaseStats';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { logout } from '@store/slices/authSlice';
import { setEnabled as setMapCacheEnabled, setAutoClearDays } from '@store/slices/mapCacheSlice';
import { clearAllUserData } from '@api';
import { persistor } from '@store';
import Colors from '@constants/Colors';
import { getCacheStats, clearCache, cleanupOldTiles } from '@/utils/mapTileCache';
import { useEffect } from 'react';


function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

export default function GeneralSettingsScreen() {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [refreshing, setRefreshing] = useState(false);
  
  // Map cache settings
  const mapCacheEnabled = useAppSelector(state => state.mapCache.enabled);
  const mapCacheAutoClearDays = useAppSelector(state => state.mapCache.autoClearDays);
  const [mapCacheStats, setMapCacheStats] = useState<{
    totalTiles: number;
    totalSize: number;
    tilesByLayer: Record<string, number>;
  } | null>(null);
  const [clearingCache, setClearingCache] = useState(false);

  // System Status hooks
  const {
    isOnline,
    isBackendReachable,
    networkType,
    refetch: refetchSystemStatus,
  } = useSystemStatus();
  const { stats, refetch: refetchStats } = useDatabaseStats();


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

  // Load map cache stats on mount and when map cache is enabled
  useEffect(() => {
    loadMapCacheStats();
  }, [mapCacheEnabled]);
  
  // Also refresh stats when screen comes into focus
  useEffect(() => {
    const interval = setInterval(() => {
      if (mapCacheEnabled) {
        loadMapCacheStats();
      }
    }, 5000); // Refresh every 5 seconds when cache is enabled
    
    return () => clearInterval(interval);
  }, [mapCacheEnabled]);

  const loadMapCacheStats = async () => {
    try {
      const stats = await getCacheStats();
      setMapCacheStats({
        totalTiles: stats.totalTiles,
        totalSize: stats.totalSize,
        tilesByLayer: stats.tilesByLayer,
      });
    } catch (error) {
      console.error('Error loading map cache stats:', error);
    }
  };

  const handleClearMapCache = () => {
    Alert.alert(
      t('settings.clearMapCache', { defaultValue: 'Clear Map Cache' }),
      t('settings.clearMapCacheConfirm', {
        defaultValue: 'Are you sure you want to clear all cached map tiles? This cannot be undone.',
      }),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.clear', { defaultValue: 'Clear' }),
          style: 'destructive',
          onPress: async () => {
            setClearingCache(true);
            try {
              await clearCache();
              await loadMapCacheStats();
              Alert.alert(
                t('common.success'),
                t('settings.mapCacheCleared', { defaultValue: 'Map cache cleared successfully!' })
              );
            } catch (error) {
              console.error('Error clearing map cache:', error);
              Alert.alert(
                t('common.error'),
                t('settings.mapCacheClearError', { defaultValue: 'Failed to clear map cache' })
              );
            } finally {
              setClearingCache(false);
            }
          },
        },
      ]
    );
  };

  const handleMapCacheAutoClearChange = (days: number) => {
    dispatch(setAutoClearDays(days));
    // Trigger cleanup if enabled
    if (days > 0) {
      cleanupOldTiles(days).catch(error => {
        console.error('Error cleaning up old tiles:', error);
      });
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.all([refetchStats(), refetchSystemStatus(), loadMapCacheStats()]);
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

        {/* Map Cache Settings */}
        <View className="mb-4">
          <CustomText weight="bold" className="text-sm text-gray-500 dark:text-gray-400 mb-2 uppercase">
            {t('settings.mapCache', { defaultValue: 'Map Cache' })}
          </CustomText>
          <View className="bg-white dark:bg-neutral-900 rounded-2xl p-4 border border-gray-200 dark:border-neutral-800">
            {/* Enable/Disable Toggle */}
            <View className="flex-row items-center justify-between py-3 border-b border-gray-200 dark:border-neutral-800">
              <View className="flex-1">
                <CustomText weight="medium" className="text-base text-black dark:text-white mb-1">
                  {t('settings.enableMapCache', { defaultValue: 'Enable Map Caching' })}
                </CustomText>
                <CustomText className="text-sm text-gray-500 dark:text-gray-400">
                  {t('settings.enableMapCacheDescription', {
                    defaultValue: 'Cache map tiles for offline use',
                  })}
                </CustomText>
              </View>
              <TouchableOpacity
                onPress={() => dispatch(setMapCacheEnabled(!mapCacheEnabled))}
                className={`w-12 h-7 rounded-full justify-center ${
                  mapCacheEnabled ? 'bg-primary' : 'bg-gray-300 dark:bg-neutral-700'
                }`}
              >
                <View
                  className={`w-5 h-5 rounded-full bg-white ${
                    mapCacheEnabled ? 'ml-5' : 'ml-1'
                  }`}
                />
              </TouchableOpacity>
            </View>

            {/* Cache Statistics */}
            {mapCacheStats && (
              <View className="py-3 border-b border-gray-200 dark:border-neutral-800">
                <CustomText weight="medium" className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                  {t('settings.cacheStatistics', { defaultValue: 'Cache Statistics' })}
                </CustomText>
                <View className="flex-row gap-3">
                  <View className="flex-1">
                    <CustomText className="text-xs text-gray-500 dark:text-gray-400">
                      {t('settings.totalTiles', { defaultValue: 'Total Tiles' })}
                    </CustomText>
                    <CustomText weight="bold" className="text-lg text-black dark:text-white">
                      {mapCacheStats.totalTiles.toLocaleString()}
                    </CustomText>
                  </View>
                  <View className="flex-1">
                    <CustomText className="text-xs text-gray-500 dark:text-gray-400">
                      {t('settings.cacheSize', { defaultValue: 'Cache Size' })}
                    </CustomText>
                    <CustomText weight="bold" className="text-lg text-black dark:text-white">
                      {formatBytes(mapCacheStats.totalSize)}
                    </CustomText>
                  </View>
                </View>
              </View>
            )}

            {/* Auto-Clear Settings */}
            <View className="py-3 border-b border-gray-200 dark:border-neutral-800">
              <CustomText weight="medium" className="text-sm text-black dark:text-white mb-2">
                {t('settings.autoClearCache', { defaultValue: 'Auto-Clear Cache' })}
              </CustomText>
              <CustomText className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                {t('settings.autoClearCacheDescription', {
                  defaultValue: 'Automatically clear tiles older than specified days',
                })}
              </CustomText>
              <View className="flex-row gap-2">
                {[0, 1, 7, 30].map(days => (
                  <TouchableOpacity
                    key={days}
                    onPress={() => handleMapCacheAutoClearChange(days)}
                    className={`px-3 py-1.5 rounded-full border ${
                      mapCacheAutoClearDays === days
                        ? 'bg-primary border-primary'
                        : 'bg-white dark:bg-neutral-900 border-gray-300 dark:border-neutral-700'
                    }`}
                  >
                    <CustomText
                      className={`text-xs ${
                        mapCacheAutoClearDays === days
                          ? 'text-white'
                          : 'text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {days === 0
                        ? t('settings.never', { defaultValue: 'Never' })
                        : days === 1
                        ? t('settings.oneDay', { defaultValue: '1 Day' })
                        : `${days} ${t('settings.days', { defaultValue: 'Days' })}`}
                    </CustomText>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Clear Cache Button */}
            <TouchableOpacity
              onPress={handleClearMapCache}
              disabled={clearingCache || !mapCacheStats || mapCacheStats.totalTiles === 0}
              className={`py-3 rounded-xl items-center ${
                clearingCache || !mapCacheStats || mapCacheStats.totalTiles === 0
                  ? 'bg-gray-100 dark:bg-neutral-800'
                  : 'bg-red-50 dark:bg-red-900/20'
              }`}
            >
              <CustomText
                weight="medium"
                className={`text-sm ${
                  clearingCache || !mapCacheStats || mapCacheStats.totalTiles === 0
                    ? 'text-gray-400 dark:text-gray-600'
                    : 'text-red-600 dark:text-red-400'
                }`}
              >
                {clearingCache
                  ? t('common.clearing', { defaultValue: 'Clearing...' })
                  : t('settings.clearMapCache', { defaultValue: 'Clear Map Cache' })}
              </CustomText>
            </TouchableOpacity>
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
              <View className="gap-1.5">
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
