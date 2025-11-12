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
    <View style={{ position: 'relative' }} className={className}>
      {trigger ? (
        <TouchableOpacity onPress={() => setIsOpen(!isOpen)} activeOpacity={0.7}>
          {trigger}
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          onPress={() => setIsOpen(!isOpen)}
          className="flex-row items-center px-3 py-1.5 rounded-full bg-gray-100 dark:bg-neutral-800"
          activeOpacity={0.7}
        >
          {icon && (
            <Ionicons
              name={icon as any}
              size={18}
              color={isDark ? '#9ca3af' : '#6b7280'}
            />
          )}
          <CustomText className="ml-2 text-sm text-gray-800 dark:text-gray-200">
            {displayLabel}
          </CustomText>
          <Ionicons
            name={isOpen ? 'chevron-up' : 'chevron-down'}
            size={14}
            color={isDark ? '#9ca3af' : '#6b7280'}
            style={{ marginLeft: 6 }}
          />
        </TouchableOpacity>
      )}

      {isOpen && (
        <>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => setIsOpen(false)}
            className="absolute -inset-96"
            style={{ zIndex: 10 }}
          />
          <View
            className={`absolute z-50 mt-2 right-0 rounded-xl bg-white dark:bg-neutral-900 ${
              placement === 'top' ? 'bottom-full mb-2' : ''
            }`}
            style={{
              minWidth: 140,
              paddingVertical: 4,
              shadowColor: '#000',
              shadowOpacity: 0.15,
              shadowRadius: 8,
              shadowOffset: { width: 0, height: 4 },
              elevation: 6,
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
                    style={{ marginLeft: 'auto' }}
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

