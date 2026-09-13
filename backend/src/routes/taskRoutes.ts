import { Router } from 'express';
import {
    createTask,
    getTasks,
    updateTask,
    deleteTask,
} from '../controllers/taskController';
import { verifyToken } from '../middleware/authMiddleware';

/**
 * ROUTES FOR TASKS
 * All routes require authentication (verifyToken)
 */
const router = Router();

/**
 * POST /api/tasks
 * Create new task
 * Body: { title, description, deadline, priority, category }
 */
router.post('/', verifyToken, createTask);

/**
 * GET /api/tasks
 * Get all tasks for logged-in user
 * Query params: completed (true/false), sortBy (deadline/priority/date)
 */
router.get('/', verifyToken, getTasks);

/**
 * PUT /api/tasks/:id
 * Update specific task
 * Body: { title, description, deadline, priority, completed, category }
 */
router.put('/:id', verifyToken, updateTask);

/**
 * DELETE /api/tasks/:id
 * Delete specific task
 */
router.delete('/:id', verifyToken, deleteTask);

export default router;