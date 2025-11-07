import { useState, useMemo } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { CustomText } from '@components/ui/CustomText';
import CustomButton from '@components/ui/CustomButton';
import Colors from '@constants/Colors';
import { useTheme } from '@components/context/ThemeContext';
import { useGetPostQuery, useCreateCommentMutation, useCreateReactionMutation, useDeleteReactionMutation, GetPostDocument, GetPostsDocument } from '@api';
import { useAppSelector } from '@store/hooks';

// Helper function to format relative time
const formatRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  return date.toLocaleDateString();
};

// Helper to get entity info
const getEntityInfo = (post: any) => {
  if (!post.relatedEntity) return { title: '', location: '', imageUrl: null, type: null, id: null };
  
  if (post.type === 'trip') {
    return {
      title: post.relatedEntity.destination || 'Trip',
      location: post.relatedEntity.destination || '',
      imageUrl: null,
      type: 'trip',
      id: post.relatedId,
    };
  } else if (post.type === 'tour') {
    return {
      title: post.relatedEntity.title || 'Tour',
      location: post.relatedEntity.location || '',
      imageUrl: post.relatedEntity.imageUrl || null,
      type: 'tour',
      id: post.relatedId,
    };
  } else if (post.type === 'place') {
    return {
      title: post.relatedEntity.name || 'Place',
      location: post.relatedEntity.location || '',
      imageUrl: post.relatedEntity.imageUrl || null,
      type: 'place',
      id: post.relatedId,
    };
  }
  return { title: '', location: '', imageUrl: null, type: null, id: null };
};

