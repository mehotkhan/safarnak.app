import { useTranslation } from 'react-i18next';
import { Text, TouchableOpacity, View } from 'react-native';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';

import { useLanguage } from './LanguageContext';

interface LanguageSwitcherProps {
  variant?: 'compact' | 'full' | 'dropdown' | 'dropdownMini';
}

export function LanguageSwitcher({ variant = 'full' }: LanguageSwitcherProps) {
  const { t } = useTranslation();
  const { currentLanguage, changeLanguage } = useLanguage();
  const [open, setOpen] = useState(false);

  const languages = [
    { code: 'en', name: t('language.enNative'), nativeName: t('language.en'), flag: '🇺🇸' },
    { code: 'fa', name: t('language.faNative'), nativeName: t('language.fa'), flag: '🇮🇷' },
  ];

  if (variant === 'dropdown') {
    const current = languages.find(l => l.code === currentLanguage) || languages[0];
    return (
      <View style={{ position: 'relative' }}>
        <TouchableOpacity
          onPress={() => setOpen(o => !o)}
          className="flex-row items-center px-3 py-2 rounded-xl border bg-white dark:bg-neutral-900 border-gray-300 dark:border-neutral-700"
        >
          <Text className="text-base ltr:mr-2 rtl:ml-2">{current.flag}</Text>
          <Text className="text-sm font-medium text-gray-800 dark:text-gray-200 ltr:mr-1 rtl:ml-1">
            {current.nativeName || current.name}
          </Text>
          <Ionicons
            name={open ? 'chevron-up' : 'chevron-down'}
            size={16}
            color="#9ca3af"
          />
        </TouchableOpacity>

        {open && (
          <View
            className="absolute z-50 mt-2 ltr:right-0 rtl:left-0 rounded-xl border bg-white dark:bg-neutral-900 border-gray-200 dark:border-neutral-700"
            style={{ minWidth: 180, shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 8, shadowOffset: { width: 0, height: 4 }, elevation: 6 }}
          >
            {languages.map((lang, idx) => (
              <TouchableOpacity
                key={lang.code}
                onPress={() => {
                  changeLanguage(lang.code);
                  setOpen(false);
                }}
                className={`flex-row items-center px-3 py-2 ${
                  idx > 0 ? 'border-t border-gray-100 dark:border-neutral-800' : ''
                } ${currentLanguage === lang.code ? 'bg-gray-50 dark:bg-neutral-800' : ''}`}
              >
                <Text className="text-lg ltr:mr-2 rtl:ml-2">{lang.flag}</Text>
                <View className="flex-1">
                  <Text className="text-sm text-gray-900 dark:text-gray-100 font-medium">
                    {lang.nativeName || lang.name}
                  </Text>
                  <Text className="text-xs text-gray-500 dark:text-gray-400 uppercase">{lang.code}</Text>
                </View>
                {currentLanguage === lang.code && (
                  <Ionicons name="checkmark" size={16} color="#10b981" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    );
  }

  if (variant === 'dropdownMini') {
    const current = languages.find(l => l.code === currentLanguage) || languages[0];
    return (
      <View style={{ position: 'relative' }}>
        <TouchableOpacity
          onPress={() => setOpen(o => !o)}
          className="flex-row items-center rounded-full"
        >
          <Text className="text-sm font-medium text-gray-800 dark:text-gray-200 ltr:mr-1 rtl:ml-1">
            {current.nativeName || current.name}
          </Text>
          <Ionicons
            name={open ? 'chevron-up' : 'chevron-down'}
            size={14}
            color="#9ca3af"
          />
        </TouchableOpacity>

        {open && (
          <View
            className="absolute z-50 mt-2 ltr:right-0 rtl:left-0 rounded-xl bg-white dark:bg-neutral-900"
            style={{ minWidth: 140, paddingVertical: 4, shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 8, shadowOffset: { width: 0, height: 4 }, elevation: 6 }}
          >
            {languages.map((lang) => (
              <TouchableOpacity
                key={lang.code}
                onPress={() => {
                  changeLanguage(lang.code);
                  setOpen(false);
                }}
                className={`flex-row items-center px-3 py-2 ${
                  currentLanguage === lang.code ? 'bg-gray-50 dark:bg-neutral-800' : ''
                }`}
              >
                <Text className="text-sm text-gray-900 dark:text-gray-100 font-medium">
                  {lang.nativeName || lang.name}
                </Text>
                {currentLanguage === lang.code && (
                  <Ionicons name="checkmark" size={16} color="#10b981" style={{ marginStart: 'auto' }} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    );
  }

  if (variant === 'compact') {
    return (
      <View className="flex-row items-center gap-2">
        {languages.map(lang => (
          <TouchableOpacity
            key={lang.code}
            onPress={() => changeLanguage(lang.code)}
            className={`px-3 py-1.5 rounded-full border ${
              currentLanguage === lang.code
                ? 'bg-primary border-primary'
                : 'bg-gray-100 dark:bg-neutral-900 border-gray-300 dark:border-neutral-700'
            }`}
          >
            <Text
              className={`text-xs font-semibold uppercase ${
                currentLanguage === lang.code
                  ? 'text-white'
                  : 'text-gray-700 dark:text-gray-300'
              }`}
            >
              {lang.code}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  }

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
          <Text className="text-xl ltr:mr-2 rtl:ml-2">{lang.flag}</Text>
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
