import React from 'react';
import { View } from 'react-native';
import { CustomText } from './CustomText';
import { useTheme } from '@ui/context';
import { useTranslation } from 'react-i18next';
import Colors from '@constants/Colors';

export interface TimelineItem {
  day: number;
  title: string;
  activities: string[];
}

export interface TimelineProps {
  items: TimelineItem[];
  className?: string;
}

/**
 * Timeline Component
 * 
 * Displays a vertical timeline with day items and activities
 * 
 * @example
 * <Timeline 
 *   items={[
 *     { day: 1, title: "Arrival", activities: ["Check in", "Explore"] },
 *     { day: 2, title: "Sightseeing", activities: ["Museum", "Park"] }
 *   ]}
 * />
 */
export const Timeline = React.memo<TimelineProps>(({ items, className = '' }) => {
  const { isDark } = useTheme();
  const { t } = useTranslation();

  return (
    <View className={`relative ${className}`}>
      {/* Timeline Line */}
      <View 
        className="absolute inset-y-0 left-4 w-0.5"
        style={{ backgroundColor: isDark ? '#374151' : '#e5e7eb' }}
      />
      
      {items.map((item, index) => (
        <View key={item.day || index} className="mb-6 flex-row">
          {/* Timeline Dot */}
          <View className="relative mr-4">
            <View 
              className="size-8 items-center justify-center rounded-full border-2"
              style={{ 
                backgroundColor: isDark ? '#000000' : '#ffffff',
                borderColor: isDark ? Colors.dark.primary : Colors.light.primary,
              }}
            >
              <View 
                className="size-3 rounded-full"
                style={{ backgroundColor: isDark ? Colors.dark.primary : Colors.light.primary }}
              />
            </View>
          </View>
          
          {/* Day Content */}
          <View className="flex-1 pb-4">
            <View className="rounded-2xl bg-gray-50 p-4 dark:bg-neutral-900">
              <CustomText
                weight="bold"
                className="mb-2 text-base text-black dark:text-white"
              >
                {t('tripDetail.day') || 'Day'} {item.day}: {item.title}
              </CustomText>
              <View className="mt-2">
                {item.activities.map((activity, actIndex) => (
                  <View key={actIndex} className="mb-2 flex-row items-start">
                    <View 
                      className="mr-2 mt-2 size-1.5 rounded-full"
                      style={{ backgroundColor: isDark ? '#6b7280' : '#9ca3af' }}
                    />
                    <CustomText className="flex-1 text-sm text-gray-700 dark:text-gray-300">
                      {activity}
                    </CustomText>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </View>
      ))}
    </View>
  );
});

Timeline.displayName = 'Timeline';

