import { useState, useMemo } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { CustomText } from '@ui/display';
import { LoadingState } from '@ui/feedback';
import { ErrorState } from '@ui/feedback';
import { UserAvatar } from '@ui/display';
import { ImageWithPlaceholder } from '@ui/display';
import { KeyboardAwareView } from '@ui/layout';
import Colors from '@constants/Colors';
import { useTheme } from '@ui/context';
import { useGetPostQuery, useCreateCommentMutation, useCreateReactionMutation, useDeleteReactionMutation, GetPostDocument, GetPostsDocument } from '@api';
import { useAppSelector } from '@state/hooks';
import { useDateTime } from '@hooks/useDateTime';
import { getEntityInfo } from '@utils/entityInfo';
import { NetworkStatus } from '@apollo/client';

export default function PostDetailScreen() {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const postId = useMemo(() => (Array.isArray(id) ? id[0] : id) as string, [id]);
  const { formatRelativeTime } = useDateTime();
  const [commentText, setCommentText] = useState('');

  const { data, loading, networkStatus, error, refetch } = useGetPostQuery({
    variables: { id: postId },
    skip: !postId,
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all',
    notifyOnNetworkStatusChange: true,
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
  
  // Generate placeholder image URL using Picsum Photos (globally accessible)
  const placeholderImageUrl = useMemo(() => {
    // Use post ID as seed for consistent images per post
    const seed = post?.id ? post.id.substring(0, 8) : 'default';
    return `https://picsum.photos/seed/${seed}/800/600`;
  }, [post]);

  if (!post && !loading) {
    return (
      <ErrorState
        title={t('common.error') || 'Error'}
        message="Post not found"
      />
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
      // Tour is now unified into Trip with isHosted flag
      router.push(`/(app)/(trips)/${entityInfo.id}` as any);
    } else if (entityInfo.type === 'place') {
      router.push(`/(app)/(explore)/places/${entityInfo.id}` as any);
    }
  };

  // Data-first: show data if it exists, only show loading if no data
  const isInitialLoad = !post && loading;
  const isRefetching = !!post && networkStatus === NetworkStatus.refetch;

  if (isInitialLoad) {
    return <LoadingState message={t('common.loading')} />;
  }

  if (error || !post) {
    return (
      <ErrorState
        title={t('common.error') || 'Error'}
        message={String((error as any)?.message || 'Post not found')}
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <KeyboardAwareView className="flex-1 bg-white dark:bg-black">
      <Stack.Screen 
        options={{ 
          title: entityInfo?.title || post.content || t('common.post') || 'Post',
          headerShown: true,
        }} 
      />
      
      <ScrollView className="flex-1">
        {/* User Header */}
        <View className="flex-row items-center px-4 py-4 border-b border-gray-200 dark:border-neutral-800">
          <UserAvatar avatar={post.user?.avatar} size={48} className="mr-3" userId={post.user?.id} username={post.user?.username} />
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
        <ImageWithPlaceholder
          source={imageUrl ? { uri: imageUrl } : { uri: placeholderImageUrl }}
          placeholder={placeholderImageUrl}
          fallbackText={t('feed.noImage') || 'Travel Image'}
          width="100%"
          height={384}
          resizeMode="cover"
        />

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
                name={entityInfo.type === 'trip' ? (entityInfo.isHosted ? 'map' : 'airplane') : 'location'}
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
                  <UserAvatar avatar={comment.user?.avatar} size={32} className="mr-3" userId={comment.user?.id} username={comment.user?.username} />
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
    </KeyboardAwareView>
  );
}
