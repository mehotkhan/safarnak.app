import React, { useMemo } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { CustomText } from '@ui/display';
import { RatingDisplay } from '@ui/display';
import { ImageWithPlaceholder } from '@ui/display';
import { useTheme } from '@ui/context';

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

  // Generate placeholder image URL using Picsum Photos
  const placeholderImageUrl = useMemo(() => {
    const seed = place?.id ? place.id.substring(0, 8) : 'default';
    return `https://picsum.photos/seed/${seed}/200/200`;
  }, [place]);

  // Detailed variant (explore) - shows image on left side
  if (variant === 'detailed') {
    const imageUrl = place.imageUrl || null;
    
    return (
      <TouchableOpacity
        onPress={onPress}
        className={`mb-3 overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-neutral-800 dark:bg-neutral-900 ${className}`}
        activeOpacity={0.8}
      >
        <View className="flex-row">
          <View className="size-24 bg-gray-200 dark:bg-neutral-800">
            <ImageWithPlaceholder
              source={imageUrl ? { uri: imageUrl } : { uri: placeholderImageUrl }}
              placeholder={placeholderImageUrl}
              fallbackText={t('places.noImage') || 'Place Image'}
              width="100%"
              height="100%"
              resizeMode="cover"
            />
          </View>
          <View className="flex-1 p-3">
            <View className="mb-1 flex-row items-start justify-between">
              <View className="mr-2 flex-1">
                <CustomText
                  weight="bold"
                  className="mb-1 text-base text-black dark:text-white"
                  numberOfLines={1}
                >
                  {place.name || 'Unnamed Place'}
                </CustomText>
                <View className="mb-1 flex-row items-center">
                  <Ionicons
                    name="location-outline"
                    size={12}
                    color={isDark ? '#9ca3af' : '#6b7280'}
                  />
                  <CustomText className="ml-1 text-xs text-gray-600 dark:text-gray-400" numberOfLines={1}>
                    {place.location || 'Location not specified'}
                  </CustomText>
                </View>
              </View>
              <View
                className={`rounded-full px-2 py-1 ${
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
      className={`mb-4 rounded-2xl border border-gray-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900 ${className}`}
      activeOpacity={0.8}
    >
      <View className="mb-3 flex-row items-start justify-between">
        <View className="flex-1">
          <CustomText
            weight="bold"
            className="mb-1 text-lg text-black dark:text-white"
          >
            {place?.name || '—'}
          </CustomText>
          <View className="flex-row items-center">
            <Ionicons
              name="location-outline"
              size={16}
              color={isDark ? '#9ca3af' : '#6b7280'}
            />
            <CustomText className="ml-2 text-sm text-gray-600 dark:text-gray-400">
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
        <View className="mt-2 flex-row items-center">
          <View className={`mr-2 size-2 rounded-full ${place.isOpen ? 'bg-green-500' : 'bg-red-500'}`} />
          <CustomText className="text-xs text-gray-500 dark:text-gray-400">
            {place.isOpen ? (t('places.open') || 'Open') : (t('places.closed') || 'Closed')}
          </CustomText>
        </View>
      )}
    </TouchableOpacity>
  );
});

PlaceCard.displayName = 'PlaceCard';

