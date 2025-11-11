import React from 'react';
import { View, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { CustomText } from '@components/display';
import { useTheme } from '@components/context';

export interface Tab {
  id: string;
  label: string;
  icon?: string;
}

export interface TabBarProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  variant?: 'pills' | 'segmented' | 'scrollable';
  className?: string;
}

/**
 * TabBar Component
 * 
 * Displays a horizontal tab navigation bar with support for multiple variants
 * 
 * @example
 * <TabBar 
 *   tabs={[{ id: 'all', label: 'All', icon: 'grid-outline' }]}
 *   activeTab={selectedTab}
 *   onTabChange={setSelectedTab}
 *   variant="pills"
 * />
 */
export const TabBar = React.memo<TabBarProps>(({ 
  tabs, 
  activeTab, 
  onTabChange, 
  variant = 'segmented',
  className = '',
}) => {
  const { isDark } = useTheme();
  const { t } = useTranslation();

  // Scrollable pills variant (for feed tabs with icons)
  if (variant === 'scrollable') {
    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className={`flex-row ${className}`}
        contentContainerStyle={{ paddingLeft: 0, paddingRight: 0 }}
      >
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            onPress={() => onTabChange(tab.id)}
            className={`flex-row items-center px-3 py-1.5 rounded-full mr-2 ${
              activeTab === tab.id
                ? 'bg-primary'
                : 'bg-gray-100 dark:bg-neutral-800'
            }`}
            activeOpacity={0.7}
          >
            {tab.icon && (
              <Ionicons
                name={tab.icon as any}
                size={16}
                color={
                  activeTab === tab.id
                    ? '#fff'
                    : isDark
                      ? '#9ca3af'
                      : '#6b7280'
                }
              />
            )}
            <CustomText
              weight={activeTab === tab.id ? 'bold' : 'regular'}
              className={`${tab.icon ? 'ml-1.5' : ''} text-xs ${
                activeTab === tab.id
                  ? 'text-white'
                  : 'text-gray-700 dark:text-gray-300'
              }`}
            >
              {t(`feed.tabs.${tab.label}`) || tab.label}
            </CustomText>
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  }

  // Segmented variant (default - for trips/explore tabs)
  return (
    <View className={`flex-row bg-gray-100 dark:bg-neutral-900 rounded-xl p-1 ${className}`}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.id}
          onPress={() => onTabChange(tab.id)}
          className={`flex-1 py-2 rounded-lg ${
            activeTab === tab.id
              ? 'bg-white dark:bg-neutral-800'
              : ''
          }`}
          activeOpacity={0.7}
        >
          <CustomText
            weight={activeTab === tab.id ? 'medium' : 'regular'}
            className={`text-center text-xs ${
              activeTab === tab.id
                ? 'text-primary'
                : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            {t(`trips.tabs.${tab.id}`) || t(`explore.categories.${tab.id}`) || tab.label}
          </CustomText>
        </TouchableOpacity>
      ))}
    </View>
  );
});

TabBar.displayName = 'TabBar';

