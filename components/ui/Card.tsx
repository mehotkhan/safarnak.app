import React from 'react';
import { View, TouchableOpacity, ViewStyle } from 'react-native';

export interface CardProps {
  children: React.ReactNode;
  padding?: number;
  margin?: number;
  className?: string;
  onPress?: () => void;
  style?: ViewStyle;
}

/**
 * Card Component
 * 
 * A reusable card container with consistent styling
 * 
 * @example
 * <Card padding={4} onPress={() => handlePress()}>
 *   <Text>Card content</Text>
 * </Card>
 */
export const Card = React.memo<CardProps>(({ 
  children, 
  padding = 4,
  margin,
  className = '',
  onPress,
  style,
}) => {
  const paddingClass = `p-${padding}`;
  const marginClass = margin !== undefined ? `m-${margin}` : '';
  
  const baseClasses = 'bg-white dark:bg-neutral-900 rounded-2xl border border-gray-200 dark:border-neutral-800';
  const classes = `${baseClasses} ${paddingClass} ${marginClass} ${className}`.trim();

  if (onPress) {
    return (
      <TouchableOpacity 
        onPress={onPress} 
        activeOpacity={0.7}
        className={classes}
        style={style}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <View className={classes} style={style}>
      {children}
    </View>
  );
});

Card.displayName = 'Card';

