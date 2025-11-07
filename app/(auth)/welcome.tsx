import { View, Text, TouchableOpacity, Image } from 'react-native';
import React, { useRef, useState, useEffect } from 'react';
import { router } from 'expo-router';
import PagerView from 'react-native-pager-view';
import { useTranslation } from 'react-i18next';
import CustomButton from '@components/ui/CustomButton';
import { Stack } from 'expo-router';
import { useLanguage } from '@components/context/LanguageContext';
import { Ionicons } from '@expo/vector-icons';
import { useAppSelector } from '@store/hooks';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const onboardingImage1 = require('@assets/images/welcome-onboarding1.jpg');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const onboardingImage2 = require('@assets/images/welcome-onboarding2.jpg');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const onboardingImage3 = require('@assets/images/welcome-onboarding3.jpg');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const onboardingImage4 = require('@assets/images/welcome-onboarding4.jpg');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const onboardingImage5 = require('@assets/images/welcome-onboarding5.jpg');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const logoBeta = require('@assets/images/icon.png');

export default function WelcomeScreen() {
  const { t } = useTranslation();
  const { currentLanguage, changeLanguage } = useLanguage();
  const { isAuthenticated } = useAppSelector(state => state.auth);
  const pagerRef = useRef<PagerView>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);

  // Auto-redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/(app)/(feed)' as any);
    }
  }, [isAuthenticated]);

  const languages = [
    { code: 'en', name: t('language.enNative') },
    { code: 'fa', name: t('language.faNative') },
  ];

  const currentLang = languages.find(l => l.code === currentLanguage) || languages[0];

  const onboarding = [
    {
      id: 1,
      title: t('welcome.onboarding1.title'),
      description: t('welcome.onboarding1.description'),
      image: onboardingImage1,
    },
    {
      id: 2,
      title: t('welcome.onboarding2.title'),
      description: t('welcome.onboarding2.description'),
      image: onboardingImage2,
    },
    {
      id: 3,
      title: t('welcome.onboarding3.title'),
      description: t('welcome.onboarding3.description'),
      image: onboardingImage3,
    },
    {
      id: 4,
      title: t('welcome.onboarding4.title'),
      description: t('welcome.onboarding4.description'),
      image: onboardingImage4,
    },
    {
      id: 5,
      title: t('welcome.onboarding5.title'),
      description: t('welcome.onboarding5.description'),
      image: onboardingImage5,
    },
  ];

  const isLastSlide = activeIndex === onboarding.length - 1;

  return (
    <View className="flex-1 bg-black">
      <Stack.Screen options={{ title: t('common.appName') }} />
      <View className="absolute top-0 left-0 right-0 z-10 pt-12 pb-4 px-5 bg-black/30">
        <View className="flex-row items-center justify-between">
          <Image source={logoBeta} className="w-16 h-16" resizeMode="contain" />
          <View className="flex-row items-center justify-center gap-4">
            <TouchableOpacity
              onPress={() => router.push('/(auth)/register' as any)}
              className="self-center"
            >
              <Text className="text-white text-lg font-bold">{t('welcome.skip')}</Text>
            </TouchableOpacity>
            <View style={{ position: 'relative' }}>
              <TouchableOpacity
                onPress={() => setLanguageDropdownOpen(!languageDropdownOpen)}
                className="flex-row items-center justify-center rounded-full px-3 py-1.5"
              >
                <Text className="text-white text-base font-medium mr-1">
                  {currentLang.name}
                </Text>
                <Ionicons
                  name={languageDropdownOpen ? 'chevron-up' : 'chevron-down'}
                  size={16}
                  color="#ffffff"
                />
              </TouchableOpacity>

              {languageDropdownOpen && (
                <View
                  className="absolute z-50 mt-2 right-0 rounded-xl bg-white dark:bg-neutral-900"
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
                      <Text className="text-sm text-gray-900 dark:text-gray-100 font-medium">
                        {lang.name}
                      </Text>
                      {currentLanguage === lang.code && (
                        <Ionicons
                          name="checkmark"
                          size={16}
                          color="#10b981"
                          style={{ marginLeft: 'auto' }}
                        />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          </View>
        </View>
      </View>

      <PagerView
        ref={pagerRef}
        style={{ flex: 1 }}
        initialPage={0}
        onPageSelected={(e) => setActiveIndex(e.nativeEvent.position)}
      >
        {onboarding.map((item) => (
          <View key={item.id} className="flex-1">
            <Image source={item.image} className="absolute w-full h-full" resizeMode="cover" />
            <View className="flex-1 justify-end pb-28 px-5">
              <View className="bg-white/90 rounded-2xl p-6 shadow-lg">
                <Text className="text-[#30D5C8] font-bold text-2xl text-center mb-2">{item.title}</Text>
                <Text className="text-gray-700 text-center text-[15px] font-medium leading-6">{item.description}</Text>
              </View>
            </View>
          </View>
        ))}
      </PagerView>

      {/* Pagination Dots */}
      <View className="absolute bottom-32 left-0 right-0 flex-row justify-center items-center">
        {onboarding.map((_, index) => (
          <View
            key={index}
            className={`w-8 h-1 mx-1 rounded ${
              index === activeIndex ? 'bg-[#30D5C8]' : 'bg-white/40'
            }`}
          />
        ))}
      </View>

      <View className="absolute bottom-10 left-0 right-0 px-6 z-20">
        <CustomButton
          title={isLastSlide ? t('welcome.getStarted') : t('welcome.next')}
          onPress={() => {
            if (isLastSlide) {
              router.push('/(auth)/register' as any);
            } else {
              pagerRef.current?.setPage(activeIndex + 1);
            }
          }}
          bgVariant="primary"
          className="shadow-xl"
        />
      </View>
    </View>
  );
}
