import React from 'react';
import { View, ViewStyle } from 'react-native';
import { useTheme } from '@ui/context';

export type SkeletonType = 'text' | 'card' | 'avatar' | 'custom';

export interface SkeletonLoaderProps {
  type?: SkeletonType;
  width?: number | string;
  height?: number;
  lines?: number;
  className?: string;
  style?: ViewStyle;
}

/**
 * SkeletonLoader Component
 * 
 * Displays a skeleton/placeholder loader for loading states
 * 
 * @example
 * <SkeletonLoader type="text" lines={3} />
 * <SkeletonLoader type="card" width="100%" height={200} />
 */
export const SkeletonLoader = React.memo<SkeletonLoaderProps>(({ 
  type = 'text',
  width,
  height,
  lines = 1,
  className = '',
  style,
}) => {
  const { isDark } = useTheme();

  const baseStyle: ViewStyle = {
    backgroundColor: isDark ? '#374151' : '#e5e7eb',
  };

  if (type === 'text') {
    return (
      <View className={className}>
        {Array.from({ length: lines }).map((_, index) => (
          <View
            key={index}
            className="mb-2 h-4 rounded bg-gray-300 dark:bg-neutral-700"
            style={{
              ...baseStyle,
              width: (index === lines - 1 ? '80%' : '100%') as any,
              height: height || 16,
              ...style,
            }}
          />
        ))}
      </View>
    );
  }

  if (type === 'card') {
    return (
      <View 
        className={`rounded-2xl bg-gray-300 dark:bg-neutral-700 ${className}`}
        style={{
          ...baseStyle,
          ...(width && { width: width as any }),
          ...(height && { height }),
          ...style,
        }}
      />
    );
  }

  if (type === 'avatar') {
    return (
      <View 
        className={`rounded-full bg-gray-300 dark:bg-neutral-700 ${className}`}
        style={{
          ...baseStyle,
          width: (width as number) || 40,
          height: height || 40,
          ...style,
        }}
      />
    );
  }

  // custom
  return (
    <View 
      className={`rounded bg-gray-300 dark:bg-neutral-700 ${className}`}
      style={{
        ...baseStyle,
        ...(width && { width: width as any }),
        ...(height && { height }),
        ...style,
      }}
    />
  );
});

SkeletonLoader.displayName = 'SkeletonLoader';

