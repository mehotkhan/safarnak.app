import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, Stack, useLocalSearchParams } from 'expo-router';
import { useAppSelector } from '@state/hooks';
import Colors from '@constants/Colors';

// Mock data for tour group members
interface GroupMember {
  id: string;
  name: string;
  username: string;
  avatar?: string;
  role: 'host' | 'member';
  joinedDate: Date;
  isOnline: boolean;
}

const mockMembers: GroupMember[] = [
  {
    id: '1',
    name: 'Reza Ahmadi',
    username: 'reza_explorer',
    role: 'host',
    joinedDate: new Date(2024, 8, 1),
    isOnline: true,
  },
  {
    id: '2',
    name: 'Sara Mohammadi',
    username: 'sara_wanderer',
    role: 'member',
    joinedDate: new Date(2024, 9, 15),
    isOnline: true,
  },
  {
    id: '3',
    name: 'Ali Karimi',
    username: 'ali_hiker',
    role: 'member',
    joinedDate: new Date(2024, 10, 1),
    isOnline: false,
  },
  {
    id: '4',
    name: 'Mina Hosseini',
    username: 'mina_travel',
    role: 'member',
    joinedDate: new Date(2024, 10, 10),
    isOnline: true,
  },
  {
    id: '5',
    name: 'Hassan Rahmani',
    username: 'hassan_heritage',
    role: 'member',
    joinedDate: new Date(2024, 10, 18),
    isOnline: false,
  },
];

