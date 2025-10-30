import { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { CustomText } from '@components/ui/CustomText';
import InputField from '@components/ui/InputField';
import TextArea from '@components/ui/TextArea';
import DatePicker from '@components/ui/DatePicker';
import CustomButton from '@components/ui/CustomButton';
import { useTheme } from '@components/context/ThemeContext';

export default function EditTripScreen() {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const [formData, setFormData] = useState({
    destination: 'Tokyo, Japan',
    startDate: '2024-12-01',
    endDate: '2024-12-08',
    travelers: '2',
    budget: '3000',
    preferences: 'Culture, Food, Photography',
    accommodation: 'hotel',
  });

  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      Alert.alert(t('common.success'), t('plan.form.updated', { defaultValue: 'Trip updated successfully!' }));
      router.back();
    }, 1000);
  };

  return (
    <View className="flex-1 bg-white dark:bg-black">
      <Stack.Screen options={{ title: t('plan.editPlan') }} />
      
      <ScrollView className="flex-1 px-6 py-4">
        <CustomText weight="bold" className="text-2xl text-black dark:text-white mb-6">
          {t('plan.editPlan')}
        </CustomText>

        <InputField
          label={t('plan.form.destination')}
          placeholder={t('plan.form.destinationPlaceholder')}
          value={formData.destination}
          onChangeText={(text: string) => setFormData({ ...formData, destination: text })}
          icon="location-outline"
        />

        <View className="flex-row gap-3 mb-4">
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
          label={t('plan.form.budget', { defaultValue: 'Budget' })}
          placeholder={t('plan.form.budgetPlaceholder', { defaultValue: '$1000' })}
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
          title={t('common.save')}
          onPress={handleSave}
          loading={loading}
          IconLeft={() => <Ionicons name="checkmark" size={20} color="#fff" style={{ marginRight: 8 }} />}
        />
        
        <View className="h-4" />
        
        <CustomButton
          title={t('common.cancel')}
          onPress={() => router.back()}
          bgVariant="secondary"
        />

        <View className="h-8" />
      </ScrollView>
    </View>
  );
}

