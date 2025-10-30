import { useState } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { CustomText } from '@components/ui/CustomText';
import { useTheme } from '@components/context/ThemeContext';

// Mock data
const mockTrips = [
  {
    id: '1',
    destination: 'Tokyo, Japan',
    startDate: '2025-12-01',
    endDate: '2025-12-10',
    status: 'upcoming',
  },
  {
    id: '2',
    destination: 'Paris, France',
    startDate: '2025-03-15',
    endDate: '2025-03-25',
    status: 'past',
  },
  {
    id: '3',
    destination: 'New York, USA',
    startDate: '2026-06-01',
    endDate: '2026-06-15',
    status: 'upcoming',
  },
];

export default function MyTripsScreen() {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState<'upcoming' | 'past'>('upcoming');

  const filteredTrips = mockTrips.filter(trip => trip.status === selectedTab);

  const handleTripPress = (tripId: string) => {
    router.push(`/plan/trip-detail/${tripId}` as any);
  };

  return (
    <View className="flex-1 bg-white dark:bg-black">
      <Stack.Screen options={{ title: t('me.myTrips'), headerShown: true }} />

      {/* Tabs */}
      <View className="px-6 pt-4">
        <View className="flex-row gap-2">
          <TouchableOpacity
            onPress={() => setSelectedTab('upcoming')}
            className={`flex-1 py-3 rounded-lg ${
              selectedTab === 'upcoming'
                ? 'bg-primary'
                : 'bg-gray-100 dark:bg-neutral-900'
            }`}
          >
            <CustomText
              weight="medium"
              className={`text-center ${
                selectedTab === 'upcoming'
                  ? 'text-white'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              {t('me.tripsList.upcoming')}
            </CustomText>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setSelectedTab('past')}
            className={`flex-1 py-3 rounded-lg ${
              selectedTab === 'past'
                ? 'bg-primary'
                : 'bg-gray-100 dark:bg-neutral-900'
            }`}
          >
            <CustomText
              weight="medium"
              className={`text-center ${
                selectedTab === 'past'
                  ? 'text-white'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              {t('me.tripsList.past')}
            </CustomText>
          </TouchableOpacity>
        </View>
      </View>

      {/* Content */}
      {filteredTrips.length === 0 ? (
        <View className="flex-1 items-center justify-center px-6">
          <Ionicons
            name="airplane-outline"
            size={80}
            color={isDark ? '#4b5563' : '#d1d5db'}
          />
          <CustomText
            weight="bold"
            className="text-xl text-gray-800 dark:text-gray-300 mt-4 mb-2 text-center"
          >
            {t('me.tripsList.emptyState')}
          </CustomText>
        </View>
      ) : (
        <ScrollView className="flex-1 px-6 py-4">
          {filteredTrips.map(trip => (
            <TouchableOpacity
              key={trip.id}
              onPress={() => handleTripPress(trip.id)}
              className="bg-white dark:bg-neutral-900 rounded-2xl p-4 mb-4 border border-gray-200 dark:border-neutral-800"
            >
              <CustomText
                weight="bold"
                className="text-lg text-black dark:text-white mb-2"
              >
                {trip.destination}
              </CustomText>
              <View className="flex-row items-center">
                <Ionicons
                  name="calendar-outline"
                  size={16}
                  color={isDark ? '#9ca3af' : '#6b7280'}
                />
                <CustomText className="text-sm text-gray-600 dark:text-gray-400 ml-2">
                  {trip.startDate} - {trip.endDate}
                </CustomText>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

