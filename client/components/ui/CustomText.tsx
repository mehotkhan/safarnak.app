import { useLanguage } from '@/components/context/LanguageContext';
import { Text as RNText, TextProps as RNTextProps, TextStyle } from 'react-native';

interface CustomTextProps extends RNTextProps {
  weight?: 'regular' | 'medium' | 'bold';
}

export function CustomText({ weight = 'regular', style, ...props }: CustomTextProps) {
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

  const textStyle: TextStyle = {
    fontFamily,
    ...(style as TextStyle),
  };

  return <RNText style={textStyle} {...props} />;
}
