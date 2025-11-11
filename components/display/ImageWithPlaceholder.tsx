import React, { useState } from 'react';
import { View, Image, ImageErrorEventData, NativeSyntheticEvent } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CustomText } from './CustomText';
import { useTheme } from '@components/context';

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
 * Displays an image with a placeholder fallback when the image fails to load or is not available
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
  const [hasError, setHasError] = useState(false);
  const [_isLoading, setIsLoading] = useState(true);

  const handleError = (error: NativeSyntheticEvent<ImageErrorEventData>) => {
    setHasError(true);
    setIsLoading(false);
    onError?.(error);
  };

  const handleLoad = () => {
    setIsLoading(false);
    onLoad?.();
  };

  const imageUri = typeof source === 'object' && 'uri' in source ? source.uri : null;
  const showPlaceholder = hasError || !imageUri;

  const containerStyle: any = {};
  if (width) containerStyle.width = width;
  if (height) containerStyle.height = height;

  return (
    <View 
      className={`bg-gray-200 dark:bg-neutral-800 relative overflow-hidden ${className}`}
      style={containerStyle}
    >
      {!showPlaceholder ? (
        <Image
          source={source}
          className={`w-full h-full ${imageClassName}`}
          resizeMode={resizeMode}
          onError={handleError}
          onLoad={handleLoad}
        />
      ) : (
        <View className="w-full h-full items-center justify-center bg-gray-100 dark:bg-neutral-800">
          {placeholder && !hasError ? (
            <Image
              source={{ uri: placeholder }}
              className="w-full h-full opacity-50"
              resizeMode={resizeMode}
              onError={handleError}
              onLoad={handleLoad}
            />
          ) : null}
          <View className="absolute inset-0 items-center justify-center">
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
        </View>
      )}
    </View>
  );
});

ImageWithPlaceholder.displayName = 'ImageWithPlaceholder';

