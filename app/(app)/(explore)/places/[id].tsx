import { useMemo, useState } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Linking,
  Alert,
  Image,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useLocalSearchParams, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { CustomText } from '@ui/display';
import { CustomButton } from '@ui/forms';
import { useTheme } from '@ui/context';
import { useGetPlaceQuery } from '@api';
import Colors from '@constants/Colors';
import { ShareModal } from '@ui/modals';
import { MapView } from '@ui/maps';

export default function PlaceDetailScreen() {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const { id } = useLocalSearchParams();
  const placeId = useMemo(() => (Array.isArray(id) ? id[0] : id) as string, [id]);
  const [showShareModal, setShowShareModal] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const { data, loading, error } = useGetPlaceQuery({
    variables: { id: placeId },
    skip: !placeId,
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all',
  });

  const place = data?.getPlace as any;

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    Alert.alert(
      t('common.success'),
      isBookmarked ? t('placeDetail.bookmarkRemoved') : t('placeDetail.bookmarkAdded')
    );
    // TODO: Implement bookmark mutation
  };

  const handleGetDirections = () => {
    if (place?.coordinates) {
      const { latitude, longitude } = place.coordinates;
      const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
      Linking.openURL(url).catch(() => {
        Alert.alert(t('placeDetail.getDirections'), t('placeDetail.openingNavigation'));
      });
    } else {
      Alert.alert(t('placeDetail.getDirections'), t('placeDetail.openingNavigation'));
    }
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

  if (error || !place) {
    return (
      <View className="flex-1 items-center justify-center px-6 bg-white dark:bg-black">
        <Ionicons name="warning-outline" size={64} color={isDark ? '#ef4444' : '#dc2626'} />
        <CustomText weight="bold" className="text-lg text-gray-800 dark:text-gray-300 mt-4 mb-2 text-center">
          {t('common.error')}
        </CustomText>
        <CustomText className="text-base text-gray-600 dark:text-gray-400 text-center">
          {String((error as any)?.message || t('places.errors.notFound') || 'Place not found')}
        </CustomText>
      </View>
    );
  }

  const tips = Array.isArray(place.tips) ? place.tips : [];
  const coordinates = place.coordinates ? {
    latitude: typeof place.coordinates.latitude === 'number' ? place.coordinates.latitude : parseFloat(place.coordinates.latitude),
    longitude: typeof place.coordinates.longitude === 'number' ? place.coordinates.longitude : parseFloat(place.coordinates.longitude),
  } : null;

  const location = coordinates ? {
    coords: coordinates,
  } : null;

  // Parse hours if it's a string (JSON)
  let hours: Record<string, string> | null = null;
  if (place.hours) {
    try {
      hours = typeof place.hours === 'string' ? JSON.parse(place.hours) : place.hours;
    } catch {
      // If parsing fails, treat as string
      hours = null;
    }
  }

  return (
    <View className="flex-1 bg-white dark:bg-black">
      <Stack.Screen
        options={{
          title: place.name || t('placeDetail.title') || 'Place Details',
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
        {/* Map */}
        {location && (
          <View className="h-64 bg-gray-100 dark:bg-neutral-900">
            <MapView location={location as any} />
          </View>
        )}

        {/* Image fallback if no map */}
        {!location && place.imageUrl && (
          <View className="h-64 bg-gray-200 dark:bg-neutral-800">
            <Image
              source={{ uri: place.imageUrl }}
              className="w-full h-full"
              resizeMode="cover"
            />
          </View>
        )}

        <View className="px-6 py-4">
          {/* Title and Status */}
          <View className="flex-row justify-between items-start mb-3">
            <View className="flex-1 mr-4">
              <CustomText
                weight="bold"
                className="text-2xl text-black dark:text-white mb-2"
              >
                {place.name}
              </CustomText>
              <View className="flex-row items-center">
                <Ionicons
                  name="location"
                  size={16}
                  color={isDark ? '#9ca3af' : '#6b7280'}
                />
                <CustomText className="text-base text-gray-600 dark:text-gray-400 ml-1">
                  {place.location}
                  {place.distance && ` • ${place.distance.toFixed(1)} ${t('placeDetail.kmAway')}`}
                </CustomText>
              </View>
            </View>
            <View
              className={`px-3 py-2 rounded-full ${
                place.isOpen
                  ? 'bg-green-100 dark:bg-green-900'
                  : 'bg-red-100 dark:bg-red-900'
              }`}
            >
              <CustomText
                weight="medium"
                className={`text-sm ${
                  place.isOpen
                    ? 'text-green-800 dark:text-green-200'
                    : 'text-red-800 dark:text-red-200'
                }`}
              >
                {place.isOpen
                  ? t('explore.placeCard.open')
                  : t('explore.placeCard.closed')}
              </CustomText>
            </View>
          </View>

          {/* Rating */}
          <View className="flex-row items-center mb-4">
            <Ionicons name="star" size={18} color="#fbbf24" />
            <CustomText
              weight="medium"
              className="text-base text-gray-700 dark:text-gray-300 ml-1"
            >
              {place.rating?.toFixed(1) || '0.0'}
            </CustomText>
            <CustomText className="text-sm text-gray-500 dark:text-gray-500 ml-1">
              ({place.reviews || 0} {t('placeDetail.reviews')})
            </CustomText>
            {place.type && (
              <View className="ml-4 px-2 py-1 rounded-full bg-gray-100 dark:bg-neutral-800">
                <CustomText className="text-xs text-gray-700 dark:text-gray-300">
                  {place.type}
                </CustomText>
              </View>
            )}
          </View>

          {/* Description */}
          {place.description && (
            <View className="mb-4">
              <CustomText
                weight="bold"
                className="text-lg text-black dark:text-white mb-2"
              >
                {t('placeDetail.about')}
              </CustomText>
              <CustomText className="text-base text-gray-700 dark:text-gray-300 leading-6">
                {place.description}
              </CustomText>
            </View>
          )}

          {/* Hours */}
          {hours && Object.keys(hours).length > 0 && (
            <View className="mb-4">
              <CustomText
                weight="bold"
                className="text-lg text-black dark:text-white mb-2"
              >
                {t('placeDetail.hours')}
              </CustomText>
              <View className="bg-gray-50 dark:bg-neutral-900 rounded-2xl p-4">
                {Object.entries(hours).map(([day, hoursValue]) => (
                  <View
                    key={day}
                    className="flex-row justify-between mb-2 last:mb-0"
                  >
                    <CustomText className="text-base text-gray-600 dark:text-gray-400 capitalize">
                      {day}
                    </CustomText>
                    <CustomText
                      weight="medium"
                      className="text-base text-black dark:text-white"
                    >
                      {hoursValue}
                    </CustomText>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Hours as string (fallback) */}
          {!hours && place.hours && typeof place.hours === 'string' && (
            <View className="mb-4">
              <CustomText
                weight="bold"
                className="text-lg text-black dark:text-white mb-2"
              >
                {t('placeDetail.hours')}
              </CustomText>
              <View className="bg-gray-50 dark:bg-neutral-900 rounded-2xl p-4">
                <CustomText className="text-base text-gray-700 dark:text-gray-300">
                  {place.hours}
                </CustomText>
              </View>
            </View>
          )}

          {/* Tips */}
          {tips.length > 0 && (
            <View className="mb-4">
              <CustomText
                weight="bold"
                className="text-lg text-black dark:text-white mb-2"
              >
                {t('placeDetail.tips')}
              </CustomText>
              {tips.map((tip: string, index: number) => (
                <View key={index} className="flex-row items-start mb-2">
                  <Ionicons
                    name="bulb"
                    size={18}
                    color="#fbbf24"
                    style={{ marginTop: 2 }}
                  />
                  <CustomText className="text-base text-gray-700 dark:text-gray-300 ml-2 flex-1">
                    {tip}
                  </CustomText>
                </View>
              ))}
            </View>
          )}

          {/* Contact */}
          {(place.phone || place.website) && (
            <View className="bg-gray-50 dark:bg-neutral-900 rounded-2xl p-4 mb-6">
              {place.phone && (
                <TouchableOpacity
                  onPress={() => Linking.openURL(`tel:${place.phone}`)}
                  className="flex-row items-center mb-3"
                >
                  <Ionicons
                    name="call-outline"
                    size={18}
                    color={isDark ? '#9ca3af' : '#6b7280'}
                  />
                  <CustomText className="text-base text-gray-700 dark:text-gray-300 ml-3">
                    {place.phone}
                  </CustomText>
                </TouchableOpacity>
              )}
              {place.website && (
                <TouchableOpacity
                  onPress={() => Linking.openURL(place.website)}
                  className="flex-row items-center"
                >
                  <Ionicons
                    name="globe-outline"
                    size={18}
                    color={isDark ? '#9ca3af' : '#6b7280'}
                  />
                  <CustomText className="text-base text-primary ml-3">
                    {place.website}
                  </CustomText>
                </TouchableOpacity>
              )}
            </View>
          )}

          {/* Action Buttons */}
          <View className="gap-3 mb-6">
            {coordinates && (
              <CustomButton
                title={t('placeDetail.getDirections')}
                onPress={handleGetDirections}
                IconLeft={() => (
                  <Ionicons
                    name="navigate"
                    size={20}
                    color="#fff"
                    style={{ marginRight: 8 }}
                  />
                )}
              />
            )}
            <CustomButton
              title={t('explore.tourCard.bookmark') || t('placeDetail.bookmark') || 'Bookmark'}
              onPress={handleBookmark}
              bgVariant="secondary"
              IconLeft={() => (
                <Ionicons
                  name={isBookmarked ? 'bookmark' : 'bookmark-outline'}
                  size={20}
                  color={isDark ? '#fff' : '#000'}
                  style={{ marginRight: 8 }}
                />
              )}
            />
          </View>
        </View>
      </ScrollView>

      <ShareModal
        visible={showShareModal}
        onClose={() => setShowShareModal(false)}
        type="place"
        relatedId={placeId}
        entityTitle={place.name}
      />
    </View>
  );
}
