import React from 'react';
import { View } from 'react-native';
import { CustomText } from '@components/ui/CustomText';

interface Props {
  label?: string;
  className?: string;
}

export default function Divider({ label, className }: Props) {
  return (
    <View className={`flex-row items-center my-4 ${className || ''}`}>
      <View className="flex-1 h-px bg-gray-200 dark:bg-neutral-800" />
      {label ? (
        <CustomText className="mx-3 text-xs text-gray-500 dark:text-gray-400">
          {label}
        </CustomText>
      ) : null}
      <View className="flex-1 h-px bg-gray-200 dark:bg-neutral-800" />
    </View>
  );
}


