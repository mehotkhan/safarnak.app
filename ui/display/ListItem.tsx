import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CustomText } from './CustomText';
import { useTheme } from '@ui/context';
import Colors from '@constants/Colors';

export interface ListItemProps {
  icon: any;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  badge?: number;
  rightComponent?: React.ReactNode;
  variant?: 'default' | 'danger';
  showChevron?: boolean;
  iconColor?: string;
  className?: string;
}

/**
 * ListItem Component
 * 
 * Unified list item component that replaces MenuItem, AccountRow, and SettingRow
 * Supports icons, badges, right components, and danger variant
 * 
 * @example
 * <ListItem 
 *   icon="settings-outline"
 *   title="Settings"
 *   subtitle="Manage your preferences"
 *   onPress={() => router.push('/settings')}
 *   showChevron
 * />
 */
export const ListItem = React.memo<ListItemProps>(({ 
  icon, 
  title, 
  subtitle, 
  onPress, 
  badge,
  rightComponent,
  variant = 'default',
  showChevron = true,
  iconColor,
  className = '',
}) => {
  const { isDark } = useTheme();
  
  const color = iconColor || (variant === 'danger' 
    ? '#ef4444' 
    : (isDark ? Colors.dark.primary : Colors.light.primary));
  
  const iconBgColor = variant === 'danger' 
    ? '#ef444420' 
    : (iconColor ? `${iconColor}20` : (isDark ? Colors.dark.primary + '20' : Colors.light.primary + '20'));

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={!onPress}
      className={`flex-row items-center border-b border-gray-200 py-4 dark:border-neutral-800 ${className}`}
      activeOpacity={0.7}
    >
      <View
        className="mr-3 size-10 items-center justify-center rounded-full"
        style={{ backgroundColor: iconBgColor }}
      >
        <Ionicons name={icon} size={20} color={color} />
      </View>
      <View className="flex-1">
        <CustomText
          weight="medium"
          className={`text-base ${
            variant === 'danger' 
              ? 'text-red-600 dark:text-red-400' 
              : 'text-black dark:text-white'
          }`}
        >
          {title}
        </CustomText>
        {subtitle && (
          <CustomText className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {subtitle}
          </CustomText>
        )}
      </View>
      {badge !== undefined && badge > 0 && (
        <View className="mr-3 size-6 items-center justify-center rounded-full bg-red-500">
          <CustomText className="text-xs text-white" weight="bold">
            {badge > 9 ? '9+' : badge}
          </CustomText>
        </View>
      )}
      {rightComponent || (
        onPress && showChevron && (
          <Ionicons 
            name="chevron-forward" 
            size={20} 
            color={isDark ? '#666' : '#9ca3af'} 
          />
        )
      )}
    </TouchableOpacity>
  );
});

ListItem.displayName = 'ListItem';

