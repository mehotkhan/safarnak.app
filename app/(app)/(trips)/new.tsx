import { useState, useEffect, useCallback } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { Stack } from 'expo-router';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { CustomText } from '@components/ui/CustomText';
import InputField from '@components/ui/InputField';
import CustomButton from '@components/ui/CustomButton';
import { useTheme } from '@components/context/ThemeContext';
import { z } from 'zod';
import { useCreateTripMutation } from '@api';
import DatePicker from '@components/ui/DatePicker';
import Divider from '@components/ui/Divider';
import TextArea from '@components/ui/TextArea';

const accommodationTypes = ['hotel', 'hostel', 'apartment', 'camping'];

export default function CreateTripScreen() {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [createTrip] = useCreateTripMutation();

  // Location state
  const [currentLocation, setCurrentLocation] = useState<string>('');
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  // Advanced options state
  const [showAdvanced, setShowAdvanced] = useState(false);

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

      // Request permissions
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLocationError(t('plan.form.currentLocationError'));
        return;
      }

      // Get current position
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      // Reverse geocode to get address
      const geocode = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      if (geocode && geocode.length > 0) {
        const addr = geocode[0];
        const addressParts = [
          addr.street,
          addr.city,
          addr.region,
          addr.country,
        ].filter(Boolean);
        setCurrentLocation(addressParts.join(', ') || `${location.coords.latitude.toFixed(6)}, ${location.coords.longitude.toFixed(6)}`);
      } else {
        setCurrentLocation(`${location.coords.latitude.toFixed(6)}, ${location.coords.longitude.toFixed(6)}`);
      }
    } catch (error: any) {
      console.error('Location error:', error);
      setLocationError(t('plan.form.currentLocationError'));
    } finally {
      setLocationLoading(false);
    }
  }, [t]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const schema = z.object({
    // All fields are optional except description
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
      const s = new Date(values.startDate).getTime();
      const e = new Date(values.endDate).getTime();
      return e >= s;
    }
    return true;
  }, { message: 'datesInvalid' });

  const handleSubmit = async () => {
    try {
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
      });

      console.log('GraphQL response:', JSON.stringify(res, null, 2));

      const trip = res.data?.createTrip;
      if (trip?.id) {
        // Show alert that trip is being generated
        Alert.alert(
          t('plan.form.processing'),
          t('plan.form.waitingMessage'),
          [
            { 
              text: t('common.ok'), 
              onPress: () => {
                // Navigate to trip details page with pending status
                router.replace(`/(app)/(trips)/${trip.id}` as any);
              }
            },
          ]
        );
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

  return (
    <View className="flex-1 bg-white dark:bg-black">
      <Stack.Screen options={{ title: t('plan.form.title'), headerShown: true }} />

      <ScrollView className="flex-1 px-6 py-4">
        {/* Current Location */}
        <View className="mb-4">
          <CustomText
            weight="medium"
            className="text-base text-black dark:text-white mb-2"
          >
            {t('plan.form.currentLocation')}
          </CustomText>
          <View className="flex-row gap-2">
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
              className={`px-4 py-3 rounded-full justify-center items-center ${
                locationLoading
                  ? 'bg-gray-300 dark:bg-neutral-700'
                  : 'bg-primary'
              }`}
            >
              {locationLoading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Ionicons name="refresh-outline" size={20} color="#fff" />
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

        {/* Submit Button */}
        <CustomButton
          title={loading ? t('plan.form.generating') : t('plan.form.submit')}
          onPress={handleSubmit}
          disabled={loading}
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
                    name="sparkles"
                    size={20}
                    color="#fff"
                    style={{ marginRight: 8 }}
                  />
                )
          }
        />

        <View className="h-8" />
      </ScrollView>
    </View>
  );
}
