import { createContext, ReactNode, useContext, useEffect } from 'react';
import { Appearance, useColorScheme as useSystemColorScheme } from 'react-native';

import { useAppDispatch, useAppSelector } from '@state/hooks';
import {
  setDarkMode,
  setThemeMode,
  ThemeMode,
  toggleTheme,
} from '@state/slices/themeSlice';

interface ThemeContextType {
  isDark: boolean;
  themeMode: ThemeMode;
  toggleTheme: () => void;
  setThemeMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const dispatch = useAppDispatch();
  const { isDark, mode: themeMode } = useAppSelector(state => state.theme);
  const systemColorScheme = useSystemColorScheme();

  // Sync React Native Appearance color scheme with Redux theme state
  // NativeWind v4 automatically responds to Appearance.setColorScheme changes
  useEffect(() => {
    Appearance.setColorScheme(isDark ? 'dark' : 'light');
  }, [isDark]);

  // Update theme based on system preference when mode is 'system'
  useEffect(() => {
    if (themeMode === 'system') {
      dispatch(setDarkMode(systemColorScheme === 'dark'));
    }
  }, [themeMode, systemColorScheme, dispatch]);

  const handleToggleTheme = () => {
    dispatch(toggleTheme());
  };

  const handleSetThemeMode = (mode: ThemeMode) => {
    dispatch(setThemeMode(mode));
  };

  const value: ThemeContextType = {
    isDark,
    themeMode,
    toggleTheme: handleToggleTheme,
    setThemeMode: handleSetThemeMode,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