export default function PostDetailScreen() {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const postId = useMemo(() => (Array.isArray(id) ? id[0] : id) as string, [id]);
  const [commentText, setCommentText] = useState('');

  const { data, loading, error, refetch } = useGetPostQuery({
    variables: { id: postId },
    skip: !postId,
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all',
  });

  const [createComment, { loading: creatingComment }] = useCreateCommentMutation({
    refetchQueries: [GetPostDocument, GetPostsDocument],
    onCompleted: () => {
      setCommentText('');
    },
    onError: (error) => {
      Alert.alert(t('common.error') || 'Error', error.message || 'Failed to add comment');
    },
  });

  const { user } = useAppSelector(state => state.auth);

  const [createReaction] = useCreateReactionMutation({
    refetchQueries: [GetPostDocument, GetPostsDocument],
    onError: (error) => {
      console.error('Reaction error:', error);
    },
  });

  const [deleteReaction] = useDeleteReactionMutation({
    refetchQueries: [GetPostDocument, GetPostsDocument],
    onError: (error) => {
      console.error('Delete reaction error:', error);
    },
  });

  const post = data?.getPost as any;
  const entityInfo = post ? getEntityInfo(post) : null;

  // Check if current user has already reacted with ❤️
  const liked = useMemo(() => {
    if (!user?.id || !post?.reactions) return false;
    return post.reactions.some((r: any) => r.user?.id === user.id && r.emoji === '❤️');
  }, [user?.id, post?.reactions]);

  const imageUrl = entityInfo?.imageUrl || (post?.attachments && post.attachments[0]) || null;
  
  // Generate placeholder image URL using Unsplash (travel category)
  const placeholderImageUrl = useMemo(() => {
    const seed = post?.id ? post.id.substring(0, 8) : 'default';
    return `https://source.unsplash.com/800x600/?travel,landscape&sig=${seed}`;
  }, [post]);

  if (!post && !loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white dark:bg-black px-6">
        <Ionicons name="alert-circle-outline" size={64} color={isDark ? '#ef4444' : '#dc2626'} />
        <CustomText weight="bold" className="text-lg text-gray-800 dark:text-gray-300 mt-4 mb-2 text-center">
          {t('common.error') || 'Error'}
        </CustomText>
        <CustomText className="text-base text-gray-600 dark:text-gray-400 text-center">
          Post not found
        </CustomText>
      </View>
    );
  }

  const handleComment = async () => {
    if (!commentText.trim() || !postId) return;

    try {
      await createComment({
        variables: {
          postId,
          content: commentText.trim(),
        },
      });
    } catch (error) {
      // Error handled by onError callback
      console.error('Comment error:', error);
    }
  };

  const handleLike = async () => {
    if (!postId || !user?.id) return;

    // Find user's existing reaction
    const userReaction = post?.reactions?.find(
      (r: any) => r.user?.id === user.id && r.emoji === '❤️'
    );

    try {
      if (userReaction) {
        // Delete existing reaction
        await deleteReaction({
          variables: {
            reactionId: userReaction.id,
          },
        });
      } else {
        // Create new reaction
        await createReaction({
          variables: {
            postId,
            emoji: '❤️',
          },
        });
      }
    } catch (error) {
      console.error('Reaction error:', error);
    }
  };

  const handleViewRelatedEntity = () => {
    if (!entityInfo || !entityInfo.type || !entityInfo.id) return;

    if (entityInfo.type === 'trip') {
      router.push(`/(app)/(trips)/${entityInfo.id}` as any);
    } else if (entityInfo.type === 'tour') {
      router.push(`/(app)/(feed)/tours/${entityInfo.id}` as any);
    } else if (entityInfo.type === 'place') {
      router.push(`/(app)/(feed)/places/${entityInfo.id}` as any);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white dark:bg-black">
        <ActivityIndicator size="large" color={isDark ? Colors.dark.primary : Colors.light.primary} />
      </View>
    );
  }

  if (error || !post) {
    return (
      <View className="flex-1 items-center justify-center px-6 bg-white dark:bg-black">
        <Ionicons name="alert-circle-outline" size={64} color={isDark ? '#ef4444' : '#dc2626'} />
        <CustomText weight="bold" className="text-lg text-gray-800 dark:text-gray-300 mt-4 mb-2 text-center">
          {t('common.error') || 'Error'}
        </CustomText>
        <CustomText className="text-base text-gray-600 dark:text-gray-400 text-center">
          {String((error as any)?.message || 'Post not found')}
        </CustomText>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-white dark:bg-black"
    >
      <Stack.Screen 
        options={{ 
          title: entityInfo?.title || post.content || t('common.post') || 'Post',
          headerShown: true,
        }} 
      />
      
      <ScrollView className="flex-1">
        {/* User Header */}
        <View className="flex-row items-center px-4 py-4 border-b border-gray-200 dark:border-neutral-800">
          <View className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 dark:bg-neutral-800 mr-3">
            {post.user?.avatar ? (
              <Image
                source={{ uri: post.user.avatar }}
                className="w-full h-full"
                resizeMode="cover"
              />
            ) : (
              <View className="w-full h-full items-center justify-center">
                <Ionicons name="person" size={24} color={isDark ? '#9ca3af' : '#6b7280'} />
              </View>
            )}
          </View>
          <View className="flex-1">
            <CustomText weight="bold" className="text-base text-black dark:text-white">
              {post.user?.name || 'Unknown User'}
            </CustomText>
            <View className="flex-row items-center">
              {entityInfo?.location && (
                <>
                  <Ionicons name="location" size={14} color={isDark ? '#9ca3af' : '#6b7280'} />
                  <CustomText className="text-sm text-gray-500 dark:text-gray-400 ml-1">
                    {entityInfo.location}
                  </CustomText>
                </>
              )}
              <CustomText className="text-sm text-gray-400 dark:text-gray-500 ml-2">
                • {formatRelativeTime(post.createdAt)}
              </CustomText>
            </View>
          </View>
          <TouchableOpacity>
            <Ionicons name="ellipsis-horizontal" size={24} color={isDark ? '#9ca3af' : '#6b7280'} />
          </TouchableOpacity>
        </View>

        {/* Image */}
        <View className="w-full h-96 bg-gray-200 dark:bg-neutral-800 relative overflow-hidden">
          {imageUrl ? (
            <Image
              source={{ uri: imageUrl }}
              className="w-full h-full"
              resizeMode="cover"
            />
          ) : (
            <View className="w-full h-full items-center justify-center bg-gray-100 dark:bg-neutral-800">
              <Image
                source={{ uri: placeholderImageUrl }}
                className="w-full h-full opacity-50"
                resizeMode="cover"
              />
              <View className="absolute inset-0 items-center justify-center">
                <Ionicons name="image-outline" size={48} color={isDark ? '#4b5563' : '#9ca3af'} />
                <CustomText className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  {t('feed.noImage') || 'Travel Image'}
                </CustomText>
              </View>
            </View>
          )}
        </View>

        {/* Content */}
        {post.content && (
          <View className="px-4 pt-4 pb-2">
            <CustomText className="text-base text-gray-800 dark:text-gray-200 leading-6">
              {post.content}
            </CustomText>
          </View>
        )}

        {/* Related Entity Card */}
        {entityInfo && entityInfo.title && (
          <TouchableOpacity
            onPress={handleViewRelatedEntity}
            className="mx-4 mt-4 p-4 bg-gray-50 dark:bg-neutral-800/50 rounded-xl border border-gray-200 dark:border-neutral-700"
            activeOpacity={0.7}
          >
            <View className="flex-row items-center">
              <Ionicons
                name={entityInfo.type === 'trip' ? 'airplane' : entityInfo.type === 'tour' ? 'map' : 'location'}
                size={20}
                color={isDark ? '#60a5fa' : '#3b82f6'}
                style={{ marginRight: 8 }}
              />
              <View className="flex-1">
                <CustomText className="text-xs text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wide">
                  {t('feed.post.relatedEntity') || 'Related'}
                </CustomText>
                <CustomText weight="bold" className="text-base text-black dark:text-white">
                  {entityInfo.title}
                </CustomText>
                {entityInfo.location && (
                  <CustomText className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {entityInfo.location}
                  </CustomText>
                )}
              </View>
              <Ionicons name="chevron-forward" size={20} color={isDark ? '#9ca3af' : '#6b7280'} />
            </View>
          </TouchableOpacity>
        )}

        {/* Actions */}
        <View className="flex-row items-center px-4 py-4 border-t border-gray-200 dark:border-neutral-800">
          <TouchableOpacity onPress={handleLike} className="flex-row items-center mr-6" activeOpacity={0.7}>
            <Ionicons 
              name={liked ? 'heart' : 'heart-outline'} 
              size={24} 
              color={liked ? '#ef4444' : (isDark ? '#9ca3af' : '#6b7280')} 
            />
            <CustomText className="text-sm text-gray-700 dark:text-gray-300 ml-2 font-medium">
              {post?.reactionsCount || 0}
            </CustomText>
          </TouchableOpacity>
          <View className="flex-row items-center mr-6">
            <Ionicons name="chatbubble-outline" size={24} color={isDark ? '#9ca3af' : '#6b7280'} />
            <CustomText className="text-sm text-gray-700 dark:text-gray-300 ml-2 font-medium">
              {post?.commentsCount || 0}
            </CustomText>
          </View>
          <View className="flex-1" />
          <TouchableOpacity activeOpacity={0.7}>
            <Ionicons name="bookmark-outline" size={24} color={isDark ? '#9ca3af' : '#6b7280'} />
          </TouchableOpacity>
        </View>

        {/* Content */}
        {post.content && (
          <View className="px-4 py-4 border-b border-gray-200 dark:border-neutral-800">
            <CustomText className="text-base text-gray-700 dark:text-gray-300 leading-6">
              {post.content}
            </CustomText>
          </View>
        )}

        {/* Comments */}
        <View className="px-4 py-4">
          <CustomText weight="bold" className="text-lg text-black dark:text-white mb-4">
            {t('common.comments', { count: post?.commentsCount || 0 }) || `Comments (${post?.commentsCount || 0})`}
          </CustomText>
          {post?.comments && post.comments.length > 0 ? (
            post.comments.map((comment: any) => (
              <View key={comment.id} className="mb-4">
                <View className="flex-row items-start">
                  <View className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 dark:bg-neutral-800 mr-3">
                    {comment.user?.avatar ? (
                      <Image
                        source={{ uri: comment.user.avatar }}
                        className="w-full h-full"
                        resizeMode="cover"
                      />
                    ) : (
                      <View className="w-full h-full items-center justify-center">
                        <Ionicons name="person" size={16} color={isDark ? '#9ca3af' : '#6b7280'} />
                      </View>
                    )}
                  </View>
                  <View className="flex-1">
                    <View className="flex-row items-center mb-1">
                      <CustomText weight="bold" className="text-sm text-black dark:text-white mr-2">
                        {comment.user?.name || 'Unknown'}
                      </CustomText>
                      <CustomText className="text-xs text-gray-400 dark:text-gray-500">
                        {formatRelativeTime(comment.createdAt)}
                      </CustomText>
                    </View>
                    <CustomText className="text-sm text-gray-700 dark:text-gray-300">
                      {comment.content}
                    </CustomText>
                  </View>
                </View>
              </View>
            ))
          ) : (
            <CustomText className="text-sm text-gray-500 dark:text-gray-400">
              {t('feed.post.noComments') || 'No comments yet. Be the first to comment!'}
            </CustomText>
          )}
        </View>
      </ScrollView>

      {/* Comment Input */}
      <View className="flex-row items-center px-4 py-3 border-t border-gray-200 dark:border-neutral-800 bg-white dark:bg-black">
        <View className="w-8 h-8 rounded-full bg-gray-200 dark:bg-neutral-800 mr-3" />
        <TextInput
          placeholder={t('common.addComment') || 'Add a comment...'}
          placeholderTextColor={isDark ? '#9ca3af' : '#6b7280'}
          value={commentText}
          onChangeText={setCommentText}
          className="flex-1 bg-gray-100 dark:bg-neutral-900 rounded-full px-4 py-2 text-black dark:text-white mr-2"
          editable={!creatingComment}
        />
        <TouchableOpacity 
          onPress={handleComment} 
          disabled={!commentText.trim() || creatingComment}
        >
          {creatingComment ? (
            <ActivityIndicator size="small" color={isDark ? Colors.dark.primary : Colors.light.primary} />
          ) : (
            <Ionicons 
              name="send" 
              size={24} 
              color={commentText.trim() ? (isDark ? Colors.dark.primary : Colors.light.primary) : (isDark ? '#666' : '#9ca3af')} 
            />
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
