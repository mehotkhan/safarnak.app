import { useState } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { CustomText } from '@components/ui/CustomText';
import { useTheme } from '@components/context/ThemeContext';

const createTabs = [
  { id: 'tour', label: 'tour', icon: 'map-outline', route: '/(app)/(feed)/tours/new' },
  { id: 'place', label: 'place', icon: 'location-outline', route: '/(app)/(feed)/places/new' },
];

export default function CreatePostScreen() {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState('tour');

  const handleTabPress = (tabId: string, route: string) => {
    setSelectedTab(tabId);
    router.push(route as any);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-white dark:bg-black"
    >
      <Stack.Screen 
        options={{ 
          title: t('feed.create.title') || 'Create', 
          headerShown: true,
        }} 
      />

      <View className="flex-1">
        {/* Tabs */}
        <View className="px-4 pt-4 pb-2 border-b border-gray-200 dark:border-neutral-800">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="flex-row"
          >
            {createTabs.map((tab) => (
              <TouchableOpacity
                key={tab.id}
                onPress={() => handleTabPress(tab.id, tab.route)}
                className={`flex-row items-center px-6 py-3 rounded-full mr-3 ${
                  selectedTab === tab.id
                    ? 'bg-primary'
                    : 'bg-gray-100 dark:bg-neutral-800'
                }`}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={tab.icon as any}
                  size={20}
                  color={
                    selectedTab === tab.id
                      ? '#fff'
                      : isDark
                        ? '#9ca3af'
                        : '#6b7280'
                  }
                />
                <CustomText
                  weight={selectedTab === tab.id ? 'bold' : 'regular'}
                  className={`ml-2 text-base ${
                    selectedTab === tab.id
                      ? 'text-white'
                      : 'text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {t(`feed.create.${tab.label}`) || tab.label}
                </CustomText>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Content Area - Will be replaced by child routes */}
        <View className="flex-1 items-center justify-center px-6">
          <Ionicons 
            name="add-circle-outline" 
            size={64} 
            color={isDark ? '#4b5563' : '#d1d5db'} 
          />
          <CustomText
            weight="bold"
            className="text-xl text-gray-800 dark:text-gray-300 mt-4 mb-2 text-center"
          >
            {t('feed.create.selectType') || 'Select a type to create'}
          </CustomText>
          <CustomText className="text-base text-gray-600 dark:text-gray-400 text-center">
            {t('feed.create.selectTypeDescription') || 'Choose Tour or Place to get started'}
          </CustomText>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

