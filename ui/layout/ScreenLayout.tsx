import React, { ReactNode } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '@ui/context';
import Header from './Header';

export interface ScreenLayoutProps {
  title?: string;
  headerRight?: ReactNode;
  children: ReactNode;
  scrollable?: boolean;
  showHeader?: boolean;
  headerVariant?: 'primary' | 'transparent' | 'back';
  onBack?: () => void;
}

export default function ScreenLayout({
  title,
  headerRight,
  children,
  scrollable = false,
  showHeader = true,
  headerVariant = 'primary',
  onBack,
}: ScreenLayoutProps) {
  const { isDark } = useTheme();

  const backgroundColor = isDark ? '#000000' : '#ffffff';

  const content = scrollable ? (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  ) : (
    <View style={styles.content}>{children}</View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]} edges={['top']}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      {showHeader && (
        <Header
          title={title}
          right={headerRight}
          variant={headerVariant}
          onBack={onBack}
        />
      )}
      {content}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 16,
  },
  content: {
    flex: 1,
    padding: 16,
  },
});

