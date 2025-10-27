import { View, Text, TouchableOpacity, Image, StyleSheet, I18nManager } from 'react-native';
import React, { useRef, useState } from 'react';
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
    {
      id: 4,
      title: t('welcome.onboarding4.title'),
      description: t('welcome.onboarding4.description'),
      image: splashImage,
    },
  ];

  const isLastSlide = activeIndex === onboarding.length - 1;

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={() => router.push('/auth/login' as any)}
          style={[styles.skipButton, isRTL && styles.skipButtonRTL]}
        >
          <Text style={styles.skipText}>{t('welcome.skip')}</Text>
        </TouchableOpacity>
      </View>

      <Swiper
        ref={swiperRef}
        loop={false}
        dot={<View style={styles.dot} />}
        activeDot={<View style={styles.activeDot} />}
        onIndexChanged={(index) => setActiveIndex(index)}
        containerStyle={isRTL ? { transform: [{ scaleX: -1 }] } : {}}
        paginationStyle={{ bottom: 20 }}
      >
        {onboarding.map((item) => (
          <View key={item.id} style={[styles.slide, isRTL && { transform: [{ scaleX: -1 }] }]}>
            <Image source={item.image} style={styles.image} resizeMode="cover" />
            <View style={styles.overlay}>
              <View style={styles.textCard}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.description}>{item.description}</Text>
              </View>
            </View>
          </View>
        ))}
      </Swiper>

      <View style={styles.buttonFixed}>
        <CustomButton
          title={isLastSlide ? t('welcome.getStarted') : t('welcome.next')}
          onPress={() =>
            isLastSlide
              ? router.push('/auth/login' as any)
              : swiperRef.current?.scrollBy(1)
          }
          bgVariant="primary"
          className="mb-4"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 20,
  },
  skipButton: {
    alignSelf: 'flex-end',
  },
  skipButtonRTL: {
    alignSelf: 'flex-start',
  },
  skipText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  slide: {
    flex: 1,
    position: 'relative',
  },
  image: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: 120,
    paddingHorizontal: 20,
  },
  textCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  textContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  title: {
    color: Colors.light.primary,
    fontWeight: '700',
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 8,
  },
  description: {
    color: '#4b5563',
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '500',
    lineHeight: 22,
  },
  dot: {
    width: 32,
    height: 4,
    marginHorizontal: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 2,
  },
  activeDot: {
    width: 32,
    height: 4,
    marginHorizontal: 4,
    backgroundColor: Colors.light.primary,
    borderRadius: 2,
  },
  buttonFixed: {
    position: 'absolute',
    bottom: 80,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    zIndex: 20,
  },
});
