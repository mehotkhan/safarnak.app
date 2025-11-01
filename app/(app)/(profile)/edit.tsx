import { useState } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { CustomText } from '@components/ui/CustomText';
import InputField from '@components/ui/InputField';
import TextArea from '@components/ui/TextArea';
import CustomButton from '@components/ui/CustomButton';
import { useTheme } from '@components/context/ThemeContext';
import { useAppSelector } from '@store/hooks';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const appIcon = require('@assets/images/icon.png');

export default function EditProfileScreen() {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const router = useRouter();
  const { user } = useAppSelector(state => state.auth);
  const [loading, setLoading] = useState(false);

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
      t('profile.edit.changeAvatarMessage')
    );
  };

  const handleSave = async () => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      Alert.alert(
        t('common.success'),
        t('profile.edit.successMessage'),
        [
          {
            text: t('common.ok'),
            onPress: () => router.back(),
          },
        ]
      );
    }, 1000);
  };

  return (
    <ScrollView className="flex-1 bg-white dark:bg-black">
      <Stack.Screen options={{ title: t('profile.edit.title'), headerShown: true }} />

      <View className="px-6 py-6">
        {/* Avatar */}
        <View className="items-center mb-6">
          <View className="w-24 h-24 rounded-full overflow-hidden bg-white dark:bg-neutral-800 border-2 border-primary">
            <Image
              source={appIcon}
              className="w-full h-full"
              resizeMode="contain"
            />
          </View>
          <TouchableOpacity
            onPress={handleChangeAvatar}
            className="mt-3 px-4 py-2 bg-primary/15 dark:bg-primary/25 rounded-full"
          >
            <CustomText className="text-primary" weight="medium">
              {t('profile.edit.changePhoto')}
            </CustomText>
          </TouchableOpacity>
        </View>

        {/* Name */}
        <InputField
          label={t('profile.edit.nameLabel')}
          placeholder={t('profile.edit.namePlaceholder')}
          value={formData.name}
          onChangeText={value => handleInputChange('name', value)}
          icon="person-outline"
        />

        {/* Username */}
        <InputField
          label={t('profile.edit.usernameLabel')}
          placeholder={t('profile.edit.usernamePlaceholder')}
          value={formData.username}
          onChangeText={value => handleInputChange('username', value)}
          icon="at-outline"
        />

        {/* Email */}
        <InputField
          label={t('profile.edit.emailLabel')}
          placeholder={t('profile.edit.emailPlaceholder')}
          value={formData.email}
          onChangeText={value => handleInputChange('email', value)}
          keyboardType="email-address"
          icon="mail-outline"
        />

        {/* Phone */}
        <InputField
          label={t('profile.edit.phoneLabel')}
          placeholder={t('profile.edit.phonePlaceholder')}
          value={formData.phone}
          onChangeText={value => handleInputChange('phone', value)}
          keyboardType="phone-pad"
          icon="call-outline"
        />

        {/* Bio */}
        <TextArea
          label={t('profile.edit.bioLabel')}
          placeholder={t('profile.edit.bioPlaceholder')}
          value={formData.bio}
          onChangeText={value => handleInputChange('bio', value)}
          rows={4}
        />

        {/* Location */}
        <InputField
          label={t('profile.edit.locationLabel')}
          placeholder={t('profile.edit.locationPlaceholder')}
          value={formData.location}
          onChangeText={value => handleInputChange('location', value)}
          icon="location-outline"
        />

        {/* Website */}
        <InputField
          label={t('profile.edit.websiteLabel')}
          placeholder={t('profile.edit.websitePlaceholder')}
          value={formData.website}
          onChangeText={value => handleInputChange('website', value)}
          keyboardType="url"
          icon="globe-outline"
        />

        {/* Save Button */}
        <View className="mt-4">
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

        {/* Cancel Button */}
        <View className="mt-3 mb-6">
          <CustomButton
            title={t('common.cancel')}
            onPress={() => router.back()}
            bgVariant="secondary"
          />
        </View>
      </View>
    </ScrollView>
  );
}

