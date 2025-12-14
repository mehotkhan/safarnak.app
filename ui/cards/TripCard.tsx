import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { CustomText } from '@ui/display';
import { useTheme } from '@ui/context';
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
      className={`mb-4 rounded-2xl border border-gray-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900 ${className}`}
      activeOpacity={0.8}
    >
      <View className="mb-3 flex-row items-start justify-between">
        <View className="flex-1">
          <View className="mb-1 flex-row items-center">
          <CustomText
            weight="bold"
              className="text-lg text-black dark:text-white"
          >
            {trip?.destination || '—'}
          </CustomText>
            {/* TODO: Show hosted badge when trip.isHosted is available (Phase 10-11) */}
            {trip?.isHosted && (
              <View className="ml-2 rounded-full bg-purple-100 px-2 py-0.5 dark:bg-purple-900">
                <CustomText className="text-xs text-purple-800 dark:text-purple-200" weight="medium">
                  {t('trips.hostedBadge') || 'Hosted'}
                </CustomText>
              </View>
            )}
          </View>
          <CustomText className="text-sm text-gray-600 dark:text-gray-400">
            {trip?.startDate ? formatDate(trip.startDate, 'short') : '—'} - {trip?.endDate ? formatDate(trip.endDate, 'short') : '—'}
          </CustomText>
        </View>
        <View className={`rounded-full px-3 py-1 ${statusColor}`}>
          <CustomText className={`text-xs ${statusTextColor}`}>
            {t(`plan.${trip?.status === 'in_progress' ? 'inProgress' : 'completed'}`)}
          </CustomText>
        </View>
      </View>

      <View className="mb-2 flex-row items-center">
        <Ionicons
          name="people-outline"
          size={16}
          color={isDark ? '#9ca3af' : '#6b7280'}
        />
        <CustomText className="ml-2 text-sm text-gray-600 dark:text-gray-400">
          {trip?.travelers ?? 1} {trip?.travelers === 1 ? t('tripDetail.traveler') : t('tripDetail.travelers')}
        </CustomText>
        {/* Show price for hosted trips, budget for personal trips */}
        {trip?.isHosted && trip?.price ? (
          <>
            <Ionicons
              name="cash-outline"
              size={16}
              color={isDark ? '#9ca3af' : '#6b7280'}
              style={{ marginLeft: 16 }}
            />
            <CustomText className="ml-2 text-sm text-gray-600 dark:text-gray-400">
              {trip.currency || 'USD'} {trip.price}
            </CustomText>
          </>
        ) : (
          <>
        <Ionicons
          name="wallet-outline"
          size={16}
          color={isDark ? '#9ca3af' : '#6b7280'}
          style={{ marginLeft: 16 }}
        />
        <CustomText className="ml-2 text-sm text-gray-600 dark:text-gray-400">
          {trip?.budget ? `$${trip.budget}` : '—'}
        </CustomText>
          </>
        )}
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

