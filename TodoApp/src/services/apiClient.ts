import axios, { AxiosInstance } from 'axios';
import { getIdToken } from './firebaseAuth';

/**
 * API CLIENT SERVICE
 * Handles all HTTP requests to backend
 * Automatically adds Firebase token to requests
 */
class ApiClient {
    private client: AxiosInstance;
    private baseURL: string;

    constructor() {
        // Backend server URL
        this.baseURL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000';

        // Create axios instance
        this.client = axios.create({
            baseURL: this.baseURL,
            timeout: 10000,
        });

        // Add interceptor to attach Firebase token to every request
        this.client.interceptors.request.use(
            async (config) => {
                try {
                    // Get Firebase ID token
                    const token = await getIdToken();

                    if (token) {
                        // Add token to Authorization header
                        config.headers.Authorization = `Bearer ${token}`;
                    }

                    return config;
                } catch (error) {
                    console.error('Error getting token:', error);
                    return config;
                }
            },
            (error) => Promise.reject(error)
        );

        // Handle response errors
        this.client.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response?.status === 401) {
                    // Token expired or invalid
                    console.warn('Unauthorized - token may be expired');
                }
                return Promise.reject(error);
            }
        );
    }

    /**
     * CREATE TASK
     * POST /api/tasks
     */
    async createTask(taskData: {
        title: string;
        description: string;
        deadline: string;
        priority: 'low' | 'medium' | 'high';
        category?: string;
    }) {
        try {
            const response = await this.client.post('/api/tasks', taskData);
            return {
                success: true,
                data: response.data.data,
            };
        } catch (error: any) {
            return {
                success: false,
                error: error.response?.data?.error || 'Failed to create task',
            };
        }
    }

    /**
     * GET ALL TASKS
     * GET /api/tasks
     */
    async getTasks(filters?: {
        completed?: boolean;
        sortBy?: 'deadline' | 'priority' | 'date';
    }) {
        try {
            const params = new URLSearchParams();

            if (filters?.completed !== undefined) {
                params.append('completed', String(filters.completed));
            }

            if (filters?.sortBy) {
                params.append('sortBy', filters.sortBy);
            }

            const response = await this.client.get('/api/tasks', { params });

            return {
                success: true,
                data: response.data.data,
                count: response.data.count,
            };
        } catch (error: any) {
            return {
                success: false,
                error: error.response?.data?.error || 'Failed to fetch tasks',
                data: [],
            };
        }
    }

    /**
     * UPDATE TASK
     * PUT /api/tasks/:id
     */
    async updateTask(
        taskId: string,
        updates: {
            title?: string;
            description?: string;
            deadline?: string;
            priority?: 'low' | 'medium' | 'high';
            completed?: boolean;
            category?: string;
        }
    ) {
        try {
            const response = await this.client.put(`/api/tasks/${taskId}`, updates);

            return {
                success: true,
                data: response.data.data,
            };
        } catch (error: any) {
            return {
                success: false,
                error: error.response?.data?.error || 'Failed to update task',
            };
        }
    }

    /**
     * DELETE TASK
     * DELETE /api/tasks/:id
     */
    async deleteTask(taskId: string) {
        try {
            await this.client.delete(`/api/tasks/${taskId}`);

            return {
                success: true,
            };
        } catch (error: any) {
            return {
                success: false,
                error: error.response?.data?.error || 'Failed to delete task',
            };
        }
    }
}

// Export singleton instance
export const apiClient = new ApiClient();