import { View, Text, TouchableOpacity, Image, StyleSheet, I18nManager } from 'react-native';
import React, { useRef, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Swiper from 'react-native-swiper';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@components/context/LanguageContext';
import CustomButton from '@components/ui/CustomButton';
import Colors from '@constants/Colors';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const splashImage = require('../../assets/images/welcome-splash.png');

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
  ];

  const isLastSlide = activeIndex === onboarding.length - 1;

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        onPress={() => router.push('/auth/login' as any)}
        style={[styles.skipButton, isRTL && styles.skipButtonRTL]}
      >
        <Text style={styles.skipText}>{t('welcome.skip')}</Text>
      </TouchableOpacity>

      <Swiper
        ref={swiperRef}
        loop={false}
        dot={<View style={styles.dot} />}
        activeDot={<View style={styles.activeDot} />}
        onIndexChanged={(index) => setActiveIndex(index)}
        containerStyle={isRTL ? { transform: [{ scaleX: -1 }] } : {}}
      >
        {onboarding.map((item) => (
          <View key={item.id} style={[styles.slide, isRTL && { transform: [{ scaleX: -1 }] }]}>
            <Image source={item.image} style={styles.image} resizeMode="contain" />
            <View style={styles.textContainer}>
              <Text style={styles.title}>{item.title}</Text>
            </View>
            <Text style={styles.description}>{item.description}</Text>
          </View>
        ))}
      </Swiper>

      <View style={styles.buttonContainer}>
        <CustomButton
          title={isLastSlide ? t('welcome.getStarted') : t('welcome.next')}
          onPress={() =>
            isLastSlide
              ? router.push('/auth/login' as any)
              : swiperRef.current?.scrollBy(1)
          }
          bgVariant="primary"
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  skipButton: {
    width: '100%',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  skipButtonRTL: {
    alignItems: 'flex-start',
  },
  skipText: {
    color: Colors.light.primary,
    fontSize: 16,
    fontWeight: '700',
  },
  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  image: {
    width: '100%',
    height: 300,
  },
  textContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginTop: 40,
  },
  title: {
    color: Colors.light.primary,
    fontWeight: '700',
    fontSize: 28,
    marginHorizontal: 40,
    textAlign: 'center',
  },
  description: {
    color: '#6b7280',
    textAlign: 'center',
    fontSize: 16,
    marginTop: 12,
    marginHorizontal: 40,
    fontWeight: '600',
    lineHeight: 24,
  },
  dot: {
    width: 32,
    height: 4,
    marginHorizontal: 4,
    backgroundColor: '#f1f5f9',
    borderRadius: 2,
  },
  activeDot: {
    width: 32,
    height: 4,
    marginHorizontal: 4,
    backgroundColor: Colors.light.primary,
    borderRadius: 2,
  },
  buttonContainer: {
    width: '100%',
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
});
