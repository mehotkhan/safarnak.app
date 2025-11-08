import { useMemo, useState } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useRouter, useLocalSearchParams, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { CustomText } from '@components/ui/CustomText';
import { useTheme } from '@components/context/ThemeContext';
import MapView from '@components/MapView';
import { useGetLocationQuery, useGetPlacesQuery, useGetToursQuery } from '@api';
import Colors from '@constants/Colors';
import ShareModal from '@components/ui/ShareModal';

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

  // Fetch nearby places and tours (filtered by location if needed)
  const { data: placesData } = useGetPlacesQuery({
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all',
  });

  const { data: toursData } = useGetToursQuery({
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all',
  });

  // Filter places and tours by location (if locationId matches)
  // Must be called before early returns to follow React Hooks rules
  const nearbyPlaces = useMemo(() => {
    if (!placesData?.getPlaces || !location?.id) return [];
    return placesData.getPlaces
      .filter((place: any) => place.locationId === location.id)
      .slice(0, 3);
  }, [placesData, location]);

  const availableTours = useMemo(() => {
    if (!toursData?.getTours || !location?.id) return [];
    return toursData.getTours
      .filter((tour: any) => tour.location === location.name || tour.location?.includes(location.name))
      .slice(0, 2);
  }, [toursData, location]);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white dark:bg-black">
        <ActivityIndicator size="large" color={isDark ? Colors.dark.primary : Colors.light.primary} />
        <CustomText className="text-gray-500 dark:text-gray-400 mt-4">
          {t('common.loading')}
        </CustomText>
      </View>
    );
  }

  if (error || !location) {
    return (
      <View className="flex-1 items-center justify-center px-6 bg-white dark:bg-black">
        <Ionicons name="warning-outline" size={64} color={isDark ? '#ef4444' : '#dc2626'} />
        <CustomText weight="bold" className="text-lg text-gray-800 dark:text-gray-300 mt-4 mb-2 text-center">
          {t('common.error')}
        </CustomText>
        <CustomText className="text-base text-gray-600 dark:text-gray-400 text-center">
          {String((error as any)?.message || t('common.errorMessage') || 'Location not found')}
        </CustomText>
        <TouchableOpacity
          onPress={() => router.back()}
          className="mt-4 bg-primary px-6 py-3 rounded-lg"
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

      <View className="px-6 py-6">
        {/* Header */}
        <View className="mb-4">
          <CustomText weight="bold" className="text-3xl text-black dark:text-white mb-2">
            {location.name}
          </CustomText>
          <View className="flex-row items-center">
            <Ionicons name="location" size={16} color={isDark ? '#9ca3af' : '#6b7280'} />
            <CustomText className="text-base text-gray-600 dark:text-gray-400 ml-1">
              {location.country}
            </CustomText>
          </View>
        </View>

        {/* Quick Stats */}
        <View className="flex-row flex-wrap gap-3 mb-6">
          <View className="bg-primary/10 dark:bg-primary/20 rounded-lg px-4 py-3">
            <CustomText className="text-xs text-gray-600 dark:text-gray-400 mb-1">
              {t('location.avgCost')}
            </CustomText>
            <CustomText weight="bold" className="text-base text-primary">
              ${location.averageCost}/day
            </CustomText>
          </View>
          <View className="bg-primary/10 dark:bg-primary/20 rounded-lg px-4 py-3">
            <CustomText className="text-xs text-gray-600 dark:text-gray-400 mb-1">
              {t('location.population')}
            </CustomText>
            <CustomText weight="bold" className="text-base text-primary">
              {location.population}
            </CustomText>
          </View>
          <View className="bg-primary/10 dark:bg-primary/20 rounded-lg px-4 py-3 flex-1">
            <CustomText className="text-xs text-gray-600 dark:text-gray-400 mb-1">
              {t('location.bestTime')}
            </CustomText>
            <CustomText weight="bold" className="text-sm text-primary">
              {location.bestTimeToVisit}
            </CustomText>
          </View>
        </View>

        {/* Description */}
        <View className="mb-6">
          <CustomText weight="bold" className="text-lg text-black dark:text-white mb-2">
            {t('location.about')}
          </CustomText>
          <CustomText className="text-base text-gray-700 dark:text-gray-300 leading-6">
            {location.description}
          </CustomText>
        </View>

        {/* Popular Activities */}
        {location.popularActivities && location.popularActivities.length > 0 && (
        <View className="mb-6">
          <CustomText weight="bold" className="text-lg text-black dark:text-white mb-3">
            {t('location.popularActivities')}
          </CustomText>
            {location.popularActivities.map((activity: string, index: number) => (
            <View key={index} className="flex-row items-center mb-2">
              <Ionicons
                name="checkmark-circle"
                size={20}
                color="#10b981"
                style={{ marginTop: 2 }}
              />
              <CustomText className="text-base text-gray-700 dark:text-gray-300 ml-3">
                {activity}
              </CustomText>
            </View>
          ))}
        </View>
        )}

        {/* Nearby Places */}
        {nearbyPlaces.length > 0 && (
        <View className="mb-6">
          <CustomText weight="bold" className="text-lg text-black dark:text-white mb-3">
            {t('location.nearbyPlaces')}
          </CustomText>
            {nearbyPlaces.map((place: any) => (
            <TouchableOpacity
              key={place.id}
              onPress={() => router.push(`/(app)/(explore)/places/${place.id}` as any)}
              className="bg-white dark:bg-neutral-900 rounded-2xl p-4 mb-3 border border-gray-200 dark:border-neutral-800"
            >
              <View className="flex-row justify-between items-center">
                <View className="flex-1">
                  <CustomText weight="bold" className="text-base text-black dark:text-white mb-1">
                    {place.name}
                  </CustomText>
                  <View className="flex-row items-center">
                    {place.rating && (
                      <>
                    <Ionicons name="star" size={14} color="#fbbf24" />
                    <CustomText className="text-sm text-gray-600 dark:text-gray-400 ml-1">
                      {place.rating}
                    </CustomText>
                      </>
                    )}
                    {place.distance && (
                      <>
                    <CustomText className="text-sm text-gray-500 dark:text-gray-500 mx-2">
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

        {/* Available Tours */}
        {availableTours.length > 0 && (
        <View className="mb-6">
          <CustomText weight="bold" className="text-lg text-black dark:text-white mb-3">
            {t('location.availableTours')}
          </CustomText>
            {availableTours.map((tour: any) => (
            <TouchableOpacity
              key={tour.id}
              onPress={() => router.push(`/(app)/(explore)/tours/${tour.id}` as any)}
              className="bg-white dark:bg-neutral-900 rounded-2xl p-4 mb-3 border border-gray-200 dark:border-neutral-800"
            >
              <CustomText weight="bold" className="text-base text-black dark:text-white mb-2">
                {tour.title}
              </CustomText>
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <Ionicons name="star" size={14} color="#fbbf24" />
                  <CustomText className="text-sm text-gray-600 dark:text-gray-400 ml-1 mr-3">
                    {tour.rating}
                  </CustomText>
                  <Ionicons name="time-outline" size={14} color={isDark ? '#9ca3af' : '#6b7280'} />
                  <CustomText className="text-sm text-gray-600 dark:text-gray-400 ml-1">
                    {tour.duration} {t('explore.tourCard.days')}
                  </CustomText>
                </View>
                <CustomText weight="bold" className="text-base text-primary">
                  ${tour.price}
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