export default function TourGroupScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const isDark = useAppSelector(state => state.theme.isDark);
  const [refreshing, setRefreshing] = useState(false);

  const colors = isDark ? Colors.dark : Colors.light;

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const host = mockMembers.find(m => m.role === 'host');
  const members = mockMembers.filter(m => m.role === 'member');
  const onlineCount = mockMembers.filter(m => m.isOnline).length;

  return (
    <View className='flex-1' style={{ backgroundColor: colors.background }}>
      <Stack.Screen
        options={{
          title: t('create.tourGroup'),
          headerShown: true,
          headerLargeTitle: false,
          headerRight: () => (
            <TouchableOpacity
              onPress={() => router.push(`/(app)/(create)/tours/${id}/chat` as any)}
              className='mr-2'
            >
              <Ionicons name='chatbubbles' size={24} color={colors.primary} />
            </TouchableOpacity>
          ),
        }}
      />

      <ScrollView
        className='flex-1'
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header Stats */}
        <View className='p-4 border-b' style={{ borderBottomColor: isDark ? '#333' : '#e5e7eb' }}>
          <View className='flex-row items-center gap-4'>
            <View>
              <Text className='text-2xl font-bold' style={{ color: colors.text }}>
                {mockMembers.length}
              </Text>
              <Text className='text-xs' style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>
                {t('create.members')}
              </Text>
            </View>
            <View>
              <Text className='text-2xl font-bold' style={{ color: '#10b981' }}>
                {onlineCount}
              </Text>
              <Text className='text-xs' style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>
                {t('stats.online')}
              </Text>
            </View>
          </View>
          
          {/* Group Chat Button */}
          <TouchableOpacity
            onPress={() => router.push(`/(app)/(create)/tours/${id}/chat` as any)}
            className='mt-4 py-3 rounded-full flex-row items-center justify-center gap-2'
            style={{ backgroundColor: colors.primary }}
            activeOpacity={0.8}
          >
            <Ionicons name='chatbubbles' size={20} color='#fff' />
            <Text className='text-base font-semibold text-white'>
              {t('create.tourChat')}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Host Section */}
        {host && (
          <View className='p-4 border-b' style={{ borderBottomColor: isDark ? '#333' : '#e5e7eb' }}>
            <Text className='text-lg font-bold mb-3' style={{ color: colors.text }}>
              {t('create.host')}
            </Text>
            <TouchableOpacity
              className='flex-row items-center p-4 rounded-xl'
              style={{ backgroundColor: isDark ? '#1f2937' : '#f9fafb' }}
              activeOpacity={0.7}
            >
              <View className='relative mr-3'>
                <View
                  className='w-14 h-14 rounded-full items-center justify-center'
                  style={{ backgroundColor: isDark ? '#374151' : '#e5e7eb' }}
                >
                  <Ionicons
                    name='person'
                    size={28}
                    color={isDark ? '#9ca3af' : '#6b7280'}
                  />
                </View>
                {host.isOnline && (
                  <View
                    className='absolute bottom-0 right-0 w-4 h-4 rounded-full border-2'
                    style={{
                      backgroundColor: '#10b981',
                      borderColor: isDark ? '#1f2937' : '#f9fafb',
                    }}
                  />
                )}
              </View>
              <View className='flex-1'>
                <View className='flex-row items-center gap-2 mb-1'>
                  <Text className='text-base font-bold' style={{ color: colors.text }}>
                    {host.name}
                  </Text>
                  <View
                    className='px-2 py-0.5 rounded-full'
                    style={{ backgroundColor: colors.primary }}
                  >
                    <Text className='text-xs font-semibold text-white'>
                      {t('create.host')}
                    </Text>
                  </View>
                </View>
                <Text className='text-sm' style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>
                  @{host.username}
                </Text>
                <Text className='text-xs mt-1' style={{ color: isDark ? '#6b7280' : '#9ca3af' }}>
                  {t('create.joinedDate', { date: formatDate(host.joinedDate) })}
                </Text>
              </View>
              <Ionicons
                name='chevron-forward'
                size={20}
                color={isDark ? '#6b7280' : '#9ca3af'}
              />
            </TouchableOpacity>
          </View>
        )}

        {/* Members Section */}
        <View className='p-4'>
          <Text className='text-lg font-bold mb-3' style={{ color: colors.text }}>
            {t('create.members')} ({members.length})
          </Text>
          <View className='gap-3'>
            {members.map((member) => (
              <TouchableOpacity
                key={member.id}
                className='flex-row items-center p-4 rounded-xl'
                style={{ backgroundColor: isDark ? '#1f2937' : '#f9fafb' }}
                activeOpacity={0.7}
              >
                <View className='relative mr-3'>
                  <View
                    className='w-12 h-12 rounded-full items-center justify-center'
                    style={{ backgroundColor: isDark ? '#374151' : '#e5e7eb' }}
                  >
                    <Ionicons
                      name='person'
                      size={24}
                      color={isDark ? '#9ca3af' : '#6b7280'}
                    />
                  </View>
                  {member.isOnline && (
                    <View
                      className='absolute bottom-0 right-0 w-3 h-3 rounded-full border-2'
                      style={{
                        backgroundColor: '#10b981',
                        borderColor: isDark ? '#1f2937' : '#f9fafb',
                      }}
                    />
                  )}
                </View>
                <View className='flex-1'>
                  <Text className='text-base font-semibold mb-0.5' style={{ color: colors.text }}>
                    {member.name}
                  </Text>
                  <Text className='text-sm' style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>
                    @{member.username}
                  </Text>
                  <Text className='text-xs mt-1' style={{ color: isDark ? '#6b7280' : '#9ca3af' }}>
                    {t('create.joinedDate', { date: formatDate(member.joinedDate) })}
                  </Text>
                </View>
                <View className='items-end'>
                  {member.isOnline ? (
                    <View
                      className='px-2 py-1 rounded-full'
                      style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)' }}
                    >
                      <Text className='text-xs font-semibold' style={{ color: '#10b981' }}>
                        {t('stats.online')}
                      </Text>
                    </View>
                  ) : (
                    <Text className='text-xs' style={{ color: isDark ? '#6b7280' : '#9ca3af' }}>
                      {t('stats.offline')}
                    </Text>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

