import React from 'react';
import { View, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { CustomText } from '@ui/display';
import { useTheme } from '@ui/context';

export interface Tab {
  id: string;
  label: string;
  icon?: string;
  translationKey?: string;
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
            className={`mr-2 flex-row items-center rounded-full px-3 py-1.5 ${
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
              {(() => {
                if (tab.translationKey) {
                  try {
                    // Use t() with explicit options to ensure proper translation
                    const translated = t(tab.translationKey, { 
                      defaultValue: tab.label,
                      returnObjects: false,
                    });
                    // If translation returns the key itself (missing translation), use label
                    if (translated === tab.translationKey || !translated) {
                      return tab.label;
                    }
                    return translated;
                  } catch {
                    return tab.label;
                  }
                }
                const fallbackKey = `feed.tabs.${tab.label}`;
                try {
                  const translated = t(fallbackKey, { 
                    defaultValue: tab.label,
                    returnObjects: false,
                  });
                  if (translated === fallbackKey || !translated) {
                    return tab.label;
                  }
                  return translated;
                } catch {
                  return tab.label;
                }
              })()}
            </CustomText>
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  }

  // Segmented variant (default - for trips/explore tabs)
  return (
    <View className={`flex-row rounded-xl bg-gray-100 p-1 dark:bg-neutral-900 ${className}`}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.id}
          onPress={() => onTabChange(tab.id)}
          className={`flex-1 rounded-lg py-2 ${
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
            {(() => {
              if (!tab.translationKey) return tab.label;
              try {
                // Use t() with explicit options to ensure proper translation
                const translated = t(tab.translationKey, { 
                  defaultValue: tab.label,
                  returnObjects: false,
                });
                // If translation returns the key itself (missing translation), use label
                if (translated === tab.translationKey || !translated) {
                  return tab.label;
                }
                return translated;
              } catch {
                return tab.label;
              }
            })()}
          </CustomText>
        </TouchableOpacity>
      ))}
    </View>
  );
});

TabBar.displayName = 'TabBar';

