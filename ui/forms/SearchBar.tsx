import React from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CustomText } from '@ui/display';
import { useTheme } from '@ui/context';

export interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onClear?: () => void;
  className?: string;
  showFilterButton?: boolean;
  filterButtonBadge?: number;
  onFilterPress?: () => void;
}

/**
 * SearchBar Component
 * 
 * Displays a search input with icon, clear button, and optional filter button
 * 
 * @example
 * <SearchBar 
 *   value={searchQuery}
 *   onChangeText={setSearchQuery}
 *   placeholder="Search..."
 *   showFilterButton
 *   filterButtonBadge={3}
 *   onFilterPress={() => setShowFilters(true)}
 * />
 */
export const SearchBar = React.memo<SearchBarProps>(({ 
  value, 
  onChangeText, 
  placeholder = 'Search...',
  onClear,
  className = '',
  showFilterButton = false,
  filterButtonBadge,
  onFilterPress,
}) => {
  const { isDark } = useTheme();

  const handleClear = () => {
    onChangeText('');
    onClear?.();
  };

  return (
    <View className={`flex-row items-center ${className}`}>
      <View className="flex-1 flex-row items-center bg-gray-100 dark:bg-neutral-900 rounded-full px-4 py-3 mr-3">
        <Ionicons
          name="search"
          size={20}
          color={isDark ? '#9ca3af' : '#6b7280'}
        />
        <TextInput
          placeholder={placeholder}
          placeholderTextColor={isDark ? '#9ca3af' : '#6b7280'}
          value={value}
          onChangeText={onChangeText}
          className="flex-1 ml-2 text-black dark:text-white"
        />
        {value.length > 0 && (
          <TouchableOpacity onPress={handleClear} activeOpacity={0.7}>
            <Ionicons
              name="close-circle"
              size={20}
              color={isDark ? '#9ca3af' : '#6b7280'}
            />
          </TouchableOpacity>
        )}
      </View>
      {showFilterButton && onFilterPress ? (
        <TouchableOpacity
          onPress={onFilterPress}
          className={`w-12 h-12 rounded-full items-center justify-center ${
            (filterButtonBadge ?? 0) > 0 
              ? 'bg-primary' 
              : 'bg-gray-100 dark:bg-neutral-900'
          }`}
          activeOpacity={0.7}
        >
          <Ionicons
            name="options-outline"
            size={24}
            color={
              (filterButtonBadge ?? 0) > 0 
                ? '#fff' 
                : (isDark ? '#9ca3af' : '#6b7280')
            }
          />
          {(filterButtonBadge ?? 0) > 0 ? (
            <View className="absolute -top-1 -right-1 bg-red-500 rounded-full w-5 h-5 items-center justify-center">
              <CustomText className="text-xs text-white" weight="bold">
                {filterButtonBadge! > 9 ? '9+' : String(filterButtonBadge)}
              </CustomText>
            </View>
          ) : null}
        </TouchableOpacity>
      ) : null}
    </View>
  );
});

SearchBar.displayName = 'SearchBar';

