import { LanguageSwitcher } from '@components/context/LanguageSwitcher';
import { Text, View } from '@components/ui/Themed';
import { ThemeToggle } from '@components/ui/ThemeToggle';
import CustomButton from '@components/ui/CustomButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Alert, Image, StyleSheet } from 'react-native';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const appIcon = require('../../assets/images/icon.png');

import Colors from '@constants/Colors';
import { logout } from '@store/slices/authSlice';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import type { RootState } from '@store';

const USER_STORAGE_KEY = '@safarnak_user';

export default function ProfileScreen() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state: RootState) => state.auth);

  const handleLogout = () => {
    Alert.alert(t('profile.logout'), t('profile.logoutConfirm'), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('profile.logout'),
        style: 'destructive',
        onPress: async () => {
          try {
            await AsyncStorage.removeItem(USER_STORAGE_KEY);
            dispatch(logout());
            router.replace('/auth/login' as any);
          } catch (error) {
            console.log('Error during logout:', error);
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      {/* Header Card */}
      <View style={styles.headerCard}>
        <View style={styles.avatarContainer}>
          <Image source={appIcon} style={styles.avatar} resizeMode='contain' />
        </View>
        <Text style={styles.nameText}>
          {user?.name ? user.name : t('profile.title')}
        </Text>
        <Text style={styles.subText}>{t('profile.description')}</Text>
      </View>

      {/* Settings Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>{t('profile.settings')}</Text>

        <View style={styles.row}>
          <Text style={styles.rowLabel}>{t('profile.language')}</Text>
          <LanguageSwitcher />
        </View>

        <View style={styles.divider} />

        <View style={styles.row}>
          <Text style={styles.rowLabel}>{t('profile.theme')}</Text>
          <ThemeToggle />
        </View>
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <CustomButton
          title={t('profile.logout')}
          bgVariant='danger'
          onPress={handleLogout}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  headerCard: {
    alignItems: 'center',
    backgroundColor: Colors.light.card,
    borderRadius: 16,
    paddingVertical: 24,
    paddingHorizontal: 16,
    shadowColor: Colors.light.shadow,
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 16,
  },
  avatarContainer: {
    width: 84,
    height: 84,
    borderRadius: 42,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.light.border,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  nameText: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 4,
  },
  subText: {
    fontSize: 14,
    textAlign: 'center',
    color: Colors.light.tabIconDefault,
    marginTop: 6,
  },
  card: {
    backgroundColor: Colors.light.card,
    borderRadius: 16,
    padding: 16,
    shadowColor: Colors.light.shadow,
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  rowLabel: {
    fontSize: 15,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: Colors.light.border,
    marginVertical: 8,
  },
  actions: {
    marginTop: 24,
  },
});
