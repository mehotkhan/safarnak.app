import { useState, useMemo } from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { CustomText } from '@ui/display';
import { useTheme } from '@ui/context';
import { ShareableTabs } from '@ui/layout/ShareableTabs';
import Colors from '@constants/Colors';
import { useGetBookmarksQuery } from '@api';
import { useAppSelector } from '@state/hooks';
import { useDateTime } from '@hooks/useDateTime';


export default function BookmarksScreen() {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const router = useRouter();
  const { user } = useAppSelector(state => state.auth);
  const { formatRelativeTime } = useDateTime();
  const [selectedTab, setSelectedTab] = useState<'posts' | 'tours' | 'places'>('posts');

  const { data, loading, error } = useGetBookmarksQuery({
    variables: { type: selectedTab === 'posts' ? 'posts' : selectedTab === 'tours' ? 'tours' : 'places' },
    skip: !user?.id,
    fetchPolicy: 'cache-and-network',
  });

  const filteredItems = useMemo(() => {
    if (!data?.getBookmarks) return [];
    
    return data.getBookmarks.map((bookmark: any) => {
      if (bookmark.post) {
        return {
          id: bookmark.post.id,
          ...bookmark.post,
          type: 'post',
        };
      } else if (bookmark.trip) {
        // Tour is now unified into Trip with isHosted flag
        return {
          id: bookmark.trip.id,
          ...bookmark.trip,
          type: bookmark.trip.isHosted ? 'tour' : 'trip', // Keep 'tour' type for UI display if hosted
        };
      } else if (bookmark.place) {
        return {
          id: bookmark.place.id,
          ...bookmark.place,
          type: 'place',
        };
      }
      return null;
    }).filter(Boolean);
  }, [data]);

  return (
    <View className="flex-1 bg-white dark:bg-black">
      <Stack.Screen 
        options={{ 
          title: t('profile.bookmarksTitle'),
          headerShown: true,
        }} 
      />

      {/* Tabs */}
      <ShareableTabs
        tabs={[
          { id: 'posts', label: 'Posts', translationKey: 'profile.bookmarks.posts' },
          { id: 'tours', label: 'Tours', translationKey: 'profile.bookmarks.tours' },
          { id: 'places', label: 'Places', translationKey: 'profile.bookmarks.places' },
        ]}
        activeTab={selectedTab}
        onTabChange={(tabId) => setSelectedTab(tabId as 'posts' | 'tours' | 'places')}
      />

      {/* Content */}
      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={isDark ? Colors.dark.primary : Colors.light.primary} />
        </View>
      ) : error ? (
        <View className="flex-1 items-center justify-center px-6">
          <Ionicons name="alert-circle-outline" size={64} color={isDark ? '#ef4444' : '#dc2626'} />
          <CustomText weight="bold" className="mb-2 mt-4 text-center text-lg text-gray-800 dark:text-gray-300">
            {t('common.error') || 'Error'}
          </CustomText>
          <CustomText className="text-center text-base text-gray-600 dark:text-gray-400">
            {String((error as any)?.message || 'Failed to load bookmarks')}
          </CustomText>
        </View>
      ) : filteredItems.length === 0 ? (
        <View className="flex-1 items-center justify-center px-6">
          <Ionicons
            name={
              selectedTab === 'posts' ? 'document-text-outline' :
              selectedTab === 'tours' ? 'map-outline' :
              'location-outline'
            }
            size={80}
            color={isDark ? '#4b5563' : '#d1d5db'}
          />
          <CustomText
            weight="bold"
            className="mb-2 mt-4 text-center text-xl text-gray-800 dark:text-gray-300"
          >
            {t('profile.bookmarks.emptyState', { 
              defaultValue: 
                selectedTab === 'posts' ? 'No bookmarked posts yet' :
                selectedTab === 'tours' ? 'No bookmarked tours yet' : 
                'No bookmarked places yet'
            })}
          </CustomText>
          <CustomText
            className="text-center text-base text-gray-600 dark:text-gray-400"
          >
            {t('profile.bookmarks.emptyStateSubtitle', { 
              defaultValue: 'Start exploring and bookmark your favorite ' + 
                (selectedTab === 'posts' ? 'posts' :
                 selectedTab === 'tours' ? 'tours' : 'places') + 
                ' to save them for later'
            })}
          </CustomText>
        </View>
      ) : (
        <FlatList
          data={filteredItems}
          keyExtractor={(item, index) => item.id || index.toString()}
          contentContainerStyle={{ padding: 16 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => {
                if (selectedTab === 'posts') {
                  router.push(`/(app)/(home)/${item.id}` as any);
                } else if (selectedTab === 'tours') {
                  // Tour is now unified into Trip - navigate to trip detail
                  router.push(`/(app)/(trips)/${item.id}` as any);
                } else {
                  router.push(`/(app)/(home)/places/${item.id}` as any);
                }
              }}
              className="mb-4 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900"
              activeOpacity={0.7}
            >
              {/* Image */}
              {(item.imageUrl || item.attachments?.[0]) && (
                <View className="h-48 w-full bg-gray-200 dark:bg-neutral-800">
                  <Image
                    source={{ uri: item.imageUrl || item.attachments[0] }}
                    className="size-full"
                    resizeMode="cover"
                  />
                </View>
              )}
              
              {/* Content */}
              <View className="p-4">
                <CustomText
                  weight="bold"
                  className="mb-2 text-lg text-black dark:text-white"
                  numberOfLines={2}
                >
                  {item.title || item.name || item.content}
                </CustomText>
                
                {item.location && (
                  <View className="mb-2 flex-row items-center">
                    <Ionicons
                      name="location-outline"
                      size={16}
                      color={isDark ? '#9ca3af' : '#6b7280'}
                    />
                    <CustomText className="ml-2 text-sm text-gray-600 dark:text-gray-400" numberOfLines={1}>
                      {item.location}
                    </CustomText>
                  </View>
                )}
                
                {item.content && selectedTab === 'posts' && (
                  <CustomText className="mb-2 text-sm text-gray-600 dark:text-gray-400" numberOfLines={2}>
                    {item.content}
                  </CustomText>
                )}
                
                <View className="mt-2 flex-row items-center justify-between">
                  {item.user && (
                    <View className="flex-row items-center">
                      <View className="mr-2 size-6 overflow-hidden rounded-full bg-gray-200 dark:bg-neutral-800">
                        {item.user.avatar ? (
                          <Image
                            source={{ uri: item.user.avatar }}
                            className="size-full"
                            resizeMode="cover"
                          />
                        ) : (
                          <View className="size-full items-center justify-center">
                            <Ionicons name="person" size={12} color={isDark ? '#9ca3af' : '#6b7280'} />
                          </View>
                        )}
                      </View>
                      <CustomText className="text-xs text-gray-500 dark:text-gray-400">
                        {item.user.name}
                      </CustomText>
                    </View>
                  )}
                  
                  {item.createdAt && (
                    <CustomText className="text-xs text-gray-400 dark:text-gray-500">
                      {formatRelativeTime(item.createdAt)}
                    </CustomText>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          )}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

