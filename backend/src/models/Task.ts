import mongoose, { Schema, Document } from 'mongoose';

/**
 * TASK INTERFACE
 * Defines what fields a Task has
 */
export interface ITask extends Document {
    userId: string;                    // Firebase user ID (who owns task)
    title: string;
    description: string;
    dateTime: Date;                    // When task was created
    deadline: Date;                    // When task is due
    priority: 'low' | 'medium' | 'high';
    completed: boolean;
    category?: string;                 // Optional category/tag
    createdAt: Date;
    updatedAt: Date;
}

/**
 * TASK SCHEMA
 * Database structure for tasks
 */
const taskSchema = new Schema<ITask>(
    {
        userId: {
            type: String,
            required: true,
            index: true,                   // Index for faster queries
        },
        title: {
            type: String,
            required: [true, 'Title is required'],
            trim: true,
            maxlength: [100, 'Title cannot exceed 100 characters'],
        },
        description: {
            type: String,
            trim: true,
            maxlength: [500, 'Description cannot exceed 500 characters'],
        },
        dateTime: {
            type: Date,
            default: () => new Date(),
        },
        deadline: {
            type: Date,
            required: [true, 'Deadline is required'],
        },
        priority: {
            type: String,
            enum: ['low', 'medium', 'high'],
            default: 'medium',
        },
        completed: {
            type: Boolean,
            default: false,
            index: true,                   // Index for filtering
        },
        category: {
            type: String,
            trim: true,
        },
    },
    {
        timestamps: true,                // Auto createdAt & updatedAt
    }
);

/**
 * Create and export Task model
 */
export const Task = mongoose.model<ITask>('Task', taskSchema);