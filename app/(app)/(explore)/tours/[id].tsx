import { useMemo, useState } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useRouter, useLocalSearchParams, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { CustomText } from '@ui/display';
import { ImageWithPlaceholder } from '@ui/display';
import { RatingDisplay } from '@ui/display';
import { CustomButton } from '@ui/forms';
import { useTheme } from '@ui/context';
import { useGetTourQuery } from '@api';
import Colors from '@constants/Colors';
import { ShareModal } from '@ui/modals';

export default function TourDetailScreen() {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const tourId = useMemo(() => (Array.isArray(id) ? id[0] : id) as string, [id]);
  const [showShareModal, setShowShareModal] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const { data, loading, error } = useGetTourQuery({
    variables: { id: tourId },
    skip: !tourId,
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all',
  });

  const tour = data?.getTour as any;

  // Generate placeholder image URL using Picsum Photos (must be before early returns)
  const placeholderImageUrl = useMemo(() => {
    const seed = tour?.id ? tour.id.substring(0, 8) : 'default';
    return `https://picsum.photos/seed/${seed}/800/600`;
  }, [tour]);

  const handleJoinTour = () => {
    router.push(`/(app)/(explore)/tours/${tourId}/book` as any);
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    // TODO: Implement bookmark mutation
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white dark:bg-black">
        <ActivityIndicator size="large" color={isDark ? Colors.dark.primary : Colors.light.primary} />
        <CustomText className="text-gray-500 dark:text-gray-400 mt-4">
          {t('common.loading')}
        </CustomText>
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

  const imageUrl = tour.imageUrl || tour.gallery?.[0] || null;
  
  const highlights = Array.isArray(tour.highlights) ? tour.highlights : [];
  const inclusions = Array.isArray(tour.inclusions) ? tour.inclusions : [];

  return (
    <View className="flex-1 bg-white dark:bg-black">
      <Stack.Screen
        options={{
          title: tour.title || t('tour.title') || 'Tour Details',
          headerShown: true,
          headerRight: () => (
            <View className="flex-row items-center">
              <TouchableOpacity onPress={() => setShowShareModal(true)} className="p-2 mr-2">
                <Ionicons name="share-outline" size={22} color={isDark ? '#fff' : '#000'} />
              </TouchableOpacity>
            <TouchableOpacity onPress={handleBookmark} className="p-2">
              <Ionicons
                name={isBookmarked ? 'bookmark' : 'bookmark-outline'}
                size={22}
                color={isBookmarked ? (isDark ? Colors.dark.primary : Colors.light.primary) : (isDark ? '#fff' : '#000')}
              />
            </TouchableOpacity>
            </View>
          ),
        }}
      />

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Image */}
        <View className="h-64 bg-gray-200 dark:bg-neutral-800">
          <ImageWithPlaceholder
            source={imageUrl ? { uri: imageUrl } : { uri: placeholderImageUrl }}
            placeholder={placeholderImageUrl}
            fallbackText={t('tours.noImage') || 'Tour Image'}
            width="100%"
            height="100%"
            resizeMode="cover"
          />
        </View>

        <View className="px-6 py-4">
          {/* Title and Price */}
          <View className="flex-row justify-between items-start mb-3">
            <View className="flex-1 mr-4">
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
                ${tour.price?.toFixed(0) || '0'} {tour.currency ? tour.currency : ''}
              </CustomText>
            </View>
          </View>

          {/* Rating and Duration */}
          <View className="flex-row items-center mb-4">
            <RatingDisplay
              rating={tour.rating || 0}
              reviews={tour.reviews}
              size="medium"
              showReviews
              className="mr-4"
            />
            <View className="flex-row items-center">
              <Ionicons
                name="time-outline"
                size={18}
                color={isDark ? '#9ca3af' : '#6b7280'}
              />
              <CustomText className="text-base text-gray-600 dark:text-gray-400 ml-1">
                {tour.duration} {tour.durationType === 'days' ? t('explore.tourCard.days') : t('explore.tourCard.hours')}
              </CustomText>
            </View>
            {tour.difficulty && (
              <View className="ml-4 px-2 py-1 rounded bg-gray-100 dark:bg-neutral-800">
                <CustomText className="text-xs text-gray-700 dark:text-gray-300">
                  {tour.difficulty}
                </CustomText>
              </View>
            )}
          </View>

          {/* Description */}
          {tour.description && (
          <View className="mb-4">
            <CustomText
              weight="bold"
              className="text-lg text-black dark:text-white mb-2"
            >
                {t('tourDetail.aboutTour') || t('tours.detail.description') || 'About Tour'}
            </CustomText>
            <CustomText className="text-base text-gray-700 dark:text-gray-300 leading-6">
              {tour.description}
            </CustomText>
          </View>
          )}

          {/* Highlights */}
          {highlights.length > 0 && (
          <View className="mb-4">
            <CustomText
              weight="bold"
              className="text-lg text-black dark:text-white mb-2"
            >
                {t('tourDetail.highlights') || t('tours.detail.highlights') || 'Highlights'}
            </CustomText>
              {highlights.map((highlight: string, index: number) => (
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
          )}

          {/* Inclusions */}
          {inclusions.length > 0 && (
          <View className="mb-4">
            <CustomText
              weight="bold"
              className="text-lg text-black dark:text-white mb-2"
            >
                {t('tourDetail.whatsIncluded') || t('tours.detail.inclusions') || "What's Included"}
            </CustomText>
            <View className="flex-row flex-wrap gap-2">
                {inclusions.map((item: string, index: number) => (
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
          )}

          {/* Details */}
          {(tour.maxParticipants || tour.difficulty) && (
          <View className="bg-gray-50 dark:bg-neutral-900 rounded-2xl p-4 mb-6">
              {tour.maxParticipants && (
            <View className="flex-row justify-between mb-3">
              <CustomText className="text-base text-gray-600 dark:text-gray-400">
                    {t('tourDetail.maxParticipants') || t('tours.detail.participants') || 'Max Participants'}
              </CustomText>
              <CustomText
                weight="medium"
                className="text-base text-black dark:text-white"
              >
                    {tour.minParticipants || 1} - {tour.maxParticipants} {t('common.people')}
              </CustomText>
            </View>
              )}
              {tour.difficulty && (
            <View className="flex-row justify-between">
              <CustomText className="text-base text-gray-600 dark:text-gray-400">
                    {t('tourDetail.difficulty') || 'Difficulty'}
              </CustomText>
              <CustomText
                weight="medium"
                className="text-base text-black dark:text-white"
              >
                {tour.difficulty}
              </CustomText>
            </View>
              )}
          </View>
          )}

          {/* Action Button */}
          <CustomButton
            title={t('explore.tourCard.joinTour') || t('tour.bookNow') || 'Join Tour'}
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
