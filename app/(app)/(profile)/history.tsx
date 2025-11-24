import React, { useState } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  RefreshControl,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import { useAppSelector } from '@state/hooks';
import Colors from '@constants/Colors';
import { CustomText } from '@ui/display';
import { ShareableTabs } from '@ui/layout/ShareableTabs';

type TravelHistoryType = 'trip' | 'tour';

interface TravelHistoryItem {
  id: string;
  type: TravelHistoryType;
  title: string;
  location: string;
  startDate: Date;
  endDate: Date;
  status: 'completed' | 'cancelled';
  imageUrl?: string;
}

const mockTravelHistory: TravelHistoryItem[] = [
  {
    id: 'trip-1',
    type: 'trip',
    title: 'Summer Vacation in Mazandaran',
    location: 'Mazandaran, Iran',
    startDate: new Date(2024, 6, 10),
    endDate: new Date(2024, 6, 17),
    status: 'completed',
    imageUrl: 'https://images.unsplash.com/photo-1600011689032-8b628b8a8747?w=800',
  },
  {
    id: 'tour-1',
    type: 'tour',
    title: 'Isfahan Cultural Tour',
    location: 'Isfahan, Iran',
    startDate: new Date(2024, 3, 5),
    endDate: new Date(2024, 3, 8),
    status: 'completed',
    imageUrl: 'https://images.unsplash.com/photo-1600011689032-8b628b8a8747?w=800',
  },
  {
    id: 'trip-2',
    type: 'trip',
    title: 'Desert Adventure: Yazd & Kerman',
    location: 'Central Iran',
    startDate: new Date(2023, 10, 1),
    endDate: new Date(2023, 10, 5),
    status: 'completed',
    imageUrl: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800',
  },
  {
    id: 'tour-2',
    type: 'tour',
    title: 'Northern Hiking Group',
    location: 'Alborz Mountains',
    startDate: new Date(2023, 5, 20),
    endDate: new Date(2023, 5, 24),
    status: 'completed',
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
  },
];

