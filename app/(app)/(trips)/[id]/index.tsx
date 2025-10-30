import { useMemo } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  Share,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useRouter, useLocalSearchParams, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { CustomText } from '@components/ui/CustomText';
import CustomButton from '@components/ui/CustomButton';
import { useTheme } from '@components/context/ThemeContext';
import MapView from '@components/MapView';
import { useGetTripQuery } from '@api';
import Colors from '@constants/Colors';

// Live data from GraphQL

export default function TripDetailScreen() {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const tripId = useMemo(() => (Array.isArray(id) ? id[0] : id) as string, [id]);
  const { data, loading, error, refetch } = useGetTripQuery({ variables: { id: tripId } });
  const trip = data?.getTrip as any;
  const showMap = !!trip?.coordinates;

  const handleRegenerate = () => {
    Alert.alert(
      t('plan.form.regenerate'),
      'Are you sure you want to regenerate this trip plan?',
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.ok'),
          onPress: () => {
            // Implement regeneration logic
            Alert.alert('Success', 'Trip plan regenerated!');
          },
        },
      ]
    );
  };

  const handleEdit = () => {
    Alert.alert('Edit', 'Edit functionality coming soon!');
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out my trip to ${trip.destination}! ${trip.startDate} - ${trip.endDate}`,
        title: trip.destination,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      t('plan.deletePlan'),
      'Are you sure you want to delete this trip?',
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.delete'),
          style: 'destructive',
          onPress: () => {
            router.back();
          },
        },
      ]
    );
  };

  const location = trip?.coordinates ? { coords: trip.coordinates } : undefined;

  return (
    <View className="flex-1 bg-white dark:bg-black">
      <Stack.Screen
        options={{
          title: (trip?.destination as string) || t('plan.viewPlan'),
          headerShown: true,
          headerRight: () => (
            <View className="flex-row items-center">
              <TouchableOpacity onPress={handleShare} className="p-2">
                <Ionicons name="share-outline" size={22} color={isDark ? '#fff' : '#000'} />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleDelete} className="p-2">
                <Ionicons name="trash-outline" size={22} color="#ef4444" />
              </TouchableOpacity>
            </View>
          ),
        }}
      />

      <ScrollView className="flex-1">
        {/* Map View */}
        {showMap && location && (
          <View className="h-64 bg-gray-100 dark:bg-neutral-900">
            <MapView location={location as any} />
          </View>
        )}

        <View className="px-6 py-4">
          {/* Trip Info */}
          <View className="bg-gray-50 dark:bg-neutral-900 rounded-2xl p-4 mb-4">
            <View className="flex-row items-center mb-3">
              <Ionicons
                name="information-circle"
                size={20}
                color={isDark ? Colors.dark.primary : Colors.light.primary}
              />
              <CustomText
                weight="bold"
                className="text-base text-black dark:text-white ml-2"
              >
                {t('tripDetail.tripDetails')}
              </CustomText>
            </View>
            <View className="flex-row items-center mb-2">
              <Ionicons
                name="people-outline"
                size={16}
                color={isDark ? '#9ca3af' : '#6b7280'}
              />
              <CustomText className="text-sm text-gray-600 dark:text-gray-400 ml-2">
                {trip?.travelers} {trip?.travelers === 1 ? t('tripDetail.traveler') : t('tripDetail.travelers')}
              </CustomText>
            </View>
            <View className="flex-row items-center mb-2">
              <Ionicons
                name="wallet-outline"
                size={16}
                color={isDark ? '#9ca3af' : '#6b7280'}
              />
              <CustomText className="text-sm text-gray-600 dark:text-gray-400 ml-2">
                {trip?.budget ? `$${trip.budget}` : '—'} {t('tripDetail.budget')}
              </CustomText>
            </View>
            <View className="flex-row items-center">
              <Ionicons
                name="heart-outline"
                size={16}
                color={isDark ? '#9ca3af' : '#6b7280'}
              />
              <CustomText className="text-sm text-gray-600 dark:text-gray-400 ml-2">
                {trip?.preferences || '—'}
              </CustomText>
            </View>
          </View>

          {/* AI Reasoning */}
          <View className="mb-4">
            <View className="flex-row items-center mb-3">
              <Ionicons
                name="sparkles"
                size={20}
                color={isDark ? Colors.dark.primary : Colors.light.primary}
              />
              <CustomText
                weight="bold"
                className="text-base text-black dark:text-white ml-2"
              >
                {t('tripDetail.aiReasoning')}
              </CustomText>
            </View>
            <CustomText className="text-base text-gray-700 dark:text-gray-300 leading-6">
              {trip?.aiReasoning || '—'}
            </CustomText>
          </View>

          {/* Itinerary */}
          <View className="mb-4">
            <CustomText
              weight="bold"
              className="text-lg text-black dark:text-white mb-3"
            >
              {t('tripDetail.itinerary')}
            </CustomText>
            {(trip?.itinerary || []).map((day: any) => (
              <View
                key={day.day}
                className="bg-gray-50 dark:bg-neutral-900 rounded-2xl p-4 mb-3"
              >
                <CustomText
                  weight="bold"
                  className="text-base text-black dark:text-white mb-2"
                >
                  {t('tripDetail.day')} {day.day}: {day.title}
                </CustomText>
                {(day.activities as string[]).map((activity: string, index: number) => (
                  <View key={index} className="flex-row items-start mb-1">
                    <CustomText className="text-gray-600 dark:text-gray-400 mr-2">
                      •
                    </CustomText>
                    <CustomText className="text-sm text-gray-700 dark:text-gray-300 flex-1">
                      {activity}
                    </CustomText>
                  </View>
                ))}
              </View>
            ))}
          </View>

          {/* Action Buttons */}
          <View className="gap-3 mb-6">
            <CustomButton
              title={t('plan.form.regenerate')}
              onPress={handleRegenerate}
              IconLeft={() => (
                <Ionicons
                  name="refresh"
                  size={20}
                  color="#fff"
                  style={{ marginRight: 8 }}
                />
              )}
            />
            <CustomButton
              title={t('common.edit')}
              onPress={handleEdit}
              bgVariant="secondary"
              IconLeft={() => (
                <Ionicons
                  name="create-outline"
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

