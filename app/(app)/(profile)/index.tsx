import { View, Image, Alert, TouchableOpacity, ScrollView } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

import { CustomText } from '@components/ui/CustomText';
import CustomButton from '@components/ui/CustomButton';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { logout } from '@store/slices/authSlice';
import { useTheme } from '@components/context/ThemeContext';
import Colors from '@constants/Colors';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const appIcon = require('@assets/images/icon.png');

const USER_STORAGE_KEY = '@safarnak_user';

interface MenuItemProps {
  icon: any;
  title: string;
  subtitle?: string;
  onPress: () => void;
  isDark: boolean;
  badge?: number;
  color?: string;
}

const MenuItem = ({
  icon,
  title,
  subtitle,
  onPress,
  isDark,
  badge,
  color = isDark ? '#9ca3af' : '#6b7280',
}: MenuItemProps) => (
  <TouchableOpacity
    onPress={onPress}
    className="flex-row items-center py-4 border-b border-gray-200 dark:border-neutral-800"
  >
    <View
      className="w-10 h-10 rounded-full items-center justify-center mr-4"
      style={{ backgroundColor: color + '20' }}
    >
      <Ionicons name={icon} size={20} color={color} />
    </View>
    <View className="flex-1">
      <CustomText
        weight="medium"
        className="text-base text-black dark:text-white"
      >
        {title}
      </CustomText>
      {subtitle && (
        <CustomText className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {subtitle}
        </CustomText>
      )}
    </View>
    {badge !== undefined && badge > 0 && (
      <View className="w-6 h-6 bg-red-500 rounded-full items-center justify-center mr-3">
        <CustomText className="text-xs text-white" weight="bold">
          {badge > 9 ? '9+' : badge}
        </CustomText>
      </View>
    )}
    <Ionicons
      name="chevron-forward"
      size={20}
      color={isDark ? '#666' : '#9ca3af'}
    />
  </TouchableOpacity>
);

export default function ProfileScreen() {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const dispatch = useAppDispatch();
  const router = useRouter();
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
            router.replace('/(auth)/login' as any);
          } catch (error) {
            console.log('Error during logout:', error);
          }
        },
      },
    ]);
  };

  const handleMyTrips = () => {
    router.push('/(app)/(profile)/trips' as any);
  };

  const handleMessages = () => {
    router.push('/(app)/(profile)/messages' as any);
  };
  
  const handleSettings = () => {
    router.push('/(app)/(profile)/settings' as any);
  };

  const handleEditProfile = () => {
    router.push('/(app)/(profile)/edit' as any);
  };

  const handleSubscription = () => {
    router.push('/(app)/(profile)/subscription' as any);
  };

  return (
    <View className="flex-1 bg-white dark:bg-black">
      <Stack.Screen 
        options={{ 
          headerShown: true,
          title: t('profile.title'),
        }} 
      />

      <ScrollView className="flex-1">
        {/* Profile Header */}
        <View className="px-6 pt-6 pb-4 bg-white dark:bg-black border-b border-gray-200 dark:border-neutral-800">
          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-row items-center flex-1">
              <View 
                className="w-20 h-20 rounded-full overflow-hidden mr-4"
                style={{ 
                  backgroundColor: isDark ? '#262626' : '#f5f5f5',
                  borderWidth: 3,
                  borderColor: isDark ? Colors.dark.primary : Colors.light.primary,
                }}
              >
                <Image
                  source={appIcon}
                  className="w-full h-full"
                  resizeMode="contain"
                />
              </View>
              <View className="flex-1">
                <CustomText weight="bold" className="text-2xl text-black dark:text-white mb-1">
                  {user?.name || t('profile.guest')}
                </CustomText>
                <CustomText className="text-base text-gray-600 dark:text-gray-400">
                  {user?.username ? `@${user.username}` : t('profile.description')}
                </CustomText>
              </View>
            </View>
            <TouchableOpacity
              onPress={handleEditProfile}
              className="w-10 h-10 rounded-full items-center justify-center bg-gray-100 dark:bg-neutral-800"
            >
              <Ionicons
                name="create-outline"
                size={22}
                color={isDark ? '#fff' : '#000'}
              />
            </TouchableOpacity>
          </View>

          {/* Stats */}
          <View className="flex-row items-center justify-around py-4 bg-gray-50 dark:bg-neutral-900 rounded-2xl">
            <View className="items-center">
              <CustomText weight="bold" className="text-xl text-black dark:text-white">
                12
              </CustomText>
              <CustomText className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {t('profile.trips')}
              </CustomText>
            </View>
            <View className="w-px h-10 bg-gray-200 dark:bg-neutral-800" />
            <View className="items-center">
              <CustomText weight="bold" className="text-xl text-black dark:text-white">
                48
              </CustomText>
              <CustomText className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {t('profile.posts')}
              </CustomText>
            </View>
            <View className="w-px h-10 bg-gray-200 dark:bg-neutral-800" />
            <View className="items-center">
              <CustomText weight="bold" className="text-xl text-black dark:text-white">
                256
              </CustomText>
              <CustomText className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {t('profile.followers')}
              </CustomText>
            </View>
          </View>
        </View>

        {/* Subscription Card */}
        <View className="px-6 my-6">
          <View className="rounded-2xl p-4 bg-primary">
            <View className="flex-row items-center justify-between">
              <View className="flex-1">
                <CustomText weight="bold" className="text-white text-lg mb-1">
                  {t('me.subscription')}
                </CustomText>
                <CustomText className="text-white/80 text-sm mb-3">
                  {t('me.quotaRemaining', { remaining: 5, total: 10 })}
                </CustomText>
                <TouchableOpacity
                  onPress={handleSubscription}
                  className="bg-white rounded-full px-4 py-2 self-start"
                >
                  <CustomText
                    className="text-primary"
                    weight="bold"
                  >
                    {t('me.upgrade')}
                  </CustomText>
                </TouchableOpacity>
              </View>
              <Ionicons name="sparkles" size={60} color="rgba(255,255,255,0.3)" />
            </View>
          </View>
        </View>

        {/* Menu */}
        <View className="px-6">
          <CustomText
            weight="bold"
            className="text-sm text-gray-500 dark:text-gray-400 mb-2 uppercase"
          >
            {t('me.content')}
          </CustomText>
          <View className="bg-white dark:bg-neutral-900 rounded-2xl px-4">
            <MenuItem
              icon="airplane-outline"
              title={t('me.myTrips')}
              subtitle={t('me.myTripsSubtitle')}
              onPress={handleMyTrips}
              isDark={isDark}
              color={isDark ? Colors.dark.primary : Colors.light.primary}
            />
            <MenuItem
              icon="mail-outline"
              title={t('me.messages')}
              subtitle={t('me.messagesSubtitle')}
              onPress={handleMessages}
              isDark={isDark}
              badge={3}
              color={isDark ? Colors.dark.primary : Colors.light.primary}
            />
            <MenuItem
              icon="card-outline"
              title={t('me.payments')}
              subtitle={t('me.paymentsSubtitle')}
              onPress={() => router.push('/(app)/(profile)/payments' as any)}
              isDark={isDark}
              color={isDark ? Colors.dark.primary : Colors.light.primary}
            />
            <MenuItem
              icon="settings-outline"
              title={t('profile.settings')}
              subtitle={t('settings.subtitle')}
              onPress={handleSettings}
              isDark={isDark}
              color={isDark ? Colors.dark.primary : Colors.light.primary}
            />
          </View>

          {/* Logout */}
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
          <View className="h-8" />
        </View>
      </ScrollView>
    </View>
  );
}
