import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { CustomText } from '@ui/display';
import { useTheme } from '@ui/context';
import { useDateTime } from '@hooks/useDateTime';
import Colors from '@constants/Colors';

export interface MyTripCardProps {
  trip?: {
    id: string;
    destination?: string | null;
    startDate?: string | null;
    endDate?: string | null;
    status?: string | null;
  } | null;
  onPress?: () => void;
}

export default function MyTripCard({ trip, onPress }: MyTripCardProps) {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const router = useRouter();
  const { formatDate, isFuture } = useDateTime();

  const primaryColor = isDark ? Colors.dark.primary : Colors.light.primary;
  const backgroundColor = isDark ? '#1f2937' : '#f3f4f6';
  const borderColor = isDark ? '#374151' : '#e5e7eb';
  const textColor = isDark ? '#ffffff' : '#000000';
  const secondaryTextColor = isDark ? '#9ca3af' : '#6b7280';

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else if (trip?.id) {
      router.push(`/(app)/(trips)/${trip.id}` as any);
    } else {
      router.push('/(app)/(trips)/new' as any); // Navigate to trip creation/planner
    }
  };

  // Determine trip state
  const tripState = React.useMemo(() => {
    if (!trip) return 'none';
    if (trip.status === 'active' || trip.status === 'in_progress') {
      if (trip.startDate && trip.endDate) {
        const now = new Date();
        const start = new Date(trip.startDate);
        const end = new Date(trip.endDate);
        if (now >= start && now <= end) {
          return 'active';
        }
      }
    }
    if (trip.startDate && isFuture(trip.startDate)) {
      return 'upcoming';
    }
    return 'none';
  }, [trip, isFuture]);

  if (tripState === 'none') {
    return (
      <TouchableOpacity
        onPress={handlePress}
        style={[styles.card, { backgroundColor, borderColor }]}
        activeOpacity={0.7}
      >
        <View style={styles.content}>
          <View style={[styles.iconContainer, { backgroundColor: `${primaryColor}20` }]}>
            <Ionicons name="airplane-outline" size={24} color={primaryColor} />
          </View>
          <View style={styles.textContainer}>
            <CustomText weight="medium" style={[styles.title, { color: textColor }]}>
              {t('home.noUpcomingTrip') || "You don't have an upcoming trip yet"}
            </CustomText>
            <CustomText style={[styles.subtitle, { color: secondaryTextColor }]}>
              {t('home.planWithAI') || 'Plan a trip with AI'}
            </CustomText>
          </View>
          <Ionicons name="chevron-forward" size={20} color={secondaryTextColor} />
        </View>
      </TouchableOpacity>
    );
  }

  const isActive = tripState === 'active';
  const destination = trip?.destination || t('home.unknownDestination') || 'Unknown destination';
  const startDate = trip?.startDate ? formatDate(trip.startDate) : '';
  const endDate = trip?.endDate ? formatDate(trip.endDate) : '';

  // Calculate day X of Y for active trips
  let dayInfo = '';
  if (isActive && trip?.startDate && trip?.endDate) {
    const now = new Date();
    const start = new Date(trip.startDate);
    const end = new Date(trip.endDate);
    const totalDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    const currentDay = Math.ceil((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    dayInfo = t('home.dayOfTrip', { current: currentDay, total: totalDays }) || `Day ${currentDay} of ${totalDays}`;
  }

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={[styles.card, { backgroundColor, borderColor }]}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        <View style={[styles.iconContainer, { backgroundColor: `${primaryColor}20` }]}>
          <Ionicons
            name={isActive ? 'airplane' : 'airplane-outline'}
            size={24}
            color={primaryColor}
          />
        </View>
        <View style={styles.textContainer}>
          {isActive ? (
            <>
              <CustomText weight="bold" style={[styles.title, { color: textColor }]}>
                {destination}
              </CustomText>
              <CustomText style={[styles.subtitle, { color: secondaryTextColor }]}>
                {dayInfo}
              </CustomText>
            </>
          ) : (
            <>
              <CustomText weight="medium" style={[styles.title, { color: textColor }]}>
                {t('home.nextTrip') || 'Next trip'}: {destination}
              </CustomText>
              <CustomText style={[styles.subtitle, { color: secondaryTextColor }]}>
                {startDate} {endDate ? `- ${endDate}` : ''}
              </CustomText>
            </>
          )}
        </View>
        <Ionicons name="chevron-forward" size={20} color={secondaryTextColor} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    marginBottom: 16,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    zIndex:10
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
  title: {
    fontSize: 16,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
  },
});

