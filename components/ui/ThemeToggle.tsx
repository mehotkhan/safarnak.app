import { useTheme } from '@components/context/ThemeContext';
import { Text, View, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';

export function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme();
  const { t } = useTranslation();

  return (
    <TouchableOpacity onPress={toggleTheme} className="flex-row items-center">
      <View
        className={`w-12 h-7 rounded-full ${isDark ? 'bg-green-500' : 'bg-gray-300'} relative`}
      >
        <View
          className={`absolute w-6 h-6 bg-white rounded-full ${
            isDark ? 'right-0.5' : 'left-0.5'
          }`}
          style={{
            top: 2,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 3,
            elevation: 3,
          }}
        />
      </View>
      <Text className="ml-3 text-base text-black dark:text-white">
        {isDark ? t('profile.darkMode') : t('profile.lightMode')}
      </Text>
    </TouchableOpacity>
  );
}
