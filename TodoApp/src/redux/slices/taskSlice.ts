import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Task } from '../../types';
import { apiClient } from '../../services/apiClient';

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

/**
 * ASYNC THUNK: Fetch all tasks
 * Called when: Component loads, or user refreshes
 */
export const fetchTasks = createAsyncThunk(
    'tasks/fetchTasks',
    async (_, { rejectWithValue }) => {
        try {
            const result = await apiClient.getTasks({
                sortBy: 'deadline',
            });

            if (!result.success) {
                return rejectWithValue(result.error);
            }

            return result.data;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

/**
 * ASYNC THUNK: Create new task
 * Called when: User submits add task form
 */
export const createTask = createAsyncThunk(
    'tasks/createTask',
    async (
        taskData: {
            title: string;
            description: string;
            deadline: string;
            priority: 'low' | 'medium' | 'high';
            category?: string;
        },
        { rejectWithValue }
    ) => {
        try {
            const result = await apiClient.createTask(taskData);

            if (!result.success) {
                return rejectWithValue(result.error);
            }

            return result.data;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

/**
 * ASYNC THUNK: Update task
 * Called when: User edits task or marks complete
 */
export const updateTask = createAsyncThunk(
    'tasks/updateTask',
    async (
        {
            taskId,
            updates,
        }: {
            taskId: string;
            updates: {
                title?: string;
                description?: string;
                deadline?: string;
                priority?: 'low' | 'medium' | 'high';
                completed?: boolean;
                category?: string;
            };
        },
        { rejectWithValue }
    ) => {
        try {
            const result = await apiClient.updateTask(taskId, updates);

            if (!result.success) {
                return rejectWithValue(result.error);
            }

            return result.data;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

/**
 * ASYNC THUNK: Delete task
 * Called when: User deletes task
 */
export const deleteTask = createAsyncThunk(
    'tasks/deleteTask',
    async (taskId: string, { rejectWithValue }) => {
        try {
            const result = await apiClient.deleteTask(taskId);

            if (!result.success) {
                return rejectWithValue(result.error);
            }

            return taskId; // Return ID so we know which task to remove
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

/**
 * TASK SLICE
 * Redux slice for task state management
 */
const taskSlice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {
        // Synchronous actions (don't call API)
        setFilter: (state, action: PayloadAction<'all' | 'completed' | 'pending'>) => {
            state.filter = action.payload;
        },
        setSortBy: (state, action: PayloadAction<'date' | 'priority' | 'deadline'>) => {
            state.sortBy = action.payload;
        },
    },
    extraReducers: (builder) => {
        // FETCH TASKS
        builder
            .addCase(fetchTasks.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTasks.fulfilled, (state, action) => {
                state.loading = false;
                state.tasks = action.payload;
            })
            .addCase(fetchTasks.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });

        // CREATE TASK
        builder
            .addCase(createTask.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createTask.fulfilled, (state, action) => {
                state.loading = false;
                state.tasks.push(action.payload);
            })
            .addCase(createTask.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });

        // UPDATE TASK
        builder
            .addCase(updateTask.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateTask.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.tasks.findIndex(
                    (t) => t.id === action.payload.id
                );
                if (index !== -1) {
                    state.tasks[index] = action.payload;
                }
            })
            .addCase(updateTask.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });

        // DELETE TASK
        builder
            .addCase(deleteTask.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteTask.fulfilled, (state, action) => {
                state.loading = false;
                state.tasks = state.tasks.filter((t) => t.id !== action.payload);
            })
            .addCase(deleteTask.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { setFilter, setSortBy } = taskSlice.actions;
export default taskSlice.reducer;