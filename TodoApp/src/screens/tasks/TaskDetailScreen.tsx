import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Alert,
    Platform,
} from 'react-native';
import { Text } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { toggleComplete, deleteTask, updateTask } from '../../redux/slices/taskSlice';
import { Colors, Spacing, Typography, Radii, Shadows, Layout } from '../../theme';
import AppButton from '../../components/AppButton';
import PriorityBadge from '../../components/PriorityBadge';
import { Task } from '../../types';

/**
 * TASK DETAIL SCREEN
 * Displays full task information with actions:
 * mark complete, edit (inline), delete (with confirmation).
 *
 * Receives taskId via route params, reads from Redux store.
 */
export default function TaskDetailScreen({ route, navigation }: any) {
    const { taskId } = route.params;
    const dispatch = useAppDispatch();
    const task = useAppSelector((state) =>
        state.tasks.tasks.find((t) => t.id === taskId)
    );

    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    // If task was deleted or not found, go back
    if (!task) {
        return (
            <View style={styles.container}>
                <View style={styles.notFound}>
                    <Text style={styles.notFoundText}>Task not found</Text>
                    <AppButton
                        title="Go Back"
                        onPress={() => navigation.goBack()}
                        variant="secondary"
                        fullWidth={false}
                    />
                </View>
            </View>
        );
    }

    const isOverdue = !task.completed && new Date(task.deadline) < new Date();

    // ── Date Formatting Helpers ──
    const formatFullDate = (dateStr: string): string => {
        return new Date(dateStr).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const formatRelativeDeadline = (dateStr: string): string => {
        const date = new Date(dateStr);
        const now = new Date();
        const diffMs = date.getTime() - now.getTime();
        const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

        if (task.completed) return 'Completed';
        if (diffDays < 0) return `${Math.abs(diffDays)} day(s) overdue`;
        if (diffDays === 0) return 'Due today';
        if (diffDays === 1) return 'Due tomorrow';
        return `${diffDays} days remaining`;
    };

    // ── Handlers ──
    const handleToggleComplete = () => {
        dispatch(toggleComplete(task.id));
    };

    const handleDelete = () => {
        if (Platform.OS === 'web') {
            // Web: use simple confirm
            setShowDeleteConfirm(true);
        } else {
            // Native: use Alert
            Alert.alert(
                'Delete Task',
                `Are you sure you want to delete "${task.title}"? This action cannot be undone.`,
                [
                    { text: 'Cancel', style: 'cancel' },
                    {
                        text: 'Delete',
                        style: 'destructive',
                        onPress: () => {
                            dispatch(deleteTask(task.id));
                            navigation.goBack();
                        },
                    },
                ]
            );
        }
    };

    const confirmDelete = () => {
        dispatch(deleteTask(task.id));
        navigation.goBack();
    };

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
        >
            {/* ── Status Banner ── */}
            <View style={[
                styles.statusBanner,
                task.completed ? styles.statusCompleted : isOverdue ? styles.statusOverdue : styles.statusPending,
            ]}>
                <Text style={styles.statusIcon}>
                    {task.completed ? '✓' : isOverdue ? '⚠' : '⏱'}
                </Text>
                <Text style={styles.statusText}>
                    {formatRelativeDeadline(task.deadline)}
                </Text>
            </View>

            {/* ── Title & Priority ── */}
            <View style={styles.titleSection}>
                <Text style={[
                    styles.title,
                    task.completed && styles.titleCompleted,
                ]}>
                    {task.title}
                </Text>
                <PriorityBadge priority={task.priority} />
            </View>

            {/* ── Description ── */}
            {task.description ? (
                <View style={styles.section}>
                    <Text style={styles.sectionLabel}>Description</Text>
                    <Text style={styles.descriptionText}>{task.description}</Text>
                </View>
            ) : null}

            {/* ── Details Grid ── */}
            <View style={styles.detailsCard}>
                <DetailRow
                    icon="📅"
                    label="Deadline"
                    value={formatFullDate(task.deadline)}
                    highlight={isOverdue}
                />
                <View style={styles.detailDivider} />

                {task.category ? (
                    <>
                        <DetailRow
                            icon="🏷️"
                            label="Category"
                            value={task.category}
                        />
                        <View style={styles.detailDivider} />
                    </>
                ) : null}

                <DetailRow
                    icon="📋"
                    label="Status"
                    value={task.completed ? 'Completed' : 'Pending'}
                />
                <View style={styles.detailDivider} />

                <DetailRow
                    icon="🕐"
                    label="Created"
                    value={formatFullDate(task.createdAt)}
                />

                {task.updatedAt !== task.createdAt && (
                    <>
                        <View style={styles.detailDivider} />
                        <DetailRow
                            icon="✏️"
                            label="Last Updated"
                            value={formatFullDate(task.updatedAt)}
                        />
                    </>
                )}
            </View>

            {/* ── Action Buttons ── */}
            <View style={styles.actions}>
                <AppButton
                    title={task.completed ? 'Mark as Pending' : 'Mark as Complete'}
                    onPress={handleToggleComplete}
                    variant={task.completed ? 'secondary' : 'primary'}
                    style={styles.actionButton}
                />

                <AppButton
                    title="Delete Task"
                    onPress={handleDelete}
                    variant="danger"
                    style={styles.actionButton}
                />
            </View>

            {/* ── Delete Confirmation (Web fallback) ── */}
            {showDeleteConfirm && (
                <View style={styles.confirmOverlay}>
                    <View style={styles.confirmCard}>
                        <Text style={styles.confirmTitle}>Delete Task?</Text>
                        <Text style={styles.confirmMessage}>
                            Are you sure you want to delete "{task.title}"?{'\n'}
                            This action cannot be undone.
                        </Text>
                        <View style={styles.confirmActions}>
                            <AppButton
                                title="Cancel"
                                onPress={() => setShowDeleteConfirm(false)}
                                variant="ghost"
                                fullWidth={false}
                            />
                            <AppButton
                                title="Delete"
                                onPress={confirmDelete}
                                variant="danger"
                                fullWidth={false}
                            />
                        </View>
                    </View>
                </View>
            )}
        </ScrollView>
    );
}

