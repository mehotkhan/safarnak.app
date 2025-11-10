import { useState } from 'react';
import {
  View,
  ScrollView,
  Alert,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { CustomText } from '@components/ui/CustomText';
import InputField from '@components/ui/InputField';
import TextArea from '@components/ui/TextArea';
import CustomButton from '@components/ui/CustomButton';
import { useCreateLocationMutation, GetLocationsDocument } from '@api';

export default function CreateLocationScreen() {
  const { t } = useTranslation();
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: '',
    country: '',
    description: '',
    latitude: '',
    longitude: '',
    popularActivities: '',
    averageCost: '',
    bestTimeToVisit: '',
    population: '',
  });

  const [createLocation, { loading }] = useCreateLocationMutation({
    refetchQueries: [GetLocationsDocument],
    awaitRefetchQueries: true,
    onCompleted: (data) => {
      Alert.alert(t('common.success'), t('location.created') || 'Location created successfully');
      router.replace(`/(app)/(explore)/locations/${data.createLocation.id}` as any);
    },
    onError: (error) => {
      Alert.alert(t('common.error'), error.message || t('location.errors.generic') || 'Failed to create location');
    },
  });

  const handleSave = async () => {
    // Validation
    if (!formData.name || !formData.country) {
      Alert.alert(t('common.error'), t('location.errors.requiredFields') || 'Name and country are required');
      return;
    }

    const latitude = parseFloat(formData.latitude);
    const longitude = parseFloat(formData.longitude);

    if (isNaN(latitude) || isNaN(longitude)) {
      Alert.alert(t('common.error'), t('location.errors.invalidCoordinates') || 'Valid coordinates are required');
      return;
    }

    try {
      await createLocation({
        variables: {
          input: {
            name: formData.name,
            country: formData.country,
            description: formData.description || undefined,
            coordinates: {
              latitude,
              longitude,
            },
            popularActivities: formData.popularActivities
              ? formData.popularActivities.split(',').map(a => a.trim()).filter(a => a.length > 0)
              : undefined,
            averageCost: formData.averageCost ? parseFloat(formData.averageCost) : undefined,
            bestTimeToVisit: formData.bestTimeToVisit || undefined,
            population: formData.population || undefined,
          },
        },
      });
    } catch (error: any) {
      // Error handled by onError callback
      console.error('Create location error:', error);
    }
  };

  return (
    <View className="flex-1 bg-white dark:bg-black">
      <Stack.Screen options={{ title: t('trips.tabs.locationsCreate') || 'Create Location' }} />
      
      <ScrollView className="flex-1 px-6 py-4">
        <CustomText weight="bold" className="text-2xl text-black dark:text-white mb-6">
          {t('trips.tabs.locationsCreate') || 'Create Location'}
        </CustomText>

        <InputField
          label={t('location.name') || 'Name'}
          placeholder={t('location.namePlaceholder') || 'Enter location name'}
          value={formData.name}
          onChangeText={(text: string) => setFormData({ ...formData, name: text })}
          icon="location-outline"
        />

        <InputField
          label={t('location.country') || 'Country'}
          placeholder={t('location.countryPlaceholder') || 'Enter country'}
          value={formData.country}
          onChangeText={(text: string) => setFormData({ ...formData, country: text })}
          icon="globe-outline"
        />

        <TextArea
          label={t('location.description') || 'Description'}
          placeholder={t('location.descriptionPlaceholder') || 'Enter description'}
          value={formData.description}
          onChangeText={(text: string) => setFormData({ ...formData, description: text })}
          rows={4}
        />

        <View className="flex-row gap-3 mb-4">
          <View className="flex-1">
            <InputField
              label={t('location.latitude') || 'Latitude'}
              placeholder="35.6762"
              value={formData.latitude}
              onChangeText={(text: string) => setFormData({ ...formData, latitude: text })}
              keyboardType="numeric"
              icon="navigate-outline"
            />
          </View>
          <View className="flex-1">
            <InputField
              label={t('location.longitude') || 'Longitude'}
              placeholder="139.6503"
              value={formData.longitude}
              onChangeText={(text: string) => setFormData({ ...formData, longitude: text })}
              keyboardType="numeric"
              icon="navigate-outline"
            />
          </View>
        </View>

        <InputField
          label={t('location.popularActivities') || 'Popular Activities (comma-separated)'}
          placeholder={t('location.activitiesPlaceholder') || 'Activity 1, Activity 2, ...'}
          value={formData.popularActivities}
          onChangeText={(text: string) => setFormData({ ...formData, popularActivities: text })}
          icon="star-outline"
        />

        <InputField
          label={t('location.avgCost') || 'Average Cost (per day)'}
          placeholder="150"
          value={formData.averageCost}
          onChangeText={(text: string) => setFormData({ ...formData, averageCost: text })}
          keyboardType="numeric"
          icon="cash-outline"
        />

        <InputField
          label={t('location.bestTime') || 'Best Time to Visit'}
          placeholder={t('location.bestTimePlaceholder') || 'March to May, September to November'}
          value={formData.bestTimeToVisit}
          onChangeText={(text: string) => setFormData({ ...formData, bestTimeToVisit: text })}
          icon="calendar-outline"
        />

        <InputField
          label={t('location.population') || 'Population'}
          placeholder="14 million"
          value={formData.population}
          onChangeText={(text: string) => setFormData({ ...formData, population: text })}
          icon="people-outline"
        />

        <View className="h-6" />
        
        <CustomButton
          title={loading ? t('common.creating') : t('common.create')}
          onPress={handleSave}
          loading={loading}
          disabled={loading}
          IconLeft={() => <Ionicons name="checkmark" size={20} color="#fff" style={{ marginRight: 8 }} />}
        />
        
        <View className="h-4" />
        
        <CustomButton
          title={t('common.cancel')}
          onPress={() => router.back()}
          bgVariant="secondary"
          disabled={loading}
        />

        <View className="h-8" />
      </ScrollView>
    </View>
  );
}

