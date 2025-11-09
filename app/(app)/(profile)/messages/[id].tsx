import { useState, useRef, useEffect } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useLocalSearchParams, Stack } from 'expo-router';
import { useDateTime } from '@utils/datetime';
import { Ionicons } from '@expo/vector-icons';
import { CustomText } from '@components/ui/CustomText';
import { useTheme } from '@components/context/ThemeContext';
import Colors from '@constants/Colors';

// Mock data
const mockConversation = {
  id: '1',
  user: {
    id: '2',
    name: 'Sarah Johnson',
    username: 'sarah_travels',
    avatar: 'https://picsum.photos/seed/sarah-conversation/100/100',
    isOnline: true,
  },
  messages: [
    {
      id: '1',
      senderId: '2',
      content: 'Hey! How was your trip to Tokyo?',
      timestamp: '2025-11-20T10:30:00Z',
      read: true,
    },
    {
      id: '2',
      senderId: '1',
      content: 'It was amazing! The cherry blossoms were beautiful 🌸',
      timestamp: '2025-11-20T10:32:00Z',
      read: true,
    },
    {
      id: '3',
      senderId: '2',
      content: 'That sounds wonderful! Did you visit Senso-ji Temple?',
      timestamp: '2025-11-20T10:35:00Z',
      read: true,
    },
    {
      id: '4',
      senderId: '1',
      content: 'Yes! It was incredible. The architecture is stunning.',
      timestamp: '2025-11-20T10:37:00Z',
      read: true,
    },
    {
      id: '5',
      senderId: '2',
      content: 'I\'m planning a trip there next spring. Any recommendations?',
      timestamp: '2025-11-20T10:40:00Z',
      read: false,
    },
  ],
};

interface MessageBubbleProps {
  message: any;
  isOwnMessage: boolean;
  isDark: boolean;
}

const MessageBubble = ({ message, isOwnMessage, isDark }: MessageBubbleProps) => {
  const { formatTime } = useDateTime();

  return (
    <View className={`mb-3 ${isOwnMessage ? 'items-end' : 'items-start'}`}>
      <View
        className={`max-w-[75%] px-4 py-3 rounded-2xl ${
          isOwnMessage
            ? 'bg-primary'
            : 'bg-gray-100 dark:bg-neutral-800'
        }`}
      >
        <CustomText
          className={`text-base ${
            isOwnMessage ? 'text-white' : 'text-black dark:text-white'
          }`}
        >
          {message.content}
        </CustomText>
      </View>
      <CustomText className="text-xs text-gray-500 dark:text-gray-400 mt-1 px-2">
        {formatTime(message.timestamp)}
      </CustomText>
    </View>
  );
};

export default function ConversationScreen() {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const { id } = useLocalSearchParams();
  const scrollViewRef = useRef<ScrollView>(null);
  const [conversation] = useState(mockConversation);
  const [messageText, setMessageText] = useState('');
  const [messages, setMessages] = useState(mockConversation.messages);

  useEffect(() => {
    // Scroll to bottom when messages change
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  const handleSend = () => {
    if (messageText.trim()) {
      const newMessage = {
        id: String(messages.length + 1),
        senderId: '1',
        content: messageText.trim(),
        timestamp: new Date().toISOString(),
        read: false,
      };
      setMessages([...messages, newMessage]);
      setMessageText('');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-white dark:bg-black"
    >
      <Stack.Screen
        options={{
          title: conversation.user.name,
          headerShown: true,
          headerRight: () => (
            <View className="flex-row items-center">
              <TouchableOpacity className="p-2 mr-2">
                <Ionicons name="call-outline" size={22} color={isDark ? '#fff' : '#000'} />
              </TouchableOpacity>
              <TouchableOpacity className="p-2">
                <Ionicons name="videocam-outline" size={24} color={isDark ? '#fff' : '#000'} />
              </TouchableOpacity>
            </View>
          ),
        }}
      />

      {/* User Status */}
      <View className="px-6 py-3 bg-gray-50 dark:bg-neutral-900 border-b border-gray-200 dark:border-neutral-800">
        <View className="flex-row items-center">
          <View className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 dark:bg-neutral-800 mr-3">
            <Image
              source={{ uri: conversation.user.avatar }}
              className="w-full h-full"
              resizeMode="cover"
            />
          </View>
          <View>
            <CustomText weight="bold" className="text-base text-black dark:text-white">
              {conversation.user.name}
            </CustomText>
            {conversation.user.isOnline && (
              <View className="flex-row items-center">
                <View className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                <CustomText className="text-sm text-gray-600 dark:text-gray-400">
                  {t('messages.online')}
                </CustomText>
              </View>
            )}
          </View>
        </View>
      </View>

      {/* Messages */}
      <ScrollView
        ref={scrollViewRef}
        className="flex-1 px-4 py-4"
        contentContainerStyle={{ flexGrow: 1 }}
      >
        {messages.map((message, index) => (
          <MessageBubble
            key={message.id}
            message={message}
            isOwnMessage={message.senderId === '1'}
            isDark={isDark}
          />
        ))}
      </ScrollView>

      {/* Message Input */}
      <View className="px-4 py-3 border-t border-gray-200 dark:border-neutral-800 bg-white dark:bg-black">
        <View className="flex-row items-center">
          <TouchableOpacity className="p-2">
            <Ionicons
              name="add-circle"
              size={28}
              color={isDark ? '#9ca3af' : '#6b7280'}
            />
          </TouchableOpacity>
          <View className="flex-1 mx-2">
            <TextInput
              placeholder={t('messages.typePlaceholder')}
              placeholderTextColor={isDark ? '#9ca3af' : '#6b7280'}
              value={messageText}
              onChangeText={setMessageText}
              className="bg-gray-100 dark:bg-neutral-900 rounded-full px-4 py-3 text-black dark:text-white"
              multiline
              maxLength={500}
            />
          </View>
          <TouchableOpacity
            onPress={handleSend}
            disabled={!messageText.trim()}
            className="p-2"
          >
            <Ionicons
              name="send"
              size={24}
              color={
                messageText.trim()
                  ? (isDark ? Colors.dark.primary : Colors.light.primary)
                  : (isDark ? '#666' : '#9ca3af')
              }
            />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

