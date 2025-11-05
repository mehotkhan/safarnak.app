import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@components/context/ThemeContext';

interface FloatingChatInputProps {
  onSend: (message: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export default function FloatingChatInput({ 
  onSend, 
  placeholder = "Type your message...",
  disabled = false 
}: FloatingChatInputProps) {
  const { isDark } = useTheme();
  const [message, setMessage] = useState('');
  const [inputHeight, setInputHeight] = useState(20);

  const handleSend = () => {
    if (message.trim() && !disabled) {
      onSend(message.trim());
      setMessage('');
      setInputHeight(20); // Reset height after send
    }
  };

  const handleContentSizeChange = (event: any) => {
    const height = event.nativeEvent.contentSize.height;
    // Clamp between min (20) and max (100)
    const clampedHeight = Math.max(20, Math.min(100, height));
    setInputHeight(clampedHeight);
  };

  return (
    <View className="px-4 py-3">
      <View className="flex-row items-end gap-2">
        <View 
          className="flex-1 bg-gray-100 dark:bg-neutral-900 rounded-2xl px-4 py-2 border border-gray-200 dark:border-neutral-800"
          style={{ minHeight: 44 }}
        >
          <TextInput
            value={message}
            onChangeText={setMessage}
            placeholder={placeholder}
            placeholderTextColor={isDark ? '#6b7280' : '#9ca3af'}
            multiline
            maxLength={500}
            editable={!disabled}
            textAlignVertical="top"
            className="flex-1 text-black dark:text-white text-base"
            style={{ 
              height: inputHeight,
              minHeight: 20,
              maxHeight: 100,
            }}
            onContentSizeChange={handleContentSizeChange}
          />
        </View>
        <TouchableOpacity
          onPress={handleSend}
          disabled={!message.trim() || disabled}
          className={`w-10 h-10 rounded-full items-center justify-center ${
            message.trim() && !disabled
              ? 'bg-blue-500'
              : 'bg-gray-300 dark:bg-neutral-700'
          }`}
        >
          <Ionicons
            name="send"
            size={20}
            color={message.trim() && !disabled ? '#ffffff' : (isDark ? '#6b7280' : '#9ca3af')}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

