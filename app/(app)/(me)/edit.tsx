import { useState } from 'react';
import { View, ScrollView, Alert, Image } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system/legacy';

import { useMeQuery, useUpdateUserMutation, useGenerateAvatarMutation } from '@api';
import { useTheme } from '@ui/context';
import { InputField, CustomButton } from '@ui/forms';
import Colors from '@constants/Colors';
import { useAppSelector } from '@state/hooks';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const appIcon = require('@assets/images/icon.webp');

export default function EditProfileScreen() {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const router = useRouter();
  const { user: reduxUser } = useAppSelector(state => state.auth);

  const { data: meData, refetch: refetchMe } = useMeQuery({
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all',
  });

  const user = meData?.me || reduxUser;
  const userAvatar = (user as { avatar?: string } | null | undefined)?.avatar ?? null;
  const [updateUser, { loading: updating }] = useUpdateUserMutation();
  const [generateAvatar, { loading: generatingAvatar }] = useGenerateAvatarMutation();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    username: user?.username || '',
    email: (user as any)?.email || '',
    phone: (user as any)?.phone || '',
  });
  const [avatarUri, setAvatarUri] = useState<string | null>(userAvatar);

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleChangeAvatar = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          t('common.error'),
          t('profile.edit.permissionDenied', {
            defaultValue: 'Permission to access media library is required to change avatar.',
          }),
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        if (asset.uri) {
          const base64 = await FileSystem.readAsStringAsync(asset.uri, {
            encoding: FileSystem.EncodingType.Base64,
          });

          let mimeType = 'image/jpeg';
          if (asset.uri.endsWith('.png')) mimeType = 'image/png';
          else if (asset.uri.endsWith('.gif')) mimeType = 'image/gif';
          else if (asset.uri.endsWith('.webp')) mimeType = 'image/webp';

          setAvatarUri(`data:${mimeType};base64,${base64}`);
        }
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert(
        t('common.error'),
        t('profile.edit.avatarError', {
          defaultValue: 'Failed to select image. Please try again.',
        }),
      );
    }
  };

  const handleGenerateAvatar = async () => {
    try {
      const result = await generateAvatar({
        variables: { style: 'professional' },
        refetchQueries: ['Me'],
        awaitRefetchQueries: true,
      });

      if (result.data?.generateAvatar) {
        const refetched = await refetchMe();
        const avatarUrl = refetched.data?.me?.avatar || result.data.generateAvatar.avatar;
        if (avatarUrl) {
          const separator = avatarUrl.includes('?') ? '&' : '?';
          setAvatarUri(`${avatarUrl}${separator}t=${Date.now()}`);
        }

        Alert.alert(
          t('common.success'),
          t('profile.edit.avatarGenerated', {
            defaultValue: 'Avatar generated successfully!',
          }),
        );
      }
    } catch (error: any) {
      console.error('Error generating avatar:', error);
      Alert.alert(
        t('common.error'),
        error.message ||
          t('profile.edit.avatarGenerateError', {
            defaultValue: 'Failed to generate avatar. Please try again.',
          }),
      );
    }
  };

  const handleSave = async () => {
    try {
      const input: any = {};
      if (formData.name && formData.name !== user?.name) input.name = formData.name;
      if (formData.username && formData.username !== user?.username) input.username = formData.username;
      if (formData.email) input.email = formData.email;
      if (formData.phone) input.phone = formData.phone;

      if (avatarUri && avatarUri.startsWith('data:')) {
        const parts = avatarUri.split(',');
        if (parts.length === 2) {
          const [mimePart, base64] = parts;
          const mimeMatch = mimePart.match(/data:([^;]+)/);
          input.avatarMimeType = mimeMatch ? mimeMatch[1] : 'image/jpeg';
          input.avatarBase64 = base64;
        }
      }

      if (Object.keys(input).length === 0) {
        router.back();
        return;
      }

      const result = await updateUser({
        variables: { input },
        refetchQueries: ['Me'],
        awaitRefetchQueries: true,
      });

      if (result.data?.updateUser) {
        await refetchMe();
        Alert.alert(
          t('common.success'),
          t('profile.edit.successMessage', {
            defaultValue: 'Profile updated successfully!',
          }),
        );
        router.back();
      }
    } catch (error: any) {
      console.error('Error updating profile:', error);
      Alert.alert(
        t('common.error'),
        error.message ||
          t('profile.edit.updateError', {
            defaultValue: 'Failed to update profile. Please try again.',
          }),
      );
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <View className="flex-1 bg-white dark:bg-black">
      <Stack.Screen
        options={{
          title: t('profile.edit.title', { defaultValue: 'Edit Profile' }),
          headerShown: true,
        }}
      />

      <ScrollView className="flex-1" contentContainerStyle={{ padding: 16, paddingBottom: 24 }}>
        {/* Avatar - compact */}
        <View className="mb-6 items-center">
          <View
            className="mb-3 size-24 overflow-hidden rounded-full"
            style={{
              backgroundColor: isDark ? '#262626' : '#f5f5f5',
              borderWidth: 2,
              borderColor: isDark ? Colors.dark.primary : Colors.light.primary,
            }}
          >
            {avatarUri ? (
              <Image source={{ uri: avatarUri }} className="size-full" resizeMode="cover" />
            ) : userAvatar ? (
              <Image source={{ uri: userAvatar }} className="size-full" resizeMode="cover" />
            ) : (
              <Image source={appIcon} className="size-full" resizeMode="contain" />
            )}
          </View>

          <View className="w-full flex-row gap-2 px-4">
            <CustomButton
              title={t('profile.edit.changeAvatar', { defaultValue: 'Change Photo' })}
              onPress={handleChangeAvatar}
              bgVariant="secondary"
              className="flex-1"
              IconLeft={() => (
                <Ionicons
                  name="image-outline"
                  size={16}
                  color={isDark ? '#fff' : '#000'}
                  style={{ marginRight: 4 }}
                />
              )}
            />
            <CustomButton
              title={t('profile.edit.generateAvatar', { defaultValue: 'AI Generate' })}
              onPress={handleGenerateAvatar}
              loading={generatingAvatar}
              className="flex-1"
              IconLeft={() => (
                <Ionicons name="sparkles-outline" size={16} color="#fff" style={{ marginRight: 4 }} />
              )}
            />
          </View>
        </View>

        {/* Form - compact spacing */}
        <View className="mb-6 gap-3">
          <InputField
            label={t('profile.edit.nameLabel', { defaultValue: 'Name' })}
            placeholder={t('profile.edit.namePlaceholder', { defaultValue: 'Your full name' })}
            value={formData.name}
            onChangeText={text => handleInputChange('name', text)}
            icon="person-outline"
          />
          <InputField
            label={t('profile.edit.usernameLabel', { defaultValue: 'Username' })}
            placeholder={t('profile.edit.usernamePlaceholder', { defaultValue: 'your_username' })}
            value={formData.username}
            onChangeText={text => handleInputChange('username', text)}
            icon="at-outline"
          />
          <InputField
            label={t('profile.edit.emailLabel', { defaultValue: 'Email' })}
            placeholder={t('profile.edit.emailPlaceholder', { defaultValue: 'you@example.com' })}
            value={formData.email}
            onChangeText={text => handleInputChange('email', text)}
            icon="mail-outline"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <InputField
            label={t('profile.edit.phoneLabel', { defaultValue: 'Phone' })}
            placeholder={t('profile.edit.phonePlaceholder', { defaultValue: '+1234567890' })}
            value={formData.phone}
            onChangeText={text => handleInputChange('phone', text)}
            icon="call-outline"
            keyboardType="phone-pad"
          />
        </View>

        {/* Actions - compact */}
        <View className="flex-row gap-2">
          <CustomButton
            title={t('common.cancel')}
            onPress={handleCancel}
            bgVariant="secondary"
            className="flex-1"
          />
          <CustomButton
            title={t('common.save')}
            onPress={handleSave}
            loading={updating}
            className="flex-1"
          />
        </View>
      </ScrollView>
    </View>
  );
}


