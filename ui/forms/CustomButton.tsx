import { TouchableOpacity, Text, TouchableOpacityProps, ActivityIndicator } from 'react-native';

type ButtonBgVariant = 'primary' | 'secondary' | 'danger' | 'success' | 'outline';
type ButtonTextVariant = 'default' | 'primary' | 'secondary' | 'danger' | 'success';

interface CustomButtonProps extends TouchableOpacityProps {
  title: string;
  bgVariant?: ButtonBgVariant;
  textVariant?: ButtonTextVariant;
  IconLeft?: React.ComponentType<any>;
  IconRight?: React.ComponentType<any>;
  loading?: boolean;
  className?: string;
}

const getBgVariantStyle = (variant: ButtonBgVariant) => {
  switch (variant) {
    case 'secondary':
      return 'bg-gray-500';
    case 'danger':
      return 'bg-red-500';
    case 'success':
      return 'bg-green-500';
    case 'outline':
      return 'bg-transparent border border-gray-300 dark:border-gray-600';
    default:
      return 'bg-primary';
  }
};

const getTextVariantStyle = (variant: ButtonTextVariant, bgVariant?: ButtonBgVariant) => {
  // For outline buttons, use dark text in light mode and light text in dark mode
  if (bgVariant === 'outline') {
    return 'text-gray-900 dark:text-gray-100';
  }
  
  switch (variant) {
    case 'primary':
      return 'text-black';
    case 'secondary':
      return 'text-gray-100';
    case 'danger':
      return 'text-red-100';
    case 'success':
      return 'text-green-100';
    default:
      return 'text-white';
  }
};

export default function CustomButton({
  onPress,
  title,
  bgVariant = 'primary',
  textVariant = 'default',
  IconLeft,
  IconRight,
  loading = false,
  disabled,
  className = '',
  ...props
}: CustomButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`my-2 flex w-full flex-row items-center justify-center rounded-full p-3 shadow-md shadow-black/20 ${getBgVariantStyle(
        bgVariant
      )} ${(disabled || loading) ? 'opacity-50' : ''} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {IconLeft && <IconLeft />}
      {loading ? (
        <ActivityIndicator 
          color={bgVariant === 'outline' ? (textVariant === 'default' ? '#374151' : '#fff') : '#fff'} 
          size="small" 
        />
      ) : (
        <Text className={`text-lg font-bold ${getTextVariantStyle(textVariant, bgVariant)}`}>{title}</Text>
      )}
      {IconRight && <IconRight />}
    </TouchableOpacity>
  );
}
 
