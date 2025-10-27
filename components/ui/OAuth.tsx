import { View, Text, Image, StyleSheet } from 'react-native';
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
    <View style={styles.container}>
      <View style={styles.dividerContainer}>
        <View style={styles.divider} />
        <Text style={styles.orText}>{t('oauth.or')}</Text>
        <View style={styles.divider} />
      </View>

      <CustomButton
        title={t('oauth.loginWithGoogle')}
        IconLeft={() =>
          googleIcon ? (
            <Image source={googleIcon} resizeMode="contain" style={styles.googleIcon} />
          ) : null
        }
        bgVariant="outline"
        textVariant="primary"
        onPress={handleGoogleSignIn}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  dividerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 16,
    gap: 12,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#f5f5f5',
  },
  orText: {
    fontSize: 16,
    color: '#6b7280',
  },
  googleIcon: {
    width: 20,
    height: 20,
    marginHorizontal: 8,
  },
});
