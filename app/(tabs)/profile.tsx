import { View, Image, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { CustomText } from '@components/ui/CustomText';
import { LanguageSwitcher } from '@components/context/LanguageSwitcher';
import { ThemeToggle } from '@components/ui/ThemeToggle';
import CustomButton from '@components/ui/CustomButton';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { logout } from '@store/slices/authSlice';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const appIcon = require('../../assets/images/icon.png');

const USER_STORAGE_KEY = '@safarnak_user';

export default function ProfileScreen() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(state => state.auth);

  const handleLogout = () => {
    Alert.alert(t('profile.logout'), t('profile.logoutConfirm'), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('profile.logout'),
        style: 'destructive',
        onPress: async () => {
          try {
            await AsyncStorage.removeItem(USER_STORAGE_KEY);
            dispatch(logout());
            router.replace('/auth/login' as any);
          } catch (error) {
            console.log('Error during logout:', error);
          }
        },
      },
    ]);
  };

  return (
    <View className="flex-1 bg-white dark:bg-black p-6">
      <CustomText weight="bold" className="text-3xl text-black dark:text-white mb-8">
        {t('profile.title')}
      </CustomText>

      {/* User Card */}
      <View className="items-center bg-gray-50 dark:bg-neutral-900 rounded-2xl p-6 mb-6">
        <View className="w-24 h-24 rounded-full overflow-hidden bg-white dark:bg-neutral-800 mb-4 border border-gray-200 dark:border-neutral-700">
          <Image source={appIcon} className="w-full h-full" resizeMode="contain" />
        </View>
        <CustomText weight="bold" className="text-xl text-black dark:text-white">
          {user?.name || user?.username || t('profile.title')}
        </CustomText>
        <CustomText className="text-sm text-gray-500 dark:text-neutral-400 mt-1">
          {user?.username ? `@${user.username}` : t('profile.description')}
        </CustomText>
      </View>

      {/* Preferences */}
      <View className="bg-gray-50 dark:bg-neutral-900 rounded-2xl p-4 mb-6">
        <CustomText weight="bold" className="text-base text-black dark:text-white mb-3">
          {t('profile.settings')}
        </CustomText>

        <View className="flex-row items-center justify-between py-3">
          <CustomText className="text-base text-black dark:text-white">{t('profile.language')}</CustomText>
          <LanguageSwitcher />
        </View>

        <View className="h-px bg-gray-200 dark:bg-neutral-800" />

        <View className="flex-row items-center justify-between py-3">
          <CustomText className="text-base text-black dark:text-white">{t('profile.theme')}</CustomText>
          <ThemeToggle />
        </View>
      </View>

      {/* Logout */}
      <CustomButton title={t('profile.logout')} onPress={handleLogout} bgVariant="danger" />
    </View>
  );
}
