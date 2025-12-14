import { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  TouchableOpacity,
  Alert,
  FlatList,
  Dimensions,
  Image,
  I18nManager,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@hooks/useAuth';
import { CustomText } from '@ui/display';
import { CustomButton } from '@ui/forms';
import { Stack } from 'expo-router';
import { useAppSelector } from '@state/hooks';
import { useLanguage } from '@ui/context';
import { Ionicons } from '@expo/vector-icons';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const logoBeta = require('@assets/images/icon.webp');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const onboardingImage1 = require('@assets/images/welcome-onboarding1.webp');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const onboardingImage2 = require('@assets/images/welcome-onboarding2.webp');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const onboardingImage3 = require('@assets/images/welcome-onboarding3.webp');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const onboardingImage4 = require('@assets/images/welcome-onboarding4.webp');

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

// Slides data
const SLIDES = [
  {
    key: 'welcome',
    image: onboardingImage1,
    titleKey: 'onboarding.welcome.title',
    subtitleKey: 'onboarding.welcome.subtitle',
  },
  {
    key: 'ai',
    image: onboardingImage2,
    titleKey: 'onboarding.slides.ai.title',
    subtitleKey: 'onboarding.slides.ai.subtitle',
  },
  {
    key: 'social',
    image: onboardingImage3,
    titleKey: 'onboarding.slides.social.title',
    subtitleKey: 'onboarding.slides.social.subtitle',
  },
  {
    key: 'offline',
    image: onboardingImage4,
    titleKey: 'onboarding.slides.offline.title',
    subtitleKey: 'onboarding.slides.offline.subtitle',
  },
];

// Intro Slider Component
function IntroSlider({
  currentIndex,
  onIndexChange,
}: {
  currentIndex: number;
  onIndexChange: (index: number) => void;
}) {
  const { t } = useTranslation();
  const scrollRef = useRef<FlatList<any>>(null);

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: Array<{ index?: number | null }> }) => {
      if (viewableItems?.length && viewableItems[0].index != null) {
        onIndexChange(viewableItems[0].index);
      }
    },
    [onIndexChange]
  );

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 60,
  };

  return (
    <View className="flex-1 justify-center">
      <FlatList
        ref={scrollRef}
        data={SLIDES}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.key}
        renderItem={({ item }) => (
          <View
            style={{ width: SCREEN_WIDTH }}
            className="items-center justify-center px-8"
          >
            <CustomText weight="bold" className="mb-4 text-center text-4xl text-white">
              {t(item.titleKey)}
            </CustomText>
            <CustomText className="px-4 text-center text-lg leading-7 text-white/95">
              {t(item.subtitleKey)}
            </CustomText>
          </View>
        )}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
      />

      {/* Pagination Dots */}
      <View className="mt-8 flex-row items-center justify-center gap-2">
        {SLIDES.map((slide, index) => (
          <View
            key={slide.key}
            className={`h-2.5 rounded-full transition-all ${
              index === currentIndex
                ? 'w-6 bg-white'
                : 'w-2.5 bg-white/60'
            }`}
          />
        ))}
      </View>
    </View>
  );
}

// Hero Section Component
function HeroSection() {
  const { t } = useTranslation();

  return (
    <View className="mb-8 px-6">
      <View className="rounded-2xl border border-white/20 bg-white/95 p-6 dark:bg-black/95">
        <CustomText weight="bold" className="mb-2 text-lg text-black dark:text-white">
          {t('onboarding.welcome.heroTitle') || 'AI-Powered Trip Planning'}
        </CustomText>
        <CustomText className="mb-4 text-sm text-gray-700 dark:text-gray-300">
          {t('onboarding.welcome.heroDescription') ||
            "Tell us about your trip and Safarnak's AI will design the best route for you."}
        </CustomText>

        {/* Three value props */}
        <View className="mt-4 flex-row items-center justify-between gap-4">
          {/* AI */}
          <View className="flex-1 items-center">
            <Ionicons name="sparkles" size={22} color="#3b82f6" />
            <CustomText className="mt-2 text-xs font-medium text-gray-700 dark:text-gray-300">
              {t('onboarding.welcome.ai') || 'Smart AI'}
            </CustomText>
          </View>
          {/* Social */}
          <View className="flex-1 items-center">
            <Ionicons name="people" size={22} color="#3b82f6" />
            <CustomText className="mt-2 text-xs font-medium text-gray-700 dark:text-gray-300">
              {t('onboarding.welcome.social') || 'Travel together'}
            </CustomText>
          </View>
          {/* Offline */}
          <View className="flex-1 items-center">
            <Ionicons name="cloud-offline" size={22} color="#3b82f6" />
            <CustomText className="mt-2 text-xs font-medium text-gray-700 dark:text-gray-300">
              {t('onboarding.welcome.offline') || 'Offline ready'}
            </CustomText>
          </View>
        </View>
      </View>
    </View>
  );
}

