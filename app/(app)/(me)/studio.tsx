import React from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { CustomText } from '@ui/display';
import { useTheme } from '@ui/context';
import { ScreenLayout } from '@ui/layout';
import Colors from '@constants/Colors';

export default function StudioScreen() {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const router = useRouter();

  const studioSections = [
    {
      id: 'trips',
      title: t('me.studio.trips') || 'My Trips',
      description: t('me.studio.tripsDescription') || 'Manage your trips',
      icon: 'airplane-outline',
      route: '/(app)/(trips)',
    },
    {
      id: 'hosted',
      title: t('me.studio.hosted') || 'Hosted Trips',
      description: t('me.studio.hostedDescription') || 'Manage your hosted trips',
      icon: 'flag-outline',
      route: '/(app)/(trips)', // TODO: Filter to hosted trips
    },
    {
      id: 'places',
      title: t('me.studio.places') || 'My Places',
      description: t('me.studio.placesDescription') || 'Manage your places',
      icon: 'location-outline',
      route: '/(app)/(explore)/places', // TODO: Filter to user's places
    },
    {
      id: 'posts',
      title: t('me.studio.posts') || 'My Posts',
      description: t('me.studio.postsDescription') || 'Manage your posts',
      icon: 'document-outline',
      route: '/(app)/(home)', // TODO: Filter to user's posts
    },
  ];

  return (
    <ScreenLayout title={t('me.studio.title') || 'Studio'}>
      <ScrollView className="flex-1">
        <View className="px-6 py-4">
          <CustomText className="mb-6 text-base text-gray-600 dark:text-gray-400">
            {t('me.studio.description') || 'Manage all your content in one place'}
          </CustomText>

          {studioSections.map((section) => (
            <TouchableOpacity
              key={section.id}
              onPress={() => router.push(section.route as any)}
              className="mb-3 flex-row items-center rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-neutral-800 dark:bg-neutral-900"
              activeOpacity={0.7}
            >
              <View
                className="mr-4 size-12 items-center justify-center rounded-full"
                style={{
                  backgroundColor: isDark ? '#374151' : '#f3f4f6',
                }}
              >
                <Ionicons
                  name={section.icon as any}
                  size={24}
                  color={isDark ? Colors.dark.primary : Colors.light.primary}
                />
              </View>
              <View className="flex-1">
                <CustomText weight="bold" className="mb-1 text-base text-black dark:text-white">
                  {section.title}
                </CustomText>
                <CustomText className="text-sm text-gray-600 dark:text-gray-400">
                  {section.description}
                </CustomText>
              </View>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={isDark ? '#6b7280' : '#9ca3af'}
              />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </ScreenLayout>
  );
}

