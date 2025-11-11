import { useLanguage } from '@components/context';

export function useFontFamily() {
  const { currentLanguage } = useLanguage();

  // Return appropriate font family based on language
  if (currentLanguage === 'fa') {
    return {
      regular: 'VazirRegular',
      medium: 'VazirMedium',
      bold: 'VazirBold',
    };
  }

  // Default to system fonts for English
  return {
    regular: 'System',
    medium: 'System',
    bold: 'System',
  };
}

export function getFontFamily(
  weight: 'regular' | 'medium' | 'bold' = 'regular'
) {
  // This can be used in StyleSheet.create
  return {
    fontFamily:
      weight === 'regular'
        ? 'VazirRegular'
        : weight === 'medium'
          ? 'VazirMedium'
          : 'VazirBold',
  };
}
