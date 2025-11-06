import { useState } from 'react';
import { View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { CustomText } from '@components/ui/CustomText';
import CustomButton from '@components/ui/CustomButton';

interface PreferenceOption {
  id: string;
  label: string;
  value: string;
}

export default function PreferencesScreen() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  const travelStyles: PreferenceOption[] = [
    { id: 'budget', label: t('profile.preferences.travelStyles.budget'), value: 'budget' },
    { id: 'luxury', label: t('profile.preferences.travelStyles.luxury'), value: 'luxury' },
    { id: 'backpacker', label: t('profile.preferences.travelStyles.backpacker'), value: 'backpacker' },
    { id: 'family', label: t('profile.preferences.travelStyles.family'), value: 'family' },
    { id: 'adventure', label: t('profile.preferences.travelStyles.adventure'), value: 'adventure' },
    { id: 'cultural', label: t('profile.preferences.travelStyles.cultural'), value: 'cultural' },
  ];

  const budgetRanges: PreferenceOption[] = [
    { id: 'low', label: t('profile.preferences.budgetRanges.low'), value: 'low' },
    { id: 'medium', label: t('profile.preferences.budgetRanges.medium'), value: 'medium' },
    { id: 'high', label: t('profile.preferences.budgetRanges.high'), value: 'high' },
    { id: 'premium', label: t('profile.preferences.budgetRanges.premium'), value: 'premium' },
  ];

  const [travelStyle, setTravelStyle] = useState<string>('');
  const [budgetRange, setBudgetRange] = useState<string>('');
  const [interests, setInterests] = useState<string[]>([]);
  const [dietaryRestrictions, setDietaryRestrictions] = useState<string[]>([]);

  const interestOptions = [
    { id: 'beaches', label: t('profile.preferences.interests.beaches') },
    { id: 'mountains', label: t('profile.preferences.interests.mountains') },
    { id: 'cities', label: t('profile.preferences.interests.cities') },
    { id: 'nature', label: t('profile.preferences.interests.nature') },
    { id: 'history', label: t('profile.preferences.interests.history') },
    { id: 'food', label: t('profile.preferences.interests.food') },
    { id: 'art', label: t('profile.preferences.interests.art') },
    { id: 'music', label: t('profile.preferences.interests.music') },
    { id: 'sports', label: t('profile.preferences.interests.sports') },
    { id: 'nightlife', label: t('profile.preferences.interests.nightlife') },
    { id: 'shopping', label: t('profile.preferences.interests.shopping') },
    { id: 'adventure', label: t('profile.preferences.interests.adventure') },
  ];

  const dietaryOptions = [
    { id: 'vegetarian', label: t('profile.preferences.dietaryRestrictions.vegetarian') },
    { id: 'vegan', label: t('profile.preferences.dietaryRestrictions.vegan') },
    { id: 'halal', label: t('profile.preferences.dietaryRestrictions.halal') },
    { id: 'kosher', label: t('profile.preferences.dietaryRestrictions.kosher') },
    { id: 'glutenFree', label: t('profile.preferences.dietaryRestrictions.glutenFree') },
    { id: 'dairyFree', label: t('profile.preferences.dietaryRestrictions.dairyFree') },
  ];

  const toggleInterest = (interest: string) => {
    setInterests(prev =>
      prev.includes(interest)
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  const toggleDietary = (diet: string) => {
    setDietaryRestrictions(prev =>
      prev.includes(diet)
        ? prev.filter(d => d !== diet)
        : [...prev, diet]
    );
  };

  const handleSave = async () => {
    setLoading(true);
    
    // TODO: Implement API call to save all settings
    setTimeout(() => {
      setLoading(false);
      Alert.alert(
        t('common.success'),
        t('settings.saved', { defaultValue: 'Settings saved successfully!' }),
        [{ text: t('common.ok') }]
      );
    }, 1000);
  };

  return (
    <ScrollView className="flex-1 bg-white dark:bg-black">
      <View className="px-4 py-4">
        {/* Travel Style */}
        <View className="mb-4">
          <CustomText weight="bold" className="text-base text-black dark:text-white mb-2">
            {t('profile.preferences.travelStyle', { defaultValue: 'Travel Style' })}
          </CustomText>
          <View className="flex-row flex-wrap gap-2">
            {travelStyles.map(style => (
              <TouchableOpacity
                key={style.id}
                onPress={() => setTravelStyle(style.value)}
                className={`px-3 py-1.5 rounded-full border ${
                  travelStyle === style.value
                    ? 'bg-primary border-primary'
                    : 'bg-white dark:bg-neutral-900 border-gray-300 dark:border-neutral-700'
                }`}
              >
                <CustomText
                  className={`text-sm ${
                    travelStyle === style.value
                      ? 'text-white'
                      : 'text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {style.label}
                </CustomText>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Budget Range */}
        <View className="mb-4">
          <CustomText weight="bold" className="text-base text-black dark:text-white mb-2">
            {t('profile.preferences.budgetRange', { defaultValue: 'Budget Range' })}
          </CustomText>
          <View className="flex-row flex-wrap gap-2">
            {budgetRanges.map(range => (
              <TouchableOpacity
                key={range.id}
                onPress={() => setBudgetRange(range.value)}
                className={`px-3 py-1.5 rounded-full border ${
                  budgetRange === range.value
                    ? 'bg-primary border-primary'
                    : 'bg-white dark:bg-neutral-900 border-gray-300 dark:border-neutral-700'
                }`}
              >
                <CustomText
                  className={`text-sm ${
                    budgetRange === range.value
                      ? 'text-white'
                      : 'text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {range.label}
                </CustomText>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Interests */}
        <View className="mb-4">
          <CustomText weight="bold" className="text-base text-black dark:text-white mb-2">
            {t('profile.preferences.interests', { defaultValue: 'Interests' })}
          </CustomText>
          <View className="flex-row flex-wrap gap-2">
            {interestOptions.map(interest => {
              const isSelected = interests.includes(interest.id);
              return (
                <TouchableOpacity
                  key={interest.id}
                  onPress={() => toggleInterest(interest.id)}
                  className={`px-3 py-1.5 rounded-full border ${
                    isSelected
                      ? 'bg-primary border-primary'
                      : 'bg-white dark:bg-neutral-900 border-gray-300 dark:border-neutral-700'
                  }`}
                >
                  <CustomText
                    className={`text-sm ${
                      isSelected
                        ? 'text-white'
                        : 'text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {interest.label}
                  </CustomText>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Dietary Restrictions */}
        <View className="mb-4">
          <CustomText weight="bold" className="text-base text-black dark:text-white mb-2">
            {t('profile.preferences.dietaryRestrictions', { defaultValue: 'Dietary Restrictions' })}
          </CustomText>
          <View className="flex-row flex-wrap gap-2">
            {dietaryOptions.map(diet => {
              const isSelected = dietaryRestrictions.includes(diet.id);
              return (
                <TouchableOpacity
                  key={diet.id}
                  onPress={() => toggleDietary(diet.id)}
                  className={`px-3 py-1.5 rounded-full border ${
                    isSelected
                      ? 'bg-primary border-primary'
                      : 'bg-white dark:bg-neutral-900 border-gray-300 dark:border-neutral-700'
                  }`}
                >
                  <CustomText
                    className={`text-sm ${
                      isSelected
                        ? 'text-white'
                        : 'text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {diet.label}
                  </CustomText>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Save Button */}
        <View className="mt-2 mb-4">
          <CustomButton
            title={loading ? t('common.saving') : t('common.save')}
            onPress={handleSave}
            disabled={loading}
            IconLeft={() => (
              <Ionicons
                name="checkmark"
                size={20}
                color="#fff"
                style={{ marginRight: 8 }}
              />
            )}
          />
        </View>

        <View className="h-4" />
      </View>
    </ScrollView>
  );
}

