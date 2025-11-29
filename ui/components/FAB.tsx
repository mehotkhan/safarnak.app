import React, { useState, useMemo, useEffect } from 'react';
import { View, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { CustomText } from '@ui/display';
import { useTheme } from '@ui/context';
import { useActivationGuard } from '@ui/hooks/useActivationGuard';
import Colors from '@constants/Colors';

export type FABOption = {
  id: string;
  label: string;
  translationKey?: string;
  icon: keyof typeof Ionicons.glyphMap;
  route: string;
  color?: string;
};

export interface FABProps {
  options: FABOption[];
  visible?: boolean;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
}

export default function FAB({ options, visible = true, position = 'bottom-right' }: FABProps) {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const router = useRouter();
  const { checkActivation } = useActivationGuard();
  const [expanded, setExpanded] = useState(false);

  // Animation values
  const fabRotation = useMemo(() => new Animated.Value(0), []);
  const fabScale = useMemo(() => new Animated.Value(0), []);

  // Animate FAB expansion
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fabRotation, {
        toValue: expanded ? 1 : 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.spring(fabScale, {
        toValue: expanded ? 1 : 0,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, [expanded, fabRotation, fabScale]);

  const toggleFab = () => {
    setExpanded(!expanded);
  };

  const handleOptionPress = (option: FABOption) => {
    setExpanded(false);
    checkActivation(() => {
      router.push(option.route as any);
    });
  };

  const rotateInterpolate = fabRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '45deg'],
  });

  const primaryColor = isDark ? Colors.dark.primary : Colors.light.primary;

  if (!visible) return null;

  // Position styles
  const positionStyles = {
    'bottom-right': 'absolute bottom-20 right-4',
    'bottom-left': 'absolute bottom-20 left-4',
    'top-right': 'absolute top-20 right-4',
    'top-left': 'absolute top-20 left-4',
  };

  return (
    <View className={positionStyles[position]}>
      {/* Expanded Options */}
      {expanded && (
        <View className="mb-3">
          {options.map((option) => (
            <Animated.View
              key={option.id}
              style={{
                transform: [{ scale: fabScale }],
                opacity: fabScale,
              }}
              className="mb-2"
            >
              <TouchableOpacity
                onPress={() => handleOptionPress(option)}
                className="flex-row items-center bg-white dark:bg-neutral-800 px-4 py-3 rounded-full border border-gray-200 dark:border-neutral-700"
                activeOpacity={0.8}
              >
                <View 
                  className="w-10 h-10 items-center justify-center rounded-full ltr:mr-3 rtl:ml-3"
                  style={{ backgroundColor: `${option.color || primaryColor}20` }}
                >
                  <Ionicons 
                    name={option.icon} 
                    size={20} 
                    color={option.color || primaryColor} 
                  />
                </View>
                <CustomText weight="medium" className="text-base text-black dark:text-white">
                  {option.translationKey ? t(option.translationKey) : option.label}
                </CustomText>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>
      )}

      {/* Main FAB Button */}
      <TouchableOpacity
        onPress={toggleFab}
        className="w-14 h-14 items-center justify-center rounded-full"
        style={{ backgroundColor: primaryColor }}
        activeOpacity={0.8}
      >
        <Animated.View
          style={{
            transform: [{ rotate: rotateInterpolate }],
          }}
        >
          <Ionicons name="add" size={28} color="#fff" />
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
}

