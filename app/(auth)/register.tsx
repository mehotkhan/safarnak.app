import { generateRandomName } from '@/utils/nameGenerator';
import { useLanguage } from '@components/context/LanguageContext';
import CustomButton from '@components/ui/CustomButton';
import { CustomText } from '@components/ui/CustomText';
import InputField from '@components/ui/InputField';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@hooks/useAuth';
import { Stack, router } from 'expo-router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Image, KeyboardAvoidingView, Platform, TouchableOpacity, View } from 'react-native';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const authRegisterBg = require('@assets/images/auth-login.jpg');

export default function RegisterScreen() {
  const { t } = useTranslation();
  const { currentLanguage } = useLanguage();
  
  // Biometric Auth Hook
  const {
    registerUser,
    error: authError,
    checkBiometrics,
    loadStoredUsername,
    clearStoredData,
  } = useAuth();
  
  // Helper function: convert display name to username (spaces → dots)
  const nameToUsername = (displayName: string) => {
    // Replace spaces with dots - allow UTF-8 characters (Persian, Arabic, etc.)
    return displayName.trim().replace(/\s+/g, '.');
  };

  // Helper: generate a valid name + username pair based on current language
  const generateValidNamePair = (language: string = currentLanguage) => {
    try {
      // Use current language, but ensure it's 'en' or 'fa'
      const lang = (language === 'fa' || language === 'en') ? language : 'en';
      const displayName = generateRandomName(lang as 'en' | 'fa');
      const username = nameToUsername(displayName);
      
      return { displayName, username };
    } catch (error) {
      console.error('[Register] Error generating name:', error);
      // Fallback to a simple default
      const fallback = 'user.' + Math.random().toString(36).substring(2, 8);
      return { displayName: fallback, username: fallback };
    }
  };
  
  // Auto-generate random name on component mount (based on current language)
  const [displayName, setDisplayName] = useState(() => {
    try {
      return generateValidNamePair(currentLanguage).displayName;
    } catch (error) {
      console.error('[Register] Error initializing display name:', error);
      return 'User ' + Math.random().toString(36).substring(2, 8);
    }
  });
  
  const [username, setUsername] = useState(() => {
    try {
      return generateValidNamePair(currentLanguage).username;
    } catch (error) {
      console.error('[Register] Error initializing username:', error);
      return 'user.' + Math.random().toString(36).substring(2, 8);
    }
  });
  
  const [loading, setLoading] = useState(false);

  // Load stored username on mount to check if user is already registered
  useEffect(() => {
    const checkExistingUser = async () => {
      try {
        const stored = await loadStoredUsername();
        if (stored) {
          console.log('[Register] Found existing user:', stored);
          Alert.alert(
            t('register.errors.alreadyRegistered') || 'Already Registered',
            t('register.alerts.alreadyRegisteredMessage', { username: stored }) || `User "${stored}" is already registered. Please clear data first to register a new user.`,
            [
              {
                text: t('register.alerts.clearData') || 'Clear Data',
                onPress: async () => {
                  try {
                    await clearStoredData();
                    console.log('[Register] Cleared stored data');
                  } catch (error) {
                    console.error('[Register] Error clearing data:', error);
                  }
                },
                style: 'destructive',
              },
              { text: t('register.alerts.cancel') || 'Cancel', style: 'cancel' },
            ]
          );
        }
      } catch (error) {
        console.error('[Register] Error checking existing user:', error);
      }
    };
    checkExistingUser();
  }, [loadStoredUsername, clearStoredData, t]);

  const handleGenerateRandomName = () => {
    const pair = generateValidNamePair(currentLanguage);
    setDisplayName(pair.displayName);
    setUsername(pair.username);
  };

  const handleRegister = async () => {
    if (!username.trim()) {
      Alert.alert(
        t('register.errors.title') || 'Error',
        t('register.errors.usernameRequired') || 'Username is required'
      );
      return;
    }

    try {
      setLoading(true);
      console.log('[Register] Starting biometric registration for:', username);

      // Check biometric availability first
      const canUseBiometrics = await checkBiometrics();
      if (!canUseBiometrics) {
        Alert.alert(
          t('register.errors.biometricUnavailable') || 'Biometrics Unavailable',
          t('register.errors.biometricMessage') ||
            'Please enable biometric authentication (fingerprint or face recognition) on your device to register.'
        );
        setLoading(false);
        return;
      }

      console.log('[Register] Biometrics available, proceeding with registration...');

      // Register with biometrics
      const result = await registerUser(username.trim());

      if (result && result.user) {
        console.log('[Register] ✅ Registration successful!');
        console.log('[Register] Username:', result.user.username);

        // Show success alert
        Alert.alert(
          t('register.success.title') || 'Success',
          `${t('register.success.registerSuccess') || 'Account created successfully!'}\n\n${t('register.success.usernameLabel') || 'Username'}: ${result.user.username}`,
          [
            {
              text: t('common.ok') || 'OK',
              onPress: () => {
                console.log('[Register] User acknowledged registration success');
                // Navigate to app feed page
                router.replace('/(app)/(feed)' as any);
              },
            },
          ]
        );
      } else {
        console.error('[Register] ❌ Registration failed - no result returned');
        Alert.alert(
          t('register.errors.title') || 'Error',
          authError || t('register.errors.registrationFailed') || 'Registration failed. Please try again.'
        );
      }
    } catch (error: any) {
      console.error('[Register] ❌ Registration error:', error);
      Alert.alert(
        t('register.errors.title') || 'Error',
        error.message || t('register.errors.registrationFailed') || 'Registration failed. Please try again.'
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
      <Image source={authRegisterBg} className="absolute w-full h-full" resizeMode="cover" />
      <Stack.Screen options={{ title: t('register.title') || 'Register' }} />
      <View className="flex-1 justify-center px-6">
        <View className="bg-white/90 rounded-2xl p-6 shadow-lg">
          <View className="items-center mb-6">
            <CustomText weight='bold' style={{ fontSize: 28, textAlign: 'center', marginBottom: 8, color: '#1a1a1a' }}>
              {t('register.title') || 'Create Account'}
            </CustomText>
            <CustomText style={{ fontSize: 15, textAlign: 'center', color: '#6b7280', lineHeight: 22 }}>
              {t('register.subtitle') || 'Join the adventure'}
            </CustomText>
          </View>

          {/* Auth Info Section */}
          <View className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 mb-4">
            <View className="flex-row items-start mb-2">
              <Ionicons name="information-circle" size={20} color="#3b82f6" style={{ marginRight: 8, marginTop: 2 }} />
              <View className="flex-1">
                <CustomText weight="bold" style={{ color: '#1e40af', fontSize: 14, marginBottom: 4 }}>
                  {t('register.authInfo.title') || 'How Our Auth Works'}
                </CustomText>
                <CustomText style={{ color: '#1e3a8a', fontSize: 12, lineHeight: 18 }}>
                  {t('register.authInfo.description') || 
                    'We use cryptographic key pairs for secure authentication. Your identity is protected by RSA encryption, ensuring privacy and security across all devices.'}
                </CustomText>
              </View>
            </View>
          </View>

          <View className="w-full">
            {/* Display Name Input + Generate Button Row */}
            <View className="mb-4">
              <CustomText style={{ fontSize: 14, color: '#374151', fontWeight: '500', marginBottom: 8 }}>
                {t('register.displayNameLabel') || 'Display Name'}
              </CustomText>
              <View className="flex-row items-center gap-2">
                <View className="flex-1">
                  <InputField
                    label=""
                    value={displayName}
                    onChangeText={(text) => {
                      setDisplayName(text);
                      setUsername(nameToUsername(text));
                    }}
                    placeholder={t('register.displayNamePlaceholder') || 'Enter your name'}
                    autoCorrect={false}
                    returnKeyType='done'
                    editable={!loading}
                  />
                </View>
                <TouchableOpacity
                  onPress={handleGenerateRandomName}
                  disabled={loading}
                  className={`bg-primary rounded-full px-4 py-3 flex-row items-center justify-center ${loading ? 'opacity-50' : ''}`}
                  style={{ height: 48 }}
                >
                  <Ionicons name="shuffle" size={20} color="#fff" />
                </TouchableOpacity>
              </View>
              <CustomText style={{ fontSize: 11, color: '#9ca3af', marginTop: 4, marginLeft: 2 }}>
                {t('register.displayNameHint') || 'Your public name'}
              </CustomText>
            </View>

            {/* Username Display (Auto-derived) */}
            <View className="mb-4">
              <CustomText style={{ fontSize: 14, color: '#374151', fontWeight: '500', marginBottom: 8 }}>
                {t('register.usernameLabel') || 'Username'}
              </CustomText>
              <View className="bg-gray-100 border border-gray-300 rounded-lg px-4 py-3">
                <CustomText style={{ fontSize: 16, color: '#1f2937', fontFamily: 'monospace' }}>
                  {username}
                </CustomText>
              </View>
              <CustomText style={{ fontSize: 11, color: '#9ca3af', marginTop: 4, marginLeft: 2 }}>
                {t('register.usernameRules') || 'Auto from name (spaces → dots)'}
              </CustomText>
        
            </View>



            {/* Error Message - Show biometric auth errors */}
            {authError && (
              <View className="bg-red-50 border border-red-200 rounded-md px-3 py-2 mb-4">
                <View className="flex-row items-center">
                  <Ionicons name="warning" size={20} color="#dc2626" style={{ marginRight: 8 }} />
                  <CustomText style={{ color: '#dc2626', fontSize: 14, flex: 1 }}>
                    {authError}
                  </CustomText>
                </View>
              </View>
            )}

            {/* Register Button with Fingerprint Icon */}
            <CustomButton
              title={t('register.registerButton') || 'Register'}
              onPress={handleRegister}
              loading={loading}
              disabled={loading}
              IconLeft={() => <Ionicons name="finger-print" size={24} color="#fff" style={{ marginRight: 8 }} />}
              className="py-4"
            />

            <TouchableOpacity
              className="items-center py-2"
              onPress={() => router.push('/(auth)/login' as any)}
              disabled={loading}
            >
              <CustomText style={{ color: '#3b82f6', fontSize: 14, fontWeight: '500' }}>
                {t('register.toggleToLogin') || 'Already have an account? Login'}
              </CustomText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
