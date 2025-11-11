import React from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { CustomText } from '@components/display';
import { RatingDisplay } from '@components/display';
import { useTheme } from '@components/context';

export interface TourCardProps {
  tour: any;
  onPress: () => void;
  variant?: 'compact' | 'detailed'; // compact for trips, detailed for explore
  className?: string;
}

/**
 * TourCard Component
 * 
 * Displays a tour card with image, title, location, price, rating, and duration
 * Supports two variants: compact (for trips) and detailed (for explore)
 * 
 * @example
 * <TourCard tour={tour} onPress={() => router.push(`/tours/${tour.id}`)} variant="detailed" />
 */
export const TourCard = React.memo<TourCardProps>(({ tour, onPress, variant = 'detailed', className = '' }) => {
  const { isDark } = useTheme();
  const { t } = useTranslation();

  // Detailed variant (explore) - shows image, featured badge, category
  if (variant === 'detailed') {
    const imageUrl = tour.imageUrl || tour.gallery?.[0] || 'https://via.placeholder.com/400x300';
    
    return (
      <TouchableOpacity
        onPress={onPress}
        className={`bg-white dark:bg-neutral-900 rounded-2xl overflow-hidden mb-4 border border-gray-200 dark:border-neutral-800 ${className}`}
        activeOpacity={0.8}
      >
        <View className="h-48 bg-gray-200 dark:bg-neutral-800 relative">
          <Image
            source={{ uri: imageUrl }}
            className="w-full h-full"
            resizeMode="cover"
          />
          {tour.isFeatured && (
            <View className="absolute top-2 right-2 bg-primary px-2 py-1 rounded-full">
              <CustomText className="text-xs text-white" weight="medium">
                {t('explore.featured')}
              </CustomText>
            </View>
          )}
          {tour.category && (
            <View className="absolute top-2 left-2 bg-black/50 px-2 py-1 rounded-full">
              <CustomText className="text-xs text-white">
                {t(`explore.categories.${tour.category}`)}
              </CustomText>
            </View>
          )}
        </View>
        <View className="p-4">
          <CustomText
            weight="bold"
            className="text-lg text-black dark:text-white mb-1"
            numberOfLines={2}
          >
            {tour.title || 'Untitled Tour'}
          </CustomText>
          <View className="flex-row items-center mb-2">
            <Ionicons
              name="location-outline"
              size={14}
              color={isDark ? '#9ca3af' : '#6b7280'}
            />
            <CustomText className="text-sm text-gray-600 dark:text-gray-400 ml-1" numberOfLines={1}>
              {tour.location || 'Location not specified'}
            </CustomText>
          </View>
          <View className="flex-row items-center justify-between mb-2">
            <View className="flex-row items-center">
              <Ionicons name="star" size={16} color="#fbbf24" />
              <CustomText className="text-sm text-gray-700 dark:text-gray-300 ml-1">
                {tour.rating?.toFixed(1) || '0.0'} ({tour.reviews || 0} {t('explore.tourCard.reviews')})
              </CustomText>
            </View>
            <CustomText weight="bold" className="text-base text-primary">
              {t('explore.tourCard.from')} ${tour.price?.toFixed(0) || '0'}
            </CustomText>
          </View>
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <Ionicons
                name="time-outline"
                size={14}
                color={isDark ? '#9ca3af' : '#6b7280'}
              />
              <CustomText className="text-sm text-gray-600 dark:text-gray-400 ml-1">
                {tour.duration || 0} {tour.durationType === 'days' ? t('explore.tourCard.days') : tour.durationType === 'hours' ? t('explore.tourCard.hours') : ''}
              </CustomText>
            </View>
            {tour.difficulty && (
              <View className="bg-gray-100 dark:bg-neutral-800 px-2 py-1 rounded-full">
                <CustomText className="text-xs text-gray-600 dark:text-gray-400">
                  {t(`explore.filters.${tour.difficulty}`)}
                </CustomText>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  // Compact variant (trips) - simpler layout without image
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
            {tour?.title || '—'}
          </CustomText>
          <CustomText className="text-sm text-gray-600 dark:text-gray-400">
            {tour?.location || '—'}
          </CustomText>
        </View>
        <View className="px-3 py-1 rounded-full bg-primary/10">
          <CustomText className="text-xs text-primary">
            ${typeof tour?.price === 'number' ? tour.price.toFixed(0) : '0'}
          </CustomText>
        </View>
      </View>

      <View className="flex-row items-center mb-2">
        <Ionicons
          name="time-outline"
          size={16}
          color={isDark ? '#9ca3af' : '#6b7280'}
        />
        <CustomText className="text-sm text-gray-600 dark:text-gray-400 ml-2">
          {tour?.duration || 0} {tour?.durationType || 'days'}
        </CustomText>
            <RatingDisplay
              rating={tour?.rating || 0}
              reviews={tour?.reviews}
              size="small"
              showReviews
            />
      </View>

      <CustomText className="text-sm text-gray-500 dark:text-gray-500" numberOfLines={2}>
        {tour?.description || tour?.shortDescription || '—'}
      </CustomText>
    </TouchableOpacity>
  );
});

TourCard.displayName = 'TourCard';

