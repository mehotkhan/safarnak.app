import { useState } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Image,
  Dimensions,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { CustomText } from '@components/ui/CustomText';
import { useTheme } from '@components/context/ThemeContext';

const { width } = Dimensions.get('window');

// Mock data for social feed
const mockFeedItems = [
  {
    id: '1',
    type: 'trip',
    user: {
      id: '1',
      name: 'Sarah Johnson',
      username: 'sarah_travels',
      avatar: 'https://via.placeholder.com/100',
    },
    content: {
      title: 'Amazing Week in Tokyo',
      description: 'Just got back from an incredible week exploring Tokyo. The cherry blossoms were in full bloom! 🌸',
      images: ['https://via.placeholder.com/400x300'],
      location: 'Tokyo, Japan',
      likes: 234,
      comments: 45,
      shares: 12,
      timestamp: '2 hours ago',
    },
  },
  {
    id: '2',
    type: 'place',
    user: {
      id: '2',
      name: 'Mike Chen',
      username: 'mike_adventures',
      avatar: 'https://via.placeholder.com/100',
    },
    content: {
      title: 'Hidden Gem in the Alps',
      description: 'Found this amazing hiking trail in the Swiss Alps. Highly recommended for adventure seekers!',
      images: ['https://via.placeholder.com/400x300'],
      location: 'Swiss Alps',
      likes: 567,
      comments: 89,
      shares: 34,
      timestamp: '5 hours ago',
    },
  },
  {
    id: '3',
    type: 'trip',
    user: {
      id: '3',
      name: 'Emma Wilson',
      username: 'emma_explorer',
      avatar: 'https://via.placeholder.com/100',
    },
    content: {
      title: 'Italian Food Journey',
      description: 'Spent a week eating my way through Rome, Florence, and Venice. Every meal was perfection! 🍝',
      images: ['https://via.placeholder.com/400x300'],
      location: 'Italy',
      likes: 890,
      comments: 123,
      shares: 56,
      timestamp: '1 day ago',
    },
  },
];

const categories = [
  { id: 'all', label: 'all', icon: 'grid-outline' },
  { id: 'trips', label: 'trips', icon: 'airplane-outline' },
  { id: 'places', label: 'places', icon: 'location-outline' },
  { id: 'food', label: 'food', icon: 'restaurant-outline' },
  { id: 'culture', label: 'culture', icon: 'color-palette-outline' },
];

interface FeedItemProps {
  item: any;
  isDark: boolean;
  t: any;
  onLike: () => void;
  onComment: () => void;
  onShare: () => void;
  onUserPress: () => void;
}

