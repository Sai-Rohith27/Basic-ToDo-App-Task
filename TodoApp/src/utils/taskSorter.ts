/**
 * TASK SORTER UTILITY
 * Pure function that filters and sorts tasks using the existing Redux state values.
 *
 * SMART ORDERING ALGORITHM:
 * 1. Overdue tasks first (most urgent)
 * 2. High priority
 * 3. Nearest deadline
 * 4. Medium priority
 * 5. Low priority
 * Completed tasks are always pushed to the bottom.
 */

import { Task } from '../types';

// Priority weight for sorting (higher = more important)
const PRIORITY_WEIGHT: Record<string, number> = {
    high: 3,
    medium: 2,
    low: 1,
};

/**
 * Filter tasks based on the current filter value.
 * Matches the Redux filter type: 'all' | 'completed' | 'pending'
 * Also supports 'overdue' as an additional filter.
 */
export function filterTasks(
    tasks: Task[],
    filter: 'all' | 'completed' | 'pending' | 'overdue'
): Task[] {
    const now = new Date();

    switch (filter) {
        case 'completed':
            return tasks.filter(t => t.completed);
        case 'pending':
            return tasks.filter(t => !t.completed);
        case 'overdue':
            return tasks.filter(t => !t.completed && new Date(t.deadline) < now);
        case 'all':
        default:
            return tasks;
    }
}

/**
 * Sort tasks based on the sort mode.
 * Matches the Redux sortBy type: 'date' | 'priority' | 'deadline'
 *
 * All sort modes push completed tasks to the bottom.
 * Within uncompleted tasks, overdue items come first.
 */
export function sortTasks(
    tasks: Task[],
    sortBy: 'date' | 'priority' | 'deadline'
): Task[] {
    const now = new Date();

    return [...tasks].sort((a, b) => {
        // RULE 1: Completed tasks always go to the bottom
        if (a.completed !== b.completed) {
            return a.completed ? 1 : -1;
        }

        // For uncompleted tasks, apply smart ordering
        if (!a.completed && !b.completed) {
            const aOverdue = new Date(a.deadline) < now;
            const bOverdue = new Date(b.deadline) < now;

            // RULE 2: Overdue tasks come first
            if (aOverdue !== bOverdue) {
                return aOverdue ? -1 : 1;
            }
        }

        // RULE 3: Apply the selected sort mode
        switch (sortBy) {
            case 'priority':
                // Higher priority first, then by deadline
                const priorityDiff = PRIORITY_WEIGHT[b.priority] - PRIORITY_WEIGHT[a.priority];
                if (priorityDiff !== 0) return priorityDiff;
                // Same priority → nearest deadline first
                return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();

            case 'deadline':
                // Nearest deadline first, then by priority
                const deadlineDiff = new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
                if (deadlineDiff !== 0) return deadlineDiff;
                // Same deadline → higher priority first
                return PRIORITY_WEIGHT[b.priority] - PRIORITY_WEIGHT[a.priority];

            case 'date':
                // Most recently created first
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();

            default:
                return 0;
        }
    });
}

/**
 * SMART SORT — combines filtering + sorting in one call.
 * This is the primary function screens should use.
 */
export function getProcessedTasks(
    tasks: Task[],
    filter: 'all' | 'completed' | 'pending' | 'overdue',
    sortBy: 'date' | 'priority' | 'deadline'
): Task[] {
    const filtered = filterTasks(tasks, filter);
    return sortTasks(filtered, sortBy);
}

/**
 * Get task statistics for the dashboard header.
 */
export function getTaskStats(tasks: Task[]) {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const pending = total - completed;
    const overdue = tasks.filter(
        t => !t.completed && new Date(t.deadline) < new Date()
    ).length;
    const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

    return { total, completed, pending, overdue, progress };
}
