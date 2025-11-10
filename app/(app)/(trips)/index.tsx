import { useState, useMemo, useCallback, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { CustomText } from '@components/ui/CustomText';
import { useTheme } from '@components/context/ThemeContext';
import { TripCard, TourCard, PlaceCard, LocationCard } from '@components/cards';
import { TabBar } from '@components/ui/TabBar';
import { useGetTripsQuery, useGetToursQuery, useGetPlacesQuery, useGetLocationsQuery } from '@api';
import { useAppSelector } from '@store/hooks';
import Colors from '@constants/Colors';

type TabType = 'trips' | 'tours' | 'places' | 'locations';

export default function PlanScreen() {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const router = useRouter();
  const { user } = useAppSelector(state => state.auth);
  const [activeTab, setActiveTab] = useState<TabType>('trips');
  const [refreshing, setRefreshing] = useState(false);
  const [fabExpanded, setFabExpanded] = useState(false);

  // FAB animation values
  const fabRotation = useMemo(() => new Animated.Value(0), []);
  const fabScale = useMemo(() => new Animated.Value(0), []);

  // Animate Create FAB expansion
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fabRotation, {
        toValue: fabExpanded ? 1 : 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.spring(fabScale, {
        toValue: fabExpanded ? 1 : 0,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fabExpanded, fabRotation, fabScale]);

  const toggleFab = () => {
    setFabExpanded(!fabExpanded);
  };

  const rotateInterpolate = fabRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '45deg'],
  });

  // GraphQL Queries
  const { data: tripsData, loading: tripsLoading, error: tripsError, refetch: refetchTrips } = useGetTripsQuery({
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all',
  });

  const { data: toursData, loading: toursLoading, error: toursError, refetch: refetchTours } = useGetToursQuery({
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all',
  });

  const { data: placesData, loading: placesLoading, error: placesError, refetch: refetchPlaces } = useGetPlacesQuery({
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all',
  });

  const { data: locationsData, loading: locationsLoading, error: locationsError, refetch: refetchLocations } = useGetLocationsQuery({
    variables: { limit: 100 },
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all',
  });

  // Filter data by current user
  const trips = useMemo(() => {
    const data = tripsData?.getTrips;
    return Array.isArray(data) ? data : [];
  }, [tripsData]);
  const allTours = useMemo(() => {
    const data = toursData?.getTours;
    return Array.isArray(data) ? data : [];
  }, [toursData]);
  const allPlaces = useMemo(() => {
    const data = placesData?.getPlaces;
    return Array.isArray(data) ? data : [];
  }, [placesData]);
  const locations = useMemo(() => {
    const data = locationsData?.getLocations;
    return Array.isArray(data) ? data : [];
  }, [locationsData]);

  // Filter tours and places by current user (if ownerId exists)
  const myTours = useMemo(() => {
    // For now, show all tours since tours don't have ownerId
    // TODO: Add ownerId to tours schema or filter by another method
    return allTours;
  }, [allTours]);

  const myPlaces = useMemo(() => {
    if (!user?.id) return [];
    return allPlaces.filter((place: any) => place.ownerId === user.id);
  }, [allPlaces, user?.id]); 

  // Loading and error states
  const currentLoading = activeTab === 'trips' ? tripsLoading : activeTab === 'tours' ? toursLoading : activeTab === 'places' ? placesLoading : activeTab === 'locations' ? locationsLoading : false;
  const currentError = activeTab === 'trips' ? tripsError : activeTab === 'tours' ? toursError : activeTab === 'places' ? placesError : activeTab === 'locations' ? locationsError : null;

  // Refresh handler
  const onRefresh = useCallback(async () => {
    try {
      setRefreshing(true);
      if (activeTab === 'trips') {
        await refetchTrips();
      } else if (activeTab === 'tours') {
        await refetchTours();
      } else if (activeTab === 'places') {
        await refetchPlaces();
      } else if (activeTab === 'locations') {
        await refetchLocations();
      }
    } finally {
      setRefreshing(false);
    }
  }, [activeTab, refetchTrips, refetchTours, refetchPlaces, refetchLocations]);


  const handleTripPress = useCallback((tripId: string) => {
    router.push(`/(app)/(trips)/${tripId}` as any);
  }, [router]);

  const handleTourPress = useCallback((tourId: string) => {
    router.push(`/(app)/(explore)/tours/${tourId}` as any);
  }, [router]);

  const handlePlacePress = useCallback((placeId: string) => {
    router.push(`/(app)/(explore)/places/${placeId}` as any);
  }, [router]);

  const handleLocationPress = useCallback((locationId: string) => {
    router.push(`/(app)/(explore)/locations/${locationId}` as any);
  }, [router]);

  // Get current data based on active tab
  const currentData = useMemo(() => {
    switch (activeTab) {
      case 'trips':
        return trips;
      case 'tours':
        return myTours;
      case 'places':
        return myPlaces;
      case 'locations':
        return locations;
      default:
        return [];
    }
  }, [activeTab, trips, myTours, myPlaces, locations]);

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
        trips: 'airplane-outline',
        tours: 'map-outline',
        places: 'location-outline',
        locations: 'globe-outline',
      };
      const emptyMessages: Record<TabType, string> = {
        trips: t('plan.emptyState') || 'No trips yet',
        tours: t('trips.tabs.toursEmpty') || 'No tours yet',
        places: t('trips.tabs.placesEmpty') || 'No places yet',
        locations: t('trips.tabs.locationsEmpty') || 'No locations yet',
      };
      const emptyDescriptions: Record<TabType, string> = {
        trips: t('plan.description') || 'Create your first trip',
        tours: t('trips.tabs.toursEmptyDescription') || 'Create your first tour',
        places: t('trips.tabs.placesEmptyDescription') || 'Create your first place',
        locations: t('trips.tabs.locationsEmptyDescription') || 'Create your first location',
  };

  return (
        <View className="flex-1 items-center justify-center px-6 py-20">
          <Ionicons name={emptyIcons[activeTab] as any} size={80} color={isDark ? '#4b5563' : '#d1d5db'} />
          <CustomText weight="bold" className="text-xl text-gray-800 dark:text-gray-300 mt-4 mb-2 text-center">
            {emptyMessages[activeTab] || 'No items yet'}
          </CustomText>
          <CustomText className="text-base text-gray-600 dark:text-gray-400 text-center">
            {emptyDescriptions[activeTab] || 'Create your first item'}
          </CustomText>
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
          
          if (activeTab === 'trips') {
            return (
              <TripCard
                trip={item}
                onPress={() => handleTripPress(item.id)}
              />
            );
          } else if (activeTab === 'tours') {
            return (
              <TourCard
                tour={item}
                onPress={() => handleTourPress(item.id)}
                variant="compact"
              />
            );
          } else if (activeTab === 'places') {
            return (
              <PlaceCard
                place={item}
                onPress={() => handlePlacePress(item.id)}
                variant="compact"
              />
            );
          } else if (activeTab === 'locations') {
            return (
              <LocationCard
                location={item}
                onPress={() => handleLocationPress(item.id)}
              />
            );
          }
          return null;
        }}
        refreshing={refreshing}
        onRefresh={onRefresh}
        contentContainerStyle={{ padding: 24, paddingTop: 0 }}
      />
    );
  };

  return (
    <View className="flex-1 bg-white dark:bg-black">
      <Stack.Screen options={{ title: t('plan.title') || t('trips.title') || 'Trips', headerShown: false }} />

      {/* Header */}
      <View className="px-6 pt-12 pb-4 bg-white dark:bg-black border-b border-gray-200 dark:border-neutral-800">
            <CustomText
              weight="bold"
          className="text-3xl text-black dark:text-white mb-4"
            >
          {t('trips.title') || t('plan.title') || 'Trips'}
            </CustomText>

        {/* Tabs */}
        <TabBar
          tabs={(['trips', 'tours', 'places', 'locations'] as TabType[]).map(tab => ({
            id: tab,
            label: tab,
          }))}
          activeTab={activeTab}
          onTabChange={(tabId) => setActiveTab(tabId as TabType)}
          variant="segmented"
        />
      </View>

      {/* Content */}
      {renderContent()}

      {/* Backdrop overlay when FAB expanded */}
      {fabExpanded && (
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => {
            setFabExpanded(false);
          }}
          className="absolute inset-0 bg-black/20"
          style={{ zIndex: 998 }}
        />
      )}

      {/* Multi-Add FAB - Create Trip, Tour, Place, Location */}
      <View className="absolute bottom-6 right-6" style={{ zIndex: 999 }}>
        {/* Expanded Options */}
        {fabExpanded && (
          <View className="absolute bottom-20 right-0 items-end gap-3">
            {/* Create Location Option */}
            <Animated.View
              style={{
                transform: [{ scale: fabScale }],
                opacity: fabScale,
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  setFabExpanded(false);
                  router.push('/(app)/(trips)/locations/new' as any);
                }}
                className="flex-row items-center bg-white dark:bg-neutral-800 px-4 py-3 rounded-full border border-gray-200 dark:border-neutral-700"
                activeOpacity={0.8}
              >
                <View className="w-10 h-10 items-center justify-center rounded-full bg-primary/10 mr-3">
                  <Ionicons name="globe-outline" size={20} color={isDark ? '#60a5fa' : '#3b82f6'} />
                </View>
                <CustomText weight="medium" className="text-base text-black dark:text-white">
                  {t('trips.tabs.locationsCreate') || 'Location'}
                </CustomText>
              </TouchableOpacity>
            </Animated.View>

            {/* Create Place Option */}
            <Animated.View
              style={{
                transform: [{ scale: fabScale }],
                opacity: fabScale,
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  setFabExpanded(false);
                  router.push('/(app)/(trips)/places/new' as any);
                }}
                className="flex-row items-center bg-white dark:bg-neutral-800 px-4 py-3 rounded-full border border-gray-200 dark:border-neutral-700"
                activeOpacity={0.8}
              >
                <View className="w-10 h-10 items-center justify-center rounded-full bg-primary/10 mr-3">
                  <Ionicons name="location-outline" size={20} color={isDark ? '#60a5fa' : '#3b82f6'} />
                </View>
                <CustomText weight="medium" className="text-base text-black dark:text-white">
                  {t('trips.tabs.placesCreate') || t('feed.create.place') || 'Place'}
                </CustomText>
              </TouchableOpacity>
            </Animated.View>

            {/* Create Tour Option */}
            <Animated.View
              style={{
                transform: [{ scale: fabScale }],
                opacity: fabScale,
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  setFabExpanded(false);
                  router.push('/(app)/(trips)/tours/new' as any);
                }}
                className="flex-row items-center bg-white dark:bg-neutral-800 px-4 py-3 rounded-full border border-gray-200 dark:border-neutral-700"
                activeOpacity={0.8}
              >
                <View className="w-10 h-10 items-center justify-center rounded-full bg-primary/10 mr-3">
                  <Ionicons name="map-outline" size={20} color={isDark ? '#60a5fa' : '#3b82f6'} />
                </View>
                <CustomText weight="medium" className="text-base text-black dark:text-white">
                  {t('trips.tabs.toursCreate') || t('tour.create') || 'Tour'}
                </CustomText>
              </TouchableOpacity>
            </Animated.View>

            {/* Create Trip Option */}
            <Animated.View
              style={{
                transform: [{ scale: fabScale }],
                opacity: fabScale,
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  setFabExpanded(false);
                  router.push('/(app)/(trips)/new' as any);
                }}
                className="flex-row items-center bg-white dark:bg-neutral-800 px-4 py-3 rounded-full border border-gray-200 dark:border-neutral-700"
                activeOpacity={0.8}
              >
                <View className="w-10 h-10 items-center justify-center rounded-full bg-primary/10 mr-3">
                  <Ionicons name="airplane-outline" size={20} color={isDark ? '#60a5fa' : '#3b82f6'} />
                </View>
                <CustomText weight="medium" className="text-base text-black dark:text-white">
                  {t('plan.createPlan') || 'Trip'}
              </CustomText>
              </TouchableOpacity>
            </Animated.View>
            </View>
        )}

        {/* Main FAB Button */}
      <TouchableOpacity
          onPress={toggleFab}
          className="w-14 h-14 items-center justify-center rounded-full bg-primary"
          activeOpacity={0.8}
        >
          <Animated.View
        style={{
              transform: [{ rotate: rotateInterpolate }],
        }}
      >
            <Ionicons name="add" size={28} color="#fff" />
          </Animated.View>
      </TouchableOpacity>
      </View>
    </View>
  );
}
