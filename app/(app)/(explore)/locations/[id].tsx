import { useMemo, useState } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useRouter, useLocalSearchParams, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { CustomText } from '@ui/display';
import { useTheme } from '@ui/context';
import { MapView } from '@ui/maps';
import { useGetLocationQuery, useGetPlacesQuery, useGetTripsQuery } from '@api';
import Colors from '@constants/Colors';
import { ShareModal } from '@ui/modals';

export default function LocationDetailScreen() {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const locationId = useMemo(() => (Array.isArray(id) ? id[0] : id) as string, [id]);
  const [showShareModal, setShowShareModal] = useState(false);

  // GraphQL queries
  const { data, loading, error } = useGetLocationQuery({
    variables: { id: locationId },
    skip: !locationId,
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all',
  });

  const location = data?.getLocation as any;

  // Fetch nearby places and hosted trips (filtered by location if needed)
  const { data: placesData } = useGetPlacesQuery({
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all',
  });

  const { data: hostedTripsData } = useGetTripsQuery({
    variables: { isHosted: true },
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all',
  });

  // Filter places and hosted trips by location (if locationId matches)
  // Must be called before early returns to follow React Hooks rules
  const nearbyPlaces = useMemo(() => {
    if (!placesData?.getPlaces || !location?.id) return [];
    return placesData.getPlaces
      .filter((place: any) => place.locationId === location.id)
      .slice(0, 3);
  }, [placesData, location]);

  const availableHostedTrips = useMemo(() => {
    if (!hostedTripsData?.getTrips || !location?.id) return [];
    return hostedTripsData.getTrips
      .filter((trip: any) => trip.isHosted && (trip.location === location.name || trip.location?.includes(location.name)))
      .slice(0, 2);
  }, [hostedTripsData, location]);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white dark:bg-black">
        <ActivityIndicator size="large" color={isDark ? Colors.dark.primary : Colors.light.primary} />
        <CustomText className="mt-4 text-gray-500 dark:text-gray-400">
          {t('common.loading')}
        </CustomText>
      </View>
    );
  }

  if (error || !location) {
    return (
      <View className="flex-1 items-center justify-center bg-white px-6 dark:bg-black">
        <Ionicons name="warning-outline" size={64} color={isDark ? '#ef4444' : '#dc2626'} />
        <CustomText weight="bold" className="mb-2 mt-4 text-center text-lg text-gray-800 dark:text-gray-300">
          {t('common.error')}
        </CustomText>
        <CustomText className="text-center text-base text-gray-600 dark:text-gray-400">
          {String((error as any)?.message || t('common.errorMessage') || 'Location not found')}
        </CustomText>
        <TouchableOpacity
          onPress={() => router.back()}
          className="mt-4 rounded-lg bg-primary px-6 py-3"
        >
          <CustomText className="text-white" weight="medium">
            {t('common.back') || 'Go Back'}
          </CustomText>
        </TouchableOpacity>
      </View>
    );
  }

  const location_data = {
    coords: location.coordinates,
  };

  return (
    <ScrollView className="flex-1 bg-white dark:bg-black">
      <Stack.Screen 
        options={{ 
          title: location.name, 
          headerShown: true,
          headerRight: () => (
            <TouchableOpacity
              onPress={() => setShowShareModal(true)}
              className="mr-4"
            >
              <Ionicons name="share-outline" size={24} color={isDark ? '#fff' : '#000'} />
            </TouchableOpacity>
          ),
        }} 
      />

      {/* Map */}
      <View className="h-64 bg-gray-100 dark:bg-neutral-900">
        <MapView location={location_data as any} />
      </View>

      <View className="p-6">
        {/* Header */}
        <View className="mb-4">
          <CustomText weight="bold" className="mb-2 text-3xl text-black dark:text-white">
            {location.name}
          </CustomText>
          <View className="flex-row items-center">
            <Ionicons name="location" size={16} color={isDark ? '#9ca3af' : '#6b7280'} />
            <CustomText className="ml-1 text-base text-gray-600 dark:text-gray-400">
              {location.country}
            </CustomText>
          </View>
        </View>

        {/* Quick Stats */}
        <View className="mb-6 flex-row flex-wrap gap-3">
          <View className="rounded-lg bg-primary/10 px-4 py-3 dark:bg-primary/20">
            <CustomText className="mb-1 text-xs text-gray-600 dark:text-gray-400">
              {t('location.avgCost')}
            </CustomText>
            <CustomText weight="bold" className="text-base text-primary">
              ${location.averageCost}/day
            </CustomText>
          </View>
          <View className="rounded-lg bg-primary/10 px-4 py-3 dark:bg-primary/20">
            <CustomText className="mb-1 text-xs text-gray-600 dark:text-gray-400">
              {t('location.population')}
            </CustomText>
            <CustomText weight="bold" className="text-base text-primary">
              {location.population}
            </CustomText>
          </View>
          <View className="flex-1 rounded-lg bg-primary/10 px-4 py-3 dark:bg-primary/20">
            <CustomText className="mb-1 text-xs text-gray-600 dark:text-gray-400">
              {t('location.bestTime')}
            </CustomText>
            <CustomText weight="bold" className="text-sm text-primary">
              {location.bestTimeToVisit}
            </CustomText>
          </View>
        </View>

        {/* Description */}
        <View className="mb-6">
          <CustomText weight="bold" className="mb-2 text-lg text-black dark:text-white">
            {t('location.about')}
          </CustomText>
          <CustomText className="text-base leading-6 text-gray-700 dark:text-gray-300">
            {location.description}
          </CustomText>
        </View>

        {/* Popular Activities */}
        {location.popularActivities && location.popularActivities.length > 0 && (
        <View className="mb-6">
          <CustomText weight="bold" className="mb-3 text-lg text-black dark:text-white">
            {t('location.popularActivities')}
          </CustomText>
            {location.popularActivities.map((activity: string, index: number) => (
            <View key={index} className="mb-2 flex-row items-center">
              <Ionicons
                name="checkmark-circle"
                size={20}
                color="#10b981"
                style={{ marginTop: 2 }}
              />
              <CustomText className="ml-3 text-base text-gray-700 dark:text-gray-300">
                {activity}
              </CustomText>
            </View>
          ))}
        </View>
        )}

        {/* Nearby Places */}
        {nearbyPlaces.length > 0 && (
        <View className="mb-6">
          <CustomText weight="bold" className="mb-3 text-lg text-black dark:text-white">
            {t('location.nearbyPlaces')}
          </CustomText>
            {nearbyPlaces.map((place: any) => (
            <TouchableOpacity
              key={place.id}
              onPress={() => router.push(`/(app)/(explore)/places/${place.id}` as any)}
              className="mb-3 rounded-2xl border border-gray-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900"
            >
              <View className="flex-row items-center justify-between">
                <View className="flex-1">
                  <CustomText weight="bold" className="mb-1 text-base text-black dark:text-white">
                    {place.name}
                  </CustomText>
                  <View className="flex-row items-center">
                    {place.rating && (
                      <>
                    <Ionicons name="star" size={14} color="#fbbf24" />
                    <CustomText className="ml-1 text-sm text-gray-600 dark:text-gray-400">
                      {place.rating}
                    </CustomText>
                      </>
                    )}
                    {place.distance && (
                      <>
                    <CustomText className="mx-2 text-sm text-gray-500 dark:text-gray-500">
                      •
                    </CustomText>
                    <CustomText className="text-sm text-gray-600 dark:text-gray-400">
                      {place.distance} km
                    </CustomText>
                      </>
                    )}
                  </View>
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={isDark ? '#666' : '#9ca3af'}
                />
              </View>
            </TouchableOpacity>
          ))}
        </View>
        )}

        {/* Available Hosted Trips */}
        {availableHostedTrips.length > 0 && (
        <View className="mb-6">
          <CustomText weight="bold" className="mb-3 text-lg text-black dark:text-white">
            {t('location.availableTours') || 'Available Hosted Trips'}
          </CustomText>
            {availableHostedTrips.map((trip: any) => (
            <TouchableOpacity
              key={trip.id}
              onPress={() => router.push(`/(app)/(trips)/${trip.id}` as any)}
              className="mb-3 rounded-2xl border border-gray-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900"
            >
              <CustomText weight="bold" className="mb-2 text-base text-black dark:text-white">
                {trip.title}
              </CustomText>
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <Ionicons name="star" size={14} color="#fbbf24" />
                  <CustomText className="ml-1 mr-3 text-sm text-gray-600 dark:text-gray-400">
                    {trip.rating}
                  </CustomText>
                  <Ionicons name="time-outline" size={14} color={isDark ? '#9ca3af' : '#6b7280'} />
                  <CustomText className="ml-1 text-sm text-gray-600 dark:text-gray-400">
                    {trip.duration} {t('explore.tourCard.days') || 'days'}
                  </CustomText>
                </View>
                <CustomText weight="bold" className="text-base text-primary">
                  ${trip.price}
                </CustomText>
              </View>
            </TouchableOpacity>
          ))}
        </View>
        )}
      </View>

      <ShareModal
        visible={showShareModal}
        onClose={() => setShowShareModal(false)}
      />
    </ScrollView>
  );
}

