import { useState } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { Stack } from 'expo-router';
import { useDateTime } from '@hooks/useDateTime';
import { Ionicons } from '@expo/vector-icons';
import { CustomText } from '@components/display';
import { useTheme } from '@components/context';
import Colors from '@constants/Colors';

// Mock data
const mockPayments = [
  {
    id: '1',
    type: 'tour',
    title: 'Cherry Blossom Tour',
    amount: 1200,
    currency: 'USD',
    status: 'completed',
    date: '2025-11-15',
    transactionId: 'TXN-2025-001234',
  },
  {
    id: '2',
    type: 'subscription',
    title: 'Pro Plan - Monthly',
    amount: 29,
    currency: 'USD',
    status: 'completed',
    date: '2025-11-01',
    transactionId: 'TXN-2025-001123',
  },
  {
    id: '3',
    type: 'tour',
    title: 'Alps Hiking Adventure',
    amount: 2500,
    currency: 'USD',
    status: 'pending',
    date: '2025-10-28',
    transactionId: 'TXN-2025-001098',
  },
  {
    id: '4',
    type: 'subscription',
    title: 'Pro Plan - Monthly',
    amount: 29,
    currency: 'USD',
    status: 'completed',
    date: '2025-10-01',
    transactionId: 'TXN-2025-000987',
  },
];

interface PaymentCardProps {
  payment: any;
  isDark: boolean;
  t: any;
}

const PaymentCard = ({ payment, isDark, t }: PaymentCardProps) => {
  const { formatDate } = useDateTime();
  const statusColor =
    payment.status === 'completed'
      ? 'bg-green-100 dark:bg-green-900'
      : payment.status === 'pending'
        ? 'bg-yellow-100 dark:bg-yellow-900'
        : 'bg-red-100 dark:bg-red-900';
  
  const statusTextColor =
    payment.status === 'completed'
      ? 'text-green-800 dark:text-green-200'
      : payment.status === 'pending'
        ? 'text-yellow-800 dark:text-yellow-200'
        : 'text-red-800 dark:text-red-200';

  const typeIcon = payment.type === 'tour' ? 'airplane' : 'star';
  const typeColor = payment.type === 'tour' 
    ? (isDark ? Colors.dark.primary : Colors.light.primary)
    : '#fbbf24';

  return (
    <View className="bg-white dark:bg-neutral-900 rounded-2xl p-4 mb-3 border border-gray-200 dark:border-neutral-800">
      <View className="flex-row items-start justify-between mb-3">
        <View className="flex-1">
          <View className="flex-row items-center mb-2">
            <View
              className="w-10 h-10 rounded-full items-center justify-center mr-3"
              style={{ backgroundColor: typeColor + '20' }}
            >
              <Ionicons name={typeIcon as any} size={20} color={typeColor} />
            </View>
            <View className="flex-1">
              <CustomText
                weight="bold"
                className="text-base text-black dark:text-white"
              >
                {payment.title}
              </CustomText>
              <CustomText className="text-sm text-gray-500 dark:text-gray-400">
                {formatDate(payment.date, 'short')}
              </CustomText>
            </View>
          </View>
        </View>
        <View className={`px-3 py-1 rounded-full ${statusColor}`}>
          <CustomText className={`text-xs ${statusTextColor}`}>
            {t(`payments.status.${payment.status}`)}
          </CustomText>
        </View>
      </View>

      <View className="flex-row items-center justify-between pt-3 border-t border-gray-200 dark:border-neutral-800">
        <View>
          <CustomText className="text-sm text-gray-500 dark:text-gray-400">
            {t('payments.amount')}
          </CustomText>
          <CustomText weight="bold" className="text-lg text-black dark:text-white">
            {payment.currency} ${payment.amount}
          </CustomText>
        </View>
        <View className="items-end">
          <CustomText className="text-sm text-gray-500 dark:text-gray-400">
            {t('payments.transactionId')}
          </CustomText>
          <CustomText className="text-xs text-gray-600 dark:text-gray-400">
            {payment.transactionId}
          </CustomText>
        </View>
      </View>
    </View>
  );
};

export default function PaymentsScreen() {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const [selectedTab, setSelectedTab] = useState<'all' | 'tours' | 'subscriptions'>('all');

  const filteredPayments = selectedTab === 'all'
    ? mockPayments
    : mockPayments.filter(p => 
        selectedTab === 'tours' ? p.type === 'tour' : p.type === 'subscription'
      );

  return (
    <View className="flex-1 bg-white dark:bg-black">
      <Stack.Screen options={{ title: t('payments.title'), headerShown: true }} />

      {/* Tabs */}
      <View className="px-6 pt-4 pb-2">
        <View className="flex-row gap-2">
          <TouchableOpacity
            onPress={() => setSelectedTab('all')}
            className={`flex-1 py-3 rounded-lg ${
              selectedTab === 'all'
                ? 'bg-primary'
                : 'bg-gray-100 dark:bg-neutral-900'
            }`}
          >
            <CustomText
              weight="medium"
              className={`text-center ${
                selectedTab === 'all'
                  ? 'text-white'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              {t('payments.tabs.all')}
            </CustomText>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setSelectedTab('tours')}
            className={`flex-1 py-3 rounded-lg ${
              selectedTab === 'tours'
                ? 'bg-primary'
                : 'bg-gray-100 dark:bg-neutral-900'
            }`}
          >
            <CustomText
              weight="medium"
              className={`text-center ${
                selectedTab === 'tours'
                  ? 'text-white'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              {t('payments.tabs.tours')}
            </CustomText>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setSelectedTab('subscriptions')}
            className={`flex-1 py-3 rounded-lg ${
              selectedTab === 'subscriptions'
                ? 'bg-primary'
                : 'bg-gray-100 dark:bg-neutral-900'
            }`}
          >
            <CustomText
              weight="medium"
              className={`text-center ${
                selectedTab === 'subscriptions'
                  ? 'text-white'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              {t('payments.tabs.subscriptions')}
            </CustomText>
          </TouchableOpacity>
        </View>
      </View>

      {/* Content */}
      {filteredPayments.length === 0 ? (
        <View className="flex-1 items-center justify-center px-6">
          <Ionicons
            name="receipt-outline"
            size={80}
            color={isDark ? '#4b5563' : '#d1d5db'}
          />
          <CustomText
            weight="bold"
            className="text-xl text-gray-800 dark:text-gray-300 mt-4 mb-2 text-center"
          >
            {t('payments.emptyState')}
          </CustomText>
        </View>
      ) : (
        <ScrollView className="flex-1 px-6 py-4">
          {filteredPayments.map(payment => (
            <PaymentCard
              key={payment.id}
              payment={payment}
              isDark={isDark}
              t={t}
            />
          ))}
        </ScrollView>
      )}
    </View>
  );
}

