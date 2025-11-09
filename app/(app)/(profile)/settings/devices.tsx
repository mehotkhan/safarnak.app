import { useState, useCallback } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { CustomText } from '@components/ui/CustomText';
import { InfoBanner } from '@components/ui/InfoBanner';
import { useTheme } from '@components/context/ThemeContext';
import { useGetMyDevicesQuery, useRevokeDeviceMutation } from '@api';
import { useAppSelector } from '@store/hooks';
import { useLanguage } from '@components/context/LanguageContext';
import { useDateTime } from '@utils/datetime';
import * as Device from 'expo-device';

export default function DevicesScreen() {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const { currentLanguage } = useLanguage();
  const { deviceKeyPair } = useAppSelector((state) => state.auth);
  const [refreshing, setRefreshing] = useState(false);

  const { data, loading, error, refetch } = useGetMyDevicesQuery({
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all',
  });

  const [revokeDeviceMutation, { loading: revoking }] = useRevokeDeviceMutation();

  const devices = data?.getMyDevices || [];

  const { formatDateTime } = useDateTime();

  const getDeviceName = (device: any): string => {
    // Try to identify device type
    if (device.type) {
      return device.type;
    }
    // Use deviceId as fallback (first 8 chars) with localized prefix
    return `${t('settings.device', { defaultValue: 'Device' })} ${device.deviceId.substring(0, 8)}`;
  };

  const isCurrentDevice = useCallback((device: any): boolean => {
    return deviceKeyPair?.deviceId === device.deviceId;
  }, [deviceKeyPair]);

  const handleRevokeDevice = useCallback(
    (device: any) => {
      if (isCurrentDevice(device)) {
        Alert.alert(
          t('settings.cannotRevokeCurrentDevice', {
            defaultValue: 'Cannot Revoke Current Device',
          }),
          t('settings.cannotRevokeCurrentDeviceMessage', {
            defaultValue:
              'You cannot revoke the device you are currently using. Please use another device to revoke this one.',
          })
        );
        return;
      }

      Alert.alert(
        t('settings.revokeDevice', { defaultValue: 'Revoke Device' }),
        t('settings.revokeDeviceConfirm', {
          defaultValue: 'Are you sure you want to revoke this device? It will be logged out immediately.',
        }),
        [
          { text: t('common.cancel'), style: 'cancel' },
          {
            text: t('settings.revoke', { defaultValue: 'Revoke' }),
            style: 'destructive',
            onPress: async () => {
              try {
                await revokeDeviceMutation({
                  variables: { deviceId: device.deviceId },
                });
                await refetch();
                Alert.alert(
                  t('common.success'),
                  t('settings.deviceRevoked', {
                    defaultValue: 'Device revoked successfully',
                  })
                );
              } catch (err: any) {
                Alert.alert(
                  t('common.error'),
                  err.message ||
                    t('settings.revokeDeviceError', {
                      defaultValue: 'Failed to revoke device',
                    })
                );
              }
            },
          },
        ]
      );
    },
    [revokeDeviceMutation, refetch, t, isCurrentDevice]
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refetch();
    } catch (error) {
      console.error('Error refreshing devices:', error);
    } finally {
      setRefreshing(false);
    }
  }, [refetch]);

  const truncatePublicKey = (publicKey: string): string => {
    if (publicKey.length <= 32) return publicKey;
    return `${publicKey.substring(0, 16)}...${publicKey.substring(publicKey.length - 16)}`;
  };

  if (loading && !data) {
    return (
      <View className="flex-1 bg-white dark:bg-black items-center justify-center">
        <ActivityIndicator size="large" color={isDark ? '#fff' : '#000'} />
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-white dark:bg-black"
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View className="px-4 py-4">
        {/* Info Banner */}
        <View className="mb-4">
          <InfoBanner
            type="info"
            title={t('settings.devicesInfoTitle', {
                    defaultValue: 'Device Management',
                  })}
            message={t('settings.devicesInfoDescription', {
                    defaultValue:
                      'Manage your connected devices. Each device has its own authentication key. Revoking a device will log it out immediately.',
                  })}
          />
        </View>

        {/* Current Device Info */}
        {deviceKeyPair && (
          <View className="mb-4">
            <CustomText
              weight="bold"
              className="text-sm text-gray-500 dark:text-gray-400 mb-2 uppercase"
            >
              {t('settings.currentDevice', { defaultValue: 'Current Device' })}
            </CustomText>
            <View className="bg-white dark:bg-neutral-900 rounded-2xl p-4 border border-gray-200 dark:border-neutral-800">
              <View className="flex-row items-center justify-between">
                <View className="flex-1">
                  <View className="flex-row items-center mb-2">
                    <Ionicons
                      name="phone-portrait"
                      size={20}
                      color={isDark ? '#10b981' : '#059669'}
                      style={{ marginRight: 8 }}
                    />
                    <CustomText weight="bold" className="text-base text-black dark:text-white">
                      {Device.modelName || Device.deviceName || t('settings.thisDevice', { defaultValue: 'This Device' })}
                    </CustomText>
                    <View className="ml-2 px-2 py-0.5 bg-green-100 dark:bg-green-900/30 rounded-full">
                      <CustomText className="text-xs text-green-700 dark:text-green-400">
                        {t('settings.active', { defaultValue: 'Active' })}
                      </CustomText>
                    </View>
                  </View>
                  <CustomText className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                    {t('settings.deviceId', { defaultValue: 'Device ID' })}:{' '}
                    {deviceKeyPair.deviceId}
                  </CustomText>
                  <CustomText className="text-xs text-gray-500 dark:text-gray-400">
                    {t('settings.publicKey', { defaultValue: 'Public Key' })}:{' '}
                    {truncatePublicKey(deviceKeyPair.publicKey)}
                  </CustomText>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* Devices List */}
        <View className="mb-4">
          <CustomText
            weight="bold"
            className="text-sm text-gray-500 dark:text-gray-400 mb-2 uppercase"
          >
            {t('settings.allDevices', { defaultValue: 'All Devices' })} ({devices.length})
          </CustomText>

          {error && (
            <View className="mb-4 bg-red-50 dark:bg-red-900/20 rounded-xl p-3 border border-red-200 dark:border-red-800">
              <CustomText className="text-sm text-red-800 dark:text-red-300">
                {t('settings.errorLoadingDevices', {
                  defaultValue: 'Error loading devices',
                })}
              </CustomText>
            </View>
          )}

          {devices.length === 0 ? (
            <View className="bg-white dark:bg-neutral-900 rounded-2xl p-6 border border-gray-200 dark:border-neutral-800 items-center">
              <Ionicons
                name="phone-portrait-outline"
                size={48}
                color={isDark ? '#666' : '#9ca3af'}
                style={{ marginBottom: 12 }}
              />
              <CustomText className="text-base text-gray-600 dark:text-gray-400 text-center">
                {t('settings.noDevices', { defaultValue: 'No devices found' })}
              </CustomText>
            </View>
          ) : (
            <View className="gap-3">
              {devices.map((device: any) => {
                const isCurrent = isCurrentDevice(device);
                return (
                  <View
                    key={device.id}
                    className="bg-white dark:bg-neutral-900 rounded-2xl p-4 border border-gray-200 dark:border-neutral-800 mb-3"
                  >
                    <View className="flex-row items-start justify-between mb-3">
                      <View className="flex-1">
                        <View className="flex-row items-center mb-2">
                          <Ionicons
                            name="phone-portrait"
                            size={18}
                            color={isDark ? '#9ca3af' : '#6b7280'}
                            style={{ marginRight: 8 }}
                          />
                          <CustomText weight="bold" className="text-base text-black dark:text-white">
                            {getDeviceName(device)}
                          </CustomText>
                          {isCurrent && (
                            <View className="ml-2 px-2 py-0.5 bg-green-100 dark:bg-green-900/30 rounded-full">
                              <CustomText className="text-xs text-green-700 dark:text-green-400">
                                {t('settings.current', { defaultValue: 'Current' })}
                              </CustomText>
                            </View>
                          )}
                        </View>
                        <CustomText className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                          {t('settings.deviceId', { defaultValue: 'Device ID' })}:{' '}
                          {device.deviceId}
                        </CustomText>
                        <CustomText className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                          {t('settings.publicKey', { defaultValue: 'Public Key' })}:{' '}
                          {truncatePublicKey(device.publicKey)}
                        </CustomText>
                        <CustomText className="text-xs text-gray-500 dark:text-gray-400">
                          {t('settings.lastSeen', { defaultValue: 'Last Seen' })}:{' '}
                          {formatDateTime(device.lastSeen, 'short', 'short')}
                        </CustomText>
                      </View>
                      {!isCurrent && (
                        <TouchableOpacity
                          onPress={() => handleRevokeDevice(device)}
                          disabled={revoking}
                          className="ml-3 px-3 py-2 bg-red-50 dark:bg-red-900/20 rounded-lg flex-row items-center"
                        >
                          {revoking ? (
                            <ActivityIndicator size="small" color="#ef4444" />
                          ) : (
                            <>
                              <Ionicons name="close-circle" size={18} color="#ef4444" style={{ marginRight: 6 }} />
                              <CustomText className="text-xs text-red-600 dark:text-red-400 font-medium">
                                {t('settings.revoke', { defaultValue: 'Revoke' })}
                              </CustomText>
                            </>
                          )}
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                );
              })}
            </View>
          )}
        </View>

        <View className="h-4" />
      </View>
    </ScrollView>
  );
}

