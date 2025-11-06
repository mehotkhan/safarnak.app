import { useState } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useRouter, Stack, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { CustomText } from '@components/ui/CustomText';
import InputField from '@components/ui/InputField';
import TextArea from '@components/ui/TextArea';
import CustomButton from '@components/ui/CustomButton';
import { useTheme } from '@components/context/ThemeContext';
import { useAppSelector } from '@store/hooks';
import { useMeQuery } from '@api';
import Colors from '@constants/Colors';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const appIcon = require('@assets/images/icon.png');

interface AccountRowProps {
  icon: any;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  isDark: boolean;
  variant?: 'default' | 'danger';
}

const AccountRow = ({ 
  icon, 
  title, 
  subtitle, 
  onPress, 
  isDark,
  variant = 'default',
}: AccountRowProps) => {
  const color = variant === 'danger' 
    ? '#ef4444' 
    : (isDark ? Colors.dark.primary : Colors.light.primary);
    
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={!onPress}
      className="flex-row items-center py-4 border-b border-gray-200 dark:border-neutral-800"
    >
      <View
        className="w-10 h-10 rounded-full items-center justify-center mr-3"
        style={{ backgroundColor: color + '20' }}
      >
        <Ionicons name={icon} size={20} color={color} />
      </View>
      <View className="flex-1">
        <CustomText
          weight="medium"
          className={`text-base ${
            variant === 'danger' 
              ? 'text-red-600 dark:text-red-400' 
              : 'text-black dark:text-white'
          }`}
        >
          {title}
        </CustomText>
        {subtitle && (
          <CustomText className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {subtitle}
          </CustomText>
        )}
      </View>
      {onPress && (
        <Ionicons
          name="chevron-forward"
          size={20}
          color={isDark ? '#666' : '#9ca3af'}
        />
      )}
    </TouchableOpacity>
  );
};

