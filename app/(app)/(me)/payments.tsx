import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import { useAppSelector } from '@state/hooks';
import Colors from '@constants/Colors';

// Mock data for subscription invoices
interface SubscriptionInvoice {
  id: string;
  date: Date;
  plan: 'free' | 'pro' | 'premium';
  amount: number;
  currency: string;
  status: 'paid' | 'pending' | 'failed';
  invoiceNumber: string;
}

const mockInvoices: SubscriptionInvoice[] = [
  {
    id: '1',
    date: new Date(2024, 10, 1),
    plan: 'pro',
    amount: 9.99,
    currency: 'USD',
    status: 'paid',
    invoiceNumber: 'INV-2024-11-001',
  },
  {
    id: '2',
    date: new Date(2024, 9, 1),
    plan: 'pro',
    amount: 9.99,
    currency: 'USD',
    status: 'paid',
    invoiceNumber: 'INV-2024-10-001',
  },
  {
    id: '3',
    date: new Date(2024, 8, 1),
    plan: 'free',
    amount: 0,
    currency: 'USD',
    status: 'paid',
    invoiceNumber: 'INV-2024-09-001',
  },
];

export default function PaymentsScreen() {
  const { t } = useTranslation();
  const isDark = useAppSelector(state => state.theme.isDark);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'paid' | 'pending'>('all');

  const colors = isDark ? Colors.dark : Colors.light;

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return '#10b981';
      case 'pending':
        return '#f59e0b';
      case 'failed':
        return '#ef4444';
      default:
        return colors.text;
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getPlanLabel = (plan: string) => {
    return t(`subscription.plans.${plan}`);
  };

  const filteredInvoices = selectedFilter === 'all'
    ? mockInvoices
    : mockInvoices.filter(inv => inv.status === selectedFilter);

  const filters = [
    { id: 'all' as const, label: t('payments.tabs.all') },
    { id: 'paid' as const, label: t('payments.status.completed') },
    { id: 'pending' as const, label: t('payments.status.pending') },
  ];

  return (
    <View className='flex-1' style={{ backgroundColor: colors.background }}>
      <Stack.Screen
        options={{
          title: t('payments.title'),
          headerShown: true,
        }}
      />

      {/* Filter tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className='border-b'
        style={{
          borderBottomColor: isDark ? '#333' : '#e5e7eb',
          maxHeight: 50,
        }}
          >
        <View className='flex-row gap-2 px-4 py-2'>
          {filters.map((filter) => (
          <TouchableOpacity
              key={filter.id}
              onPress={() => setSelectedFilter(filter.id)}
              className='rounded-full px-4 py-2'
              style={{
                backgroundColor:
                  selectedFilter === filter.id
                    ? colors.primary
                    : isDark ? '#374151' : '#f3f4f6',
              }}
          >
              <Text
                className='font-medium'
                style={{
                  color:
                    selectedFilter === filter.id
                      ? '#fff'
                      : colors.text,
                }}
            >
                {filter.label}
              </Text>
          </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Invoices list */}
      <ScrollView
        className='flex-1'
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {filteredInvoices.length === 0 ? (
          <View className='items-center justify-center py-20'>
          <Ionicons
              name='receipt-outline'
              size={64}
              color={isDark ? '#6b7280' : '#9ca3af'}
          />
            <Text
              className='mt-4 text-lg font-semibold'
              style={{ color: colors.text }}
          >
            {t('payments.emptyState')}
            </Text>
        </View>
      ) : (
          <View className='gap-3 p-4'>
            {filteredInvoices.map((invoice) => (
              <TouchableOpacity
                key={invoice.id}
                className='rounded-xl p-4'
                style={{
                  backgroundColor: isDark ? '#1f2937' : '#fff',
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: isDark ? 0.3 : 0.1,
                  shadowRadius: 4,
                  elevation: 2,
                }}
                activeOpacity={0.9}
                onPress={() => {
                  // Navigate to invoice detail if needed
                  console.log('Invoice:', invoice.id);
                }}
              >
                {/* Header */}
                <View className='mb-3 flex-row items-center justify-between'>
                  <View className='flex-1'>
                    <Text className='mb-1 text-base font-bold' style={{ color: colors.text }}>
                      {t('common.appName')} {getPlanLabel(invoice.plan)}
                    </Text>
                    <Text className='text-sm' style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>
                      {formatDate(invoice.date)}
                    </Text>
                  </View>
                  <View
                    className='rounded-full px-3 py-1'
                    style={{
                      backgroundColor: `${getStatusColor(invoice.status)}20`,
                    }}
                  >
                    <Text
                      className='text-xs font-semibold capitalize'
                      style={{ color: getStatusColor(invoice.status) }}
                    >
                      {t(`payments.status.${invoice.status}`)}
                    </Text>
                  </View>
                </View>

                {/* Amount */}
                <View className='flex-row items-center justify-between border-t pt-3' style={{ borderTopColor: isDark ? '#374151' : '#e5e7eb' }}>
                  <View>
                    <Text className='text-xs' style={{ color: isDark ? '#6b7280' : '#9ca3af' }}>
                      {t('payments.amount')}
                    </Text>
                    <Text className='text-xl font-bold' style={{ color: colors.text }}>
                      {invoice.currency === 'USD' ? '$' : ''}{invoice.amount.toFixed(2)}
                    </Text>
                  </View>
                  <View className='items-end'>
                    <Text className='text-xs' style={{ color: isDark ? '#6b7280' : '#9ca3af' }}>
                      {t('payments.transactionId')}
                    </Text>
                    <Text className='font-mono text-xs' style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>
                      {invoice.invoiceNumber}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
          ))}
          </View>
        )}
        </ScrollView>
    </View>
  );
}
