import { useMemo, useState, useCallback, useEffect } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useRouter, useLocalSearchParams, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { CustomText } from '@ui/display';
import { ProgressBar } from '@ui/feedback';
import { CustomButton } from '@ui/forms';
import { useTheme } from '@ui/context';
import { TabBar } from '@ui/layout';
import { MapView } from '@ui/maps';
import { useGetTripQuery, useTripUpdatesSubscription, useUpdateTripMutation } from '@api';
import Colors from '@constants/Colors';
import { FloatingChatInput } from '@ui/chat';
import { ShareModal, ConvertToHostedModal } from '@ui/modals';
import { useKeyboardInsets } from '@hooks/useKeyboardInsets';
import { useMessagingActions } from '@hooks/useMessagingActions';
import { useAppSelector } from '@state/hooks';

export default function TripDetailScreen() {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams();
  const tripId = useMemo(() => (Array.isArray(id) ? id[0] : id) as string, [id]);
  const [refreshing, setRefreshing] = useState(false);
  const { keyboardHeight, keyboardHeightState } = useKeyboardInsets();
  const { openTripChat } = useMessagingActions();
  const { user } = useAppSelector(state => state.auth);
  
  // Use cache-first for offline support, with skip if no tripId
  const { data, loading, error, refetch } = useGetTripQuery({
    variables: { id: tripId },
    skip: !tripId,
    fetchPolicy: 'cache-and-network', // Try cache first, then network
    errorPolicy: 'all', // Return partial data even on error
  });
  
  const trip = data?.getTrip as any;
  const showMap = !!trip?.coordinates;
  const isPending = trip?.status === 'pending';

  // Subscribe to trip-specific updates (workflow progress)
  const [currentStep, setCurrentStep] = useState<number | null>(null);
  const [totalSteps, setTotalSteps] = useState<number | null>(null);
  const [workflowMessage, setWorkflowMessage] = useState<string | null>(null);
  const [workflowTitle, setWorkflowTitle] = useState<string | null>(null);
  const [workflowStatus, setWorkflowStatus] = useState<string | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showConvertToHostedModal, setShowConvertToHostedModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'details' | 'host'>('overview');

  const { data: tripUpdateData } = useTripUpdatesSubscription({
    variables: { tripId },
    skip: !tripId,
    onError: (error) => {
      console.error('[TripDetails] Subscription error:', error);
    },
  });

  const [updateTrip, { loading: updatingTrip }] = useUpdateTripMutation({
    onCompleted: () => {
      // Refetch trip data after update
      refetch();
    },
  });

  // Handle trip updates from subscription - always update state when subscription data arrives
  useEffect(() => {
    if (!tripUpdateData?.tripUpdates) return;

    const update = tripUpdateData.tripUpdates as any;
    // Filter: ensure this update belongs to the current trip
    if (!update?.tripId || String(update.tripId) !== String(tripId)) {
      return;
    }
    
    // Always update state with subscription data
    setCurrentStep(update.step);
    setTotalSteps(update.totalSteps);
    setWorkflowMessage(update.message);
    setWorkflowTitle(update.title);
    setWorkflowStatus(update.status);
    
    // If workflow is completed, refetch trip data to get updated status
    if (update.status === 'completed') {
      setTimeout(() => {
        refetch();
        // Clear workflow state after a delay to show completion message
        setTimeout(() => {
          setCurrentStep(null);
          setTotalSteps(null);
          setWorkflowMessage(null);
          setWorkflowTitle(null);
          setWorkflowStatus(null);
        }, 2000);
      }, 500);
    }
    
    // If workflow has error, keep showing error state (don't auto-clear)
    // User can retry or dismiss manually
  }, [tripUpdateData?.tripUpdates, refetch, tripId]);

  // Auto-refresh if trip is pending (every 3 seconds) - backup in case subscription fails
  useEffect(() => {
    if (!isPending) return;
    
    const interval = setInterval(() => {
      refetch();
    }, 3000); // Refresh every 3 seconds while pending

    return () => clearInterval(interval);
  }, [isPending, refetch, tripId]);

  // When tripId changes or page loads, ensure we refetch if trip is pending
  // This catches any missed workflow updates if subscription wasn't connected yet
  useEffect(() => {
    if (!tripId) return;
    
    // Small delay to ensure subscription has time to connect
    const timer = setTimeout(() => {
      if (trip?.status === 'pending') {
        refetch();
      }
    }, 1000); // 1 second delay to allow subscription to connect

    return () => clearTimeout(timer);
  }, [tripId, trip?.status, refetch]); // Run when tripId changes or trip status changes

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refetch();
    } finally {
      setRefreshing(false);
    }
  }, [refetch]);

  const handleMapPress = useCallback(() => {
    if (tripId) {
      router.push(`/(app)/(trips)/${tripId}/map`);
    }
  }, [router, tripId]);

  const handleGroupChat = useCallback(() => {
    if (!tripId) return;
    openTripChat(tripId);
  }, [openTripChat, tripId]);

  // Prepare waypoints for the map preview (safely handle null/undefined/empty)
  // MUST be before early returns to follow Rules of Hooks
  const waypoints = useMemo(() => {
    if (!trip?.waypoints || !Array.isArray(trip.waypoints) || trip.waypoints.length === 0) {
      return [];
    }
    // Filter out invalid waypoints and map to valid format
    return trip.waypoints
      .filter((wp: any) => wp && typeof wp.latitude === 'number' && typeof wp.longitude === 'number' && !isNaN(wp.latitude) && !isNaN(wp.longitude))
      .map((wp: any) => ({
        latitude: wp.latitude,
        longitude: wp.longitude,
        label: wp.label || undefined,
      }));
  }, [trip?.waypoints]);

  // Animated style for floating input positioning - MUST be before early returns
  const floatingInputStyle = useAnimatedStyle(() => {
    const height = keyboardHeight.value;
    // When keyboard is visible, position input just above keyboard
    // When keyboard is hidden, position at bottom with safe area
    return {
      bottom: height > 0 ? height : insets.bottom,
    };
  });

  // Loading state
  if (loading && !trip) {
    return (
      <View className="flex-1 bg-white dark:bg-black">
        <Stack.Screen
          options={{
            title: t('plan.viewPlan'),
            headerShown: true,
          }}
        />
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={isDark ? Colors.dark.primary : Colors.light.primary} />
          <CustomText className="text-gray-600 dark:text-gray-400 mt-4">
            {t('common.loading')}
          </CustomText>
        </View>
      </View>
    );
  }

  // Error state
  if (error && !trip) {
    return (
      <View className="flex-1 bg-white dark:bg-black">
        <Stack.Screen
          options={{
            title: t('plan.viewPlan'),
            headerShown: true,
          }}
        />
        <ScrollView 
          className="flex-1 px-6 py-12"
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
          <View className="items-center">
            <Ionicons name="warning-outline" size={64} color="#ef4444" />
            <CustomText weight="bold" className="text-lg text-gray-800 dark:text-gray-300 mt-4 mb-2 text-center">
              {t('common.error')}
            </CustomText>
            <CustomText className="text-base text-gray-600 dark:text-gray-400 text-center mb-4">
              {(error as any)?.message || t('plan.errors.loadFailed')}
            </CustomText>
            <CustomButton
              title={t('common.retry')}
              onPress={onRefresh}
              IconLeft={() => (
                <Ionicons name="refresh" size={20} color="#fff" style={{ marginRight: 8 }} />
              )}
            />
          </View>
        </ScrollView>
      </View>
    );
  }

  // No trip data
  if (!trip && !loading) {
    return (
      <View className="flex-1 bg-white dark:bg-black">
        <Stack.Screen
          options={{
            title: t('plan.viewPlan'),
            headerShown: true,
          }}
        />
        <View className="flex-1 items-center justify-center px-6">
          <Ionicons name="document-outline" size={64} color={isDark ? '#4b5563' : '#d1d5db'} />
          <CustomText weight="bold" className="text-lg text-gray-800 dark:text-gray-300 mt-4 mb-2 text-center">
            {t('plan.notFound')}
          </CustomText>
          <CustomText className="text-base text-gray-600 dark:text-gray-400 text-center mb-4">
            {t('plan.tripNotFound')}
          </CustomText>
          <CustomButton
            title={t('common.back')}
            onPress={() => router.back()}
            bgVariant="secondary"
          />
        </View>
      </View>
    );
  }

  const handleChatSend = async (message: string) => {
    if (!tripId || !message.trim()) return;

    try {
      await updateTrip({
        variables: {
          id: tripId,
          input: {
            userMessage: message,
          },
        },
      });
      
      // Show workflow progress banner
      setCurrentStep(1);
      setTotalSteps(3);
      setWorkflowTitle(t('plan.form.processing'));
      setWorkflowMessage(t('plan.form.waitingMessage'));
      setWorkflowStatus('processing');
    } catch (error: any) {
      console.error('Error sending chat message:', error);
      Alert.alert(
        t('common.error'),
        error?.message || t('plan.form.errors.generateFailed')
      );
    }
  };

  const handleShare = () => {
    setShowShareModal(true);
  };

  const handleDelete = () => {
    Alert.alert(
      t('plan.deletePlan'),
      t('plan.deleteConfirm'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.delete'),
          style: 'destructive',
          onPress: () => {
            router.back();
          },
        },
      ]
    );
  };

  const handleMakePublic = () => {
    setShowConvertToHostedModal(true);
  };

  const handleConvertToHosted = async (data: {
    price?: number;
    currency: string;
    maxParticipants?: number;
    minParticipants: number;
    joinPolicy: 'OPEN' | 'REQUEST' | 'INVITE_ONLY';
    description?: string;
    hostIntro?: string;
  }) => {
    try {
      await updateTrip({
        variables: {
          id: tripId,
          input: {
            isHosted: true,
            location: trip?.location || trip?.destination || undefined,
            price: data.price,
            currency: data.currency,
            maxParticipants: data.maxParticipants,
            minParticipants: data.minParticipants,
            joinPolicy: data.joinPolicy,
            description: data.description,
            hostIntro: data.hostIntro,
            isActive: true,
          },
        },
      });
      setShowConvertToHostedModal(false);
      // Show success message
      Alert.alert(
        t('common.success'),
        t('tripDetail.convertToTourSuccess', { defaultValue: 'Your trip has been converted to a public hosted trip!' })
      );
    } catch (error: any) {
      console.error('Error converting trip to hosted:', error);
      Alert.alert(
        t('common.error'),
        error?.message || t('tripDetail.convertToTourError', { defaultValue: 'Failed to convert trip. Please try again.' })
      );
      throw error; // Re-throw so modal can handle it
    }
  };

  const location = trip?.coordinates ? { coords: trip.coordinates } : undefined;

  // Render content based on active tab for hosted trips
  const renderTabContent = () => {
    if (!trip?.isHosted || isPending) {
      // Show default content for non-hosted trips or pending trips
      return null;
    }

    if (activeTab === 'overview') {
      // Overview tab - show basic trip info, itinerary, AI reasoning
      return null; // Will be rendered in default flow
    }

    if (activeTab === 'details') {
      // Details tab - show hosted trip specific details
      return (
        <>
          {/* Price & Capacity */}
          <View className="bg-gray-50 dark:bg-neutral-900 rounded-2xl p-4 mb-4">
            <View className="flex-row items-center mb-3">
              <Ionicons
                name="cash-outline"
                size={20}
                color={isDark ? Colors.dark.primary : Colors.light.primary}
              />
              <CustomText
                weight="bold"
                className="text-base text-black dark:text-white ml-2"
              >
                {t('tripDetail.hosted.priceAndCapacity', { defaultValue: 'Price & Capacity' })}
              </CustomText>
            </View>
            {trip.price && (
              <View className="flex-row items-center mb-2">
                <Ionicons
                  name="wallet-outline"
                  size={16}
                  color={isDark ? '#9ca3af' : '#6b7280'}
                />
                <CustomText className="text-sm text-gray-600 dark:text-gray-400 ml-2">
                  {trip.price} {trip.currency || 'USD'} {t('tripDetail.hosted.perPerson', { defaultValue: 'per person' })}
                </CustomText>
              </View>
            )}
            <View className="flex-row items-center mb-2">
              <Ionicons
                name="people-outline"
                size={16}
                color={isDark ? '#9ca3af' : '#6b7280'}
              />
              <CustomText className="text-sm text-gray-600 dark:text-gray-400 ml-2">
                {trip.minParticipants || 1} - {trip.maxParticipants || t('tripDetail.hosted.unlimited', { defaultValue: 'Unlimited' })} {t('tripDetail.hosted.participants', { defaultValue: 'participants' })}
              </CustomText>
            </View>
            {trip.duration && (
              <View className="flex-row items-center">
                <Ionicons
                  name="time-outline"
                  size={16}
                  color={isDark ? '#9ca3af' : '#6b7280'}
                />
                <CustomText className="text-sm text-gray-600 dark:text-gray-400 ml-2">
                  {trip.duration} {trip.durationType || 'days'}
                </CustomText>
              </View>
            )}
          </View>

          {/* Description */}
          {trip.description && (
            <View className="mb-4">
              <CustomText
                weight="bold"
                className="text-base text-black dark:text-white mb-2"
              >
                {t('tripDetail.hosted.description', { defaultValue: 'Description' })}
              </CustomText>
              <CustomText className="text-base text-gray-700 dark:text-gray-300 leading-6">
                {trip.description}
              </CustomText>
            </View>
          )}

          {/* Highlights */}
          {trip.highlights && Array.isArray(trip.highlights) && trip.highlights.length > 0 && (
            <View className="mb-4">
              <CustomText
                weight="bold"
                className="text-base text-black dark:text-white mb-2"
              >
                {t('tripDetail.hosted.highlights', { defaultValue: 'Highlights' })}
              </CustomText>
              {trip.highlights.map((highlight: string, index: number) => (
                <View key={index} className="flex-row items-start mb-2">
                  <Ionicons
                    name="star"
                    size={16}
                    color={isDark ? Colors.dark.primary : Colors.light.primary}
                    style={{ marginTop: 2, marginRight: 8 }}
                  />
                  <CustomText className="text-sm text-gray-700 dark:text-gray-300 flex-1">
                    {highlight}
                  </CustomText>
                </View>
              ))}
            </View>
          )}

          {/* Inclusions */}
          {trip.inclusions && Array.isArray(trip.inclusions) && trip.inclusions.length > 0 && (
            <View className="mb-4">
              <CustomText
                weight="bold"
                className="text-base text-black dark:text-white mb-2"
              >
                {t('tripDetail.hosted.inclusions', { defaultValue: 'What\'s Included' })}
              </CustomText>
              {trip.inclusions.map((inclusion: string, index: number) => (
                <View key={index} className="flex-row items-start mb-2">
                  <Ionicons
                    name="checkmark-circle"
                    size={16}
                    color={isDark ? Colors.dark.primary : Colors.light.primary}
                    style={{ marginTop: 2, marginRight: 8 }}
                  />
                  <CustomText className="text-sm text-gray-700 dark:text-gray-300 flex-1">
                    {inclusion}
                  </CustomText>
                </View>
              ))}
            </View>
          )}

          {/* Category & Difficulty */}
          {(trip.category || trip.difficulty) && (
            <View className="bg-gray-50 dark:bg-neutral-900 rounded-2xl p-4 mb-4">
              <View className="flex-row items-center mb-3">
                <Ionicons
                  name="information-circle-outline"
                  size={20}
                  color={isDark ? Colors.dark.primary : Colors.light.primary}
                />
                <CustomText
                  weight="bold"
                  className="text-base text-black dark:text-white ml-2"
                >
                  {t('tripDetail.hosted.tripInfo', { defaultValue: 'Trip Information' })}
                </CustomText>
              </View>
              {trip.category && (
                <View className="flex-row items-center mb-2">
                  <Ionicons
                    name="pricetag-outline"
                    size={16}
                    color={isDark ? '#9ca3af' : '#6b7280'}
                  />
                  <CustomText className="text-sm text-gray-600 dark:text-gray-400 ml-2">
                    {t('tripDetail.hosted.category', { defaultValue: 'Category' })}: {trip.category}
                  </CustomText>
                </View>
              )}
              {trip.difficulty && (
                <View className="flex-row items-center">
                  <Ionicons
                    name="fitness-outline"
                    size={16}
                    color={isDark ? '#9ca3af' : '#6b7280'}
                  />
                  <CustomText className="text-sm text-gray-600 dark:text-gray-400 ml-2">
                    {t('tripDetail.hosted.difficulty', { defaultValue: 'Difficulty' })}: {trip.difficulty}
                  </CustomText>
                </View>
              )}
            </View>
          )}
        </>
      );
    }

    if (activeTab === 'host') {
      // Host tab - show host intro, join policy, booking instructions
      return (
        <>
          {/* Host Introduction */}
          {trip.hostIntro && (
            <View className="mb-4">
              <CustomText
                weight="bold"
                className="text-base text-black dark:text-white mb-2"
              >
                {t('tripDetail.hosted.hostIntro', { defaultValue: 'About the Host' })}
              </CustomText>
              <CustomText className="text-base text-gray-700 dark:text-gray-300 leading-6">
                {trip.hostIntro}
              </CustomText>
            </View>
          )}

          {/* Join Policy */}
          <View className="bg-gray-50 dark:bg-neutral-900 rounded-2xl p-4 mb-4">
            <View className="flex-row items-center mb-3">
              <Ionicons
                name="people-circle-outline"
                size={20}
                color={isDark ? Colors.dark.primary : Colors.light.primary}
              />
              <CustomText
                weight="bold"
                className="text-base text-black dark:text-white ml-2"
              >
                {t('tripDetail.hosted.joinPolicy', { defaultValue: 'Join Policy' })}
              </CustomText>
            </View>
            <View className="flex-row items-center">
              <Ionicons
                name={trip.joinPolicy === 'OPEN' ? 'lock-open-outline' : trip.joinPolicy === 'REQUEST' ? 'mail-outline' : 'lock-closed-outline'}
                size={16}
                color={isDark ? '#9ca3af' : '#6b7280'}
              />
              <CustomText className="text-sm text-gray-600 dark:text-gray-400 ml-2">
                {trip.joinPolicy === 'OPEN' 
                  ? t('tripDetail.hosted.joinPolicy.open', { defaultValue: 'Open - Anyone can join' })
                  : trip.joinPolicy === 'REQUEST'
                  ? t('tripDetail.hosted.joinPolicy.request', { defaultValue: 'Request - Users must request to join' })
                  : t('tripDetail.hosted.joinPolicy.invite_only', { defaultValue: 'Invite Only - Only invited users can join' })
                }
              </CustomText>
            </View>
          </View>

          {/* Booking Instructions */}
          {trip.bookingInstructions && (
            <View className="mb-4">
              <CustomText
                weight="bold"
                className="text-base text-black dark:text-white mb-2"
              >
                {t('tripDetail.hosted.bookingInstructions', { defaultValue: 'Booking Instructions' })}
              </CustomText>
              <CustomText className="text-base text-gray-700 dark:text-gray-300 leading-6">
                {trip.bookingInstructions}
              </CustomText>
            </View>
          )}

          {/* External Booking URL */}
          {trip.externalBookingUrl && (
            <View className="mb-4">
              <CustomButton
                title={t('tripDetail.hosted.bookNow', { defaultValue: 'Book Now' })}
                onPress={() => {
                  // Open external booking URL
                  // You might want to use Linking.openURL here
                }}
                IconLeft={() => (
                  <Ionicons
                    name="calendar-outline"
                    size={16}
                    color="#fff"
                    style={{ marginRight: 8 }}
                  />
                )}
              />
            </View>
          )}
        </>
      );
    }

    return null;
  };

  return (
    <View className="flex-1 bg-white dark:bg-black">
      <Stack.Screen
        options={{
          title: (trip?.destination as string) || t('plan.viewPlan'),
          headerShown: true,
          headerRight: () => (
            <View className="flex-row items-center">
              {showMap && (
                <TouchableOpacity onPress={handleMapPress} className="p-2">
                  <Ionicons name="map-outline" size={22} color={isDark ? '#fff' : '#000'} />
                </TouchableOpacity>
              )}
              {/* Make Public / Convert to Tour button - only show if trip is not already hosted and user owns the trip */}
              {trip && !trip.isHosted && user?.id && trip.userId === user.id && (
                <TouchableOpacity onPress={handleMakePublic} className="p-2">
                  <Ionicons name="globe-outline" size={22} color={isDark ? '#fff' : '#000'} />
                </TouchableOpacity>
              )}
              <TouchableOpacity onPress={handleShare} className="p-2">
                <Ionicons name="share-outline" size={22} color={isDark ? '#fff' : '#000'} />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleDelete} className="p-2">
                <Ionicons name="trash-outline" size={22} color="#ef4444" />
              </TouchableOpacity>
            </View>
          ),
        }}
      />

      <ScrollView 
        className="flex-1"
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: keyboardHeightState > 0 ? keyboardHeightState + 80 : 100 }}
        showsVerticalScrollIndicator={true}
      >
        {/* Map View */}
        {showMap && location && (
          <View className="h-64 bg-gray-100 dark:bg-neutral-900">
            <MapView 
              location={location as any} 
              waypoints={waypoints && waypoints.length > 0 ? waypoints : undefined}
              showControls={false}
              autoCenter={true}
            />
          </View>
        )}

        <View className="px-6 py-4">
          {/* Tabs for Hosted Trips */}
          {trip?.isHosted && !isPending && (
            <View className="mb-4">
              <TabBar
                tabs={[
                  { id: 'overview', label: t('tripDetail.tabs.overview', { defaultValue: 'Overview' }), translationKey: 'tripDetail.tabs.overview' },
                  { id: 'details', label: t('tripDetail.tabs.details', { defaultValue: 'Details' }), translationKey: 'tripDetail.tabs.details' },
                  { id: 'host', label: t('tripDetail.tabs.host', { defaultValue: 'Host' }), translationKey: 'tripDetail.tabs.host' },
                ]}
                activeTab={activeTab}
                onTabChange={(tabId) => setActiveTab(tabId as 'overview' | 'details' | 'host')}
                variant="segmented"
              />
            </View>
          )}

          {/* Pending Status Banner with Workflow Progress - Show when pending OR when we have subscription data */}
          {(trip?.status === 'pending' || (workflowStatus && currentStep !== null)) && (
            <View className={`rounded-2xl p-4 mb-4 ${
              workflowStatus === 'error' 
                ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
                : 'bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800'
            }`}>
              <View className="flex-row items-start">
                {workflowStatus === 'error' ? (
                  <Ionicons 
                    name="alert-circle" 
                    size={20} 
                    color={isDark ? '#f87171' : '#dc2626'} 
                    style={{ marginRight: 12, marginTop: 2 }}
                  />
                ) : (
                  <ActivityIndicator 
                    size="small" 
                    color={isDark ? '#fbbf24' : '#f59e0b'} 
                    style={{ marginRight: 12 }}
                    animating={workflowStatus !== 'completed' && workflowStatus !== 'error'}
                  />
                )}
                <View className="flex-1" style={{ flexShrink: 1 }}>
                  {/* Title from subscription or fallback - Full text, no cropping */}
                  <CustomText 
                    weight="bold" 
                    className={`text-base mb-1 ${
                      workflowStatus === 'error'
                        ? 'text-red-800 dark:text-red-200'
                        : 'text-yellow-800 dark:text-yellow-200'
                    }`}
                  >
                    {workflowTitle || t('plan.form.processing')}
                  </CustomText>
                  
                  {/* Message from subscription or fallback - Full text, no cropping */}
                  <CustomText 
                    className={`text-sm mb-2 ${
                      workflowStatus === 'error'
                        ? 'text-red-700 dark:text-red-300'
                        : 'text-yellow-700 dark:text-yellow-300'
                    }`}
                  >
                    {workflowMessage || t('plan.form.waitingMessage')}
                  </CustomText>
                  
                  {/* Workflow Progress Bar - Show when we have step data from subscription and not error */}
                  {currentStep !== null && totalSteps !== null && workflowStatus !== 'error' && (
                    <View className="mt-2">
                      <ProgressBar
                        current={currentStep}
                        total={totalSteps}
                        showLabel
                        color={isDark ? '#fbbf24' : '#f59e0b'}
                        />
                    </View>
                  )}
                  
                  {/* Show subscription status if available */}
                  {workflowStatus && workflowStatus !== 'error' && (
                    <CustomText className={`text-xs mt-2 italic ${
                      workflowStatus === 'completed' 
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-yellow-600 dark:text-yellow-400'
                    }`}>
                      {workflowStatus === 'completed' ? t('plan.form.generated') : workflowStatus}
                    </CustomText>
                  )}
                  
                  {/* Error action button */}
                  {workflowStatus === 'error' && (
                    <TouchableOpacity
                      onPress={onRefresh}
                      className="mt-3 bg-red-600 dark:bg-red-700 px-4 py-2 rounded-lg self-start"
                    >
                      <CustomText className="text-white text-sm font-semibold">
                        {t('common.retry')}
                      </CustomText>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </View>
          )}

          {/* Tab Content for Hosted Trips */}
          {trip?.isHosted && !isPending && activeTab !== 'overview' && (
            <View className="mb-4">
              {renderTabContent()}
            </View>
          )}

          {/* Trip Info - Show in overview tab for hosted trips, always for non-hosted */}
          {(!trip?.isHosted || activeTab === 'overview' || isPending) && (
          <View className="bg-gray-50 dark:bg-neutral-900 rounded-2xl p-4 mb-4">
            <View className="flex-row items-center mb-3">
              <Ionicons
                name="information-circle"
                size={20}
                color={isDark ? Colors.dark.primary : Colors.light.primary}
              />
              <CustomText
                weight="bold"
                className="text-base text-black dark:text-white ml-2"
              >
                {t('tripDetail.tripDetails')}
              </CustomText>
            </View>
            {isPending ? (
              // Placeholder for trip info when pending (workflow is running)
              <>
                <View className="flex-row items-center mb-2">
                  <View className="w-4 h-4 rounded bg-gray-300 dark:bg-neutral-700" />
                  <View className="ml-2 flex-1 h-4 bg-gray-300 dark:bg-neutral-700 rounded" style={{ width: '60%' }} />
                </View>
                <View className="flex-row items-center mb-2">
                  <View className="w-4 h-4 rounded bg-gray-300 dark:bg-neutral-700" />
                  <View className="ml-2 flex-1 h-4 bg-gray-300 dark:bg-neutral-700 rounded" style={{ width: '50%' }} />
                </View>
                <View className="flex-row items-center">
                  <View className="w-4 h-4 rounded bg-gray-300 dark:bg-neutral-700" />
                  <View className="ml-2 flex-1 h-4 bg-gray-300 dark:bg-neutral-700 rounded" style={{ width: '70%' }} />
                </View>
              </>
            ) : (
              <>
            <View className="flex-row items-center mb-2">
              <Ionicons
                name="people-outline"
                size={16}
                color={isDark ? '#9ca3af' : '#6b7280'}
              />
              <CustomText className="text-sm text-gray-600 dark:text-gray-400 ml-2">
                    {trip?.travelers || 1} {trip?.travelers === 1 ? t('tripDetail.traveler') : t('tripDetail.travelers')}
              </CustomText>
            </View>
            <View className="flex-row items-center mb-2">
              <Ionicons
                name="wallet-outline"
                size={16}
                color={isDark ? '#9ca3af' : '#6b7280'}
              />
              <CustomText className="text-sm text-gray-600 dark:text-gray-400 ml-2">
                {trip?.budget ? `$${trip.budget}` : '—'} {t('tripDetail.budget')}
              </CustomText>
            </View>
            <View className="flex-row items-center">
              <Ionicons
                name="heart-outline"
                size={16}
                color={isDark ? '#9ca3af' : '#6b7280'}
              />
              <CustomText className="text-sm text-gray-600 dark:text-gray-400 ml-2">
                {trip?.preferences || '—'}
              </CustomText>
            </View>
              </>
            )}
          </View>
          )}

          {tripId && (
            <View className="mb-4">
              <CustomButton
                title={t('messages.groupChatButton') || 'Group chat'}
                onPress={handleGroupChat}
                IconLeft={() => (
                  <Ionicons
                    name="chatbubble-ellipses-outline"
                    size={16}
                    color="#fff"
                    style={{ marginRight: 8 }}
                  />
                )}
              />
            </View>
          )}

          {/* AI Reasoning - Show in overview tab for hosted trips, always for non-hosted */}
          {(!trip?.isHosted || activeTab === 'overview' || isPending) && (
          <View className="mb-4">
            <View className="flex-row items-center mb-3">
              <Ionicons
                name="sparkles"
                size={20}
                color={isDark ? Colors.dark.primary : Colors.light.primary}
              />
              <CustomText
                weight="bold"
                className="text-base text-black dark:text-white ml-2"
              >
                {t('tripDetail.aiReasoning')}
              </CustomText>
            </View>
            {isPending ? (
              // Placeholder for AI reasoning when pending (workflow is running)
              <View>
                <View className="h-4 bg-gray-300 dark:bg-neutral-700 rounded mb-2" style={{ width: '100%' }} />
                <View className="h-4 bg-gray-300 dark:bg-neutral-700 rounded mb-2" style={{ width: '95%' }} />
                <View className="h-4 bg-gray-300 dark:bg-neutral-700 rounded mb-2" style={{ width: '85%' }} />
                <View className="h-4 bg-gray-300 dark:bg-neutral-700 rounded" style={{ width: '90%' }} />
              </View>
            ) : (
            <CustomText className="text-base text-gray-700 dark:text-gray-300 leading-6">
              {trip?.aiReasoning || '—'}
            </CustomText>
            )}
          </View>
          )}

          {/* Itinerary Timeline - Show in overview tab for hosted trips, always for non-hosted */}
          {(!trip?.isHosted || activeTab === 'overview' || isPending) && (
            isPending ? (
            // Placeholder for itinerary when pending (workflow is running)
            <View className="mb-4">
              <CustomText
                weight="bold"
                className="text-lg text-black dark:text-white mb-4"
              >
                {t('tripDetail.itinerary')}
              </CustomText>
              
              {/* Timeline Placeholder */}
              <View className="relative">
                {/* Timeline Line */}
                <View 
                  className="absolute left-4 top-0 bottom-0 w-0.5"
                  style={{ backgroundColor: isDark ? '#374151' : '#e5e7eb' }}
                />
                
                {/* Placeholder Day 1 */}
                <View className="flex-row mb-6">
                  <View className="relative mr-4">
                    <View 
                      className="w-8 h-8 rounded-full border-2 items-center justify-center"
                      style={{ 
                        backgroundColor: isDark ? '#000000' : '#ffffff',
                        borderColor: isDark ? '#374151' : '#e5e7eb',
                      }}
                    >
                      <View 
                        className="w-3 h-3 rounded-full bg-gray-300 dark:bg-neutral-700"
                      />
                    </View>
                  </View>
                  <View className="flex-1 pb-4">
                    <View className="bg-gray-50 dark:bg-neutral-900 rounded-2xl p-4">
                      <View className="h-5 bg-gray-300 dark:bg-neutral-700 rounded mb-3" style={{ width: '60%' }} />
                      <View>
                        <View className="h-4 bg-gray-300 dark:bg-neutral-700 rounded mb-2" style={{ width: '90%' }} />
                        <View className="h-4 bg-gray-300 dark:bg-neutral-700 rounded mb-2" style={{ width: '75%' }} />
                        <View className="h-4 bg-gray-300 dark:bg-neutral-700 rounded" style={{ width: '85%' }} />
                      </View>
                    </View>
                  </View>
                </View>
                
                {/* Placeholder Day 2 */}
                <View className="flex-row mb-6">
                  <View className="relative mr-4">
                    <View 
                      className="w-8 h-8 rounded-full border-2 items-center justify-center"
                      style={{ 
                        backgroundColor: isDark ? '#000000' : '#ffffff',
                        borderColor: isDark ? '#374151' : '#e5e7eb',
                      }}
                    >
                      <View 
                        className="w-3 h-3 rounded-full bg-gray-300 dark:bg-neutral-700"
                      />
                    </View>
                  </View>
                  <View className="flex-1 pb-4">
                    <View className="bg-gray-50 dark:bg-neutral-900 rounded-2xl p-4">
                      <View className="h-5 bg-gray-300 dark:bg-neutral-700 rounded mb-3" style={{ width: '55%' }} />
                      <View>
                        <View className="h-4 bg-gray-300 dark:bg-neutral-700 rounded mb-2" style={{ width: '88%' }} />
                        <View className="h-4 bg-gray-300 dark:bg-neutral-700 rounded" style={{ width: '80%' }} />
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          ) : trip?.itinerary && trip.itinerary.length > 0 ? (
            <View className="mb-4">
              <CustomText
                weight="bold"
                className="text-lg text-black dark:text-white mb-4"
              >
                {t('tripDetail.itinerary')}
              </CustomText>
              
              {/* Timeline */}
              <View className="relative">
                {/* Timeline Line */}
                <View 
                  className="absolute left-4 top-0 bottom-0 w-0.5"
                  style={{ backgroundColor: isDark ? '#374151' : '#e5e7eb' }}
                />
                
                {(trip.itinerary as any[]).map((day: any) => (
                  <View key={day.day} className="flex-row mb-6">
                    {/* Timeline Dot */}
                    <View className="relative mr-4">
                      <View 
                        className="w-8 h-8 rounded-full border-2 items-center justify-center"
                        style={{ 
                          backgroundColor: isDark ? '#000000' : '#ffffff',
                          borderColor: isDark ? Colors.dark.primary : Colors.light.primary,
                        }}
                      >
                        <View 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: isDark ? Colors.dark.primary : Colors.light.primary }}
                        />
                      </View>
                    </View>
                    
                    {/* Day Content */}
                    <View className="flex-1 pb-4">
                      <View className="bg-gray-50 dark:bg-neutral-900 rounded-2xl p-4">
                        <CustomText
                          weight="bold"
                          className="text-base text-black dark:text-white mb-2"
                        >
                          {t('tripDetail.day')} {day.day}: {day.title}
                        </CustomText>
                        <View className="mt-2">
                          {(day.activities as string[]).map((activity: string, actIndex: number) => (
                            <View key={actIndex} className="flex-row items-start mb-2">
                              <View 
                                className="w-1.5 h-1.5 rounded-full mt-2 mr-2"
                                style={{ backgroundColor: isDark ? '#6b7280' : '#9ca3af' }}
                              />
                              <CustomText className="text-sm text-gray-700 dark:text-gray-300 flex-1">
                                {activity}
                              </CustomText>
                            </View>
                          ))}
                        </View>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          ) : null
          )}
          
        </View>
      </ScrollView>
      
      {/* Floating Chat Input - Adjusts with keyboard */}
      <Animated.View 
        className="absolute left-0 right-0 border-t border-gray-200 dark:border-neutral-800"
        style={[
          {
            backgroundColor: isDark ? '#000000' : '#ffffff',
            paddingTop: 8,
            paddingBottom: keyboardHeightState > 0 ? 0 : insets.bottom,
          },
          floatingInputStyle,
        ]}
      >
        <FloatingChatInput
          onSend={handleChatSend}
          placeholder={t('plan.form.chatPlaceholder')}
          disabled={updatingTrip || trip?.status === 'pending'}
        />
      </Animated.View>

      {/* Share Modal */}
      <ShareModal
        visible={showShareModal}
        onClose={() => setShowShareModal(false)}
        type="trip"
        relatedId={tripId}
        entityTitle={trip?.destination as string}
      />

      {/* Convert to Hosted Modal */}
      <ConvertToHostedModal
        visible={showConvertToHostedModal}
        onClose={() => setShowConvertToHostedModal(false)}
        onSubmit={handleConvertToHosted}
        initialData={{
          destination: trip?.destination,
          price: trip?.price,
          currency: trip?.currency,
        }}
        loading={updatingTrip}
      />
    </View>
  );
}

