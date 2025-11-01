import { useState } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useRouter, useLocalSearchParams, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { CustomText } from '@components/ui/CustomText';
import CustomButton from '@components/ui/CustomButton';
import { useTheme } from '@components/context/ThemeContext';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const appIcon = require('@assets/images/icon.png');

// Mock user data
const mockUser = {
  id: '2',
  name: 'Sarah Johnson',
  username: 'sarah_travels',
  bio: 'Travel enthusiast 🌍 | Photographer 📸 | Always planning the next adventure',
  location: 'San Francisco, CA',
  website: 'https://sarahtravels.com',
  joinedDate: 'January 2024',
  stats: {
    trips: 12,
    posts: 45,
    followers: 1234,
    following: 567,
  },
  isFollowing: false,
  recentPosts: [
    {
      id: '1',
      type: 'trip',
      title: 'Amazing Week in Tokyo',
      image: 'https://picsum.photos/seed/tokyo-post/300/300',
      likes: 234,
      comments: 45,
    },
    {
      id: '2',
      type: 'place',
      title: 'Hidden Gem in the Alps',
      image: 'https://picsum.photos/seed/alps-post/300/300',
      likes: 567,
      comments: 89,
    },
    {
      id: '3',
      type: 'experience',
      title: 'Street Food Adventure',
      image: 'https://picsum.photos/seed/food-post/300/300',
      likes: 890,
      comments: 123,
    },
  ],
  trips: [
    {
      id: '1',
      destination: 'Tokyo, Japan',
      dates: 'Mar 2025',
      image: 'https://picsum.photos/seed/tokyo-trip/200/200',
    },
    {
      id: '2',
      destination: 'Swiss Alps',
      dates: 'Jun 2025',
      image: 'https://picsum.photos/seed/alps-trip/200/200',
    },
  ],
};

