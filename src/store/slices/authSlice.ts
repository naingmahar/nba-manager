// store/slices/authSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthState } from '@/types'; // Import the interface

export interface IAuth {
  username: string;
  password: string;
}

const initialState: AuthState = { // Apply type to initialState
  isAuthenticated: false,
  username: null,
  password: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Use PayloadAction to type the action's payload
    login: (state, action: PayloadAction<IAuth>) => {
      state.isAuthenticated = true;
      state.username = action.payload.username;
      state.password = action.payload.password;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.username = null;
      state.password = null;
    },
    resetAppState: (state) => { /* Nothing to do here */ }
  },
});

export const { login, logout,resetAppState } = authSlice.actions;
export default authSlice.reducer;