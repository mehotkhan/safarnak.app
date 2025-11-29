import { Tabs } from 'expo-router';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { Platform } from 'react-native';
import Colors from '@constants/Colors';
import { useAppSelector } from '@state/hooks';

export const unstable_settings = {
  initialRouteName: '(home)',
};

export default function AppLayout() {
  const { t } = useTranslation();
  // Use Redux directly instead of ThemeContext to avoid provider dependency issues
  const isDark = useAppSelector(state => state.theme.isDark);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: isDark ? Colors.dark.primary : Colors.light.primary,
        tabBarInactiveTintColor: isDark ? '#666' : '#9ca3af',
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: isDark ? '#1e1e1e' : '#fff',
          borderTopColor: isDark ? '#333' : '#e9ecef',
          borderTopWidth: 1,
          height: Platform.OS === 'ios' ? 64 : 56,
          paddingBottom: 0,
          paddingTop: 6,
          paddingLeft: 0,
          paddingRight: 0,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarItemStyle: {
          paddingTop: 0,
          paddingBottom: 0,
          justifyContent: 'flex-end',
        },
        tabBarIconStyle: {
          marginTop: 0,
          marginBottom: 0,
        },
      }}
    >
      <Tabs.Screen
        name='(home)'
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons
              name={focused ? 'home' : 'home-outline'}
              size={size + 4}
              color={color}
            />
          ),
          tabBarAccessibilityLabel: t('common.home'),
        }}
      />
      <Tabs.Screen
        name='(explore)'
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons
              name={focused ? 'search' : 'search-outline'}
              size={size + 4}
              color={color}
            />
          ),
          tabBarAccessibilityLabel: t('common.explore'),
        }}
      />
      <Tabs.Screen
        name='(trips)'
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons
              name={focused ? 'map' : 'map-outline'}
              size={size + 4}
              color={color}
            />
          ),
          tabBarAccessibilityLabel: t('common.trips'),
        }}
      />
      <Tabs.Screen
        name='(inbox)'
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons
              name={focused ? 'mail' : 'mail-outline'}
              size={size + 4}
              color={color}
            />
          ),
          tabBarAccessibilityLabel: t('common.inbox'),
        }}
      />
      <Tabs.Screen
        name='(me)'
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons
              name={focused ? 'person' : 'person-outline'}
              size={size + 4}
              color={color}
            />
          ),
          tabBarAccessibilityLabel: t('common.me'),
        }}
      />
      {/* Hide compose route from tab bar - it's a modal/sheet, not a tab */}
      <Tabs.Screen
        name='compose'
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}

