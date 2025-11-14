import React, { useMemo, useState, useEffect } from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import NetInfo from '@react-native-community/netinfo';
import { useTheme } from '@ui/context';

export interface UserAvatarProps {
  avatar?: string | null;
  size?: number;
  onPress?: () => void;
  className?: string;
  showBorder?: boolean;
  userId?: string | null; // For generating consistent placeholder
  username?: string | null; // Alternative seed for placeholder
}

/**
 * UserAvatar Component
 * 
 * Displays user avatar with online placeholder image fallback
 * 
 * @example
 * <UserAvatar avatar={user.avatar} size={40} userId={user.id} />
 * <UserAvatar avatar={user.avatar} size={40} onPress={() => router.push('/profile')} userId={user.id} />
 */
export const UserAvatar = React.memo<UserAvatarProps>(({
  avatar,
  size = 40,
  onPress,
  className = '',
  showBorder = false,
  userId,
  username,
}) => {
  const { isDark } = useTheme();
  const iconColor = isDark ? '#9ca3af' : '#6b7280';
  const borderClass = showBorder ? 'border border-gray-200 dark:border-neutral-700' : '';
  const [isOnline, setIsOnline] = useState(true);
  const [hasError, setHasError] = useState(false);
  
  // Generate a random seed once per component instance for truly random but consistent images
  // Use useState with lazy initialization for random number to avoid calling Math.random during render
  const [randomFallback] = useState(() => Math.floor(Math.random() * 10000).toString());
  
  const randomSeed = useMemo(() => {
    if (userId) {
      // Use hash of userId for consistency per user
      let hash = 0;
      for (let i = 0; i < userId.length; i++) {
        const char = userId.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
      }
      return Math.abs(hash).toString();
    } else if (username) {
      // Use hash of username for consistency per user
      let hash = 0;
      for (let i = 0; i < username.length; i++) {
        const char = username.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
      }
      return Math.abs(hash).toString();
    } else {
      // Use pre-generated random number for users without ID/username
      return randomFallback;
    }
  }, [userId, username, randomFallback]);

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

  // Generate random placeholder image URL using Picsum Photos
  const placeholderImageUrl = useMemo(() => {
    return `https://picsum.photos/seed/${randomSeed}/${size}/${size}`;
  }, [randomSeed, size]);

  const handleError = () => {
    setHasError(true);
  };

  const shouldShowPlaceholder = !avatar || hasError;
  const shouldShowPlaceholderImage = shouldShowPlaceholder && isOnline && !hasError;

  const content = (
    <View 
      className={`rounded-full overflow-hidden bg-gray-200 dark:bg-neutral-800 ${borderClass} ${className}`}
      style={{ width: size, height: size }}
    >
      {avatar && !hasError ? (
        <Image
          source={{ uri: avatar }}
          className="w-full h-full"
          resizeMode="cover"
          onError={handleError}
        />
      ) : shouldShowPlaceholderImage ? (
        <Image
          source={{ uri: placeholderImageUrl }}
          className="w-full h-full"
          resizeMode="cover"
          onError={handleError}
        />
      ) : (
        <View className="w-full h-full items-center justify-center">
          <Ionicons name="person" size={size * 0.5} color={iconColor} />
        </View>
      )}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
});

UserAvatar.displayName = 'UserAvatar';

