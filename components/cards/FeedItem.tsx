import React, { useState, useMemo, useEffect, useRef } from 'react';
import { View, TouchableOpacity, Image, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { CustomText } from '@components/ui/CustomText';
import { UserAvatar } from '@components/ui/UserAvatar';
import { ImageWithPlaceholder } from '@components/ui/ImageWithPlaceholder';
import { useTheme } from '@components/context/ThemeContext';
import { useAppSelector } from '@store/hooks';
import { useDateTime } from '@utils/datetime';
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

  // Generate placeholder image URL using Unsplash (travel category)
  const placeholderImageUrl = useMemo(() => {
    const seed = item.id ? item.id.substring(0, 8) : 'default';
    return `https://source.unsplash.com/800x600/?travel,landscape&sig=${seed}`;
  }, [item.id]);

  // Get connected item type icon and label
  const connectedItemInfo = useMemo(() => {
    if (item.type === 'trip') {
      return { icon: 'airplane-outline', label: 'Trip', color: '#3b82f6' };
    } else if (item.type === 'tour') {
      return { icon: 'map-outline', label: 'Tour', color: '#10b981' };
    } else if (item.type === 'place') {
      return { icon: 'location-outline', label: 'Place', color: '#f59e0b' };
    }
    return null;
  }, [item.type]);

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
      } catch (error) {
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
    <View className={`bg-white dark:bg-neutral-900 mb-4 rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-neutral-800 ${className}`}>
      {/* User Header */}
      <TouchableOpacity 
        onPress={onUserPress}
        className="flex-row items-center px-4 py-3"
        activeOpacity={0.7}
      >
        <UserAvatar avatar={item.user?.avatar} size={40} className="mr-3" showBorder />
        <View className="flex-1">
          <View className="flex-row items-center">
            <CustomText weight="bold" className="text-base text-black dark:text-white">
              {item.user?.name || 'Unknown User'}
            </CustomText>
            {connectedItemInfo && (
              <View className="flex-row items-center ml-2 px-2 py-0.5 rounded-full" style={{ backgroundColor: `${connectedItemInfo.color}15` }}>
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
          <View className="flex-row items-center mt-1">
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
            <CustomText className="text-sm text-gray-400 dark:text-gray-500 ml-2">
              • {formatRelativeTime(item.createdAt, t)}
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
              className="flex-1 bg-black/50 justify-center items-center"
            >
              <TouchableOpacity
                activeOpacity={1}
                onPress={(e) => e.stopPropagation()}
                className="bg-white dark:bg-neutral-800 rounded-xl shadow-2xl border border-gray-200 dark:border-neutral-700 min-w-[160px] overflow-hidden"
              >
                {isOwner && onEdit && (
                  <TouchableOpacity
                    onPress={handleEdit}
                    className="flex-row items-center px-5 py-4 border-b border-gray-100 dark:border-neutral-700"
                    activeOpacity={0.7}
                  >
                    <Ionicons name="create-outline" size={20} color={isDark ? '#9ca3af' : '#6b7280'} />
                    <CustomText className="text-base text-gray-700 dark:text-gray-300 ml-3 font-medium">
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
                  <CustomText className="text-base text-gray-700 dark:text-gray-300 ml-3 font-medium">
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
        <View className="px-4 pt-3 pb-2">
          <CustomText className="text-base text-gray-800 dark:text-gray-200 leading-5">
            {item.content}
          </CustomText>
        </View>
      )}

      {/* Latest Comments */}
      {item.comments && item.comments.length > 0 && (
        <View className="px-4 pt-2 pb-3 border-t border-gray-100 dark:border-neutral-800">
          {item.comments.slice(0, 4).map((comment: any, index: number) => (
            <View key={comment.id || index} className="mb-2 last:mb-0">
              <View className="flex-row items-start">
                <UserAvatar avatar={comment.user?.avatar} size={24} className="mr-2" />
                <View className="flex-1">
                  <View className="flex-row items-center mb-0.5">
                    <CustomText weight="medium" className="text-xs text-black dark:text-white mr-2">
                      {comment.user?.name || 'Unknown'}
                    </CustomText>
                    <CustomText className="text-xs text-gray-400 dark:text-gray-500">
                      {formatRelativeTime(comment.createdAt, t)}
                    </CustomText>
                  </View>
                  <CustomText className="text-sm text-gray-700 dark:text-gray-300 leading-4">
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
      <View className="flex-row items-center px-4 py-3 border-t border-gray-100 dark:border-neutral-800">
        <TouchableOpacity 
          onPress={handleLike} 
          className="flex-row items-center mr-6"
          activeOpacity={0.7}
        >
          <Ionicons 
            name={hasLiked ? 'heart' : 'heart-outline'} 
            size={24} 
            color={hasLiked ? '#ef4444' : (isDark ? '#9ca3af' : '#6b7280')} 
          />
          <CustomText className="text-sm text-gray-700 dark:text-gray-300 ml-2 font-medium">
            {item.reactionsCount || 0}
          </CustomText>
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={() => {
            onComment();
            onPostPress();
          }} 
          className="flex-row items-center mr-6"
          activeOpacity={0.7}
        >
          <Ionicons 
            name="chatbubble-outline" 
            size={24} 
            color={isDark ? '#9ca3af' : '#6b7280'} 
          />
          <CustomText className="text-sm text-gray-700 dark:text-gray-300 ml-2 font-medium">
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

