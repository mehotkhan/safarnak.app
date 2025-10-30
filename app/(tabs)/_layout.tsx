import { Tabs } from 'expo-router';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@components/context/ThemeContext';

export const unstable_settings = {
  initialRouteName: 'index',
};

export default function TabLayout() {
  const { t } = useTranslation();
  const { isDark } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: isDark ? '#4aa3d9' : '#0077be',
        tabBarInactiveTintColor: isDark ? '#666' : '#64748b',
        tabBarLabelStyle: {
          fontSize: 12,
        },
        tabBarStyle: {
          backgroundColor: isDark ? '#1e1e1e' : '#fff',
          borderTopColor: isDark ? '#333' : '#e9ecef',
        },
      }}
    >
      <Tabs.Screen
        name='plan'
        options={{
          tabBarLabel: t('common.plan'),
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name={focused ? 'airplane' : 'airplane-outline'}
              size={24}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name='index'
        options={{
          tabBarLabel: t('common.explore'),
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name={focused ? 'compass' : 'compass-outline'}
              size={24}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name='profile'
        options={{
          tabBarLabel: t('common.me'),
          tabBarIcon: ({ focused, color }) => (
            <FontAwesome
              name={focused ? 'user' : 'user-o'}
              size={21}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
