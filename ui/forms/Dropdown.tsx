import React, { useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { CustomText } from '@ui/display';
import { useTheme } from '@ui/context';

export interface DropdownOption {
  id: string;
  label: string;
  icon?: string;
}

export interface DropdownProps {
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  trigger?: React.ReactNode;
  placeholder?: string;
  icon?: string;
  className?: string;
  placement?: 'bottom' | 'top';
  translationKey?: string; // e.g., 'feed.timeFilters' for t(`feed.timeFilters.${option.label}`)
}

/**
 * Dropdown Component
 * 
 * A simple dropdown menu component for selecting from a list of options
 * 
 * @example
 * <Dropdown 
 *   options={timeFilters}
 *   value={selectedTimeFilter}
 *   onChange={setSelectedTimeFilter}
 *   icon="time-outline"
 *   translationKey="feed.timeFilters"
 * />
 */
export const Dropdown = React.memo<DropdownProps>(({ 
  options, 
  value, 
  onChange, 
  trigger,
  placeholder: _placeholder = 'Select...',
  icon,
  className = '',
  placement = 'bottom',
  translationKey,
}) => {
  const { isDark } = useTheme();
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const _selectedOption = options.find(opt => opt.id === value);
  const displayLabel = translationKey
    ? (_selectedOption?.label ? (t(`${translationKey}.${_selectedOption.label}`) || _selectedOption.label) : _placeholder)
    : (_selectedOption?.label || _placeholder);

  const handleSelect = (optionId: string) => {
    onChange(optionId);
    setIsOpen(false);
  };

  return (
    <View style={{ position: 'relative', zIndex: 99999 }} className={className}>
      {trigger ? (
        <TouchableOpacity onPress={() => setIsOpen(!isOpen)} activeOpacity={0.7}>
          {trigger}
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          onPress={() => setIsOpen(!isOpen)}
          className="flex-row items-center rounded-full bg-gray-100 px-3 py-1.5 dark:bg-neutral-800"
          activeOpacity={0.7}
        >
          {icon && (
            <Ionicons
              name={icon as any}
              size={18}
              color={isDark ? '#9ca3af' : '#6b7280'}
            />
          )}
          <CustomText className="text-sm text-gray-800 dark:text-gray-200 ltr:ml-2 rtl:mr-2">
            {displayLabel}
          </CustomText>
          <Ionicons
            name={isOpen ? 'chevron-up' : 'chevron-down'}
            size={14}
            color={isDark ? '#9ca3af' : '#6b7280'}
            style={{ marginStart: 6 }}
          />
        </TouchableOpacity>
      )}

      {isOpen && (
        <>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => setIsOpen(false)}
            className="absolute"
            style={{
              zIndex: 9998,
              top: -4000,
              left: -4000,
              right: -4000,
              bottom: -4000,
            }}
          />
          <View
            className={`absolute mt-2 rounded-xl bg-white dark:bg-neutral-900 ltr:right-0 rtl:left-0 ${
              placement === 'top' ? 'bottom-full mb-2' : ''
            }`}
            style={{
              minWidth: 140,
              paddingVertical: 4,
              shadowColor: '#000',
              shadowOpacity: 0.15,
              shadowRadius: 8,
              shadowOffset: { width: 0, height: 4 },
              elevation: 12,
              zIndex: 9999,
            }}
          >
            {options.map((option) => (
              <TouchableOpacity
                key={option.id}
                onPress={() => handleSelect(option.id)}
                className={`flex-row items-center px-3 py-2 ${
                  value === option.id
                    ? 'bg-gray-50 dark:bg-neutral-800'
                    : ''
                }`}
                activeOpacity={0.7}
              >
                <CustomText
                  weight={value === option.id ? 'bold' : 'regular'}
                  className={`text-sm ${
                    value === option.id
                      ? 'text-primary'
                      : 'text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {translationKey 
                    ? (t(`${translationKey}.${option.label}`) || option.label)
                    : option.label}
                </CustomText>
                {value === option.id && (
                  <Ionicons
                    name="checkmark"
                    size={16}
                    color="#3b82f6"
                    style={{ marginStart: 'auto' }}
                  />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </>
      )}
    </View>
  );
});

Dropdown.displayName = 'Dropdown';

