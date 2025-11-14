import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { I18nManager, Platform, DevSettings } from 'react-native';
import RNRestart from 'react-native-restart';

interface LanguageContextType {
  currentLanguage: string;
  changeLanguage: (language: string) => Promise<void>;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

const LANGUAGE_STORAGE_KEY = '@safarnak_language';

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [currentLanguage, setCurrentLanguage] = useState('fa'); // Default to Persian
  const { i18n } = useTranslation();
  const isRTL = currentLanguage === 'fa';

  const restartNativeApp = useCallback(async () => {
    if (Platform.OS === 'web') return;
    // Try Expo Updates first (supported in managed/bare)
    try {
      // Avoid multiple concurrent reloads and support environments without expo-updates
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const Updates: any = require('expo-updates');
      if (Updates?.reloadAsync) {
        await Updates.reloadAsync();
        return;
      }
    } catch (e) {
      console.warn('Updates.reloadAsync failed, falling back to RNRestart/DevSettings.', e);
    }
    // Fallback to RNRestart (requires dev client/bare)
    try {
      RNRestart.Restart();
      return;
    } catch (e) {
      console.warn('RNRestart.Restart failed, falling back to DevSettings.reload.', e);
    }
    // Last resort for dev
    try {
      DevSettings.reload();
    } catch (e) {
      console.warn('DevSettings.reload failed; unable to reload app programmatically.', e);
    }
  }, []);

  const loadSavedLanguage = useCallback(async () => {
    try {
      const savedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
      const language = savedLanguage || 'fa';
      setCurrentLanguage(language);
      await i18n.changeLanguage(language);
      // Persist default to avoid repeated init
      if (!savedLanguage) {
        await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, language);
      }
      // Sync native layout direction with selected language
      const shouldBeRTL = language === 'fa';
      // Web: keep document dir in sync
      if (Platform.OS === 'web' && typeof document !== 'undefined') {
        document.documentElement?.setAttribute('dir', shouldBeRTL ? 'rtl' : 'ltr');
      }
      if (I18nManager.isRTL !== shouldBeRTL) {
        try {
          I18nManager.allowRTL(shouldBeRTL);
          I18nManager.forceRTL(shouldBeRTL);
        } catch (e) {
          // Ensure we don't fail silently in production builds
          console.warn('Failed to set RTL direction via I18nManager:', e);
        }
        // Note: RN requires app reload to fully apply RTL/LTR switch.
        // Restart once on first boot if device/app direction was different
        await restartNativeApp();
      }
    } catch (error) {
      console.log('Error loading saved language:', error);
      // Fallback to Persian on error
      setCurrentLanguage('fa');
      await i18n.changeLanguage('fa');
    }
  }, [i18n, restartNativeApp]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadSavedLanguage();
  }, [loadSavedLanguage]);

  const changeLanguage = async (language: string) => {
    try {
      setCurrentLanguage(language);
      await i18n.changeLanguage(language);
      await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, language);
      // Sync native layout direction with selected language
      const shouldBeRTL = language === 'fa';
      // Web: keep document dir in sync
      if (Platform.OS === 'web' && typeof document !== 'undefined') {
        document.documentElement?.setAttribute('dir', shouldBeRTL ? 'rtl' : 'ltr');
      }
      // Always apply direction and force a reliable restart on native
      try {
        I18nManager.allowRTL(shouldBeRTL);
        I18nManager.forceRTL(shouldBeRTL);
      } catch (e) {
        console.warn('Failed to set RTL direction via I18nManager:', e);
      }
      await restartNativeApp();
    } catch (error) {
      console.log('Error saving language:', error);
    }
  };

  return (
    <LanguageContext.Provider value={{ currentLanguage, changeLanguage, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
