import { Alert } from 'react-native';
import { useCallback } from 'react';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { useCreateConversationMutation, type CreateConversationMutationVariables } from '@api';

export function useMessagingActions() {
  const router = useRouter();
  const { t } = useTranslation();
  const [createConversationMutation, { loading }] = useCreateConversationMutation();

  const navigateToConversation = useCallback(
    (conversationId: string) => {
      router.push(`/(app)/(inbox)/messages/${conversationId}` as any);
    },
    [router],
  );

  const ensureConversation = useCallback(
    async (variables: CreateConversationMutationVariables) => {
      const { data } = await createConversationMutation({ variables });
      const conversationId = data?.createConversation?.id;
      if (!conversationId) {
        throw new Error('conversation_not_created');
      }
      return conversationId;
    },
    [createConversationMutation],
  );

  const openOrCreateDm = useCallback(
    async (targetUserId: string) => {
      try {
        const conversationId = await ensureConversation({ dmWithUserId: targetUserId });
        navigateToConversation(conversationId);
      } catch (error: any) {
        Alert.alert(
          t('messages.openConversationErrorTitle') || 'Unable to start chat',
          error?.message || t('messages.openConversationErrorMessage') || 'Please try again later.',
        );
      }
    },
    [ensureConversation, navigateToConversation, t],
  );

  const openTripChat = useCallback(
    async (tripId: string) => {
      try {
        const conversationId = await ensureConversation({ tripId });
        navigateToConversation(conversationId);
      } catch (error: any) {
        Alert.alert(
          t('messages.openConversationErrorTitle') || 'Unable to open chat',
          error?.message || t('messages.openConversationErrorMessage') || 'Please try again later.',
        );
      }
    },
    [ensureConversation, navigateToConversation, t],
  );

  return {
    openOrCreateDm,
    openTripChat,
    creatingConversation: loading,
  };
}

