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
import { FAB } from '@ui/components';
import { useGetTripsQuery } from '@api';
import { useAppSelector } from '@state/hooks';
import { useActivationGuard } from '@ui/hooks/useActivationGuard';
import Colors from '@constants/Colors';

type TabType = 'myTrips' | 'joined' | 'drafts';

export default function PlanScreen() {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const router = useRouter();
  const { user } = useAppSelector(state => state.auth);
  const { checkActivation } = useActivationGuard();
  const [activeTab, setActiveTab] = useState<TabType>('myTrips');
  const [refreshing, setRefreshing] = useState(false);

  // GraphQL Queries
  const { data: tripsData, loading: tripsLoading, error: tripsError, refetch: refetchTrips } = useGetTripsQuery({
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all',
  });

  // Filter trips by current user and status
  const allTrips = useMemo(() => {
    const data = tripsData?.getTrips;
    return Array.isArray(data) ? data : [];
  }, [tripsData]);

  // Filter trips by tab type
  const myTrips = useMemo(() => {
    if (!user?.id) return [];
    // Trips owned by user
    return allTrips.filter((trip: any) => trip.userId === user.id);
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
    return allTrips.filter((trip: any) => 
      trip.userId === user.id && 
      (trip.status === 'draft' || !trip.startDate || !trip.destination)
    );
  }, [allTrips, user?.id]);

  // Loading and error states
  const currentLoading = tripsLoading;
  const currentError = tripsError;

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

  // Render content based on active tab
  const renderContent = () => {
    if (currentLoading && currentData.length === 0) {
      return (
        <View className="flex-1 items-center justify-center py-20">
          <ActivityIndicator size="large" color={isDark ? Colors.dark.primary : Colors.light.primary} />
          <CustomText className="text-gray-500 dark:text-gray-400 mt-4">
            {t('common.loading')}
          </CustomText>
        </View>
      );
    }

    if (currentError && currentData.length === 0) {
      return (
        <View className="flex-1 items-center justify-center px-6 py-20">
          <Ionicons name="warning-outline" size={64} color={isDark ? '#ef4444' : '#dc2626'} />
          <CustomText weight="bold" className="text-lg text-gray-800 dark:text-gray-300 mt-4 mb-2 text-center">
            {t('common.error')}
          </CustomText>
          <CustomText className="text-base text-gray-600 dark:text-gray-400 text-center">
            {String((currentError as any)?.message || t('common.error'))}
          </CustomText>
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
          <CustomText weight="bold" className="text-xl text-gray-800 dark:text-gray-300 mt-4 mb-2 text-center">
            {emptyMessages[activeTab]}
          </CustomText>
          <CustomText className="text-base text-gray-600 dark:text-gray-400 text-center mb-4">
            {emptyDescriptions[activeTab]}
          </CustomText>
          {activeTab === 'myTrips' && (
            <TouchableOpacity
              onPress={() => router.push('/(app)/(trips)/new' as any)}
              className="bg-primary px-6 py-3 rounded-lg"
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
  };

  return (
    <View className="flex-1 bg-white dark:bg-black">
      <Stack.Screen options={{ title: t('plan.title') || t('trips.title') || 'Trips', headerShown: false }} />

      {/* Header */}
      <View className="px-6 pt-12 pb-4 bg-white dark:bg-black border-b border-gray-200 dark:border-neutral-800">
        <View className="flex-row items-center justify-between mb-4">
            <CustomText
              weight="bold"
            className="text-3xl text-black dark:text-white"
            >
            {t('trips.myTravelPlans') || t('trips.title') || 'My Travel Plans'}
          </CustomText>
          <TouchableOpacity
            onPress={() => {
              checkActivation(() => {
                router.push('/(app)/(trips)/new' as any);
              });
            }}
            className="bg-primary px-4 py-2 rounded-lg flex-row items-center"
            activeOpacity={0.8}
          >
            <Ionicons name="sparkles" size={18} color="#fff" style={{ marginRight: 6 }} />
            <CustomText className="text-white" weight="medium">
              {t('trips.planWithAI')}
            </CustomText>
          </TouchableOpacity>
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
      <FAB
        options={[
          {
            id: 'trip',
            label: 'Create Trip',
            translationKey: 'plan.createPlan',
            icon: 'airplane-outline',
            route: '/(app)/compose',
          },
          {
            id: 'place',
            label: 'Add Place',
            translationKey: 'places.addPlace',
            icon: 'location-outline',
            route: '/(app)/compose',
          },
          {
            id: 'experience',
            label: 'Create Experience',
            translationKey: 'feed.newPost.title',
            icon: 'create-outline',
            route: '/(app)/compose',
          },
        ]}
      />
    </View>
  );
}
