import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Task } from '../../types';

interface TaskState {
    tasks: Task[];
    loading: boolean;
    error: string | null;
    filter: 'all' | 'completed' | 'pending';
    sortBy: 'date' | 'priority' | 'deadline';
}

const initialState: TaskState = {
    tasks: [],
    loading: false,
    error: null,
    filter: 'all',
    sortBy: 'deadline',
};

const taskSlice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {
        // Set all tasks from API
        setTasks: (state, action: PayloadAction<Task[]>) => {
            state.tasks = action.payload;
            state.error = null;
        },

        // Add new task
        addTask: (state, action: PayloadAction<Task>) => {
            state.tasks.push(action.payload);
        },

        // Update existing task
        updateTask: (state, action: PayloadAction<Task>) => {
            const index = state.tasks.findIndex(t => t.id === action.payload.id);
            if (index !== -1) {
                state.tasks[index] = action.payload;
            }
        },

        // Delete task
        deleteTask: (state, action: PayloadAction<string>) => {
            state.tasks = state.tasks.filter(t => t.id !== action.payload);
        },

        // Set filter
        setFilter: (state, action: PayloadAction<'all' | 'completed' | 'pending'>) => {
            state.filter = action.payload;
        },

        // Set sort
        setSortBy: (state, action: PayloadAction<'date' | 'priority' | 'deadline'>) => {
            state.sortBy = action.payload;
        },

        // Set loading state
        setTaskLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
    },
});

export const {
    setTasks,
    addTask,
    updateTask,
    deleteTask,
    setFilter,
    setSortBy,
    setTaskLoading,
} = taskSlice.actions;

export default taskSlice.reducer;