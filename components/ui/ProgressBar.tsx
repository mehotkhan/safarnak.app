import React from 'react';
import { View } from 'react-native';
import { CustomText } from './CustomText';
import { useTheme } from '@components/context/ThemeContext';
import { useTranslation } from 'react-i18next';

export interface ProgressBarProps {
  current: number;
  total: number;
  showLabel?: boolean;
  label?: string;
  color?: string;
  className?: string;
}

/**
 * ProgressBar Component
 * 
 * Displays a progress bar showing current step out of total steps
 * 
 * @example
 * <ProgressBar 
 *   current={3}
 *   total={7}
 *   showLabel
 *   label="Step 3 of 7"
 * />
 */
export const ProgressBar = React.memo<ProgressBarProps>(({ 
  current, 
  total, 
  showLabel = false,
  label,
  color,
  className = '',
}) => {
  const { isDark } = useTheme();
  const { t } = useTranslation();
  
  const percentage = total > 0 ? Math.round((current / total) * 100) : 0;
  const progressColor = color || (isDark ? '#3b82f6' : '#2563eb');
  
  const defaultLabel = label || `${t('plan.form.step') || 'Step'} ${current} ${t('common.of') || 'of'} ${total}`;

  return (
    <View className={`mb-4 ${className}`}>
      {showLabel && (
        <View className="flex-row items-center justify-between mb-2">
          <CustomText className="text-sm text-gray-600 dark:text-gray-400">
            {defaultLabel}
          </CustomText>
          <CustomText className="text-sm text-gray-600 dark:text-gray-400">
            {percentage}%
          </CustomText>
        </View>
      )}
      <View className="h-2 bg-gray-200 dark:bg-neutral-800 rounded-full overflow-hidden">
        <View
          className="h-full rounded-full"
          style={{ 
            width: `${percentage}%`,
            backgroundColor: progressColor,
          }}
        />
      </View>
    </View>
  );
});

ProgressBar.displayName = 'ProgressBar';

