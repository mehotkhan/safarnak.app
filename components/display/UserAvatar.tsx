import React from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@components/context';

export interface UserAvatarProps {
  avatar?: string | null;
  size?: number;
  onPress?: () => void;
  className?: string;
  showBorder?: boolean;
}

/**
 * UserAvatar Component
 * 
 * Displays user avatar or placeholder icon
 * 
 * @example
 * <UserAvatar avatar={user.avatar} size={40} />
 * <UserAvatar avatar={user.avatar} size={40} onPress={() => router.push('/profile')} />
 */
export const UserAvatar = React.memo<UserAvatarProps>(({
  avatar,
  size = 40,
  onPress,
  className = '',
  showBorder = false,
}) => {
  const { isDark } = useTheme();
  const iconColor = isDark ? '#9ca3af' : '#6b7280';
  const borderClass = showBorder ? 'border border-gray-200 dark:border-neutral-700' : '';

  const content = (
    <View 
      className={`rounded-full overflow-hidden bg-gray-200 dark:bg-neutral-800 ${borderClass} ${className}`}
      style={{ width: size, height: size }}
    >
      {avatar ? (
        <Image
          source={{ uri: avatar }}
          className="w-full h-full"
          resizeMode="cover"
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

