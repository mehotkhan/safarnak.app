import { CustomText } from '@components/ui/CustomText';
import { View } from 'react-native';
import CustomButton from '@components/ui/CustomButton';
import InputField from '@components/ui/InputField';
import OAuth from '@components/ui/OAuth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';

import { useRegisterMutation } from '@api';
import { login } from '@store/slices/authSlice';
import { useAppDispatch, useAppSelector } from '@store/hooks';

export default function RegisterScreen() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector(state => state.auth);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [registerMutation, { loading }] = useRegisterMutation();

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated]);

  const handleRegister = async () => {
    setErrorMessage('');

    if (!username.trim() || !password.trim()) {
      setErrorMessage(t('login.errors.fieldsRequired'));
      return;
    }

    if (password.trim().length < 6) {
      setErrorMessage(t('login.errors.passwordTooShort'));
      return;
    }

    try {
      const result = await registerMutation({
        variables: { username: username.trim(), password: password.trim() },
      });

      // Check for GraphQL errors first (errorPolicy: 'all' means errors don't throw)
      const errors = (result as any).errors;
      if (errors && errors.length > 0) {
        const errorMessage = errors[0]?.message || '';
        
        // Map server error messages to translated messages
        if (errorMessage.includes('already exists') || errorMessage.includes('User with this username already exists')) {
          setErrorMessage(t('login.errors.userExists'));
        } else if (errorMessage.includes('Username is required')) {
          setErrorMessage(t('login.errors.usernameRequired'));
        } else if (errorMessage.includes('Password must be at least 6 characters')) {
          setErrorMessage(t('login.errors.passwordTooShort'));
        } else if (errorMessage.includes('Failed to create user') || errorMessage.includes('Failed to retrieve created user')) {
          setErrorMessage(t('login.errors.createUserFailed'));
        } else {
          setErrorMessage(errorMessage || t('login.errors.databaseError'));
        }
        return;
      }

      if (result.data?.register) {
        const { user, token } = result.data.register;

        await AsyncStorage.setItem('@safarnak_user', JSON.stringify({ user, token }));
        dispatch(login({ user: user as any, token }));
        router.replace('/(tabs)');
        Alert.alert(t('login.success.title'), t('login.success.registerSuccess'));
      }
    } catch (error: any) {
      const message = error?.message || error?.graphQLErrors?.[0]?.message || '';
      
      // Map server error messages to translated messages
      if (message.includes('already exists') || message.includes('User with this username already exists')) {
        setErrorMessage(t('login.errors.userExists'));
      } else if (message.includes('Username is required')) {
        setErrorMessage(t('login.errors.usernameRequired'));
      } else if (message.includes('Password must be at least 6 characters')) {
        setErrorMessage(t('login.errors.passwordTooShort'));
      } else if (message.includes('Failed to create user') || message.includes('Failed to retrieve created user')) {
        setErrorMessage(t('login.errors.createUserFailed'));
      } else if (error?.networkError) {
        setErrorMessage(t('login.errors.networkError'));
      } else {
        setErrorMessage(message || t('login.errors.databaseError'));
      }
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-[#f8f9fa]"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View className="flex-1 justify-center px-6">
        <View className="items-center mb-12">
          <CustomText weight='bold' style={{ fontSize: 32, textAlign: 'center', marginBottom: 12, color: '#1a1a1a' }}>
            {t('login.register.title')}
          </CustomText>
          <CustomText style={{ fontSize: 16, textAlign: 'center', color: '#6b7280', lineHeight: 24 }}>
            {t('login.register.subtitle')}
          </CustomText>
        </View>

        <View className="w-full">
          <InputField
            label={t('login.usernameLabel')}
            value={username}
            onChangeText={(text) => {
              setUsername(text);
              if (errorMessage) setErrorMessage('');
            }}
            placeholder={t('login.usernamePlaceholder')}
            autoCapitalize='none'
            autoCorrect={false}
            returnKeyType='next'
            editable={!loading}
          />

          <InputField
            label={t('login.passwordLabel')}
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              if (errorMessage) setErrorMessage('');
            }}
            placeholder={t('login.passwordPlaceholder')}
            secureTextEntry
            autoCapitalize='none'
            autoCorrect={false}
            returnKeyType='done'
            onSubmitEditing={handleRegister}
            editable={!loading}
          />

          {errorMessage ? (
            <View className="bg-red-50 border border-red-200 rounded-md px-3 py-2 mb-4">
              <CustomText style={{ color: '#dc2626', fontSize: 14, textAlign: 'center' }}>{errorMessage}</CustomText>
            </View>
          ) : null}

          <CustomButton
            title={t('login.registerButton')}
            onPress={handleRegister}
            loading={loading}
            disabled={loading}
          />

          <OAuth />

          <TouchableOpacity
            className="items-center py-2"
            onPress={() => router.push('/auth/login' as any)}
            disabled={loading}
          >
            <CustomText style={{ color: '#3b82f6', fontSize: 14, fontWeight: '500' }}>
              {t('login.toggleToLogin')}
            </CustomText>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
