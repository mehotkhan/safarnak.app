import { useMemo, useState } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Linking,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useRouter, useLocalSearchParams, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { CustomText } from '@components/ui/CustomText';
import { useTheme } from '@components/context/ThemeContext';
import { useGetPlaceQuery } from '@api';
import Colors from '@constants/Colors';
import ShareModal from '@components/ui/ShareModal';

export default function PlaceDetailScreen() {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const placeId = useMemo(() => (Array.isArray(id) ? id[0] : id) as string, [id]);
  const [showShareModal, setShowShareModal] = useState(false);

  const { data, loading, error } = useGetPlaceQuery({
    variables: { id: placeId },
    skip: !placeId,
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all',
  });

  const place = data?.getPlace as any;

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white dark:bg-black">
        <ActivityIndicator size="large" color={isDark ? Colors.dark.primary : Colors.light.primary} />
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

  return (
    <View className="flex-1 bg-white dark:bg-black">
      <Stack.Screen
        options={{
          title: place.name || t('places.detail') || 'Place Details',
          headerShown: true,
          headerRight: () => (
            <TouchableOpacity onPress={() => setShowShareModal(true)} className="p-2">
              <Ionicons name="share-outline" size={22} color={isDark ? '#fff' : '#000'} />
            </TouchableOpacity>
          ),
        }}
      />

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {place.imageUrl && (
          <View className="w-full h-64 bg-gray-200 dark:bg-neutral-800">
            <Image
              source={{ uri: place.imageUrl }}
              className="w-full h-full"
              resizeMode="cover"
            />
          </View>
        )}

        <View className="p-6">
          <View className="flex-row justify-between items-start mb-4">
            <View className="flex-1">
              <CustomText weight="bold" className="text-2xl text-black dark:text-white mb-2">
                {place.name}
              </CustomText>
              <View className="flex-row items-center mb-2">
                <Ionicons name="location-outline" size={18} color={isDark ? '#9ca3af' : '#6b7280'} />
                <CustomText className="text-base text-gray-600 dark:text-gray-400 ml-2">
                  {place.location}
                </CustomText>
              </View>
            </View>
            <View className="flex-row items-center">
              <Ionicons name="star" size={18} color="#fbbf24" />
              <CustomText className="text-lg text-gray-700 dark:text-gray-300 ml-1">
                {place.rating} ({place.reviews})
              </CustomText>
            </View>
          </View>

          <View className="flex-row items-center gap-4 mb-4">
            <View className="px-3 py-1 rounded-full bg-gray-100 dark:bg-neutral-800">
              <CustomText className="text-sm text-gray-700 dark:text-gray-300">
                {place.type}
              </CustomText>
            </View>
            <View className="flex-row items-center">
              <View className={`w-2 h-2 rounded-full mr-2 ${place.isOpen ? 'bg-green-500' : 'bg-red-500'}`} />
              <CustomText className="text-sm text-gray-600 dark:text-gray-400">
                {place.isOpen ? (t('places.open') || 'Open') : (t('places.closed') || 'Closed')}
              </CustomText>
            </View>
          </View>

          {place.description && (
            <View className="mb-4">
              <CustomText weight="bold" className="text-lg text-black dark:text-white mb-2">
                {t('places.detail.description') || 'Description'}
              </CustomText>
              <CustomText className="text-base text-gray-700 dark:text-gray-300">
                {place.description}
              </CustomText>
            </View>
          )}

          {place.tips && (
            <View className="mb-4">
              <CustomText weight="bold" className="text-lg text-black dark:text-white mb-2">
                {t('places.detail.tips') || 'Tips'}
              </CustomText>
              <CustomText className="text-base text-gray-700 dark:text-gray-300">
                {place.tips}
              </CustomText>
            </View>
          )}

          {place.hours && (
            <View className="mb-4">
              <CustomText weight="bold" className="text-lg text-black dark:text-white mb-2">
                {t('places.detail.hours') || 'Opening Hours'}
              </CustomText>
              <CustomText className="text-base text-gray-700 dark:text-gray-300">
                {place.hours}
              </CustomText>
            </View>
          )}

          {place.phone && (
            <TouchableOpacity
              onPress={() => Linking.openURL(`tel:${place.phone}`)}
              className="flex-row items-center mb-4 p-3 bg-gray-100 dark:bg-neutral-800 rounded-lg"
            >
              <Ionicons name="call-outline" size={20} color={isDark ? '#9ca3af' : '#6b7280'} />
              <CustomText className="text-base text-gray-700 dark:text-gray-300 ml-3">
                {place.phone}
              </CustomText>
            </TouchableOpacity>
          )}

          {place.website && (
            <TouchableOpacity
              onPress={() => Linking.openURL(place.website)}
              className="flex-row items-center mb-4 p-3 bg-gray-100 dark:bg-neutral-800 rounded-lg"
            >
              <Ionicons name="globe-outline" size={20} color={isDark ? '#9ca3af' : '#6b7280'} />
              <CustomText className="text-base text-primary ml-3">
                {place.website}
              </CustomText>
            </TouchableOpacity>
          )}
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

