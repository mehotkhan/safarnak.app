import { useState, useEffect, useMemo } from 'react';
import {
  View,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { CustomText } from '@ui/display';
import { InputField } from '@ui/forms';
import { TextArea } from '@ui/forms';
import { DatePicker } from '@ui/forms';
import { CustomButton } from '@ui/forms';
import { useTheme } from '@ui/context';
import { useGetTripQuery, useUpdateTripMutation, GetTripDocument, GetTripsDocument } from '@api';
import Colors from '@constants/Colors';

export default function EditTripScreen() {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const tripId = useMemo(() => (Array.isArray(id) ? id[0] : id) as string, [id]);

  // Load trip data
  const { data, loading: loadingTrip, error: tripError } = useGetTripQuery({
    variables: { id: tripId },
    skip: !tripId,
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all',
  });

  const trip = data?.getTrip as any;

  // Derive initial form data from trip
  const initialFormData = useMemo(() => {
    if (!trip) {
      return {
        destination: '',
        startDate: '',
        endDate: '',
        travelers: '1',
        budget: '',
        preferences: '',
        accommodation: 'hotel',
      };
    }
    return {
      destination: trip.destination || '',
      startDate: trip.startDate || '',
      endDate: trip.endDate || '',
      travelers: String(trip.travelers || 1),
      budget: trip.budget ? String(trip.budget) : '',
      preferences: trip.preferences || '',
      accommodation: trip.accommodation || 'hotel',
    };
  }, [trip]);

  const [formData, setFormData] = useState(initialFormData);

  // Update form when trip data changes
  useEffect(() => {
    setFormData(initialFormData);
  }, [initialFormData]);

  const [updateTrip, { loading: updating }] = useUpdateTripMutation({
    refetchQueries: [GetTripDocument, GetTripsDocument],
    awaitRefetchQueries: true,
    onCompleted: () => {
      Alert.alert(t('common.success'), t('plan.form.updated'));
      router.back();
    },
    onError: (error) => {
      Alert.alert(t('common.error'), error.message || t('plan.form.errors.generic'));
    },
  });

  const handleSave = async () => {
    if (!tripId) {
      Alert.alert(t('common.error'), t('plan.form.errors.notAuthenticated'));
      return;
    }

    try {
      await updateTrip({
        variables: {
          id: tripId,
          input: {
            destination: formData.destination || undefined,
            startDate: formData.startDate || undefined,
            endDate: formData.endDate || undefined,
            travelers: parseInt(formData.travelers, 10) || 1,
            budget: formData.budget ? parseFloat(formData.budget) : undefined,
            preferences: formData.preferences || undefined,
            accommodation: formData.accommodation || undefined,
          },
        },
      });
    } catch (error: any) {
      // Error handled by onError callback
      console.error('Update trip error:', error);
    }
  };

  if (loadingTrip) {
    return (
      <View className="flex-1 items-center justify-center bg-white dark:bg-black">
        <ActivityIndicator size="large" color={isDark ? Colors.dark.primary : Colors.light.primary} />
        <CustomText className="mt-4 text-gray-500 dark:text-gray-400">
          {t('common.loading')}
        </CustomText>
      </View>
    );
  }

  if (tripError || !trip) {
    return (
      <View className="flex-1 items-center justify-center bg-white px-6 dark:bg-black">
        <Ionicons name="warning-outline" size={64} color={isDark ? '#ef4444' : '#dc2626'} />
        <CustomText weight="bold" className="mb-2 mt-4 text-center text-lg text-gray-800 dark:text-gray-300">
          {t('common.error')}
        </CustomText>
        <CustomText className="text-center text-base text-gray-600 dark:text-gray-400">
          {String((tripError as any)?.message || t('plan.tripNotFound') || 'Trip not found')}
        </CustomText>
        <CustomButton
          title={t('common.back')}
          onPress={() => router.back()}
          className="mt-4"
        />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white dark:bg-black">
      <Stack.Screen options={{ title: t('plan.editPlan') }} />
      
      <ScrollView className="flex-1 px-6 py-4">
        <CustomText weight="bold" className="mb-6 text-2xl text-black dark:text-white">
          {t('plan.editPlan')}
        </CustomText>

        <InputField
          label={t('plan.form.destination')}
          placeholder={t('plan.form.destinationPlaceholder')}
          value={formData.destination}
          onChangeText={(text: string) => setFormData({ ...formData, destination: text })}
          icon="location-outline"
        />

        <View className="mb-4 flex-row gap-3">
          <View className="flex-1">
            <DatePicker
              label={t('plan.form.startDate')}
              value={formData.startDate}
              onChange={(date: string) => setFormData({ ...formData, startDate: date })}
            />
          </View>
          <View className="flex-1">
            <DatePicker
              label={t('plan.form.endDate')}
              value={formData.endDate}
              onChange={(date: string) => setFormData({ ...formData, endDate: date })}
            />
          </View>
        </View>

        <InputField
          label={t('plan.form.travelers')}
          placeholder={t('plan.form.travelersPlaceholder')}
          value={formData.travelers}
          onChangeText={(text: string) => setFormData({ ...formData, travelers: text })}
          keyboardType="number-pad"
          icon="people-outline"
        />

        <InputField
          label={t('plan.form.budget')}
          placeholder={t('plan.form.budgetPlaceholder')}
          value={formData.budget}
          onChangeText={(text: string) => setFormData({ ...formData, budget: text })}
          keyboardType="number-pad"
          icon="wallet-outline"
        />

        <TextArea
          label={t('plan.form.preferences')}
          placeholder={t('plan.form.preferencesPlaceholder')}
          value={formData.preferences}
          onChangeText={(text: string) => setFormData({ ...formData, preferences: text })}
          rows={4}
        />

        <View className="h-6" />
        
        <CustomButton
          title={updating ? t('common.saving') : t('common.save')}
          onPress={handleSave}
          loading={updating}
          disabled={updating}
          IconLeft={() => <Ionicons name="checkmark" size={20} color="#fff" style={{ marginRight: 8 }} />}
        />
        
        <View className="h-4" />
        
        <CustomButton
          title={t('common.cancel')}
          onPress={() => router.back()}
          bgVariant="secondary"
          disabled={updating}
        />

        <View className="h-8" />
      </ScrollView>
    </View>
  );
}
