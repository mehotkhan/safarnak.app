import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { CustomText } from '@components/ui/CustomText';
import { useTheme } from '@components/context/ThemeContext';
import { useDateTime } from '@hooks/useDateTime';

export interface TripCardProps {
  trip: any;
  onPress: () => void;
  className?: string;
}

/**
 * TripCard Component
 * 
 * Displays a trip card with destination, dates, status, travelers, and budget
 * 
 * @example
 * <TripCard trip={trip} onPress={() => router.push(`/trips/${trip.id}`)} />
 */
export const TripCard = React.memo<TripCardProps>(({ trip, onPress, className = '' }) => {
  const { isDark } = useTheme();
  const { t } = useTranslation();
  const { formatDate } = useDateTime();

  const statusColor =
    trip?.status === 'in_progress'
      ? 'bg-blue-100 dark:bg-blue-900'
      : 'bg-green-100 dark:bg-green-900';
  const statusTextColor =
    trip?.status === 'in_progress'
      ? 'text-blue-800 dark:text-blue-200'
      : 'text-green-800 dark:text-green-200';

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
            {trip?.destination || '—'}
          </CustomText>
          <CustomText className="text-sm text-gray-600 dark:text-gray-400">
            {trip?.startDate ? formatDate(trip.startDate, 'short') : '—'} - {trip?.endDate ? formatDate(trip.endDate, 'short') : '—'}
          </CustomText>
        </View>
        <View className={`px-3 py-1 rounded-full ${statusColor}`}>
          <CustomText className={`text-xs ${statusTextColor}`}>
            {t(`plan.${trip?.status === 'in_progress' ? 'inProgress' : 'completed'}`)}
          </CustomText>
        </View>
      </View>

      <View className="flex-row items-center mb-2">
        <Ionicons
          name="people-outline"
          size={16}
          color={isDark ? '#9ca3af' : '#6b7280'}
        />
        <CustomText className="text-sm text-gray-600 dark:text-gray-400 ml-2">
          {trip?.travelers ?? 1} {trip?.travelers === 1 ? t('tripDetail.traveler') : t('tripDetail.travelers')}
        </CustomText>
        <Ionicons
          name="wallet-outline"
          size={16}
          color={isDark ? '#9ca3af' : '#6b7280'}
          style={{ marginLeft: 16 }}
        />
        <CustomText className="text-sm text-gray-600 dark:text-gray-400 ml-2">
          {trip?.budget ? `$${trip.budget}` : '—'}
        </CustomText>
      </View>

      {trip?.preferences && (
        <CustomText className="text-sm text-gray-500 dark:text-gray-500">
          {trip.preferences}
        </CustomText>
      )}
    </TouchableOpacity>
  );
});

TripCard.displayName = 'TripCard';

