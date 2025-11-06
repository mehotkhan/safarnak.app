import React, { useMemo, useState } from 'react';
import { Modal, Pressable, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CustomText } from '@components/ui/CustomText';
import { useTranslation } from 'react-i18next';

interface Props {
  label?: string;
  value?: string; // YYYY-MM-DD
  onChange?: (date: string) => void;
  placeholder?: string;
}

function clamp(num: number, min: number, max: number) {
  return Math.max(min, Math.min(num, max));
}

export default function DatePicker({ label, value, onChange, placeholder }: Props) {
  const { t } = useTranslation();
  const initial = useMemo(() => {
    const d = value ? new Date(value) : new Date();
    return {
      year: d.getFullYear(),
      month: d.getMonth() + 1,
      day: d.getDate(),
    };
  }, [value]);

  const [open, setOpen] = useState(false);
  const [year, setYear] = useState(initial.year);
  const [month, setMonth] = useState(initial.month);
  const [day, setDay] = useState(initial.day);

  const formatted = useMemo(() => {
    const mm = String(month).padStart(2, '0');
    const dd = String(day).padStart(2, '0');
    return `${year}-${mm}-${dd}`;
  }, [year, month, day]);

  const apply = () => {
    onChange?.(formatted);
    setOpen(false);
  };

  const daysInMonth = useMemo(() => {
    return new Date(year, month, 0).getDate();
  }, [year, month]);

  const adjustDayIfNeeded = () => {
    setDay(prev => clamp(prev, 1, daysInMonth));
  };

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
          {value || formatted || (placeholder || t('plan.form.datePlaceholder'))}
        </CustomText>
      </Pressable>

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable className="flex-1 bg-black/40 items-center justify-center px-6" onPress={() => setOpen(false)}>
          <Pressable className="w-full max-w-md bg-white dark:bg-neutral-900 rounded-2xl p-5" onPress={() => {}}>
            <CustomText weight="bold" className="text-lg text-black dark:text-white mb-4">
              {t('datePicker.selectDate')}
            </CustomText>
            <View className="flex-row items-center justify-between mb-3">
              <View className="items-center">
                <Pressable onPress={() => { setYear(y => y + 1); adjustDayIfNeeded(); }} className="p-2">
                  <Ionicons name="chevron-up" size={20} color="#6b7280" />
                </Pressable>
                <CustomText className="text-black dark:text-white">{year}</CustomText>
                <Pressable onPress={() => { setYear(y => y - 1); adjustDayIfNeeded(); }} className="p-2">
                  <Ionicons name="chevron-down" size={20} color="#6b7280" />
                </Pressable>
              </View>
              <View className="items-center">
                <Pressable onPress={() => { setMonth(m => clamp(m + 1, 1, 12)); adjustDayIfNeeded(); }} className="p-2">
                  <Ionicons name="chevron-up" size={20} color="#6b7280" />
                </Pressable>
                <CustomText className="text-black dark:text-white">{String(month).padStart(2, '0')}</CustomText>
                <Pressable onPress={() => { setMonth(m => clamp(m - 1, 1, 12)); adjustDayIfNeeded(); }} className="p-2">
                  <Ionicons name="chevron-down" size={20} color="#6b7280" />
                </Pressable>
              </View>
              <View className="items-center">
                <Pressable onPress={() => setDay(d => clamp(d + 1, 1, daysInMonth))} className="p-2">
                  <Ionicons name="chevron-up" size={20} color="#6b7280" />
                </Pressable>
                <CustomText className="text-black dark:text-white">{String(day).padStart(2, '0')}</CustomText>
                <Pressable onPress={() => setDay(d => clamp(d - 1, 1, daysInMonth))} className="p-2">
                  <Ionicons name="chevron-down" size={20} color="#6b7280" />
                </Pressable>
              </View>
            </View>

            <View className="flex-row justify-end gap-3 mt-4">
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


