import { TouchableOpacity, Text, TouchableOpacityProps, StyleSheet, ActivityIndicator } from 'react-native';
import Colors from '@constants/Colors';

type ButtonBgVariant = 'primary' | 'secondary' | 'danger' | 'success' | 'outline';
type ButtonTextVariant = 'default' | 'primary' | 'secondary' | 'danger' | 'success';

interface CustomButtonProps extends TouchableOpacityProps {
  title: string;
  bgVariant?: ButtonBgVariant;
  textVariant?: ButtonTextVariant;
  IconLeft?: React.ComponentType<any>;
  IconRight?: React.ComponentType<any>;
  loading?: boolean;
}

const getBgVariantStyle = (variant: ButtonBgVariant) => {
  switch (variant) {
    case 'secondary':
      return styles.bgSecondary;
    case 'danger':
      return styles.bgDanger;
    case 'success':
      return styles.bgSuccess;
    case 'outline':
      return styles.bgOutline;
    default:
      return styles.bgPrimary;
  }
};

const getTextVariantStyle = (variant: ButtonTextVariant) => {
  switch (variant) {
    case 'primary':
      return styles.textPrimary;
    case 'secondary':
      return styles.textSecondary;
    case 'danger':
      return styles.textDanger;
    case 'success':
      return styles.textSuccess;
    default:
      return styles.textDefault;
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
  ...props
}: CustomButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.button, getBgVariantStyle(bgVariant), (disabled || loading) && styles.disabled]}
      disabled={disabled || loading}
      {...props}
    >
      {IconLeft && <IconLeft />}
      {loading ? (
        <ActivityIndicator color="#fff" size="small" />
      ) : (
        <Text style={[styles.text, getTextVariantStyle(textVariant)]}>{title}</Text>
      )}
      {IconRight && <IconRight />}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: '100%',
    borderRadius: 25,
    paddingVertical: 14,
    paddingHorizontal: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 8,
  },
  bgPrimary: {
    backgroundColor: Colors.light.primary,
  },
  bgSecondary: {
    backgroundColor: '#6b7280',
  },
  bgDanger: {
    backgroundColor: Colors.light.danger,
  },
  bgSuccess: {
    backgroundColor: Colors.light.success,
  },
  bgOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  text: {
    fontSize: 18,
    fontWeight: '700',
  },
  textDefault: {
    color: '#ffffff',
  },
  textPrimary: {
    color: '#000000',
  },
  textSecondary: {
    color: '#f3f4f6',
  },
  textDanger: {
    color: '#fef2f2',
  },
  textSuccess: {
    color: '#f0fdf4',
  },
  disabled: {
    opacity: 0.5,
  },
});
