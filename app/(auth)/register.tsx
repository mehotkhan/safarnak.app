import { generateRandomName } from '@/utils/nameGenerator';
import { useLanguage } from '@components/context/LanguageContext';
import CustomButton from '@components/ui/CustomButton';
import { CustomText } from '@components/ui/CustomText';
import InputField from '@components/ui/InputField';
import { Ionicons } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { KeyboardAvoidingView, Platform, TouchableOpacity, View } from 'react-native';
// import { useRegisterMutation } from '@api';
// import { login } from '@store/slices/authSlice';
// import { useAppDispatch, useAppSelector } from '@store/hooks';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { Alert } from 'react-native';

export default function RegisterScreen() {
  const { t } = useTranslation();
  const { currentLanguage } = useLanguage();
  // const dispatch = useAppDispatch();
  // const { isAuthenticated } = useAppSelector(state => state.auth);
  const [username, setUsername] = useState('');
  const [generatedName, setGeneratedName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // const [registerMutation, { loading }] = useRegisterMutation();

  // Generate initial name on mount and when language changes
  useEffect(() => {
    const initialName = generateRandomName(currentLanguage as 'en' | 'fa');
    // Use setTimeout to avoid setState in effect body
    setTimeout(() => {
      setGeneratedName(initialName);
      setUsername(initialName);
    }, 0);
  }, [currentLanguage]);

  // useEffect(() => {
  //   if (isAuthenticated) {
  //     router.replace('/(app)/(feed)' as any);
  //   }
  // }, [isAuthenticated]);

  const handleRefreshName = useCallback(() => {
    const newName = generateRandomName(currentLanguage as 'en' | 'fa');
    setGeneratedName(newName);
    setUsername(newName);
    if (errorMessage) setErrorMessage('');
  }, [currentLanguage, errorMessage]);

  const handleRegister = async () => {
    setErrorMessage('');

    if (!username.trim()) {
      setErrorMessage(t('login.errors.fieldsRequired'));
      return;
    }

    // TODO: Uncomment when GraphQL is ready
    // try {
    //   const result = await registerMutation({
    //     variables: { username: username.trim(), password: 'defaultPassword' },
    //   });

    //   const errors = (result as any).errors;
    //   if (errors && errors.length > 0) {
    //     const errorMessage = errors[0]?.message || '';
        
    //     if (errorMessage.includes('already exists') || errorMessage.includes('User with this username already exists')) {
    //       setErrorMessage(t('login.errors.userExists'));
    //     } else if (errorMessage.includes('Username is required')) {
    //       setErrorMessage(t('login.errors.usernameRequired'));
    //     } else {
    //       setErrorMessage(errorMessage || t('login.errors.databaseError'));
    //     }
    //     return;
    //   }

    //   if (result.data?.register) {
    //     const { user, token } = result.data.register;

    //     await AsyncStorage.setItem('@safarnak_user', JSON.stringify({ user, token }));
    //     dispatch(login({ user: user as any, token }));
    //     router.replace('/(app)/(feed)' as any);
    //     Alert.alert(t('login.success.title'), t('login.success.registerSuccess'));
    //   }
    // } catch (error: any) {
    //   const message = error?.message || error?.graphQLErrors?.[0]?.message || '';
      
    //   if (message.includes('already exists') || message.includes('User with this username already exists')) {
    //     setErrorMessage(t('login.errors.userExists'));
    //   } else if (message.includes('Username is required')) {
    //     setErrorMessage(t('login.errors.usernameRequired'));
    //   } else if (error?.networkError) {
    //     setErrorMessage(t('login.errors.networkError'));
    //   } else {
    //     setErrorMessage(message || t('login.errors.databaseError'));
    //   }
    // }

    // Temporary: Just show success message
    console.log('Register with username:', username.trim());
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white dark:bg-gray-900"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Stack.Screen options={{ title: t('login.register.title') }} />
      <View className="flex-1 justify-center px-6">
        <View className="items-center mb-8">
          <CustomText weight='bold' className="text-3xl text-center mb-3 text-gray-900 dark:text-gray-100">
            {t('login.register.title')}
          </CustomText>
          <CustomText className="text-base text-center text-gray-600 dark:text-gray-400 leading-6">
            {t('login.register.subtitle')}
          </CustomText>
        </View>

        <View className="w-full">
          {/* Auto-generated name display with refresh button */}
          <View className="mb-6">
            <View className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
              <View className="flex-row items-center justify-between mb-3">
                <CustomText className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                  {t('login.usernameLabel')}
                </CustomText>
                <TouchableOpacity
                  onPress={handleRefreshName}
                  className="flex-row items-center bg-blue-50 dark:bg-blue-900/30 px-3 py-1.5 rounded-lg"
                  activeOpacity={0.7}
                >
                  <Ionicons name="refresh" size={16} color="#3b82f6" />
                  <CustomText className="text-blue-600 dark:text-blue-400 text-sm font-medium ml-1.5">
                    {t('common.refresh') || 'Refresh'}
                  </CustomText>
                </TouchableOpacity>
              </View>
              
              <View className="bg-white dark:bg-gray-900 rounded-lg p-3 mb-3 border border-gray-200 dark:border-gray-700">
                <CustomText className="text-lg text-gray-900 dark:text-gray-100 font-medium text-center">
                  {generatedName}
                </CustomText>
              </View>

              {/* Fingerprint icon */}
              <View className="items-center mt-2">
                <Ionicons name="finger-print" size={24} color="#6b7280" />
              </View>
            </View>
          </View>

          {/* Name input field (editable) */}
          <View className="mb-6">
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
              returnKeyType='done'
              onSubmitEditing={handleRegister}
              editable={true}
            />
          </View>

          {errorMessage ? (
            <View className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg px-4 py-3 mb-4">
              <CustomText className="text-red-600 dark:text-red-400 text-sm text-center">
                {errorMessage}
              </CustomText>
            </View>
          ) : null}

          {/* Register button */}
          <CustomButton
            title={t('login.registerButton')}
            onPress={handleRegister}
            loading={false}
            disabled={false}
          />

          {/* Login link */}
          <TouchableOpacity
            className="items-center py-4"
            onPress={() => router.push('/(auth)/login' as any)}
            disabled={false}
          >
            <CustomText className="text-blue-600 dark:text-blue-400 text-sm font-medium">
              {t('login.toggleToLogin')}
            </CustomText>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
