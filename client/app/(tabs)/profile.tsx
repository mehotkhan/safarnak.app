import { LanguageSwitcher } from '@components/context/LanguageSwitcher';
import { Text, View } from '@components/ui/Themed';
import { ThemeToggle } from '@components/ui/ThemeToggle';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { logout } from '../../redux/authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Alert, StyleSheet, TouchableOpacity } from 'react-native';

const USER_STORAGE_KEY = '@safarnak_user';

export default function ProfileScreen() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state: any) => state.auth);

  const handleLogout = () => {
    Alert.alert(
      t('profile.logout'),
      t('profile.logoutConfirm'),
      [
        {
          text: t('common.cancel'),
          style: 'cancel',
        },
        {
          text: t('profile.logout'),
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem(USER_STORAGE_KEY);
              dispatch(logout());
              router.replace('/login');
            } catch (error) {
              console.log('Error during logout:', error);
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('profile.title')}</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      
      {user && (
        <Text style={styles.welcome}>
          {t('profile.welcome', { name: user.name })}
        </Text>
      )}
      
      <Text style={styles.description}>{t('profile.description')}</Text>
      
      <LanguageSwitcher />
      
      <ThemeToggle />
      
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>{t('profile.logout')}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  welcome: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 20,
    color: '#2f95dc',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginHorizontal: 20,
    lineHeight: 24,
  },
  logoutButton: {
    backgroundColor: '#ff4444',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginTop: 30,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});