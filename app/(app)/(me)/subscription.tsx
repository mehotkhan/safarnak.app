import { useState } from 'react';
import {
  View,
  ScrollView,
  Alert,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { CustomText } from '@ui/display';
import { CustomButton } from '@ui/forms';
import { useTheme } from '@ui/context';
import { useUserLevel } from '@hooks/useUserLevel';
import { useMeQuery } from '@api';
import { useAppSelector } from '@state/hooks';

// Note: plans are now defined inside the component to access t()

interface PlanCardProps {
  plan: any;
  currentPlan: string;
  onSelect: () => void;
  isDark: boolean;
  t: any;
}

const PlanCard = ({ plan, currentPlan, onSelect, isDark, t }: PlanCardProps) => {
  const isActive = currentPlan === plan.id;
  const isPremium = plan.popular;

  return (
    <View
      className={`rounded-2xl p-5 mb-4 border-2 ${
        isPremium
          ? 'bg-primary/10 dark:bg-primary/20 border-primary'
          : isActive
            ? 'bg-white dark:bg-neutral-900 border-primary'
            : 'bg-white dark:bg-neutral-900 border-gray-200 dark:border-neutral-800'
      }`}
    >
      {isPremium && (
        <View className="absolute top-4 right-4 px-3 py-1 bg-primary rounded-full">
          <CustomText className="text-white text-xs" weight="bold">
            {t('subscription.popular')}
          </CustomText>
        </View>
      )}

      <CustomText weight="bold" className="text-2xl text-black dark:text-white mb-1">
        {plan.name}
      </CustomText>
      
      <View className="flex-row items-baseline mb-4">
        <CustomText weight="bold" className="text-4xl text-primary">
          ${plan.price}
        </CustomText>
        <CustomText className="text-gray-600 dark:text-gray-400 ml-2">
          /{t('subscription.month')}
        </CustomText>
      </View>

      <View className="mb-4">
        <CustomText className="text-sm text-gray-600 dark:text-gray-400 mb-2">
          {t('subscription.aiQuota', { quota: plan.aiQuota })}
        </CustomText>
      </View>

      <View className="mb-5">
        {plan.features.map((feature: string, index: number) => (
          <View key={index} className="flex-row items-start mb-2">
            <Ionicons
              name="checkmark-circle"
              size={20}
              color={isPremium ? (isDark ? '#60a5fa' : '#3b82f6') : '#10b981'}
              style={{ marginTop: 2 }}
            />
            <CustomText className="text-base text-gray-700 dark:text-gray-300 ml-3 flex-1">
              {t(feature)}
            </CustomText>
          </View>
        ))}
      </View>

      {isActive ? (
        <View className="py-3 bg-gray-100 dark:bg-neutral-800 rounded-lg items-center">
          <CustomText weight="bold" className="text-gray-700 dark:text-gray-300">
            {t('subscription.currentPlan')}
          </CustomText>
        </View>
      ) : (
        <CustomButton
          title={t('subscription.selectPlan')}
          onPress={onSelect}
          bgVariant={isPremium ? 'primary' : 'secondary'}
        />
      )}
    </View>
  );
};

export default function SubscriptionScreen() {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const userLevel = useUserLevel();
  const { user: reduxUser } = useAppSelector(state => state.auth);
  const { data: meData } = useMeQuery({
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all',
  });
  const user = meData?.me || reduxUser;
  const [currentPlan, setCurrentPlan] = useState(userLevel === 'pro' ? 'pro' : 'free');
  
  // Get subscription expiry date if user is pro
  const subscriptionExpiresAt = (user as any)?.subscriptionExpiresAt;

  const plans = [
    {
      id: 'free',
      name: t('subscription.plans.free'),
      price: 0,
      aiQuota: 5,
      features: [
        'subscription.features.basicAI',
        'subscription.features.limitedTrips',
        'subscription.features.communityAccess',
      ],
    },
    {
      id: 'pro',
      name: t('subscription.plans.pro'),
      price: 29,
      aiQuota: 50,
      popular: true,
      features: [
        'subscription.features.advancedAI',
        'subscription.features.unlimitedTrips',
        'subscription.features.prioritySupport',
        'subscription.features.offlineMaps',
        'subscription.features.customItineraries',
      ],
    },
    {
      id: 'premium',
      name: t('subscription.plans.premium'),
      price: 79,
      aiQuota: 200,
      features: [
        'subscription.features.premiumAI',
        'subscription.features.unlimitedEverything',
        'subscription.features.dedicatedSupport',
        'subscription.features.advancedAnalytics',
        'subscription.features.teamCollaboration',
        'subscription.features.customBranding',
      ],
    },
  ];

  const handleSelectPlan = (planId: string) => {
    Alert.alert(
      t('subscription.confirmTitle'),
      t('subscription.confirmMessage', { plan: plans.find(p => p.id === planId)?.name }),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.ok'),
          onPress: () => {
            setCurrentPlan(planId);
            Alert.alert(t('common.success'), t('subscription.successMessage'));
          },
        },
      ]
    );
  };

  return (
    <ScrollView className="flex-1 bg-white dark:bg-black">
      <Stack.Screen options={{ title: t('subscription.title'), headerShown: true }} />

      <View className="px-6 py-6">
        {/* Header */}
        <View className="items-center mb-6">
          <Ionicons name="sparkles" size={64} color={isDark ? '#60a5fa' : '#3b82f6'} />
          <CustomText weight="bold" className="text-3xl text-black dark:text-white mt-4 mb-2 text-center">
            {t('subscription.header')}
          </CustomText>
          <CustomText className="text-base text-gray-600 dark:text-gray-400 text-center">
            {t('subscription.description')}
          </CustomText>
        </View>

        {/* Pro Status Card - Show if user is Pro */}
        {userLevel === 'pro' && (
          <View className="bg-yellow-500/10 dark:bg-yellow-500/20 rounded-2xl p-6 mb-6 border-2 border-yellow-500/50">
            <View className="flex-row items-center mb-3">
              <Ionicons name="star" size={32} color="#eab308" />
              <CustomText weight="bold" className="text-2xl text-black dark:text-white ml-3">
                {t('subscription.proStatus.title') || 'You are Pro!'}
              </CustomText>
            </View>
            <CustomText className="text-base text-gray-700 dark:text-gray-300 mb-4">
              {t('subscription.proStatus.description') || 
                'Thank you for being a Safarnak Pro member. Enjoy all premium features!'}
            </CustomText>
            {subscriptionExpiresAt && (
              <View className="bg-white/50 dark:bg-black/50 rounded-lg p-3">
                <CustomText className="text-sm text-gray-600 dark:text-gray-400">
                  {t('subscription.proStatus.expiresAt') || 'Subscription expires:'} {new Date(subscriptionExpiresAt).toLocaleDateString()}
                </CustomText>
              </View>
            )}
            <CustomButton
              title={t('subscription.proStatus.manage') || 'Manage Subscription'}
              onPress={() => {
                Alert.alert(
                  t('subscription.proStatus.manage') || 'Manage Subscription',
                  t('subscription.proStatus.manageMessage') || 'Subscription management will be available soon.'
                );
              }}
              bgVariant="secondary"
              className="mt-4"
            />
          </View>
        )}

        {/* Plans - Show if user is not Pro */}
        {userLevel !== 'pro' && (
          <>
            <CustomText weight="bold" className="text-xl text-black dark:text-white mb-4">
              {t('subscription.choosePlan') || 'Choose Your Plan'}
            </CustomText>
        {plans.map(plan => (
          <PlanCard
            key={plan.id}
            plan={plan}
            currentPlan={currentPlan}
            onSelect={() => handleSelectPlan(plan.id)}
            isDark={isDark}
            t={t}
          />
        ))}
            
            {/* Subscribe CTA */}
            <View className="bg-primary/5 dark:bg-primary/10 rounded-2xl p-6 mt-6 border border-primary/20">
              <CustomText weight="bold" className="text-lg text-black dark:text-white mb-2 text-center">
                {t('subscription.cta.title') || 'Ready to upgrade?'}
              </CustomText>
              <CustomText className="text-sm text-gray-700 dark:text-gray-300 mb-4 text-center">
                {t('subscription.cta.description') || 
                  'Subscribe with Tron wallet to unlock all Pro features.'}
              </CustomText>
              <CustomButton
                title={t('subscription.cta.subscribe') || 'Subscribe with Tron (Coming Soon)'}
                onPress={() => {
                  Alert.alert(
                    t('subscription.cta.comingSoon') || 'Coming Soon',
                    t('subscription.cta.comingSoonMessage') || 
                      'Tron wallet integration is coming soon. Stay tuned!'
                  );
                }}
                bgVariant="primary"
              />
            </View>
          </>
        )}

        {/* FAQ Section */}
        <View className="mt-6 mb-6">
          <CustomText weight="bold" className="text-xl text-black dark:text-white mb-4">
            {t('subscription.faq.title')}
          </CustomText>

          <View className="bg-white dark:bg-neutral-900 rounded-2xl p-4 mb-3 border border-gray-200 dark:border-neutral-800">
            <CustomText weight="bold" className="text-base text-black dark:text-white mb-2">
              {t('subscription.faq.q1')}
            </CustomText>
            <CustomText className="text-sm text-gray-600 dark:text-gray-400">
              {t('subscription.faq.a1')}
            </CustomText>
          </View>

          <View className="bg-white dark:bg-neutral-900 rounded-2xl p-4 mb-3 border border-gray-200 dark:border-neutral-800">
            <CustomText weight="bold" className="text-base text-black dark:text-white mb-2">
              {t('subscription.faq.q2')}
            </CustomText>
            <CustomText className="text-sm text-gray-600 dark:text-gray-400">
              {t('subscription.faq.a2')}
            </CustomText>
          </View>

          <View className="bg-white dark:bg-neutral-900 rounded-2xl p-4 border border-gray-200 dark:border-neutral-800">
            <CustomText weight="bold" className="text-base text-black dark:text-white mb-2">
              {t('subscription.faq.q3')}
            </CustomText>
            <CustomText className="text-sm text-gray-600 dark:text-gray-400">
              {t('subscription.faq.a3')}
            </CustomText>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

