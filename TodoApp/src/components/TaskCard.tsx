import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Task } from '../types';
import { useTheme, Spacing, Radii, Typography, Shadows } from '../theme';
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
 * Includes subtle left border accent for priority and animated checkbox.
 */
export default function TaskCard({ task, onPress, onToggleComplete }: TaskCardProps) {
    const { colors } = useTheme();
    const isOverdue = !task.completed && new Date(task.deadline) < new Date();
    const scaleAnim = React.useRef(new Animated.Value(1)).current;

    // Micro-interaction: scale on card press
    const handlePressIn = () => {
        Animated.spring(scaleAnim, {
            toValue: 0.98,
            useNativeDriver: true,
            speed: 50,
            bounciness: 4,
        }).start();
    };
    const handlePressOut = () => {
        Animated.spring(scaleAnim, {
            toValue: 1,
            useNativeDriver: true,
            speed: 50,
            bounciness: 4,
        }).start();
    };

    // Priority accent color for left border
    const priorityAccent =
        task.priority === 'high' ? colors.priorityHigh
        : task.priority === 'medium' ? colors.priorityMedium
        : colors.priorityLow;

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
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <TouchableOpacity
                onPress={onPress}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                activeOpacity={0.9}
                accessibilityRole="button"
                accessibilityLabel={`Task: ${task.title}. ${task.completed ? 'Completed' : 'Pending'}. Priority: ${task.priority}`}
                style={[
                    styles.card,
                    {
                        backgroundColor: task.completed ? colors.surfaceAlt : colors.surface,
                        borderColor: colors.borderLight,
                        borderLeftColor: priorityAccent,
                        opacity: task.completed ? 0.7 : 1,
                    },
                ]}
            >
                {/* Checkbox */}
                <TouchableOpacity
                    onPress={onToggleComplete}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    style={styles.checkboxArea}
                    accessibilityRole="checkbox"
                    accessibilityState={{ checked: task.completed }}
                    accessibilityLabel={`Mark ${task.title} as ${task.completed ? 'pending' : 'complete'}`}
                >
                    <View style={[
                        styles.checkbox,
                        {
                            borderColor: task.completed ? colors.primary : colors.border,
                            backgroundColor: task.completed ? colors.primary : 'transparent',
                        },
                    ]}>
                        {task.completed && (
                            <Text style={[styles.checkmark, { color: colors.white }]}>✓</Text>
                        )}
                    </View>
                </TouchableOpacity>

                {/* Content */}
                <View style={styles.content}>
                    {/* Top row: title + priority */}
                    <View style={styles.titleRow}>
                        <Text
                            style={[
                                styles.title,
                                { color: task.completed ? colors.textTertiary : colors.textPrimary },
                                task.completed && styles.titleCompleted,
                            ]}
                            numberOfLines={1}
                        >
                            {task.title}
                        </Text>
                        <PriorityBadge priority={task.priority} size="small" />
                    </View>

                    {/* Description snippet */}
                    {task.description ? (
                        <Text
                            style={[
                                styles.description,
                                { color: task.completed ? colors.textTertiary : colors.textSecondary },
                            ]}
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
                                {
                                    color: isOverdue ? colors.error : colors.textTertiary,
                                    fontWeight: isOverdue ? '600' : '500',
                                },
                            ]}>
                                {formatDeadline(task.deadline)}
                            </Text>
                        </View>
                        {task.category ? (
                            <View style={[styles.categoryChip, { backgroundColor: colors.primaryBg }]}>
                                <Text style={[styles.categoryText, { color: colors.primary }]}>
                                    {task.category}
                                </Text>
                            </View>
                        ) : null}
                    </View>
                </View>
            </TouchableOpacity>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        borderRadius: Radii.md,
        padding: Spacing.md,
        marginBottom: Spacing.sm,
        borderWidth: 1,
        borderLeftWidth: 3,
        ...Shadows.sm,
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
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkmark: {
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
        flex: 1,
    },
    titleCompleted: {
        textDecorationLine: 'line-through',
    },
    description: {
        ...Typography.caption,
        marginBottom: Spacing.sm,
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
    },
    categoryChip: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: Radii.full,
    },
    categoryText: {
        ...Typography.small,
    },
});
