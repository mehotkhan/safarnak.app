import { useState, useEffect, useMemo, useCallback } from 'react';
import { View, ScrollView, TouchableOpacity, Alert, Switch } from 'react-native';
import { useNavigation } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { CustomText } from '@ui/display';
import { CustomButton } from '@ui/forms';
import { useGetFeedPreferencesQuery, useUpdateFeedPreferencesMutation, useSearchSuggestQuery, useGetTrendingQuery } from '@api';
import { InputField } from '@ui/forms';
import { useSystemStatus } from '@hooks/useSystemStatus';

export default function PreferencesScreen() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const { data: feedPrefData, refetch: refetchFeedPrefs } = useGetFeedPreferencesQuery({
    fetchPolicy: 'cache-and-network',
  } as any);
  const [updateFeedPrefs] = useUpdateFeedPreferencesMutation();
  const [fpEntityTypes, setFpEntityTypes] = useState<string[]>(['POST','TRIP','PLACE','LOCATION']);
  const [fpTopics, setFpTopics] = useState<string[]>([]);
  const [fpFollowingOnly, setFpFollowingOnly] = useState(false);
  const [fpCircleOnly, setFpCircleOnly] = useState(false);
  const [fpMutedUserIds, setFpMutedUserIds] = useState<string[]>([]);
  const [origSnapshot, setOrigSnapshot] = useState<any>(null);
  const [topicInput, setTopicInput] = useState('');
  const [mutedInput, setMutedInput] = useState('');
  // UI state
  const { isOnline } = useSystemStatus();
  const navigation = useNavigation();

  // Topic suggestions and trending
  const { data: suggestData } = useSearchSuggestQuery({
    variables: { prefix: topicInput || '', limit: 8 },
    skip: !(topicInput && topicInput.length >= 1),
    fetchPolicy: 'cache-first',
  } as any);
  const { data: trendingData } = useGetTrendingQuery({
    variables: { type: 'TOPIC' as any, window: 'H1' as any, limit: 8 },
    fetchPolicy: 'cache-and-network',
  } as any);

  useEffect(() => {
    const fp = feedPrefData?.getFeedPreferences;
    if (fp) {
      setFpEntityTypes(fp.entityTypes || ['POST','TRIP','PLACE','LOCATION']);
      setFpTopics(fp.topics || []);
      setFpFollowingOnly(Boolean(fp.followingOnly));
      setFpCircleOnly(Boolean(fp.circleOnly));
      setFpMutedUserIds(fp.mutedUserIds || []);
      setOrigSnapshot({
        entityTypes: fp.entityTypes || ['POST','TRIP','PLACE','LOCATION'],
        topics: fp.topics || [],
        followingOnly: Boolean(fp.followingOnly),
        circleOnly: Boolean(fp.circleOnly),
        mutedUserIds: fp.mutedUserIds || [],
      });
    }
  }, [feedPrefData]);

  const hasChanges = useMemo(() => {
    if (!origSnapshot) return true;
    const eqArrays = (a: any[], b: any[]) => a.length === b.length && a.every((x, i) => x === b[i]);
    return !(
      eqArrays([...fpEntityTypes].sort(), [...origSnapshot.entityTypes].sort()) &&
      eqArrays([...fpTopics].sort(), [...origSnapshot.topics].sort()) &&
      fpFollowingOnly === origSnapshot.followingOnly &&
      fpCircleOnly === origSnapshot.circleOnly &&
      eqArrays([...fpMutedUserIds].sort(), [...origSnapshot.mutedUserIds].sort())
    );
  }, [origSnapshot, fpEntityTypes, fpTopics, fpFollowingOnly, fpCircleOnly, fpMutedUserIds]);

  const resetToDefaults = useCallback(() => {
    setFpEntityTypes(['POST','TRIP','PLACE','LOCATION']);
    setFpTopics([]);
    setFpFollowingOnly(false);
    setFpCircleOnly(false);
    setFpMutedUserIds([]);
  }, []);

  const handleSave = useCallback(async () => {
    try {
      setLoading(true);
      await updateFeedPrefs({
        variables: {
          input: {
            entityTypes: fpEntityTypes as any,
            topics: fpTopics,
            followingOnly: fpFollowingOnly,
            circleOnly: fpCircleOnly,
            mutedUserIds: fpMutedUserIds,
          },
        },
      } as any);
      await refetchFeedPrefs();
      Alert.alert(
        t('common.success'),
        t('settings.saved', { defaultValue: 'Settings saved successfully!' }),
        [{ text: t('common.ok') }]
      );
    } catch (e: any) {
      Alert.alert(t('common.error'), e?.message || 'Failed to save preferences');
    } finally {
      setLoading(false);
    }
  }, [updateFeedPrefs, fpEntityTypes, fpTopics, fpFollowingOnly, fpCircleOnly, fpMutedUserIds, refetchFeedPrefs, t]);

  // Move actions to header: Reset defaults + Save
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <TouchableOpacity
            accessibilityLabel={t('common.resetDefaults') || 'Reset to defaults'}
            onPress={resetToDefaults}
            activeOpacity={0.7}
            disabled={loading}
          >
            <Ionicons
              name="refresh"
              size={20}
              color={loading ? '#9ca3af' : '#6b7280'}
            />
          </TouchableOpacity>
          <TouchableOpacity
            accessibilityLabel={t('common.save') || 'Save'}
            onPress={handleSave}
            activeOpacity={0.7}
            disabled={loading || !hasChanges || !isOnline}
          >
            <Ionicons
              name="checkmark"
              size={22}
              color={loading || !hasChanges || !isOnline ? '#9ca3af' : '#16a34a'}
            />
          </TouchableOpacity>
        </View>
      ),
      title: t('profile.preferences.feed.title', { defaultValue: 'Feed Preferences' }),
    } as any);
  }, [navigation, loading, hasChanges, isOnline, t, resetToDefaults, handleSave]);

  return (
    <ScrollView className="flex-1 bg-white dark:bg-black">
      <View className="px-4 py-4">
        {/* Feed Preferences */}
        <View className="mb-6">
          <CustomText weight="bold" className="text-base text-black dark:text-white mb-2">
            {t('profile.preferences.feed.title', { defaultValue: 'Feed Preferences' })}
          </CustomText>
          {!isOnline && (
            <CustomText className="text-xs text-red-500 mb-2">
              {t('common.offline', { defaultValue: 'You are offline. Changes will be saved later.' })}
            </CustomText>
          )}
          <View className="flex-row items-center justify-between mb-2">
            <CustomText className="text-gray-800 dark:text-gray-200">
              {t('profile.preferences.feed.followingOnly', { defaultValue: 'Following only' })}
            </CustomText>
            <Switch value={fpFollowingOnly} onValueChange={setFpFollowingOnly} />
          </View>
          <View className="flex-row items-center justify-between mb-2">
            <CustomText className="text-gray-800 dark:text-gray-200">
              {t('profile.preferences.feed.closeFriendsOnly', { defaultValue: 'Close friends only' })}
            </CustomText>
            <Switch value={fpCircleOnly} onValueChange={setFpCircleOnly} />
          </View>
          <CustomText className="text-gray-800 dark:text-gray-200 mb-2">
            {t('profile.preferences.feed.entityTypes', { defaultValue: 'Entity types' })}
          </CustomText>
          <View className="flex-row flex-wrap gap-2 mb-2">
            {(['POST','TRIP','PLACE','LOCATION'] as const).map((et) => {
              const selected = fpEntityTypes.includes(et);
              return (
                <TouchableOpacity
                  key={et}
                  onPress={() =>
                    setFpEntityTypes((prev) =>
                      selected ? prev.filter((x) => x !== et) : [...prev, et]
                    )
                  }
                  className={`px-3 py-1.5 rounded-full border ${
                    selected
                      ? 'bg-primary border-primary'
                      : 'bg-white dark:bg-neutral-900 border-gray-300 dark:border-neutral-700'
                  }`}
                >
                  <CustomText className={selected ? 'text-white' : 'text-gray-700 dark:text-gray-300'}>{et}</CustomText>
                </TouchableOpacity>
              );
            })}
          </View>
          <CustomText className="text-gray-800 dark:text-gray-200 mb-2">
            {t('profile.preferences.feed.topics', { defaultValue: 'Topics' })}
          </CustomText>
          <View className="mb-2">
            <InputField
              label={t('profile.preferences.feed.addTopic', { defaultValue: 'Add topic' })}
              placeholder={t('profile.preferences.feed.addTopicPh', { defaultValue: 'Type to search topics' })}
              value={topicInput}
              onChangeText={setTopicInput}
              icon="pricetag-outline"
            />
            {/* Suggestions */}
            {topicInput?.length ? (
              <View className="flex-row flex-wrap gap-2 mt-2">
                {(suggestData?.searchSuggest || []).map((s: string) => {
                  const selected = fpTopics.includes(s);
                  return (
                    <TouchableOpacity
                      key={`sugg-${s}`}
                      onPress={() =>
                        setFpTopics((prev) =>
                          selected ? prev.filter((x) => x !== s) : [...prev, s]
                        )
                      }
                      className={`px-3 py-1.5 rounded-full border ${
                        selected
                          ? 'bg-primary border-primary'
                          : 'bg-gray-100 dark:bg-neutral-800 border-gray-300 dark:border-neutral-700'
                      }`}
                    >
                      <CustomText className={selected ? 'text-white' : 'text-gray-700 dark:text-gray-300'}>#{s}</CustomText>
                    </TouchableOpacity>
                  );
                })}
              </View>
            ) : null}
          </View>
          <View className="flex-row flex-wrap gap-2">
            {['travel','food','hiking','culture','city','nature'].map((topic) => {
              const selected = fpTopics.includes(topic);
              return (
                <TouchableOpacity
                  key={topic}
                  onPress={() =>
                    setFpTopics((prev) =>
                      selected ? prev.filter((x) => x !== topic) : [...prev, topic]
                    )
                  }
                  className={`px-3 py-1.5 rounded-full border ${
                    selected
                      ? 'bg-primary border-primary'
                      : 'bg-white dark:bg-neutral-900 border-gray-300 dark:border-neutral-700'
                  }`}
                >
                  <CustomText className={selected ? 'text-white' : 'text-gray-700 dark:text-gray-300'}>#{topic}</CustomText>
                </TouchableOpacity>
              );
            })}
            {/* Trending topics */}
            <View className="flex-row flex-wrap gap-2 mt-2">
              {(trendingData?.getTrending?.items || []).map((it: any) => {
                const s = it.label?.replace(/^#/, '') || it.key;
                const selected = fpTopics.includes(s);
                return (
                  <TouchableOpacity
                    key={`trend-${s}`}
                    onPress={() =>
                      setFpTopics((prev) =>
                        selected ? prev.filter((x) => x !== s) : [...prev, s]
                      )
                    }
                    className={`px-3 py-1.5 rounded-full border ${
                      selected
                        ? 'bg-primary border-primary'
                        : 'bg-gray-100 dark:bg-neutral-800 border-gray-300 dark:border-neutral-700'
                    }`}
                  >
                    <CustomText className={selected ? 'text-white' : 'text-gray-700 dark:text-gray-300'}>#{s}</CustomText>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>
        {/* Only feed-related preferences remain on this screen */}

        {/* Muted Users */}
        <View className="mb-6">
          <CustomText weight="bold" className="text-base text-black dark:text-white mb-2">
            {t('profile.preferences.feed.mutedUsers', { defaultValue: 'Muted users' })}
          </CustomText>
          <InputField
            label={t('profile.preferences.feed.addMuted', { defaultValue: 'Add user ID to mute' })}
            placeholder={t('profile.preferences.feed.addMutedPh', { defaultValue: 'Paste user ID' })}
            value={mutedInput}
            onChangeText={setMutedInput}
            icon="person-outline"
          />
          <View className="flex-row flex-wrap gap-2 mt-2">
            {fpMutedUserIds.map((uid) => (
              <TouchableOpacity
                key={uid}
                onPress={() => setFpMutedUserIds((prev) => prev.filter((x) => x !== uid))}
                className="px-3 py-1.5 rounded-full bg-gray-100 dark:bg-neutral-800"
              >
                <CustomText className="text-xs text-gray-700 dark:text-gray-300">{uid.substring(0,8)}…</CustomText>
              </TouchableOpacity>
            ))}
          </View>
          <View className="flex-row gap-2 mt-2">
            <CustomButton
              title={t('common.add') || 'Add'}
              onPress={() => {
                const v = mutedInput.trim();
                if (v && !fpMutedUserIds.includes(v)) {
                  setFpMutedUserIds((prev) => [...prev, v]);
                  setMutedInput('');
                }
              }}
              disabled={!mutedInput.trim()}
            />
            <CustomButton
              title={t('common.reset') || 'Reset'}
              onPress={() => setFpMutedUserIds(origSnapshot?.mutedUserIds || [])}
              bgVariant="secondary"
            />
          </View>
        </View>

        {/* Actions moved to header */}

        <View className="h-4" />
      </View>
    </ScrollView>
  );
}

