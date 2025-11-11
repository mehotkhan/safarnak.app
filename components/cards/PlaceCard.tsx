import React from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { CustomText } from '@components/display';
import { RatingDisplay } from '@components/display';
import { useTheme } from '@components/context';

export interface PlaceCardProps {
  place: any;
  onPress: () => void;
  variant?: 'compact' | 'detailed'; // compact for trips, detailed for explore
  className?: string;
}

/**
 * PlaceCard Component
 * 
 * Displays a place card with image, name, location, rating, and open/closed status
 * Supports two variants: compact (for trips) and detailed (for explore)
 * 
 * @example
 * <PlaceCard place={place} onPress={() => router.push(`/places/${place.id}`)} variant="detailed" />
 */
export const PlaceCard = React.memo<PlaceCardProps>(({ place, onPress, variant = 'detailed', className = '' }) => {
  const { isDark } = useTheme();
  const { t } = useTranslation();

  // Detailed variant (explore) - shows image on left side
  if (variant === 'detailed') {
    const imageUrl = place.imageUrl || 'https://via.placeholder.com/400x300';
    
    return (
      <TouchableOpacity
        onPress={onPress}
        className={`bg-white dark:bg-neutral-900 rounded-2xl overflow-hidden mb-3 border border-gray-200 dark:border-neutral-800 ${className}`}
        activeOpacity={0.8}
      >
        <View className="flex-row">
          <View className="w-24 h-24 bg-gray-200 dark:bg-neutral-800">
            <Image
              source={{ uri: imageUrl }}
              className="w-full h-full"
              resizeMode="cover"
            />
          </View>
          <View className="flex-1 p-3">
            <View className="flex-row justify-between items-start mb-1">
              <View className="flex-1 mr-2">
                <CustomText
                  weight="bold"
                  className="text-base text-black dark:text-white mb-1"
                  numberOfLines={1}
                >
                  {place.name || 'Unnamed Place'}
                </CustomText>
                <View className="flex-row items-center mb-1">
                  <Ionicons
                    name="location-outline"
                    size={12}
                    color={isDark ? '#9ca3af' : '#6b7280'}
                  />
                  <CustomText className="text-xs text-gray-600 dark:text-gray-400 ml-1" numberOfLines={1}>
                    {place.location || 'Location not specified'}
                  </CustomText>
                </View>
              </View>
              <View
                className={`px-2 py-1 rounded-full ${
                  place.isOpen
                    ? 'bg-green-100 dark:bg-green-900'
                    : 'bg-red-100 dark:bg-red-900'
                }`}
              >
                <CustomText
                  className={`text-xs ${
                    place.isOpen
                      ? 'text-green-800 dark:text-green-200'
                      : 'text-red-800 dark:text-red-200'
                  }`}
                >
                  {place.isOpen ? t('explore.placeCard.open') : t('explore.placeCard.closed')}
                </CustomText>
              </View>
            </View>
                <View className="flex-row items-center justify-between">
                  <RatingDisplay
                    rating={place.rating || 0}
                    reviews={place.reviews}
                    size="small"
                    showReviews
                  />
              {place.distance != null && typeof place.distance === 'number' && (
                <CustomText className="text-xs text-gray-600 dark:text-gray-400">
                  {place.distance.toFixed(1)} {t('explore.placeCard.distance')}
                </CustomText>
              )}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  // Compact variant (trips) - simpler layout
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`bg-white dark:bg-neutral-900 rounded-2xl p-4 mb-4 border border-gray-200 dark:border-neutral-800 ${className}`}
      activeOpacity={0.8}
    >
      <View className="flex-row justify-between items-start mb-3">
        <View className="flex-1">
          <CustomText
            weight="bold"
            className="text-lg text-black dark:text-white mb-1"
          >
            {place?.name || '—'}
          </CustomText>
          <View className="flex-row items-center">
            <Ionicons
              name="location-outline"
              size={16}
              color={isDark ? '#9ca3af' : '#6b7280'}
            />
            <CustomText className="text-sm text-gray-600 dark:text-gray-400 ml-2">
              {place?.location || '—'}
            </CustomText>
          </View>
        </View>
        <RatingDisplay
          rating={place?.rating || 0}
          size="small"
        />
      </View>

      <CustomText className="text-sm text-gray-500 dark:text-gray-500" numberOfLines={2}>
        {place?.description || '—'}
      </CustomText>

      {place?.isOpen !== undefined && (
        <View className="flex-row items-center mt-2">
          <View className={`w-2 h-2 rounded-full mr-2 ${place.isOpen ? 'bg-green-500' : 'bg-red-500'}`} />
          <CustomText className="text-xs text-gray-500 dark:text-gray-400">
            {place.isOpen ? (t('places.open') || 'Open') : (t('places.closed') || 'Closed')}
          </CustomText>
        </View>
      )}
    </TouchableOpacity>
  );
});

PlaceCard.displayName = 'PlaceCard';

