import { useMemo, useState, useCallback, useEffect } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  Share,
  ActivityIndicator,
  RefreshControl,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useRouter, useLocalSearchParams, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { CustomText } from '@components/ui/CustomText';
import CustomButton from '@components/ui/CustomButton';
import { useTheme } from '@components/context/ThemeContext';
import MapView from '@components/MapView';
import { useGetTripQuery, useTripUpdatesSubscription, useUpdateTripMutation } from '@api';
import Colors from '@constants/Colors';
import FloatingChatInput from '@components/ui/FloatingChatInput';

export default function TripDetailScreen() {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams();
  const tripId = useMemo(() => (Array.isArray(id) ? id[0] : id) as string, [id]);
  const [refreshing, setRefreshing] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  // Listen to keyboard show/hide events
  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', (e) => {
      setKeyboardHeight(e.endCoordinates.height);
    });
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardHeight(0);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);
  
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

  const { data: tripUpdateData } = useTripUpdatesSubscription({
    variables: { tripId },
    skip: !tripId, // Subscribe to all trip updates (not just when pending)
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

    const update = tripUpdateData.tripUpdates;
    console.log('[TripDetails] Received trip update:', update);
    
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
  }, [tripUpdateData?.tripUpdates, refetch]);

  // Auto-refresh if trip is pending (every 3 seconds) - backup in case subscription fails
  useEffect(() => {
    if (!isPending) return;
    
    const interval = setInterval(() => {
      refetch();
    }, 3000); // Refresh every 3 seconds while pending

    return () => clearInterval(interval);
  }, [isPending, refetch]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refetch();
    } finally {
      setRefreshing(false);
    }
  }, [refetch]);

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

  const handleShare = async () => {
    try {
      await Share.share({
        message: t('plan.shareMessage', {
          destination: trip.destination || '',
          startDate: trip.startDate || '',
          endDate: trip.endDate || '',
        }),
        title: trip.destination || t('plan.title'),
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
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

  const location = trip?.coordinates ? { coords: trip.coordinates } : undefined;

  return (
    <KeyboardAvoidingView 
      className="flex-1 bg-white dark:bg-black"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <Stack.Screen
        options={{
          title: (trip?.destination as string) || t('plan.viewPlan'),
          headerShown: true,
          headerRight: () => (
            <View className="flex-row items-center">
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
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Map View */}
        {showMap && location && (
          <View className="h-64 bg-gray-100 dark:bg-neutral-900">
            <MapView location={location as any} />
          </View>
        )}

        <View className="px-6 py-4">
          {/* Pending Status Banner with Workflow Progress - Show when pending OR when we have subscription data */}
          {(trip?.status === 'pending' || (workflowStatus && currentStep !== null)) && (
            <View className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-2xl p-4 mb-4">
              <View className="flex-row items-start">
                <ActivityIndicator 
                  size="small" 
                  color={isDark ? '#fbbf24' : '#f59e0b'} 
                  style={{ marginRight: 12 }}
                  animating={workflowStatus !== 'completed'}
                />
                <View className="flex-1">
                  {/* Title from subscription or fallback */}
                  <CustomText weight="bold" className="text-base text-yellow-800 dark:text-yellow-200 mb-1">
                    {workflowTitle || t('plan.form.processing')}
                  </CustomText>
                  
                  {/* Message from subscription or fallback */}
                  <CustomText className="text-sm text-yellow-700 dark:text-yellow-300 mb-2">
                    {workflowMessage || t('plan.form.waitingMessage')}
                  </CustomText>
                  
                  {/* Workflow Progress Bar - Show when we have step data from subscription */}
                  {currentStep !== null && totalSteps !== null && (
                    <View className="mt-2">
                      <View className="flex-row items-center justify-between mb-1">
                        <CustomText className="text-xs text-yellow-700 dark:text-yellow-300">
                          {t('plan.form.step')} {currentStep} {t('common.of')} {totalSteps}
                        </CustomText>
                        <CustomText className="text-xs text-yellow-700 dark:text-yellow-300">
                          {Math.round((currentStep / totalSteps) * 100)}%
                        </CustomText>
                      </View>
                      <View className="h-2 bg-yellow-200 dark:bg-yellow-800 rounded-full overflow-hidden">
                        <View
                          className="h-full bg-yellow-500 dark:bg-yellow-400 rounded-full transition-all"
                          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                        />
                      </View>
                    </View>
                  )}
                  
                  {/* Show subscription status if available */}
                  {workflowStatus && (
                    <CustomText className="text-xs text-yellow-600 dark:text-yellow-400 mt-2 italic">
                      {workflowStatus === 'completed' ? t('plan.form.generated') : workflowStatus}
                    </CustomText>
                  )}
                </View>
              </View>
            </View>
          )}

          {/* Trip Info */}
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
            <View className="flex-row items-center mb-2">
              <Ionicons
                name="people-outline"
                size={16}
                color={isDark ? '#9ca3af' : '#6b7280'}
              />
              <CustomText className="text-sm text-gray-600 dark:text-gray-400 ml-2">
                {trip?.travelers} {trip?.travelers === 1 ? t('tripDetail.traveler') : t('tripDetail.travelers')}
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
          </View>

          {/* AI Reasoning */}
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
            <CustomText className="text-base text-gray-700 dark:text-gray-300 leading-6">
              {trip?.aiReasoning || '—'}
            </CustomText>
          </View>

          {/* Itinerary Timeline */}
          {(trip?.itinerary && trip.itinerary.length > 0) && (
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
                
                {(trip.itinerary as any[]).map((day: any, index: number) => (
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
          )}
          
        </View>
      </ScrollView>
      
      {/* Floating Chat Input - Adjusts with keyboard */}
      <View 
        className="absolute left-0 right-0 bg-white dark:bg-black border-t border-gray-200 dark:border-neutral-800"
        style={{ 
          bottom: keyboardHeight > 0 ? keyboardHeight : 0,
          paddingBottom: keyboardHeight > 0 ? 0 : insets.bottom,
        }}
      >
        <FloatingChatInput
          onSend={handleChatSend}
          placeholder={t('plan.form.chatPlaceholder') || "Ask AI to update your trip..."}
          disabled={updatingTrip || trip?.status === 'pending'}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

