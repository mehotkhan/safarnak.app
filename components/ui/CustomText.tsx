import { useLanguage } from '@components/context/LanguageContext';
import {
  Text as RNText,
  TextProps as RNTextProps,
} from 'react-native';

interface CustomTextProps extends RNTextProps {
  weight?: 'regular' | 'medium' | 'bold';
  className?: string;
}

export function CustomText({
  weight = 'regular',
  className = '',
  style,
  ...props
}: CustomTextProps) {
  const { currentLanguage } = useLanguage();

  let fontFamily: string | undefined;

  if (currentLanguage === 'fa') {
    switch (weight) {
      case 'medium':
        fontFamily = 'VazirMedium';
        break;
      case 'bold':
        fontFamily = 'VazirBold';
        break;
      default:
        fontFamily = 'VazirRegular';
    }
  }

  return (
    <RNText
      className={className}
      style={[{ fontFamily }, style]}
      {...props}
    />
  );
}
