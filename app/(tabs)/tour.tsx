import { CustomText } from '@components/ui/CustomText';
import { useTranslation } from 'react-i18next';
import { View, ScrollView } from 'react-native';

export default function TourScreen() {
  const { t } = useTranslation();

  return (
    <ScrollView className="flex-1 bg-white dark:bg-black">
      <View className="flex-1 items-center justify-center px-5 py-12">
        <CustomText
          weight="bold"
          className="text-2xl text-black dark:text-white mb-8 text-center"
        >
          {t('tour.title')}
        </CustomText>
        <View className="h-px w-4/5 bg-gray-300 dark:bg-gray-700 mb-8" />
        <CustomText className="text-base text-center text-gray-700 dark:text-gray-300 px-5 leading-6">
          {t('tour.description')}
        </CustomText>
      </View>
    </ScrollView>
  );
}
