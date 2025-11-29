import { useState } from 'react';
import {
  View,
  Modal,
  TouchableOpacity,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { CustomText } from '@ui/display';
import { CustomButton } from '@ui/forms';
import { useTheme } from '@ui/context';
import { useCreatePostMutation, GetPostsDocument } from '@api';

interface ShareModalProps {
  visible: boolean;
  onClose: () => void;
  type?: 'trip' | 'tour' | 'place';
  relatedId?: string;
  entityTitle?: string;
}

export default function ShareModal({
  visible,
  onClose,
  type,
  relatedId,
  entityTitle,
}: ShareModalProps) {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const [content, setContent] = useState('');
  const [createPost, { loading }] = useCreatePostMutation({
    refetchQueries: [GetPostsDocument],
    onCompleted: () => {
      Alert.alert(
        t('common.success') || 'Success',
        t('feed.share.success') || 'Shared successfully!',
        [
          {
            text: t('common.ok') || 'OK',
            onPress: () => {
              setContent('');
              onClose();
            },
          },
        ]
      );
    },
    onError: (error) => {
      Alert.alert(
        t('common.error') || 'Error',
        error.message || t('feed.share.error') || 'Failed to share'
      );
    },
  });

  const handleShare = async () => {
    // Validate: if type is provided, relatedId must also be provided
    if ((type && !relatedId) || (!type && relatedId)) {
      Alert.alert(t('common.error') || 'Error', t('feed.share.invalidItem') || 'Invalid item to share');
      return;
    }

    // Require at least content for normal posts
    if (!type && !relatedId && !content.trim()) {
      Alert.alert(t('common.error') || 'Error', t('feed.share.contentRequired') || 'Please add some content to your post');
      return;
    }

    try {
      await createPost({
        variables: {
          input: {
            ...(type && relatedId ? { type, relatedId } : {}),
            content: content.trim() || undefined,
            attachments: [],
          },
        },
      });
    } catch (error: any) {
      // Error handled by onError callback
      console.error('Share error:', error);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <View className="flex-1 bg-black/50">
          <TouchableOpacity
            className="absolute inset-0"
            activeOpacity={1}
            onPress={onClose}
          />
          <View
            className={`bg-white dark:bg-neutral-900 ${
              Platform.OS === 'ios' ? 'pb-8' : 'pb-6'
            }`}
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: -2 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 10,
              height: '100%',
              width: '100%',
            }}
          >
            {/* Header */}
            <View className="px-6 pt-6 pb-4 border-b border-gray-200 dark:border-neutral-800">
              <View className="flex-row items-center justify-between">
                <CustomText weight="bold" className="text-2xl text-black dark:text-white">
                  {t('feed.share.title') || 'Share to Feed'}
                </CustomText>
                <TouchableOpacity 
                  onPress={onClose}
                  className="w-8 h-8 items-center justify-center rounded-full bg-gray-100 dark:bg-neutral-800"
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name="close"
                    size={20}
                    color={isDark ? '#9ca3af' : '#6b7280'}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Content */}
            <ScrollView 
              className="flex-1"
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={{
                flexGrow: 1,
                paddingHorizontal: 24,
                paddingTop: 16,
                paddingBottom: 24,
              }}
            >
              {entityTitle && type && relatedId && (
                <View className="mb-4 p-4 bg-gray-50 dark:bg-neutral-800/50 rounded-xl border border-gray-200 dark:border-neutral-700">
                  <CustomText className="text-xs text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">
                    {t('feed.share.sharing') || 'Sharing:'}
                  </CustomText>
                  <CustomText weight="bold" className="text-base text-black dark:text-white">
                    {entityTitle}
                  </CustomText>
                </View>
              )}

              <View className="mb-6">
                <CustomText className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                  {t('feed.share.addMessage') || 'Add a message (optional)'}
                </CustomText>
                <TextInput
                  value={content}
                  onChangeText={setContent}
                  placeholder={t('feed.share.placeholder') || 'What\'s on your mind?'}
                  placeholderTextColor={isDark ? '#6b7280' : '#9ca3af'}
                  multiline
                  numberOfLines={8}
                  className="bg-gray-50 dark:bg-neutral-800 rounded-xl p-4 text-base"
                  style={{
                    textAlignVertical: 'top',
                    color: isDark ? '#fff' : '#000',
                    minHeight: 200,
                    borderWidth: 1,
                    borderColor: isDark ? '#374151' : '#e5e7eb',
                  }}
                />
              </View>

              <View className="flex-row gap-3 pb-4">
                <CustomButton
                  title={t('common.cancel') || 'Cancel'}
                  onPress={onClose}
                  bgVariant="outline"
                  textVariant="default"
                  className="flex-1"
                  disabled={loading}
                />
                <CustomButton
                  title={t('feed.share.share') || 'Share'}
                  onPress={handleShare}
                  className="flex-1"
                  disabled={loading}
                  loading={loading}
                />
              </View>
            </ScrollView>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

