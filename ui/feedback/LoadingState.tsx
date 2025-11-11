import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { CustomText } from '@ui/display';
import { useTheme } from '@ui/context';
import Colors from '@constants/Colors';

export interface LoadingStateProps {
  message?: string;
  size?: 'small' | 'large';
  color?: string;
  className?: string;
}

/**
 * LoadingState Component
 * 
 * Displays a loading spinner with optional message
 * 
 * @example
 * <LoadingState message="Loading..." />
 * <LoadingState size="small" />
 */
export const LoadingState = React.memo<LoadingStateProps>(({
  message,
  size = 'large',
  color,
  className = '',
}) => {
  const { isDark } = useTheme();
  const indicatorColor = color || (isDark ? Colors.dark.primary : Colors.light.primary);

  // If className is provided, use it; otherwise use default flex-1 layout
  const containerClass = className 
    ? `items-center justify-center ${className}`
    : 'flex-1 items-center justify-center py-20';

  return (
    <View className={containerClass}>
      <ActivityIndicator size={size} color={indicatorColor} />
      {message && (
        <CustomText className="text-gray-500 dark:text-gray-400 mt-4">
          {message}
        </CustomText>
      )}
    </View>
  );
});

LoadingState.displayName = 'LoadingState';

