import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { CustomText } from '@ui/display';
import { useTheme } from '@ui/context';
import Colors from '@constants/Colors';

export interface ShareableTab {
  id: string;
  label: string;
  translationKey?: string;
}

export interface ShareableTabsProps {
  tabs: ShareableTab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  className?: string;
}

/**
 * ShareableTabs Component
 * 
 * A clean, unified tab component with underline indicator
 * Based on the pattern from shareable-trips detail page
 * 
 * @example
 * <ShareableTabs
 *   tabs={[
 *     { id: 'all', label: 'All', translationKey: 'explore.categories.all' },
 *     { id: 'trips', label: 'Trips', translationKey: 'explore.categories.trips' }
 *   ]}
 *   activeTab={selectedTab}
 *   onTabChange={setSelectedTab}
 * />
 */
export const ShareableTabs = React.memo<ShareableTabsProps>(({
  tabs,
  activeTab,
  onTabChange,
  className = '',
}) => {
  const { isDark } = useTheme();
  const { t } = useTranslation();
  const colors = isDark ? Colors.dark : Colors.light;

  return (
    <View
      className={`flex-row border-b px-4 ${className}`}
      style={{ borderBottomColor: isDark ? '#333' : '#e5e7eb' }}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const label = tab.translationKey ? t(tab.translationKey, { defaultValue: tab.label }) : tab.label;

        return (
          <TouchableOpacity
            key={tab.id}
            onPress={() => onTabChange(tab.id)}
            className="px-4 py-3"
            style={{
              borderBottomWidth: isActive ? 2 : 0,
              borderBottomColor: colors.primary,
            }}
            activeOpacity={0.7}
          >
            <CustomText
              weight={isActive ? 'bold' : 'regular'}
              className="text-sm"
              style={{
                color: isActive ? colors.primary : (isDark ? '#9ca3af' : '#6b7280'),
              }}
            >
              {label}
            </CustomText>
          </TouchableOpacity>
        );
      })}
    </View>
  );
});

ShareableTabs.displayName = 'ShareableTabs';

