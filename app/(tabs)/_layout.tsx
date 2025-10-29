import { Tabs } from 'expo-router';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@components/context/ThemeContext';

export default function TabLayout() {
  const { t } = useTranslation();
  const { isDark } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: isDark ? '#a78bfa' : '#8b5cf6',
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
        name='index'
        options={{
          tabBarLabel: t('common.home'),
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name={focused ? 'home' : 'home-outline'}
              size={24}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name='tour'
        options={{
          tabBarLabel: t('common.tour'),
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name={focused ? 'map' : 'map-outline'}
              size={24}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name='profile'
        options={{
          tabBarLabel: t('common.profile'),
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
