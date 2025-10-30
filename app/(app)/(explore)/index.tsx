import { useState } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  FlatList,
  TextInput,
  Image,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { CustomText } from '@components/ui/CustomText';
import { useTheme } from '@components/context/ThemeContext';

// Mock data
const mockTours = [
  {
    id: '1',
    title: 'Cherry Blossom Tour',
    location: 'Tokyo, Japan',
    price: 1200,
    rating: 4.8,
    reviews: 156,
    duration: 7,
    category: 'culture',
    image: 'https://via.placeholder.com/300x200',
  },
  {
    id: '2',
    title: 'Alps Hiking Adventure',
    location: 'Swiss Alps',
    price: 2500,
    rating: 4.9,
    reviews: 89,
    duration: 10,
    category: 'adventure',
    image: 'https://via.placeholder.com/300x200',
  },
  {
    id: '3',
    title: 'Italian Food Experience',
    location: 'Rome, Italy',
    price: 1800,
    rating: 4.7,
    reviews: 234,
    duration: 5,
    category: 'food',
    image: 'https://via.placeholder.com/300x200',
  },
];

const mockPlaces = [
  {
    id: '1',
    name: 'Senso-ji Temple',
    location: 'Asakusa, Tokyo',
    distance: 2.3,
    rating: 4.6,
    category: 'culture',
    isOpen: true,
  },
  {
    id: '2',
    name: 'Central Park',
    location: 'New York, USA',
    distance: 5.1,
    rating: 4.8,
    category: 'nature',
    isOpen: true,
  },
];

const categories = [
  { id: 'all', label: 'all', icon: 'grid-outline' },
  { id: 'tours', label: 'tours', icon: 'map-outline' },
  { id: 'places', label: 'places', icon: 'location-outline' },
  { id: 'popular', label: 'popular', icon: 'star-outline' },
  { id: 'nearby', label: 'nearby', icon: 'compass-outline' },
];

interface TourCardProps {
  tour: any;
  onPress: () => void;
  isDark: boolean;
  t: any;
}

const TourCard = ({ tour, onPress, isDark, t }: TourCardProps) => (
  <TouchableOpacity
    onPress={onPress}
    className="bg-white dark:bg-neutral-900 rounded-2xl overflow-hidden mb-4 border border-gray-200 dark:border-neutral-800"
  >
    <View className="h-48 bg-gray-200 dark:bg-neutral-800">
      {/* Placeholder for image */}
      <View className="flex-1 items-center justify-center">
        <Ionicons name="image-outline" size={60} color="#9ca3af" />
      </View>
    </View>
    <View className="p-4">
      <CustomText
        weight="bold"
        className="text-lg text-black dark:text-white mb-1"
      >
        {tour.title}
      </CustomText>
      <View className="flex-row items-center mb-2">
        <Ionicons
          name="location-outline"
          size={14}
          color={isDark ? '#9ca3af' : '#6b7280'}
        />
        <CustomText className="text-sm text-gray-600 dark:text-gray-400 ml-1">
          {tour.location}
        </CustomText>
      </View>
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center">
          <Ionicons name="star" size={16} color="#fbbf24" />
          <CustomText className="text-sm text-gray-700 dark:text-gray-300 ml-1">
            {tour.rating} ({tour.reviews} {t('explore.tourCard.reviews')})
          </CustomText>
        </View>
        <View className="flex-row items-center">
          <CustomText
            weight="bold"
            className="text-base text-primary"
          >
            {t('explore.tourCard.from')} ${tour.price}
          </CustomText>
        </View>
      </View>
      <View className="flex-row items-center mt-2">
        <Ionicons
          name="time-outline"
          size={14}
          color={isDark ? '#9ca3af' : '#6b7280'}
        />
        <CustomText className="text-sm text-gray-600 dark:text-gray-400 ml-1">
          {tour.duration} {t('explore.tourCard.days')}
        </CustomText>
      </View>
    </View>
  </TouchableOpacity>
);

interface PlaceCardProps {
  place: any;
  onPress: () => void;
  isDark: boolean;
  t: any;
}

const PlaceCard = ({ place, onPress, isDark, t }: PlaceCardProps) => (
  <TouchableOpacity
    onPress={onPress}
    className="bg-white dark:bg-neutral-900 rounded-2xl p-4 mb-3 border border-gray-200 dark:border-neutral-800"
  >
    <View className="flex-row justify-between items-start mb-2">
      <View className="flex-1">
        <CustomText
          weight="bold"
          className="text-base text-black dark:text-white mb-1"
        >
          {place.name}
        </CustomText>
        <View className="flex-row items-center">
          <Ionicons
            name="location-outline"
            size={14}
            color={isDark ? '#9ca3af' : '#6b7280'}
          />
          <CustomText className="text-sm text-gray-600 dark:text-gray-400 ml-1">
            {place.distance} {t('explore.placeCard.distance')}
          </CustomText>
        </View>
      </View>
      <View
        className={`px-3 py-1 rounded-full ${
          place.isOpen
            ? 'bg-green-100 dark:bg-green-900'
            : 'bg-red-100 dark:bg-red-900'
        }`}
      >
        <CustomText
          className={`text-xs ${
            place.isOpen
              ? 'text-green-800 dark:text-green-200'
              : 'text-red-800 dark:text-red-200'
          }`}
        >
          {place.isOpen ? t('explore.placeCard.open') : t('explore.placeCard.closed')}
        </CustomText>
      </View>
    </View>
    <View className="flex-row items-center">
      <Ionicons name="star" size={14} color="#fbbf24" />
      <CustomText className="text-sm text-gray-700 dark:text-gray-300 ml-1">
        {place.rating}
      </CustomText>
    </View>
  </TouchableOpacity>
);

