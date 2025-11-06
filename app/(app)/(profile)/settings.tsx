import { useState } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { Stack, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { CustomText } from '@components/ui/CustomText';
import CustomButton from '@components/ui/CustomButton';
import { LanguageSwitcher } from '@components/context/LanguageSwitcher';
import { ThemeToggle } from '@components/ui/ThemeToggle';
import { useTheme } from '@components/context/ThemeContext';
import Colors from '@constants/Colors';

interface SettingRowProps {
  icon: any;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  rightComponent?: React.ReactNode;
  isDark: boolean;
}

const SettingRow = ({ icon, title, subtitle, onPress, rightComponent, isDark }: SettingRowProps) => (
  <TouchableOpacity
    onPress={onPress}
    disabled={!onPress}
    className="flex-row items-center py-4 border-b border-gray-200 dark:border-neutral-800"
  >
    <View className="w-10 h-10 rounded-full bg-gray-100 dark:bg-neutral-900 items-center justify-center mr-3">
      <Ionicons name={icon} size={20} color={isDark ? '#9ca3af' : '#6b7280'} />
    </View>
    <View className="flex-1">
      <CustomText weight="medium" className="text-base text-black dark:text-white">
        {title}
      </CustomText>
      {subtitle && (
        <CustomText className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {subtitle}
        </CustomText>
      )}
    </View>
    {rightComponent || (
      onPress && <Ionicons name="chevron-forward" size={20} color={isDark ? '#666' : '#9ca3af'} />
    )}
  </TouchableOpacity>
);

interface ToggleRowProps {
  icon: any;
  title: string;
  subtitle: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  isDark: boolean;
}

const ToggleRow = ({ 
  icon, 
  title, 
  subtitle, 
  value, 
  onValueChange, 
  isDark,
}: ToggleRowProps) => {
  const color = isDark ? Colors.dark.primary : Colors.light.primary;
  
  return (
    <View className="flex-row items-center py-4 border-b border-gray-200 dark:border-neutral-800">
      <View
        className="w-10 h-10 rounded-full items-center justify-center mr-3"
        style={{ backgroundColor: color + '20' }}
      >
        <Ionicons name={icon} size={20} color={color} />
      </View>
      <View className="flex-1">
        <CustomText weight="medium" className="text-base text-black dark:text-white">
          {title}
        </CustomText>
        <CustomText className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {subtitle}
        </CustomText>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: '#767577', true: color }}
        thumbColor={value ? '#fff' : '#f4f3f4'}
      />
    </View>
  );
};

interface PreferenceOption {
  id: string;
  label: string;
  value: string;
}

// Note: travelStyles and budgetRanges are now defined inside the component to access t()

