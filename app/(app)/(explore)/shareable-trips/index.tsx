import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  RefreshControl,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, Stack } from 'expo-router';
import { useAppSelector } from '@state/hooks';
import Colors from '@constants/Colors';

// Mock data for shareable trips
interface ShareableTrip {
  id: string;
  title: string;
  description: string;
  destination: string;
  duration: number; // days
  budget: {
    min: number;
    max: number;
    currency: string;
  };
  imageUrl: string;
  route: string[];
  highlights: string[];
  season: string;
  difficulty: 'easy' | 'medium' | 'hard';
  style: string[];
  author: {
    name: string;
    username: string;
    avatar?: string;
  };
  usedCount: number;
  savedCount: number;
  rating: number;
  reviewsCount: number;
  isPublic: boolean;
  createdAt: Date;
}

const mockShareableTrips: ShareableTrip[] = [
  {
    id: '1',
    title: 'Northern Paradise: Gilan & Mazandaran Adventure',
    description: 'A week-long journey through lush forests, mountain villages, and coastal beauty of Northern Iran',
    destination: 'Gilan & Mazandaran',
    duration: 7,
    budget: { min: 500, max: 800, currency: 'USD' },
    imageUrl: 'https://images.unsplash.com/photo-1600011689032-8b628b8a8747?w=800',
    route: ['Tehran', 'Ramsar', 'Masuleh', 'Lahijan', 'Rasht', 'Anzali', 'Tehran'],
    highlights: ['Masuleh Village', 'Caspian Sea', 'Rice Fields', 'Forest Hiking'],
    season: 'Spring',
    difficulty: 'medium',
    style: ['Nature', 'Adventure', 'Culture'],
    author: {
      name: 'Reza Ahmadi',
      username: 'reza_explorer',
    },
    usedCount: 248,
    savedCount: 156,
    rating: 4.8,
    reviewsCount: 42,
    isPublic: true,
    createdAt: new Date(2024, 9, 15),
  },
  {
    id: '2',
    title: 'Desert Dreams: Yazd to Kerman Route',
    description: 'Explore ancient desert cities, stunning landscapes, and rich Persian heritage',
    destination: 'Central Iran',
    duration: 5,
    budget: { min: 400, max: 600, currency: 'USD' },
    imageUrl: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800',
    route: ['Yazd', 'Meybod', 'Kharanaq', 'Kerman', 'Mahan'],
    highlights: ['Windcatchers', 'Desert Castles', 'Fire Temple', 'Shazdeh Garden'],
    season: 'Autumn',
    difficulty: 'easy',
    style: ['History', 'Desert', 'Culture'],
    author: {
      name: 'Sara Mohammadi',
      username: 'sara_wanderer',
    },
    usedCount: 182,
    savedCount: 94,
    rating: 4.9,
    reviewsCount: 31,
    isPublic: true,
    createdAt: new Date(2024, 8, 20),
  },
  {
    id: '3',
    title: 'Kurdish Highlands: Nature & Culture',
    description: 'Trek through breathtaking mountains and experience Kurdish culture and hospitality',
    destination: 'Kurdistan Province',
    duration: 10,
    budget: { min: 600, max: 1000, currency: 'USD' },
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
    route: ['Sanandaj', 'Palangan', 'Uraman Takht', 'Howraman', 'Marivan'],
    highlights: ['Palangan Village', 'Howraman Valley', 'Mountain Trekking', 'Local Culture'],
    season: 'Summer',
    difficulty: 'hard',
    style: ['Adventure', 'Trekking', 'Nature'],
    author: {
      name: 'Ali Karimi',
      username: 'ali_hiker',
    },
    usedCount: 156,
    savedCount: 127,
    rating: 4.7,
    reviewsCount: 28,
    isPublic: true,
    createdAt: new Date(2024, 7, 10),
  },
  {
    id: '4',
    title: 'Persian Gulf Islands Escape',
    description: 'Discover the tropical beauty of Qeshm, Kish, and Hormuz islands',
    destination: 'Persian Gulf',
    duration: 6,
    budget: { min: 700, max: 1200, currency: 'USD' },
    imageUrl: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800',
    route: ['Qeshm', 'Hengam Island', 'Hormuz Island', 'Kish'],
    highlights: ['Stars Valley', 'Rainbow Mountain', 'Beaches', 'Water Sports'],
    season: 'Winter',
    difficulty: 'easy',
    style: ['Beach', 'Relaxation', 'Nature'],
    author: {
      name: 'Mina Hosseini',
      username: 'mina_travel',
    },
    usedCount: 321,
    savedCount: 198,
    rating: 4.9,
    reviewsCount: 56,
    isPublic: true,
    createdAt: new Date(2024, 10, 5),
  },
  {
    id: '5',
    title: 'Silk Road Heritage Trail',
    description: 'Follow ancient trade routes through Isfahan, Kashan, and Shiraz',
    destination: 'Central & Southern Iran',
    duration: 8,
    budget: { min: 800, max: 1500, currency: 'USD' },
    imageUrl: 'https://images.unsplash.com/photo-1600011689032-8b628b8a8747?w=800',
    route: ['Tehran', 'Kashan', 'Isfahan', 'Yazd', 'Shiraz'],
    highlights: ['Isfahan Bridges', 'Kashan Gardens', 'Persepolis', 'Nasir al-Mulk Mosque'],
    season: 'Spring',
    difficulty: 'easy',
    style: ['History', 'Culture', 'Architecture'],
    author: {
      name: 'Hassan Rahmani',
      username: 'hassan_heritage',
    },
    usedCount: 412,
    savedCount: 245,
    rating: 5.0,
    reviewsCount: 73,
    isPublic: true,
    createdAt: new Date(2024, 9, 1),
  },
];

