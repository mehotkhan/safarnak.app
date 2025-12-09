import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Platform,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@ui/context';
import Colors from '@constants/Colors';

interface FloatingChatInputProps {
  onSend: (message: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export default function FloatingChatInput({
  onSend,
  placeholder,
  disabled = false,
}: FloatingChatInputProps) {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const insets = useSafeAreaInsets();

  const defaultPlaceholder = placeholder || t('messages.typePlaceholder');
  const [message, setMessage] = useState('');
  const [inputHeight, setInputHeight] = useState(36);

  const handleSend = () => {
    const trimmed = message.trim();
    if (trimmed && !disabled) {
      onSend(trimmed);
      setMessage('');
      setInputHeight(36);
    }
  };

  const handleContentSizeChange = (event: any) => {
    const { height } = event.nativeEvent.contentSize;
    const clampedHeight = Math.max(36, Math.min(100, height));
    setInputHeight(clampedHeight);
  };

  const iconColor = isDark ? '#9ca3af' : '#6b7280';
  const primaryColor = isDark ? Colors.dark.primary : Colors.light.primary;

  return (
    <View
      style={[
        styles.container,
        {
          paddingBottom: Math.max(insets.bottom, 6),
          paddingTop: Platform.OS === 'ios' ? 6 : 8,
        },
      ]}
    >
      <View
        style={[
          styles.inner,
          {
            backgroundColor: isDark ? '#171717' : '#f3f4f6',
            borderColor: isDark ? '#404040' : '#e5e7eb',
          },
        ]}
      >
        {/* Input container */}
        <View style={styles.inputWrapper}>
          <TextInput
            value={message}
            onChangeText={setMessage}
            placeholder={defaultPlaceholder}
            placeholderTextColor={isDark ? '#6b7280' : '#9ca3af'}
            multiline
            maxLength={500}
            editable={!disabled}
            textAlignVertical="center"
            style={[
              styles.textInput,
              {
                height: Math.max(36, inputHeight),
                color: isDark ? '#ffffff' : '#000000',
              },
            ]}
            onContentSizeChange={handleContentSizeChange}
          />
        </View>

        {/* Attach */}
        <TouchableOpacity
          disabled={disabled}
          activeOpacity={0.7}
          style={styles.iconButton}
        >
          <Ionicons
            name="attach-outline"
            size={20}
            color={
              disabled
                ? isDark
                  ? '#4b5563'
                  : '#d1d5db'
                : iconColor
            }
          />
        </TouchableOpacity>

        {/* Send */}
        <TouchableOpacity
          onPress={handleSend}
          disabled={!message.trim() || disabled}
          activeOpacity={0.7}
          style={styles.iconButton}
        >
          <Ionicons
            name="send"
            size={20}
            color={
              !message.trim() || disabled
                ? isDark
                  ? '#4b5563'
                  : '#d1d5db'
                : primaryColor
            }
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // absolute bottom bar
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 12,
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderWidth: 1,
  },
  inputWrapper: {
    flex: 1,
    minHeight: 36,
    maxHeight: 100,
    justifyContent: 'center',
  },
  textInput: {
    paddingHorizontal: 8,
    paddingVertical: 0,
    margin: 0,
    fontSize: 14,
    lineHeight: 18,
  },
  iconButton: {
    padding: 6,
  },
});

