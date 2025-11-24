import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useAppSelector } from '@state/hooks';
import Colors from '@constants/Colors';

// Mock data for chat messages
interface ChatMessage {
  id: string;
  userId: string;
  username: string;
  name: string;
  message: string;
  timestamp: Date;
  isOwn: boolean;
}

const mockMessages: ChatMessage[] = [
  {
    id: '1',
    userId: '1',
    username: 'reza_explorer',
    name: 'Reza Ahmadi',
    message: 'Welcome everyone to our Northern Iran tour group! 🎉',
    timestamp: new Date(2024, 10, 20, 10, 30),
    isOwn: false,
  },
  {
    id: '2',
    userId: '2',
    username: 'sara_wanderer',
    name: 'Sara Mohammadi',
    message: 'Thank you! Really excited for this trip!',
    timestamp: new Date(2024, 10, 20, 10, 35),
    isOwn: false,
  },
  {
    id: '3',
    userId: '1',
    username: 'reza_explorer',
    name: 'Reza Ahmadi',
    message: 'We will meet at Tehran Grand Hotel on Friday at 8 AM. Please be on time!',
    timestamp: new Date(2024, 10, 20, 10, 40),
    isOwn: false,
  },
  {
    id: '4',
    userId: '3',
    username: 'ali_hiker',
    name: 'Ali Karimi',
    message: 'Do we need to bring our own hiking boots?',
    timestamp: new Date(2024, 10, 20, 11, 15),
    isOwn: false,
  },
  {
    id: '5',
    userId: '1',
    username: 'reza_explorer',
    name: 'Reza Ahmadi',
    message: 'Yes, comfortable hiking shoes are recommended. We will be doing some forest trekking.',
    timestamp: new Date(2024, 10, 20, 11, 20),
    isOwn: false,
  },
  {
    id: '6',
    userId: '4',
    username: 'mina_travel',
    name: 'Mina Hosseini',
    message: 'What about the weather? Should we bring rain jackets?',
    timestamp: new Date(2024, 10, 20, 14, 30),
    isOwn: false,
  },
  {
    id: '7',
    userId: '1',
    username: 'reza_explorer',
    name: 'Reza Ahmadi',
    message: 'Good question! Yes, northern Iran can be rainy. Bring rain jackets and an extra layer for cool evenings.',
    timestamp: new Date(2024, 10, 20, 14, 45),
    isOwn: false,
  },
  {
    id: '8',
    userId: '5',
    username: 'hassan_heritage',
    name: 'Hassan Rahmani',
    message: 'Looking forward to meeting everyone! See you Friday! 👋',
    timestamp: new Date(2024, 10, 20, 16, 20),
    isOwn: false,
  },
];

export default function TourChatScreen() {
  const { t } = useTranslation();
  const _id = useLocalSearchParams().id; // Tour ID - used for future GraphQL integration
  const isDark = useAppSelector(state => state.theme.isDark);
  const [messages, setMessages] = useState(mockMessages);
  const [inputText, setInputText] = useState('');
  const scrollViewRef = useRef<ScrollView>(null);

  const colors = isDark ? Colors.dark : Colors.light;

  useEffect(() => {
    // Scroll to bottom on mount
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: false });
    }, 100);
  }, []);

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));

    if (hours < 1) {
      const minutes = Math.floor(diff / (1000 * 60));
      return `${minutes}m ago`;
    } else if (hours < 24) {
      return `${hours}h ago`;
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  const handleSend = () => {
    if (inputText.trim().length === 0) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      userId: 'current-user',
      username: 'current_user',
      name: 'You',
      message: inputText.trim(),
      timestamp: new Date(),
      isOwn: true,
    };

    setMessages([...messages, newMessage]);
    setInputText('');
    
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  return (
    <KeyboardAvoidingView
      className='flex-1'
      style={{ backgroundColor: colors.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <Stack.Screen
        options={{
          title: t('create.tourChat'),
          headerShown: true,
          headerLargeTitle: false,
        }}
      />

      {/* Messages */}
      <ScrollView
        ref={scrollViewRef}
        className='flex-1 p-4'
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
      >
        {messages.map((message, index) => {
          const showHeader = index === 0 || messages[index - 1].userId !== message.userId;
          
          return (
            <View key={message.id} className={`mb-3 ${message.isOwn ? 'items-end' : 'items-start'}`}>
              {showHeader && !message.isOwn && (
                <View className='flex-row items-center gap-2 mb-1 ml-1'>
                  <View
                    className='w-6 h-6 rounded-full items-center justify-center'
                    style={{ backgroundColor: isDark ? '#374151' : '#e5e7eb' }}
                  >
                    <Ionicons
                      name='person'
                      size={12}
                      color={isDark ? '#9ca3af' : '#6b7280'}
                    />
                  </View>
                  <Text
                    className='text-xs font-semibold'
                    style={{ color: colors.text }}
                  >
                    {message.name}
                  </Text>
                </View>
              )}
              
              <View className='flex-row items-end gap-2' style={{ maxWidth: '80%' }}>
                <View
                  className={`px-4 py-2 rounded-2xl ${message.isOwn ? 'rounded-br-sm' : 'rounded-bl-sm'}`}
                  style={{
                    backgroundColor: message.isOwn
                      ? colors.primary
                      : isDark ? '#1f2937' : '#f3f4f6',
                  }}
                >
                  <Text
                    className='text-base leading-5'
                    style={{
                      color: message.isOwn ? '#fff' : colors.text,
                    }}
                  >
                    {message.message}
                  </Text>
                </View>
              </View>
              
              <Text
                className='text-xs mt-1 mx-1'
                style={{ color: isDark ? '#6b7280' : '#9ca3af' }}
              >
                {formatTime(message.timestamp)}
              </Text>
            </View>
          );
        })}
      </ScrollView>

      {/* Input */}
      <View
        className='p-4 border-t'
        style={{
          backgroundColor: isDark ? '#1f2937' : '#fff',
          borderTopColor: isDark ? '#374151' : '#e5e7eb',
        }}
      >
        <View className='flex-row items-center gap-2'>
          <View
            className='flex-1 flex-row items-center px-4 py-3 rounded-full'
            style={{ backgroundColor: isDark ? '#374151' : '#f3f4f6' }}
          >
            <TextInput
              className='flex-1 text-base'
              style={{ color: colors.text }}
              placeholder={t('messages.typePlaceholder')}
              placeholderTextColor={isDark ? '#6b7280' : '#9ca3af'}
              value={inputText}
              onChangeText={setInputText}
              multiline
              maxLength={500}
            />
          </View>
          <TouchableOpacity
            onPress={handleSend}
            className='w-12 h-12 rounded-full items-center justify-center'
            style={{
              backgroundColor: inputText.trim().length > 0 ? colors.primary : (isDark ? '#374151' : '#e5e7eb'),
            }}
            activeOpacity={0.8}
            disabled={inputText.trim().length === 0}
          >
            <Ionicons
              name='send'
              size={20}
              color={inputText.trim().length > 0 ? '#fff' : (isDark ? '#6b7280' : '#9ca3af')}
            />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

