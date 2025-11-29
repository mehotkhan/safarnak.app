import { ActivityIndicator, FlatList, Image, RefreshControl, TouchableOpacity, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import { CustomText } from '@ui/display';
import { useDateTime } from '@hooks/useDateTime';
import { useMyConversations } from '@hooks/useConversations';
import { useAppSelector } from '@state/hooks';
import Colors from '@constants/Colors';

export default function DirectMessagesScreen() {
  const { t } = useTranslation();
  const { formatRelativeTime } = useDateTime();
  const router = useRouter();
  const auth = useAppSelector((state) => state.auth);

  const {
    conversations,
    loading,
    refreshing,
    refetch,
  } = useMyConversations();

  const renderItem = ({ item }: { item: ReturnType<typeof useMyConversations>['conversations'][number] }) => {
    const otherMember =
      item.members.find((member) => member.id !== auth.user?.id) ?? item.members[0];
  return (
          <TouchableOpacity
            className="px-4 py-3 flex-row items-center border-b border-gray-200 dark:border-neutral-800"
            activeOpacity={0.7}
        onPress={() => router.push(`/(app)/(inbox)/messages/${item.id}` as any)}
          >
            <View className="w-12 h-12 rounded-full overflow-hidden mr-3 bg-gray-200 dark:bg-neutral-800">
          {otherMember?.avatar ? (
            <Image source={{ uri: otherMember.avatar || undefined }} className="w-full h-full" resizeMode="cover" />
          ) : (
            <View className="w-full h-full items-center justify-center">
              <CustomText className="text-sm text-gray-600 dark:text-gray-400">
                {otherMember?.name?.charAt(0) || '?'}
              </CustomText>
            </View>
          )}
            </View>
            <View className="flex-1">
              <View className="flex-row items-center justify-between mb-1">
                <CustomText weight="bold" className="text-base text-black dark:text-white" numberOfLines={1}>
              {item.title || otherMember?.name || t('messages.conversation')}
                </CustomText>
            {item.lastMessageAt && (
                <CustomText className="text-xs text-gray-500 dark:text-gray-400">
                {formatRelativeTime(item.lastMessageAt)}
              </CustomText>
            )}
            </View>
          <CustomText className="text-sm text-gray-600 dark:text-gray-400" numberOfLines={1}>
            {item.lastMessagePreview || t('messages.noMessagesYet')}
                </CustomText>
              </View>
          </TouchableOpacity>
    );
  };

  if (loading && conversations.length === 0) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color={Colors.light.primary} />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white dark:bg-black">
      <FlatList
        data={conversations}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        refreshControl={<RefreshControl refreshing={refreshing || loading} onRefresh={refetch} />}
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center py-20">
            <CustomText className="text-base text-gray-500 dark:text-gray-400">
              {t('messages.noMessagesYet')}
            </CustomText>
          </View>
        }
      />
    </View>
  );
}


