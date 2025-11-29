import { useState, useCallback } from 'react';
import { View, TextInput, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { CustomText } from '@ui/display';
import { CustomButton } from '@ui/forms';
import { useCreatePostMutation } from '@api';

export default function CreatePostScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [createPost] = useCreatePostMutation();

  const handleSubmit = useCallback(async () => {
    if (!content.trim()) {
      Alert.alert(t('common.error'), t('feed.share.contentRequired'));
      return;
    }
    try {
      setSubmitting(true);
      await createPost({
        variables: { input: { content } },
      } as any);
      router.back();
    } catch (e: any) {
      Alert.alert(t('common.error'), e?.message || t('feed.share.postFailed') || 'Failed to post');
    } finally {
      setSubmitting(false);
    }
  }, [content, createPost, router, t]);

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white dark:bg-black"
      behavior={Platform.select({ ios: 'padding', android: undefined })}
    >
      <Stack.Screen
        options={{
          title: t('feed.newPost.title'),
          headerShown: true,
        }}
      />
      <View className="flex-1 px-4 py-4">
        <CustomText className="text-gray-700 dark:text-gray-300 mb-2">
          {t('feed.share.addMessage')}
        </CustomText>
        <View className="rounded-xl border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
          <TextInput
            value={content}
            onChangeText={setContent}
            placeholder={t('feed.share.placeholder') || "What's on your mind?"}
            placeholderTextColor="#9ca3af"
            multiline
            className="min-h-40 p-4 text-base text-black dark:text-white"
          />
        </View>
        <View className="mt-4">
          <CustomButton
            title={submitting ? t('feed.share.sharing') : t('feed.share.share')}
            onPress={handleSubmit}
            disabled={submitting || !content.trim()}
            IconLeft={() => (
              <Ionicons
                name="paper-plane-outline"
                size={18}
                color="#fff"
                style={{ marginRight: 8 }}
              />
            )}
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}


