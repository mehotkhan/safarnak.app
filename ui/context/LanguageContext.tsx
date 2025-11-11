import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';

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
      // Note: RTL is disabled in Android (supportsRtl=false), so we don't need to
      // change layout direction or reload the app. Language change is handled
      // by i18n.changeLanguage() which updates translations without app reload.
    } catch (error) {
      console.log('Error loading saved language:', error);
      // Fallback to Persian on error
      setCurrentLanguage('fa');
      await i18n.changeLanguage('fa');
    }
  }, [i18n]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadSavedLanguage();
  }, [loadSavedLanguage]);

  const changeLanguage = async (language: string) => {
    try {
      setCurrentLanguage(language);
      await i18n.changeLanguage(language);
      await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, language);
      // Note: RTL is disabled in Android (supportsRtl=false), so we don't need to
      // change layout direction or reload the app. Language change is handled
      // by i18n.changeLanguage() which updates translations without app reload.
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
