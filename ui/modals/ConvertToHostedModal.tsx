import { useState, useEffect } from 'react';
import {
  View,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { CustomText } from '@ui/display';
import { useTheme } from '@ui/context';

export type TripJoinPolicy = 'OPEN' | 'REQUEST' | 'INVITE_ONLY';

interface ConvertToHostedModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: {
    price?: number;
    currency: string;
    maxParticipants?: number;
    minParticipants: number;
    joinPolicy: TripJoinPolicy;
    description?: string;
    hostIntro?: string;
  }) => Promise<void>;
  initialData?: {
    destination?: string;
    price?: number;
    currency?: string;
  };
  loading?: boolean;
}

export default function ConvertToHostedModal({
  visible,
  onClose,
  onSubmit,
  initialData,
  loading = false,
}: ConvertToHostedModalProps) {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  
  const [price, setPrice] = useState('');
  const [currency, setCurrency] = useState(initialData?.currency || 'USD');
  const [maxParticipants, setMaxParticipants] = useState('');
  const [minParticipants, setMinParticipants] = useState('1');
  const [joinPolicy, setJoinPolicy] = useState<TripJoinPolicy>('OPEN');
  const [description, setDescription] = useState('');
  const [hostIntro, setHostIntro] = useState('');

  // Reset form when modal opens/closes
  useEffect(() => {
    if (!visible) return;
    
    // Use setTimeout to avoid synchronous state updates in effect
    const timer = setTimeout(() => {
      setPrice(initialData?.price?.toString() || '');
      setCurrency(initialData?.currency || 'USD');
      setMaxParticipants('');
      setMinParticipants('1');
      setJoinPolicy('OPEN');
      setDescription('');
      setHostIntro('');
    }, 0);
    
    return () => clearTimeout(timer);
  }, [visible, initialData]);

  const handleSubmit = async () => {
    // Validate required fields
    if (!minParticipants || parseInt(minParticipants) < 1) {
      Alert.alert(
        t('common.error'),
        t('tripDetail.convertToHosted.minParticipantsRequired', { defaultValue: 'Minimum participants must be at least 1' })
      );
      return;
    }

    if (maxParticipants && parseInt(maxParticipants) < parseInt(minParticipants)) {
      Alert.alert(
        t('common.error'),
        t('tripDetail.convertToHosted.maxParticipantsError', { defaultValue: 'Maximum participants must be greater than or equal to minimum participants' })
      );
      return;
    }

    try {
      await onSubmit({
        price: price ? parseFloat(price) : undefined,
        currency,
        maxParticipants: maxParticipants ? parseInt(maxParticipants) : undefined,
        minParticipants: parseInt(minParticipants),
        joinPolicy,
        description: description.trim() || undefined,
        hostIntro: hostIntro.trim() || undefined,
      });
    } catch (error) {
      // Error handled by parent
      console.error('Convert to hosted error:', error);
    }
  };

  const currencies = ['USD', 'EUR', 'GBP', 'IRR', 'AED', 'SAR'];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <View className="flex-1 bg-black/50">
          <TouchableOpacity
            className="absolute inset-0"
            activeOpacity={1}
            onPress={onClose}
          />
          <View
            className={`bg-white dark:bg-neutral-900 ${
              Platform.OS === 'ios' ? 'pb-8' : 'pb-6'
            }`}
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: -2 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 10,
              height: '90%',
              width: '100%',
              marginTop: '10%',
            }}
          >
            {/* Header */}
            <View className="px-6 pt-6 pb-4 border-b border-gray-200 dark:border-neutral-800">
              <View className="flex-row items-center justify-between">
              <CustomText weight="bold" className="text-xl text-black dark:text-white">
                {t('tripDetail.convertToHosted.title', { defaultValue: 'Convert to Hosted Trip' })}
              </CustomText>
              <TouchableOpacity onPress={onClose} disabled={loading}>
                <Ionicons
                  name="close"
                  size={24}
                  color={isDark ? '#fff' : '#000'}
                />
              </TouchableOpacity>
              </View>
            </View>

            {/* Content */}
            <ScrollView 
              className="flex-1"
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={{
                flexGrow: 1,
                paddingHorizontal: 24,
                paddingTop: 16,
                paddingBottom: 24,
              }}
            >
              <CustomText className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                {t('tripDetail.convertToHosted.description', { 
                  defaultValue: 'Make your trip discoverable by others. Set pricing, capacity, and join settings.' 
                })}
              </CustomText>

              {/* Price */}
              <View className="mb-4">
                <CustomText weight="medium" className="text-base text-black dark:text-white mb-2">
                  {t('tripDetail.convertToHosted.price', { defaultValue: 'Price' })}
                </CustomText>
                <View className="flex-row">
                  <TextInput
                    className="flex-1 bg-gray-100 dark:bg-neutral-800 rounded-lg px-4 py-3 text-black dark:text-white"
                    placeholder={t('tripDetail.convertToHosted.pricePlaceholder', { defaultValue: '0.00' })}
                    placeholderTextColor={isDark ? '#9ca3af' : '#6b7280'}
                    value={price}
                    onChangeText={setPrice}
                    keyboardType="decimal-pad"
                    editable={!loading}
                  />
                  <View className="ml-2">
                    <View className="bg-gray-100 dark:bg-neutral-800 rounded-lg px-3 py-3">
                      <CustomText className="text-black dark:text-white">
                        {currency}
                      </CustomText>
                    </View>
                  </View>
                </View>
              </View>

              {/* Currency Selector */}
              <View className="mb-4">
                <CustomText weight="medium" className="text-base text-black dark:text-white mb-2">
                  {t('tripDetail.convertToHosted.currency', { defaultValue: 'Currency' })}
                </CustomText>
                <View className="flex-row flex-wrap">
                  {currencies.map((curr) => (
                    <TouchableOpacity
                      key={curr}
                      onPress={() => setCurrency(curr)}
                      disabled={loading}
                      className={`px-4 py-2 rounded-lg mr-2 mb-2 ${
                        currency === curr
                          ? 'bg-primary'
                          : 'bg-gray-100 dark:bg-neutral-800'
                      }`}
                    >
                      <CustomText
                        className={currency === curr ? 'text-white' : 'text-black dark:text-white'}
                      >
                        {curr}
                      </CustomText>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Participants */}
              <View className="mb-4">
                <CustomText weight="medium" className="text-base text-black dark:text-white mb-2">
                  {t('tripDetail.convertToHosted.participants', { defaultValue: 'Participants' })}
                </CustomText>
                <View className="flex-row">
                  <View className="flex-1 mr-2">
                    <CustomText className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      {t('tripDetail.convertToHosted.minParticipants', { defaultValue: 'Min' })}
                    </CustomText>
                    <TextInput
                      className="bg-gray-100 dark:bg-neutral-800 rounded-lg px-4 py-3 text-black dark:text-white"
                      placeholder="1"
                      placeholderTextColor={isDark ? '#9ca3af' : '#6b7280'}
                      value={minParticipants}
                      onChangeText={setMinParticipants}
                      keyboardType="number-pad"
                      editable={!loading}
                    />
                  </View>
                  <View className="flex-1 ml-2">
                    <CustomText className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      {t('tripDetail.convertToHosted.maxParticipants', { defaultValue: 'Max (optional)' })}
                    </CustomText>
                    <TextInput
                      className="bg-gray-100 dark:bg-neutral-800 rounded-lg px-4 py-3 text-black dark:text-white"
                      placeholder={t('tripDetail.convertToHosted.maxParticipantsPlaceholder', { defaultValue: 'Unlimited' })}
                      placeholderTextColor={isDark ? '#9ca3af' : '#6b7280'}
                      value={maxParticipants}
                      onChangeText={setMaxParticipants}
                      keyboardType="number-pad"
                      editable={!loading}
                    />
                  </View>
                </View>
              </View>

              {/* Join Policy */}
              <View className="mb-4">
                <CustomText weight="medium" className="text-base text-black dark:text-white mb-2">
                  {t('tripDetail.convertToHosted.joinPolicy', { defaultValue: 'Join Policy' })}
                </CustomText>
                <View className="space-y-2">
                  {(['OPEN', 'REQUEST', 'INVITE_ONLY'] as TripJoinPolicy[]).map((policy) => (
                    <TouchableOpacity
                      key={policy}
                      onPress={() => setJoinPolicy(policy)}
                      disabled={loading}
                      className={`p-3 rounded-lg border ${
                        joinPolicy === policy
                          ? 'border-primary bg-primary/10'
                          : 'border-gray-200 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-800'
                      }`}
                    >
                      <CustomText
                        weight={joinPolicy === policy ? 'bold' : 'medium'}
                        className={`${
                          joinPolicy === policy
                            ? 'text-primary'
                            : 'text-black dark:text-white'
                        }`}
                      >
                        {t(`tripDetail.convertToHosted.joinPolicy.${policy.toLowerCase()}`, {
                          defaultValue: policy === 'OPEN' ? 'Open - Anyone can join' : 
                                       policy === 'REQUEST' ? 'Request - Users must request to join' :
                                       'Invite Only - Only invited users can join'
                        })}
                      </CustomText>
                      <CustomText className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {t(`tripDetail.convertToHosted.joinPolicy.${policy.toLowerCase()}Description`, {
                          defaultValue: policy === 'OPEN' ? 'Anyone can join immediately' : 
                                       policy === 'REQUEST' ? 'Users request, you approve' :
                                       'You invite specific users'
                        })}
                      </CustomText>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Description */}
              <View className="mb-4">
                <CustomText weight="medium" className="text-base text-black dark:text-white mb-2">
                  {t('tripDetail.convertToHosted.descriptionLabel', { defaultValue: 'Description (optional)' })}
                </CustomText>
                <TextInput
                  className="bg-gray-100 dark:bg-neutral-800 rounded-lg px-4 py-3 text-black dark:text-white"
                  placeholder={t('tripDetail.convertToHosted.descriptionPlaceholder', { defaultValue: 'Describe your hosted trip...' })}
                  placeholderTextColor={isDark ? '#9ca3af' : '#6b7280'}
                  value={description}
                  onChangeText={setDescription}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                  editable={!loading}
                />
              </View>

              {/* Host Intro */}
              <View className="mb-4">
                <CustomText weight="medium" className="text-base text-black dark:text-white mb-2">
                  {t('tripDetail.convertToHosted.hostIntro', { defaultValue: 'Host Introduction (optional)' })}
                </CustomText>
                <TextInput
                  className="bg-gray-100 dark:bg-neutral-800 rounded-lg px-4 py-3 text-black dark:text-white"
                  placeholder={t('tripDetail.convertToHosted.hostIntroPlaceholder', { defaultValue: 'Tell participants about yourself...' })}
                  placeholderTextColor={isDark ? '#9ca3af' : '#6b7280'}
                  value={hostIntro}
                  onChangeText={setHostIntro}
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                  editable={!loading}
                />
              </View>
            </ScrollView>

            {/* Footer */}
            <View className="flex-row p-4 border-t border-gray-200 dark:border-neutral-800">
              <TouchableOpacity
                onPress={onClose}
                disabled={loading}
                className="flex-1 py-3 rounded-lg bg-gray-100 dark:bg-neutral-800 mr-3 items-center"
              >
                <CustomText className="text-gray-700 dark:text-gray-300">
                  {t('common.cancel')}
                </CustomText>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSubmit}
                disabled={loading}
                className="flex-1 py-3 rounded-lg bg-primary items-center"
              >
                {loading ? (
                  <CustomText className="text-white">...</CustomText>
                ) : (
                  <CustomText weight="medium" className="text-white">
                    {t('tripDetail.convertToHosted.submit', { defaultValue: 'Convert to Hosted Trip' })}
                  </CustomText>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

