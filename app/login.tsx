import { CustomText } from '@components/ui/CustomText';
import { View } from '@components/ui/Themed';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useState } from 'react';
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

import { useLoginMutation, useRegisterMutation } from '../api';
import { login } from '../store/slices/authSlice';
import { useAppDispatch } from '../store/hooks';

export default function LoginScreen() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [loginMutation, { loading: loginLoading }] = useLoginMutation();
  const [registerMutation, { loading: registerLoading }] =
    useRegisterMutation();

  const loading = loginLoading || registerLoading;

  const handleAuth = async () => {
    setErrorMessage('');

    if (username.trim().length === 0 || password.trim().length === 0) {
      setErrorMessage(t('login.errors.fieldsRequired'));
      return;
    }

    try {
      let result;

      if (isRegistering) {
        result = await registerMutation({
          variables: {
            username: username.trim(),
            password: password.trim(),
          },
          errorPolicy: 'all',
        });
      } else {
        result = await loginMutation({
          variables: {
            username: username.trim(),
            password: password.trim(),
          },
          errorPolicy: 'all',
        });
      }

      // Check for GraphQL errors in the result
      if ('errors' in result && result.errors && result.errors.length > 0) {
        const error = result.errors[0];

        let errorMsg = '';

        // Check for original error message in extensions
        const originalError = (error.extensions as any)?.originalError?.message;
        if (originalError) {
          if (originalError.includes('Invalid username or password')) {
            errorMsg = t('login.errors.invalidCredentials');
          } else if (originalError.includes('already exists')) {
            errorMsg = t('login.errors.userExists');
          } else {
            errorMsg = originalError;
          }
        } else if (error.message.includes('Invalid username or password')) {
          errorMsg = t('login.errors.invalidCredentials');
        } else if (error.message.includes('already exists')) {
          errorMsg = t('login.errors.userExists');
        } else {
          errorMsg = error.message;
        }

        setErrorMessage(errorMsg);
        return;
      }

      if (result.data) {
        const authData = isRegistering
          ? (result.data as any).register
          : (result.data as any).login;
        const { user, token } = authData;

        // Persist auth data to AsyncStorage
        await AsyncStorage.setItem(
          '@safarnak_user',
          JSON.stringify({ user, token })
        );

        // Update Redux store
        dispatch(login({ user, token }));

        router.replace('/(tabs)');

        Alert.alert(
          t('login.success.title'),
          isRegistering
            ? t('login.success.registerSuccess')
            : t('login.success.loginSuccess')
        );
      } else {
        setErrorMessage(t('login.errors.databaseError'));
      }
    } catch (error: any) {
      let errorMsg = '';

      // Handle GraphQL errors
      if (error.graphQLErrors && error.graphQLErrors.length > 0) {
        const graphQLError = error.graphQLErrors[0];

        // Check for original error message in extensions
        const originalError = (graphQLError.extensions as any)?.originalError
          ?.message;
        if (originalError) {
          if (originalError.includes('Invalid username or password')) {
            errorMsg = t('login.errors.invalidCredentials');
          } else if (originalError.includes('already exists')) {
            errorMsg = t('login.errors.userExists');
          } else {
            errorMsg = originalError;
          }
        } else if (
          graphQLError.message.includes('Invalid username or password')
        ) {
          errorMsg = t('login.errors.invalidCredentials');
        } else if (graphQLError.message.includes('already exists')) {
          errorMsg = t('login.errors.userExists');
        } else {
          errorMsg = graphQLError.message;
        }
      }
      // Handle network errors
      else if (error.networkError) {
        errorMsg = t('login.errors.networkError');
      }
      // Handle general errors
      else if (error.message) {
        if (error.message.includes('Invalid username or password')) {
          errorMsg = t('login.errors.invalidCredentials');
        } else if (error.message.includes('already exists')) {
          errorMsg = t('login.errors.userExists');
        } else {
          errorMsg = error.message;
        }
      }
      // Fallback error message
      else {
        errorMsg = t('login.errors.databaseError');
      }

      setErrorMessage(errorMsg);
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
            {t('login.title')}
          </CustomText>
          <CustomText style={styles.subtitle}>{t('login.subtitle')}</CustomText>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <CustomText weight='medium' style={styles.label}>
              {t('login.usernameLabel')}
            </CustomText>
            <TextInput
              style={[styles.input, errorMessage && styles.inputError]}
              value={username}
              onChangeText={text => {
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
              onChangeText={text => {
                setPassword(text);
                if (errorMessage) setErrorMessage('');
              }}
              placeholder={t('login.passwordPlaceholder')}
              secureTextEntry
              autoCapitalize='none'
              autoCorrect={false}
              returnKeyType='done'
              onSubmitEditing={handleAuth}
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
            onPress={handleAuth}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color='#fff' size='small' />
            ) : (
              <CustomText weight='medium' style={styles.buttonText}>
                {isRegistering
                  ? t('login.registerButton')
                  : t('login.loginButton')}
              </CustomText>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.toggleButton}
            onPress={() => {
              setIsRegistering(!isRegistering);
              setErrorMessage('');
            }}
            disabled={loading}
          >
            <CustomText
              style={[
                styles.toggleButtonText,
                loading && styles.toggleButtonDisabled,
              ]}
            >
              {isRegistering
                ? t('login.toggleToLogin')
                : t('login.toggleToRegister')}
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
    shadowOffset: {
      width: 0,
      height: 1,
    },
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
    shadowOffset: {
      width: 0,
      height: 4,
    },
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
  toggleButtonDisabled: {
    color: '#9ca3af',
  },
});
