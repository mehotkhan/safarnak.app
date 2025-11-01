import { useState } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { CustomText } from '@components/ui/CustomText';
import TextArea from '@components/ui/TextArea';
import CustomButton from '@components/ui/CustomButton';
import { useTheme } from '@components/context/ThemeContext';
import InputField from '@components/ui/InputField';

const postTypes = [
  { id: 'trip', label: 'Trip', icon: 'airplane' },
  { id: 'place', label: 'Place', icon: 'location' },
  { id: 'experience', label: 'Experience', icon: 'star' },
  { id: 'photo', label: 'Photo', icon: 'image' },
];

export default function CreatePostScreen() {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    type: 'trip',
    location: '',
    images: [] as string[],
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSelectType = (type: string) => {
    setFormData(prev => ({ ...prev, type }));
  };

  const handleAddImage = () => {
    // Simulate image picker
    Alert.alert(t('feed.newPost.imagePickerTitle'), t('feed.newPost.imagePickerMessage'));
  };

  const handleSubmit = async () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      Alert.alert(t('common.error'), t('feed.newPost.errors.titleContentRequired'));
      return;
    }

    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      Alert.alert(
        t('common.success'),
        t('feed.newPost.successMessage'),
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
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-white dark:bg-black"
    >
      <Stack.Screen options={{ title: t('feed.newPost.title'), headerShown: true }} />

      <ScrollView className="flex-1 px-6 py-4">
        {/* Post Type Selection */}
        <View className="mb-4">
          <CustomText
            weight="medium"
            className="text-base text-black dark:text-white mb-2"
          >
            {t('feed.newPost.postType')}
          </CustomText>
          <View className="flex-row flex-wrap gap-2">
            {postTypes.map(type => (
              <TouchableOpacity
                key={type.id}
                onPress={() => handleSelectType(type.id)}
                className={`flex-row items-center px-4 py-2 rounded-full border ${
                  formData.type === type.id
                    ? 'bg-primary border-primary'
                    : 'bg-white dark:bg-neutral-900 border-gray-300 dark:border-neutral-700'
                }`}
              >
                <Ionicons
                  name={type.icon as any}
                  size={16}
                  color={formData.type === type.id ? '#fff' : (isDark ? '#9ca3af' : '#6b7280')}
                />
                <CustomText
                  className={`ml-2 ${
                    formData.type === type.id
                      ? 'text-white'
                      : 'text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {t(`feed.newPost.types.${type.label.toLowerCase()}`)}
                </CustomText>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Title */}
        <View className="mb-4">
          <InputField
            label={t('feed.newPost.titleLabel')}
            placeholder={t('feed.newPost.titlePlaceholder')}
            value={formData.title}
            onChangeText={value => handleInputChange('title', value)}
            icon="text-outline"
          />
        </View>

        {/* Location */}
        <View className="mb-4">
          <InputField
            label={t('feed.newPost.locationLabel')}
            placeholder={t('feed.newPost.locationPlaceholder')}
            value={formData.location}
            onChangeText={value => handleInputChange('location', value)}
            icon="location-outline"
          />
        </View>

        {/* Content */}
        <View className="mb-4">
          <TextArea
            label={t('feed.newPost.contentLabel')}
            placeholder={t('feed.newPost.contentPlaceholder')}
            value={formData.content}
            onChangeText={value => handleInputChange('content', value)}
            rows={8}
          />
        </View>

        {/* Images */}
        <View className="mb-4">
          <CustomText
            weight="medium"
            className="text-base text-black dark:text-white mb-2"
          >
            {t('feed.newPost.photosLabel')}
          </CustomText>
          <TouchableOpacity
            onPress={handleAddImage}
            className="h-32 bg-gray-100 dark:bg-neutral-900 rounded-2xl border-2 border-dashed border-gray-300 dark:border-neutral-700 items-center justify-center"
          >
            <Ionicons name="camera" size={40} color={isDark ? '#9ca3af' : '#6b7280'} />
            <CustomText className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              {t('feed.newPost.addPhotos')}
            </CustomText>
          </TouchableOpacity>

          {formData.images.length > 0 && (
            <View className="flex-row flex-wrap gap-2 mt-3">
              {formData.images.map((image, index) => (
                <View key={index} className="w-20 h-20 rounded-lg bg-gray-200 dark:bg-neutral-800" />
              ))}
            </View>
          )}
        </View>

        {/* Submit Button */}
        <CustomButton
          title={loading ? t('feed.newPost.posting') : t('feed.newPost.postButton')}
          onPress={handleSubmit}
          disabled={loading}
          IconLeft={() => (
            <Ionicons
              name="send"
              size={20}
              color="#fff"
              style={{ marginRight: 8 }}
            />
          )}
        />

        <View className="h-8" />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

