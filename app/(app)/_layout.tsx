import { Tabs } from 'expo-router';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@components/context/ThemeContext';
import { Platform } from 'react-native';
import Colors from '@constants/Colors';

export const unstable_settings = {
  initialRouteName: '(feed)',
};

export default function AppLayout() {
  const { t } = useTranslation();
  const { isDark } = useTheme();

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
        name='(feed)'
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
              name={focused ? 'compass' : 'compass-outline'}
              size={size + 4}
              color={color}
            />
          ),
          tabBarAccessibilityLabel: t('common.plan'),
        }}
      />
      <Tabs.Screen
        name='(profile)'
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons
              name={focused ? 'person' : 'person-outline'}
              size={size + 4}
              color={color}
            />
          ),
          tabBarAccessibilityLabel: t('common.profile'),
        }}
      />
    </Tabs>
  );
}

