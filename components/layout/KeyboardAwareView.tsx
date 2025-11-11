import React from 'react';
import { KeyboardAvoidingView, Platform, ViewStyle } from 'react-native';

export interface KeyboardAwareViewProps {
  children: React.ReactNode;
  behavior?: 'padding' | 'height' | 'position';
  keyboardVerticalOffset?: number;
  className?: string;
  style?: ViewStyle;
}

/**
 * KeyboardAwareView Component
 * 
 * Wraps content in a KeyboardAvoidingView with sensible defaults for React Native
 * 
 * @example
 * <KeyboardAwareView>
 *   <TextInput />
 * </KeyboardAwareView>
 */
export const KeyboardAwareView = React.memo<KeyboardAwareViewProps>(({ 
  children, 
  behavior = Platform.OS === 'ios' ? 'padding' : 'height',
  keyboardVerticalOffset = 0,
  className = '',
  style,
}) => {
  return (
    <KeyboardAvoidingView
      behavior={behavior}
      keyboardVerticalOffset={keyboardVerticalOffset}
      className={`flex-1 ${className}`}
      style={style}
    >
      {children}
    </KeyboardAvoidingView>
  );
});

KeyboardAwareView.displayName = 'KeyboardAwareView';

