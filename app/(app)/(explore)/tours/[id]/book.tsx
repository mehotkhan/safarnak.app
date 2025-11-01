import { useState } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useRouter, useLocalSearchParams, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { CustomText } from '@components/ui/CustomText';
import InputField from '@components/ui/InputField';
import CustomButton from '@components/ui/CustomButton';
import { useTheme } from '@components/context/ThemeContext';
import DatePicker from '@components/ui/DatePicker';

// Mock tour data
const mockTour = {
  id: '1',
  title: 'Cherry Blossom Tour',
  location: 'Tokyo, Japan',
  price: 1200,
  duration: 7,
  maxParticipants: 20,
  availableDates: ['2025-03-20', '2025-03-27', '2025-04-03', '2025-04-10'],
};

export default function BookTourScreen() {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    participants: '1',
    selectedDate: '',
    fullName: '',
    email: '',
    phone: '',
    specialRequests: '',
    agreeTerms: false,
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const calculateTotal = () => {
    const participants = parseInt(formData.participants) || 1;
    return mockTour.price * participants;
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

    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
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
    }, 1500);
  };

  return (
    <ScrollView className="flex-1 bg-white dark:bg-black">
      <Stack.Screen options={{ title: t('tourBooking.title'), headerShown: true }} />

      <View className="px-6 py-6">
        {/* Tour Summary */}
        <View className="bg-primary/10 dark:bg-primary/20 rounded-2xl p-4 mb-6">
          <CustomText weight="bold" className="text-xl text-black dark:text-white mb-2">
            {mockTour.title}
          </CustomText>
          <View className="flex-row items-center mb-1">
            <Ionicons name="location" size={16} color={isDark ? '#9ca3af' : '#6b7280'} />
            <CustomText className="text-sm text-gray-600 dark:text-gray-400 ml-2">
              {mockTour.location}
            </CustomText>
          </View>
          <View className="flex-row items-center">
            <Ionicons name="time-outline" size={16} color={isDark ? '#9ca3af' : '#6b7280'} />
            <CustomText className="text-sm text-gray-600 dark:text-gray-400 ml-2">
              {mockTour.duration} {t('explore.tourCard.days')}
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
            {mockTour.availableDates.map(date => (
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
              ${mockTour.price}
            </CustomText>
          </View>
          <View className="flex-row justify-between mb-2">
            <CustomText className="text-base text-gray-600 dark:text-gray-400">
              {t('tourBooking.participants')} × {formData.participants}
            </CustomText>
            <CustomText className="text-base text-black dark:text-white">
              ${mockTour.price * (parseInt(formData.participants) || 1)}
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
          title={loading ? t('tourBooking.processing') : t('tourBooking.confirmBooking')}
          onPress={handleBooking}
          disabled={loading}
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

