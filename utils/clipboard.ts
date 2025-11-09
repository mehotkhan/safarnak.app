import { Alert } from 'react-native';
import * as Clipboard from 'expo-clipboard';

/**
 * Copy text to clipboard with user feedback
 * 
 * @param text - Text to copy
 * @param label - Label for the copied item (used in success message)
 * @param t - Translation function (optional)
 * @returns Promise that resolves when copy is complete
 * 
 * @example
 * await copyToClipboard(user.id, 'User ID', t);
 */
export async function copyToClipboard(
  text: string,
  label?: string,
  t?: (key: string, options?: any) => string
): Promise<void> {
  try {
    await Clipboard.setStringAsync(text);
    
    if (t && label) {
      Alert.alert(
        t('common.success'),
        t('profile.copiedToClipboard', { label }) || `${label} copied to clipboard`
      );
    } else if (label) {
      Alert.alert('Success', `${label} copied to clipboard`);
    }
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    
    // Fallback: show text in alert on error
    if (t) {
      Alert.alert(
        label || 'Text',
        text,
        [{ text: t('common.ok') || 'OK' }]
      );
    } else {
      Alert.alert(label || 'Text', text, [{ text: 'OK' }]);
    }
  }
}

