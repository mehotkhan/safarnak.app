import { View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { CustomText } from '@ui/display';
import { CustomButton } from '@ui/forms';
import { LanguageSwitcher } from '@ui/context';
import { ThemeToggle } from '@ui/theme';
import { useTheme } from '@ui/context';
import { useAppDispatch, useAppSelector } from '@state/hooks';
import { logout } from '@state/slices/authSlice';
import { setEnabled as setMapCacheEnabled } from '@state/slices/mapCacheSlice';
import { clearAllUserData } from '@api';
import { persistor } from '@state';

export default function GeneralSettingsScreen() {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const mapCacheEnabled = useAppSelector(state => state.mapCache.enabled);

  const handleLogout = () => {
    Alert.alert(t('profile.logout'), t('profile.logoutConfirm'), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('profile.logout'),
        style: 'destructive',
        onPress: async () => {
          try {
            await clearAllUserData();
            await persistor.purge();
            dispatch(logout());
            router.replace('/(auth)/login' as any);
          } catch {
            try {
              await persistor.purge();
            } catch {
              // ignore
            }
            dispatch(logout());
            router.replace('/(auth)/login' as any);
          }
        },
      },
    ]);
  };

  return (
    <ScrollView className="flex-1 bg-white dark:bg-black">
      <View className="p-4">
        {/* General */}
        <View className="mb-4">
          <CustomText weight="bold" className="mb-2 text-sm uppercase text-gray-500 dark:text-gray-400">
            {t('settings.general', { defaultValue: 'General' })}
          </CustomText>
          <View className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
            {/* Language */}
            <View className="flex-row items-center justify-between border-b border-gray-200 py-3 dark:border-neutral-800">
                    <View className="flex-row items-center">
                <View
                  className="mr-3 size-9 items-center justify-center rounded-full"
                  style={{ backgroundColor: isDark ? '#f59e0b20' : '#f59e0b20' }}
                >
                        <Ionicons name="language-outline" size={18} color={isDark ? '#fbbf24' : '#f59e0b'} />
                </View>
                <CustomText weight="medium" className="text-sm text-black dark:text-white">
                  {t('profile.language', { defaultValue: 'Language' })}
                </CustomText>
              </View>
              <LanguageSwitcher variant="dropdownMini" />
            </View>

            {/* Theme */}
            <View className="flex-row items-center justify-between py-3">
                    <View className="flex-row items-center">
                <View
                  className="mr-3 size-9 items-center justify-center rounded-full"
                  style={{ backgroundColor: isDark ? '#10b98120' : '#10b98120' }}
                >
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

        {/* Map Cache Settings */}
        <View className="mb-4">
          <CustomText weight="bold" className="mb-2 text-sm uppercase text-gray-500 dark:text-gray-400">
            {t('settings.mapCache', { defaultValue: 'Offline & Cache' })}
          </CustomText>
          <View className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
            {/* Enable/Disable Toggle */}
            <View className="flex-row items-center justify-between border-b border-gray-200 py-3 dark:border-neutral-800">
              <View className="flex-1">
                <CustomText weight="medium" className="mb-1 text-base text-black dark:text-white">
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
                className={`h-7 w-12 justify-center rounded-full ${
                  mapCacheEnabled ? 'bg-primary' : 'bg-gray-300 dark:bg-neutral-700'
                }`}
              >
                <View
                  className={`size-5 rounded-full bg-white ${
                    mapCacheEnabled ? 'ml-5' : 'ml-1'
                  }`}
                />
              </TouchableOpacity>
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
