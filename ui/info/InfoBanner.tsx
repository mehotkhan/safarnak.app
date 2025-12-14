import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CustomText } from '@ui/display';
import { useTheme } from '@ui/context';

export type InfoBannerType = 'info' | 'warning' | 'success' | 'error';

export interface InfoBannerProps {
  type?: InfoBannerType;
  title: string;
  message: string;
  icon?: string;
  onClose?: () => void;
  className?: string;
}

/**
 * InfoBanner Component
 * 
 * Displays an informational banner with icon, title, and message
 * Supports different types: info, warning, success, error
 * 
 * @example
 * <InfoBanner 
 *   type="info"
 *   title="Device Management"
 *   message="Manage your connected devices..."
 *   onClose={() => setShowBanner(false)}
 * />
 */
export const InfoBanner = React.memo<InfoBannerProps>(({ 
  type = 'info',
  title, 
  message, 
  icon,
  onClose,
  className = '',
}) => {
  const { isDark } = useTheme();

  const getColors = () => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-green-50 dark:bg-green-900/20',
          border: 'border-green-200 dark:border-green-800',
          icon: isDark ? '#10b981' : '#059669',
          title: 'text-green-900 dark:text-green-200',
          message: 'text-green-800 dark:text-green-300',
        };
      case 'warning':
        return {
          bg: 'bg-yellow-50 dark:bg-yellow-900/20',
          border: 'border-yellow-200 dark:border-yellow-800',
          icon: isDark ? '#f59e0b' : '#d97706',
          title: 'text-yellow-900 dark:text-yellow-200',
          message: 'text-yellow-800 dark:text-yellow-300',
        };
      case 'error':
        return {
          bg: 'bg-red-50 dark:bg-red-900/20',
          border: 'border-red-200 dark:border-red-800',
          icon: isDark ? '#ef4444' : '#dc2626',
          title: 'text-red-900 dark:text-red-200',
          message: 'text-red-800 dark:text-red-300',
        };
      default: // info
        return {
          bg: 'bg-blue-50 dark:bg-blue-900/20',
          border: 'border-blue-200 dark:border-blue-800',
          icon: isDark ? '#60a5fa' : '#3b82f6',
          title: 'text-blue-900 dark:text-blue-200',
          message: 'text-blue-800 dark:text-blue-300',
        };
    }
  };

  const getIconName = () => {
    if (icon) return icon;
    switch (type) {
      case 'success':
        return 'checkmark-circle';
      case 'warning':
        return 'warning';
      case 'error':
        return 'close-circle';
      default:
        return 'information-circle';
    }
  };

  const colors = getColors();

  return (
    <View className={`${colors.bg} ${colors.border} rounded-xl border p-3 ${className}`}>
      <View className="flex-row items-start">
        <Ionicons
          name={getIconName() as any}
          size={20}
          color={colors.icon}
          style={{ marginRight: 10, marginTop: 1 }}
        />
        <View className="flex-1">
          <CustomText
            weight="medium"
            className={`text-sm ${colors.title} mb-1`}
          >
            {title}
          </CustomText>
          <CustomText className={`text-xs ${colors.message} leading-4`}>
            {message}
          </CustomText>
        </View>
        {onClose && (
          <TouchableOpacity onPress={onClose} className="ml-2" activeOpacity={0.7}>
            <Ionicons name="close" size={18} color={colors.icon} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
});

InfoBanner.displayName = 'InfoBanner';

