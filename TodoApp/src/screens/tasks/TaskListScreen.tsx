import React, { useEffect, useCallback } from 'react';
import {
    View,
    StyleSheet,
    FlatList,
    RefreshControl,
    Text,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { IconButton } from 'react-native-paper';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import {
    fetchTasks,
    toggleComplete,
    setFilter,
    setSortBy,
    TaskFilter,
    TaskSortBy,
} from '../../redux/slices/taskSlice';
import { useTheme, Spacing, Typography, Radii } from '../../theme';
import TaskCard from '../../components/TaskCard';
import FilterChip from '../../components/FilterChip';
import EmptyState from '../../components/EmptyState';
import SkeletonLoader from '../../components/SkeletonLoader';
import FloatingActionButton from '../../components/FloatingActionButton';
import { getProcessedTasks, getTaskStats } from '../../utils/taskSorter';

/**
 * TASK LIST SCREEN
 * Full task list with filters and sorting.
 * Shows all tasks with horizontal filter chips and sort toggle.
 */
export default function TaskListScreen({ navigation }: any) {
    const dispatch = useAppDispatch();
    const { tasks, loading, filter, sortBy } = useAppSelector((state) => state.tasks);
    const { colors } = useTheme();
    const insets = useSafeAreaInsets();

    const [refreshing, setRefreshing] = React.useState(false);

    // Fetch tasks on mount
    useEffect(() => {
        dispatch(fetchTasks() as any);
    }, [dispatch]);

    // Pull-to-refresh
    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await dispatch(fetchTasks() as any);
        setRefreshing(false);
    }, [dispatch]);

    // Process tasks with current filter/sort
    const processedTasks = getProcessedTasks(tasks, filter, sortBy);
    const stats = getTaskStats(tasks);

    // ── Filter config ──
    const filters: { key: TaskFilter; label: string; count: number }[] = [
        { key: 'all', label: 'All', count: stats.total },
        { key: 'pending', label: 'Pending', count: stats.pending },
        { key: 'completed', label: 'Done', count: stats.completed },
        { key: 'overdue', label: 'Overdue', count: stats.overdue },
    ];

    // ── Sort config ──
    const sorts: { key: TaskSortBy; label: string; icon: string }[] = [
        { key: 'deadline', label: 'Deadline', icon: 'clock-outline' },
        { key: 'priority', label: 'Priority', icon: 'flag-outline' },
        { key: 'date', label: 'Newest', icon: 'sort-calendar-descending' },
    ];

    // Handlers
    const handleTaskPress = (taskId: string) => {
        navigation.navigate('TaskDetail', { taskId });
    };

    const handleToggleComplete = (taskId: string, currentCompleted: boolean) => {
        dispatch(toggleComplete({ taskId, completed: !currentCompleted }) as any);
    };

    // Empty state config based on active filter
    const emptyConfig: Record<TaskFilter, { icon: string; title: string; subtitle: string }> = {
        all: {
            icon: 'clipboard-text-outline',
            title: 'No tasks yet',
            subtitle: 'Tap + to create your first task',
        },
        pending: {
            icon: 'check-circle-outline',
            title: 'All caught up!',
            subtitle: 'You have no pending tasks',
        },
        completed: {
            icon: 'trophy-outline',
            title: 'No completed tasks',
            subtitle: 'Start completing tasks to see them here',
        },
        overdue: {
            icon: 'shield-check-outline',
            title: 'No overdue tasks',
            subtitle: 'Great job staying on schedule!',
        },
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <FlatList
                data={processedTasks}
                keyExtractor={(item) => item.id}
                contentContainerStyle={[
                    styles.listContent,
                    { paddingTop: insets.top + Spacing.lg },
                ]}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor={colors.primary}
                        colors={[colors.primary]}
                    />
                }
                ListHeaderComponent={
                    <>
                        {/* ── Screen Title ── */}
                        <View style={styles.headerRow}>
                            <Text style={[styles.title, { color: colors.textPrimary }]}>
                                My Tasks
                            </Text>
                            <Text style={[styles.countBadge, { color: colors.textSecondary }]}>
                                {processedTasks.length} task{processedTasks.length !== 1 ? 's' : ''}
                            </Text>
                        </View>

                        {/* ── Filter Chips ── */}
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.chipRow}
                        >
                            {filters.map((f) => (
                                <FilterChip
                                    key={f.key}
                                    label={f.label}
                                    selected={filter === f.key}
                                    onPress={() => dispatch(setFilter(f.key))}
                                    count={f.count}
                                />
                            ))}
                        </ScrollView>

                        {/* ── Sort Toggles ── */}
                        <View style={styles.sortRow}>
                            <Text style={[styles.sortLabel, { color: colors.textTertiary }]}>
                                Sort by:
                            </Text>
                            {sorts.map((s) => (
                                <TouchableOpacity
                                    key={s.key}
                                    onPress={() => dispatch(setSortBy(s.key))}
                                    activeOpacity={0.7}
                                    style={[
                                        styles.sortChip,
                                        {
                                            backgroundColor:
                                                sortBy === s.key
                                                    ? colors.primaryBg
                                                    : 'transparent',
                                        },
                                    ]}
                                >
                                    <IconButton
                                        icon={s.icon}
                                        size={14}
                                        iconColor={
                                            sortBy === s.key
                                                ? colors.primary
                                                : colors.textTertiary
                                        }
                                        style={{ margin: 0, padding: 0 }}
                                    />
                                    <Text
                                        style={[
                                            styles.sortText,
                                            {
                                                color:
                                                    sortBy === s.key
                                                        ? colors.primary
                                                        : colors.textTertiary,
                                            },
                                        ]}
                                    >
                                        {s.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        {/* Skeleton loader */}
                        {loading && tasks.length === 0 && <SkeletonLoader count={5} />}
                    </>
                }
                renderItem={({ item }) => (
                    <TaskCard
                        task={item}
                        onPress={() => handleTaskPress(item.id)}
                        onToggleComplete={() => handleToggleComplete(item.id, item.completed)}
                    />
                )}
                ListEmptyComponent={
                    !loading ? (
                        <EmptyState
                            icon={emptyConfig[filter].icon}
                            title={emptyConfig[filter].title}
                            subtitle={emptyConfig[filter].subtitle}
                            actionLabel={filter === 'all' ? 'Add Task' : undefined}
                            onAction={
                                filter === 'all'
                                    ? () => navigation.navigate('AddTask')
                                    : undefined
                            }
                        />
                    ) : null
                }
                showsVerticalScrollIndicator={false}
            />

            <FloatingActionButton 
                onPress={() => navigation.navigate('AddTask')}
                icon="plus" 
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    listContent: {
        paddingHorizontal: Spacing.xl,
        paddingBottom: Spacing.huge + 60,
    },

    // ── Header ──
    headerRow: {
        flexDirection: 'row',
        alignItems: 'baseline',
        justifyContent: 'space-between',
        marginBottom: Spacing.lg,
    },
    title: {
        ...Typography.h1,
    },
    countBadge: {
        ...Typography.caption,
    },

    // ── Filter Chips ──
    chipRow: {
        gap: Spacing.sm,
        paddingBottom: Spacing.md,
    },

    // ── Sort Row ──
    sortRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: Spacing.lg,
        gap: Spacing.sm,
    },
    sortLabel: {
        ...Typography.small,
        marginRight: Spacing.xs,
    },
    sortChip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: Radii.full,
        gap: 2,
    },
    sortText: {
        ...Typography.small,
    },
});