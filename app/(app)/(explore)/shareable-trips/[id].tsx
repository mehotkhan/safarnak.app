import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, Stack, useLocalSearchParams } from 'expo-router';
import { useAppSelector } from '@state/hooks';
import Colors from '@constants/Colors';

// Mock trip data (same as list but with full itinerary)
const mockTrip = {
  id: '1',
  title: 'Northern Paradise: Gilan & Mazandaran Adventure',
  description: 'A week-long journey through lush forests, mountain villages, and coastal beauty of Northern Iran. Experience the perfect blend of nature, culture, and adventure.',
  destination: 'Gilan & Mazandaran',
  duration: 7,
  budget: { min: 500, max: 800, currency: 'USD' },
  imageUrl: 'https://images.unsplash.com/photo-1600011689032-8b628b8a8747?w=800',
  route: ['Tehran', 'Ramsar', 'Masuleh', 'Lahijan', 'Rasht', 'Anzali', 'Tehran'],
  highlights: ['Masuleh Village', 'Caspian Sea', 'Rice Fields', 'Forest Hiking', 'Local Cuisine', 'Tea Plantations'],
  season: 'Spring',
  difficulty: 'medium',
  style: ['Nature', 'Adventure', 'Culture'],
  author: {
    name: 'Reza Ahmadi',
    username: 'reza_explorer',
    avatar: null,
  },
  usedCount: 248,
  savedCount: 156,
  rating: 4.8,
  reviewsCount: 42,
  isPublic: true,
  createdAt: new Date(2024, 9, 15),
  itinerary: [
    {
      day: 1,
      title: 'Arrival in Ramsar',
      activities: [
        'Drive from Tehran to Ramsar (4 hours)',
        'Check-in to hotel',
        'Evening walk along Caspian Sea coast',
        'Dinner at local seafood restaurant',
      ],
      accommodation: 'Ramsar Hotel',
      meals: 'Dinner included',
    },
    {
      day: 2,
      title: 'Masuleh Village',
      activities: [
        'Morning drive to Masuleh (2 hours)',
        'Explore the stepped village architecture',
        'Visit local handicraft shops',
        'Traditional lunch in village',
        'Hiking in surrounding forests',
      ],
      accommodation: 'Masuleh Guesthouse',
      meals: 'Breakfast, Lunch, Dinner',
    },
    {
      day: 3,
      title: 'Tea Plantations & Lahijan',
      activities: [
        'Visit tea plantations',
        'Tea factory tour',
        'Lunch in Lahijan',
        'Explore Lahijan city center',
        'Cable car ride (optional)',
      ],
      accommodation: 'Lahijan Hotel',
      meals: 'Breakfast, Lunch',
    },
    {
      day: 4,
      title: 'Rasht - Food Capital',
      activities: [
        'Drive to Rasht',
        'Visit Rasht Grand Bazaar',
        'Traditional Gilaki cooking class',
        'Explore city parks',
        'Evening food tour',
      ],
      accommodation: 'Rasht Hotel',
      meals: 'Breakfast, Cooking Class',
    },
    {
      day: 5,
      title: 'Anzali Lagoon',
      activities: [
        'Morning boat tour of Anzali Lagoon',
        'Bird watching',
        'Visit Anzali Fish Market',
        'Free time at beach',
        'Sunset by the water',
      ],
      accommodation: 'Anzali Hotel',
      meals: 'Breakfast',
    },
    {
      day: 6,
      title: 'Forest Hiking',
      activities: [
        'Trek in Alangdareh Forest',
        'Picnic lunch',
        'Photography opportunities',
        'Visit local villages',
        'Return to Ramsar',
      ],
      accommodation: 'Ramsar Hotel',
      meals: 'Breakfast, Picnic Lunch',
    },
    {
      day: 7,
      title: 'Return to Tehran',
      activities: [
        'Leisure morning',
        'Drive back to Tehran',
        'End of trip',
      ],
      accommodation: 'None',
      meals: 'Breakfast',
    },
  ],
  notes: 'Best visited in Spring (April-May) when forests are lush and weather is mild. Bring comfortable hiking shoes and rain jacket. Local guides available for forest treks.',
  included: ['Accommodation (6 nights)', 'Transportation', 'Some meals', 'Entry fees', 'Local guide'],
  notIncluded: ['International flights', 'Personal expenses', 'Travel insurance', 'Optional activities'],
};

