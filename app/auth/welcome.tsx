import { CustomText } from '@components/ui/CustomText';
import { View } from '@components/ui/Themed';
import { router } from 'expo-router';
import React from 'react';
import { Image } from 'react-native';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const splashIcon = require('../../assets/images/splash-icon.png');
import { useTranslation } from 'react-i18next';
import CustomButton from '@components/ui/CustomButton';

export default function WelcomeScreen() {
  const { t } = useTranslation();

  return (
    <View style={{ flex: 1, padding: 24, justifyContent: 'center' }}>
      <View className="items-center mb-10">
        <Image source={splashIcon} resizeMode="contain" style={{ width: 200, height: 200 }} />
      </View>

      <CustomText weight="bold" style={{ fontSize: 28, textAlign: 'center', marginBottom: 12 }}>
        {t('welcome.title')}
      </CustomText>
      <CustomText style={{ fontSize: 16, textAlign: 'center' }}>
        {t('welcome.subtitle')}
      </CustomText>

      <View style={{ marginTop: 32 }}>
        <CustomButton title={t('welcome.getStarted')} onPress={() => router.push('/auth/login' as any)} />
      </View>
    </View>
  );
}