export default function ExploreScreen() {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showTours, setShowTours] = useState(true);

  const handleSearch = () => {
    // Implement search logic
    console.log('Searching for:', searchQuery);
  };

  const handleTourPress = (tourId: string) => {
    router.push(`/(app)/(explore)/tours/${tourId}` as any);
  };

  const handlePlacePress = (placeId: string) => {
    router.push(`/(app)/(explore)/places/${placeId}` as any);
  };

  const handleFilterPress = () => {
    // Open filter modal
    console.log('Open filters');
  };

  return (
    <View className="flex-1 bg-white dark:bg-black">
      <Stack.Screen options={{ title: t('explore.title'), headerShown: false }} />
      {/* Header */}
      <View className="px-6 pt-12 pb-4 bg-white dark:bg-black border-b border-gray-200 dark:border-neutral-800">
        <CustomText
          weight="bold"
          className="text-3xl text-black dark:text-white mb-4"
        >
          {t('explore.title')}
        </CustomText>

        {/* Search Bar */}
        <View className="flex-row items-center mb-4">
          <View className="flex-1 flex-row items-center bg-gray-100 dark:bg-neutral-900 rounded-full px-4 py-3 mr-3">
            <Ionicons
              name="search"
              size={20}
              color={isDark ? '#9ca3af' : '#6b7280'}
            />
            <TextInput
              placeholder={t('explore.searchPlaceholder')}
              placeholderTextColor={isDark ? '#9ca3af' : '#6b7280'}
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={handleSearch}
              className="flex-1 ml-2 text-black dark:text-white"
            />
          </View>
          <TouchableOpacity
            onPress={handleFilterPress}
            className="w-12 h-12 bg-primary rounded-full items-center justify-center"
          >
            <Ionicons name="options-outline" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Category Pills */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="flex-row -mx-6 px-6"
        >
          {categories.map(category => (
            <TouchableOpacity
              key={category.id}
              onPress={() => setSelectedCategory(category.id)}
              className={`flex-row items-center px-4 py-2 rounded-full mr-2 ${
                selectedCategory === category.id
                  ? 'bg-primary'
                  : 'bg-gray-100 dark:bg-neutral-900'
              }`}
            >
              <Ionicons
                name={category.icon as any}
                size={16}
                color={
                  selectedCategory === category.id
                    ? '#fff'
                    : isDark
                      ? '#9ca3af'
                      : '#6b7280'
                }
              />
              <CustomText
                className={`ml-2 ${
                  selectedCategory === category.id
                    ? 'text-white'
                    : 'text-gray-700 dark:text-gray-300'
                }`}
              >
                {t(`explore.categories.${category.label}`)}
              </CustomText>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Content Toggle */}
      <View className="flex-row px-6 py-3 bg-white dark:bg-black border-b border-gray-200 dark:border-neutral-800">
        <TouchableOpacity
          onPress={() => setShowTours(true)}
          className={`flex-1 py-2 rounded-lg mr-2 ${
            showTours
              ? 'bg-primary/15 dark:bg-primary/25'
              : 'bg-gray-100 dark:bg-neutral-900'
          }`}
        >
          <CustomText
            weight="medium"
            className={`text-center ${
              showTours ? 'text-primary' : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            {t('explore.categories.tours')}
          </CustomText>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setShowTours(false)}
          className={`flex-1 py-2 rounded-lg ${
            !showTours
              ? 'bg-primary/15 dark:bg-primary/25'
              : 'bg-gray-100 dark:bg-neutral-900'
          }`}
        >
          <CustomText
            weight="medium"
            className={`text-center ${
              !showTours ? 'text-primary' : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            {t('explore.categories.places')}
          </CustomText>
        </TouchableOpacity>
      </View>

      {/* Content List */}
      <ScrollView className="flex-1 px-6 py-4">
        {showTours ? (
          mockTours.map(tour => (
            <TourCard
              key={tour.id}
              tour={tour}
              onPress={() => handleTourPress(tour.id)}
              isDark={isDark}
              t={t}
            />
          ))
        ) : (
          mockPlaces.map(place => (
            <PlaceCard
              key={place.id}
              place={place}
              onPress={() => handlePlacePress(place.id)}
              isDark={isDark}
              t={t}
            />
          ))
        )}
      </ScrollView>

      {/* Floating Search Button */}
      <TouchableOpacity
        onPress={handleSearch}
        className="absolute bottom-8 right-6 w-16 h-16 bg-primary rounded-full items-center justify-center shadow-lg"
        style={{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 4.65,
          elevation: 8,
        }}
      >
        <Ionicons name="search" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

