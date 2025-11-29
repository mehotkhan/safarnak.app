import { useState } from 'react';
import { View, ScrollView, Alert } from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useMeQuery } from '@api';
import { CustomText } from '@ui/display';
import { CustomButton } from '@ui/forms';
import { InputField } from '@ui/forms';
import { Ionicons } from '@expo/vector-icons';
import { Stack } from 'expo-router';

type VerificationStep = 'phone' | 'email' | 'complete';

export default function CompleteAccountScreen() {
  const { t } = useTranslation();
  const { refetch: refetchMe } = useMeQuery();
  
  const [step, setStep] = useState<VerificationStep>('phone');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [phoneCode, setPhoneCode] = useState('');
  const [emailCode, setEmailCode] = useState('');
  const [phoneCodeSent, setPhoneCodeSent] = useState(false);
  const [emailCodeSent, setEmailCodeSent] = useState(false);
  const [loading, setLoading] = useState(false);

  // TODO: Replace with actual GraphQL mutations after schema update and codegen
  // These mutations are defined in graphql/schema.graphql:
  // - requestPhoneVerification(phone: String!): Boolean!
  // - verifyPhone(code: String!): Boolean!
  // - requestEmailVerification(email: String!): Boolean!
  // - verifyEmail(code: String!): Boolean!
  const handleSendPhoneCode = async () => {
    if (!phone.trim()) {
      Alert.alert(
        t('profile.completeAccount.error') || 'Error', 
        t('profile.completeAccount.phoneRequired') || 'Phone number is required'
      );
      return;
    }
    setLoading(true);
    try {
      // TODO: Call requestPhoneVerification mutation
      // const { data } = await requestPhoneVerificationMutation({ variables: { phone: phone.trim() } });
      // if (!data?.requestPhoneVerification) {
      //   throw new Error('Failed to send verification code');
      // }
      
      // Simulate API call for now
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setPhoneCodeSent(true);
      Alert.alert(
        t('profile.completeAccount.success') || 'Success',
        t('profile.completeAccount.phoneCodeSent') || 'Verification code sent to your phone'
      );
    } catch (error: any) {
      Alert.alert(
        t('profile.completeAccount.error') || 'Error',
        error.message || t('profile.completeAccount.sendCodeFailed') || 'Failed to send verification code'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyPhone = async () => {
    if (!phoneCode.trim()) {
      Alert.alert(
        t('profile.completeAccount.error') || 'Error',
        t('profile.completeAccount.codeRequired') || 'Verification code is required'
      );
      return;
    }
    setLoading(true);
    try {
      // Static validation for testing: accept "111111" as valid code
      const isValidCode = phoneCode.trim() === '111111';
      
      if (!isValidCode) {
        // TODO: Call verifyPhone mutation when backend is ready
        // const { data } = await verifyPhoneMutation({ variables: { code: phoneCode.trim() } });
        // if (!data?.verifyPhone) {
        //   throw new Error('Invalid verification code');
        // }
        throw new Error(t('profile.completeAccount.invalidCode') || 'Invalid verification code');
      }
      
      // Simulate API call for now
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setStep('email');
      Alert.alert(
        t('profile.completeAccount.success') || 'Success',
        t('profile.completeAccount.phoneVerified') || 'Phone verified! Now verify your email.'
      );
    } catch (error: any) {
      Alert.alert(
        t('profile.completeAccount.error') || 'Error',
        error.message || t('profile.completeAccount.invalidCode') || 'Invalid verification code'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSendEmailCode = async () => {
    if (!email.trim()) {
      Alert.alert(
        t('profile.completeAccount.error') || 'Error',
        t('profile.completeAccount.emailRequired') || 'Email is required'
      );
      return;
    }
    setLoading(true);
    try {
      // TODO: Call requestEmailVerification mutation
      // const { data } = await requestEmailVerificationMutation({ variables: { email: email.trim() } });
      // if (!data?.requestEmailVerification) {
      //   throw new Error('Failed to send verification code');
      // }
      
      // Simulate API call for now
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setEmailCodeSent(true);
      Alert.alert(
        t('profile.completeAccount.success') || 'Success',
        t('profile.completeAccount.emailCodeSent') || 'Verification code sent to your email'
      );
    } catch (error: any) {
      Alert.alert(
        t('profile.completeAccount.error') || 'Error',
        error.message || t('profile.completeAccount.sendCodeFailed') || 'Failed to send verification code'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyEmail = async () => {
    if (!emailCode.trim()) {
      Alert.alert(
        t('profile.completeAccount.error') || 'Error',
        t('profile.completeAccount.codeRequired') || 'Verification code is required'
      );
      return;
    }
    setLoading(true);
    try {
      // Static validation for testing: accept "111111" as valid code
      const isValidCode = emailCode.trim() === '111111';
      
      if (!isValidCode) {
        // TODO: Call verifyEmail mutation when backend is ready
        // const { data } = await verifyEmailMutation({ variables: { code: emailCode.trim() } });
        // if (!data?.verifyEmail) {
        //   throw new Error('Invalid verification code');
        // }
        throw new Error(t('profile.completeAccount.invalidCode') || 'Invalid verification code');
      }
      
      // Simulate API call for now
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setStep('complete');
      await refetchMe(); // Update Redux/Apollo cache
      Alert.alert(
        t('profile.completeAccount.success') || 'Success',
        t('profile.completeAccount.allVerified') || 'Account complete! You are now a Member.',
        [{ text: t('common.ok') || 'OK', onPress: () => router.back() }]
      );
    } catch (error: any) {
      Alert.alert(
        t('profile.completeAccount.error') || 'Error',
        error.message || t('profile.completeAccount.invalidCode') || 'Invalid verification code'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-white dark:bg-black">
      <Stack.Screen 
        options={{ 
          title: t('profile.completeAccount.title') || 'Complete Account',
          headerShown: true,
        }} 
      />
      
      <View className="px-6 py-8">
        <CustomText weight="bold" className="text-2xl text-black dark:text-white mb-2">
          {t('profile.completeAccount.title') || 'Complete your Safarnak account'}
        </CustomText>
        <CustomText className="text-base text-gray-600 dark:text-gray-400 mb-8">
          {t('profile.completeAccount.subtitle') || 
            'Add and verify your phone and email to secure your account and enable notifications.'}
        </CustomText>

        {/* Progress Indicator */}
        <View className="flex-row items-center mb-8">
          <View className={`flex-1 h-1 ${step === 'phone' || step === 'email' || step === 'complete' ? 'bg-primary' : 'bg-gray-300'}`} />
          <View className="mx-2 w-8 h-8 rounded-full bg-primary items-center justify-center">
            <Ionicons name="checkmark" size={16} color="#fff" />
          </View>
          <View className={`flex-1 h-1 ${step === 'email' || step === 'complete' ? 'bg-primary' : 'bg-gray-300'}`} />
          <View className={`mx-2 w-8 h-8 rounded-full items-center justify-center ${
            step === 'email' || step === 'complete' ? 'bg-primary' : 'bg-gray-300'
          }`}>
            {step === 'complete' ? (
              <Ionicons name="checkmark" size={16} color="#fff" />
            ) : (
              <CustomText className="text-white text-xs">2</CustomText>
            )}
          </View>
          <View className={`flex-1 h-1 ${step === 'complete' ? 'bg-primary' : 'bg-gray-300'}`} />
        </View>

        {/* Step 1: Phone Verification */}
        {step === 'phone' && (
          <View>
            <CustomText weight="bold" className="text-lg text-black dark:text-white mb-4">
              {t('profile.completeAccount.step1') || 'Step 1: Verify Phone'}
            </CustomText>
            <InputField
              label={t('profile.completeAccount.phoneLabel') || 'Phone Number'}
              value={phone}
              onChangeText={setPhone}
              placeholder={t('profile.completeAccount.phonePlaceholder') || '+1 (555) 123-4567'}
              keyboardType="phone-pad"
              editable={!loading && !phoneCodeSent}
              icon="call-outline"
            />
            {!phoneCodeSent ? (
              <CustomButton
                title={t('profile.completeAccount.sendPhoneCode') || 'Send verification code'}
                onPress={handleSendPhoneCode}
                loading={loading}
                className="mt-4"
              />
            ) : (
              <>
                <InputField
                  label={t('profile.completeAccount.phoneCodeLabel') || 'Verification Code'}
                  value={phoneCode}
                  onChangeText={setPhoneCode}
                  placeholder={t('profile.completeAccount.codePlaceholder') || 'Enter code'}
                  keyboardType="number-pad"
                  editable={!loading}
                  className="mt-4"
                  icon="keypad-outline"
                />
                <CustomButton
                  title={t('profile.completeAccount.verifyPhone') || 'Verify Phone'}
                  onPress={handleVerifyPhone}
                  loading={loading}
                  className="mt-4"
                />
                <CustomButton
                  title={t('profile.completeAccount.resendCode') || 'Resend code'}
                  onPress={handleSendPhoneCode}
                  loading={loading}
                  bgVariant="outline"
                  className="mt-2"
                />
              </>
            )}
          </View>
        )}

        {/* Step 2: Email Verification */}
        {step === 'email' && (
          <View>
            <CustomText weight="bold" className="text-lg text-black dark:text-white mb-4">
              {t('profile.completeAccount.step2') || 'Step 2: Verify Email'}
            </CustomText>
            <InputField
              label={t('profile.completeAccount.emailLabel') || 'Email Address'}
              value={email}
              onChangeText={setEmail}
              placeholder={t('profile.completeAccount.emailPlaceholder') || 'your@email.com'}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!loading && !emailCodeSent}
              icon="mail-outline"
            />
            {!emailCodeSent ? (
              <CustomButton
                title={t('profile.completeAccount.sendEmailCode') || 'Send verification code'}
                onPress={handleSendEmailCode}
                loading={loading}
                className="mt-4"
              />
            ) : (
              <>
                <InputField
                  label={t('profile.completeAccount.emailCodeLabel') || 'Verification Code'}
                  value={emailCode}
                  onChangeText={setEmailCode}
                  placeholder={t('profile.completeAccount.codePlaceholder') || 'Enter code'}
                  keyboardType="default"
                  editable={!loading}
                  className="mt-4"
                  icon="keypad-outline"
                />
                <CustomButton
                  title={t('profile.completeAccount.verifyEmail') || 'Verify Email'}
                  onPress={handleVerifyEmail}
                  loading={loading}
                  className="mt-4"
                />
                <CustomButton
                  title={t('profile.completeAccount.resendCode') || 'Resend code'}
                  onPress={handleSendEmailCode}
                  loading={loading}
                  bgVariant="outline"
                  className="mt-2"
                />
              </>
            )}
          </View>
        )}

        {/* Complete State */}
        {step === 'complete' && (
          <View className="items-center py-8">
            <Ionicons name="checkmark-circle" size={64} color="#10b981" />
            <CustomText weight="bold" className="text-xl text-black dark:text-white mt-4 mb-2">
              {t('profile.completeAccount.completeTitle') || 'Account Complete!'}
            </CustomText>
            <CustomText className="text-base text-gray-600 dark:text-gray-400 text-center">
              {t('profile.completeAccount.completeMessage') || 
                'You are now a Safarnak Member. Enjoy enhanced features!'}
            </CustomText>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

