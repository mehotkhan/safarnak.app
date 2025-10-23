import { useTheme } from '@components/context/ThemeContext';
import { Text, View } from '@components/ui/Themed';
import { useTranslation } from 'react-i18next';
import { StyleSheet, TouchableOpacity } from 'react-native';

export function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme();
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{t('profile.theme')}</Text>
      <TouchableOpacity style={styles.toggleButton} onPress={toggleTheme}>
        <View style={[styles.toggleBackground, isDark && styles.toggleBackgroundDark]}>
          <View style={[styles.toggleCircle, isDark && styles.toggleCircleDark]} />
        </View>
        <Text style={styles.toggleText}>
          {isDark ? t('profile.darkMode') : t('profile.lightMode')}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  toggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  toggleBackground: {
    width: 50,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    paddingHorizontal: 2,
    marginRight: 12,
  },
  toggleBackgroundDark: {
    backgroundColor: '#4CAF50',
  },
  toggleCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    alignSelf: 'flex-start',
  },
  toggleCircleDark: {
    alignSelf: 'flex-end',
  },
  toggleText: {
    fontSize: 16,
    fontWeight: '500',
  },
});
