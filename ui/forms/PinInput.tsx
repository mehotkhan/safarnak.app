import React, { useRef, useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import { CustomText } from '@ui/display';

interface PinInputProps {
  length?: number;
  value: string;
  onChangeText: (value: string) => void;
  label?: string;
  error?: string;
  disabled?: boolean;
  autoFocus?: boolean;
  className?: string;
}

export default function PinInput({
  length = 6,
  value,
  onChangeText,
  label,
  error,
  disabled = false,
  autoFocus = false,
  className = '',
}: PinInputProps) {
  const [focusedIndex, setFocusedIndex] = useState<number | null>(autoFocus ? 0 : null);
  const inputRefs = useRef<(TextInput | null)[]>([]);

  // Initialize refs array
  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, length);
  }, [length]);

  // Auto-focus first input when autoFocus is true
  useEffect(() => {
    if (autoFocus && inputRefs.current[0]) {
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 100);
    }
  }, [autoFocus]);

  // Sync value with inputs
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;

    if (value.length < length && value.length > 0) {
      timer = setTimeout(() => {
        setFocusedIndex(value.length);
        inputRefs.current[value.length]?.focus();
      }, 50);
    } else if (value.length === length) {
      timer = setTimeout(() => {
        setFocusedIndex(null);
        inputRefs.current[length - 1]?.blur();
      }, 0);
    }

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [value, length]);

  const handleChangeText = (text: string, index: number) => {
    // Only allow digits
    const digit = text.replace(/[^0-9]/g, '');
    
    if (digit.length > 1) {
      // Handle paste: fill multiple inputs
      const newValue = value.split('');
      for (let i = 0; i < Math.min(digit.length, length - index); i++) {
        if (index + i < length) {
          newValue[index + i] = digit[i];
        }
      }
      onChangeText(newValue.join('').slice(0, length));
      
      // Focus the next empty input or the last one
      const nextIndex = Math.min(index + digit.length, length - 1);
      setFocusedIndex(nextIndex);
      setTimeout(() => {
        inputRefs.current[nextIndex]?.focus();
      }, 50);
    } else if (digit.length === 1) {
      // Single digit input
      const newValue = value.split('');
      newValue[index] = digit;
      onChangeText(newValue.join('').slice(0, length));
      
      // Move to next input
      if (index < length - 1) {
        setFocusedIndex(index + 1);
        setTimeout(() => {
          inputRefs.current[index + 1]?.focus();
        }, 50);
      } else {
        // Last input filled, blur
        setFocusedIndex(null);
        inputRefs.current[index]?.blur();
      }
    } else {
      // Empty input (backspace)
      const newValue = value.split('');
      newValue[index] = '';
      onChangeText(newValue.join(''));
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !value[index] && index > 0) {
      // If current input is empty and backspace is pressed, go to previous input
      setFocusedIndex(index - 1);
      setTimeout(() => {
        inputRefs.current[index - 1]?.focus();
      }, 50);
    }
  };

  const handleFocus = (index: number) => {
    setFocusedIndex(index);
  };

  const handleBlur = () => {
    setFocusedIndex(null);
  };

  const handleBoxPress = (index: number) => {
    if (!disabled) {
      setFocusedIndex(index);
      inputRefs.current[index]?.focus();
    }
  };

  return (
    <View className={`w-full ${className}`}>
      {label && (
        <CustomText className="text-base text-black dark:text-white mb-3">
          {label}
        </CustomText>
      )}
      
      <View className="flex-row justify-between gap-2">
        {Array.from({ length }).map((_, index) => {
          const digit = value[index] || '';
          const isFocused = focusedIndex === index;
          const hasValue = !!digit;

          return (
            <TouchableOpacity
              key={index}
              onPress={() => handleBoxPress(index)}
              activeOpacity={0.7}
              disabled={disabled}
              className="flex-1"
            >
              <View
                className={`
                  h-14 rounded-xl border-2 items-center justify-center
                  ${isFocused 
                    ? 'border-primary bg-primary/5 dark:bg-primary/10' 
                    : hasValue
                    ? 'border-gray-300 dark:border-neutral-600 bg-gray-50 dark:bg-neutral-800'
                    : 'border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900'
                  }
                  ${error ? 'border-red-500' : ''}
                  ${disabled ? 'opacity-50' : ''}
                `}
              >
                <TextInput
                  ref={(ref) => {
                    inputRefs.current[index] = ref;
                  }}
                  value={digit}
                  onChangeText={(text) => handleChangeText(text, index)}
                  onKeyPress={(e) => handleKeyPress(e, index)}
                  onFocus={() => handleFocus(index)}
                  onBlur={handleBlur}
                  keyboardType="number-pad"
                  maxLength={1}
                  editable={!disabled}
                  selectTextOnFocus
                  className="text-2xl font-bold text-black dark:text-white text-center w-full h-full"
                  style={{
                    textAlign: 'center',
                    fontSize: 24,
                    fontWeight: 'bold',
                  }}
                />
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {error && (
        <CustomText className="text-sm text-red-500 mt-2">
          {error}
        </CustomText>
      )}
    </View>
  );
}

