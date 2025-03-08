import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import { persistStore, persistReducer, PersistConfig } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer from '../features/auth/authSlice';
import todoReducer from '../features/todos/todoSlice';

// Define the root state type
export interface RootState {
  auth: ReturnType<typeof authReducer>;
  todos: ReturnType<typeof todoReducer>;
}

// Combine reducers
const rootReducer = combineReducers({
  auth: authReducer,
  todos: todoReducer,
});

// Persist config
const persistConfig: PersistConfig<RootState> = {
  key: 'my-react-ts-app', // Key for the persisted state in storage
  storage, // Use localStorage
  whitelist: ['auth', 'todos'], // Specify which reducers to persist (optional)
  // blacklist: ['todos'], // Optionally exclude specific reducers
};

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure the store
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types from redux-persist
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
//   devTools: process.env.NODE_ENV !== 'production',
});

// Export dispatch type
export type AppDispatch = typeof store.dispatch;

// Create persistor
export const persistor = persistStore(store);

export default store;