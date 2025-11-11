import React, { useMemo, useState } from 'react';
import { Modal, Pressable, View } from 'react-native';
import { DateTime } from 'luxon';
import { Ionicons } from '@expo/vector-icons';
import { CustomText } from '@components/ui/CustomText';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@components/context/LanguageContext';
import { useDateTime, parseDate } from '@hooks/useDateTime';

interface Props {
  label?: string;
  value?: string; // YYYY-MM-DD (always Gregorian for storage)
  onChange?: (date: string) => void;
  placeholder?: string;
}

export default function DatePicker({ label, value, onChange, placeholder }: Props) {
  const { t } = useTranslation();
  const { formatDate, locale, calendar } = useDateTime();
  const { currentLanguage } = useLanguage();
  
  // Base DateTime state (Luxon only) from value or now
  const initialDt = useMemo(() => {
    const d = value ? parseDate(value) : DateTime.now();
    return d.isValid ? d : DateTime.now();
  }, [value]);

  // Initialize numeric Y/M/D from base DateTime (Gregorian internally)
  const initial = useMemo(() => {
    const baseDate = initialDt.isValid ? initialDt : DateTime.now();
    return {
      year: baseDate.year,
      month: baseDate.month,
      day: baseDate.day,
    };
  }, [initialDt]);

  const [open, setOpen] = useState(false);
  const [year, setYear] = useState(initial.year);
  const [month, setMonth] = useState(initial.month);
  const [day, setDay] = useState(initial.day);

  // Compute a display DateTime using Luxon only with outputCalendar applied
  const displayDate = useMemo(() => {
    try {
      return DateTime.fromObject({ year, month, day }, { locale, outputCalendar: calendar as any });
    } catch {
      return DateTime.fromObject({ year, month, day });
    }
  }, [year, month, day, locale, calendar]);

  // Convert display calendar date back to Gregorian ISO format (YYYY-MM-DD)
  const formatted = useMemo(() => {
    try {
      // Convert to Gregorian ISO format for storage
      const gregorian = displayDate.reconfigure({ outputCalendar: 'gregory' });
      return gregorian.toISODate() || '';
    } catch (error) {
      console.error('Error converting date:', error);
      return '';
    }
  }, [displayDate]);

  // Localized display format for user-friendly display
  const displayValue = useMemo(() => {
    if (value) {
      return formatDate(value, 'short');
    }
    if (formatted) {
      return formatDate(formatted, 'short');
    }
    return null;
  }, [value, formatted, formatDate]);

  const apply = () => {
    onChange?.(formatted);
    setOpen(false);
  };

  // Month name with Luxon only
  const monthName = useMemo(() => {
    try {
      return displayDate.toLocaleString({ month: 'short' });
    } catch {
      return String(month).padStart(2, '0');
    }
  }, [displayDate, month]);

  // Year/Day labels with Luxon only
  const yearLabel = useMemo(() => displayDate.toLocaleString({ year: 'numeric' }), [displayDate]);
  const dayLabel = useMemo(() => displayDate.toLocaleString({ day: '2-digit' }), [displayDate]);

  return (
    <View className="mb-4">
      {label ? (
        <CustomText weight="medium" className="text-base text-black dark:text-white mb-2">
          {label}
        </CustomText>
      ) : null}
      <Pressable
        onPress={() => setOpen(true)}
        className="flex-row items-center bg-neutral-100 rounded-full border border-neutral-100 px-4 py-3"
      >
        <Ionicons name="calendar-outline" size={18} color="#6b7280" />
        <CustomText className="ml-2 text-black dark:text-white">
          {displayValue || (placeholder || t('plan.form.datePlaceholder'))}
        </CustomText>
      </Pressable>

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable className="flex-1 bg-black/40 items-center justify-center px-6" onPress={() => setOpen(false)}>
          <Pressable className="w-full max-w-md bg-white dark:bg-neutral-900 rounded-2xl p-5" onPress={() => {}}>
            <CustomText weight="bold" className="text-lg text-black dark:text-white mb-4">
              {t('datePicker.selectDate')}
            </CustomText>
            
            {/* Calendar Type Indicator */}
            <CustomText className="text-xs text-gray-500 dark:text-gray-400 mb-3 text-center">
              {currentLanguage === 'fa' ? 'تقویم شمسی (جلالی)' : currentLanguage === 'ar' ? 'التقويم الهجري' : 'Gregorian Calendar'}
            </CustomText>
            
            <View className="flex-row items-center justify-between mb-3">
              {/* Year Picker */}
              <View className="items-center flex-1">
                <Pressable 
                  onPress={() => { 
                    setYear(y => y + 1);
                  }} 
                  className="p-2"
                >
                  <Ionicons name="chevron-up" size={20} color="#6b7280" />
                </Pressable>
                <CustomText weight="medium" className="text-lg text-black dark:text-white min-w-[70px] text-center">
                  {yearLabel}
                </CustomText>
                <Pressable 
                  onPress={() => { 
                    setYear(y => y - 1);
                  }} 
                  className="p-2"
                >
                  <Ionicons name="chevron-down" size={20} color="#6b7280" />
                </Pressable>
                <CustomText className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {currentLanguage === 'fa' ? 'سال' : currentLanguage === 'ar' ? 'سنة' : (t('datePicker.year') || 'Year')}
                </CustomText>
              </View>
              
              {/* Month Picker */}
              <View className="items-center flex-1">
                <Pressable onPress={() => { 
                  setMonth(m => (m === 12 ? 1 : m + 1));
                }} className="p-2">
                  <Ionicons name="chevron-up" size={20} color="#6b7280" />
                </Pressable>
                <CustomText weight="medium" className="text-lg text-black dark:text-white min-w-[70px] text-center">
                  {monthName}
                </CustomText>
                <Pressable onPress={() => { 
                  setMonth(m => (m === 1 ? 12 : m - 1));
                }} className="p-2">
                  <Ionicons name="chevron-down" size={20} color="#6b7280" />
                </Pressable>
                <CustomText className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {currentLanguage === 'fa' ? 'ماه' : currentLanguage === 'ar' ? 'شهر' : (t('datePicker.month') || 'Month')}
                </CustomText>
              </View>
              
              {/* Day Picker */}
              <View className="items-center flex-1">
                <Pressable onPress={() => setDay(d => d + 1)} className="p-2">
                  <Ionicons name="chevron-up" size={20} color="#6b7280" />
                </Pressable>
                <CustomText weight="medium" className="text-lg text-black dark:text-white min-w-[60px] text-center">
                  {dayLabel}
                </CustomText>
                <Pressable onPress={() => setDay(d => Math.max(1, d - 1))} className="p-2">
                  <Ionicons name="chevron-down" size={20} color="#6b7280" />
                </Pressable>
                <CustomText className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {currentLanguage === 'fa' ? 'روز' : currentLanguage === 'ar' ? 'يوم' : (t('datePicker.day') || 'Day')}
                </CustomText>
              </View>
            </View>

            {/* Preview of selected date */}
            <View className="bg-gray-50 dark:bg-neutral-800 rounded-lg p-3 mb-4">
              <CustomText className="text-sm text-gray-600 dark:text-gray-400 text-center">
                {displayValue || formatted}
              </CustomText>
            </View>

            <View className="flex-row justify-end gap-3">
              <Pressable onPress={() => setOpen(false)} className="px-4 py-2 rounded-full bg-neutral-100 dark:bg-neutral-800">
                <CustomText className="text-black dark:text-white">{t('common.cancel')}</CustomText>
              </Pressable>
              <Pressable onPress={apply} className="px-4 py-2 rounded-full bg-primary">
                <CustomText className="text-white">{t('common.ok')}</CustomText>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}



