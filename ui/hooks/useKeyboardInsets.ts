import { useEffect, useState } from 'react';
import { Keyboard, Platform } from 'react-native';
import { useSharedValue, withTiming, type SharedValue } from 'react-native-reanimated';

export interface KeyboardInsets {
  keyboardHeight: SharedValue<number>;
  keyboardHeightState: number;
  keyboardVisible: boolean;
}

export function useKeyboardInsets(): KeyboardInsets {
  const keyboardHeight = useSharedValue(0);
  const [keyboardHeightState, setKeyboardHeightState] = useState(0);
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const showSubscription = Keyboard.addListener(showEvent, (event) => {
      const height = event.endCoordinates?.height ?? 0;
      keyboardHeight.value = withTiming(height, { duration: 200 });
      setKeyboardHeightState(height);
      setKeyboardVisible(true);
    });

    const hideSubscription = Keyboard.addListener(hideEvent, () => {
      keyboardHeight.value = withTiming(0, { duration: 200 });
      setKeyboardHeightState(0);
      setKeyboardVisible(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, [keyboardHeight]);

  return {
    keyboardHeight,
    keyboardHeightState,
    keyboardVisible,
  };
}


