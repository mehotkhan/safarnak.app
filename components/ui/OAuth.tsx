import { View, Text, Image } from 'react-native';
import React from 'react';
import { useTranslation } from 'react-i18next';
import CustomButton from './CustomButton';

interface OAuthProps {
  onGooglePress?: () => void;
  googleIcon?: any;
}

export default function OAuth({ onGooglePress, googleIcon }: OAuthProps) {
  const { t } = useTranslation();
  const handleGoogleSignIn = () => {
    if (onGooglePress) onGooglePress();
  };

  return (
    <View>
      <View className="flex flex-row justify-center items-center mt-4 gap-x-3">
        <View className="flex-1 h-[1px] bg-neutral-100" />
        <Text className="text-lg">{t('oauth.or')}</Text>
        <View className="flex-1 h-[1px] bg-neutral-100" />
      </View>

      <CustomButton
        title={t('oauth.loginWithGoogle')}
        className="mt-5 w-full shadow-none"
        IconLeft={() =>
          googleIcon ? (
            <Image source={googleIcon} resizeMode="contain" className="w-5 h-5 mx-2" />
          ) : null
        }
        bgVariant="outline"
        textVariant="primary"
        onPress={handleGoogleSignIn}
      />
    </View>
  );
}


