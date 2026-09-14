import { Request, Response } from 'express';
import { Task, ITask } from '../models/Task';

/**
 * CREATE TASK
 * POST /api/tasks
 */
export const createTask = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const userId = req.userId;

        if (!userId) {
            res.status(401).json({
                success: false,
                error: 'User ID not found',
            });
            return;
        }

        // Get task data from request body
        const {
            title,
            description,
            deadline,
            priority,
            category,
        } = req.body;

        // Validate required fields
        if (!title || !deadline) {
            res.status(400).json({
                success: false,
                error: 'Title and deadline are required',
            });
            return;
        }

        // Create new task
        const task = new Task({
            userId,
            title,
            description,
            deadline: new Date(deadline),
            priority: priority || 'medium',
            category,
            completed: false,
        });

        // Save to MongoDB
        await task.save();

        // Return success response
        res.status(201).json({
            success: true,
            message: 'Task created successfully',
            data: task,
        });
    } catch (error: any) {
        console.error('Create task error:', error);

        res.status(500).json({
            success: false,
            error: error.message || 'Failed to create task',
        });
    }
};

/**
 * GET ALL TASKS FOR USER
 * GET /api/tasks
 */
export const getTasks = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const userId = req.userId;

        if (!userId) {
            res.status(401).json({
                success: false,
                error: 'User ID not found',
            });
            return;
        }

        // Get filter from query params
        const { completed, sortBy } = req.query;

        // Build filter object
        let filter: any = { userId };

        // If completed filter is specified
        if (completed !== undefined) {
            filter.completed = completed === 'true';
        }

        // Get tasks from MongoDB
        let query = Task.find(filter);

        // Apply sorting
        if (sortBy === 'deadline') {
            query = query.sort({ deadline: 1 });  // Earliest deadline first
        } else if (sortBy === 'priority') {
            // Priority sorting: high > medium > low
            const priorityOrder = { high: 1, medium: 2, low: 3 };
            query = query.sort({
                priority: 1,  // Sort by priority value
            });
        } else {
            query = query.sort({ createdAt: -1 });  // Newest first
        }

        const tasks = await query.exec();

        res.status(200).json({
            success: true,
            data: tasks,
            count: tasks.length,
        });
    } catch (error: any) {
        console.error('Get tasks error:', error);

        res.status(500).json({
            success: false,
            error: error.message || 'Failed to get tasks',
        });
    }
};

/**
 * UPDATE TASK
 * PUT /api/tasks/:id
 */
export const updateTask = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const userId = req.userId;
        const taskId = req.params.id;

        if (!userId) {
            res.status(401).json({
                success: false,
                error: 'User ID not found',
            });
            return;
        }

        if (!taskId) {
            res.status(400).json({
                success: false,
                error: 'Task ID is required',
            });
            return;
        }

        // Find task and verify ownership
        const task = await Task.findOne({
            _id: taskId,
            userId,
        });

        if (!task) {
            res.status(404).json({
                success: false,
                error: `Task not found. Searching for _id: ${taskId}, userId: ${userId}`,
            });
            return;
        }

        // Get update data from request body
        const {
            title,
            description,
            deadline,
            priority,
            completed,
            category,
        } = req.body;

        // Update fields if provided
        if (title) task.title = title;
        if (description) task.description = description;
        if (deadline) task.deadline = new Date(deadline);
        if (priority) task.priority = priority;
        if (typeof completed === 'boolean') task.completed = completed;
        if (category) task.category = category;

        // Save changes
        await task.save();

        res.status(200).json({
            success: true,
            message: 'Task updated successfully',
            data: task,
        });
    } catch (error: any) {
        console.error('Update task error:', error);

        res.status(500).json({
            success: false,
            error: error.message || 'Failed to update task',
        });
    }
};

/**
 * DELETE TASK
 * DELETE /api/tasks/:id
 */
export const deleteTask = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const userId = req.userId;
        const taskId = req.params.id;

        if (!userId) {
            res.status(401).json({
                success: false,
                error: 'User ID not found',
            });
            return;
        }

        if (!taskId) {
            res.status(400).json({
                success: false,
                error: 'Task ID is required',
            });
            return;
        }

        // Find and delete task (verify ownership)
        const result = await Task.findOneAndDelete({
            _id: taskId,
            userId,
        });

        if (!result) {
            res.status(404).json({
                success: false,
                error: 'Task not found',
            });
            return;
        }

        res.status(200).json({
            success: true,
            message: 'Task deleted successfully',
        });
    } catch (error: any) {
        console.error('Delete task error:', error);

        res.status(500).json({
            success: false,
            error: error.message || 'Failed to delete task',
        });
    }
};