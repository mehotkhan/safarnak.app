import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CustomText } from '@components/ui/CustomText';
import { useTheme } from '@components/context/ThemeContext';
import { useTranslation } from 'react-i18next';
import { useGraphBackendReachable } from '@hooks/useGraphBackendReachable';

export default function OfflineIndicator() {
  const { isDark } = useTheme();
  const { t } = useTranslation();
  const reachable = useGraphBackendReachable();

  if (reachable) return null;

  return (
    <View
      pointerEvents="none"
      className="absolute left-4 bottom-24 flex-row items-center bg-red-500/90 px-3 py-2 rounded-full"
      style={{ zIndex: 50 }}
    >
      <Ionicons name="cloud-offline" size={16} color="#fff" />
      <CustomText className="text-white ml-2" weight="medium">
        {t('common.offline', { defaultValue: 'Offline' })}
      </CustomText>
    </View>
  );
}


