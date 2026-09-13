import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { IconButton } from 'react-native-paper';
import { Task } from '../types';
import { Colors, Spacing, Radii, Typography, Shadows } from '../theme';
import PriorityBadge from './PriorityBadge';

interface TaskCardProps {
    task: Task;
    onPress: () => void;          // Navigate to detail
    onToggleComplete: () => void;  // Toggle checkbox
}

/**
 * TASK CARD
 * Compact, information-rich task row for the task list.
 * Shows: checkbox, title, description snippet, priority, deadline, category.
 */
export default function TaskCard({ task, onPress, onToggleComplete }: TaskCardProps) {
    const isOverdue = !task.completed && new Date(task.deadline) < new Date();

    // Format deadline for display
    const formatDeadline = (dateStr: string): string => {
        const date = new Date(dateStr);
        const now = new Date();
        const diffMs = date.getTime() - now.getTime();
        const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

        if (diffDays < 0) return `${Math.abs(diffDays)}d overdue`;
        if (diffDays === 0) return 'Due today';
        if (diffDays === 1) return 'Due tomorrow';
        if (diffDays <= 7) return `Due in ${diffDays}d`;

        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
        });
    };

    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.7}
            style={[styles.card, task.completed && styles.cardCompleted]}
        >
            {/* Checkbox */}
            <TouchableOpacity
                onPress={onToggleComplete}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                style={styles.checkboxArea}
            >
                <View style={[
                    styles.checkbox,
                    task.completed && styles.checkboxChecked,
                ]}>
                    {task.completed && (
                        <Text style={styles.checkmark}>✓</Text>
                    )}
                </View>
            </TouchableOpacity>

            {/* Content */}
            <View style={styles.content}>
                {/* Top row: title + priority */}
                <View style={styles.titleRow}>
                    <Text
                        style={[styles.title, task.completed && styles.titleCompleted]}
                        numberOfLines={1}
                    >
                        {task.title}
                    </Text>
                    <PriorityBadge priority={task.priority} size="small" />
                </View>

                {/* Description snippet */}
                {task.description ? (
                    <Text
                        style={[styles.description, task.completed && styles.textCompleted]}
                        numberOfLines={1}
                    >
                        {task.description}
                    </Text>
                ) : null}

                {/* Bottom row: deadline + category */}
                <View style={styles.metaRow}>
                    <View style={styles.metaItem}>
                        <Text style={styles.metaIcon}>🕐</Text>
                        <Text style={[
                            styles.metaText,
                            isOverdue && styles.overdueText,
                        ]}>
                            {formatDeadline(task.deadline)}
                        </Text>
                    </View>
                    {task.category ? (
                        <View style={styles.categoryChip}>
                            <Text style={styles.categoryText}>{task.category}</Text>
                        </View>
                    ) : null}
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: Colors.surface,
        borderRadius: Radii.md,
        padding: Spacing.md,
        marginBottom: Spacing.sm,
        borderWidth: 1,
        borderColor: Colors.borderLight,
        ...Shadows.sm,
    },
    cardCompleted: {
        opacity: 0.65,
        backgroundColor: Colors.surfaceAlt,
    },
    checkboxArea: {
        paddingRight: Spacing.md,
        paddingTop: 2,
    },
    checkbox: {
        width: 22,
        height: 22,
        borderRadius: 6,
        borderWidth: 2,
        borderColor: Colors.border,
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkboxChecked: {
        backgroundColor: Colors.primary,
        borderColor: Colors.primary,
    },
    checkmark: {
        color: Colors.white,
        fontSize: 12,
        fontWeight: '700',
    },
    content: {
        flex: 1,
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: Spacing.sm,
        marginBottom: 2,
    },
    title: {
        ...Typography.bodyMedium,
        color: Colors.textPrimary,
        flex: 1,
    },
    titleCompleted: {
        textDecorationLine: 'line-through',
        color: Colors.textTertiary,
    },
    description: {
        ...Typography.caption,
        color: Colors.textSecondary,
        marginBottom: Spacing.sm,
    },
    textCompleted: {
        color: Colors.textTertiary,
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.md,
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    metaIcon: {
        fontSize: 12,
    },
    metaText: {
        ...Typography.small,
        color: Colors.textTertiary,
    },
    overdueText: {
        color: Colors.error,
        fontWeight: '600',
    },
    categoryChip: {
        backgroundColor: Colors.primaryBg,
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: Radii.full,
    },
    categoryText: {
        ...Typography.small,
        color: Colors.primary,
    },
});
