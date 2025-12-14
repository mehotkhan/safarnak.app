import React from 'react';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CustomText } from './CustomText';

export type RatingSize = 'small' | 'medium' | 'large';

export interface RatingDisplayProps {
  rating: number;
  reviews?: number;
  size?: RatingSize;
  showReviews?: boolean;
  className?: string;
}

/**
 * RatingDisplay Component
 * 
 * Displays a star rating with optional review count
 * 
 * @example
 * <RatingDisplay 
 *   rating={4.5}
 *   reviews={123}
 *   size="medium"
 *   showReviews
 * />
 */
export const RatingDisplay = React.memo<RatingDisplayProps>(({ 
  rating, 
  reviews,
  size = 'medium',
  showReviews = false,
  className = '',
}) => {
  const getSize = () => {
    switch (size) {
      case 'small':
        return { star: 12, text: 'text-xs' };
      case 'large':
        return { star: 20, text: 'text-base' };
      default:
        return { star: 16, text: 'text-sm' };
    }
  };

  const { star: starSize, text: textSize } = getSize();
  const displayRating = typeof rating === 'number' ? rating.toFixed(1) : '0.0';

  return (
    <View className={`flex-row items-center ${className}`}>
      <Ionicons name="star" size={starSize} color="#fbbf24" />
      <CustomText className={`${textSize} ml-1 text-gray-700 dark:text-gray-300`}>
        {displayRating}
      </CustomText>
      {showReviews && reviews !== undefined && (
        <CustomText className={`${textSize} ml-1 text-gray-600 dark:text-gray-400`}>
          ({reviews})
        </CustomText>
      )}
    </View>
  );
});

RatingDisplay.displayName = 'RatingDisplay';

