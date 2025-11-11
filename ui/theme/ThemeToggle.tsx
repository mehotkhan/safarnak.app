import { useTheme } from '@ui/context';
import { Text, View, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';

interface ThemeToggleProps {
  showLabel?: boolean;
}

export function ThemeToggle({ showLabel = true }: ThemeToggleProps) {
  const { isDark, toggleTheme } = useTheme();
  const { t } = useTranslation();

  return (
    <TouchableOpacity onPress={toggleTheme} className="flex-row items-center">
      <View
        className={`w-16 h-7 rounded-full ${
          isDark ? 'bg-primary' : 'bg-gray-300 dark:bg-neutral-700'
        } relative`}
      >
        {/* Icons layer */}
        <View className="absolute inset-0 flex-row items-center justify-between px-3">
          <Ionicons
            name="sunny"
            size={14}
            color={isDark ? '#9ca3af' : '#f59e0b'}
          />
          <Ionicons
            name="moon"
            size={14}
            color={isDark ? '#ffffff' : '#9ca3af'}
          />
        </View>
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
      {showLabel && (
        <Text className="ml-3 text-base text-black dark:text-white">
          {isDark ? t('profile.darkMode') : t('profile.lightMode')}
        </Text>
      )}
    </TouchableOpacity>
  );
}
