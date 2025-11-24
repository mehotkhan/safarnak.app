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

// Mock data for inspirational trips
interface InspirationalTrip {
  id: string;
  title: string;
  description: string;
  destination: string;
  duration: string;
  budget: string;
  imageUrl: string;
  tags: string[];
  author: {
    name: string;
    username: string;
    avatar?: string;
  };
  usedCount: number;
  rating: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

const mockTrips: InspirationalTrip[] = [
  {
    id: '1',
    title: 'Hidden Gems of Northern Iran',
    description: 'Explore the lush forests and mountain villages of Gilan and Mazandaran provinces',
    destination: 'Northern Iran',
    duration: '7 days',
    budget: '$500-800',
    imageUrl: 'https://images.unsplash.com/photo-1600011689032-8b628b8a8747?w=800',
    tags: ['Nature', 'Mountains', 'Culture'],
    author: {
      name: 'Reza Ahmadi',
      username: 'reza_explorer',
    },
    usedCount: 248,
    rating: 4.8,
    difficulty: 'medium',
  },
  {
    id: '2',
    title: 'Desert Adventure: Yazd to Kerman',
    description: 'Journey through ancient desert cities and stunning landscapes',
    destination: 'Central Iran',
    duration: '5 days',
    budget: '$400-600',
    imageUrl: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800',
    tags: ['Desert', 'History', 'Architecture'],
    author: {
      name: 'Sara Mohammadi',
      username: 'sara_wanderer',
    },
    usedCount: 182,
    rating: 4.9,
    difficulty: 'easy',
  },
  {
    id: '3',
    title: 'Kurdish Highlands Trek',
    description: 'Trek through breathtaking mountain ranges and experience Kurdish hospitality',
    destination: 'Kurdistan Province',
    duration: '10 days',
    budget: '$600-1000',
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
    tags: ['Adventure', 'Trekking', 'Mountains'],
    author: {
      name: 'Ali Karimi',
      username: 'ali_hiker',
    },
    usedCount: 156,
    rating: 4.7,
    difficulty: 'hard',
  },
  {
    id: '4',
    title: 'Southern Islands: Persian Gulf Escape',
    description: 'Discover the tropical beauty of Qeshm, Kish, and Hormuz islands',
    destination: 'Persian Gulf',
    duration: '6 days',
    budget: '$700-1200',
    imageUrl: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800',
    tags: ['Beach', 'Islands', 'Relaxation'],
    author: {
      name: 'Mina Hosseini',
      username: 'mina_travel',
    },
    usedCount: 321,
    rating: 4.9,
    difficulty: 'easy',
  },
  {
    id: '5',
    title: 'Silk Road Heritage',
    description: 'Follow ancient trade routes through Isfahan, Kashan, and Shiraz',
    destination: 'Central & Southern Iran',
    duration: '8 days',
    budget: '$800-1500',
    imageUrl: 'https://images.unsplash.com/photo-1600011689032-8b628b8a8747?w=800',
    tags: ['History', 'Culture', 'Architecture'],
    author: {
      name: 'Hassan Rahmani',
      username: 'hassan_heritage',
    },
    usedCount: 412,
    rating: 5.0,
    difficulty: 'easy',
  },
];

export default function InspirationsScreen() {
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

  const getDifficultyLabel = (difficulty: string) => {
    return t(`explore.filters.${difficulty}`);
  };

  const filters = [
    { id: 'all', label: t('explore.categories.all') },
    { id: 'nature', label: t('explore.categories.nature') },
    { id: 'adventure', label: t('explore.categories.adventure') },
    { id: 'culture', label: t('explore.categories.culture') },
    { id: 'relaxation', label: t('explore.categories.relaxation') },
  ];

  const handleUseTrip = (tripId: string) => {
    // In real app, this would create a copy of the trip for the user
    console.log('Using trip:', tripId);
    // Navigate to the create tab or show a modal
    router.push('/(app)/(create)' as any);
  };

  return (
    <View className='flex-1' style={{ backgroundColor: colors.background }}>
      <Stack.Screen
        options={{
          title: t('feed.inspirations'),
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
          {mockTrips.map((trip) => (
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
              onPress={() => {
                // Navigate to trip detail - for now just show the "Use Trip" action
                console.log('Trip pressed:', trip.id);
              }}
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
                    {getDifficultyLabel(trip.difficulty)}
                  </Text>
                </View>
                {/* Rating */}
                <View
                  className='absolute bottom-3 left-3 px-2 py-1 rounded-full flex-row items-center gap-1'
                  style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
                >
                  <Ionicons name='star' size={14} color='#fbbf24' />
                  <Text className='text-xs font-semibold text-white'>
                    {trip.rating}
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

                {/* Info row */}
                <View className='flex-row items-center mb-3 gap-4'>
                  <View className='flex-row items-center gap-1'>
                    <Ionicons
                      name='location'
                      size={16}
                      color={isDark ? '#9ca3af' : '#6b7280'}
                    />
                    <Text
                      className='text-xs'
                      style={{ color: isDark ? '#9ca3af' : '#6b7280' }}
                    >
                      {trip.destination}
                    </Text>
                  </View>
                  <View className='flex-row items-center gap-1'>
                    <Ionicons
                      name='time'
                      size={16}
                      color={isDark ? '#9ca3af' : '#6b7280'}
                    />
                    <Text
                      className='text-xs'
                      style={{ color: isDark ? '#9ca3af' : '#6b7280' }}
                    >
                      {trip.duration}
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
                      {trip.budget}
                    </Text>
                  </View>
                </View>

                {/* Tags */}
                <View className='flex-row flex-wrap gap-2 mb-3'>
                  {trip.tags.map((tag, index) => (
                    <View
                      key={index}
                      className='px-2 py-1 rounded-full'
                      style={{ backgroundColor: isDark ? '#374151' : '#f3f4f6' }}
                    >
                      <Text
                        className='text-xs'
                        style={{ color: isDark ? '#9ca3af' : '#6b7280' }}
                      >
                        {tag}
                      </Text>
                    </View>
                  ))}
                </View>

                {/* Author & Stats */}
                <View className='flex-row items-center justify-between pt-3 border-t' style={{ borderTopColor: isDark ? '#374151' : '#e5e7eb' }}>
                  <View className='flex-row items-center gap-2'>
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
                    <View>
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
                        {trip.usedCount} {t('common.people')}
                      </Text>
                    </View>
                  </View>

                  {/* Use Trip Button */}
                  <TouchableOpacity
                    onPress={() => handleUseTrip(trip.id)}
                    className='px-4 py-2 rounded-full flex-row items-center gap-2'
                    style={{ backgroundColor: colors.primary }}
                    activeOpacity={0.8}
                  >
                    <Ionicons name='download' size={16} color='#fff' />
                    <Text className='text-sm font-semibold text-white'>
                      {t('feed.useThisTrip')}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

