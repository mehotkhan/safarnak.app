import { useState } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { CustomText } from '@components/ui/CustomText';
import { useTheme } from '@components/context/ThemeContext';
import Colors from '@constants/Colors';

export default function BookmarksScreen() {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState<'tours' | 'places'>('tours');

  // TODO: Replace with real data from GraphQL queries when bookmark features are implemented
  const mockBookmarkedTours: any[] = [];
  const mockBookmarkedPlaces: any[] = [];

  const filteredItems = selectedTab === 'tours' ? mockBookmarkedTours : mockBookmarkedPlaces;

  return (
    <View className="flex-1 bg-white dark:bg-black">
      <Stack.Screen 
        options={{ 
          title: t('profile.bookmarksTitle'),
          headerShown: true,
        }} 
      />

      {/* Tabs */}
      <View className="px-6 pt-4">
        <View className="flex-row gap-2">
          <TouchableOpacity
            onPress={() => setSelectedTab('tours')}
            className={`flex-1 py-3 rounded-lg ${
              selectedTab === 'tours'
                ? 'bg-primary'
                : 'bg-gray-100 dark:bg-neutral-900'
            }`}
          >
            <CustomText
              weight="medium"
              className={`text-center ${
                selectedTab === 'tours'
                  ? 'text-white'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              {t('profile.bookmarks.tours', { defaultValue: 'Tours' })}
            </CustomText>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setSelectedTab('places')}
            className={`flex-1 py-3 rounded-lg ${
              selectedTab === 'places'
                ? 'bg-primary'
                : 'bg-gray-100 dark:bg-neutral-900'
            }`}
          >
            <CustomText
              weight="medium"
              className={`text-center ${
                selectedTab === 'places'
                  ? 'text-white'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              {t('profile.bookmarks.places', { defaultValue: 'Places' })}
            </CustomText>
          </TouchableOpacity>
        </View>
      </View>

      {/* Content */}
      {filteredItems.length === 0 ? (
        <View className="flex-1 items-center justify-center px-6">
          <Ionicons
            name={selectedTab === 'tours' ? 'airplane-outline' : 'location-outline'}
            size={80}
            color={isDark ? '#4b5563' : '#d1d5db'}
          />
          <CustomText
            weight="bold"
            className="text-xl text-gray-800 dark:text-gray-300 mt-4 mb-2 text-center"
          >
            {t('profile.bookmarks.emptyState', { 
              defaultValue: selectedTab === 'tours' 
                ? 'No bookmarked tours yet' 
                : 'No bookmarked places yet'
            })}
          </CustomText>
          <CustomText
            className="text-base text-gray-600 dark:text-gray-400 text-center"
          >
            {t('profile.bookmarks.emptyStateSubtitle', { 
              defaultValue: 'Start exploring and bookmark your favorite ' + 
                (selectedTab === 'tours' ? 'tours' : 'places') + 
                ' to save them for later'
            })}
          </CustomText>
        </View>
      ) : (
        <ScrollView className="flex-1 px-6 py-4">
          {filteredItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              className="bg-white dark:bg-neutral-900 rounded-2xl p-4 mb-4 border border-gray-200 dark:border-neutral-800"
            >
              <CustomText
                weight="bold"
                className="text-lg text-black dark:text-white mb-2"
              >
                {item.title || item.name}
              </CustomText>
              {item.location && (
                <View className="flex-row items-center mb-2">
                  <Ionicons
                    name="location-outline"
                    size={16}
                    color={isDark ? '#9ca3af' : '#6b7280'}
                  />
                  <CustomText className="text-sm text-gray-600 dark:text-gray-400 ml-2">
                    {item.location}
                  </CustomText>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

