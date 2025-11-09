import React from 'react';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CustomText } from './CustomText';
import { useTheme } from '@components/context/ThemeContext';

export interface ErrorStateProps {
  title?: string;
  message: string;
  icon?: keyof typeof Ionicons.glyphMap;
  iconSize?: number;
  onRetry?: () => void;
  className?: string;
}

/**
 * ErrorState Component
 * 
 * Displays an error message with icon, title, and description
 * 
 * @example
 * <ErrorState 
 *   title="Error" 
 *   message="Failed to load data" 
 *   onRetry={() => refetch()} 
 * />
 */
export const ErrorState = React.memo<ErrorStateProps>(({
  title,
  message,
  icon = 'alert-circle-outline',
  iconSize = 64,
  onRetry,
  className = '',
}) => {
  const { isDark } = useTheme();
  const iconColor = isDark ? '#ef4444' : '#dc2626';

  return (
    <View className={`flex-1 items-center justify-center bg-white dark:bg-black px-6 py-12 ${className}`}>
      <Ionicons name={icon} size={iconSize} color={iconColor} />
      {title && (
        <CustomText weight="bold" className="text-lg text-gray-800 dark:text-gray-300 mt-4 mb-2 text-center">
          {title}
        </CustomText>
      )}
      <CustomText className="text-base text-gray-600 dark:text-gray-400 text-center">
        {message}
      </CustomText>
      {onRetry && (
        <CustomText 
          className="text-primary mt-4 text-center underline"
          onPress={onRetry}
        >
          Tap to retry
        </CustomText>
      )}
    </View>
  );
});

ErrorState.displayName = 'ErrorState';

