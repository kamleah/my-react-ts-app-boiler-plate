import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define the Auth state type
interface AuthState {
    user: string | null;
    access: string | null,
    refresh: string | null,
    userDetails: {
        user_role?: string;
        first_name?: string;
        last_name?: string;
        
    }
};

// Initial state
const initialState: AuthState = {
    user: "dummy@email.com",
    access: null,
    refresh: null,
    userDetails: {
        user_role: undefined,
    },
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        // Login action
        login(state, action: PayloadAction<{ user: string; access: string, refresh: string }>) {
            state.user = action.payload.user;
            state.access = action.payload.access;
            state.refresh = action.payload.refresh;
        },
        loggedUserDetails(state, action: PayloadAction<{ userDetails: {} }>) {
            state.userDetails = action.payload.userDetails;
        },
        // Logout action
        // logout(state) {
        //     state.user = null;
        //     state.access = null;
        //     state.refresh = null;
        //     state.userDetails = {
        //         user_role: undefined,
        //         first_name: undefined,
        //         last_name: undefined,
        //     };
        // },
        logout(state) {
            state.user = "dummy@email.com";
            state.access = "dummy@email.com";
            state.refresh = "dummy@email.com";
            state.userDetails = {
                user_role: "user",
                first_name: undefined,
                last_name: undefined,
            };
        },
    },
});

// Export actions
export const { login, logout, loggedUserDetails } = authSlice.actions;
export default authSlice.reducer;