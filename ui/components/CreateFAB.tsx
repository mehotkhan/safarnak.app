import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { View, TouchableOpacity, Animated, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { CustomText } from '@ui/display';
import { useTheme } from '@ui/context';
import { useActivationGuard } from '@ui/hooks/useActivationGuard';
import Colors from '@constants/Colors';

export type CreateFABOption = {
  id: string;
  label: string;
  translationKey?: string;
  icon: keyof typeof Ionicons.glyphMap;
  createRoute: string; // Route to specific create page
  color?: string;
};

export interface CreateFABProps {
  options: CreateFABOption[];
  visible?: boolean;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  longPressRoute?: string; // Route to navigate on long press (defaults to compose index)
}

export default function CreateFAB({ 
  options, 
  visible = true, 
  position = 'bottom-right',
  longPressRoute = '/(app)/compose' // Default to compose index page
}: CreateFABProps) {
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

  // Track if long press was triggered to prevent tap handler
  const longPressTriggered = useRef(false);

  // Reset long press flag when press ends
  const handlePressOut = useCallback(() => {
    // Reset after a short delay to allow long press handler to complete
    setTimeout(() => {
      longPressTriggered.current = false;
    }, 200);
  }, []);

  // Single tap: toggle menu
  const handleTap = useCallback(() => {
    // Don't toggle if long press was just triggered
    if (longPressTriggered.current) {
      return;
    }
    setExpanded((prev) => !prev);
  }, []);

  // Long press: navigate to long press route (defaults to compose index)
  const handleLongPress = useCallback(() => {
    longPressTriggered.current = true;
    // Close menu if open
    setExpanded(false);
    
    // Use requestAnimationFrame to ensure state updates complete before navigation
    requestAnimationFrame(() => {
      try {
        checkActivation(() => {
          if (longPressRoute) {
            router.push(longPressRoute as any);
          }
        });
      } catch (error) {
        console.error('Error navigating on long press:', error);
        longPressTriggered.current = false;
      }
    });
  }, [longPressRoute, router, checkActivation]);

  // Option press: navigate to specific create page
  const handleOptionPress = (option: CreateFABOption) => {
    setExpanded(false);
    checkActivation(() => {
      router.push(option.createRoute as any);
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
                className="flex-row items-center rounded-full border border-gray-200 bg-white px-4 py-3 dark:border-neutral-700 dark:bg-neutral-800"
                activeOpacity={0.8}
              >
                <View 
                  className="size-10 items-center justify-center rounded-full ltr:mr-3 rtl:ml-3"
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
      <Pressable
        onPress={handleTap}
        onLongPress={handleLongPress}
        onPressOut={handlePressOut}
        delayLongPress={300}
        className="size-14 items-center justify-center rounded-full"
        style={{ backgroundColor: primaryColor }}
      >
        <Animated.View
          style={{
            transform: [{ rotate: rotateInterpolate }],
          }}
        >
          <Ionicons name="add" size={28} color="#fff" />
        </Animated.View>
      </Pressable>
    </View>
  );
}
