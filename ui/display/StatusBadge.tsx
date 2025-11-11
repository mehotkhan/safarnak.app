import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CustomText } from './CustomText';
import { useTheme } from '@ui/context';

export interface StatusBadgeProps {
  label: string;
  value: string;
  isActive: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
  onPress?: () => void;
  className?: string;
}

/**
 * StatusBadge Component
 * 
 * Displays a status badge with icon, label, and value
 * 
 * @example
 * <StatusBadge 
 *   label="Status" 
 *   value="Active" 
 *   isActive={true} 
 *   icon="checkmark-circle" 
 * />
 */
export const StatusBadge = React.memo<StatusBadgeProps>(({
  label,
  value,
  isActive,
  icon,
  onPress,
  className = '',
}) => {
  const { isDark } = useTheme();
  
  const backgroundColor = isActive
    ? (isDark ? 'rgba(16, 185, 129, 0.1)' : 'rgba(16, 185, 129, 0.1)')
    : (isDark ? 'rgba(107, 114, 128, 0.1)' : 'rgba(107, 114, 128, 0.1)');
  
  const iconColor = isActive
    ? (isDark ? '#10b981' : '#10b981')
    : (isDark ? '#6b7280' : '#6b7280');

  const content = (
    <View className={`flex-row items-center justify-between p-3 bg-white dark:bg-neutral-900 rounded-xl mb-2 border border-gray-200 dark:border-neutral-800 ${className}`}>
      <View className="flex-row items-center flex-1">
        {icon && (
          <View
            className="w-9 h-9 rounded-full items-center justify-center mr-3"
            style={{ backgroundColor }}
          >
            <Ionicons name={icon} size={18} color={iconColor} />
          </View>
        )}
        <View className="flex-1">
          <CustomText className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">
            {label}
          </CustomText>
          <CustomText weight="medium" className="text-base text-black dark:text-white">
            {value}
          </CustomText>
        </View>
      </View>
      {isActive && (
        <View className="w-2 h-2 rounded-full bg-green-500" />
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

StatusBadge.displayName = 'StatusBadge';

