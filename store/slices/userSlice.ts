import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  isAuthenticated: boolean;
  userName: string | null;
  isLoading: boolean;
}

const initialState: UserState = {
  isAuthenticated: false,
  userName: null,
  isLoading: true,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<string>) => {
      state.isAuthenticated = true;
      state.userName = action.payload;
      state.isLoading = false;
    },
    logout: state => {
      state.isAuthenticated = false;
      state.userName = null;
      state.isLoading = false;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    restoreUser: (state, action: PayloadAction<{ userName: string }>) => {
      state.isAuthenticated = true;
      state.userName = action.payload.userName;
      state.isLoading = false;
    },
  },
});

export const { login, logout, setLoading, restoreUser } = userSlice.actions;
export default userSlice.reducer;
