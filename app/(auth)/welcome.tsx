import { View, Text, TouchableOpacity, Image, I18nManager } from 'react-native';
import React, { useRef, useState } from 'react';
import { router } from 'expo-router';
import Swiper from 'react-native-swiper';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@components/context/LanguageContext';
import CustomButton from '@components/ui/CustomButton';
import { Stack } from 'expo-router';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const splashImage = require('@assets/images/welcome-splash.png');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const logoBeta = require('@assets/images/icon.png');

export default function WelcomeScreen() {
  const { t } = useTranslation();
  const { currentLanguage } = useLanguage();
  const swiperRef = useRef<Swiper>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const isRTL = currentLanguage === 'fa' || I18nManager.isRTL;

  const onboarding = [
    {
      id: 1,
      title: t('welcome.onboarding1.title'),
      description: t('welcome.onboarding1.description'),
      image: splashImage,
    },
    {
      id: 2,
      title: t('welcome.onboarding2.title'),
      description: t('welcome.onboarding2.description'),
      image: splashImage,
    },
    {
      id: 3,
      title: t('welcome.onboarding3.title'),
      description: t('welcome.onboarding3.description'),
      image: splashImage,
    },
    {
      id: 4,
      title: t('welcome.onboarding4.title'),
      description: t('welcome.onboarding4.description'),
      image: splashImage,
    },
    {
      id: 5,
      title: t('welcome.onboarding5.title'),
      description: t('welcome.onboarding5.description'),
      image: splashImage,
    },
  ];

  const isLastSlide = activeIndex === onboarding.length - 1;

  return (
    <View className="flex-1 bg-black">
      <Stack.Screen options={{ title: t('common.appName') }} />
      <View className="absolute top-0 left-0 right-0 z-10 pt-12 pb-4 px-5 bg-black/30">
        <View className="flex-row items-center justify-between">
          <Image source={logoBeta} className="w-12 h-12" resizeMode="contain" />
          <TouchableOpacity
            onPress={() => router.push('/(auth)/login' as any)}
            className={isRTL ? 'self-start' : 'self-end'}
          >
            <Text className="text-white text-base font-bold">{t('welcome.skip')}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Swiper
        ref={swiperRef}
        loop={false}
        dot={<View className="w-8 h-1 mx-1 bg-white/40 rounded" />}
        activeDot={<View className="w-8 h-1 mx-1 bg-[#30D5C8] rounded" />}
        onIndexChanged={(index) => setActiveIndex(index)}
        containerStyle={isRTL ? { transform: [{ scaleX: -1 }] } : {}}
        paginationStyle={{ bottom: 20 }}
      >
        {onboarding.map((item) => (
          <View key={item.id} className="flex-1" style={isRTL ? { transform: [{ scaleX: -1 }] } : {}}>
            <Image source={item.image} className="absolute w-full h-full" resizeMode="cover" />
            <View className="flex-1 justify-end pb-28 px-5">
              <View className="bg-white/90 rounded-2xl p-6 shadow-lg">
                <Text className="text-[#30D5C8] font-bold text-2xl text-center mb-2">{item.title}</Text>
                <Text className="text-gray-700 text-center text-[15px] font-medium leading-6">{item.description}</Text>
              </View>
            </View>
          </View>
        ))}
      </Swiper>

      <View className="absolute bottom-10 left-0 right-0 px-6 z-20">
        <CustomButton
          title={isLastSlide ? t('welcome.getStarted') : t('welcome.next')}
          onPress={() => {
            if (isLastSlide) {
              router.push('/(auth)/login' as any);
            } else {
              swiperRef.current?.scrollBy(1);
            }
          }}
          bgVariant="primary"
          className="shadow-xl"
        />
      </View>
    </View>
  );
}
