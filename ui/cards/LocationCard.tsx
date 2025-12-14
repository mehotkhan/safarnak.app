import React, { useMemo } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { CustomText } from '@ui/display';
import { ImageWithPlaceholder } from '@ui/display';

export interface LocationCardProps {
  location: any;
  onPress: () => void;
  className?: string;
}

/**
 * LocationCard Component
 * 
 * Displays a location card with image, name, country, description, and popular activities
 * 
 * @example
 * <LocationCard location={location} onPress={() => router.push(`/locations/${location.id}`)} />
 */
export const LocationCard = React.memo<LocationCardProps>(({ location, onPress, className = '' }) => {
  const { t } = useTranslation();

  // Generate placeholder image URL using Picsum Photos
  const placeholderImageUrl = useMemo(() => {
    const seed = location?.id ? location.id.substring(0, 8) : 'default';
    return `https://picsum.photos/seed/${seed}/400/200`;
  }, [location]);

  const imageUrl = location?.imageUrl || null;

  return (
    <TouchableOpacity
      onPress={onPress}
      className={`mb-4 overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-neutral-800 dark:bg-neutral-900 ${className}`}
      activeOpacity={0.8}
    >
      {/* Image */}
      <ImageWithPlaceholder
        source={imageUrl ? { uri: imageUrl } : { uri: placeholderImageUrl }}
        placeholder={placeholderImageUrl}
        fallbackText={t('locations.noImage') || 'Location Image'}
        width="100%"
        height={150}
        resizeMode="cover"
      />
      
      <View className="p-4">
        <View className="mb-3 flex-row items-start justify-between">
          <View className="flex-1">
            <CustomText
              weight="bold"
              className="mb-1 text-lg text-black dark:text-white"
            >
              {location?.name || '—'}
            </CustomText>
            <CustomText className="text-sm text-gray-600 dark:text-gray-400">
              {location?.country || '—'}
            </CustomText>
          </View>
        </View>

      {location?.description && (
        <CustomText className="text-sm text-gray-500 dark:text-gray-500" numberOfLines={2}>
          {location.description}
        </CustomText>
      )}

      {location?.popularActivities && location.popularActivities.length > 0 && (
        <View className="mt-2 flex-row flex-wrap">
          {location.popularActivities.slice(0, 3).map((activity: string, index: number) => (
            <View key={index} className="mb-2 mr-2 rounded-full bg-gray-100 px-2 py-1 dark:bg-neutral-800">
              <CustomText className="text-xs text-gray-600 dark:text-gray-400">
                {activity}
              </CustomText>
            </View>
          ))}
        </View>
      )}
      </View>
    </TouchableOpacity>
  );
});

LocationCard.displayName = 'LocationCard';

