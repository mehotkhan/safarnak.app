import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { CustomText } from '@ui/display';
import { useTheme } from '@ui/context';
import { ScreenLayout } from '@ui/layout';
import { useActivationGuard } from '@ui/hooks/useActivationGuard';

const composeOptions = [
  {
    id: 'experience',
    label: 'New experience',
    translationKey: 'feed.newPost.title',
    icon: 'create-outline' as const,
    route: '/(app)/compose/experience',
    color: '#3b82f6',
  },
  {
    id: 'trip',
    label: 'Plan a trip',
    translationKey: 'plan.createPlan',
    icon: 'airplane-outline' as const,
    route: '/(app)/compose/trip',
    color: '#10b981',
  },
  {
    id: 'hosted-trip',
    label: 'Create hosted trip',
    translationKey: 'tour.create',
    icon: 'map-outline' as const,
    route: '/(app)/compose/trip', // Same as trip, but with isHosted flag
    color: '#8b5cf6',
  },
  {
    id: 'place',
    label: 'Add place',
    translationKey: 'places.addPlace',
    icon: 'location-outline' as const,
    route: '/(app)/compose/place',
    color: '#f59e0b',
  },
];

export default function ComposeScreen() {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const router = useRouter();
  const { checkActivation } = useActivationGuard();

  const backgroundColor = isDark ? '#1f2937' : '#ffffff';
  const borderColor = isDark ? '#374151' : '#e5e7eb';
  const textColor = isDark ? '#ffffff' : '#000000';

  const handleOptionPress = (option: typeof composeOptions[0]) => {
    checkActivation(() => {
      if (option.id === 'hosted-trip') {
        // Navigate to trip compose with isHosted flag
        router.push({
          pathname: option.route as any,
          params: { isHosted: 'true' },
        } as any);
      } else {
        router.push(option.route as any);
      }
    });
  };

  return (
    <ScreenLayout
      title={t('common.create') || 'Create'}
      headerVariant="back"
      scrollable
    >
      <View style={styles.container}>
        {composeOptions.map((option) => (
          <TouchableOpacity
            key={option.id}
            onPress={() => handleOptionPress(option)}
            style={[
              styles.option,
              {
                backgroundColor,
                borderColor,
              },
            ]}
            activeOpacity={0.7}
          >
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: `${option.color}20` },
              ]}
            >
              <Ionicons name={option.icon} size={24} color={option.color} />
            </View>
            <View style={styles.textContainer}>
              <CustomText
                weight="medium"
                style={[styles.label, { color: textColor }]}
              >
                {option.translationKey
                  ? t(option.translationKey)
                  : option.label}
              </CustomText>
            </View>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={isDark ? '#6b7280' : '#9ca3af'}
            />
          </TouchableOpacity>
        ))}
      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
    paddingTop: 8,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    gap: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    flex: 1,
  },
  label: {
    fontSize: 16,
  },
});