export default function UserProfileScreen() {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [user, setUser] = useState(mockUser);
  const [selectedTab, setSelectedTab] = useState<'posts' | 'trips'>('posts');

  const handleFollow = () => {
    setUser(prev => ({
      ...prev,
      isFollowing: !prev.isFollowing,
      stats: {
        ...prev.stats,
        followers: prev.isFollowing ? prev.stats.followers - 1 : prev.stats.followers + 1,
      },
    }));
  };

  const handleMessage = () => {
    router.push(`/(app)/(profile)/messages/${id}` as any);
  };

  return (
    <ScrollView className="flex-1 bg-white dark:bg-black">
      <Stack.Screen 
        options={{ 
          title: user.username, 
          headerShown: true,
          headerBackVisible: true,
        }} 
      />

      {/* Header */}
      <View className="px-6 py-6 border-b border-gray-200 dark:border-neutral-800">
        <View className="flex-row items-start mb-4">
          {/* Avatar */}
          <View className="w-20 h-20 rounded-full overflow-hidden bg-white dark:bg-neutral-800 border-2 border-primary mr-4">
            <Image
              source={appIcon}
              className="w-full h-full"
              resizeMode="contain"
            />
          </View>

          {/* Stats */}
          <View className="flex-1 flex-row justify-around">
            <View className="items-center">
              <CustomText weight="bold" className="text-xl text-black dark:text-white">
                {user.stats.posts}
              </CustomText>
              <CustomText className="text-sm text-gray-600 dark:text-gray-400">
                {t('userProfile.posts')}
              </CustomText>
            </View>
            <View className="items-center">
              <CustomText weight="bold" className="text-xl text-black dark:text-white">
                {user.stats.followers}
              </CustomText>
              <CustomText className="text-sm text-gray-600 dark:text-gray-400">
                {t('userProfile.followers')}
              </CustomText>
            </View>
            <View className="items-center">
              <CustomText weight="bold" className="text-xl text-black dark:text-white">
                {user.stats.following}
              </CustomText>
              <CustomText className="text-sm text-gray-600 dark:text-gray-400">
                {t('userProfile.following')}
              </CustomText>
            </View>
          </View>
        </View>

        {/* User Info */}
        <CustomText weight="bold" className="text-xl text-black dark:text-white mb-1">
          {user.name}
        </CustomText>
        <CustomText className="text-base text-gray-700 dark:text-gray-300 mb-3">
          {user.bio}
        </CustomText>

        {/* Location & Website */}
        {user.location && (
          <View className="flex-row items-center mb-1">
            <Ionicons name="location" size={14} color={isDark ? '#9ca3af' : '#6b7280'} />
            <CustomText className="text-sm text-gray-600 dark:text-gray-400 ml-2">
              {user.location}
            </CustomText>
          </View>
        )}
        {user.website && (
          <View className="flex-row items-center mb-1">
            <Ionicons name="link" size={14} color={isDark ? '#9ca3af' : '#6b7280'} />
            <CustomText className="text-sm text-primary ml-2">
              {user.website}
            </CustomText>
          </View>
        )}
        <View className="flex-row items-center">
          <Ionicons name="calendar-outline" size={14} color={isDark ? '#9ca3af' : '#6b7280'} />
          <CustomText className="text-sm text-gray-600 dark:text-gray-400 ml-2">
            {t('userProfile.joined')} {user.joinedDate}
          </CustomText>
        </View>

        {/* Action Buttons */}
        <View className="flex-row gap-3 mt-4">
          <View className="flex-1">
            <CustomButton
              title={user.isFollowing ? t('userProfile.following') : t('userProfile.follow')}
              onPress={handleFollow}
              bgVariant={user.isFollowing ? 'secondary' : 'primary'}
              IconLeft={() => (
                <Ionicons
                  name={user.isFollowing ? 'checkmark' : 'person-add'}
                  size={16}
                  color={user.isFollowing ? (isDark ? '#fff' : '#000') : '#fff'}
                  style={{ marginRight: 8 }}
                />
              )}
            />
          </View>
          <View className="flex-1">
            <CustomButton
              title={t('userProfile.message')}
              onPress={handleMessage}
              bgVariant="secondary"
              IconLeft={() => (
                <Ionicons
                  name="mail-outline"
                  size={16}
                  color={isDark ? '#fff' : '#000'}
                  style={{ marginRight: 8 }}
                />
              )}
            />
          </View>
        </View>
      </View>

      {/* Tabs */}
      <View className="flex-row border-b border-gray-200 dark:border-neutral-800">
        <TouchableOpacity
          onPress={() => setSelectedTab('posts')}
          className={`flex-1 py-4 items-center border-b-2 ${
            selectedTab === 'posts'
              ? 'border-primary'
              : 'border-transparent'
          }`}
        >
          <CustomText
            weight={selectedTab === 'posts' ? 'bold' : 'regular'}
            className={
              selectedTab === 'posts'
                ? 'text-primary'
                : 'text-gray-600 dark:text-gray-400'
            }
          >
            {t('userProfile.posts')}
          </CustomText>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setSelectedTab('trips')}
          className={`flex-1 py-4 items-center border-b-2 ${
            selectedTab === 'trips'
              ? 'border-primary'
              : 'border-transparent'
          }`}
        >
          <CustomText
            weight={selectedTab === 'trips' ? 'bold' : 'regular'}
            className={
              selectedTab === 'trips'
                ? 'text-primary'
                : 'text-gray-600 dark:text-gray-400'
            }
          >
            {t('userProfile.trips')}
          </CustomText>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View className="px-6 py-4">
        {selectedTab === 'posts' ? (
          <View className="flex-row flex-wrap gap-2">
            {user.recentPosts.map(post => (
              <TouchableOpacity
                key={post.id}
                onPress={() => router.push(`/(app)/(feed)/${post.id}` as any)}
                className="w-[32%] aspect-square bg-gray-200 dark:bg-neutral-800 rounded-lg items-center justify-center"
              >
                <Ionicons name="image-outline" size={40} color={isDark ? '#666' : '#9ca3af'} />
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <View>
            {user.trips.map(trip => (
              <TouchableOpacity
                key={trip.id}
                className="bg-white dark:bg-neutral-900 rounded-2xl p-4 mb-3 border border-gray-200 dark:border-neutral-800"
              >
                <CustomText weight="bold" className="text-lg text-black dark:text-white mb-1">
                  {trip.destination}
                </CustomText>
                <CustomText className="text-sm text-gray-600 dark:text-gray-400">
                  {trip.dates}
                </CustomText>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
}

