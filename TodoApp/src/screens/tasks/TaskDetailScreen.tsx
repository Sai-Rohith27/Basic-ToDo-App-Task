import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    ScrollView,
    Alert,
    Platform,
} from 'react-native';
import { Text, IconButton } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { toggleComplete, deleteTask } from '../../redux/slices/taskSlice';
import { useTheme, Spacing, Typography, Radii, Shadows, Layout } from '../../utils/theme';
import AppButton from '../../components/AppButton';
import PriorityBadge from '../../components/PriorityBadge';

/**
 * TASK DETAIL SCREEN
 * Displays full task information with actions:
 * mark complete, edit, delete (with confirmation).
 * Now fully theme-aware for dark mode.
 */
export default function TaskDetailScreen({ route, navigation }: any) {
    const { taskId } = route.params;
    const dispatch = useAppDispatch();
    const { colors } = useTheme();

    const { tasks, loading, error } = useAppSelector((state) => state.tasks);
    const task = tasks.find((t) => t.id === taskId);

    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    // If task was deleted or not found, go back
    if (!task) {
        return (
            <View style={[styles.container, { backgroundColor: colors.background }]}>
                <View style={styles.notFound}>
                    <Text style={[styles.notFoundText, { color: colors.textSecondary }]}>Task not found</Text>
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
        dispatch(toggleComplete({ taskId: task.id, completed: !task.completed }) as any);
    };

    const handleEdit = () => {
        navigation.navigate('EditTask', { taskId: task.id });
    };

    const handleDelete = () => {
        if (Platform.OS === 'web') {
            setShowDeleteConfirm(true);
        } else {
            Alert.alert(
                'Delete Task',
                `Are you sure you want to delete "${task.title}"? This action cannot be undone.`,
                [
                    { text: 'Cancel', style: 'cancel' },
                    {
                        text: 'Delete',
                        style: 'destructive',
                        onPress: () => {
                            dispatch(deleteTask(task.id) as any);
                            navigation.goBack();
                        },
                    },
                ]
            );
        }
    };

    const confirmDelete = () => {
        dispatch(deleteTask(task.id) as any);
        navigation.goBack();
    };

    return (
        <ScrollView
            style={[styles.container, { backgroundColor: colors.background }]}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
        >
            {/* ── Status Banner ── */}
            <View style={[
                styles.statusBanner,
                {
                    backgroundColor: task.completed ? colors.successBg : isOverdue ? colors.errorBg : colors.warningBg
                }
            ]}>
                <Text style={styles.statusIcon}>
                    {task.completed ? '✓' : isOverdue ? '⚠' : '⏱'}
                </Text>
                <Text style={[styles.statusText, { color: task.completed ? colors.success : isOverdue ? colors.error : colors.warning }]}>
                    {formatRelativeDeadline(task.deadline)}
                </Text>
            </View>

            {/* ERROR MESSAGE (For debugging API issues) */}
            {error ? (
                <View style={{ backgroundColor: colors.errorBg, padding: Spacing.md, borderRadius: Radii.md, marginBottom: Spacing.lg }}>
                    <Text style={{ color: colors.error, fontWeight: 'bold' }}>
                        API ERROR: {error}
                    </Text>
                </View>
            ) : null}

            {/* ── Title & Priority ── */}
            <View style={styles.titleSection}>
                <View style={{ flex: 1 }}>
                    <Text style={[
                        styles.title,
                        { color: task.completed ? colors.textTertiary : colors.textPrimary },
                        task.completed && styles.titleCompleted,
                    ]}>
                        {task.title}
                    </Text>
                    <View style={styles.priorityWrapper}>
                        <PriorityBadge priority={task.priority} />
                    </View>
                </View>
                <IconButton
                    icon="pencil"
                    iconColor={colors.primary}
                    size={24}
                    onPress={handleEdit}
                    style={styles.editButton}
                />
            </View>

            {/* ── Description ── */}
            {task.description ? (
                <View style={styles.section}>
                    <Text style={[styles.sectionLabel, { color: colors.textTertiary }]}>Description</Text>
                    <Text style={[styles.descriptionText, { color: colors.textSecondary }]}>{task.description}</Text>
                </View>
            ) : null}

            {/* ── Details Grid ── */}
            <View style={[
                styles.detailsCard,
                { backgroundColor: colors.surface, borderColor: colors.borderLight }
            ]}>
                <DetailRow
                    icon="📅"
                    label="Deadline"
                    value={formatFullDate(task.deadline)}
                    highlight={isOverdue}
                    colors={colors}
                />
                <View style={[styles.detailDivider, { backgroundColor: colors.borderLight }]} />

                {task.category ? (
                    <>
                        <DetailRow
                            icon="🏷️"
                            label="Category"
                            value={task.category}
                            colors={colors}
                        />
                        <View style={[styles.detailDivider, { backgroundColor: colors.borderLight }]} />
                    </>
                ) : null}

                <DetailRow
                    icon="📋"
                    label="Status"
                    value={task.completed ? 'Completed' : 'Pending'}
                    colors={colors}
                />
                <View style={[styles.detailDivider, { backgroundColor: colors.borderLight }]} />

                <DetailRow
                    icon="🕐"
                    label="Created"
                    value={formatFullDate(task.createdAt)}
                    colors={colors}
                />

                {task.updatedAt !== task.createdAt && (
                    <>
                        <View style={[styles.detailDivider, { backgroundColor: colors.borderLight }]} />
                        <DetailRow
                            icon="✏️"
                            label="Last Updated"
                            value={formatFullDate(task.updatedAt)}
                            colors={colors}
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
                />

                <AppButton
                    title="Delete Task"
                    onPress={handleDelete}
                    variant="ghost"
                    textStyle={{ color: colors.error }}
                />
            </View>

            {/* ── Delete Confirmation (Web fallback) ── */}
            {showDeleteConfirm && (
                <View style={[styles.confirmOverlay, { backgroundColor: colors.overlay }]}>
                    <View style={[styles.confirmCard, { backgroundColor: colors.surface }]}>
                        <Text style={[styles.confirmTitle, { color: colors.textPrimary }]}>Delete Task?</Text>
                        <Text style={[styles.confirmMessage, { color: colors.textSecondary }]}>
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
    colors
}: {
    icon: string;
    label: string;
    value: string;
    highlight?: boolean;
    colors: any;
}) {
    return (
        <View style={detailStyles.row}>
            <Text style={detailStyles.icon}>{icon}</Text>
            <View style={detailStyles.content}>
                <Text style={[detailStyles.label, { color: colors.textTertiary }]}>{label}</Text>
                <Text style={[
                    detailStyles.value,
                    { color: highlight ? colors.error : colors.textPrimary },
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
        marginBottom: 2,
    },
    value: {
        ...Typography.body,
    },
    valueHighlight: {
        fontWeight: '600',
    },
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
    statusIcon: {
        fontSize: 16,
    },
    statusText: {
        ...Typography.captionMedium,
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
        marginBottom: Spacing.xs,
    },
    titleCompleted: {
        textDecorationLine: 'line-through',
    },
    priorityWrapper: {
        alignSelf: 'flex-start',
    },
    editButton: {
        margin: 0,
        backgroundColor: 'rgba(0,0,0,0.05)', // Subtle background for the button
    },

    // ── Description Section ──
    section: {
        marginBottom: Spacing.xl,
    },
    sectionLabel: {
        ...Typography.small,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: Spacing.sm,
    },
    descriptionText: {
        ...Typography.body,
        lineHeight: 24,
    },

    // ── Details Card ──
    detailsCard: {
        borderRadius: Radii.lg,
        padding: Spacing.lg,
        marginBottom: Spacing.xxl,
        borderWidth: 1,
    },
    detailDivider: {
        height: 1,
    },

    // ── Actions ──
    actions: {
        gap: Spacing.md,
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
    },

    // ── Delete Confirmation (Web) ──
    confirmOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        padding: Spacing.xxl,
    },
    confirmCard: {
        borderRadius: Radii.lg,
        padding: Spacing.xxl,
        maxWidth: 360,
        width: '100%',
        ...Shadows.lg,
    },
    confirmTitle: {
        ...Typography.h3,
        marginBottom: Spacing.sm,
    },
    confirmMessage: {
        ...Typography.body,
        marginBottom: Spacing.xl,
        lineHeight: 22,
    },
    confirmActions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: Spacing.md,
    },
});