export default function AccountScreen() {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams<{ edit?: string }>();
  const { user: reduxUser } = useAppSelector(state => state.auth);
  const [isEditing, setIsEditing] = useState(params.edit === 'true');
  const [loading, setLoading] = useState(false);
  
  const { data: meData } = useMeQuery({
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all',
  });
  
  const user = meData?.me || reduxUser;

  const [formData, setFormData] = useState({
    name: user?.name || '',
    username: user?.username || '',
    email: '',
    phone: '',
    bio: '',
    location: '',
    website: '',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleChangeAvatar = () => {
    Alert.alert(
      t('profile.edit.changeAvatar'),
      t('profile.edit.changeAvatarMessage', { 
        defaultValue: 'Avatar change feature coming soon!' 
      })
    );
  };

  const handleSave = async () => {
    setLoading(true);
    
    // TODO: Implement API call to save profile
    setTimeout(() => {
      setLoading(false);
      setIsEditing(false);
      Alert.alert(
        t('common.success'),
        t('profile.edit.successMessage', { 
          defaultValue: 'Profile updated successfully!' 
        }),
        [{ text: t('common.ok') }]
      );
    }, 1000);
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      username: user?.username || '',
      email: '',
      phone: '',
      bio: '',
      location: '',
      website: '',
    });
    setIsEditing(false);
  };

  const handleChangePassword = () => {
    Alert.alert(
      t('profile.account.changePassword', { defaultValue: 'Change Password' }),
      t('profile.account.changePasswordComingSoon', { 
        defaultValue: 'Password change feature coming soon!' 
      })
    );
  };

  const handleChangeEmail = () => {
    Alert.alert(
      t('profile.account.changeEmail', { defaultValue: 'Change Email' }),
      t('profile.account.changeEmailComingSoon', { 
        defaultValue: 'Email change feature coming soon!' 
      })
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      t('profile.account.deleteAccount', { defaultValue: 'Delete Account' }),
      t('profile.account.deleteAccountConfirm', { 
        defaultValue: 'Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently deleted.' 
      }),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.delete'),
          style: 'destructive',
          onPress: () => {
            Alert.alert(
              t('profile.account.deleteAccount', { defaultValue: 'Delete Account' }),
              t('profile.account.deleteAccountComingSoon', { 
                defaultValue: 'Account deletion feature coming soon!' 
              })
            );
          },
        },
      ]
    );
  };

  return (
    <ScrollView className="flex-1 bg-white dark:bg-black">
      <Stack.Screen 
        options={{ 
          title: t('profile.accountTitle'),
          headerShown: true,
          headerRight: () => (
            !isEditing ? (
              <TouchableOpacity
                onPress={() => setIsEditing(true)}
                className="mr-4"
              >
                <Ionicons
                  name="create-outline"
                  size={24}
                  color={isDark ? '#fff' : '#000'}
                />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={handleCancel}
                className="mr-4"
              >
                <CustomText className="text-primary" weight="medium">
                  {t('common.cancel')}
                </CustomText>
              </TouchableOpacity>
            )
          ),
        }} 
      />

      <View className="px-6 py-4">
        {!isEditing ? (
          <>
            {/* Account Information */}
            <View className="mb-4">
              <View className="bg-white dark:bg-neutral-900 rounded-2xl px-4">
                {/* Avatar */}
                <View className="items-center py-4 border-b border-gray-200 dark:border-neutral-800">
                  <View className="w-20 h-20 rounded-full overflow-hidden bg-white dark:bg-neutral-800 border-2 border-primary mb-2">
                    <Image
                      source={appIcon}
                      className="w-full h-full"
                      resizeMode="contain"
                    />
                  </View>
                  <CustomText weight="medium" className="text-base text-black dark:text-white">
                    {user?.name || t('common.notAvailable')}
                  </CustomText>
                  <CustomText className="text-sm text-gray-500 dark:text-gray-400">
                    @{user?.username || t('common.notAvailable')}
                  </CustomText>
                </View>

                <View className="py-3 border-b border-gray-200 dark:border-neutral-800">
                  <CustomText className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                    {t('profile.account.username', { defaultValue: 'Username' })}
                  </CustomText>
                  <CustomText weight="medium" className="text-base text-black dark:text-white">
                    {user?.username || t('common.notAvailable')}
                  </CustomText>
                </View>
                <View className="py-3 border-b border-gray-200 dark:border-neutral-800">
                  <CustomText className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                    {t('profile.account.name', { defaultValue: 'Name' })}
                  </CustomText>
                  <CustomText weight="medium" className="text-base text-black dark:text-white">
                    {user?.name || t('common.notAvailable')}
                  </CustomText>
                </View>
                <View className="py-3">
                  <CustomText className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                    {t('profile.account.memberSince', { defaultValue: 'Member Since' })}
                  </CustomText>
                  <CustomText weight="medium" className="text-base text-black dark:text-white">
                    {user?.createdAt 
                      ? new Date(user.createdAt).toLocaleDateString()
                      : t('common.notAvailable')}
                  </CustomText>
                </View>
              </View>
            </View>

            {/* Account Actions */}
            <View className="mb-4">
              <View className="bg-white dark:bg-neutral-900 rounded-2xl px-4">
                <AccountRow
                  icon="lock-closed-outline"
                  title={t('profile.account.changePassword', { defaultValue: 'Change Password' })}
                  subtitle={t('profile.account.changePasswordSubtitle', { 
                    defaultValue: 'Update your password' 
                  })}
                  onPress={handleChangePassword}
                  isDark={isDark}
                />
                <AccountRow
                  icon="mail-outline"
                  title={t('profile.account.changeEmail', { defaultValue: 'Change Email' })}
                  subtitle={t('profile.account.changeEmailSubtitle', { 
                    defaultValue: 'Update your email address' 
                  })}
                  onPress={handleChangeEmail}
                  isDark={isDark}
                />
              </View>
            </View>

            {/* Danger Zone */}
            <View className="mb-4">
              <View className="bg-white dark:bg-neutral-900 rounded-2xl px-4">
                <AccountRow
                  icon="trash-outline"
                  title={t('profile.account.deleteAccount', { defaultValue: 'Delete Account' })}
                  subtitle={t('profile.account.deleteAccountSubtitle', { 
                    defaultValue: 'Permanently delete your account and all data' 
                  })}
                  onPress={handleDeleteAccount}
                  isDark={isDark}
                  variant="danger"
                />
              </View>
            </View>
          </>
        ) : (
          <>
            {/* Edit Mode */}
            {/* Avatar */}
            <View className="items-center mb-4">
              <View className="w-20 h-20 rounded-full overflow-hidden bg-white dark:bg-neutral-800 border-2 border-primary">
                <Image
                  source={appIcon}
                  className="w-full h-full"
                  resizeMode="contain"
                />
              </View>
              <TouchableOpacity
                onPress={handleChangeAvatar}
                className="mt-2 px-3 py-1.5 bg-primary/15 dark:bg-primary/25 rounded-full"
              >
                <CustomText className="text-primary text-sm" weight="medium">
                  {t('profile.edit.changePhoto', { defaultValue: 'Change Photo' })}
                </CustomText>
              </TouchableOpacity>
            </View>

            {/* Name */}
            <InputField
              label={t('profile.edit.nameLabel', { defaultValue: 'Name' })}
              placeholder={t('profile.edit.namePlaceholder', { defaultValue: 'Enter your name' })}
              value={formData.name}
              onChangeText={value => handleInputChange('name', value)}
              icon="person-outline"
            />

            {/* Username */}
            <InputField
              label={t('profile.edit.usernameLabel', { defaultValue: 'Username' })}
              placeholder={t('profile.edit.usernamePlaceholder', { defaultValue: 'Enter your username' })}
              value={formData.username}
              onChangeText={value => handleInputChange('username', value)}
              icon="at-outline"
            />

            {/* Email */}
            <InputField
              label={t('profile.edit.emailLabel', { defaultValue: 'Email' })}
              placeholder={t('profile.edit.emailPlaceholder', { defaultValue: 'Enter your email' })}
              value={formData.email}
              onChangeText={value => handleInputChange('email', value)}
              keyboardType="email-address"
              icon="mail-outline"
            />

            {/* Phone */}
            <InputField
              label={t('profile.edit.phoneLabel', { defaultValue: 'Phone' })}
              placeholder={t('profile.edit.phonePlaceholder', { defaultValue: 'Enter your phone number' })}
              value={formData.phone}
              onChangeText={value => handleInputChange('phone', value)}
              keyboardType="phone-pad"
              icon="call-outline"
            />

            {/* Bio */}
            <TextArea
              label={t('profile.edit.bioLabel', { defaultValue: 'Bio' })}
              placeholder={t('profile.edit.bioPlaceholder', { defaultValue: 'Tell us about yourself' })}
              value={formData.bio}
              onChangeText={value => handleInputChange('bio', value)}
              rows={4}
            />

            {/* Location */}
            <InputField
              label={t('profile.edit.locationLabel', { defaultValue: 'Location' })}
              placeholder={t('profile.edit.locationPlaceholder', { defaultValue: 'Enter your location' })}
              value={formData.location}
              onChangeText={value => handleInputChange('location', value)}
              icon="location-outline"
            />

            {/* Website */}
            <InputField
              label={t('profile.edit.websiteLabel', { defaultValue: 'Website' })}
              placeholder={t('profile.edit.websitePlaceholder', { defaultValue: 'Enter your website URL' })}
              value={formData.website}
              onChangeText={value => handleInputChange('website', value)}
              keyboardType="url"
              icon="globe-outline"
            />

            {/* Action Buttons */}
            <View className="mt-4 mb-4">
              <CustomButton
                title={loading ? t('common.saving') : t('common.save')}
                onPress={handleSave}
                disabled={loading}
                IconLeft={() => (
                  <Ionicons
                    name="checkmark"
                    size={20}
                    color="#fff"
                    style={{ marginRight: 8 }}
                  />
                )}
              />
            </View>
          </>
        )}

        <View className="h-4" />
      </View>
    </ScrollView>
  );
}
