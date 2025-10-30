import { CustomText } from '@components/ui/CustomText';
import { Stack } from 'expo-router';
import { View } from 'react-native';
import CustomButton from '@components/ui/CustomButton';
import InputField from '@components/ui/InputField';
import OAuth from '@components/ui/OAuth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, TouchableOpacity, KeyboardAvoidingView, Platform, View as RNView } from 'react-native';

import { useLoginMutation } from '@api';
import { login } from '@store/slices/authSlice';
import { useAppDispatch, useAppSelector } from '@store/hooks';

export default function LoginScreen() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector(state => state.auth);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [loginMutation, { loading }] = useLoginMutation();

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/(app)/(feed)' as any);
    }
  }, [isAuthenticated]);

  const handleLogin = async () => {
    setErrorMessage('');

    if (!username.trim() || !password.trim()) {
      setErrorMessage(t('login.errors.fieldsRequired'));
      return;
    }

    try {
      const result = await loginMutation({
        variables: { username: username.trim(), password: password.trim() },
      });

      // Check for GraphQL errors first (errorPolicy: 'all' means errors don't throw)
      const errors = (result as any).errors;
      if (errors && errors.length > 0) {
        const errorMessage = errors[0]?.message || '';
        if (errorMessage.includes('Invalid username or password')) {
          setErrorMessage(t('login.errors.invalidCredentials'));
        } else {
          setErrorMessage(errorMessage || t('login.errors.databaseError'));
        }
        return;
      }

      if (result.data?.login) {
        const { user, token } = result.data.login;

        await AsyncStorage.setItem('@safarnak_user', JSON.stringify({ user, token }));
        dispatch(login({ user: user as any, token }));
        router.replace('/(app)/(feed)' as any);
        Alert.alert(t('login.success.title'), t('login.success.loginSuccess'));
      }
    } catch (error: any) {
      const message = error?.message || error?.graphQLErrors?.[0]?.message || '';
      if (message.includes('Invalid username or password')) {
        setErrorMessage(t('login.errors.invalidCredentials'));
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
      <Stack.Screen options={{ title: t('login.title') }} />
      <View className="flex-1 justify-center px-6">
        <View className="items-center mb-12">
          <CustomText weight='bold' style={{ fontSize: 32, textAlign: 'center', marginBottom: 12, color: '#1a1a1a' }}>
            {t('login.title')}
          </CustomText>
          <CustomText style={{ fontSize: 16, textAlign: 'center', color: '#6b7280', lineHeight: 24 }}>
            {t('login.subtitle')}
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
            onSubmitEditing={handleLogin}
            editable={!loading}
          />

          {errorMessage ? (
            <View className="bg-red-50 border border-red-200 rounded-md px-3 py-2 mb-4">
              <CustomText style={{ color: '#dc2626', fontSize: 14, textAlign: 'center' }}>{errorMessage}</CustomText>
            </View>
          ) : null}

          <CustomButton
            title={t('login.loginButton')}
            onPress={handleLogin}
            loading={loading}
            disabled={loading}
          />

          <OAuth />

          <TouchableOpacity
            className="items-center py-2"
            onPress={() => router.push('/(auth)/register' as any)}
            disabled={loading}
          >
            <CustomText style={{ color: '#3b82f6', fontSize: 14, fontWeight: '500' }}>
              {t('login.toggleToRegister')}
            </CustomText>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
