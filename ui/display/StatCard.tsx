import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CustomText } from './CustomText';

export interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: string;
  color?: string;
  onPress?: () => void;
  className?: string;
}

/**
 * StatCard Component
 * 
 * Displays a statistics card with icon, title, value, and optional subtitle
 * 
 * @example
 * <StatCard 
 *   title="Total Storage"
 *   value="1.2 GB"
 *   subtitle="Unified Database"
 *   icon="server-outline"
 *   color="#3b82f6"
 * />
 */
export const StatCard = React.memo<StatCardProps>(({ 
  title, 
  value, 
  subtitle, 
  icon, 
  color = '#3b82f6',
  onPress,
  className = '',
}) => {
  const content = (
    <View className={`rounded-xl border border-gray-200 bg-white p-3 dark:border-neutral-800 dark:bg-neutral-900 ${className}`}>
      <View className="mb-1.5 flex-row items-center justify-between">
        <CustomText className="text-xs text-gray-500 dark:text-gray-400">
          {title}
        </CustomText>
        {icon && (
          <Ionicons name={icon as any} size={16} color={color} />
        )}
      </View>
      <CustomText
        weight="bold"
        className="mb-0.5 text-xl text-black dark:text-white"
      >
        {value}
      </CustomText>
      {subtitle && (
        <CustomText className="text-xs text-gray-500 dark:text-gray-400">
          {subtitle}
        </CustomText>
      )}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
});

StatCard.displayName = 'StatCard';

