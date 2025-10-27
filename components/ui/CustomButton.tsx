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
      return 'bg-transparent border border-gray-300';
    default:
      return 'bg-primary';
  }
};

const getTextVariantStyle = (variant: ButtonTextVariant) => {
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
      className={`w-full rounded-full py-3 px-3 flex flex-row justify-center items-center my-2 android:shadow-none shadow-md shadow-black/20 android:elevation-2 ${getBgVariantStyle(
        bgVariant
      )} ${(disabled || loading) ? 'opacity-50' : ''} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {IconLeft && <IconLeft />}
      {loading ? (
        <ActivityIndicator color="#fff" size="small" />
      ) : (
        <Text className={`text-lg font-bold ${getTextVariantStyle(textVariant)}`}>{title}</Text>
      )}
      {IconRight && <IconRight />}
    </TouchableOpacity>
  );
}
 
