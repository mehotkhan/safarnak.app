import { useState } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Image,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useRouter, useLocalSearchParams, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { CustomText } from '@components/ui/CustomText';
import { useTheme } from '@components/context/ThemeContext';
import MapView from '@components/MapView';
import Colors from '@constants/Colors';

// Mock location data
const mockLocation = {
  id: '1',
  name: 'Tokyo',
  country: 'Japan',
  description: 'Tokyo, Japan\'s bustling capital, mixes the ultramodern and the traditional, from neon-lit skyscrapers to historic temples. The city offers endless attractions, from world-class museums to traditional gardens, Michelin-starred restaurants to street food stalls.',
  coordinates: {
    latitude: 35.6762,
    longitude: 139.6503,
  },
  popularActivities: [
    'Visit Senso-ji Temple',
    'Explore Shibuya Crossing',
    'Cherry blossom viewing',
    'Tokyo Skytree observation',
    'Tsukiji Outer Market',
    'Meiji Shrine',
  ],
  averageCost: 150,
  bestTimeToVisit: 'March to May, September to November',
  population: '14 million',
  nearbyPlaces: [
    {
      id: '1',
      name: 'Senso-ji Temple',
      distance: 2.3,
      rating: 4.6,
      type: 'culture',
    },
    {
      id: '2',
      name: 'Tokyo Skytree',
      distance: 3.5,
      rating: 4.8,
      type: 'landmark',
    },
    {
      id: '3',
      name: 'Meiji Shrine',
      distance: 5.1,
      rating: 4.7,
      type: 'culture',
    },
  ],
  tours: [
    {
      id: '1',
      title: 'Cherry Blossom Tour',
      price: 1200,
      duration: 7,
      rating: 4.8,
    },
    {
      id: '2',
      title: 'Tokyo Food Adventure',
      price: 800,
      duration: 5,
      rating: 4.9,
    },
  ],
};

export default function LocationDetailScreen() {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [location] = useState(mockLocation);

  const location_data = {
    coords: location.coordinates,
  };

  return (
    <ScrollView className="flex-1 bg-white dark:bg-black">
      <Stack.Screen options={{ title: location.name, headerShown: true }} />

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
        <View className="mb-6">
          <CustomText weight="bold" className="text-lg text-black dark:text-white mb-3">
            {t('location.popularActivities')}
          </CustomText>
          {location.popularActivities.map((activity, index) => (
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

        {/* Nearby Places */}
        <View className="mb-6">
          <CustomText weight="bold" className="text-lg text-black dark:text-white mb-3">
            {t('location.nearbyPlaces')}
          </CustomText>
          {location.nearbyPlaces.map(place => (
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
                    <Ionicons name="star" size={14} color="#fbbf24" />
                    <CustomText className="text-sm text-gray-600 dark:text-gray-400 ml-1">
                      {place.rating}
                    </CustomText>
                    <CustomText className="text-sm text-gray-500 dark:text-gray-500 mx-2">
                      •
                    </CustomText>
                    <CustomText className="text-sm text-gray-600 dark:text-gray-400">
                      {place.distance} km
                    </CustomText>
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

        {/* Available Tours */}
        <View className="mb-6">
          <CustomText weight="bold" className="text-lg text-black dark:text-white mb-3">
            {t('location.availableTours')}
          </CustomText>
          {location.tours.map(tour => (
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
      </View>
    </ScrollView>
  );
}

