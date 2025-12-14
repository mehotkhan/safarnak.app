import React from 'react';
import { View } from 'react-native';
import { CustomText } from './CustomText';

interface Props {
  label?: string;
  className?: string;
}

export default function Divider({ label, className }: Props) {
  return (
    <View className={`my-4 flex-row items-center ${className || ''}`}>
      <View className="h-px flex-1 bg-gray-200 dark:bg-neutral-800" />
      {label ? (
        <CustomText className="mx-3 text-xs text-gray-500 dark:text-gray-400">
          {label}
        </CustomText>
      ) : null}
      <View className="h-px flex-1 bg-gray-200 dark:bg-neutral-800" />
    </View>
  );
}