export default function SettingsScreen() {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const params = useLocalSearchParams<{ section?: string }>();
  const getInitialSection = (): 'app' | 'preferences' | 'privacy' | 'notifications' => {
    if (params.section && ['app', 'preferences', 'privacy', 'notifications'].includes(params.section)) {
      return params.section as 'app' | 'preferences' | 'privacy' | 'notifications';
    }
    return 'app';
  };
  const [selectedSection, setSelectedSection] = useState<'app' | 'preferences' | 'privacy' | 'notifications'>(getInitialSection());
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

  // App Settings
  const handleDataManagement = () => {
    Alert.alert(t('settings.dataManagement'), t('settings.dataManagementComingSoon', { 
      defaultValue: 'Data management feature coming soon!' 
    }));
  };

  const handleAbout = () => {
    Alert.alert(t('settings.about'), `${t('common.appName')} v0.9.2\n\n${t('settings.aboutDescription', { 
      defaultValue: 'Your offline-first travel companion' 
    })}`);
  };

  // Preferences
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

  // Privacy
  const [profileVisibility, setProfileVisibility] = useState(true);
  const [activityStatus, setActivityStatus] = useState(true);
  const [dataSharing, setDataSharing] = useState(false);
  const [analytics, setAnalytics] = useState(true);
  const [locationTracking, setLocationTracking] = useState(false);

  // Notifications
  const [pushNotifications, setPushNotifications] = useState(true);
  const [tripUpdates, setTripUpdates] = useState(true);
  const [tourBookings, setTourBookings] = useState(true);
  const [messages, setMessages] = useState(true);
  const [promotional, setPromotional] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(false);

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

  const renderSectionContent = () => {
    switch (selectedSection) {
      case 'app':
        return (
          <>
            <View className="mb-4">
              <CustomText weight="bold" className="text-sm text-gray-500 dark:text-gray-400 mb-2 uppercase">
                {t('settings.appSettings', { defaultValue: 'App Settings' })}
              </CustomText>
              <View className="bg-white dark:bg-neutral-900 rounded-2xl px-4">
                <SettingRow
                  icon="language-outline"
                  title={t('profile.language')}
                  subtitle={t('profile.languageSubtitle', { defaultValue: 'Change app language' })}
                  rightComponent={<LanguageSwitcher />}
                  isDark={isDark}
                />
                <SettingRow
                  icon={isDark ? 'moon' : 'sunny'}
                  title={t('profile.theme')}
                  subtitle={isDark ? t('profile.darkMode') : t('profile.lightMode')}
                  rightComponent={<ThemeToggle />}
                  isDark={isDark}
                />
              </View>
            </View>

            <View className="mb-4">
              <CustomText weight="bold" className="text-sm text-gray-500 dark:text-gray-400 mb-2 uppercase">
                {t('settings.dataInfo', { defaultValue: 'Data & Info' })}
              </CustomText>
              <View className="bg-white dark:bg-neutral-900 rounded-2xl px-4">
                <SettingRow
                  icon="server-outline"
                  title={t('settings.dataManagement')}
                  subtitle={t('settings.downloadDeleteData', { defaultValue: 'Download or delete your data' })}
                  onPress={handleDataManagement}
                  isDark={isDark}
                />
                <SettingRow
                  icon="information-circle-outline"
                  title={t('settings.aboutApp', { app: t('common.appName') })}
                  subtitle={`${t('settings.version', { defaultValue: 'Version' })}: 0.9.2`}
                  onPress={handleAbout}
                  isDark={isDark}
                />
              </View>
            </View>
          </>
        );

      case 'preferences':
        return (
          <>
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
          </>
        );

      case 'privacy':
        return (
          <View className="mb-4">
            <View className="bg-white dark:bg-neutral-900 rounded-2xl px-4">
              <ToggleRow
                icon="eye-outline"
                title={t('profile.privacy.publicProfile', { defaultValue: 'Public Profile' })}
                subtitle={t('profile.privacy.publicProfileSubtitle', { 
                  defaultValue: 'Allow others to view your profile' 
                })}
                value={profileVisibility}
                onValueChange={setProfileVisibility}
                isDark={isDark}
              />
              <ToggleRow
                icon="radio-button-on-outline"
                title={t('profile.privacy.showActivity', { defaultValue: 'Show Activity Status' })}
                subtitle={t('profile.privacy.showActivitySubtitle', { 
                  defaultValue: 'Show when you are online' 
                })}
                value={activityStatus}
                onValueChange={setActivityStatus}
                isDark={isDark}
              />
              <ToggleRow
                icon="location-outline"
                title={t('profile.privacy.locationTracking', { defaultValue: 'Location Tracking' })}
                subtitle={t('profile.privacy.locationTrackingSubtitle', { 
                  defaultValue: 'Allow location access for better trip recommendations' 
                })}
                value={locationTracking}
                onValueChange={setLocationTracking}
                isDark={isDark}
              />
              <ToggleRow
                icon="share-outline"
                title={t('profile.privacy.dataSharing', { defaultValue: 'Data Sharing' })}
                subtitle={t('profile.privacy.dataSharingSubtitle', { 
                  defaultValue: 'Share anonymized data to improve our services' 
                })}
                value={dataSharing}
                onValueChange={setDataSharing}
                isDark={isDark}
              />
              <ToggleRow
                icon="analytics-outline"
                title={t('profile.privacy.analytics', { defaultValue: 'Analytics' })}
                subtitle={t('profile.privacy.analyticsSubtitle', { 
                  defaultValue: 'Help us improve by sharing usage analytics' 
                })}
                value={analytics}
                onValueChange={setAnalytics}
                isDark={isDark}
              />
            </View>
          </View>
        );

      case 'notifications':
        return (
          <View className="mb-4">
            <View className="bg-white dark:bg-neutral-900 rounded-2xl px-4">
              <ToggleRow
                icon="notifications-outline"
                title={t('profile.notifications.enablePush', { defaultValue: 'Enable Push Notifications' })}
                subtitle={t('profile.notifications.enablePushSubtitle', { 
                  defaultValue: 'Receive notifications on your device' 
                })}
                value={pushNotifications}
                onValueChange={setPushNotifications}
                isDark={isDark}
              />
              <ToggleRow
                icon="airplane-outline"
                title={t('profile.notifications.tripUpdates', { defaultValue: 'Trip Updates' })}
                subtitle={t('profile.notifications.tripUpdatesSubtitle', { 
                  defaultValue: 'Notifications about your trips' 
                })}
                value={tripUpdates}
                onValueChange={setTripUpdates}
                isDark={isDark}
              />
              <ToggleRow
                icon="map-outline"
                title={t('profile.notifications.tourBookings', { defaultValue: 'Tour Bookings' })}
                subtitle={t('profile.notifications.tourBookingsSubtitle', { 
                  defaultValue: 'Notifications about tour bookings' 
                })}
                value={tourBookings}
                onValueChange={setTourBookings}
                isDark={isDark}
              />
              <ToggleRow
                icon="mail-outline"
                title={t('profile.notifications.messages', { defaultValue: 'Messages' })}
                subtitle={t('profile.notifications.messagesSubtitle', { 
                  defaultValue: 'Notifications about new messages' 
                })}
                value={messages}
                onValueChange={setMessages}
                isDark={isDark}
              />
              <ToggleRow
                icon="megaphone-outline"
                title={t('profile.notifications.promotional', { defaultValue: 'Promotional' })}
                subtitle={t('profile.notifications.promotionalSubtitle', { 
                  defaultValue: 'Special offers and promotions' 
                })}
                value={promotional}
                onValueChange={setPromotional}
                isDark={isDark}
              />
              <ToggleRow
                icon="mail-outline"
                title={t('profile.notifications.enableEmail', { defaultValue: 'Email Notifications' })}
                subtitle={t('profile.notifications.enableEmailSubtitle', { 
                  defaultValue: 'Receive notifications via email' 
                })}
                value={emailNotifications}
                onValueChange={setEmailNotifications}
                isDark={isDark}
              />
            </View>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <View className="flex-1 bg-white dark:bg-black">
      <Stack.Screen options={{ title: t('profile.settings') }} />

      {/* Section Tabs */}
      <View className="px-6 pt-4 pb-2 border-b border-gray-200 dark:border-neutral-800">
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View className="flex-row gap-2">
            <TouchableOpacity
              onPress={() => setSelectedSection('app')}
              className={`px-4 py-2 rounded-full ${
                selectedSection === 'app'
                  ? 'bg-primary'
                  : 'bg-gray-100 dark:bg-neutral-900'
              }`}
            >
              <CustomText
                weight="medium"
                className={`text-sm ${
                  selectedSection === 'app'
                    ? 'text-white'
                    : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                {t('settings.app', { defaultValue: 'App' })}
              </CustomText>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setSelectedSection('preferences')}
              className={`px-4 py-2 rounded-full ${
                selectedSection === 'preferences'
                  ? 'bg-primary'
                  : 'bg-gray-100 dark:bg-neutral-900'
              }`}
            >
              <CustomText
                weight="medium"
                className={`text-sm ${
                  selectedSection === 'preferences'
                    ? 'text-white'
                    : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                {t('settings.preferences', { defaultValue: 'Preferences' })}
              </CustomText>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setSelectedSection('privacy')}
              className={`px-4 py-2 rounded-full ${
                selectedSection === 'privacy'
                  ? 'bg-primary'
                  : 'bg-gray-100 dark:bg-neutral-900'
              }`}
            >
              <CustomText
                weight="medium"
                className={`text-sm ${
                  selectedSection === 'privacy'
                    ? 'text-white'
                    : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                {t('settings.privacy', { defaultValue: 'Privacy' })}
              </CustomText>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setSelectedSection('notifications')}
              className={`px-4 py-2 rounded-full ${
                selectedSection === 'notifications'
                  ? 'bg-primary'
                  : 'bg-gray-100 dark:bg-neutral-900'
              }`}
            >
              <CustomText
                weight="medium"
                className={`text-sm ${
                  selectedSection === 'notifications'
                    ? 'text-white'
                    : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                {t('settings.notifications', { defaultValue: 'Notifications' })}
              </CustomText>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>

      <ScrollView className="flex-1">
        <View className="px-6 py-4">
          {renderSectionContent()}

          {/* Save Button (for preferences section) */}
          {selectedSection === 'preferences' && (
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
          )}

          <View className="h-4" />
        </View>
      </ScrollView>
    </View>
  );
}
