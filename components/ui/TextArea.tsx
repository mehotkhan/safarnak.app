import React, { useMemo, useState } from 'react';
import { TextInput, View } from 'react-native';
import { useLanguage } from '@components/context/LanguageContext';
import { CustomText } from '@components/ui/CustomText';

interface Props {
  label?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  placeholder?: string;
  className?: string;
  rows?: number;
}

export default function TextArea({ label, value, onChangeText, placeholder, className, rows = 6 }: Props) {
  const { isRTL } = useLanguage();
  const minHeight = useMemo(() => rows * 24, [rows]);
  const [autoHeight, setAutoHeight] = useState<number>(minHeight);

  return (
    <View className={`mb-4 ${className || ''}`}>
      {label ? (
        <CustomText weight="medium" className="text-base text-black dark:text-white mb-2">
          {label}
        </CustomText>
      ) : null}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        multiline
        numberOfLines={rows}
        textAlignVertical="top"
        onContentSizeChange={e => {
          const h = e.nativeEvent.contentSize?.height || minHeight;
          setAutoHeight(h < minHeight ? minHeight : h);
        }}
        className={`rounded-2xl p-4 text-black text-[15px] bg-neutral-100 border border-neutral-200 dark:bg-neutral-900 dark:border-neutral-800 ${isRTL ? 'text-right' : 'text-left'}`}
        style={{
          writingDirection: isRTL ? 'rtl' : 'ltr',
          textAlign: isRTL ? 'right' : 'left',
          minHeight,
          height: autoHeight,
        }}
      />
    </View>
  );
}


