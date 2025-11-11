import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@ui/context';
import Colors from '@constants/Colors';

interface FloatingChatInputProps {
  onSend: (message: string) => void;
  placeholder?: string;
  disabled?: boolean;
  keyboardVisible?: boolean;
}

export default function FloatingChatInput({ 
  onSend, 
  placeholder,
  disabled = false,
  keyboardVisible = false,
}: FloatingChatInputProps) {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const defaultPlaceholder = placeholder || t('messages.typePlaceholder');
  const [message, setMessage] = useState('');
  const [inputHeight, setInputHeight] = useState(36);

  const handleSend = () => {
    if (message.trim() && !disabled) {
      onSend(message.trim());
      setMessage('');
      setInputHeight(36); // Reset height after send
    }
  };

  const handleContentSizeChange = (event: any) => {
    const { height } = event.nativeEvent.contentSize;
    // Clamp between min (36) and max (100) for proper multiline expansion
    const clampedHeight = Math.max(36, Math.min(100, height));
    setInputHeight(clampedHeight);
  };

  const iconColor = isDark ? '#9ca3af' : '#6b7280';
  const primaryColor = isDark ? Colors.dark.primary : Colors.light.primary;

  return (
    <View className="px-3" style={{ paddingTop: keyboardVisible ? 6 : 10, paddingBottom: keyboardVisible ? 6 : 10 }}>
      <View className="flex-row items-center gap-1.5 bg-gray-100 dark:bg-neutral-800 rounded-xl px-2 py-1.5 border border-gray-200 dark:border-neutral-700">
        {/* Input Container */}
        <View 
          className="flex-1"
          style={{ 
            minHeight: 36,
            maxHeight: 100,
            justifyContent: 'center',
          }}
        >
          <TextInput
            value={message}
            onChangeText={setMessage}
            placeholder={defaultPlaceholder}
            placeholderTextColor={isDark ? '#6b7280' : '#9ca3af'}
            multiline
            maxLength={500}
            editable={!disabled}
            textAlignVertical="center"
            className="text-black dark:text-white text-sm"
            style={{ 
              height: Math.max(36, inputHeight),
              minHeight: 36,
              maxHeight: 100,
              padding: 0,
              margin: 0,
              lineHeight: 18,
              paddingHorizontal: 8,
            }}
            onContentSizeChange={handleContentSizeChange}
          />
        </View>

        {/* Attach Icon - Compact */}
        <TouchableOpacity
          className="p-1.5"
          disabled={disabled}
          activeOpacity={0.7}
        >
          <Ionicons
            name="attach-outline"
            size={20}
            color={disabled ? (isDark ? '#4b5563' : '#d1d5db') : iconColor}
          />
        </TouchableOpacity>

        {/* Send Button - Compact */}
        <TouchableOpacity
          onPress={handleSend}
          disabled={!message.trim() || disabled}
          className="p-1.5"
          activeOpacity={0.7}
        >
          <Ionicons
            name="send"
            size={20}
            color={(!message.trim() || disabled) ? (isDark ? '#4b5563' : '#d1d5db') : primaryColor}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