export default function HistoryScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const isDark = useAppSelector(state => state.theme.isDark);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<'all' | TravelHistoryType>('all');

  const colors = isDark ? Colors.dark : Colors.light;

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 800);
  };

  const formatDateRange = (start: Date, end: Date) => {
    const sameMonth = start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear();
    const monthFormatter = new Intl.DateTimeFormat('en-US', { month: 'short' });
    const dayFormatter = new Intl.DateTimeFormat('en-US', { day: '2-digit' });
    const yearFormatter = new Intl.DateTimeFormat('en-US', { year: 'numeric' });

    if (sameMonth) {
      return `${monthFormatter.format(start)} ${dayFormatter.format(start)}–${dayFormatter.format(end)}, ${yearFormatter.format(
        end,
      )}`;
    }

    return `${monthFormatter.format(start)} ${dayFormatter.format(start)} – ${monthFormatter.format(
      end,
    )} ${dayFormatter.format(end)}, ${yearFormatter.format(end)}`;
  };

  const filteredHistory =
    selectedFilter === 'all'
      ? mockTravelHistory
      : mockTravelHistory.filter(item => item.type === selectedFilter);

  const filterTabs = [
    { id: 'all', label: 'All', translationKey: 'explore.categories.all' },
    { id: 'trip', label: 'Trips', translationKey: 'explore.categories.trips' },
    { id: 'tour', label: 'Tours', translationKey: 'explore.categories.tours' },
  ];

  const handleOpenItem = (item: TravelHistoryItem) => {
    if (item.type === 'trip') {
      router.push(`/(app)/(create)/${item.id}` as any);
    } else {
      router.push(`/(app)/(explore)/tours/${item.id}` as any);
    }
  };

  return (
    <View className='flex-1' style={{ backgroundColor: colors.background }}>
      <Stack.Screen
        options={{
          title: t('me.history'),
          headerShown: true,
        }}
      />

      {/* Filter tabs */}
      <ShareableTabs
        tabs={filterTabs}
        activeTab={selectedFilter}
        onTabChange={(tabId) => setSelectedFilter(tabId as 'all' | TravelHistoryType)}
      />

      {/* History list */}
      <ScrollView
        className='flex-1'
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {filteredHistory.length === 0 ? (
          <View className='items-center justify-center py-20'>
            <Ionicons
              name='time-outline'
              size={64}
              color={isDark ? '#6b7280' : '#9ca3af'}
            />
            <CustomText
              weight='bold'
              className='text-lg mt-4'
              style={{ color: colors.text }}
            >
              {t('me.tripsList.emptyState')}
            </CustomText>
          </View>
        ) : (
          <View className='p-4 gap-4'>
            {filteredHistory.map(item => (
              <TouchableOpacity
                key={item.id}
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
                onPress={() => handleOpenItem(item)}
              >
                {/* Image */}
                {item.imageUrl && (
                  <View className='relative'>
                    <Image
                      source={{ uri: item.imageUrl }}
                      className='w-full h-40'
                      resizeMode='cover'
                    />
                    {/* Type badge */}
                    <View
                      className='absolute top-3 right-3 px-3 py-1 rounded-full flex-row items-center gap-1'
                      style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
                    >
                      <Ionicons
                        name={item.type === 'trip' ? 'airplane' : 'flag'}
                        size={12}
                        color={item.type === 'trip' ? '#10b981' : '#f59e0b'}
                      />
                      <CustomText
                        className='text-xs font-semibold capitalize'
                        style={{ color: item.type === 'trip' ? '#10b981' : '#f59e0b' }}
                      >
                        {item.type === 'trip'
                          ? t('trips.title', { defaultValue: 'Trip' })
                          : t('explore.tours.title', { defaultValue: 'Tour' })}
                      </CustomText>
                    </View>
                  </View>
                )}

                {/* Content */}
                <View className='p-4'>
                  <CustomText
                    weight='bold'
                    className='text-lg mb-1'
                    style={{ color: colors.text }}
                    numberOfLines={1}
                  >
                    {item.title}
                  </CustomText>

                  {/* Location & Date */}
                  <View className='flex-row items-center justify-between mb-3'>
                    <View className='flex-row items-center'>
                      <Ionicons
                        name='location-outline'
                        size={14}
                        color={isDark ? '#9ca3af' : '#6b7280'}
                      />
                      <CustomText
                        className='text-xs ml-1.5'
                        style={{ color: isDark ? '#9ca3af' : '#6b7280' }}
                        numberOfLines={1}
                      >
                        {item.location}
                      </CustomText>
                    </View>
                    <View className='flex-row items-center'>
                      <Ionicons
                        name='calendar-outline'
                        size={14}
                        color={isDark ? '#9ca3af' : '#6b7280'}
                      />
                      <CustomText
                        className='text-xs ml-1.5'
                        style={{ color: isDark ? '#9ca3af' : '#6b7280' }}
                      >
                        {formatDateRange(item.startDate, item.endDate)}
                      </CustomText>
                    </View>
                  </View>

                  {/* Status */}
                  <View className='flex-row items-center justify-between'>
                    <View
                      className='px-3 py-1 rounded-full'
                      style={{
                        backgroundColor:
                          item.status === 'completed'
                            ? 'rgba(16,185,129,0.1)'
                            : 'rgba(239,68,68,0.08)',
                      }}
                    >
                      <CustomText
                        className='text-xs font-medium'
                        style={{
                          color: item.status === 'completed' ? '#059669' : '#b91c1c',
                        }}
                      >
                        {item.status === 'completed'
                          ? t('trips.status.completed', { defaultValue: 'Completed' })
                          : t('trips.status.cancelled', { defaultValue: 'Cancelled' })}
                      </CustomText>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
