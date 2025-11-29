import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
  id: string;
  name: string;
  username: string;
  status: string; // active, suspended, deleted
  createdAt: string;
  emailVerified?: boolean;
  phoneVerified?: boolean;
  hasActiveSubscription?: boolean;
}

/**
 * Device key pair for biometric authentication
 * - publicKey: Sent to server, stored in devices table
 * - privateKey: Stored only on client (Redux + AsyncStorage), never sent to server
 * - deviceId: Unique identifier for this device
 */
export interface DeviceKeyPair {
  publicKey: string;
  privateKey: string;
  deviceId: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  deviceKeyPair: DeviceKeyPair | null; // Device key pair for biometric auth
  isLoading: boolean;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  token: null,
  deviceKeyPair: null,
  isLoading: true,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (
      state,
      action: PayloadAction<{
        user: User;
        token: string;
        deviceKeyPair?: DeviceKeyPair;
      }>
    ) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      if (action.payload.deviceKeyPair) {
        state.deviceKeyPair = action.payload.deviceKeyPair;
      }
      state.isLoading = false;
    },
    logout: state => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.deviceKeyPair = null;
      state.isLoading = false;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    restoreUser: (
      state,
      action: PayloadAction<{
        user: User;
        token: string;
        deviceKeyPair?: DeviceKeyPair;
      }>
    ) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      if (action.payload.deviceKeyPair) {
        state.deviceKeyPair = action.payload.deviceKeyPair;
      }
      state.isLoading = false;
    },
    setDeviceKeyPair: (state, action: PayloadAction<DeviceKeyPair>) => {
      state.deviceKeyPair = action.payload;
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
  },
});

export const { login, logout, setLoading, restoreUser, setDeviceKeyPair, updateUser } =
  authSlice.actions;
export default authSlice.reducer;
