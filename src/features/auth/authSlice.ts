import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define the Auth state type
interface AuthState {
    user: string | null;
    token: string | null;
};

// Initial state
const initialState: AuthState = {
    user: null,
    token: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        // Login action
        login(state, action: PayloadAction<{ user: string; token: string }>) {
            state.user = action.payload.user;
            state.token = action.payload.token;
        },
        // Logout action
        logout(state) {
            state.user = null;
            state.token = null;
        },
    },
});

// Export actions
export const { login, logout } = authSlice.actions;
export default authSlice.reducer;