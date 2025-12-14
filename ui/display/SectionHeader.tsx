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
    <View className={`mb-2 flex-row items-center justify-between ${className}`}>
      <CustomText weight="bold" className="text-sm uppercase text-gray-500 dark:text-gray-400">
        {title}
      </CustomText>
      {rightComponent}
    </View>
  );
});

SectionHeader.displayName = 'SectionHeader';

