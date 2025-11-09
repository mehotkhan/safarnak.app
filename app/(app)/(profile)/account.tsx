import { useState, useEffect } from 'react';
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
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { CustomText } from '@components/ui/CustomText';
import { ListItem } from '@components/ui/ListItem';
import InputField from '@components/ui/InputField';
import TextArea from '@components/ui/TextArea';
import CustomButton from '@components/ui/CustomButton';
import { useTheme } from '@components/context/ThemeContext';
import { useAppSelector } from '@store/hooks';
import { useMeQuery, useUpdateUserMutation } from '@api';
import Colors from '@constants/Colors';
import { useDateTime } from '@utils/datetime';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const appIcon = require('@assets/images/icon.png');


export default function AccountScreen() {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const params = useLocalSearchParams<{ edit?: string }>();
  const { user: reduxUser } = useAppSelector(state => state.auth);
  const { formatDate } = useDateTime();
  const [isEditing, setIsEditing] = useState(params.edit === 'true');
  const [loading, setLoading] = useState(false);
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  
  const { data: meData, refetch: refetchMe } = useMeQuery({
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all',
  });

  const [updateUser, { loading: updateLoading }] = useUpdateUserMutation();
  
  const user = meData?.me || reduxUser;
  
  // Type assertion for user to include optional fields from GraphQL query
  // Use NonNullable to handle the null case from the query
  const typedUser = user as NonNullable<typeof meData>['me'];

  const [formData, setFormData] = useState({
    name: user?.name || '',
    username: user?.username || '',
    email: '',
    phone: '',
    bio: '',
    location: '',
    website: '',
  });

  // Update form data when user data changes
  useEffect(() => {
    if (!typedUser) return;
    
    // Use a ref to track if we've initialized to avoid unnecessary updates
    const shouldUpdate = 
      formData.name !== (typedUser.name || '') ||
      formData.username !== (typedUser.username || '') ||
      formData.email !== (typedUser.email || '') ||
      formData.phone !== (typedUser.phone || '');
    
    if (shouldUpdate) {
      setFormData({
        name: typedUser.name || '',
        username: typedUser.username || '',
        email: typedUser.email || '',
        phone: typedUser.phone || '',
        bio: formData.bio,
        location: formData.location,
        website: formData.website,
      });
    }
    
    if (typedUser.avatar !== avatarUri) {
      setAvatarUri(typedUser.avatar || null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [typedUser?.id, typedUser?.name, typedUser?.username, typedUser?.email, typedUser?.phone, typedUser?.avatar]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleChangeAvatar = async () => {
    try {
      // Request permissions
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          t('common.error'),
          t('profile.edit.permissionDenied', {
            defaultValue: 'Permission to access media library is required to change avatar.',
          })
        );
        return;
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        
        if (asset.uri) {
          // Read file and convert to base64
          const base64 = await FileSystem.readAsStringAsync(asset.uri, {
            encoding: 'base64' as const,
          });

          // Determine MIME type from URI or default to jpeg
          let mimeType = 'image/jpeg';
          if (asset.uri.endsWith('.png')) {
            mimeType = 'image/png';
          } else if (asset.uri.endsWith('.gif')) {
            mimeType = 'image/gif';
          } else if (asset.uri.endsWith('.webp')) {
            mimeType = 'image/webp';
          }

          // Store base64 data temporarily (will be sent on save)
          setAvatarUri(`data:${mimeType};base64,${base64}`);
        }
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert(
        t('common.error'),
        t('profile.edit.avatarError', {
          defaultValue: 'Failed to select image. Please try again.',
        })
      );
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);

      // Prepare update input
      const updateInput: {
        name?: string;
        username?: string;
        email?: string;
        phone?: string;
        avatarBase64?: string;
        avatarMimeType?: string;
      } = {};

      if (formData.name && formData.name !== user?.name) {
        updateInput.name = formData.name;
      }

      if (formData.username && formData.username !== user?.username) {
        updateInput.username = formData.username;
      }

      if (formData.email) {
        updateInput.email = formData.email;
      }

      if (formData.phone) {
        updateInput.phone = formData.phone;
      }

      // Handle avatar if changed
      if (avatarUri && avatarUri.startsWith('data:')) {
        const [mimeType, base64] = avatarUri.split(',');
        const mimeMatch = mimeType.match(/data:([^;]+)/);
        updateInput.avatarMimeType = mimeMatch ? mimeMatch[1] : 'image/jpeg';
        updateInput.avatarBase64 = base64;
      }

      // Check if there's anything to update
      if (Object.keys(updateInput).length === 0) {
        setLoading(false);
        setIsEditing(false);
        return;
      }

      // Call the mutation
      const result = await updateUser({
        variables: { input: updateInput },
        refetchQueries: ['Me'],
      });

      if (result.data?.updateUser) {
        // Refetch user data
        await refetchMe();
        
        setLoading(false);
        setIsEditing(false);
        
        Alert.alert(
          t('common.success'),
          t('profile.edit.successMessage', {
            defaultValue: 'Profile updated successfully!',
          }),
          [{ text: t('common.ok') }]
        );
      }
    } catch (error: any) {
      console.error('Error updating profile:', error);
      setLoading(false);
      
      Alert.alert(
        t('common.error'),
        error.message || t('profile.edit.updateError', {
          defaultValue: 'Failed to update profile. Please try again.',
        })
      );
    }
  };

  const handleCancel = () => {
    setFormData({
      name: typedUser?.name || '',
      username: typedUser?.username || '',
      email: typedUser?.email || '',
      phone: typedUser?.phone || '',
      bio: '',
      location: '',
      website: '',
    });
    setAvatarUri(typedUser?.avatar || null);
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
                    {typedUser?.avatar ? (
                      <Image
                        source={{ uri: typedUser.avatar }}
                        className="w-full h-full"
                        resizeMode="cover"
                      />
                    ) : (
                      <Image
                        source={appIcon}
                        className="w-full h-full"
                        resizeMode="contain"
                      />
                    )}
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
                      ? formatDate(user.createdAt, 'medium')
                      : t('common.notAvailable')}
                  </CustomText>
                </View>
              </View>
            </View>

            {/* Account Actions */}
            <View className="mb-4">
              <View className="bg-white dark:bg-neutral-900 rounded-2xl px-4">
                <ListItem
                  icon="lock-closed-outline"
                  title={t('profile.account.changePassword', { defaultValue: 'Change Password' })}
                  subtitle={t('profile.account.changePasswordSubtitle', { 
                    defaultValue: 'Update your password' 
                  })}
                  onPress={handleChangePassword}
                  iconColor={isDark ? Colors.dark.primary : Colors.light.primary}
                />
                <ListItem
                  icon="mail-outline"
                  title={t('profile.account.changeEmail', { defaultValue: 'Change Email' })}
                  subtitle={t('profile.account.changeEmailSubtitle', { 
                    defaultValue: 'Update your email address' 
                  })}
                  onPress={handleChangeEmail}
                  iconColor={isDark ? Colors.dark.primary : Colors.light.primary}
                />
              </View>
            </View>

            {/* Danger Zone */}
            <View className="mb-4">
              <View className="bg-white dark:bg-neutral-900 rounded-2xl px-4">
                <ListItem
                  icon="trash-outline"
                  title={t('profile.account.deleteAccount', { defaultValue: 'Delete Account' })}
                  subtitle={t('profile.account.deleteAccountSubtitle', { 
                    defaultValue: 'Permanently delete your account and all data' 
                  })}
                  onPress={handleDeleteAccount}
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
                {avatarUri ? (
                  <Image
                    source={{ uri: avatarUri }}
                    className="w-full h-full"
                    resizeMode="cover"
                  />
                ) : typedUser?.avatar ? (
                  <Image
                    source={{ uri: typedUser.avatar }}
                    className="w-full h-full"
                    resizeMode="cover"
                  />
                ) : (
                  <Image
                    source={appIcon}
                    className="w-full h-full"
                    resizeMode="contain"
                  />
                )}
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
                disabled={loading || updateLoading}
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
