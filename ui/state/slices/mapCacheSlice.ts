import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface MapCacheState {
  enabled: boolean;
  autoClearDays: number; // 0 = disabled, >0 = auto-clear after X days
}

const initialState: MapCacheState = {
  enabled: false, // Disabled by default - user must enable in settings
  autoClearDays: 7, // Default: auto-clear after 7 days
};

const STORAGE_KEY = '@mapCacheSettings';

// Load settings from AsyncStorage
export const loadMapCacheSettings = async (): Promise<MapCacheState> => {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading map cache settings:', error);
  }
  return initialState;
};

// Save settings to AsyncStorage
export const saveMapCacheSettings = async (settings: MapCacheState): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error('Error saving map cache settings:', error);
  }
};

const mapCacheSlice = createSlice({
  name: 'mapCache',
  initialState,
  reducers: {
    setEnabled: (state, action: PayloadAction<boolean>) => {
      state.enabled = action.payload;
      saveMapCacheSettings(state);
    },
    setAutoClearDays: (state, action: PayloadAction<number>) => {
      state.autoClearDays = action.payload;
      saveMapCacheSettings(state);
    },
    restoreSettings: (state, action: PayloadAction<MapCacheState>) => {
      state.enabled = action.payload.enabled;
      state.autoClearDays = action.payload.autoClearDays;
    },
  },
});

export const { setEnabled, setAutoClearDays, restoreSettings } = mapCacheSlice.actions;
export default mapCacheSlice.reducer;

