import React from 'react';
import { View } from 'react-native';
import { CustomText } from './CustomText';
import { useTheme } from '@components/context/ThemeContext';
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
        className="absolute left-4 top-0 bottom-0 w-0.5"
        style={{ backgroundColor: isDark ? '#374151' : '#e5e7eb' }}
      />
      
      {items.map((item, index) => (
        <View key={item.day || index} className="flex-row mb-6">
          {/* Timeline Dot */}
          <View className="relative mr-4">
            <View 
              className="w-8 h-8 rounded-full border-2 items-center justify-center"
              style={{ 
                backgroundColor: isDark ? '#000000' : '#ffffff',
                borderColor: isDark ? Colors.dark.primary : Colors.light.primary,
              }}
            >
              <View 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: isDark ? Colors.dark.primary : Colors.light.primary }}
              />
            </View>
          </View>
          
          {/* Day Content */}
          <View className="flex-1 pb-4">
            <View className="bg-gray-50 dark:bg-neutral-900 rounded-2xl p-4">
              <CustomText
                weight="bold"
                className="text-base text-black dark:text-white mb-2"
              >
                {t('tripDetail.day') || 'Day'} {item.day}: {item.title}
              </CustomText>
              <View className="mt-2">
                {item.activities.map((activity, actIndex) => (
                  <View key={actIndex} className="flex-row items-start mb-2">
                    <View 
                      className="w-1.5 h-1.5 rounded-full mt-2 mr-2"
                      style={{ backgroundColor: isDark ? '#6b7280' : '#9ca3af' }}
                    />
                    <CustomText className="text-sm text-gray-700 dark:text-gray-300 flex-1">
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

