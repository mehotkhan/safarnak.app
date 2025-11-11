import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { CustomText } from '@components/display';

export interface LocationCardProps {
  location: any;
  onPress: () => void;
  className?: string;
}

/**
 * LocationCard Component
 * 
 * Displays a location card with name, country, description, and popular activities
 * 
 * @example
 * <LocationCard location={location} onPress={() => router.push(`/locations/${location.id}`)} />
 */
export const LocationCard = React.memo<LocationCardProps>(({ location, onPress, className = '' }) => {
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
        <View className="flex-row flex-wrap mt-2">
          {location.popularActivities.slice(0, 3).map((activity: string, index: number) => (
            <View key={index} className="bg-gray-100 dark:bg-neutral-800 px-2 py-1 rounded-full mr-2 mb-2">
              <CustomText className="text-xs text-gray-600 dark:text-gray-400">
                {activity}
              </CustomText>
            </View>
          ))}
        </View>
      )}
    </TouchableOpacity>
  );
});

LocationCard.displayName = 'LocationCard';

