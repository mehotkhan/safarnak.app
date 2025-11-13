import { useEffect, useState } from 'react';
import { Platform, Keyboard } from 'react-native';
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
    let cleanup: (() => void) | undefined;
    let mounted = true;

    (async () => {
      try {
        // Dynamically import to avoid bundling errors in Expo Go
        const mod = await import('react-native-avoid-softinput');
        const AvoidSoftInput = (mod as any)?.AvoidSoftInput;

        if (mounted && AvoidSoftInput?.setEnabled) {
          AvoidSoftInput.setEnabled(true);
          if (Platform.OS === 'android' && AvoidSoftInput?.setAdjustResize) {
            AvoidSoftInput.setAdjustResize();
          }

          const shownSub = AvoidSoftInput.onSoftInputShown?.(({ softInputHeight }: any) => {
            const height = softInputHeight ?? 0;
            keyboardHeight.value = withTiming(height, { duration: 180 });
            setKeyboardHeightState(height);
            setKeyboardVisible(true);
          });

          const hiddenSub = AvoidSoftInput.onSoftInputHidden?.(() => {
            keyboardHeight.value = withTiming(0, { duration: 180 });
            setKeyboardHeightState(0);
            setKeyboardVisible(false);
          });

          cleanup = () => {
            try {
              AvoidSoftInput?.setEnabled?.(false);
              shownSub?.remove?.();
              hiddenSub?.remove?.();
            } catch {
              // ignore
            }
          };
          return;
        }
      } catch {
        // Fallback to JS events
      }

      // Fallback: JS keyboard events (works in Expo Go)
      const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
      const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

      const showSubscription = Keyboard.addListener(showEvent, (e) => {
        const height = e?.endCoordinates?.height ?? 0;
        keyboardHeight.value = withTiming(height, { duration: 180 });
        setKeyboardHeightState(height);
        setKeyboardVisible(true);
      });
      const hideSubscription = Keyboard.addListener(hideEvent, () => {
        keyboardHeight.value = withTiming(0, { duration: 180 });
        setKeyboardHeightState(0);
        setKeyboardVisible(false);
      });

      cleanup = () => {
        showSubscription?.remove?.();
        hideSubscription?.remove?.();
      };
    })();

    return () => {
      mounted = false;
      cleanup?.();
    };
  }, [keyboardHeight]);

  return {
    keyboardHeight,
    keyboardHeightState,
    keyboardVisible,
  };
}


