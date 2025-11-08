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
import { useCreateTourMutation, GetToursDocument } from '@api';
import TextArea from '@components/ui/TextArea';

const categories = ['adventure', 'cultural', 'nature', 'food', 'relaxation', 'sports'];
const difficultyLevels = ['easy', 'medium', 'hard', 'expert'];
const durationTypes = ['hours', 'days', 'weeks'];

export default function CreateTourScreen() {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(false);
  const [createTour] = useCreateTourMutation();
  const keyboardHeight = useSharedValue(0);

  // Location state
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
    title: '',
    description: '',
    shortDescription: '',
    price: '',
    currency: 'USD',
    duration: '1',
    durationType: 'days',
    location: '',
    category: 'adventure',
    difficulty: 'easy',
    highlights: '',
    inclusions: '',
    maxParticipants: '',
    minParticipants: '1',
    imageUrl: '',
  });

  const getCurrentLocation = useCallback(async () => {
    try {
      setLocationLoading(true);
      setLocationError(null);

      const servicesEnabled = await Location.hasServicesEnabledAsync();
      if (!servicesEnabled) {
        setLocationError(t('tours.errors.locationServicesDisabled') || 'Location services are disabled');
        return;
      }

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLocationError(t('tours.errors.locationPermissionDenied') || 'Location permission denied');
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
      setLocationError(error?.message || t('tours.errors.locationFailed') || 'Failed to get location');
    } finally {
      setLocationLoading(false);
    }
  }, [t]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const schema = z.object({
    title: z.string().min(3, t('tours.errors.titleMin') || 'Title must be at least 3 characters'),
    description: z.string().min(10, t('tours.errors.descriptionMin') || 'Description must be at least 10 characters'),
    price: z.string().refine(v => {
      const n = parseFloat(v);
      return !isNaN(n) && n > 0;
    }, t('tours.errors.priceRequired') || 'Price must be greater than 0'),
    duration: z.string().refine(v => {
      const n = parseInt(v, 10);
      return !isNaN(n) && n > 0;
    }, t('tours.errors.durationRequired') || 'Duration must be greater than 0'),
    location: z.string().min(1, t('tours.errors.locationRequired') || 'Location is required'),
    category: z.string().min(1, t('tours.errors.categoryRequired') || 'Category is required'),
  });

  const handleSubmit = async () => {
    try {
      const validated = schema.parse(formData);
      setLoading(true);

      const highlights = formData.highlights.split(',').map(h => h.trim()).filter(Boolean);
      const inclusions = formData.inclusions.split(',').map(i => i.trim()).filter(Boolean);

      const res = await createTour({
        variables: {
          input: {
            title: validated.title,
            description: validated.description,
            shortDescription: formData.shortDescription || undefined,
            price: parseFloat(validated.price),
            currency: formData.currency,
            duration: parseInt(validated.duration, 10),
            durationType: formData.durationType,
            location: validated.location,
            coordinates: coordinates || undefined,
            category: validated.category,
            difficulty: formData.difficulty,
            highlights: highlights.length > 0 ? highlights : undefined,
            inclusions: inclusions.length > 0 ? inclusions : undefined,
            maxParticipants: formData.maxParticipants ? parseInt(formData.maxParticipants, 10) : undefined,
            minParticipants: parseInt(formData.minParticipants, 10),
            imageUrl: formData.imageUrl || undefined,
          },
        },
        refetchQueries: [GetToursDocument],
        awaitRefetchQueries: true,
      });

      const tour = res.data?.createTour;
      if (tour?.id) {
        Keyboard.dismiss();
        setTimeout(() => {
          router.replace(`/(app)/(explore)/tours/${tour.id}` as any);
        }, 100);
      } else {
        throw new Error(t('tours.errors.createFailed') || 'Failed to create tour');
      }
    } catch (err: any) {
      if (err?.issues?.length) {
        Alert.alert(t('common.error'), err.issues[0].message);
        return;
      }
      Alert.alert(t('common.error'), err?.message || t('tours.errors.createFailed') || 'Failed to create tour');
    } finally {
      setLoading(false);
    }
  };

  const formIsValid = () => {
    try {
      schema.parse(formData);
      return true;
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
      <Stack.Screen options={{ title: t('tours.new') || 'Create Tour', headerShown: true }} />

      <ScrollView 
        className="flex-1 px-6 py-4" 
        contentContainerStyle={{ paddingBottom: 120 }}
        keyboardShouldPersistTaps="handled"
      >
        <InputField
          label={t('tours.form.title') || 'Title *'}
          value={formData.title}
          onChangeText={(v) => handleInputChange('title', v)}
          placeholder={t('tours.form.titlePlaceholder') || 'Enter tour title'}
        />

        <TextArea
          label={t('tours.form.description') || 'Description *'}
          value={formData.description}
          onChangeText={(v) => handleInputChange('description', v)}
          placeholder={t('tours.form.descriptionPlaceholder') || 'Describe your tour...'}
          rows={4}
        />

        <InputField
          label={t('tours.form.shortDescription') || 'Short Description'}
          value={formData.shortDescription}
          onChangeText={(v) => handleInputChange('shortDescription', v)}
          placeholder={t('tours.form.shortDescriptionPlaceholder') || 'Brief summary (optional)'}
        />

        <View className="flex-row gap-3">
          <View className="flex-1">
            <InputField
              label={t('tours.form.price') || 'Price *'}
              value={formData.price}
              onChangeText={(v) => handleInputChange('price', v)}
              placeholder="0.00"
              keyboardType="decimal-pad"
            />
          </View>
          <View className="w-24">
            <InputField
              label={t('tours.form.currency') || 'Currency'}
              value={formData.currency}
              onChangeText={(v) => handleInputChange('currency', v)}
              placeholder="USD"
            />
          </View>
        </View>

        <View className="flex-row gap-3">
          <View className="flex-1">
            <InputField
              label={t('tours.form.duration') || 'Duration *'}
              value={formData.duration}
              onChangeText={(v) => handleInputChange('duration', v)}
              placeholder="1"
              keyboardType="number-pad"
            />
          </View>
          <View className="flex-1">
            <View className="mb-2">
              <CustomText className="text-sm text-gray-700 dark:text-gray-300 mb-1">
                {t('tours.form.durationType') || 'Duration Type'}
              </CustomText>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row gap-2">
                {durationTypes.map((type) => (
                  <TouchableOpacity
                    key={type}
                    onPress={() => handleInputChange('durationType', type)}
                    className={`px-4 py-2 rounded-full ${
                      formData.durationType === type
                        ? 'bg-primary'
                        : 'bg-gray-100 dark:bg-neutral-800'
                    }`}
                  >
                    <CustomText
                      className={`text-sm ${
                        formData.durationType === type
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
          </View>
        </View>

        <View className="mb-4">
          <View className="flex-row items-center gap-2">
            <View className="flex-1">
              <InputField
                label={t('tours.form.location') || 'Location *'}
                value={formData.location}
                onChangeText={(v) => handleInputChange('location', v)}
                placeholder={t('tours.form.locationPlaceholder') || 'Enter location'}
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

        <View className="mb-4">
          <CustomText className="text-sm text-gray-700 dark:text-gray-300 mb-2">
            {t('tours.form.category') || 'Category *'}
          </CustomText>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row gap-2">
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat}
                onPress={() => handleInputChange('category', cat)}
                className={`px-4 py-2 rounded-full ${
                  formData.category === cat
                    ? 'bg-primary'
                    : 'bg-gray-100 dark:bg-neutral-800'
                }`}
              >
                <CustomText
                  className={`text-sm ${
                    formData.category === cat
                      ? 'text-white'
                      : 'text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {cat}
                </CustomText>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View className="mb-4">
          <CustomText className="text-sm text-gray-700 dark:text-gray-300 mb-2">
            {t('tours.form.difficulty') || 'Difficulty'}
          </CustomText>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row gap-2">
            {difficultyLevels.map((diff) => (
              <TouchableOpacity
                key={diff}
                onPress={() => handleInputChange('difficulty', diff)}
                className={`px-4 py-2 rounded-full ${
                  formData.difficulty === diff
                    ? 'bg-primary'
                    : 'bg-gray-100 dark:bg-neutral-800'
                }`}
              >
                <CustomText
                  className={`text-sm ${
                    formData.difficulty === diff
                      ? 'text-white'
                      : 'text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {diff}
                </CustomText>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <InputField
          label={t('tours.form.highlights') || 'Highlights (comma-separated)'}
          value={formData.highlights}
          onChangeText={(v) => handleInputChange('highlights', v)}
          placeholder={t('tours.form.highlightsPlaceholder') || 'e.g., Scenic views, Local guide, Photography'}
        />

        <InputField
          label={t('tours.form.inclusions') || 'Inclusions (comma-separated)'}
          value={formData.inclusions}
          onChangeText={(v) => handleInputChange('inclusions', v)}
          placeholder={t('tours.form.inclusionsPlaceholder') || 'e.g., Transportation, Meals, Equipment'}
        />

        <View className="flex-row gap-3">
          <View className="flex-1">
            <InputField
              label={t('tours.form.minParticipants') || 'Min Participants'}
              value={formData.minParticipants}
              onChangeText={(v) => handleInputChange('minParticipants', v)}
              placeholder="1"
              keyboardType="number-pad"
            />
          </View>
          <View className="flex-1">
            <InputField
              label={t('tours.form.maxParticipants') || 'Max Participants'}
              value={formData.maxParticipants}
              onChangeText={(v) => handleInputChange('maxParticipants', v)}
              placeholder={t('tours.form.maxParticipantsPlaceholder') || 'Optional'}
              keyboardType="number-pad"
            />
          </View>
        </View>

        <InputField
          label={t('tours.form.imageUrl') || 'Image URL'}
          value={formData.imageUrl}
          onChangeText={(v) => handleInputChange('imageUrl', v)}
          placeholder={t('tours.form.imageUrlPlaceholder') || 'https://...'}
        />
      </ScrollView>

      <Animated.View
        className="absolute left-0 right-0 px-6 bg-white dark:bg-black border-t border-gray-200 dark:border-neutral-800"
        style={floatingButtonStyle}
      >
        <CustomButton
          title={loading ? '' : (t('tours.form.create') || 'Create Tour')}
          onPress={handleSubmit}
          disabled={!formIsValid() || loading}
          loading={loading}
        />
      </Animated.View>
    </KeyboardAvoidingView>
  );
}

