import React, { useMemo } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { CustomText } from '@ui/display';
import { UserAvatar } from '@ui/display';
import { ImageWithPlaceholder } from '@ui/display';
import { useTheme } from '@ui/context';
import { useDateTime } from '@hooks/useDateTime';
import { getEntityInfo } from '@utils/entityInfo';

export interface PostCardProps {
  post: any;
  onPress: () => void;
  onUserPress: () => void;
  className?: string;
}

/**
 * PostCard Component
 * 
 * Displays a post card with user info, content, image, and engagement metrics
 * Used in explore screen for post listings
 * 
 * @example
 * <PostCard 
 *   post={post} 
 *   onPress={() => router.push(`/feed/${post.id}`)} 
 *   onUserPress={() => router.push(`/users/${post.user.id}`)} 
 * />
 */
export const PostCard = React.memo<PostCardProps>(({ post, onPress, onUserPress, className = '' }) => {
  const { formatRelativeTime } = useDateTime();
  const { t } = useTranslation();
  const { isDark } = useTheme();
  
  const entityInfo = getEntityInfo(post);
  const imageUrl = post.attachments?.[0] || entityInfo?.imageUrl;

  // Generate placeholder image URL using Picsum Photos (globally accessible)
  const placeholderImageUrl = useMemo(() => {
    // Use post ID as seed for consistent images per post
    const seed = post.id ? post.id.substring(0, 8) : 'default';
    return `https://picsum.photos/seed/${seed}/800/600`;
  }, [post.id]);

  return (
    <TouchableOpacity
      onPress={onPress}
      className={`bg-white dark:bg-neutral-900 rounded-2xl overflow-hidden mb-3 border border-gray-200 dark:border-neutral-800 ${className}`}
      activeOpacity={0.8}
    >
      {/* Header */}
      <View className="flex-row items-center p-3 border-b border-gray-100 dark:border-neutral-800">
        <TouchableOpacity onPress={onUserPress} className="flex-row items-center flex-1">
          <UserAvatar avatar={post.user?.avatar} size={40} className="mr-2" userId={post.user?.id} username={post.user?.username} />
          <View className="flex-1">
            <CustomText weight="medium" className="text-sm text-black dark:text-white">
              {post.user?.name || post.user?.username || 'User'}
            </CustomText>
            <CustomText className="text-xs text-gray-500 dark:text-gray-400">
              {formatRelativeTime(post.createdAt)}
            </CustomText>
          </View>
        </TouchableOpacity>
        {post.type && (
          <View className="bg-primary/10 px-2 py-1 rounded-full">
            <CustomText className="text-xs text-primary">
              {t(`explore.categories.${post.type}s`)}
            </CustomText>
          </View>
        )}
      </View>

      {/* Content */}
      {imageUrl && (
        <ImageWithPlaceholder
          source={{ uri: imageUrl }}
          placeholder={placeholderImageUrl}
          fallbackText={t('feed.noImage') || 'Travel Image'}
          width="100%"
          height={192}
          resizeMode="cover"
        />
      )}
      
      {post.content && (
        <View className="p-3">
          <CustomText className="text-sm text-gray-700 dark:text-gray-300" numberOfLines={3}>
            {post.content}
          </CustomText>
        </View>
      )}

      {entityInfo && entityInfo.title && (
        <View className="px-3 pb-3">
          <View className="bg-gray-50 dark:bg-neutral-800 rounded-lg p-2 flex-row items-center">
            <Ionicons
              name={post.type === 'trip' || post.type === 'tour' ? (post.relatedEntity?.isHosted || post.type === 'tour' ? 'map' : 'airplane') : 'location'}
              size={16}
              color={isDark ? '#9ca3af' : '#6b7280'}
            />
            <CustomText className="text-xs text-gray-600 dark:text-gray-400 ml-2" numberOfLines={1}>
              {entityInfo.title}
            </CustomText>
          </View>
        </View>
      )}

      {/* Footer */}
      <View className="flex-row items-center justify-between px-3 py-2 border-t border-gray-100 dark:border-neutral-800">
        <View className="flex-row items-center">
          <Ionicons
            name="heart-outline"
            size={18}
            color={isDark ? '#9ca3af' : '#6b7280'}
          />
          <CustomText className="text-xs text-gray-600 dark:text-gray-400 ml-1">
            {post.reactionsCount || 0}
          </CustomText>
        </View>
        <View className="flex-row items-center">
          <Ionicons
            name="chatbubble-outline"
            size={18}
            color={isDark ? '#9ca3af' : '#6b7280'}
          />
          <CustomText className="text-xs text-gray-600 dark:text-gray-400 ml-1">
            {post.commentsCount || 0}
          </CustomText>
        </View>
        {post.isBookmarked && (
          <Ionicons
            name="bookmark"
            size={18}
            color="#3b82f6"
          />
        )}
      </View>
    </TouchableOpacity>
  );
});

PostCard.displayName = 'PostCard';

