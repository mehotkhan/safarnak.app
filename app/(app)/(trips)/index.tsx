import { useState, useMemo, useCallback } from 'react';
import {
  View,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { CustomText } from '@ui/display';
import { useTheme } from '@ui/context';
import { TripCard } from '@ui/cards';
import { TabBar } from '@ui/layout';
import { CreateFAB } from '@ui/components';
import { useGetTripsQuery } from '@api';
import { useAppSelector } from '@state/hooks';
import Colors from '@constants/Colors';

type TabType = 'myTrips' | 'joined' | 'drafts';

export default function PlanScreen() {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const router = useRouter();
  const { user } = useAppSelector(state => state.auth);
  const [activeTab, setActiveTab] = useState<TabType>('myTrips');
  const [refreshing, setRefreshing] = useState(false);

  // GraphQL Queries
  const { data: tripsData, loading: tripsLoading, error: tripsError, refetch: refetchTrips } = useGetTripsQuery({
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all',
    notifyOnNetworkStatusChange: true,
  });

  // Filter trips by current user and status
  const allTrips = useMemo(() => {
    const data = tripsData?.getTrips;
    return Array.isArray(data) ? data : [];
  }, [tripsData]);

  // Filter trips by tab type
  // Note: Backend already filters by userId, so all trips returned are for the current user
  const myTrips = useMemo(() => {
    if (!user?.id) return [];
    // Backend already filters by userId, but we keep this check for safety
    // Filter out any trips that don't match (shouldn't happen, but defensive)
    return allTrips.filter((trip: any) => !trip.userId || trip.userId === user.id);
  }, [allTrips, user?.id]);

  const joinedTrips = useMemo(() => {
    if (!user?.id) return [];
    // TODO: Filter trips where user is a participant (not owner)
    // This will be implemented when trip_participants table is added in Phase 10-11
    return [];
  }, [user?.id]);

  const draftTrips = useMemo(() => {
    if (!user?.id) return [];
    // Trips with draft status or incomplete
    // Backend already filters by userId, so we just need to check status
    return allTrips.filter((trip: any) => 
      (!trip.userId || trip.userId === user.id) && 
      (trip.status === 'draft' || !trip.startDate || !trip.destination)
    );
  }, [allTrips, user?.id]);

  // Refresh handler
  const onRefresh = useCallback(async () => {
    try {
      setRefreshing(true);
        await refetchTrips();
    } finally {
      setRefreshing(false);
    }
  }, [refetchTrips]);


  const handleTripPress = useCallback((tripId: string) => {
    router.push(`/(app)/(trips)/${tripId}` as any);
  }, [router]);

  // Get current data based on active tab
  const currentData = useMemo(() => {
    switch (activeTab) {
      case 'myTrips':
        return myTrips;
      case 'joined':
        return joinedTrips;
      case 'drafts':
        return draftTrips;
      default:
        return [];
    }
  }, [activeTab, myTrips, joinedTrips, draftTrips]);

  // Loading and error states - data-first pattern (after currentData is defined)
  const isInitialLoad = !currentData.length && tripsLoading;
  const currentError = tripsError;

  // Render content based on active tab
  const renderContent = () => {
    // Data-first: show data if it exists, only show loading if no data
    if (currentData.length > 0) {
      return (
        <FlatList
          key={`trips-list-${activeTab}`}
          extraData={`${activeTab}-${currentData.length}`}
          data={currentData as any[]}
          keyExtractor={(item, index) => `${activeTab}-${item?.id || index}`}
          removeClippedSubviews={true}
          renderItem={({ item }) => {
            if (!item?.id) return null;
            
            return (
              <TripCard
                trip={item}
                onPress={() => handleTripPress(item.id)}
              />
            );
          }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          contentContainerStyle={{ padding: 24, paddingTop: 0 }}
        />
      );
    }

    if (isInitialLoad) {
      return (
        <View className="flex-1 items-center justify-center py-20">
          <ActivityIndicator size="large" color={isDark ? Colors.dark.primary : Colors.light.primary} />
          <CustomText className="mt-4 text-gray-500 dark:text-gray-400">
            {t('common.loading')}
          </CustomText>
        </View>
      );
    }

    if (currentError && currentData.length === 0) {
      return (
        <View className="flex-1 items-center justify-center px-6 py-20">
          <Ionicons name="warning-outline" size={64} color={isDark ? '#ef4444' : '#dc2626'} />
          <CustomText weight="bold" className="mb-2 mt-4 text-center text-lg text-gray-800 dark:text-gray-300">
            {t('common.error')}
          </CustomText>
          <CustomText className="mb-2 text-center text-base text-gray-600 dark:text-gray-400">
            {String((currentError as any)?.message || t('common.error'))}
          </CustomText>
          {!user?.id && (
            <CustomText className="mt-2 text-center text-sm text-gray-500 dark:text-gray-500">
              {t('trips.error.notAuthenticated', { defaultValue: 'Please log in to view your trips' })}
            </CustomText>
          )}
        </View>
      );
    }

    if (currentData.length === 0) {
      const emptyIcons: Record<TabType, string> = {
        myTrips: 'airplane-outline',
        joined: 'people-outline',
        drafts: 'document-outline',
      };
      const emptyMessages: Record<TabType, string> = {
        myTrips: t('trips.empty.myTrips') || 'No trips yet',
        joined: t('trips.empty.joined') || 'No joined trips',
        drafts: t('trips.empty.drafts') || 'No drafts',
      };
      const emptyDescriptions: Record<TabType, string> = {
        myTrips: t('trips.empty.myTripsDescription') || 'Create your first trip',
        joined: t('trips.empty.joinedDescription') || 'Join trips from the explore tab',
        drafts: t('trips.empty.draftsDescription') || 'Continue planning your trip',
  };

  return (
        <View className="flex-1 items-center justify-center px-6 py-20">
          <Ionicons name={emptyIcons[activeTab] as any} size={80} color={isDark ? '#4b5563' : '#d1d5db'} />
          <CustomText weight="bold" className="mb-2 mt-4 text-center text-xl text-gray-800 dark:text-gray-300">
            {emptyMessages[activeTab]}
          </CustomText>
          <CustomText className="mb-4 text-center text-base text-gray-600 dark:text-gray-400">
            {emptyDescriptions[activeTab]}
          </CustomText>
          {activeTab === 'myTrips' && (
            <TouchableOpacity
              onPress={() => router.push('/(app)/(trips)/new' as any)}
              className="rounded-lg bg-primary px-6 py-3"
              activeOpacity={0.8}
            >
              <CustomText className="text-white" weight="medium">
                {t('trips.planWithAI')}
              </CustomText>
            </TouchableOpacity>
          )}
        </View>
      );
    }

    // Empty state
    return null;
  };

  return (
    <View className="flex-1 bg-white dark:bg-black">
      <Stack.Screen options={{ title: t('plan.title') || t('trips.title') || 'Trips', headerShown: false }} />

      {/* Header */}
      <View className="border-b border-gray-200 bg-white px-6 pb-4 pt-12 dark:border-neutral-800 dark:bg-black">
        <View className="mb-4 flex-row items-center justify-between">
            <CustomText
              weight="bold"
            className="text-3xl text-black dark:text-white"
            >
            {t('trips.myTravelPlans') || t('trips.title') || 'My Travel Plans'}
          </CustomText>
       
        </View>

        {/* Tabs */}
        <TabBar
          tabs={[
            { id: 'myTrips', label: t('trips.tabs.myTrips') || 'My Trips' },
            { id: 'joined', label: t('trips.tabs.joined') || 'Joined' },
            { id: 'drafts', label: t('trips.tabs.drafts') || 'Drafts' },
          ]}
          activeTab={activeTab}
          onTabChange={(tabId) => setActiveTab(tabId as TabType)}
          variant="segmented"
        />
      </View>

      {/* Content */}
      {renderContent()}

      {/* FAB */}
      <CreateFAB
        options={[
          {
            id: 'trip',
            label: 'Create Trip',
            translationKey: 'plan.createPlan',
            icon: 'airplane-outline',
            createRoute: '/(app)/compose/trip',
          },
          {
            id: 'place',
            label: 'Add Place',
            translationKey: 'places.addPlace',
            icon: 'location-outline',
            createRoute: '/(app)/compose/place',
          },
          {
            id: 'experience',
            label: 'Create Experience',
            translationKey: 'feed.newPost.title',
            icon: 'create-outline',
            createRoute: '/(app)/compose/experience',
          },
        ]}
      />
    </View>
  );
}
