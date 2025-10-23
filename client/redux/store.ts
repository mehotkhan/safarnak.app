import AsyncStorage from '@react-native-async-storage/async-storage';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import { offlineMiddleware } from './offlineMiddleware';

import themeReducer from '../store/slices/themeSlice';
import authReducer from './authSlice';

// Web-compatible storage
const storage = typeof window !== 'undefined' ? AsyncStorage : AsyncStorage;

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'theme'], // Persist auth and theme slices
};

const rootReducer = combineReducers({
  auth: authReducer,
  theme: themeReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }).concat(offlineMiddleware),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
