import { useState } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useLocalSearchParams, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { CustomText } from '@components/ui/CustomText';
import Colors from '@constants/Colors';
import { useTheme } from '@components/context/ThemeContext';

// Mock post data
const mockPost = {
  id: '1',
  user: {
    id: '1',
    name: 'Sarah Johnson',
    username: 'sarah_travels',
    avatar: 'https://picsum.photos/seed/sarah/100/100',
  },
  content: {
    title: 'Amazing Week in Tokyo',
    description: 'Just got back from an incredible week exploring Tokyo. The cherry blossoms were in full bloom! The city is a perfect blend of traditional culture and modern innovation. I visited Senso-ji Temple, explored Shibuya, and had the best ramen of my life in a tiny shop in Shinjuku.',
    images: ['https://picsum.photos/seed/tokyo-japan/400/300'],
    location: 'Tokyo, Japan',
    likes: 234,
    comments: [
      {
        id: '1',
        user: { name: 'Mike Chen', username: 'mike_adventures' },
        text: 'This looks amazing! Which area did you stay in?',
        timestamp: '2h ago',
      },
      {
        id: '2',
        user: { name: 'Emma Wilson', username: 'emma_explorer' },
        text: 'Love the photos! Tokyo is on my bucket list 😍',
        timestamp: '1h ago',
      },
    ],
    shares: 12,
    timestamp: '2 hours ago',
  },
};

export default function PostDetailScreen() {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const { id } = useLocalSearchParams();
  const [liked, setLiked] = useState(false);
  const [commentText, setCommentText] = useState('');

  const handleLike = () => {
    setLiked(!liked);
  };

  const handleComment = () => {
    if (commentText.trim()) {
      console.log('Adding comment:', commentText);
      setCommentText('');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-white dark:bg-black"
    >
      <Stack.Screen options={{ title: mockPost.content.title }} />
      
      <ScrollView className="flex-1">
        {/* User Header */}
        <View className="flex-row items-center px-4 py-4 border-b border-gray-200 dark:border-neutral-800">
          <View className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 dark:bg-neutral-800 mr-3">
            <Image
              source={{ uri: mockPost.user.avatar }}
              className="w-full h-full"
              resizeMode="cover"
            />
          </View>
          <View className="flex-1">
            <CustomText weight="bold" className="text-base text-black dark:text-white">
              {mockPost.user.name}
            </CustomText>
            <View className="flex-row items-center">
              <Ionicons name="location" size={14} color={isDark ? '#9ca3af' : '#6b7280'} />
              <CustomText className="text-sm text-gray-500 dark:text-gray-400 ml-1">
                {mockPost.content.location}
              </CustomText>
              <CustomText className="text-sm text-gray-400 dark:text-gray-500 ml-2">
                • {mockPost.content.timestamp}
              </CustomText>
            </View>
          </View>
          <TouchableOpacity>
            <Ionicons name="ellipsis-horizontal" size={24} color={isDark ? '#9ca3af' : '#6b7280'} />
          </TouchableOpacity>
        </View>

        {/* Image */}
        <View className="w-full h-96 bg-gray-200 dark:bg-neutral-800">
          <Image
            source={{ uri: mockPost.content.images[0] }}
            className="w-full h-full"
            resizeMode="cover"
          />
        </View>

        {/* Actions */}
        <View className="flex-row items-center px-4 py-4 border-b border-gray-200 dark:border-neutral-800">
          <TouchableOpacity onPress={handleLike} className="flex-row items-center mr-6">
            <Ionicons 
              name={liked ? 'heart' : 'heart-outline'} 
              size={28} 
              color={liked ? '#ef4444' : (isDark ? '#9ca3af' : '#6b7280')} 
            />
            <CustomText className="text-base text-gray-700 dark:text-gray-300 ml-2">
              {liked ? mockPost.content.likes + 1 : mockPost.content.likes}
            </CustomText>
          </TouchableOpacity>
          <TouchableOpacity className="flex-row items-center mr-6">
            <Ionicons name="chatbubble-outline" size={26} color={isDark ? '#9ca3af' : '#6b7280'} />
            <CustomText className="text-base text-gray-700 dark:text-gray-300 ml-2">
              {mockPost.content.comments.length}
            </CustomText>
          </TouchableOpacity>
          <TouchableOpacity className="flex-row items-center mr-6">
            <Ionicons name="share-outline" size={26} color={isDark ? '#9ca3af' : '#6b7280'} />
            <CustomText className="text-base text-gray-700 dark:text-gray-300 ml-2">
              {mockPost.content.shares}
            </CustomText>
          </TouchableOpacity>
          <View className="flex-1" />
          <TouchableOpacity>
            <Ionicons name="bookmark-outline" size={26} color={isDark ? '#9ca3af' : '#6b7280'} />
          </TouchableOpacity>
        </View>

        {/* Content */}
        <View className="px-4 py-4 border-b border-gray-200 dark:border-neutral-800">
          <CustomText weight="bold" className="text-xl text-black dark:text-white mb-2">
            {mockPost.content.title}
          </CustomText>
          <CustomText className="text-base text-gray-700 dark:text-gray-300 leading-6">
            {mockPost.content.description}
          </CustomText>
        </View>

        {/* Comments */}
        <View className="px-4 py-4">
          <CustomText weight="bold" className="text-lg text-black dark:text-white mb-4">
            {t('common.comments', { count: mockPost.content.comments.length })}
          </CustomText>
          {mockPost.content.comments.map(comment => (
            <View key={comment.id} className="mb-4">
              <View className="flex-row items-start">
                <View className="w-8 h-8 rounded-full bg-gray-200 dark:bg-neutral-800 mr-3" />
                <View className="flex-1">
                  <View className="flex-row items-center mb-1">
                    <CustomText weight="bold" className="text-sm text-black dark:text-white mr-2">
                      {comment.user.name}
                    </CustomText>
                    <CustomText className="text-xs text-gray-400 dark:text-gray-500">
                      {comment.timestamp}
                    </CustomText>
                  </View>
                  <CustomText className="text-sm text-gray-700 dark:text-gray-300">
                    {comment.text}
                  </CustomText>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Comment Input */}
      <View className="flex-row items-center px-4 py-3 border-t border-gray-200 dark:border-neutral-800 bg-white dark:bg-black">
        <View className="w-8 h-8 rounded-full bg-gray-200 dark:bg-neutral-800 mr-3" />
        <TextInput
          placeholder={t('common.addComment')}
          placeholderTextColor={isDark ? '#9ca3af' : '#6b7280'}
          value={commentText}
          onChangeText={setCommentText}
          className="flex-1 bg-gray-100 dark:bg-neutral-900 rounded-full px-4 py-2 text-black dark:text-white mr-2"
        />
        <TouchableOpacity onPress={handleComment} disabled={!commentText.trim()}>
          <Ionicons 
            name="send" 
            size={24} 
            color={commentText.trim() ? (isDark ? Colors.dark.primary : Colors.light.primary) : (isDark ? '#666' : '#9ca3af')} 
          />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

