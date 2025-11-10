import { useMemo, useState } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useRouter, useLocalSearchParams, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { CustomText } from '@components/ui/CustomText';
import InputField from '@components/ui/InputField';
import CustomButton from '@components/ui/CustomButton';
import { useTheme } from '@components/context/ThemeContext';
import { useGetTourQuery, useBookTourMutation } from '@api';
import { useAppSelector } from '@store/hooks';
import Colors from '@constants/Colors';
import { useDateTime } from '@utils/datetime';

export default function BookTourScreen() {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const tourId = useMemo(() => (Array.isArray(id) ? id[0] : id) as string, [id]);
  const { user } = useAppSelector(state => state.auth);
  const { getNow } = useDateTime();

  // GraphQL queries
  const { data, loading: loadingTour, error: tourError } = useGetTourQuery({
    variables: { id: tourId },
    skip: !tourId,
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all',
  });

  const tour = data?.getTour as any;

  const [bookTour, { loading: booking }] = useBookTourMutation({
    onCompleted: (_data) => {
      Alert.alert(
        t('common.success'),
        t('tourBooking.successMessage'),
        [
          {
            text: t('common.ok'),
            onPress: () => router.replace('/(app)/(profile)/payments' as any),
          },
        ]
      );
    },
    onError: (error) => {
      Alert.alert(t('common.error'), error.message || t('tourBooking.errors.generic'));
    },
  });

  const [formData, setFormData] = useState({
    participants: '1',
    selectedDate: '',
    fullName: user?.name || '',
    email: '',
    phone: '',
    specialRequests: '',
    agreeTerms: false,
  });

  // Generate available dates (mock for now - could be from tour data)
  // Must be called before early returns to follow React Hooks rules
  const availableDates = useMemo(() => {
    // TODO: Get from tour data when available
    const dates = [];
    const today = getNow();
    for (let i = 0; i < 4; i++) {
      const date = today.plus({ weeks: i + 1 });
      dates.push(date.toISODate() || '');
    }
    return dates;
  }, [getNow]);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const calculateTotal = () => {
    const participants = parseInt(formData.participants) || 1;
    return (tour?.price || 0) * participants;
  };

  const handleBooking = async () => {
    if (!formData.selectedDate || !formData.fullName || !formData.email) {
      Alert.alert(t('common.error'), t('tourBooking.errors.requiredFields'));
      return;
    }

    if (!formData.agreeTerms) {
      Alert.alert(t('common.error'), t('tourBooking.errors.agreeTerms'));
      return;
    }

    if (!tourId || !user?.id) {
      Alert.alert(t('common.error'), t('tourBooking.errors.notAuthenticated'));
      return;
    }

    try {
      await bookTour({
        variables: {
          input: {
            tourId,
            participants: parseInt(formData.participants) || 1,
            selectedDate: formData.selectedDate,
            fullName: formData.fullName,
            email: formData.email,
            phone: formData.phone || undefined,
            specialRequests: formData.specialRequests || undefined,
          },
        },
      });
    } catch (error: any) {
      // Error handled by onError callback
      console.error('Booking error:', error);
    }
  };

  if (loadingTour) {
    return (
      <View className="flex-1 items-center justify-center bg-white dark:bg-black">
        <ActivityIndicator size="large" color={isDark ? Colors.dark.primary : Colors.light.primary} />
        <CustomText className="text-gray-500 dark:text-gray-400 mt-4">
          {t('common.loading')}
        </CustomText>
      </View>
    );
  }

  if (tourError || !tour) {
    return (
      <View className="flex-1 items-center justify-center px-6 bg-white dark:bg-black">
        <Ionicons name="warning-outline" size={64} color={isDark ? '#ef4444' : '#dc2626'} />
        <CustomText weight="bold" className="text-lg text-gray-800 dark:text-gray-300 mt-4 mb-2 text-center">
          {t('common.error')}
        </CustomText>
        <CustomText className="text-base text-gray-600 dark:text-gray-400 text-center">
          {String((tourError as any)?.message || t('common.errorMessage') || 'Tour not found')}
        </CustomText>
        <TouchableOpacity
          onPress={() => router.back()}
          className="mt-4 bg-primary px-6 py-3 rounded-lg"
        >
          <CustomText className="text-white" weight="medium">
            {t('common.back') || 'Go Back'}
          </CustomText>
        </TouchableOpacity>
      </View>
      );
  }

  return (
    <ScrollView className="flex-1 bg-white dark:bg-black">
      <Stack.Screen options={{ title: t('tourBooking.title'), headerShown: true }} />

      <View className="px-6 py-6">
        {/* Tour Summary */}
        <View className="bg-primary/10 dark:bg-primary/20 rounded-2xl p-4 mb-6">
          <CustomText weight="bold" className="text-xl text-black dark:text-white mb-2">
            {tour.title}
          </CustomText>
          <View className="flex-row items-center mb-1">
            <Ionicons name="location" size={16} color={isDark ? '#9ca3af' : '#6b7280'} />
            <CustomText className="text-sm text-gray-600 dark:text-gray-400 ml-2">
              {tour.location}
            </CustomText>
          </View>
          <View className="flex-row items-center">
            <Ionicons name="time-outline" size={16} color={isDark ? '#9ca3af' : '#6b7280'} />
            <CustomText className="text-sm text-gray-600 dark:text-gray-400 ml-2">
              {tour.duration} {t('explore.tourCard.days')}
            </CustomText>
          </View>
        </View>

        {/* Participants */}
        <View className="mb-4">
          <InputField
            label={t('tourBooking.participants')}
            placeholder="1"
            value={formData.participants}
            onChangeText={value => handleInputChange('participants', value)}
            keyboardType="number-pad"
            icon="people-outline"
          />
        </View>

        {/* Date Selection */}
        <View className="mb-4">
          <CustomText
            weight="medium"
            className="text-base text-black dark:text-white mb-2"
          >
            {t('tourBooking.selectDate')}
          </CustomText>
          <View className="flex-row flex-wrap gap-2">
            {availableDates.map((date: string) => (
              <TouchableOpacity
                key={date}
                onPress={() => handleInputChange('selectedDate', date)}
                className={`px-4 py-3 rounded-lg border ${
                  formData.selectedDate === date
                    ? 'bg-primary border-primary'
                    : 'bg-white dark:bg-neutral-900 border-gray-300 dark:border-neutral-700'
                }`}
              >
                <CustomText
                  className={
                    formData.selectedDate === date
                      ? 'text-white'
                      : 'text-gray-700 dark:text-gray-300'
                  }
                >
                  {date}
                </CustomText>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Contact Information */}
        <CustomText
          weight="bold"
          className="text-lg text-black dark:text-white mb-3 mt-4"
        >
          {t('tourBooking.contactInfo')}
        </CustomText>

        <InputField
          label={t('tourBooking.fullName')}
          placeholder={t('tourBooking.fullNamePlaceholder')}
          value={formData.fullName}
          onChangeText={value => handleInputChange('fullName', value)}
          icon="person-outline"
        />

        <InputField
          label={t('tourBooking.email')}
          placeholder={t('tourBooking.emailPlaceholder')}
          value={formData.email}
          onChangeText={value => handleInputChange('email', value)}
          keyboardType="email-address"
          icon="mail-outline"
        />

        <InputField
          label={t('tourBooking.phone')}
          placeholder={t('tourBooking.phonePlaceholder')}
          value={formData.phone}
          onChangeText={value => handleInputChange('phone', value)}
          keyboardType="phone-pad"
          icon="call-outline"
        />

        <InputField
          label={t('tourBooking.specialRequests')}
          placeholder={t('tourBooking.specialRequestsPlaceholder')}
          value={formData.specialRequests}
          onChangeText={value => handleInputChange('specialRequests', value)}
          multiline
          numberOfLines={3}
          icon="chatbox-outline"
        />

        {/* Terms & Conditions */}
        <TouchableOpacity
          onPress={() => handleInputChange('agreeTerms', !formData.agreeTerms)}
          className="flex-row items-start mt-4 mb-6"
        >
          <View
            className={`w-6 h-6 rounded border-2 items-center justify-center mr-3 ${
              formData.agreeTerms
                ? 'bg-primary border-primary'
                : 'bg-white dark:bg-neutral-900 border-gray-300 dark:border-neutral-700'
            }`}
          >
            {formData.agreeTerms && (
              <Ionicons name="checkmark" size={16} color="#fff" />
            )}
          </View>
          <CustomText className="flex-1 text-sm text-gray-700 dark:text-gray-300">
            {t('tourBooking.agreeTerms')}
          </CustomText>
        </TouchableOpacity>

        {/* Price Summary */}
        <View className="bg-gray-50 dark:bg-neutral-900 rounded-2xl p-4 mb-6">
          <View className="flex-row justify-between mb-2">
            <CustomText className="text-base text-gray-600 dark:text-gray-400">
              {t('tourBooking.pricePerPerson')}
            </CustomText>
            <CustomText className="text-base text-black dark:text-white">
              ${tour.price}
            </CustomText>
          </View>
          <View className="flex-row justify-between mb-2">
            <CustomText className="text-base text-gray-600 dark:text-gray-400">
              {t('tourBooking.participants')} × {formData.participants}
            </CustomText>
            <CustomText className="text-base text-black dark:text-white">
              ${(tour.price || 0) * (parseInt(formData.participants) || 1)}
            </CustomText>
          </View>
          <View className="border-t border-gray-200 dark:border-neutral-800 pt-2 mt-2">
            <View className="flex-row justify-between">
              <CustomText weight="bold" className="text-lg text-black dark:text-white">
                {t('tourBooking.total')}
              </CustomText>
              <CustomText weight="bold" className="text-lg text-primary">
                ${calculateTotal()}
              </CustomText>
            </View>
          </View>
        </View>

        {/* Book Button */}
        <CustomButton
          title={booking ? t('tourBooking.processing') : t('tourBooking.confirmBooking')}
          onPress={handleBooking}
          loading={booking}
          disabled={booking}
          IconLeft={() => (
            <Ionicons
              name="checkmark-circle"
              size={20}
              color="#fff"
              style={{ marginRight: 8 }}
            />
          )}
        />

        <View className="h-8" />
      </View>
    </ScrollView>
  );
}

