import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  RefreshControl,
  Switch,
  Alert,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, Stack } from 'expo-router';
import { useAppSelector } from '@state/hooks';
import Colors from '@constants/Colors';

// Mock data for user's shareable trips
interface MyShareableTrip {
  id: string;
  title: string;
  description: string;
  destination: string;
  duration: number;
  imageUrl: string;
  isPublic: boolean;
  usedCount: number;
  savedCount: number;
  viewsCount: number;
  createdAt: Date;
  lastUpdated: Date;
}

const mockMyShareableTrips: MyShareableTrip[] = [
  {
    id: '1',
    title: 'Weekend Getaway to Caspian Coast',
    description: 'Perfect 3-day escape to northern beaches',
    destination: 'Mazandaran',
    duration: 3,
    imageUrl: 'https://images.unsplash.com/photo-1600011689032-8b628b8a8747?w=800',
    isPublic: true,
    usedCount: 42,
    savedCount: 28,
    viewsCount: 156,
    createdAt: new Date(2024, 9, 1),
    lastUpdated: new Date(2024, 10, 15),
  },
  {
    id: '2',
    title: 'Cultural Heritage Tour: Isfahan',
    description: 'Explore the magnificent architecture and history',
    destination: 'Isfahan',
    duration: 4,
    imageUrl: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800',
    isPublic: true,
    usedCount: 67,
    savedCount: 45,
    viewsCount: 298,
    createdAt: new Date(2024, 8, 15),
    lastUpdated: new Date(2024, 10, 10),
  },
  {
    id: '3',
    title: 'Mountain Trekking Adventure',
    description: 'Challenging trek through Alborz mountains',
    destination: 'Alborz',
    duration: 5,
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
    isPublic: false,
    usedCount: 0,
    savedCount: 0,
    viewsCount: 12,
    createdAt: new Date(2024, 10, 20),
    lastUpdated: new Date(2024, 10, 20),
  },
];

