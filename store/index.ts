import AsyncStorage from '@react-native-async-storage/async-storage';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';

import authReducer from './slices/authSlice';
import themeReducer from './slices/themeSlice';
import mapCacheReducer from './slices/mapCacheSlice';
import { offlineMiddleware } from './middleware/offlineMiddleware';

// Web-compatible storage
const storage = typeof window !== 'undefined' ? AsyncStorage : AsyncStorage;

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'theme', 'mapCache'], // Persist auth, theme, and mapCache slices
};

const rootReducer = combineReducers({
  auth: authReducer,
  theme: themeReducer,
  mapCache: mapCacheReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE', 'persist/PURGE'],
      },
    }).concat(offlineMiddleware),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
