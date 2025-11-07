import { CustomText } from '@components/ui/CustomText';
import { Stack } from 'expo-router';
import { View, Alert, TouchableOpacity, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAuth } from '@hooks/useAuth';
import CustomButton from '@components/ui/CustomButton';
import InputField from '@components/ui/InputField';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const authLoginBg = require('@assets/images/auth-login.jpg');

export default function LoginScreen() {
  const { t } = useTranslation();
  const {
    loginAndValidate,
    storedUsername,
    error: authError,
    checkBiometrics,
    loadStoredUsername,
  } = useAuth();

  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState('');

  // Load stored username on mount and set as default
  useEffect(() => {
    const loadUsername = async () => {
      const savedUsername = await loadStoredUsername();
      if (savedUsername) {
        setUsername(savedUsername);
        console.log('[Login] Loaded saved username:', savedUsername);
      }
    };
    loadUsername();
  }, [loadStoredUsername]);

  const handleUseSavedUsername = () => {
    if (storedUsername) {
      setUsername(storedUsername);
    }
  };

  const handleLogin = async () => {
    if (!username.trim()) {
      Alert.alert(
        t('login.errors.title') || 'Error',
        t('login.errors.usernameRequired') || 'Username is required'
      );
      return;
    }

    try {
      setLoading(true);
      console.log('[Login] Starting biometric login for:', username);

      const canUseBiometrics = await checkBiometrics();
      if (!canUseBiometrics) {
        Alert.alert(
          t('login.errors.biometricUnavailable') || 'Biometrics Unavailable',
          t('login.errors.biometricMessage') || 'Please enable biometric authentication on your device.'
        );
        setLoading(false);
        return;
      }

      const result = await loginAndValidate(username.trim());

      if (result) {
        console.log('[Login] ✅ Login successful!');
        Alert.alert(
          t('login.success.title') || 'Success',
          `${t('login.success.loginSuccess') || 'Login successful!'}\n\n${t('login.success.welcomeBack', { username }) || `Welcome back, ${username}!`}`,
          [
            {
              text: t('common.ok') || 'OK',
              onPress: () => router.replace('/(app)/(feed)' as any),
            },
          ]
        );
      } else {
        console.error('[Login] ❌ Login failed');
        Alert.alert(
          t('login.errors.title') || 'Error',
          authError || t('login.errors.loginFailed') || 'Login failed. Please try again.'
        );
      }
    } catch (error: any) {
      console.error('[Login] ❌ Login error:', error);
      Alert.alert(
        t('login.errors.title') || 'Error',
        error.message || t('login.errors.loginFailed') || 'Login failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-[#f8f9fa]"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Image source={authLoginBg} className="absolute w-full h-full" resizeMode="cover" />
      <Stack.Screen options={{ title: t('login.title') }} />
      
      <View className="flex-1 justify-center px-6">
        <View className="bg-white/90 rounded-2xl p-6 shadow-lg">
          {/* Header */}
          <View className="items-center mb-6">
            <CustomText weight="bold" style={{ fontSize: 28, textAlign: 'center', marginBottom: 8, color: '#1a1a1a' }}>
              {t('login.title')}
            </CustomText>
            <CustomText style={{ fontSize: 15, textAlign: 'center', color: '#6b7280', lineHeight: 22 }}>
              {t('login.subtitle')}
            </CustomText>
          </View>

          {/* Username Input */}
          <View className="mb-4">
            <InputField
              label={t('login.usernameLabel') || 'Username'}
              value={username}
              onChangeText={setUsername}
              placeholder={t('login.usernamePlaceholder') || 'Enter your username'}
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="done"
              editable={!loading}
              icon="person-outline"
            />
            
            {/* Use Saved Username Hint */}
            {storedUsername && storedUsername !== username && (
              <TouchableOpacity
                onPress={handleUseSavedUsername}
                className="mt-2 flex-row items-center"
                activeOpacity={0.7}
              >
                <Ionicons name="time-outline" size={16} color="#3b82f6" style={{ marginRight: 6 }} />
                <CustomText style={{ fontSize: 12, color: '#3b82f6' }}>
                  {t('login.savedUsernameHint') || 'Use saved username'}: {storedUsername}
                </CustomText>
              </TouchableOpacity>
            )}
          </View>

          {/* Error Message */}
          {authError && (
            <View className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 mb-4">
              <View className="flex-row items-center">
                <Ionicons name="warning" size={20} color="#dc2626" style={{ marginRight: 8 }} />
                <CustomText style={{ color: '#dc2626', fontSize: 14, flex: 1 }}>
                  {authError}
                </CustomText>
              </View>
            </View>
          )}

          {/* Login Button */}
          <CustomButton
            title={t('login.loginButton') || 'Login with Biometrics'}
            onPress={handleLogin}
            loading={loading}
            disabled={loading || !username.trim()}
            IconLeft={() => <Ionicons name="finger-print" size={24} color="#fff" style={{ marginRight: 8 }} />}
            className="py-4 mb-4"
          />

          {/* Register Link */}
          <TouchableOpacity
            className="items-center py-2"
            onPress={() => router.push('/(auth)/register' as any)}
            disabled={loading}
          >
            <CustomText style={{ color: '#3b82f6', fontSize: 14, fontWeight: '500' }}>
              {t('login.toggleToRegister') || "Don't have an account? Register"}
            </CustomText>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
