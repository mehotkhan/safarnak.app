import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { useMemo, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, ScrollView, TouchableOpacity, View, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system/legacy';

import { useGetTripsQuery, useMeQuery, useUpdateUserMutation } from '@api';
import { useTheme } from '@ui/context';
import { CustomText } from '@ui/display';
import { ListItem } from '@ui/display';
import { InputField } from '@ui/forms';
import { CustomButton } from '@ui/forms';
import Colors from '@constants/Colors';
import { useAppSelector } from '@state/hooks';
import { useDateTime } from '@hooks/useDateTime';
import { copyToClipboard } from '@utils/clipboard';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const appIcon = require('@assets/images/icon.png');


export default function ProfileScreen() {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams<{ edit?: string }>();
  const { user: reduxUser } = useAppSelector(state => state.auth);
  const { formatDate, isFuture, isPast } = useDateTime();
  const [isEditing, setIsEditing] = useState(params.edit === 'true');
  const [loading, setLoading] = useState(false);
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  
  // Fetch real user data
  const { data: meData, loading: meLoading, refetch: refetchMe } = useMeQuery({
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all',
  });
  
  // Fetch trips for stats
  const { data: tripsData, loading: tripsLoading } = useGetTripsQuery({
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all',
  });

  const [updateUser, { loading: updateLoading }] = useUpdateUserMutation();
  
  // Prioritize GraphQL user data over Redux (GraphQL has publicKey)
  const user = meData?.me || reduxUser;
  const typedUser = user as NonNullable<typeof meData>['me'];
  const trips = useMemo(() => tripsData?.getTrips ?? [], [tripsData]);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    username: user?.username || '',
    email: '',
    phone: '',
  });

  // Update form data when user data changes (only when not editing)
  useEffect(() => {
    if (!typedUser || isEditing) return;
    
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
      });
    }
    
    // Update avatar from server only when not editing (to avoid overwriting local selection)
    if (typedUser.avatar && typedUser.avatar !== avatarUri && !avatarUri?.startsWith('data:')) {
      setAvatarUri(typedUser.avatar);
    } else if (!typedUser.avatar && avatarUri && !avatarUri.startsWith('data:')) {
      // Clear avatar if server doesn't have one (but keep local base64 selection)
      setAvatarUri(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [typedUser?.id, typedUser?.name, typedUser?.username, typedUser?.email, typedUser?.phone, typedUser?.avatar, isEditing]);
  
  // Calculate stats
  const stats = useMemo(() => {
    const upcomingTrips = trips.filter(trip => 
      trip.status === 'in_progress' || 
      (trip.startDate && isFuture(trip.startDate))
    );
    const pastTrips = trips.filter(trip => 
      trip.status === 'completed' || 
      (trip.endDate && isPast(trip.endDate))
    );
    
    return {
      totalTrips: trips.length,
      upcomingTrips: upcomingTrips.length,
      pastTrips: pastTrips.length,
      // TODO: Add posts and followers when social features are implemented
      posts: 0,
      followers: 0,
    };
  }, [trips, isFuture, isPast]);
  
  const statsLoading = meLoading || tripsLoading;

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
    setIsEditing(true);
  };

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
          // Read file and convert to base64 using legacy FileSystem API
          const base64 = await FileSystem.readAsStringAsync(asset.uri, {
            encoding: FileSystem.EncodingType.Base64,
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
        // Extract MIME type and base64 from data URI
        // Format: data:image/jpeg;base64,<base64-data>
        const parts = avatarUri.split(',');
        if (parts.length === 2) {
          const [mimeTypePart, base64Data] = parts;
          const mimeMatch = mimeTypePart.match(/data:([^;]+)/);
          updateInput.avatarMimeType = mimeMatch ? mimeMatch[1] : 'image/jpeg';
          updateInput.avatarBase64 = base64Data; // Send only the base64 part (no data URI prefix)
          
          if (__DEV__) {
            console.log('[Profile] Preparing avatar upload:', {
              mimeType: updateInput.avatarMimeType,
              base64Length: base64Data.length,
              hasBase64: !!base64Data,
            });
          }
        } else {
          console.warn('[Profile] Invalid avatar data URI format');
        }
      }

      // Check if there's anything to update
      if (Object.keys(updateInput).length === 0) {
        setLoading(false);
        setIsEditing(false);
        return;
      }

      // Call the mutation with cache update
      const result = await updateUser({
        variables: { input: updateInput },
        refetchQueries: ['Me'],
        awaitRefetchQueries: true,
      });

      if (result.data?.updateUser) {
        const updatedUser = result.data.updateUser;
        
        // Refetch user data to ensure everything is in sync
        const refetchResult = await refetchMe();
        
        // Update avatarUri from server response (use refetched data as source of truth)
        if (refetchResult.data?.me?.avatar) {
          setAvatarUri(refetchResult.data.me.avatar);
        } else if (updatedUser.avatar) {
          setAvatarUri(updatedUser.avatar);
        } else {
          // Clear avatar if it was removed
          setAvatarUri(null);
        }
        
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
    });
    setAvatarUri(typedUser?.avatar || null);
    setIsEditing(false);
  };

  const handleSubscription = () => {
    router.push('/(app)/(profile)/subscription' as any);
  };
  
  const handleBookmarks = () => {
    router.push('/(app)/(profile)/bookmarks' as any);
  };


  return (
    <View className="flex-1 bg-white dark:bg-black">
      <Stack.Screen 
        options={{ 
          headerShown: true,
          header: () => (
            <View className="bg-white dark:bg-black border-b border-gray-200 dark:border-neutral-800">
              <View className="flex-row items-center justify-between px-6 py-4 pt-12">
                <View className="flex-row items-center flex-1">
                  <TouchableOpacity
                    onPress={isEditing ? handleChangeAvatar : undefined}
                    disabled={!isEditing}
                    activeOpacity={isEditing ? 0.7 : 1}
                  >
                    <View 
                      className="w-12 h-12 rounded-full overflow-hidden mr-3"
                      style={{ 
                        backgroundColor: isDark ? '#262626' : '#f5f5f5',
                        borderWidth: 2,
                        borderColor: isDark ? Colors.dark.primary : Colors.light.primary,
                      }}
                    >
                      {avatarUri ? (
                        <Image
                          key={avatarUri}
                          source={{ uri: avatarUri }}
                          className="w-full h-full"
                          resizeMode="cover"
                        />
                      ) : typedUser?.avatar ? (
                        <Image
                          key={typedUser.avatar}
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
                  </TouchableOpacity>
                  <View className="flex-1">
                    <CustomText weight="bold" className="text-lg text-black dark:text-white">
                      {user?.name || t('profile.guest')}
                    </CustomText>
                    <CustomText className="text-sm text-gray-600 dark:text-gray-400">
                      {user?.username ? `@${user.username}` : t('profile.description')}
                    </CustomText>
                  </View>
                </View>
                {!isEditing ? (
                  <TouchableOpacity
                    onPress={handleEditProfile}
                    className="w-10 h-10 rounded-full items-center justify-center bg-gray-100 dark:bg-neutral-800"
                  >
                    <Ionicons
                      name="create-outline"
                      size={20}
                      color={isDark ? '#fff' : '#000'}
                    />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    onPress={handleCancel}
                    className="px-3 py-1.5"
                  >
                    <CustomText className="text-primary" weight="medium">
                      {t('common.cancel')}
                    </CustomText>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ),
        }} 
      />

      <ScrollView className="flex-1">
        {isEditing ? (
          <>
            {/* Edit Mode */}
            <View className="px-6 pt-4 pb-4">
              {/* Avatar Edit Section */}
              <View className="mb-6">
                <View className="bg-white dark:bg-neutral-900 rounded-2xl p-4 border border-gray-200 dark:border-neutral-800">
                  <CustomText weight="medium" className="text-base text-black dark:text-white mb-3">
                    {t('profile.edit.avatar', { defaultValue: 'Profile Photo' })}
                  </CustomText>
                  <View className="items-center">
                    <View className="w-24 h-24 rounded-full overflow-hidden bg-white dark:bg-neutral-800 border-2 border-primary mb-3">
                      {avatarUri ? (
                        <Image
                          key={avatarUri}
                          source={{ uri: avatarUri }}
                          className="w-full h-full"
                          resizeMode="cover"
                        />
                      ) : typedUser?.avatar ? (
                        <Image
                          key={typedUser.avatar}
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
                      className="px-4 py-2 bg-primary/15 dark:bg-primary/25 rounded-full"
                    >
                      <CustomText className="text-primary text-sm" weight="medium">
                        {avatarUri ? t('profile.edit.changePhoto', { defaultValue: 'Change Photo' }) : t('profile.edit.addPhoto', { defaultValue: 'Add Photo' })}
                      </CustomText>
                    </TouchableOpacity>
                    {avatarUri && (
                      <TouchableOpacity
                        onPress={() => setAvatarUri(typedUser?.avatar || null)}
                        className="mt-2 px-3 py-1"
                      >
                        <CustomText className="text-red-600 dark:text-red-400 text-xs">
                          {t('profile.edit.removePhoto', { defaultValue: 'Remove' })}
                        </CustomText>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
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

              {/* Action Buttons */}
              <View className="mt-4 mb-4">
                <CustomButton
                  title={loading || updateLoading ? t('common.saving') : t('common.save')}
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
            </View>
          </>
        ) : (
          <>
            {/* Stats */}
            <View className="px-6 pt-4 pb-4">
          <View className="flex-row items-center justify-around py-4 bg-gray-50 dark:bg-neutral-900 rounded-2xl">
            <TouchableOpacity 
              className="items-center flex-1"
              onPress={handleMyTrips}
              activeOpacity={0.7}
            >
              <CustomText weight="bold" className="text-xl text-black dark:text-white">
                {statsLoading ? '...' : stats.totalTrips}
              </CustomText>
              <CustomText className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {t('profile.trips')}
              </CustomText>
            </TouchableOpacity>
            <View className="w-px h-10 bg-gray-200 dark:bg-neutral-800" />
            <View className="items-center flex-1">
              <CustomText weight="bold" className="text-xl text-black dark:text-white">
                {stats.upcomingTrips}
              </CustomText>
              <CustomText className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {t('profile.upcoming')}
              </CustomText>
            </View>
            <View className="w-px h-10 bg-gray-200 dark:bg-neutral-800" />
            <View className="items-center flex-1">
              <CustomText weight="bold" className="text-xl text-black dark:text-white">
                {stats.pastTrips}
              </CustomText>
              <CustomText className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {t('profile.completed')}
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
        {/* User Account Details */}
        {user && (
          <View className="px-6 pb-4">
            <View className="bg-gray-50 dark:bg-neutral-900 rounded-2xl p-4">
              <CustomText weight="bold" className="text-base text-black dark:text-white mb-3">
                {t('profile.accountDetails') || 'Account Details'}
              </CustomText>
              
              {/* User ID */}
              <View className="mb-3">
                <CustomText className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                  {t('profile.userId') || 'User ID'}
                </CustomText>
                <TouchableOpacity
                  onPress={() => copyToClipboard(user.id, 'User ID', t)}
                  activeOpacity={0.7}
                  className="flex-row items-center"
                >
                  <CustomText className="text-sm text-gray-800 dark:text-gray-200 font-mono flex-1">
                    {user.id.substring(0, 8)}...{user.id.substring(user.id.length - 8)}
                  </CustomText>
                  <Ionicons name="copy-outline" size={16} color={isDark ? '#9ca3af' : '#6b7280'} />
                </TouchableOpacity>
              </View>

       

              {/* Member Since */}
              {user.createdAt && (
                <View>
                  <CustomText className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                    {t('profile.memberSince') || 'Member Since'}
                  </CustomText>
                  <CustomText className="text-sm text-gray-800 dark:text-gray-200">
                    {formatDate(user.createdAt, 'long')}
                  </CustomText>
                </View>
              )}
            </View>
          </View>
        )}

  

        {/* Menu - Simplified, no groupings */}
        <View className="px-6 pb-4">
          <View className="bg-white dark:bg-neutral-900 rounded-2xl px-4">
            <ListItem
              icon="bookmark-outline"
              title={t('profile.bookmarksTitle')}
              subtitle={t('profile.bookmarksSubtitle')}
              onPress={handleBookmarks}
              iconColor={isDark ? Colors.dark.primary : Colors.light.primary}
            />
            <ListItem
              icon="mail-outline"
              title={t('me.messages')}
              subtitle={t('me.messagesSubtitle')}
              onPress={handleMessages}
              badge={3}
              iconColor={isDark ? Colors.dark.primary : Colors.light.primary}
            />
            <ListItem
              icon="settings-outline"
              title={t('profile.settings')}
              subtitle={t('settings.subtitle')}
              onPress={handleSettings}
              iconColor={isDark ? Colors.dark.primary : Colors.light.primary}
            />
            <ListItem
              icon="card-outline"
              title={t('me.payments')}
              subtitle={t('me.paymentsSubtitle')}
              onPress={() => router.push('/(app)/(profile)/payments' as any)}
              iconColor={isDark ? Colors.dark.primary : Colors.light.primary}
            />
          </View>
          <View className="h-8" />
        </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}
