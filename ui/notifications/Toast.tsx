// React Native Animated.Value requires accessing .current during render for initialization
// This is a special case where refs are used for animation values, not DOM refs
/* eslint-disable react-hooks/refs */
import React, { useEffect } from 'react';
import { View, Animated, TouchableOpacity, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { CustomText } from '@ui/display';
import { useTheme } from '@ui/context';

interface ToastProps {
  visible: boolean;
  title: string;
  message: string;
  type?: 'info' | 'success' | 'error' | 'warning';
  duration?: number;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({
  visible,
  title,
  message,
  type = 'info',
  duration = 4000,
  onClose,
}) => {
  const { isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const opacity = React.useRef(new Animated.Value(0)).current;
  const translateY = React.useRef(new Animated.Value(-100)).current;

  const hideToast = React.useCallback(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: -100,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onClose();
    });
  }, [opacity, translateY, onClose]);

  useEffect(() => {
    if (!visible) {
      // Hide animation when not visible
      opacity.setValue(0);
      translateY.setValue(-100);
      return;
    }

    // Show animation
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        tension: 65,
        friction: 8,
      }),
    ]).start();

    // Auto-hide after duration
    const timer = setTimeout(() => {
      hideToast();
    }, duration);

    return () => clearTimeout(timer);
  }, [visible, duration, hideToast, opacity, translateY]);

  // Debug: Log when toast visibility changes
  useEffect(() => {
    if (visible) {
      console.log('[Toast] Toast visible:', { title, message, type });
    }
  }, [visible, title, message, type]);

  if (!visible) return null;

  const getIconName = () => {
    switch (type) {
      case 'success':
        return 'checkmark-circle';
      case 'error':
        return 'close-circle';
      case 'warning':
        return 'warning';
      default:
        return 'information-circle';
    }
  };

  const getColors = () => {
    switch (type) {
      case 'success':
        return {
          bg: isDark ? 'bg-green-900/90' : 'bg-green-50',
          border: isDark ? 'border-green-700' : 'border-green-200',
          icon: isDark ? '#10b981' : '#059669',
          title: isDark ? 'text-green-100' : 'text-green-900',
          message: isDark ? 'text-green-200' : 'text-green-700',
        };
      case 'error':
        return {
          bg: isDark ? 'bg-red-900/90' : 'bg-red-50',
          border: isDark ? 'border-red-700' : 'border-red-200',
          icon: isDark ? '#ef4444' : '#dc2626',
          title: isDark ? 'text-red-100' : 'text-red-900',
          message: isDark ? 'text-red-200' : 'text-red-700',
        };
      case 'warning':
        return {
          bg: isDark ? 'bg-yellow-900/90' : 'bg-yellow-50',
          border: isDark ? 'border-yellow-700' : 'border-yellow-200',
          icon: isDark ? '#f59e0b' : '#d97706',
          title: isDark ? 'text-yellow-100' : 'text-yellow-900',
          message: isDark ? 'text-yellow-200' : 'text-yellow-700',
        };
      default:
        return {
          bg: isDark ? 'bg-blue-900/90' : 'bg-blue-50',
          border: isDark ? 'border-blue-700' : 'border-blue-200',
          icon: isDark ? '#3b82f6' : '#2563eb',
          title: isDark ? 'text-blue-100' : 'text-blue-900',
          message: isDark ? 'text-blue-200' : 'text-blue-700',
        };
    }
  };

  const colors = getColors();

  return (
    <Animated.View
      style={{
        opacity,
        transform: [{ translateY }],
        position: 'absolute',
        top: insets.top || (Platform.OS === 'android' ? 0 : 44),
        left: 0,
        right: 0,
        zIndex: 99999,
        elevation: 99999, // Android elevation
      }}
      pointerEvents="box-none"
    >
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={hideToast}
        className={`mx-4 mt-2 ${colors.bg} ${colors.border} border rounded-2xl p-4 shadow-lg`}
      >
        <View className="flex-row items-start">
          <Ionicons name={getIconName()} size={24} color={colors.icon} style={{ marginRight: 12, marginTop: 2 }} />
          <View className="flex-1">
            <CustomText weight="bold" className={`text-base mb-1 ${colors.title}`}>
              {title}
            </CustomText>
            <CustomText className={`text-sm ${colors.message}`}>
              {message}
            </CustomText>
          </View>
          <TouchableOpacity onPress={hideToast} className="ml-2">
            <Ionicons name="close" size={20} color={colors.icon} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

