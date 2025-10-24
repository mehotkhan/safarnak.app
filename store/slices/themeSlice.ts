import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeState {
  mode: ThemeMode;
  isDark: boolean;
}

const initialState: ThemeState = {
  mode: 'system',
  isDark: false,
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setThemeMode: (state, action: PayloadAction<ThemeMode>) => {
      state.mode = action.payload;
      // Update isDark based on mode
      if (action.payload === 'dark') {
        state.isDark = true;
      } else if (action.payload === 'light') {
        state.isDark = false;
      }
      // For 'system', we'll let the system decide
    },
    setDarkMode: (state, action: PayloadAction<boolean>) => {
      state.isDark = action.payload;
    },
    toggleTheme: state => {
      if (state.mode === 'system') {
        state.mode = 'light';
        state.isDark = false;
      } else if (state.mode === 'light') {
        state.mode = 'dark';
        state.isDark = true;
      } else {
        state.mode = 'light';
        state.isDark = false;
      }
    },
  },
});

export const { setThemeMode, setDarkMode, toggleTheme } = themeSlice.actions;
export default themeSlice.reducer;
