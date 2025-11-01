import { useState } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useRouter, useLocalSearchParams, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { CustomText } from '@components/ui/CustomText';
import CustomButton from '@components/ui/CustomButton';
import { useTheme } from '@components/context/ThemeContext';
import Colors from '@constants/Colors';
import MapView from '@components/MapView';

// Mock data
const mockPlace = {
  id: '1',
  name: 'Senso-ji Temple',
  location: 'Asakusa, Tokyo',
  distance: 2.3,
  rating: 4.6,
  reviews: 1234,
  category: 'culture',
  isOpen: true,
  hours: {
    monday: '6:00 AM - 5:00 PM',
    tuesday: '6:00 AM - 5:00 PM',
    wednesday: '6:00 AM - 5:00 PM',
    thursday: '6:00 AM - 5:00 PM',
    friday: '6:00 AM - 5:00 PM',
    saturday: '6:00 AM - 5:00 PM',
    sunday: '6:00 AM - 5:00 PM',
  },
  description:
    'Senso-ji is Tokyo\'s oldest and most significant Buddhist temple. Located in Asakusa, this iconic landmark features the famous Kaminarimon "Thunder Gate" and Nakamise shopping street.',
  tips: [
    'Visit early morning to avoid crowds',
    'Try traditional snacks at Nakamise street',
    'Free admission',
    'Photography allowed in most areas',
  ],
  coordinates: {
    latitude: 35.7148,
    longitude: 139.7967,
  },
  phone: '+81-3-3842-0181',
  website: 'https://www.senso-ji.jp',
};

export default function PlaceDetailScreen() {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [place] = useState(mockPlace);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    Alert.alert(
      t('common.success'),
      isBookmarked ? t('placeDetail.bookmarkRemoved') : t('placeDetail.bookmarkAdded')
    );
  };

  const handleGetDirections = () => {
    Alert.alert(t('placeDetail.getDirections'), t('placeDetail.openingNavigation'));
  };

  const location = {
    coords: place.coordinates,
  };

  return (
    <View className="flex-1 bg-white dark:bg-black">
      <Stack.Screen
        options={{
          title: place.name,
          headerShown: true,
          headerRight: () => (
            <TouchableOpacity onPress={handleBookmark} className="p-2">
              <Ionicons
                name={isBookmarked ? 'bookmark' : 'bookmark-outline'}
                size={22}
                color={isBookmarked ? (isDark ? Colors.dark.primary : Colors.light.primary) : (isDark ? '#fff' : '#000')}
              />
            </TouchableOpacity>
          ),
        }}
      />

      <ScrollView className="flex-1">
        {/* Map */}
        <View className="h-64 bg-gray-100 dark:bg-neutral-900">
          <MapView location={location as any} />
        </View>

        <View className="px-6 py-4">
          {/* Title and Status */}
          <View className="flex-row justify-between items-start mb-3">
            <View className="flex-1">
              <CustomText
                weight="bold"
                className="text-2xl text-black dark:text-white mb-2"
              >
                {place.name}
              </CustomText>
              <View className="flex-row items-center">
                <Ionicons
                  name="location"
                  size={16}
                  color={isDark ? '#9ca3af' : '#6b7280'}
                />
              <CustomText className="text-base text-gray-600 dark:text-gray-400 ml-1">
                {place.distance} {t('placeDetail.kmAway')}
              </CustomText>
              </View>
            </View>
            <View
              className={`px-3 py-2 rounded-full ${
                place.isOpen
                  ? 'bg-green-100 dark:bg-green-900'
                  : 'bg-red-100 dark:bg-red-900'
              }`}
            >
              <CustomText
                weight="medium"
                className={`text-sm ${
                  place.isOpen
                    ? 'text-green-800 dark:text-green-200'
                    : 'text-red-800 dark:text-red-200'
                }`}
              >
                {place.isOpen
                  ? t('explore.placeCard.open')
                  : t('explore.placeCard.closed')}
              </CustomText>
            </View>
          </View>

          {/* Rating */}
          <View className="flex-row items-center mb-4">
            <Ionicons name="star" size={18} color="#fbbf24" />
            <CustomText
              weight="medium"
              className="text-base text-gray-700 dark:text-gray-300 ml-1"
            >
              {place.rating}
            </CustomText>
            <CustomText className="text-sm text-gray-500 dark:text-gray-500 ml-1">
              ({place.reviews} {t('placeDetail.reviews')})
            </CustomText>
          </View>

          {/* Description */}
          <View className="mb-4">
            <CustomText
              weight="bold"
              className="text-lg text-black dark:text-white mb-2"
            >
              {t('placeDetail.about')}
            </CustomText>
            <CustomText className="text-base text-gray-700 dark:text-gray-300 leading-6">
              {place.description}
            </CustomText>
          </View>

          {/* Hours */}
          <View className="mb-4">
            <CustomText
              weight="bold"
              className="text-lg text-black dark:text-white mb-2"
            >
              {t('placeDetail.hours')}
            </CustomText>
            <View className="bg-gray-50 dark:bg-neutral-900 rounded-2xl p-4">
              {Object.entries(place.hours).map(([day, hours]) => (
                <View
                  key={day}
                  className="flex-row justify-between mb-2 last:mb-0"
                >
                  <CustomText className="text-base text-gray-600 dark:text-gray-400 capitalize">
                    {day}
                  </CustomText>
                  <CustomText
                    weight="medium"
                    className="text-base text-black dark:text-white"
                  >
                    {hours}
                  </CustomText>
                </View>
              ))}
            </View>
          </View>

          {/* Tips */}
          <View className="mb-4">
            <CustomText
              weight="bold"
              className="text-lg text-black dark:text-white mb-2"
            >
              {t('placeDetail.tips')}
            </CustomText>
            {place.tips.map((tip, index) => (
              <View key={index} className="flex-row items-start mb-2">
                <Ionicons
                  name="bulb"
                  size={18}
                  color="#fbbf24"
                  style={{ marginTop: 2 }}
                />
                <CustomText className="text-base text-gray-700 dark:text-gray-300 ml-2 flex-1">
                  {tip}
                </CustomText>
              </View>
            ))}
          </View>

          {/* Contact */}
          <View className="bg-gray-50 dark:bg-neutral-900 rounded-2xl p-4 mb-6">
            <View className="flex-row items-center mb-3">
              <Ionicons
                name="call-outline"
                size={18}
                color={isDark ? '#9ca3af' : '#6b7280'}
              />
              <CustomText className="text-base text-gray-700 dark:text-gray-300 ml-3">
                {place.phone}
              </CustomText>
            </View>
            <View className="flex-row items-center">
              <Ionicons
                name="globe-outline"
                size={18}
                color={isDark ? '#9ca3af' : '#6b7280'}
              />
              <CustomText className="text-base text-primary ml-3">
                {place.website}
              </CustomText>
            </View>
          </View>

          {/* Action Buttons */}
          <View className="gap-3 mb-6">
            <CustomButton
              title={t('placeDetail.getDirections')}
              onPress={handleGetDirections}
              IconLeft={() => (
                <Ionicons
                  name="navigate"
                  size={20}
                  color="#fff"
                  style={{ marginRight: 8 }}
                />
              )}
            />
            <CustomButton
              title={t('explore.tourCard.bookmark')}
              onPress={handleBookmark}
              bgVariant="secondary"
              IconLeft={() => (
                <Ionicons
                  name={isBookmarked ? 'bookmark' : 'bookmark-outline'}
                  size={20}
                  color={isDark ? '#fff' : '#000'}
                  style={{ marginRight: 8 }}
                />
              )}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

