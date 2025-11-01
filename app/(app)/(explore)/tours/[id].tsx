import { useState } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useRouter, useLocalSearchParams, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { CustomText } from '@components/ui/CustomText';
import CustomButton from '@components/ui/CustomButton';
import { useTheme } from '@components/context/ThemeContext';
import Colors from '@constants/Colors';

// Mock data
const mockTour = {
  id: '1',
  title: 'Cherry Blossom Tour',
  location: 'Tokyo, Japan',
  price: 1200,
  rating: 4.8,
  reviews: 156,
  duration: 7,
  category: 'culture',
  image: 'https://picsum.photos/seed/tokyo-tour-detail/800/600',
  description:
    'Experience the magical beauty of cherry blossoms in full bloom across Tokyo. This 7-day tour includes visits to the most scenic spots, traditional tea ceremonies, and authentic Japanese cuisine.',
  highlights: [
    'Visit 5+ famous cherry blossom viewing spots',
    'Traditional tea ceremony experience',
    'Guided tours by local experts',
    'All meals included',
    'Comfortable accommodation',
  ],
  inclusions: ['Accommodation', 'All meals', 'Transportation', 'Tour guide', 'Entry fees'],
  dates: ['2025-03-20', '2025-03-27', '2025-04-03', '2025-04-10'],
  maxParticipants: 20,
  difficulty: 'Easy',
};

export default function TourDetailScreen() {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [tour] = useState(mockTour);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const handleJoinTour = () => {
    router.push(`/(app)/(explore)/tours/${id}/book` as any);
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  return (
    <View className="flex-1 bg-white dark:bg-black">
      <Stack.Screen
        options={{
          title: tour.title,
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
        {/* Image */}
        <View className="h-64 bg-gray-200 dark:bg-neutral-800">
          <Image
            source={{ uri: tour.image }}
            className="w-full h-full"
            resizeMode="cover"
          />
        </View>

        <View className="px-6 py-4">
          {/* Title and Price */}
          <View className="flex-row justify-between items-start mb-3">
            <View className="flex-1">
              <CustomText
                weight="bold"
                className="text-2xl text-black dark:text-white mb-2"
              >
                {tour.title}
              </CustomText>
              <View className="flex-row items-center">
                <Ionicons
                  name="location"
                  size={16}
                  color={isDark ? '#9ca3af' : '#6b7280'}
                />
                <CustomText className="text-base text-gray-600 dark:text-gray-400 ml-1">
                  {tour.location}
                </CustomText>
              </View>
            </View>
            <View className="items-end">
              <CustomText className="text-sm text-gray-600 dark:text-gray-400">
                {t('explore.tourCard.from')}
              </CustomText>
              <CustomText
                weight="bold"
                className="text-2xl text-primary"
              >
                ${tour.price}
              </CustomText>
            </View>
          </View>

          {/* Rating and Duration */}
          <View className="flex-row items-center mb-4">
            <View className="flex-row items-center mr-4">
              <Ionicons name="star" size={18} color="#fbbf24" />
              <CustomText
                weight="medium"
                className="text-base text-gray-700 dark:text-gray-300 ml-1"
              >
                {tour.rating}
              </CustomText>
              <CustomText className="text-sm text-gray-500 dark:text-gray-500 ml-1">
                ({tour.reviews})
              </CustomText>
            </View>
            <View className="flex-row items-center">
              <Ionicons
                name="time-outline"
                size={18}
                color={isDark ? '#9ca3af' : '#6b7280'}
              />
              <CustomText className="text-base text-gray-600 dark:text-gray-400 ml-1">
                {tour.duration} {t('explore.tourCard.days')}
              </CustomText>
            </View>
          </View>

          {/* Description */}
          <View className="mb-4">
            <CustomText
              weight="bold"
              className="text-lg text-black dark:text-white mb-2"
            >
              {t('tourDetail.aboutTour')}
            </CustomText>
            <CustomText className="text-base text-gray-700 dark:text-gray-300 leading-6">
              {tour.description}
            </CustomText>
          </View>

          {/* Highlights */}
          <View className="mb-4">
            <CustomText
              weight="bold"
              className="text-lg text-black dark:text-white mb-2"
            >
              {t('tourDetail.highlights')}
            </CustomText>
            {tour.highlights.map((highlight, index) => (
              <View key={index} className="flex-row items-start mb-2">
                <Ionicons
                  name="checkmark-circle"
                  size={20}
                  color="#10b981"
                  style={{ marginTop: 2 }}
                />
                <CustomText className="text-base text-gray-700 dark:text-gray-300 ml-2 flex-1">
                  {highlight}
                </CustomText>
              </View>
            ))}
          </View>

          {/* Inclusions */}
          <View className="mb-4">
            <CustomText
              weight="bold"
              className="text-lg text-black dark:text-white mb-2"
            >
              {t('tourDetail.whatsIncluded')}
            </CustomText>
            <View className="flex-row flex-wrap gap-2">
              {tour.inclusions.map((item, index) => (
                <View
                  key={index}
                  className="px-3 py-2 bg-primary/15 dark:bg-primary/25 rounded-full"
                >
                  <CustomText className="text-sm text-primary">
                    {item}
                  </CustomText>
                </View>
              ))}
            </View>
          </View>

          {/* Details */}
          <View className="bg-gray-50 dark:bg-neutral-900 rounded-2xl p-4 mb-6">
            <View className="flex-row justify-between mb-3">
              <CustomText className="text-base text-gray-600 dark:text-gray-400">
                {t('tourDetail.maxParticipants')}
              </CustomText>
              <CustomText
                weight="medium"
                className="text-base text-black dark:text-white"
              >
                {tour.maxParticipants}
              </CustomText>
            </View>
            <View className="flex-row justify-between">
              <CustomText className="text-base text-gray-600 dark:text-gray-400">
                {t('tourDetail.difficulty')}
              </CustomText>
              <CustomText
                weight="medium"
                className="text-base text-black dark:text-white"
              >
                {tour.difficulty}
              </CustomText>
            </View>
          </View>

          {/* Action Button */}
          <CustomButton
            title={t('explore.tourCard.joinTour')}
            onPress={handleJoinTour}
            IconLeft={() => (
              <Ionicons
                name="checkmark-circle"
                size={20}
                color="#fff"
                style={{ marginRight: 8 }}
              />
            )}
          />

          <View className="h-8" />
        </View>
      </ScrollView>
    </View>
  );
}

