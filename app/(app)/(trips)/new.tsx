import { useState } from 'react';
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

  const [formData, setFormData] = useState({
    destination: '',
    startDate: '',
    endDate: '',
    description: '',
    preferences: '',
    travelers: '1',
    accommodation: 'hotel',
  });

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
      const baseDescription = validated.description.trim();
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
      });

      const res = await createTrip({
        variables: {
          input: {
            destination: validated.destination,
            startDate: validated.startDate,
            endDate: validated.endDate,
            travelers: travelersNum,
            accommodation: validated.accommodation,
            preferences: combinedPreferences,
          },
        },
      });

      console.log('GraphQL response:', JSON.stringify(res, null, 2));

      const trip = res.data?.createTrip;
      if (trip?.id) {
        Alert.alert(t('plan.form.successTitle'), t('plan.form.generated'), [
          { text: t('common.ok'), onPress: () => router.replace(`/plan/trip-detail/${trip.id}` as any) },
        ]);
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
        {/* Describe Plan (Top) */}
        <TextArea
          label={t('plan.form.describePlan')}
          value={formData.description}
          onChangeText={text => handleInputChange('description', text)}
          placeholder={t('plan.form.describePlanPlaceholder')}
          rows={10}
        />

        {/* Destination */}
        <View className="mb-4">
          <CustomText
            weight="medium"
            className="text-base text-black dark:text-white mb-2"
          >
            {t('plan.form.destination')}
          </CustomText>
          <InputField
            placeholder={t('plan.form.destinationPlaceholder')}
            value={formData.destination}
            onChangeText={value => handleInputChange('destination', value)}
            icon="location-outline"
          />
        </View>

        {/* Dates (below Destination) */}
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

