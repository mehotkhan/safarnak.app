import { CustomText } from '@components/ui/CustomText';
import { Stack, router } from 'expo-router';
import { View, KeyboardAvoidingView, Platform, Image, TouchableOpacity, Alert } from 'react-native';
import CustomButton from '@components/ui/CustomButton';
// import InputField from '@components/ui/InputField';
// import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
// import { useRegisterMutation } from '@api';
// import { login } from '@store/slices/authSlice';
// import { useAppDispatch, useAppSelector } from '@store/hooks';
import { generateRandomName } from '@/utils/nameGenerator';
import { useLanguage } from '@components/context/LanguageContext';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const authRegisterBg = require('@assets/images/auth-login.jpg');

// Mock RSA public key for demonstration
const MOCK_PUBLIC_KEY = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAu1SU1LfVLPHCozMxH2Mo
4lgOEePzNm0tRgeLezV6ffAt0gunVTLw7onLRnrq0/IzW7yWR7QkrmBL7jTKEn5u
+qKhbwKfBstIs+bMY2Zkp18gnTxKLxoS2tFczGkPLPgizskuemMghRniWaoLcyeh
kd3qqGElvW/VDL5AaWTg0nLVkjRo9z+40RQzuVaE8AkAFmxZzow3x+VJYKdjykkJ
0iT9wCS0DRTXu269V264Vf/3jvredZiKRkgwlL9xNAwxXFg0x/XFw005UWVRIkdg
cKWTjpBP2dPwVZ4WWC+9aGVd+Gyn1o0CLelf4rEjGoXbAAEgAqeGUxrcIlbjXfbc
mwIDAQAB
-----END PUBLIC KEY-----`;

export default function RegisterScreen() {
  const { t } = useTranslation();
  const { currentLanguage } = useLanguage();
  // const dispatch = useAppDispatch();
  // const { isAuthenticated } = useAppSelector(state => state.auth);
  
  // Auto-generate random name on component mount
  const [username, setUsername] = useState(() => generateRandomName(currentLanguage as 'en' | 'fa'));
  // const [password, setPassword] = useState('');
  // const [errorMessage, setErrorMessage] = useState('');
  const [publicKey] = useState(MOCK_PUBLIC_KEY);
  const [isPublicKeyExpanded, setIsPublicKeyExpanded] = useState(false);
  const [loading] = useState(false);

  // const [registerMutation, { loading }] = useRegisterMutation();

  // useEffect(() => {
  //   if (isAuthenticated) {
  //     router.replace('/(app)/(feed)' as any);
  //   }
  // }, [isAuthenticated]);

  const handleGenerateRandomName = () => {
    const randomName = generateRandomName(currentLanguage as 'en' | 'fa');
    setUsername(randomName);
    // setErrorMessage('');
  };

  const handleRegister = async () => {
    // Placeholder for registration logic
    Alert.alert(
      t('register.success.title') || 'Success',
      t('register.success.registerSuccess') || 'Account created successfully!'
    );
    
    // GraphQL registration code (commented out)
    // setErrorMessage('');
    // if (!username.trim() || !password.trim()) {
    //   setErrorMessage(t('register.errors.fieldsRequired') || 'All fields are required');
    //   return;
    // }
    // try {
    //   const result = await registerMutation({
    //     variables: { username: username.trim(), password: password.trim() },
    //   });
    //   const errors = (result as any).errors;
    //   if (errors && errors.length > 0) {
    //     const errorMessage = errors[0]?.message || '';
    //     if (errorMessage.includes('User already exists')) {
    //       setErrorMessage(t('register.errors.userExists') || 'User already exists');
    //     } else {
    //       setErrorMessage(errorMessage || t('register.errors.databaseError') || 'Registration failed');
    //     }
    //     return;
    //   }
    //   if (result.data?.register) {
    //     const { user, token } = result.data.register;
    //     await AsyncStorage.setItem('@safarnak_user', JSON.stringify({ user, token }));
    //     dispatch(login({ user: user as any, token }));
    //     router.replace('/(app)/(feed)' as any);
    //     Alert.alert(
    //       t('register.success.title') || 'Success',
    //       t('register.success.registerSuccess') || 'Account created successfully!'
    //     );
    //   }
    // } catch (error: any) {
    //   const message = error?.message || error?.graphQLErrors?.[0]?.message || '';
    //   if (message.includes('User already exists')) {
    //     setErrorMessage(t('register.errors.userExists') || 'User already exists');
    //   } else if (error?.networkError) {
    //     setErrorMessage(t('register.errors.networkError') || 'Network error');
    //   } else {
    //     setErrorMessage(message || t('register.errors.databaseError') || 'Registration failed');
    //   }
    // }
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
            {/* Username Input + Generate Button Row */}
            <View className="mb-4">
              <CustomText style={{ fontSize: 14, color: '#374151', fontWeight: '500', marginBottom: 8 }}>
                {t('register.usernameLabel') || 'Username'}
              </CustomText>
              <View className="flex-row items-center gap-2">
                <View className="flex-1 bg-gray-100 border border-gray-300 rounded-lg px-4 py-3">
                  <CustomText style={{ fontSize: 16, color: '#1f2937' }}>
                    {username}
                  </CustomText>
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
              <CustomText style={{ fontSize: 12, color: '#6b7280', marginTop: 4, marginLeft: 2 }}>
                {t('register.generateNameHint') || 'Tap shuffle to generate a random name'}
              </CustomText>
            </View>

            {/* Public Key Display - Collapsible */}
            <View className="mb-4">
              <TouchableOpacity
                onPress={() => setIsPublicKeyExpanded(!isPublicKeyExpanded)}
                className="flex-row items-center justify-between mb-2"
                activeOpacity={0.7}
              >
                <CustomText style={{ fontSize: 14, color: '#374151', fontWeight: '500' }}>
                  {t('register.publicKeyLabel') || 'Public Key'}
                </CustomText>
                <Ionicons 
                  name={isPublicKeyExpanded ? "chevron-up" : "chevron-down"} 
                  size={20} 
                  color="#6b7280" 
                />
              </TouchableOpacity>
              
              {isPublicKeyExpanded && (
                <View className="bg-gray-100 border border-gray-300 rounded-lg p-3">
                  <CustomText 
                    style={{ 
                      fontSize: 10, 
                      color: '#4b5563', 
                      fontFamily: 'monospace',
                      lineHeight: 14
                    }}
                  >
                    {publicKey}
                  </CustomText>
                </View>
              )}
              
              <CustomText style={{ fontSize: 12, color: '#6b7280', marginTop: 4, marginLeft: 2 }}>
                {isPublicKeyExpanded 
                  ? (t('register.publicKeyHint') || 'Your unique cryptographic identity')
                  : (t('register.publicKeyCollapsedHint') || 'Tap to view your public key')
                }
              </CustomText>
            </View>

            {/* Password Input - Disabled */}
            {/* <InputField
              label={t('register.passwordLabel') || 'Password'}
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (errorMessage) setErrorMessage('');
              }}
              placeholder={t('register.passwordPlaceholder') || 'Create a password'}
              secureTextEntry
              autoCapitalize='none'
              autoCorrect={false}
              returnKeyType='done'
              onSubmitEditing={handleRegister}
              editable={!loading}
            /> */}

            {/* Error Message - Disabled */}
            {/* {errorMessage ? (
              <View className="bg-red-50 border border-red-200 rounded-md px-3 py-2 mb-4">
                <CustomText style={{ color: '#dc2626', fontSize: 14, textAlign: 'center' }}>{errorMessage}</CustomText>
              </View>
            ) : null} */}

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