// CTA Section Component
function CTASection({
  loading,
  onStartWithAITrip,
  onJustLookAround,
}: {
  loading: boolean;
  onStartWithAITrip: () => void;
  onJustLookAround: () => void;
}) {
  const { t } = useTranslation();

  return (
    <View className="mt-4 px-6 pb-8">
      <CustomButton
        title={t('onboarding.welcome.startAITrip') || 'Start with AI Trip'}
        onPress={onStartWithAITrip}
        loading={loading}
        className="mb-3"
      />
      <View className="mb-4">
        <TouchableOpacity
          onPress={onJustLookAround}
          disabled={loading}
          className="flex w-full flex-row items-center justify-center rounded-full border border-white/30 bg-transparent p-3"
        >
          {loading ? (
            <ActivityIndicator color="#ffffff" size="small" />
          ) : (
            <CustomText className="text-lg font-bold text-white">
              {t('onboarding.welcome.justLookAround') || 'Just look around'}
            </CustomText>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

// Main Welcome Screen
export default function WelcomeScreen() {
  const { t } = useTranslation();
  const { currentLanguage, changeLanguage } = useLanguage();
  const { loadStoredUsername, registerUser, loginAndValidate } = useAuth();
  const { isAuthenticated } = useAppSelector(state => state.auth);
  const [storedUsername, setStoredUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  const { user } = useAppSelector(state => state.auth);

  // Auto-redirect if already authenticated and active
  useEffect(() => {
    if (isAuthenticated && user && user.status === 'active') {
      router.replace('/(app)/(home)' as any);
    }
  }, [isAuthenticated, user]);

  // Load stored username on mount
  useEffect(() => {
    (async () => {
      const existing = await loadStoredUsername();
      setStoredUsername(existing);
    })();
  }, [loadStoredUsername]);

  const generateRandomUsername = (): string => {
    const prefix = 'traveler';
    const random = Math.floor(Math.random() * 10000);
    return `${prefix}-${random}`;
  };

  const handleStartWithAITrip = async () => {
    if (storedUsername) {
      // Existing user - login and go to AI trip wizard
      setLoading(true);
      const result = await loginAndValidate(storedUsername);
      setLoading(false);
      if (result) {
        router.replace('/(app)/(trips)/new' as any);
      }
    } else {
      // New user - show dialog
      Alert.alert(
        t('onboarding.welcome.chooseUsername') || 'Choose Username',
        t('onboarding.welcome.chooseUsernameMessage') || 'How would you like to proceed?',
        [
          {
            text: t('onboarding.welcome.autoGenerate') || 'Let Safarnak choose',
            onPress: async () => {
              setLoading(true);
              const randomUsername = generateRandomUsername();
              const result = await registerUser(randomUsername);
              setLoading(false);
              if (result) {
                router.replace('/(app)/(trips)/new' as any);
              }
            },
          },
          {
            text: t('onboarding.welcome.chooseMyself') || 'Let me pick',
            onPress: () => router.push('/(auth)/register' as any),
          },
          { text: t('common.cancel') || 'Cancel', style: 'cancel' },
        ]
      );
    }
  };

  const handleJustLookAround = async () => {
    setLoading(true);
    const randomUsername = generateRandomUsername();
    const result = await registerUser(randomUsername);
    setLoading(false);
    if (result) {
      router.replace('/(app)/(home)' as any);
    }
  };

  const languages = [
    { code: 'en', name: t('language.enNative') },
    { code: 'fa', name: t('language.faNative') },
  ];

  const currentLang = languages.find(l => l.code === currentLanguage) || languages[0];

  const currentSlide = SLIDES[currentSlideIndex];

  return (
    <View className="flex-1">
      <Stack.Screen options={{ headerShown: false }} />
      
      {/* Full-screen background image */}
      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 0,
        }}
      >
        <Image
          source={currentSlide.image}
          style={{
            width: SCREEN_WIDTH,
            height: SCREEN_HEIGHT,
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
          resizeMode="cover"
        />
        {/* Dark overlay for text readability */}
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          }}
        />
      </View>

      {/* Header - transparent */}
      <View
        className="px-5 pb-4 pt-12"
        style={{ zIndex: 10 }}
      >
        <View className="flex-row items-center justify-between">
          <Image source={logoBeta} className="size-16" resizeMode="contain" />
          <View style={{ position: 'relative' }}>
            <TouchableOpacity
              onPress={() => setLanguageDropdownOpen(!languageDropdownOpen)}
              className="flex-row items-center justify-center rounded-full bg-white/20 px-3 py-1.5 backdrop-blur"
            >
              <CustomText className="text-base font-medium text-white ltr:mr-1 rtl:ml-1">
                {currentLang.name}
              </CustomText>
              <Ionicons
                name={languageDropdownOpen ? 'chevron-up' : 'chevron-down'}
                size={16}
                color="#ffffff"
              />
            </TouchableOpacity>

            {languageDropdownOpen && (
              <View
                className="absolute z-50 mt-2 rounded-xl bg-white dark:bg-neutral-900 ltr:right-0 rtl:left-0"
                style={{
                  minWidth: 140,
                  paddingVertical: 4,
                  shadowColor: '#000',
                  shadowOpacity: 0.25,
                  shadowRadius: 8,
                  shadowOffset: { width: 0, height: 4 },
                  elevation: 8,
                }}
              >
                {languages.map((lang) => (
                  <TouchableOpacity
                    key={lang.code}
                    onPress={() => {
                      changeLanguage(lang.code);
                      setLanguageDropdownOpen(false);
                    }}
                    className={`flex-row items-center px-3 py-2 ${
                      currentLanguage === lang.code ? 'bg-gray-50 dark:bg-neutral-800' : ''
                    }`}
                  >
                    <CustomText className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {lang.name}
                    </CustomText>
                    {currentLanguage === lang.code && (
                      <Ionicons
                        name="checkmark"
                        size={16}
                        color="#10b981"
                        style={{ [I18nManager.isRTL ? 'marginRight' : 'marginLeft']: 'auto' } as any }
                      />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        </View>
      </View>

      {/* Main Content - above background */}
      <View
        className="flex-1"
        style={{ zIndex: 10 }}
      >
        {/* Centered Slider */}
        <IntroSlider
          currentIndex={currentSlideIndex}
          onIndexChange={setCurrentSlideIndex}
        />

        {/* Hero Card + Value Props */}
        <HeroSection />

        {/* CTA Buttons */}
        <CTASection
          loading={loading}
          onStartWithAITrip={handleStartWithAITrip}
          onJustLookAround={handleJustLookAround}
        />
      </View>
    </View>
  );
}