// ── Detail Row Sub-Component ──
function DetailRow({
    icon,
    label,
    value,
    highlight = false,
}: {
    icon: string;
    label: string;
    value: string;
    highlight?: boolean;
}) {
    return (
        <View style={detailStyles.row}>
            <Text style={detailStyles.icon}>{icon}</Text>
            <View style={detailStyles.content}>
                <Text style={detailStyles.label}>{label}</Text>
                <Text style={[
                    detailStyles.value,
                    highlight && detailStyles.valueHighlight,
                ]}>
                    {value}
                </Text>
            </View>
        </View>
    );
}

const detailStyles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        paddingVertical: Spacing.md,
        gap: Spacing.md,
    },
    icon: {
        fontSize: 18,
        marginTop: 2,
    },
    content: {
        flex: 1,
    },
    label: {
        ...Typography.small,
        color: Colors.textTertiary,
        marginBottom: 2,
    },
    value: {
        ...Typography.body,
        color: Colors.textPrimary,
    },
    valueHighlight: {
        color: Colors.error,
        fontWeight: '600',
    },
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    scrollContent: {
        padding: Layout.screenPaddingH,
        paddingBottom: Spacing.huge,
    },

    // ── Status Banner ──
    statusBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
        paddingHorizontal: Spacing.lg,
        paddingVertical: Spacing.md,
        borderRadius: Radii.md,
        marginBottom: Spacing.xl,
    },
    statusCompleted: {
        backgroundColor: Colors.successBg,
    },
    statusOverdue: {
        backgroundColor: Colors.errorBg,
    },
    statusPending: {
        backgroundColor: Colors.warningBg,
    },
    statusIcon: {
        fontSize: 16,
    },
    statusText: {
        ...Typography.captionMedium,
        color: Colors.textPrimary,
    },

    // ── Title ──
    titleSection: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: Spacing.md,
        marginBottom: Spacing.xl,
    },
    title: {
        ...Typography.h1,
        color: Colors.textPrimary,
        flex: 1,
    },
    titleCompleted: {
        textDecorationLine: 'line-through',
        color: Colors.textTertiary,
    },

    // ── Description Section ──
    section: {
        marginBottom: Spacing.xl,
    },
    sectionLabel: {
        ...Typography.small,
        color: Colors.textTertiary,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: Spacing.sm,
    },
    descriptionText: {
        ...Typography.body,
        color: Colors.textSecondary,
        lineHeight: 24,
    },

    // ── Details Card ──
    detailsCard: {
        backgroundColor: Colors.surface,
        borderRadius: Radii.lg,
        padding: Spacing.lg,
        marginBottom: Spacing.xxl,
        borderWidth: 1,
        borderColor: Colors.borderLight,
    },
    detailDivider: {
        height: 1,
        backgroundColor: Colors.borderLight,
    },

    // ── Actions ──
    actions: {
        gap: Spacing.md,
    },
    actionButton: {
        // Default styling from AppButton
    },

    // ── Not Found ──
    notFound: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: Spacing.xl,
    },
    notFoundText: {
        ...Typography.h3,
        color: Colors.textSecondary,
    },

    // ── Delete Confirmation (Web) ──
    confirmOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: Colors.overlay,
        justifyContent: 'center',
        alignItems: 'center',
        padding: Spacing.xxl,
    },
    confirmCard: {
        backgroundColor: Colors.surface,
        borderRadius: Radii.lg,
        padding: Spacing.xxl,
        maxWidth: 360,
        width: '100%',
        ...Shadows.lg,
    },
    confirmTitle: {
        ...Typography.h3,
        color: Colors.textPrimary,
        marginBottom: Spacing.sm,
    },
    confirmMessage: {
        ...Typography.body,
        color: Colors.textSecondary,
        marginBottom: Spacing.xl,
        lineHeight: 22,
    },
    confirmActions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: Spacing.md,
    },
});
