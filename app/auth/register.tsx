import { CustomText } from '@components/ui/CustomText';
import { View } from '@components/ui/Themed';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

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

    try {
      const result = await registerMutation({
        variables: { username: username.trim(), password: password.trim() },
      });

      if (result.data?.register) {
        const { user, token } = result.data.register;

        await AsyncStorage.setItem('@safarnak_user', JSON.stringify({ user, token }));
        dispatch(login({ user: user as any, token }));
        router.replace('/(tabs)');
        Alert.alert(t('login.success.title'), t('login.success.registerSuccess'));
      }
    } catch (error: any) {
      const message = error?.message || error?.graphQLErrors?.[0]?.message || '';
      if (message.includes('already exists')) {
        setErrorMessage(t('login.errors.userExists'));
      } else if (error?.networkError) {
        setErrorMessage(t('login.errors.networkError'));
      } else {
        setErrorMessage(message || t('login.errors.databaseError'));
      }
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <CustomText weight='bold' style={styles.title}>
            {t('login.registerButton')}
          </CustomText>
          <CustomText style={styles.subtitle}>
            Create a new account to get started
          </CustomText>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <CustomText weight='medium' style={styles.label}>
              {t('login.usernameLabel')}
            </CustomText>
            <TextInput
              style={[styles.input, errorMessage && styles.inputError]}
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
          </View>

          <View style={styles.inputContainer}>
            <CustomText weight='medium' style={styles.label}>
              {t('login.passwordLabel')}
            </CustomText>
            <TextInput
              style={[styles.input, errorMessage && styles.inputError]}
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
          </View>

          {errorMessage ? (
            <View style={styles.errorContainer}>
              <CustomText style={styles.errorText}>{errorMessage}</CustomText>
            </View>
          ) : null}

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color='#fff' size='small' />
            ) : (
              <CustomText weight='medium' style={styles.buttonText}>
                {t('login.registerButton')}
              </CustomText>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.toggleButton}
            onPress={() => router.push('/auth/login' as any)}
            disabled={loading}
          >
            <CustomText style={styles.toggleButtonText}>
              {t('login.toggleToLogin')}
            </CustomText>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
    color: '#1a1a1a',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#6b7280',
    lineHeight: 24,
    paddingHorizontal: 16,
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#374151',
  },
  input: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#1f2937',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  inputError: {
    borderColor: '#ef4444',
    backgroundColor: '#fef2f2',
  },
  errorContainer: {
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fecaca',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 16,
  },
  errorText: {
    color: '#dc2626',
    fontSize: 14,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#3b82f6',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonDisabled: {
    backgroundColor: '#9ca3af',
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  toggleButton: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  toggleButtonText: {
    color: '#3b82f6',
    fontSize: 14,
    fontWeight: '500',
  },
});
