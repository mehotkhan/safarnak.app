import { useMemo, useState } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useRouter, useLocalSearchParams, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { CustomText } from '@components/ui/CustomText';
import { useTheme } from '@components/context/ThemeContext';
import { useGetTourQuery } from '@api';
import Colors from '@constants/Colors';
import ShareModal from '@components/ui/ShareModal';

export default function TourDetailScreen() {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const tourId = useMemo(() => (Array.isArray(id) ? id[0] : id) as string, [id]);
  const [showShareModal, setShowShareModal] = useState(false);

  const { data, loading, error } = useGetTourQuery({
    variables: { id: tourId },
    skip: !tourId,
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all',
  });

  const tour = data?.getTour as any;

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white dark:bg-black">
        <ActivityIndicator size="large" color={isDark ? Colors.dark.primary : Colors.light.primary} />
      </View>
    );
  }

  if (error || !tour) {
    return (
      <View className="flex-1 items-center justify-center px-6 bg-white dark:bg-black">
        <Ionicons name="warning-outline" size={64} color={isDark ? '#ef4444' : '#dc2626'} />
        <CustomText weight="bold" className="text-lg text-gray-800 dark:text-gray-300 mt-4 mb-2 text-center">
          {t('common.error')}
        </CustomText>
        <CustomText className="text-base text-gray-600 dark:text-gray-400 text-center">
          {String((error as any)?.message || t('tours.errors.notFound') || 'Tour not found')}
        </CustomText>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white dark:bg-black">
      <Stack.Screen
        options={{
          title: tour.title || t('tours.detail') || 'Tour Details',
          headerShown: true,
          headerRight: () => (
            <TouchableOpacity onPress={() => setShowShareModal(true)} className="p-2">
              <Ionicons name="share-outline" size={22} color={isDark ? '#fff' : '#000'} />
            </TouchableOpacity>
          ),
        }}
      />

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {tour.imageUrl && (
          <View className="w-full h-64 bg-gray-200 dark:bg-neutral-800">
            <Image
              source={{ uri: tour.imageUrl }}
              className="w-full h-full"
              resizeMode="cover"
            />
          </View>
        )}

        <View className="p-6">
          <View className="flex-row justify-between items-start mb-4">
            <View className="flex-1">
              <CustomText weight="bold" className="text-2xl text-black dark:text-white mb-2">
                {tour.title}
              </CustomText>
              <View className="flex-row items-center mb-2">
                <Ionicons name="location-outline" size={18} color={isDark ? '#9ca3af' : '#6b7280'} />
                <CustomText className="text-base text-gray-600 dark:text-gray-400 ml-2">
                  {tour.location}
                </CustomText>
              </View>
            </View>
            <View className="px-3 py-1 rounded-full bg-primary/10">
              <CustomText className="text-lg text-primary font-bold">
                ${tour.price} {tour.currency}
              </CustomText>
            </View>
          </View>

          <View className="flex-row items-center gap-4 mb-4">
            <View className="flex-row items-center">
              <Ionicons name="time-outline" size={18} color={isDark ? '#9ca3af' : '#6b7280'} />
              <CustomText className="text-sm text-gray-600 dark:text-gray-400 ml-2">
                {tour.duration} {tour.durationType}
              </CustomText>
            </View>
            <View className="flex-row items-center">
              <Ionicons name="star" size={18} color="#fbbf24" />
              <CustomText className="text-sm text-gray-600 dark:text-gray-400 ml-2">
                {tour.rating} ({tour.reviews})
              </CustomText>
            </View>
            <View className="px-2 py-1 rounded bg-gray-100 dark:bg-neutral-800">
              <CustomText className="text-xs text-gray-700 dark:text-gray-300">
                {tour.difficulty}
              </CustomText>
            </View>
          </View>

          {tour.description && (
            <View className="mb-4">
              <CustomText weight="bold" className="text-lg text-black dark:text-white mb-2">
                {t('tours.detail.description') || 'Description'}
              </CustomText>
              <CustomText className="text-base text-gray-700 dark:text-gray-300">
                {tour.description}
              </CustomText>
            </View>
          )}

          {tour.highlights && tour.highlights.length > 0 && (
            <View className="mb-4">
              <CustomText weight="bold" className="text-lg text-black dark:text-white mb-2">
                {t('tours.detail.highlights') || 'Highlights'}
              </CustomText>
              {tour.highlights.map((highlight: string, index: number) => (
                <View key={index} className="flex-row items-start mb-2">
                  <Ionicons name="checkmark-circle" size={20} color="#10b981" style={{ marginRight: 8, marginTop: 2 }} />
                  <CustomText className="text-base text-gray-700 dark:text-gray-300 flex-1">
                    {highlight}
                  </CustomText>
                </View>
              ))}
            </View>
          )}

          {tour.inclusions && tour.inclusions.length > 0 && (
            <View className="mb-4">
              <CustomText weight="bold" className="text-lg text-black dark:text-white mb-2">
                {t('tours.detail.inclusions') || 'Inclusions'}
              </CustomText>
              {tour.inclusions.map((inclusion: string, index: number) => (
                <View key={index} className="flex-row items-start mb-2">
                  <Ionicons name="checkmark-circle" size={20} color="#10b981" style={{ marginRight: 8, marginTop: 2 }} />
                  <CustomText className="text-base text-gray-700 dark:text-gray-300 flex-1">
                    {inclusion}
                  </CustomText>
                </View>
              ))}
            </View>
          )}

          {tour.maxParticipants && (
            <View className="mb-4">
              <CustomText weight="bold" className="text-lg text-black dark:text-white mb-2">
                {t('tours.detail.participants') || 'Participants'}
              </CustomText>
              <CustomText className="text-base text-gray-700 dark:text-gray-300">
                {tour.minParticipants} - {tour.maxParticipants} {t('tours.detail.people') || t('common.people') || 'people'}
              </CustomText>
            </View>
          )}
        </View>
      </ScrollView>

      <ShareModal
        visible={showShareModal}
        onClose={() => setShowShareModal(false)}
        type="tour"
        relatedId={tourId}
        entityTitle={tour.title}
      />
    </View>
  );
}

