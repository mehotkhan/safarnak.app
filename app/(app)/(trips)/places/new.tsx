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
import { useCreatePlaceMutation, GetPlacesDocument } from '@api';
import TextArea from '@components/ui/TextArea';

const placeTypes = ['restaurant', 'attraction', 'hotel', 'shop', 'museum', 'park', 'beach', 'other'];

export default function CreatePlaceScreen() {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(false);
  const [createPlace] = useCreatePlaceMutation();
  const keyboardHeight = useSharedValue(0);

  const [currentLocation, setCurrentLocation] = useState<string>('');
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [coordinates, setCoordinates] = useState<{ latitude: number; longitude: number } | null>(null);

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
    name: '',
    location: '',
    description: '',
    type: 'attraction',
    phone: '',
    website: '',
    hours: '',
    tips: '',
    imageUrl: '',
    isOpen: true,
  });

  const getCurrentLocation = useCallback(async () => {
    try {
      setLocationLoading(true);
      setLocationError(null);

      const servicesEnabled = await Location.hasServicesEnabledAsync();
      if (!servicesEnabled) {
        setLocationError(t('places.errors.locationServicesDisabled') || 'Location services are disabled');
        return;
      }

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLocationError(t('places.errors.locationPermissionDenied') || 'Location permission denied');
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const lat = location.coords.latitude;
      const lon = location.coords.longitude;
      setCoordinates({ latitude: lat, longitude: lon });
      setCurrentLocation(`${lat.toFixed(6)}, ${lon.toFixed(6)}`);
      setFormData(prev => ({ ...prev, location: `${lat.toFixed(6)}, ${lon.toFixed(6)}` }));
    } catch (error: any) {
      setLocationError(error?.message || t('places.errors.locationFailed') || 'Failed to get location');
    } finally {
      setLocationLoading(false);
    }
  }, [t]);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const schema = z.object({
    name: z.string().min(2, t('places.errors.nameMin') || 'Name must be at least 2 characters'),
    location: z.string().min(1, t('places.errors.locationRequired') || 'Location is required'),
    description: z.string().min(10, t('places.errors.descriptionMin') || 'Description must be at least 10 characters'),
    type: z.string().min(1, t('places.errors.typeRequired') || 'Type is required'),
  });

  const handleSubmit = async () => {
    try {
      if (!coordinates) {
        Alert.alert(t('common.error'), t('places.errors.locationRequired') || 'Please get your current location first');
        return;
      }

      const validated = schema.parse(formData);
      setLoading(true);

      const res = await createPlace({
        variables: {
          input: {
            name: validated.name,
            location: validated.location,
            description: validated.description,
            type: validated.type,
            coordinates,
            phone: formData.phone || undefined,
            website: formData.website || undefined,
            hours: formData.hours || undefined,
            tips: formData.tips ? [formData.tips] : undefined,
            imageUrl: formData.imageUrl || undefined,
          },
        },
        refetchQueries: [GetPlacesDocument],
        awaitRefetchQueries: true,
      });

      const place = res.data?.createPlace;
      if (place?.id) {
        Keyboard.dismiss();
        setTimeout(() => {
          router.replace(`/(app)/(explore)/places/${place.id}` as any);
        }, 100);
      } else {
        throw new Error(t('places.errors.createFailed') || 'Failed to create place');
      }
    } catch (err: any) {
      if (err?.issues?.length) {
        Alert.alert(t('common.error'), err.issues[0].message);
        return;
      }
      Alert.alert(t('common.error'), err?.message || t('places.errors.createFailed') || 'Failed to create place');
    } finally {
      setLoading(false);
    }
  };

  const formIsValid = () => {
    try {
      schema.parse(formData);
      return coordinates !== null;
    } catch {
      return false;
    }
  };

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
    >
      <Stack.Screen options={{ title: t('places.new') || 'Create Place', headerShown: true }} />

      <ScrollView 
        className="flex-1 px-6 py-4" 
        contentContainerStyle={{ paddingBottom: 120 }}
        keyboardShouldPersistTaps="handled"
      >
        <InputField
          label={t('places.form.name') || 'Name *'}
          value={formData.name}
          onChangeText={(v) => handleInputChange('name', v)}
          placeholder={t('places.form.namePlaceholder') || 'Enter place name'}
        />

        <View className="mb-4">
          <View className="flex-row items-center gap-2">
            <View className="flex-1">
              <InputField
                label={t('places.form.location') || 'Location *'}
                value={formData.location}
                onChangeText={(v) => handleInputChange('location', v)}
                placeholder={t('places.form.locationPlaceholder') || 'Enter location'}
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

        <TextArea
          label={t('places.form.description') || 'Description *'}
          value={formData.description}
          onChangeText={(v) => handleInputChange('description', v)}
          placeholder={t('places.form.descriptionPlaceholder') || 'Describe the place...'}
          rows={4}
        />

        <View className="mb-4">
          <CustomText className="text-sm text-gray-700 dark:text-gray-300 mb-2">
            {t('places.form.type') || 'Type *'}
          </CustomText>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row gap-2">
            {placeTypes.map((type) => (
              <TouchableOpacity
                key={type}
                onPress={() => handleInputChange('type', type)}
                className={`px-4 py-2 rounded-full ${
                  formData.type === type
                    ? 'bg-primary'
                    : 'bg-gray-100 dark:bg-neutral-800'
                }`}
              >
                <CustomText
                  className={`text-sm ${
                    formData.type === type
                      ? 'text-white'
                      : 'text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {type}
                </CustomText>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <InputField
          label={t('places.form.phone') || 'Phone'}
          value={formData.phone}
          onChangeText={(v) => handleInputChange('phone', v)}
          placeholder={t('places.form.phonePlaceholder') || 'Optional'}
          keyboardType="phone-pad"
        />

        <InputField
          label={t('places.form.website') || 'Website'}
          value={formData.website}
          onChangeText={(v) => handleInputChange('website', v)}
          placeholder={t('places.form.websitePlaceholder') || 'https://...'}
          keyboardType="url"
        />

        <InputField
          label={t('places.form.hours') || 'Opening Hours'}
          value={formData.hours}
          onChangeText={(v) => handleInputChange('hours', v)}
          placeholder={t('places.form.hoursPlaceholder') || 'e.g., Mon-Fri 9AM-5PM'}
        />

        <TextArea
          label={t('places.form.tips') || 'Tips'}
          value={formData.tips}
          onChangeText={(v) => handleInputChange('tips', v)}
          placeholder={t('places.form.tipsPlaceholder') || 'Helpful tips for visitors...'}
          rows={3}
        />

        <InputField
          label={t('places.form.imageUrl') || 'Image URL'}
          value={formData.imageUrl}
          onChangeText={(v) => handleInputChange('imageUrl', v)}
          placeholder={t('places.form.imageUrlPlaceholder') || 'https://...'}
        />

        <View className="flex-row items-center justify-between p-4 bg-gray-100 dark:bg-neutral-800 rounded-lg">
          <CustomText className="text-base text-gray-700 dark:text-gray-300">
            {t('places.form.isOpen') || 'Currently Open'}
          </CustomText>
          <TouchableOpacity
            onPress={() => handleInputChange('isOpen', !formData.isOpen)}
            className={`w-12 h-6 rounded-full ${
              formData.isOpen ? 'bg-primary' : 'bg-gray-300 dark:bg-neutral-600'
            }`}
          >
            <View
              className={`w-5 h-5 rounded-full bg-white absolute top-0.5 ${
                formData.isOpen ? 'right-0.5' : 'left-0.5'
              }`}
            />
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Animated.View
        className="absolute left-0 right-0 px-6 bg-white dark:bg-black border-t border-gray-200 dark:border-neutral-800"
        style={floatingButtonStyle}
      >
        <CustomButton
          title={loading ? '' : (t('places.form.create') || 'Create Place')}
          onPress={handleSubmit}
          disabled={!formIsValid() || loading}
          loading={loading}
        />
      </Animated.View>
    </KeyboardAvoidingView>
  );
}

