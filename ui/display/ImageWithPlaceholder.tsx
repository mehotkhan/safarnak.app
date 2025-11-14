import React, { useState, useEffect } from 'react';
import { View, Image, ImageErrorEventData, NativeSyntheticEvent } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import NetInfo from '@react-native-community/netinfo';
import { CustomText } from './CustomText';
import { useTheme } from '@ui/context';

export interface ImageWithPlaceholderProps {
  source: { uri: string } | number;
  placeholder?: string;
  fallbackIcon?: string;
  fallbackText?: string;
  className?: string;
  imageClassName?: string;
  resizeMode?: 'cover' | 'contain' | 'stretch' | 'repeat' | 'center';
  width?: number | string;
  height?: number | string;
  onError?: (error: NativeSyntheticEvent<ImageErrorEventData>) => void;
  onLoad?: () => void;
}

/**
 * ImageWithPlaceholder Component
 * 
 * Displays an image with a placeholder fallback when the image fails to load or is not available.
 * When online, tries to load the placeholder image URL instead of showing a simple icon.
 * 
 * @example
 * <ImageWithPlaceholder 
 *   source={{ uri: imageUrl }}
 *   placeholder="https://via.placeholder.com/400x300"
 *   fallbackText="Travel Image"
 *   width="100%"
 *   height={200}
 * />
 */
export const ImageWithPlaceholder = React.memo<ImageWithPlaceholderProps>(({ 
  source, 
  placeholder,
  fallbackIcon = 'image-outline',
  fallbackText,
  className = '',
  imageClassName = '',
  resizeMode = 'cover',
  width,
  height,
  onError,
  onLoad,
}) => {
  const { isDark } = useTheme();
  const [hasMainError, setHasMainError] = useState(false);
  const [hasPlaceholderError, setHasPlaceholderError] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [_isLoading, setIsLoading] = useState(true);

  // Check network status
  useEffect(() => {
    const checkNetwork = async () => {
      const state = await NetInfo.fetch();
      setIsOnline(state.isConnected ?? false);
    };
    
    checkNetwork();
    
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsOnline(state.isConnected ?? false);
    });
    
    return () => unsubscribe();
  }, []);

  const handleMainError = (error: NativeSyntheticEvent<ImageErrorEventData>) => {
    setHasMainError(true);
    setIsLoading(false);
    onError?.(error);
  };

  const handlePlaceholderError = () => {
    setHasPlaceholderError(true);
  };

  const handleLoad = () => {
    setIsLoading(false);
    onLoad?.();
  };

  const imageUri = typeof source === 'object' && 'uri' in source ? source.uri : null;
  const shouldShowPlaceholder = hasMainError || !imageUri;
  
  // When online and main image failed, try to show placeholder image
  // Only show icon if offline or if placeholder also failed
  const shouldShowPlaceholderImage = shouldShowPlaceholder && isOnline && placeholder && !hasPlaceholderError;

  const containerStyle: any = {};
  if (width) containerStyle.width = width;
  if (height) containerStyle.height = height;

  return (
    <View 
      className={`bg-gray-200 dark:bg-neutral-800 relative overflow-hidden ${className}`}
      style={containerStyle}
    >
      {!shouldShowPlaceholder ? (
        <Image
          source={source}
          className={`w-full h-full ${imageClassName}`}
          resizeMode={resizeMode}
          onError={handleMainError}
          onLoad={handleLoad}
        />
      ) : shouldShowPlaceholderImage ? (
        <Image
          source={{ uri: placeholder }}
          className={`w-full h-full ${imageClassName}`}
          resizeMode={resizeMode}
          onError={handlePlaceholderError}
          onLoad={handleLoad}
        />
      ) : (
        <View className="w-full h-full items-center justify-center bg-gray-100 dark:bg-neutral-800">
          <Ionicons 
            name={fallbackIcon as any} 
            size={48} 
            color={isDark ? '#4b5563' : '#9ca3af'} 
          />
          {fallbackText && (
            <CustomText className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              {fallbackText}
            </CustomText>
          )}
        </View>
      )}
    </View>
  );
});

ImageWithPlaceholder.displayName = 'ImageWithPlaceholder';