const FeedItem = ({ 
  item, 
  isDark, 
  t, 
  onLike, 
  onComment, 
  onShare,
  onUserPress 
}: FeedItemProps) => {
  const [liked, setLiked] = useState(false);

  const handleLike = () => {
    setLiked(!liked);
    onLike();
  };

  return (
    <View className="bg-white dark:bg-neutral-900 mb-4 border-b-8 border-gray-100 dark:border-black">
      {/* User Header */}
      <TouchableOpacity 
        onPress={onUserPress}
        className="flex-row items-center px-4 py-3"
      >
        <View className="w-10 h-10 rounded-full bg-gray-200 dark:bg-neutral-800 mr-3" />
        <View className="flex-1">
          <CustomText weight="bold" className="text-base text-black dark:text-white">
            {item.user.name}
          </CustomText>
          <View className="flex-row items-center">
            <CustomText className="text-sm text-gray-500 dark:text-gray-400">
              {item.content.location}
            </CustomText>
            <CustomText className="text-sm text-gray-400 dark:text-gray-500 ml-2">
              • {item.content.timestamp}
            </CustomText>
          </View>
        </View>
        <TouchableOpacity>
          <Ionicons 
            name="ellipsis-horizontal" 
            size={20} 
            color={isDark ? '#9ca3af' : '#6b7280'} 
          />
        </TouchableOpacity>
      </TouchableOpacity>

      {/* Image */}
      <View className="w-full h-80 bg-gray-200 dark:bg-neutral-800">
        <View className="flex-1 items-center justify-center">
          <Ionicons name="image-outline" size={80} color="#9ca3af" />
        </View>
      </View>

      {/* Actions */}
      <View className="flex-row items-center px-4 py-3">
        <TouchableOpacity onPress={handleLike} className="flex-row items-center mr-4">
          <Ionicons 
            name={liked ? 'heart' : 'heart-outline'} 
            size={28} 
            color={liked ? '#ef4444' : (isDark ? '#9ca3af' : '#6b7280')} 
          />
          <CustomText className="text-base text-gray-700 dark:text-gray-300 ml-2">
            {liked ? item.content.likes + 1 : item.content.likes}
          </CustomText>
        </TouchableOpacity>
        <TouchableOpacity onPress={onComment} className="flex-row items-center mr-4">
          <Ionicons 
            name="chatbubble-outline" 
            size={26} 
            color={isDark ? '#9ca3af' : '#6b7280'} 
          />
          <CustomText className="text-base text-gray-700 dark:text-gray-300 ml-2">
            {item.content.comments}
          </CustomText>
        </TouchableOpacity>
        <TouchableOpacity onPress={onShare} className="flex-row items-center mr-4">
          <Ionicons 
            name="share-outline" 
            size={26} 
            color={isDark ? '#9ca3af' : '#6b7280'} 
          />
          <CustomText className="text-base text-gray-700 dark:text-gray-300 ml-2">
            {item.content.shares}
          </CustomText>
        </TouchableOpacity>
        <View className="flex-1" />
        <TouchableOpacity>
          <Ionicons 
            name="bookmark-outline" 
            size={26} 
            color={isDark ? '#9ca3af' : '#6b7280'} 
          />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View className="px-4 pb-4">
        <CustomText weight="bold" className="text-base text-black dark:text-white mb-1">
          {item.content.title}
        </CustomText>
        <CustomText className="text-sm text-gray-700 dark:text-gray-300">
          <CustomText weight="bold" className="text-black dark:text-white">
            {item.user.username}
          </CustomText>{' '}
          {item.content.description}
        </CustomText>
      </View>
    </View>
  );
};

export default function HomeScreen() {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleLike = () => {
    console.log('Like pressed');
  };

  const handleComment = () => {
    console.log('Comment pressed');
  };

  const handleShare = () => {
    console.log('Share pressed');
  };

  const handleUserPress = () => {
    console.log('User pressed');
  };

  return (
    <View className="flex-1 bg-white dark:bg-black">
      <Stack.Screen options={{ title: t('home.title'), headerShown: false }} />
      
      {/* Header with Logo */}
      <View className="px-4 pt-12 pb-3 bg-white dark:bg-black border-b border-gray-200 dark:border-neutral-800">
        <View className="flex-row items-center justify-between">
          <CustomText weight="bold" className="text-2xl text-black dark:text-white">
            Safarnak
          </CustomText>
          <View className="flex-row items-center">
            <TouchableOpacity className="w-10 h-10 items-center justify-center mr-2">
              <Ionicons 
                name="notifications-outline" 
                size={26} 
                color={isDark ? '#9ca3af' : '#6b7280'} 
              />
            </TouchableOpacity>
            <TouchableOpacity className="w-10 h-10 items-center justify-center">
              <Ionicons 
                name="mail-outline" 
                size={26} 
                color={isDark ? '#9ca3af' : '#6b7280'} 
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Category Pills */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="flex-row mt-3 -mx-4 px-4"
        >
          {categories.map(category => (
            <TouchableOpacity
              key={category.id}
              onPress={() => setSelectedCategory(category.id)}
              className={`flex-row items-center px-4 py-2 rounded-full mr-2 ${
                selectedCategory === category.id
                  ? 'bg-primary'
                  : 'bg-gray-100 dark:bg-neutral-900'
              }`}
            >
              <Ionicons
                name={category.icon as any}
                size={16}
                color={
                  selectedCategory === category.id
                    ? '#fff'
                    : isDark
                      ? '#9ca3af'
                      : '#6b7280'
                }
              />
              <CustomText
                className={`ml-2 ${
                  selectedCategory === category.id
                    ? 'text-white'
                    : 'text-gray-700 dark:text-gray-300'
                }`}
              >
                {t(`explore.categories.${category.label}`)}
              </CustomText>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Feed */}
      <FlatList
        data={mockFeedItems}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <FeedItem
            item={item}
            isDark={isDark}
            t={t}
            onLike={handleLike}
            onComment={handleComment}
            onShare={handleShare}
            onUserPress={handleUserPress}
          />
        )}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 4 }}
      />
    </View>
  );
}

