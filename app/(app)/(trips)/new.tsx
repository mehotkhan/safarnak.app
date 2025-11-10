import { useState, useEffect, useCallback } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Platform,
  Keyboard,
  KeyboardAvoidingView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { Stack } from 'expo-router';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import * as Location from 'expo-location';
import { CustomText } from '@components/ui/CustomText';
import InputField from '@components/ui/InputField';
import CustomButton from '@components/ui/CustomButton';
import { useTheme } from '@components/context/ThemeContext';
import { z } from 'zod';
import { useCreateTripMutation, GetTripsDocument } from '@api';
import DatePicker from '@components/ui/DatePicker';
import Divider from '@components/ui/Divider';
import TextArea from '@components/ui/TextArea';
import { parseDate } from '@utils/datetime';

const accommodationTypes = ['hotel', 'hostel', 'apartment', 'camping'];

export default function CreateTripScreen() {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(false);
  const [createTrip] = useCreateTripMutation();
  const keyboardHeight = useSharedValue(0);

  // Location state
  const [currentLocation, setCurrentLocation] = useState<string>('');
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  // Advanced options state
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Listen to keyboard show/hide events with proper platform handling
  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const showSubscription = Keyboard.addListener(showEvent, (e) => {
      keyboardHeight.value = withTiming(e.endCoordinates.height, { duration: 250 });
    });
    const hideSubscription = Keyboard.addListener(hideEvent, () => {
      keyboardHeight.value = withTiming(0, { duration: 250 });
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, [keyboardHeight]);

  const [formData, setFormData] = useState({
    destination: '',
    startDate: '',
    endDate: '',
    description: '',
    preferences: '',
    travelers: '1',
    accommodation: 'hotel',
  });

  // Request location permissions and get current location
  const getCurrentLocation = useCallback(async () => {
    try {
      setLocationLoading(true);
      setLocationError(null);

      // Check if location services are enabled
      const servicesEnabled = await Location.hasServicesEnabledAsync();
      if (!servicesEnabled) {
        setLocationError(t('plan.form.currentLocationError'));
        Alert.alert(
          t('common.error'),
          t('plan.form.locationServicesDisabled') || 'Location services are disabled. Please enable them in settings.'
        );
        return;
      }

      // Request permissions
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLocationError(t('plan.form.currentLocationError'));
        Alert.alert(
          t('common.error'),
          t('plan.form.locationPermissionDenied') || 'Location permission is required to get your current location.'
        );
        return;
      }

      // Get current position with high accuracy (GPS only, no reverse geocoding)
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      // Format coordinates for display (GPS coordinates only, no API calls)
      const lat = location.coords.latitude.toFixed(6);
      const lon = location.coords.longitude.toFixed(6);
      setCurrentLocation(`${lat}, ${lon}`);
    } catch (error: any) {
      console.error('Location error:', error);
      setLocationError(t('plan.form.currentLocationError'));
      Alert.alert(
        t('common.error'),
        error?.message || t('plan.form.currentLocationError')
      );
    } finally {
      setLocationLoading(false);
    }
  }, [t]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Validation schema - only location and description are required
  const schema = z.object({
    destination: z.preprocess((v) => (typeof v === 'string' && v.trim() === '' ? undefined : v), z.string().min(2).optional()),
    startDate: z.preprocess((v) => (typeof v === 'string' && v.trim() === '' ? undefined : v), z.string().regex(/^\d{4}-\d{2}-\d{2}$/, { message: 'dateFormatInvalid' }).optional()),
    endDate: z.preprocess((v) => (typeof v === 'string' && v.trim() === '' ? undefined : v), z.string().regex(/^\d{4}-\d{2}-\d{2}$/, { message: 'dateFormatInvalid' }).optional()),
    description: z.string().min(10, { message: 'descriptionMin' }),
    preferences: z.preprocess((v) => (typeof v === 'string' && v.trim() === '' ? undefined : v), z.string().optional()),
    travelers: z.preprocess((v) => (typeof v === 'string' && v.trim() === '' ? '1' : v), z.string().refine(v => {
      const n = parseInt(v, 10); return Number.isFinite(n) && n >= 1;
    }, { message: 'travelersInvalid' })),
    accommodation: z.enum(['hotel','hostel','apartment','camping']),
  }).refine(values => {
    // Only validate dates if both are provided
    if (values.startDate && values.endDate) {
      const s = parseDate(values.startDate);
      const e = parseDate(values.endDate);
      if (!s.isValid || !e.isValid) return false;
      return e >= s;
    }
    return true;
  }, { message: 'datesInvalid' });

  // Check if form is valid (location and description required)
  const isFormValid = useCallback(() => {
    if (!currentLocation || currentLocation.trim() === '') {
      return false;
    }
    if (!formData.description || formData.description.trim().length < 10) {
      return false;
    }
    // Try to parse the rest of the form to catch any other validation errors
    try {
      schema.parse(formData);
      return true;
    } catch {
      return false;
    }
  }, [currentLocation, formData, schema]);

  const handleSubmit = async () => {
    try {
      // Validate location is required
      if (!currentLocation || currentLocation.trim() === '') {
        Alert.alert(
          t('common.error'),
          t('plan.form.locationRequired') || 'Please get your current location first.'
        );
        return;
      }

      const validated = schema.parse(formData);
      setLoading(true);

      const travelersNum = parseInt(validated.travelers, 10);
      let baseDescription = validated.description.trim();
      
      // Prepend current location if available
      if (currentLocation) {
        baseDescription = `Current Location: ${currentLocation}\n\n${baseDescription}`;
      }

      const optionalPreferences = validated.preferences?.trim();
      const combinedPreferences = optionalPreferences
        ? `${optionalPreferences}\n\n${baseDescription}`
        : baseDescription;

      console.log('Submitting trip with data:', {
        destination: validated.destination,
        startDate: validated.startDate,
        endDate: validated.endDate,
        travelers: travelersNum,
        accommodation: validated.accommodation,
        preferences: combinedPreferences,
        currentLocation,
      });

      // Commit mutation with refetchQueries to update cache
      const res = await createTrip({
        variables: {
          input: {
            destination: validated.destination || undefined,
            startDate: validated.startDate || undefined,
            endDate: validated.endDate || undefined,
            travelers: travelersNum,
            accommodation: validated.accommodation,
            preferences: combinedPreferences,
          },
        },
        // Refetch trips list to show new trip immediately
        refetchQueries: [GetTripsDocument],
        // Wait for refetch to complete before redirecting
        awaitRefetchQueries: true,
      });

      console.log('GraphQL response:', JSON.stringify(res, null, 2));

      const trip = res.data?.createTrip;
      if (trip?.id) {
        // Dismiss keyboard for smooth transition
        Keyboard.dismiss();
        
        // Smooth redirect to trip details page - no alert interruption
        // Use setTimeout to ensure keyboard dismissal completes
        setTimeout(() => {
          router.replace(`/(app)/(trips)/${trip.id}` as any);
        }, 100);
      } else {
        console.log('No trip returned in response');
        throw new Error(t('plan.form.errors.generateFailed'));
      }
    } catch (err: any) {
      console.log('Create trip error:', JSON.stringify(err, null, 2));
      
      // Handle Zod validation errors
      if (err?.issues?.length) {
        const code = err.issues[0].message;
        const map: Record<string,string> = {
          descriptionMin: t('plan.form.errors.descriptionMin'),
          travelersInvalid: t('plan.form.errors.travelersInvalid'),
          datesInvalid: t('plan.form.errors.datesInvalid'),
          startDateRequired: t('plan.form.errors.startDateRequired'),
          endDateRequired: t('plan.form.errors.endDateRequired'),
          dateFormatInvalid: t('plan.form.errors.dateFormatInvalid'),
        };
        Alert.alert(t('common.error'), map[code] || t('plan.form.errors.generic'));
        return;
      }
      
      // Handle GraphQL errors
      const graphQLErrors = err?.graphQLErrors || err?.networkError?.result?.errors || err?.errors;
      if (Array.isArray(graphQLErrors) && graphQLErrors.length > 0) {
        const message = graphQLErrors[0]?.message ?? '';
        console.log('GraphQL error message:', message);
        
        const serverMap: Record<string, string> = {
          'Trip description is required and must be at least 10 characters': t('plan.form.errors.descriptionMin'),
          'Number of travelers must be at least 1': t('plan.form.errors.travelersInvalid'),
          'Not authenticated': t('plan.form.errors.notAuthenticated'),
        };
        
        const translatedMessage = serverMap[message] || message || t('plan.form.errors.generic');
        Alert.alert(t('common.error'), translatedMessage);
        return;
      }
      
      // Handle network errors
      if (err?.networkError) {
        Alert.alert(t('common.error'), t('login.errors.networkError'));
        return;
      }
      
      // Generic fallback
      const errorMessage = err?.message || t('plan.form.errors.generateFailed');
      Alert.alert(t('common.error'), errorMessage);

    } finally {
      setLoading(false);
    }
  };

  const formIsValid = isFormValid();

  // Animated style for floating button positioning
  const floatingButtonStyle = useAnimatedStyle(() => {
    const height = keyboardHeight.value;
    return {
      bottom: height > 0 ? height : 0,
      paddingBottom: height > 0 ? 16 : Math.max(insets.bottom, 16),
    };
  });

  return (
    <KeyboardAvoidingView 
      className="flex-1 bg-white dark:bg-black"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
    >
      <Stack.Screen options={{ title: t('plan.form.title'), headerShown: true }} />

      <ScrollView 
        className="flex-1 px-6 py-4" 
        contentContainerStyle={{ paddingBottom: 120 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Current Location - Compact */}
        <View className="mb-4">
          <View className="flex-row items-center gap-2">
            <View className="flex-1">
              <InputField
                placeholder={locationLoading ? t('plan.form.currentLocationPlaceholder') : currentLocation || t('plan.form.currentLocationPlaceholder')}
                value={currentLocation}
                editable={false}
                icon="location-outline"
              />
            </View>
            <TouchableOpacity
              onPress={getCurrentLocation}
              disabled={locationLoading}
              className={`px-3 py-3 rounded-full justify-center items-center min-w-[48px] ${
                locationLoading
                  ? 'bg-gray-300 dark:bg-neutral-700'
                  : 'bg-primary'
              }`}
            >
              {locationLoading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Ionicons name="locate-outline" size={20} color="#fff" />
              )}
            </TouchableOpacity>
          </View>
          {locationError && (
            <CustomText className="text-sm text-red-500 mt-1">
              {locationError}
            </CustomText>
          )}
        </View>

        {/* Description with Hints */}
        <View className="mb-4">
          <TextArea
            label={t('plan.form.describePlan')}
            value={formData.description}
            onChangeText={text => handleInputChange('description', text)}
            placeholder={t('plan.form.describePlanPlaceholder')}
            rows={8}
          />
          
          {/* Helpful Hints */}
          <View className="mt-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
            <CustomText weight="medium" className="text-sm text-blue-800 dark:text-blue-200 mb-2">
              {t('plan.form.describePlanHints')}
            </CustomText>
            <View>
              <CustomText className="text-xs text-blue-700 dark:text-blue-300 mb-1">
                • {t('plan.form.describePlanHint1')}
              </CustomText>
              <CustomText className="text-xs text-blue-700 dark:text-blue-300 mb-1">
                • {t('plan.form.describePlanHint2')}
              </CustomText>
              <CustomText className="text-xs text-blue-700 dark:text-blue-300 mb-1">
                • {t('plan.form.describePlanHint3')}
              </CustomText>
              <CustomText className="text-xs text-blue-700 dark:text-blue-300">
                • {t('plan.form.describePlanHint4')}
              </CustomText>
            </View>
          </View>

          {/* Voice Recording - Disabled */}
          <View className="mt-3 p-3 bg-gray-100 dark:bg-neutral-800 rounded-xl">
            <View className="flex-row items-center">
              <Ionicons 
                name="mic-off-outline" 
                size={20} 
                color={isDark ? '#9ca3af' : '#6b7280'} 
                style={{ marginRight: 8 }} 
              />
              <CustomText className="text-sm text-gray-500 dark:text-gray-400">
                {t('plan.form.voiceRecord')} ({t('common.disabled')})
              </CustomText>
            </View>
          </View>
        </View>

        {/* Destination (Optional) */}
        <View className="mb-4">
          <View className="flex-row items-center justify-between mb-2">
            <CustomText
              weight="medium"
              className="text-base text-black dark:text-white"
            >
              {t('plan.form.destination')}
            </CustomText>
            <CustomText className="text-xs text-gray-500 dark:text-gray-400">
              {t('plan.form.destinationOptional')}
            </CustomText>
          </View>
          <InputField
            placeholder={t('plan.form.destinationPlaceholder')}
            value={formData.destination}
            onChangeText={value => handleInputChange('destination', value)}
            icon="location-outline"
          />
          {/* Location picker button could be added here in future */}
        </View>

        {/* Dates */}
        <View className="flex-row gap-3 mb-4">
          <View className="flex-1">
            <DatePicker
              label={t('plan.form.startDate')}
              value={formData.startDate}
              onChange={value => handleInputChange('startDate', value)}
              placeholder={t('plan.form.datePlaceholder')}
            />
          </View>
          <View className="flex-1">
            <DatePicker
              label={t('plan.form.endDate')}
              value={formData.endDate}
              onChange={value => handleInputChange('endDate', value)}
              placeholder={t('plan.form.datePlaceholder')}
            />
          </View>
        </View>

        {/* Advanced Options - Collapsible */}
        <TouchableOpacity
          onPress={() => setShowAdvanced(!showAdvanced)}
          className="flex-row items-center justify-between mb-3 py-2"
        >
          <CustomText weight="medium" className="text-base text-black dark:text-white">
            {t('plan.form.advancedOptions')}
          </CustomText>
          <Ionicons
            name={showAdvanced ? 'chevron-up' : 'chevron-down'}
            size={20}
            color={isDark ? '#fff' : '#000'}
          />
        </TouchableOpacity>

        {showAdvanced && (
          <View className="mb-4">
        <Divider label={t('plan.form.optionalDivider')} />

        {/* Travelers */}
        <View className="mb-4">
          <CustomText
            weight="medium"
            className="text-base text-black dark:text-white mb-2"
          >
            {t('plan.form.travelers')}
          </CustomText>
          <InputField
            placeholder={t('plan.form.travelersPlaceholder')}
            value={formData.travelers}
            onChangeText={value => handleInputChange('travelers', value)}
            keyboardType="numeric"
            icon="people-outline"
          />
        </View>

        {/* Accommodation */}
        <View className="mb-4">
          <CustomText
            weight="medium"
            className="text-base text-black dark:text-white mb-2"
          >
            {t('plan.form.accommodation')}
          </CustomText>
          <View className="flex-row flex-wrap gap-2">
            {accommodationTypes.map(type => (
              <TouchableOpacity
                key={type}
                onPress={() => handleInputChange('accommodation', type)}
                className={`px-4 py-2 rounded-full border ${
                  formData.accommodation === type
                    ? 'bg-primary border-primary'
                    : 'bg-white dark:bg-neutral-900 border-gray-300 dark:border-neutral-700'
                }`}
              >
                <CustomText
                  className={
                    formData.accommodation === type
                      ? 'text-white'
                      : 'text-gray-700 dark:text-gray-300'
                  }
                >
                  {t(`plan.form.${type}`)}
                </CustomText>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Preferences */}
        <View className="mb-6">
          <CustomText
            weight="medium"
            className="text-base text-black dark:text-white mb-2"
          >
            {t('plan.form.preferences')}
          </CustomText>
          <InputField
            placeholder={t('plan.form.preferencesPlaceholder')}
            value={formData.preferences}
            onChangeText={value => handleInputChange('preferences', value)}
            multiline
            numberOfLines={3}
            icon="heart-outline"
          />
        </View>
          </View>
        )}
      </ScrollView>

      {/* Floating Submit Button - Adjusts with keyboard */}
      <Animated.View 
        className="absolute left-0 right-0 px-6 bg-white dark:bg-black border-t border-gray-200 dark:border-neutral-800"
        style={[
          {
            paddingTop: 16,
          },
          floatingButtonStyle,
        ]}
      >
        <CustomButton
          title={loading ? t('plan.form.generating') : t('plan.form.submit')}
          onPress={handleSubmit}
          disabled={loading || !formIsValid}
          IconLeft={
            loading
              ? () => (
                  <ActivityIndicator
                    color="#fff"
                    style={{ marginRight: 8 }}
                  />
                )
              : () => (
                  <Ionicons
                    name="checkmark-circle"
                    size={20}
                    color="#fff"
                    style={{ marginRight: 8 }}
                  />
                )
          }
          className="shadow-lg"
        />
    </Animated.View>
    </KeyboardAvoidingView>
  );
}
