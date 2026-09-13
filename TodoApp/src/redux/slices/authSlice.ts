import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../../types';

// What auth state looks like
interface AuthState {
    user: User | null;
    loading: boolean;
    error: string | null;
    isAuthenticated: boolean;
}

// Initial state (start with)
const initialState: AuthState = {
    user: null,
    loading: false,
    error: null,
    isAuthenticated: false,
};

// Create the slice
const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        // When user starts login
        setAuthLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },

        // When login succeeds
        setUser: (state, action: PayloadAction<User>) => {
            state.user = action.payload;
            state.isAuthenticated = true;
            state.error = null;
            state.loading = false;
        },

        // When auth fails
        setAuthError: (state, action: PayloadAction<string>) => {
            state.error = action.payload;
            state.loading = false;
        },

        // When user logs out
        clearAuth: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.error = null;
        },
    },
});

export const { setAuthLoading, setUser, setAuthError, clearAuth } = authSlice.actions;
export default authSlice.reducer;