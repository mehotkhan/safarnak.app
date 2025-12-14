import React, { useState, useMemo, useEffect, useRef } from 'react';
import { View, TouchableOpacity, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { CustomText } from '@ui/display';
import { UserAvatar } from '@ui/display';
import { ImageWithPlaceholder } from '@ui/display';
import { useTheme } from '@ui/context';
import { useAppSelector } from '@state/hooks';
import { useDateTime } from '@hooks/useDateTime';
import { getEntityInfo } from '@utils/entityInfo';

export interface FeedItemProps {
  item: any;
  onLike: () => Promise<void>;
  onComment: () => void;
  onShare: () => void;
  onUserPress: () => void;
  onPostPress: () => void;
  onLocationPress?: () => void;
  onBookmark?: (postId: string) => Promise<void>;
  onEdit?: (postId: string) => void;
  isOwner?: boolean;
  className?: string;
}

/**
 * FeedItem Component
 * 
 * Displays a feed item with user info, content, image, comments, and actions
 * Used in feed screen for social posts
 * 
 * @example
 * <FeedItem 
 *   item={post} 
 *   onLike={handleLike}
 *   onComment={handleComment}
 *   onShare={handleShare}
 *   onUserPress={() => router.push(`/users/${post.user.id}`)}
 *   onPostPress={() => router.push(`/feed/${post.id}`)}
 *   onBookmark={handleBookmark}
 * />
 */
export const FeedItem = React.memo<FeedItemProps>(({ 
  item, 
  onLike, 
  onComment, 
  onShare,
  onUserPress,
  onPostPress,
  onLocationPress,
  onBookmark,
  onEdit,
  isOwner = false,
  className = '',
}) => {
  const { user } = useAppSelector(state => state.auth);
  const { formatRelativeTime } = useDateTime();
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const [optimisticBookmarked, setOptimisticBookmarked] = useState<boolean | null>(null);
  const [showMenu, setShowMenu] = useState(false);
  
  // Use optimistic state if available, otherwise use server state
  const bookmarked = optimisticBookmarked !== null ? optimisticBookmarked : (item.isBookmarked || false);
  
  // Clear optimistic state when server state updates (refetch completed)
  const prevIsBookmarkedRef = useRef(item.isBookmarked);
  useEffect(() => {
    if (optimisticBookmarked !== null && item.isBookmarked === optimisticBookmarked && prevIsBookmarkedRef.current !== item.isBookmarked) {
      prevIsBookmarkedRef.current = item.isBookmarked;
      requestAnimationFrame(() => {
        setOptimisticBookmarked(null);
      });
    } else if (prevIsBookmarkedRef.current !== item.isBookmarked) {
      prevIsBookmarkedRef.current = item.isBookmarked;
    }
  }, [item.isBookmarked, optimisticBookmarked]);
  
  const entityInfo = getEntityInfo(item);
  const imageUrl = entityInfo.imageUrl || (item.attachments && item.attachments[0]) || null;

  // Generate placeholder image URL using Picsum Photos (globally accessible)
  const placeholderImageUrl = useMemo(() => {
    // Use post ID as seed for consistent images per post
    const seed = item.id ? item.id.substring(0, 8) : 'default';
    return `https://picsum.photos/seed/${seed}/800/600`;
  }, [item.id]);

  // Get connected item type icon and label
  const connectedItemInfo = useMemo(() => {
    if (item.type === 'trip' || item.type === 'tour') {
      // Unified Trip model: tour is now trip with isHosted = true
      const isHosted = item.relatedEntity?.isHosted || item.type === 'tour';
      return isHosted
        ? { icon: 'map-outline', label: t('explore.tour'), color: '#10b981' }
        : { icon: 'airplane-outline', label: t('explore.trip'), color: '#3b82f6' };
    } else if (item.type === 'place') {
      return { icon: 'location-outline', label: t('explore.place'), color: '#f59e0b' };
    }
    return null;
  }, [item.type, item.relatedEntity?.isHosted, t]);

  // Check if current user has already reacted with ❤️
  const hasLiked = useMemo(() => {
    if (!user?.id || !item.reactions) return false;
    return item.reactions.some((r: any) => r.user?.id === user.id && r.emoji === '❤️');
  }, [user?.id, item.reactions]);

  const handleLike = async () => {
    await onLike();
  };

  const handleBookmark = async () => {
    if (onBookmark) {
      const newBookmarked = !bookmarked;
      setOptimisticBookmarked(newBookmarked);
      try {
        await onBookmark(item.id);
      } catch (_error) {
        setOptimisticBookmarked(null);
      }
    }
  };

  const handleEdit = () => {
    if (onEdit) {
      setShowMenu(false);
      onEdit(item.id);
    }
  };

  return (
    <View className={`mb-4 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900 ${className}`}>
      {/* User Header */}
      <TouchableOpacity 
        onPress={onUserPress}
        className="flex-row items-center px-4 py-3"
        activeOpacity={0.7}
      >
        <UserAvatar avatar={item.user?.avatar} size={40} className="mr-3" showBorder userId={item.user?.id} username={item.user?.username} />
        <View className="flex-1">
          <View className="flex-row items-center">
            <CustomText weight="bold" className="text-base text-black dark:text-white">
              {item.user?.name || 'Unknown User'}
            </CustomText>
            {connectedItemInfo && (
              <View className="ml-2 flex-row items-center rounded-full px-2 py-0.5" style={{ backgroundColor: `${connectedItemInfo.color}15` }}>
                <Ionicons
                  name={connectedItemInfo.icon as any}
                  size={12}
                  color={connectedItemInfo.color}
                  style={{ marginRight: 4 }}
                />
                <CustomText className="text-xs" style={{ color: connectedItemInfo.color }}>
                  {connectedItemInfo.label}
                </CustomText>
              </View>
            )}
          </View>
          <View className="mt-1 flex-row items-center">
            {entityInfo.location ? (
              <TouchableOpacity
                onPress={e => {
                  e.stopPropagation();
                  onLocationPress?.();
                }}
                className="flex-row items-center"
                activeOpacity={0.7}
              >
                <Ionicons
                  name="location-outline"
                  size={14}
                  color={isDark ? '#9ca3af' : '#6b7280'}
                  style={{ marginRight: 4 }}
                />
                <CustomText className="text-sm text-gray-500 dark:text-gray-400">
                  {entityInfo.location}
                </CustomText>
              </TouchableOpacity>
            ) : null}
            <CustomText className="ml-2 text-sm text-gray-400 dark:text-gray-500">
              • {formatRelativeTime(item.createdAt)}
            </CustomText>
          </View>
        </View>
        <View className="relative">
          <TouchableOpacity 
            onPress={() => setShowMenu(!showMenu)}
            activeOpacity={0.7}
          >
            <Ionicons 
              name="ellipsis-horizontal" 
              size={20} 
              color={isDark ? '#9ca3af' : '#6b7280'} 
            />
          </TouchableOpacity>
          
          <Modal
            visible={showMenu}
            transparent
            animationType="fade"
            onRequestClose={() => setShowMenu(false)}
          >
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => setShowMenu(false)}
              className="flex-1 items-center justify-center bg-black/50"
            >
              <TouchableOpacity
                activeOpacity={1}
                onPress={(e) => e.stopPropagation()}
                className="min-w-[160px] overflow-hidden rounded-xl border border-gray-200 bg-white shadow-2xl dark:border-neutral-700 dark:bg-neutral-800"
              >
                {isOwner && onEdit && (
                  <TouchableOpacity
                    onPress={handleEdit}
                    className="flex-row items-center border-b border-gray-100 px-5 py-4 dark:border-neutral-700"
                    activeOpacity={0.7}
                  >
                    <Ionicons name="create-outline" size={20} color={isDark ? '#9ca3af' : '#6b7280'} />
                    <CustomText className="ml-3 text-base font-medium text-gray-700 dark:text-gray-300">
                      {t('common.edit') || 'Edit'}
                    </CustomText>
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  onPress={() => {
                    setShowMenu(false);
                    onShare();
                  }}
                  className="flex-row items-center px-5 py-4"
                  activeOpacity={0.7}
                >
                  <Ionicons name="share-outline" size={20} color={isDark ? '#9ca3af' : '#6b7280'} />
                  <CustomText className="ml-3 text-base font-medium text-gray-700 dark:text-gray-300">
                    {t('common.share') || 'Share'}
                  </CustomText>
                </TouchableOpacity>
              </TouchableOpacity>
            </TouchableOpacity>
          </Modal>
        </View>
      </TouchableOpacity>

      {/* Image */}
      <TouchableOpacity onPress={onPostPress} activeOpacity={0.9}>
        <ImageWithPlaceholder
          source={imageUrl ? { uri: imageUrl } : { uri: placeholderImageUrl }}
          placeholder={placeholderImageUrl}
          fallbackText={t('feed.noImage') || 'Travel Image'}
          width="100%"
          height={320}
          resizeMode="cover"
        />
      </TouchableOpacity>

      {/* Content */}
      {item.content && (
        <View className="px-4 pb-2 pt-3">
          <CustomText className="text-base leading-5 text-gray-800 dark:text-gray-200">
            {item.content}
          </CustomText>
        </View>
      )}

      {/* Latest Comments */}
      {item.comments && item.comments.length > 0 && (
        <View className="border-t border-gray-100 px-4 pb-3 pt-2 dark:border-neutral-800">
          {item.comments.slice(0, 4).map((comment: any, index: number) => (
            <View key={comment.id || index} className="mb-2 last:mb-0">
              <View className="flex-row items-start">
                <UserAvatar avatar={comment.user?.avatar} size={24} className="mr-2" userId={comment.user?.id} username={comment.user?.username} />
                <View className="flex-1">
                  <View className="mb-0.5 flex-row items-center">
                    <CustomText weight="medium" className="mr-2 text-xs text-black dark:text-white">
                      {comment.user?.name || 'Unknown'}
                    </CustomText>
                    <CustomText className="text-xs text-gray-400 dark:text-gray-500">
                      {formatRelativeTime(comment.createdAt)}
                    </CustomText>
                  </View>
                  <CustomText className="text-sm leading-4 text-gray-700 dark:text-gray-300">
                    {comment.content}
                  </CustomText>
                </View>
              </View>
            </View>
          ))}
          {item.commentsCount > 4 && (
            <TouchableOpacity
              onPress={() => {
                onComment();
                onPostPress();
              }}
              className="mt-1"
              activeOpacity={0.7}
            >
              <CustomText className="text-xs text-gray-500 dark:text-gray-400">
                {t('feed.viewAllComments', { count: item.commentsCount - 4 }) || `View ${item.commentsCount - 4} more comments`}
              </CustomText>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Actions */}
      <View className="flex-row items-center border-t border-gray-100 px-4 py-3 dark:border-neutral-800">
        <TouchableOpacity 
          onPress={handleLike} 
          className="mr-6 flex-row items-center"
          activeOpacity={0.7}
        >
          <Ionicons 
            name={hasLiked ? 'heart' : 'heart-outline'} 
            size={24} 
            color={hasLiked ? '#ef4444' : (isDark ? '#9ca3af' : '#6b7280')} 
          />
          <CustomText className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            {item.reactionsCount || 0}
          </CustomText>
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={() => {
            onComment();
            onPostPress();
          }} 
          className="mr-6 flex-row items-center"
          activeOpacity={0.7}
        >
          <Ionicons 
            name="chatbubble-outline" 
            size={24} 
            color={isDark ? '#9ca3af' : '#6b7280'} 
          />
          <CustomText className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            {item.commentsCount || 0}
          </CustomText>
        </TouchableOpacity>
        <View className="flex-1" />
        <TouchableOpacity 
          onPress={handleBookmark}
          activeOpacity={0.7}
          disabled={!onBookmark}
        >
          <Ionicons 
            name={bookmarked ? 'bookmark' : 'bookmark-outline'} 
            size={24} 
            color={bookmarked ? '#f59e0b' : (isDark ? '#9ca3af' : '#6b7280')} 
          />
        </TouchableOpacity>
      </View>
    </View>
  );
});

FeedItem.displayName = 'FeedItem';

