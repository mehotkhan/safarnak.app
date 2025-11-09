import React from 'react';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CustomText } from './CustomText';
import { useTheme } from '@components/context/ThemeContext';

export interface EmptyStateProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description?: string;
  iconSize?: number;
  action?: React.ReactNode;
  className?: string;
}

/**
 * EmptyState Component
 * 
 * Displays an empty state with icon, title, and optional description
 * 
 * @example
 * <EmptyState 
 *   icon="newspaper-outline" 
 *   title="No posts yet" 
 *   description="Be the first to share something!" 
 * />
 */
export const EmptyState = React.memo<EmptyStateProps>(({
  icon,
  title,
  description,
  iconSize = 80,
  action,
  className = '',
}) => {
  const { isDark } = useTheme();
  const iconColor = isDark ? '#4b5563' : '#d1d5db';

  return (
    <View className={`flex-1 items-center justify-center px-6 py-12 ${className}`}>
      <Ionicons name={icon} size={iconSize} color={iconColor} />
      <CustomText
        weight="bold"
        className="text-xl text-gray-800 dark:text-gray-300 mt-4 mb-2 text-center"
      >
        {title}
      </CustomText>
      {description && (
        <CustomText className="text-base text-gray-600 dark:text-gray-400 text-center">
          {description}
        </CustomText>
      )}
      {action && (
        <View className="mt-6">
          {action}
        </View>
      )}
    </View>
  );
});

EmptyState.displayName = 'EmptyState';

