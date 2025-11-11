import React from 'react';
import { View } from 'react-native';
import { CustomText } from './CustomText';

export interface SectionHeaderProps {
  title: string;
  className?: string;
  rightComponent?: React.ReactNode;
}

/**
 * SectionHeader Component
 * 
 * Displays a section header with uppercase title
 * 
 * @example
 * <SectionHeader title="Quick Controls" />
 */
export const SectionHeader = React.memo<SectionHeaderProps>(({ 
  title, 
  className = '',
  rightComponent,
}) => {
  return (
    <View className={`flex-row items-center justify-between mb-2 ${className}`}>
      <CustomText weight="bold" className="text-sm text-gray-500 dark:text-gray-400 uppercase">
        {title}
      </CustomText>
      {rightComponent}
    </View>
  );
});

SectionHeader.displayName = 'SectionHeader';

