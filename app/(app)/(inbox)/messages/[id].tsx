import { useCallback, useEffect, useRef } from 'react';
import {
  ActivityIndicator,
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useLocalSearchParams, Stack } from 'expo-router';
import { CustomText } from '@ui/display';
import { useTheme } from '@ui/context';
import Colors from '@constants/Colors';
import { useDateTime } from '@hooks/useDateTime';
import { useConversation, useConversationMessages, useSendMessage } from '@hooks/useConversations';
import { FloatingChatInput } from '@ui/chat';
import { useAppSelector } from '@state/hooks';
import { Ionicons } from '@expo/vector-icons';

const MessageBubble = ({
  text,
  timestamp,
  isOwnMessage,
  pending,
}: {
  text: string;
  timestamp?: string | null;
  isOwnMessage: boolean;
  pending?: boolean;
}) => {
  const { formatTime } = useDateTime();
  return (
    <View className={`mb-3 ${isOwnMessage ? 'items-end' : 'items-start'}`}>
      <View
        className={`max-w-[75%] rounded-2xl px-4 py-3 ${
          isOwnMessage ? 'bg-primary' : 'bg-gray-100 dark:bg-neutral-800'
        } ${pending ? 'opacity-60' : ''}`}
      >
        <CustomText className={`text-base ${isOwnMessage ? 'text-white' : 'text-black dark:text-white'}`}>
          {text}
        </CustomText>
      </View>
      <CustomText className="mt-1 px-2 text-xs text-gray-500 dark:text-gray-400">
        {pending ? 'Pending…' : timestamp ? formatTime(timestamp) : ''}
      </CustomText>
    </View>
  );
};

export default function ConversationScreen() {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const auth = useAppSelector((state) => state.auth);
  const scrollViewRef = useRef<ScrollView>(null);
  const { id } = useLocalSearchParams<{ id?: string }>();
  const conversationId = Array.isArray(id) ? id[0] : id;

  const { conversation, reload: reloadConversation } = useConversation(conversationId);
  const {
    messages,
    loading: messagesLoading,
    loadMore,
    fetchingMore,
    reload: reloadMessages,
    hasMore,
  } = useConversationMessages(conversationId, auth.deviceKeyPair);
  const { sendMessage, sending } = useSendMessage(conversationId);

  const handleSend = useCallback(
    async (text: string) => {
      if (!text.trim()) return;
      try {
        await sendMessage(text.trim(), {
          onLocalPersist: () => {
            reloadMessages();
            reloadConversation();
          },
        });
        reloadMessages();
        reloadConversation();
        setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 150);
      } catch (error) {
        if (__DEV__) {
          console.warn('Failed to send message', error);
        }
      }
    },
    [reloadConversation, reloadMessages, sendMessage],
  );

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const displayName =
    conversation?.title ||
    conversation?.members.find((member) => member.id !== auth.user?.id)?.name ||
    conversation?.members[0]?.name ||
    t('messages.conversation') ||
    'Conversation';

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: isDark ? '#000000' : '#ffffff' }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <Stack.Screen
          options={{
            title: displayName || t('messages.conversation'),
            headerShown: true,
          }}
        />

        <View className="border-b border-gray-200 bg-gray-50 px-6 py-3 dark:border-neutral-800 dark:bg-neutral-900">
          <View className="flex-row items-center">
            <View className="mr-3 size-10 overflow-hidden rounded-full bg-gray-200 dark:bg-neutral-800">
              {conversation?.members[0]?.avatar ? (
                <Image
                  source={{ uri: conversation.members[0].avatar || undefined }}
                  className="size-full"
                  resizeMode="cover"
                />
              ) : (
                <View className="size-full items-center justify-center">
                  <Ionicons name="person" size={20} color={isDark ? '#9ca3af' : '#6b7280'} />
                </View>
              )}
            </View>
            <View>
              <CustomText weight="bold" className="text-base text-black dark:text-white">
                {displayName}
              </CustomText>
              <CustomText className="text-sm text-gray-600 dark:text-gray-400">
                {conversation?.members.length
                  ? `${conversation.members.length} ${t('messages.members') || 'members'}`
                  : ''}
              </CustomText>
            </View>
          </View>
        </View>

        {/* Chat content / messages list */}
        <View style={{ flex: 1 }}>
          <ScrollView ref={scrollViewRef} className="flex-1 p-4" contentContainerStyle={{ flexGrow: 1 }}>
            {(messagesLoading && messages.length === 0) || !conversation ? (
              <View className="flex-1 items-center justify-center py-20">
                <ActivityIndicator size="large" color={isDark ? Colors.dark.primary : Colors.light.primary} />
              </View>
            ) : (
              <>
                {hasMore && (
                  <TouchableOpacity
                    className="mb-4 items-center"
                    onPress={loadMore}
                    disabled={fetchingMore}
                    activeOpacity={0.7}
                  >
                    <CustomText className="text-sm text-primary">
                      {fetchingMore
                        ? t('common.loading') || 'Loading…'
                        : t('messages.loadEarlier') || 'Load earlier messages'}
                    </CustomText>
                  </TouchableOpacity>
                )}
                {messages.map((message) => (
                  <MessageBubble
                    key={message.id}
                    text={message.plaintext || message.ciphertext}
                    timestamp={message.createdAt}
                    isOwnMessage={message.senderUserId === auth.user?.id}
                    pending={message.pending}
                  />
                ))}
                {messages.length === 0 && (
                  <View className="flex-1 items-center justify-center py-12">
                    <CustomText className="text-base text-gray-500 dark:text-gray-400">
                      {t('messages.noMessagesYet')}
                    </CustomText>
                  </View>
                )}
              </>
            )}
          </ScrollView>
        </View>

        {/* Floating input fixed to bottom */}
        <FloatingChatInput
          onSend={handleSend}
          placeholder={t('messages.typePlaceholder')}
          disabled={sending || !conversationId}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}


