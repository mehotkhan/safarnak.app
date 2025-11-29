import React, { ReactNode } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { CustomText } from '@ui/display';
import { useTheme } from '@ui/context';

export interface HeaderProps {
  title?: string;
  right?: ReactNode;
  variant?: 'primary' | 'transparent' | 'back';
  onBack?: () => void;
}

export default function Header({
  title,
  right,
  variant = 'primary',
  onBack,
}: HeaderProps) {
  const { isDark } = useTheme();
  const router = useRouter();

  const backgroundColor = variant === 'transparent' 
    ? 'transparent' 
    : isDark ? '#000000' : '#ffffff';
  
  const borderColor = isDark ? '#1f2937' : '#e5e7eb';
  const textColor = isDark ? '#ffffff' : '#000000';
  const iconColor = isDark ? '#ffffff' : '#000000';

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  return (
    <View style={[styles.container, { backgroundColor, borderBottomColor: borderColor }]}>
      <View style={styles.content}>
        {/* Left: Back button or empty */}
        <View style={styles.left}>
          {variant === 'back' && (
            <TouchableOpacity onPress={handleBack} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color={iconColor} />
            </TouchableOpacity>
          )}
        </View>

        {/* Center: Title */}
        <View style={styles.center}>
          {title && (
            <CustomText weight="bold" className="text-lg" style={{ color: textColor }}>
              {title}
            </CustomText>
          )}
        </View>

        {/* Right: Custom content or empty */}
        <View style={styles.right}>
          {right}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    paddingTop: 8,
    paddingBottom: 8,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    minHeight: 44,
  },
  left: {
    width: 40,
    alignItems: 'flex-start',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  right: {
    width: 40,
    alignItems: 'flex-end',
  },
  backButton: {
    padding: 4,
  },
});