export default function ShareableTripsScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const isDark = useAppSelector(state => state.theme.isDark);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  const colors = isDark ? Colors.dark : Colors.light;

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return '#10b981';
      case 'medium':
        return '#f59e0b';
      case 'hard':
        return '#ef4444';
      default:
        return colors.text;
    }
  };

  const filters = [
    { id: 'all', label: t('explore.categories.all') },
    { id: 'nature', label: t('explore.categories.nature') },
    { id: 'adventure', label: t('explore.categories.adventure') },
    { id: 'culture', label: t('explore.categories.culture') },
    { id: 'relaxation', label: t('explore.categories.relaxation') },
  ];

  return (
    <View className='flex-1' style={{ backgroundColor: colors.background }}>
      <Stack.Screen
        options={{
          title: t('explore.shareableTrips'),
          headerShown: true,
          headerLargeTitle: false,
        }}
      />

      {/* Filter tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className='border-b'
        style={{
          borderBottomColor: isDark ? '#333' : '#e5e7eb',
          maxHeight: 50,
        }}
      >
        <View className='flex-row px-4 py-2 gap-2'>
          {filters.map((filter) => (
            <TouchableOpacity
              key={filter.id}
              onPress={() => setSelectedFilter(filter.id)}
              className='px-4 py-2 rounded-full'
              style={{
                backgroundColor:
                  selectedFilter === filter.id
                    ? colors.primary
                    : isDark ? '#374151' : '#f3f4f6',
              }}
            >
              <Text
                className='font-medium'
                style={{
                  color:
                    selectedFilter === filter.id
                      ? '#fff'
                      : colors.text,
                }}
              >
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Trips list */}
      <ScrollView
        className='flex-1'
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View className='p-4 gap-4'>
          {mockShareableTrips.map((trip) => (
            <TouchableOpacity
              key={trip.id}
              className='rounded-2xl overflow-hidden'
              style={{
                backgroundColor: isDark ? '#1f2937' : '#fff',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: isDark ? 0.3 : 0.1,
                shadowRadius: 8,
                elevation: 3,
              }}
              activeOpacity={0.9}
              onPress={() => router.push(`/(app)/(explore)/shareable-trips/${trip.id}` as any)}
            >
              {/* Image */}
              <View className='relative'>
                <Image
                  source={{ uri: trip.imageUrl }}
                  className='w-full h-48'
                  resizeMode='cover'
                />
                {/* Difficulty badge */}
                <View
                  className='absolute top-3 right-3 px-3 py-1 rounded-full'
                  style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
                >
                  <Text
                    className='text-xs font-semibold'
                    style={{ color: getDifficultyColor(trip.difficulty) }}
                  >
                    {t(`explore.filters.${trip.difficulty}`)}
                  </Text>
                </View>
                {/* Rating */}
                <View
                  className='absolute bottom-3 left-3 px-2 py-1 rounded-full flex-row items-center gap-1'
                  style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
                >
                  <Ionicons name='star' size={14} color='#fbbf24' />
                  <Text className='text-xs font-semibold text-white'>
                    {trip.rating} ({trip.reviewsCount})
                  </Text>
                </View>
                {/* Duration */}
                <View
                  className='absolute bottom-3 right-3 px-2 py-1 rounded-full flex-row items-center gap-1'
                  style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
                >
                  <Ionicons name='calendar' size={14} color='#fff' />
                  <Text className='text-xs font-semibold text-white'>
                    {trip.duration} {t('explore.tourCard.days')}
                  </Text>
                </View>
              </View>

              {/* Content */}
              <View className='p-4'>
                {/* Title */}
                <Text
                  className='text-lg font-bold mb-2'
                  style={{ color: colors.text }}
                  numberOfLines={2}
                >
                  {trip.title}
                </Text>

                {/* Description */}
                <Text
                  className='text-sm mb-3'
                  style={{ color: isDark ? '#9ca3af' : '#6b7280' }}
                  numberOfLines={2}
                >
                  {trip.description}
                </Text>

                {/* Stats */}
                <View className='flex-row items-center gap-4 mb-3'>
                  <View className='flex-row items-center gap-1'>
                    <Ionicons
                      name='download'
                      size={16}
                      color={isDark ? '#9ca3af' : '#6b7280'}
                    />
                    <Text
                      className='text-xs'
                      style={{ color: isDark ? '#9ca3af' : '#6b7280' }}
                    >
                      {trip.usedCount} {t('stats.used')}
                    </Text>
                  </View>
                  <View className='flex-row items-center gap-1'>
                    <Ionicons
                      name='bookmark'
                      size={16}
                      color={isDark ? '#9ca3af' : '#6b7280'}
                    />
                    <Text
                      className='text-xs'
                      style={{ color: isDark ? '#9ca3af' : '#6b7280' }}
                    >
                      {trip.savedCount} {t('stats.saved')}
                    </Text>
                  </View>
                  <View className='flex-row items-center gap-1'>
                    <Ionicons
                      name='cash'
                      size={16}
                      color={isDark ? '#9ca3af' : '#6b7280'}
                    />
                    <Text
                      className='text-xs'
                      style={{ color: isDark ? '#9ca3af' : '#6b7280' }}
                    >
                      ${trip.budget.min}-{trip.budget.max}
                    </Text>
                  </View>
                </View>

                {/* Route preview */}
                <View className='mb-3'>
                  <Text
                    className='text-xs font-semibold mb-1'
                    style={{ color: isDark ? '#9ca3af' : '#6b7280' }}
                  >
                    Route:
                  </Text>
                  <Text
                    className='text-xs'
                    style={{ color: isDark ? '#9ca3af' : '#6b7280' }}
                    numberOfLines={1}
                  >
                    {trip.route.join(' → ')}
                  </Text>
                </View>

                {/* Author */}
                <View className='flex-row items-center gap-2 pt-3 border-t' style={{ borderTopColor: isDark ? '#374151' : '#e5e7eb' }}>
                  <View
                    className='w-8 h-8 rounded-full items-center justify-center'
                    style={{ backgroundColor: isDark ? '#374151' : '#e5e7eb' }}
                  >
                    <Ionicons
                      name='person'
                      size={16}
                      color={isDark ? '#9ca3af' : '#6b7280'}
                    />
                  </View>
                  <View className='flex-1'>
                    <Text
                      className='text-xs font-medium'
                      style={{ color: colors.text }}
                    >
                      {trip.author.name}
                    </Text>
                    <Text
                      className='text-xs'
                      style={{ color: isDark ? '#6b7280' : '#9ca3af' }}
                    >
                      @{trip.author.username}
                    </Text>
                  </View>
                  <Ionicons
                    name='chevron-forward'
                    size={20}
                    color={isDark ? '#6b7280' : '#9ca3af'}
                  />
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

