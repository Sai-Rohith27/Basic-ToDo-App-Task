import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import taskReducer from './slices/taskSlice';

// Combine slices into one store
export const store = configureStore({
    reducer: {
        auth: authReducer,      // authSlice reducers
        tasks: taskReducer,     // taskSlice reducers
    },
});

// Export types for using in components
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;