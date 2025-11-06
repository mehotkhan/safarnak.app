import { useTranslation } from 'react-i18next';
import { Text, TouchableOpacity, View } from 'react-native';

import { useLanguage } from './LanguageContext';

export function LanguageSwitcher() {
  const { t } = useTranslation();
  const { currentLanguage, changeLanguage } = useLanguage();

  const languages = [
    { code: 'en', name: t('language.enNative'), nativeName: t('language.en'), flag: '🇺🇸' },
    { code: 'fa', name: t('language.faNative'), nativeName: t('language.fa'), flag: '🇮🇷' },
  ];

  return (
    <View className="flex-row gap-2">
      {languages.map(lang => (
        <TouchableOpacity
          key={lang.code}
          onPress={() => changeLanguage(lang.code)}
          className={`flex-row items-center px-5 py-2 rounded-full border-2 ${
            currentLanguage === lang.code
              ? 'bg-blue-100 border-blue-500'
              : 'bg-gray-100 border-gray-300'
          }`}
        >
          <Text className="text-xl mr-2">{lang.flag}</Text>
          <Text
            className={`text-base font-medium ${
              currentLanguage === lang.code ? 'text-blue-600' : 'text-gray-700'
            }`}
          >
            {lang.nativeName || lang.name}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
