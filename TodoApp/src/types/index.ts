// User type
export interface User {
    uid: string;
    email: string;
    displayName?: string;
}

// Task type
export interface Task {
    id: string;
    userId: string;      // Which user owns this task
    title: string;
    description: string;
    dateTime: string;    // When task was created
    deadline: string;    // When task is due
    priority: 'low' | 'medium' | 'high';  // Only these 3 values allowed
    completed: boolean;
    category?: string;   // Optional: task category/tag
    createdAt: string;
    updatedAt: string;
}

// API response types
export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}

// Form data for creating/editing task
export interface TaskFormData {
    title: string;
    description: string;
    deadline: string;
    priority: 'low' | 'medium' | 'high';
    category?: string;
}