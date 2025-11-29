import { useCallback } from 'react';
import { Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '@state/hooks';
import { router } from 'expo-router';

/**
 * Hook to check if user is active and show activation screen if not
 * Returns a function that can be called before allowing actions
 */
export const useActivationGuard = () => {
  const { t } = useTranslation();
  const { user } = useAppSelector(state => state.auth);

  const checkActivation = useCallback(
    (action: () => void) => {
      if (!user || user.status !== 'active') {
        Alert.alert(
          t('auth.activationRequired.title') || 'Activation Required',
          t('auth.activationRequired.message') ||
            'Please complete your profile activation to use this feature.',
          [
            {
              text: t('common.ok') || 'OK',
              onPress: () => {
                // Navigate to profile or activation screen
                router.push('/(app)/(me)' as any);
              },
            },
          ]
        );
        return false;
      }
      action();
      return true;
    },
    [user, t]
  );

  const isActive = user?.status === 'active';

  return { checkActivation, isActive };
};