export default function ShareableTripDetailScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const _id = useLocalSearchParams().id; // Trip ID - used for future GraphQL integration
  const isDark = useAppSelector(state => state.theme.isDark);
  const [selectedTab, setSelectedTab] = useState<'itinerary' | 'info' | 'map'>('itinerary');
  const [isSaved, setIsSaved] = useState(false);

  const colors = isDark ? Colors.dark : Colors.light;

  const handleUseTrip = () => {
    Alert.alert(
      t('explore.useTrip'),
      'This will create a copy of this trip in your "My Trips" section. You can then customize it to your preferences.',
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('explore.copyTrip'),
          onPress: () => {
            // In real app, copy trip to user's trips
            router.push('/(app)/(create)' as any);
          },
        },
      ]
    );
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
  };

  return (
    <View className='flex-1' style={{ backgroundColor: colors.background }}>
      <Stack.Screen
        options={{
          title: t('explore.tripDetails'),
          headerShown: true,
          headerLargeTitle: false,
        }}
      />

      <ScrollView className='flex-1'>
        {/* Hero Image */}
        <View className='relative'>
          <Image
            source={{ uri: mockTrip.imageUrl }}
            className='w-full h-64'
            resizeMode='cover'
          />
          {/* Overlay info */}
          <View
            className='absolute bottom-0 left-0 right-0 p-4'
            style={{
              backgroundColor: 'rgba(0,0,0,0.5)',
            }}
          >
            <Text className='text-2xl font-bold text-white mb-1'>
              {mockTrip.title}
            </Text>
            <View className='flex-row items-center gap-2'>
              <View className='flex-row items-center gap-1'>
                <Ionicons name='location' size={16} color='#fff' />
                <Text className='text-sm text-white'>{mockTrip.destination}</Text>
              </View>
              <View className='flex-row items-center gap-1'>
                <Ionicons name='calendar' size={16} color='#fff' />
                <Text className='text-sm text-white'>
                  {mockTrip.duration} {t('explore.tourCard.days')}
                </Text>
              </View>
              <View className='flex-row items-center gap-1'>
                <Ionicons name='star' size={16} color='#fbbf24' />
                <Text className='text-sm text-white'>
                  {mockTrip.rating} ({mockTrip.reviewsCount})
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Action buttons */}
        <View className='flex-row gap-2 p-4'>
          <TouchableOpacity
            onPress={handleUseTrip}
            className='flex-1 py-3 rounded-full flex-row items-center justify-center gap-2'
            style={{ backgroundColor: colors.primary }}
            activeOpacity={0.8}
          >
            <Ionicons name='download' size={20} color='#fff' />
            <Text className='text-base font-semibold text-white'>
              {t('explore.useTrip')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleSave}
            className='w-12 py-3 rounded-full items-center justify-center'
            style={{ backgroundColor: isDark ? '#374151' : '#f3f4f6' }}
            activeOpacity={0.8}
          >
            <Ionicons
              name={isSaved ? 'bookmark' : 'bookmark-outline'}
              size={24}
              color={isSaved ? colors.primary : (isDark ? '#9ca3af' : '#6b7280')}
            />
          </TouchableOpacity>
        </View>

        {/* Tabs */}
        <View className='flex-row border-b px-4' style={{ borderBottomColor: isDark ? '#333' : '#e5e7eb' }}>
          {(['itinerary', 'info', 'map'] as const).map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => setSelectedTab(tab)}
              className='px-4 py-3'
              style={{
                borderBottomWidth: selectedTab === tab ? 2 : 0,
                borderBottomColor: colors.primary,
              }}
            >
              <Text
                className='font-semibold'
                style={{
                  color: selectedTab === tab ? colors.primary : (isDark ? '#9ca3af' : '#6b7280'),
                }}
              >
                {t(`explore.${tab}`)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Tab content */}
        <View className='p-4'>
          {selectedTab === 'itinerary' && (
            <View className='gap-4'>
              {mockTrip.itinerary.map((day) => (
                <View
                  key={day.day}
                  className='p-4 rounded-xl'
                  style={{ backgroundColor: isDark ? '#1f2937' : '#f9fafb' }}
                >
                  <View className='flex-row items-center gap-2 mb-2'>
                    <View
                      className='w-8 h-8 rounded-full items-center justify-center'
                      style={{ backgroundColor: colors.primary }}
                    >
                      <Text className='text-sm font-bold text-white'>{day.day}</Text>
                    </View>
                    <Text className='text-lg font-bold flex-1' style={{ color: colors.text }}>
                      {day.title}
                    </Text>
                  </View>
                  {day.activities.map((activity, idx) => (
                    <View key={idx} className='flex-row items-start gap-2 mb-1 ml-10'>
                      <Ionicons
                        name='checkmark-circle'
                        size={16}
                        color={colors.primary}
                        style={{ marginTop: 2 }}
                      />
                      <Text
                        className='text-sm flex-1'
                        style={{ color: isDark ? '#d1d5db' : '#374151' }}
                      >
                        {activity}
                      </Text>
                    </View>
                  ))}
                  {day.accommodation !== 'None' && (
                    <View className='flex-row items-center gap-2 mt-2 ml-10'>
                      <Ionicons
                        name='bed'
                        size={16}
                        color={isDark ? '#9ca3af' : '#6b7280'}
                      />
                      <Text
                        className='text-xs'
                        style={{ color: isDark ? '#9ca3af' : '#6b7280' }}
                      >
                        {day.accommodation}
                      </Text>
                    </View>
                  )}
                  <View className='flex-row items-center gap-2 mt-1 ml-10'>
                    <Ionicons
                      name='restaurant'
                      size={16}
                      color={isDark ? '#9ca3af' : '#6b7280'}
                    />
                    <Text
                      className='text-xs'
                      style={{ color: isDark ? '#9ca3af' : '#6b7280' }}
                    >
                      {day.meals}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          )}

          {selectedTab === 'info' && (
            <View className='gap-4'>
              {/* Description */}
              <View>
                <Text className='text-base font-bold mb-2' style={{ color: colors.text }}>
                  About This Trip
                </Text>
                <Text className='text-sm leading-6' style={{ color: isDark ? '#d1d5db' : '#374151' }}>
                  {mockTrip.description}
                </Text>
              </View>

              {/* Highlights */}
              <View>
                <Text className='text-base font-bold mb-2' style={{ color: colors.text }}>
                  Highlights
                </Text>
                <View className='flex-row flex-wrap gap-2'>
                  {mockTrip.highlights.map((highlight, idx) => (
                    <View
                      key={idx}
                      className='px-3 py-2 rounded-full flex-row items-center gap-1'
                      style={{ backgroundColor: isDark ? '#374151' : '#e5e7eb' }}
                    >
                      <Ionicons name='star' size={14} color={colors.primary} />
                      <Text
                        className='text-xs'
                        style={{ color: colors.text }}
                      >
                        {highlight}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>

              {/* Included */}
              <View>
                <Text className='text-base font-bold mb-2' style={{ color: colors.text }}>
                  What&apos;s Included
                </Text>
                {mockTrip.included.map((item, idx) => (
                  <View key={idx} className='flex-row items-center gap-2 mb-1'>
                    <Ionicons name='checkmark-circle' size={16} color='#10b981' />
                    <Text
                      className='text-sm'
                      style={{ color: isDark ? '#d1d5db' : '#374151' }}
                    >
                      {item}
                    </Text>
                  </View>
                ))}
              </View>

              {/* Not Included */}
              <View>
                <Text className='text-base font-bold mb-2' style={{ color: colors.text }}>
                  Not Included
                </Text>
                {mockTrip.notIncluded.map((item, idx) => (
                  <View key={idx} className='flex-row items-center gap-2 mb-1'>
                    <Ionicons name='close-circle' size={16} color='#ef4444' />
                    <Text
                      className='text-sm'
                      style={{ color: isDark ? '#d1d5db' : '#374151' }}
                    >
                      {item}
                    </Text>
                  </View>
                ))}
              </View>

              {/* Notes */}
              <View>
                <Text className='text-base font-bold mb-2' style={{ color: colors.text }}>
                  Important Notes
                </Text>
                <Text
                  className='text-sm leading-6'
                  style={{ color: isDark ? '#d1d5db' : '#374151' }}
                >
                  {mockTrip.notes}
                </Text>
              </View>

              {/* Author */}
              <View className='p-4 rounded-xl' style={{ backgroundColor: isDark ? '#1f2937' : '#f9fafb' }}>
                <Text className='text-base font-bold mb-2' style={{ color: colors.text }}>
                  Trip Creator
                </Text>
                <View className='flex-row items-center gap-3'>
                  <View
                    className='w-12 h-12 rounded-full items-center justify-center'
                    style={{ backgroundColor: isDark ? '#374151' : '#e5e7eb' }}
                  >
                    <Ionicons name='person' size={24} color={isDark ? '#9ca3af' : '#6b7280'} />
                  </View>
                  <View className='flex-1'>
                    <Text className='text-base font-semibold' style={{ color: colors.text }}>
                      {mockTrip.author.name}
                    </Text>
                    <Text className='text-sm' style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>
                      @{mockTrip.author.username}
                    </Text>
                  </View>
                  <View className='items-end'>
                    <Text className='text-xs' style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>
                      {mockTrip.usedCount} trips created
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          )}

          {selectedTab === 'map' && (
            <View className='items-center justify-center py-20'>
              <Ionicons
                name='map'
                size={64}
                color={isDark ? '#6b7280' : '#9ca3af'}
              />
              <Text
                className='text-base font-semibold mt-4'
                style={{ color: colors.text }}
              >
                Route Map
              </Text>
              <Text
                className='text-sm mt-2 text-center'
                style={{ color: isDark ? '#9ca3af' : '#6b7280' }}
              >
                Interactive map coming soon
              </Text>
              <View className='mt-4 p-3 rounded-xl' style={{ backgroundColor: isDark ? '#1f2937' : '#f3f4f6' }}>
                <Text className='text-xs' style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>
                  {mockTrip.route.join(' → ')}
                </Text>
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Bottom action bar */}
      <View
        className='p-4 border-t'
        style={{
          backgroundColor: colors.background,
          borderTopColor: isDark ? '#333' : '#e5e7eb',
        }}
      >
        <View className='flex-row items-center justify-between mb-2'>
          <View>
            <Text className='text-xs' style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>
              Budget per person
            </Text>
            <Text className='text-lg font-bold' style={{ color: colors.text }}>
              ${mockTrip.budget.min}-{mockTrip.budget.max}
            </Text>
          </View>
          <TouchableOpacity
            onPress={handleUseTrip}
            className='px-6 py-3 rounded-full'
            style={{ backgroundColor: colors.primary }}
            activeOpacity={0.8}
          >
            <Text className='text-base font-semibold text-white'>
              {t('explore.useTrip')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