export default function MyShareableTripsScreen() {
  const { t } = useTranslation();
  const _router = useRouter(); // Reserved for future navigation
  const isDark = useAppSelector(state => state.theme.isDark);
  const [trips, setTrips] = useState(mockMyShareableTrips);
  const [refreshing, setRefreshing] = useState(false);

  const colors = isDark ? Colors.dark : Colors.light;

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const toggleVisibility = (tripId: string, currentStatus: boolean) => {
    Alert.alert(
      currentStatus ? t('create.makePrivate') : t('create.makePublic'),
      currentStatus
        ? 'This trip will no longer be visible to others'
        : 'This trip will be shared with the community',
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.ok'),
          onPress: () => {
            setTrips(prev =>
              prev.map(trip =>
                trip.id === tripId ? { ...trip, isPublic: !currentStatus } : trip
              )
            );
            // In real app, would navigate to updated trip
            // router.push(`/(app)/(trips)/${tripId}` as any);
          },
        },
      ]
    );
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const publicTrips = trips.filter(t => t.isPublic);
  const privateTrips = trips.filter(t => !t.isPublic);

  return (
    <View className='flex-1' style={{ backgroundColor: colors.background }}>
      <Stack.Screen
        options={{
          title: t('create.myShareableTrips'),
          headerShown: true,
          headerLargeTitle: false,
        }}
      />

      <ScrollView
        className='flex-1'
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header Info */}
        <View className='p-4 border-b' style={{ borderBottomColor: isDark ? '#333' : '#e5e7eb' }}>
          <Text className='text-sm' style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>
            {t('create.shareableTrips.description')}
          </Text>
          <View className='flex-row items-center gap-4 mt-3'>
            <View>
              <Text className='text-2xl font-bold' style={{ color: colors.text }}>
                {publicTrips.length}
              </Text>
              <Text className='text-xs' style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>
                {t('create.shareableTrips.public')}
              </Text>
            </View>
            <View>
              <Text className='text-2xl font-bold' style={{ color: colors.text }}>
                {trips.reduce((sum, t) => sum + t.usedCount, 0)}
              </Text>
              <Text className='text-xs' style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>
                {t('stats.totalUses')}
              </Text>
            </View>
            <View>
              <Text className='text-2xl font-bold' style={{ color: colors.text }}>
                {trips.reduce((sum, t) => sum + t.viewsCount, 0)}
              </Text>
              <Text className='text-xs' style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>
                {t('stats.totalViews')}
              </Text>
            </View>
          </View>
        </View>

        {trips.length === 0 ? (
          <View className='items-center justify-center py-20'>
            <Ionicons
              name='compass-outline'
              size={64}
              color={isDark ? '#6b7280' : '#9ca3af'}
            />
            <Text
              className='text-lg font-semibold mt-4'
              style={{ color: colors.text }}
            >
              {t('create.shareableTrips.emptyState')}
            </Text>
            <Text
              className='text-sm mt-2 text-center px-8'
              style={{ color: isDark ? '#9ca3af' : '#6b7280' }}
            >
              {t('create.shareableTrips.emptyDescription')}
            </Text>
          </View>
        ) : (
          <View className='p-4 gap-4'>
            {/* Public Trips */}
            {publicTrips.length > 0 && (
              <>
                <Text className='text-lg font-bold mb-2' style={{ color: colors.text }}>
                  {t('create.shareableTrips.public')} ({publicTrips.length})
                </Text>
                {publicTrips.map((trip) => (
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
                      // Navigate to edit or view
                      console.log('Trip pressed:', trip.id);
                    }}
                  >
                    {/* Image */}
                    <View className='relative'>
                      <Image
                        source={{ uri: trip.imageUrl }}
                        className='w-full h-40'
                        resizeMode='cover'
                      />
                      {/* Public badge */}
                      <View
                        className='absolute top-3 right-3 px-3 py-1 rounded-full flex-row items-center gap-1'
                        style={{ backgroundColor: 'rgba(16, 185, 129, 0.9)' }}
                      >
                        <Ionicons name='globe' size={12} color='#fff' />
                        <Text className='text-xs font-semibold text-white'>
                          {t('create.shareableTrips.public')}
                        </Text>
                      </View>
                    </View>

                    {/* Content */}
                    <View className='p-4'>
                      <View className='flex-row items-start justify-between mb-2'>
                        <View className='flex-1'>
                          <Text
                            className='text-lg font-bold mb-1'
                            style={{ color: colors.text }}
                            numberOfLines={1}
                          >
                            {trip.title}
                          </Text>
                          <Text
                            className='text-sm'
                            style={{ color: isDark ? '#9ca3af' : '#6b7280' }}
                            numberOfLines={2}
                          >
                            {trip.description}
                          </Text>
                        </View>
                      </View>

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
                            name='eye'
                            size={16}
                            color={isDark ? '#9ca3af' : '#6b7280'}
                          />
                          <Text
                            className='text-xs'
                            style={{ color: isDark ? '#9ca3af' : '#6b7280' }}
                          >
                            {trip.viewsCount} views
                          </Text>
                        </View>
                      </View>

                      {/* Actions */}
                      <View
                        className='flex-row items-center justify-between pt-3 border-t'
                        style={{ borderTopColor: isDark ? '#374151' : '#e5e7eb' }}
                      >
                        <View>
                          <Text
                            className='text-xs'
                            style={{ color: isDark ? '#6b7280' : '#9ca3af' }}
                          >
                            Updated: {formatDate(trip.lastUpdated)}
                          </Text>
                        </View>
                        <View className='flex-row items-center gap-2'>
                          <Text
                            className='text-xs'
                            style={{ color: isDark ? '#9ca3af' : '#6b7280' }}
                          >
                            {t('create.shareableTrips.visibility')}
                          </Text>
                          <Switch
                            value={trip.isPublic}
                            onValueChange={() => toggleVisibility(trip.id, trip.isPublic)}
                            trackColor={{ false: '#767577', true: colors.primary }}
                            thumbColor='#fff'
                          />
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </>
            )}

            {/* Private Trips */}
            {privateTrips.length > 0 && (
              <>
                <Text className='text-lg font-bold mb-2 mt-4' style={{ color: colors.text }}>
                  {t('create.shareableTrips.private')} ({privateTrips.length})
                </Text>
                {privateTrips.map((trip) => (
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
                      opacity: 0.8,
                    }}
                    activeOpacity={0.9}
                    onPress={() => {
                      console.log('Trip pressed:', trip.id);
                    }}
                  >
                    {/* Image */}
                    <View className='relative'>
                      <Image
                        source={{ uri: trip.imageUrl }}
                        className='w-full h-40'
                        resizeMode='cover'
                      />
                      {/* Private badge */}
                      <View
                        className='absolute top-3 right-3 px-3 py-1 rounded-full flex-row items-center gap-1'
                        style={{ backgroundColor: 'rgba(107, 114, 128, 0.9)' }}
                      >
                        <Ionicons name='lock-closed' size={12} color='#fff' />
                        <Text className='text-xs font-semibold text-white'>
                          {t('create.shareableTrips.private')}
                        </Text>
                      </View>
                    </View>

                    {/* Content */}
                    <View className='p-4'>
                      <View className='flex-row items-start justify-between mb-2'>
                        <View className='flex-1'>
                          <Text
                            className='text-lg font-bold mb-1'
                            style={{ color: colors.text }}
                            numberOfLines={1}
                          >
                            {trip.title}
                          </Text>
                          <Text
                            className='text-sm'
                            style={{ color: isDark ? '#9ca3af' : '#6b7280' }}
                            numberOfLines={2}
                          >
                            {trip.description}
                          </Text>
                        </View>
                      </View>

                      {/* Actions */}
                      <View
                        className='flex-row items-center justify-between pt-3 border-t'
                        style={{ borderTopColor: isDark ? '#374151' : '#e5e7eb' }}
                      >
                        <View>
                          <Text
                            className='text-xs'
                            style={{ color: isDark ? '#6b7280' : '#9ca3af' }}
                          >
                            Created: {formatDate(trip.createdAt)}
                          </Text>
                        </View>
                        <TouchableOpacity
                          onPress={() => toggleVisibility(trip.id, trip.isPublic)}
                          className='px-4 py-2 rounded-full flex-row items-center gap-2'
                          style={{ backgroundColor: colors.primary }}
                          activeOpacity={0.8}
                        >
                          <Ionicons name='globe' size={16} color='#fff' />
                          <Text className='text-xs font-semibold text-white'>
                            {t('create.makePublic')}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

