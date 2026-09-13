import React, { useEffect, useCallback } from 'react';
import {
    View,
    StyleSheet,
    FlatList,
    RefreshControl,
    Text,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { fetchTasks, toggleComplete } from '../redux/slices/taskSlice';
import { useTheme, Spacing, Typography, Radii, Shadows } from '../theme';
import TaskCard from '../components/TaskCard';
import EmptyState from '../components/EmptyState';
import SkeletonLoader from '../components/SkeletonLoader';
import ProgressRing from '../components/ProgressRing';
import { getTaskStats, getProcessedTasks } from '../utils/taskSorter';

/**
 * HOME SCREEN
 * Dashboard view showing greeting, stats summary, and today's tasks.
 * First screen the user sees after login — must feel polished.
 */
export default function HomeScreen({ navigation }: any) {
    const dispatch = useAppDispatch();
    const { tasks, loading } = useAppSelector((state) => state.tasks);
    const { user } = useAppSelector((state) => state.auth);
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

    // Stats
    const stats = getTaskStats(tasks);

    // Today's pending tasks, sorted smart
    const todayTasks = getProcessedTasks(tasks, 'pending', 'priority').slice(0, 5);

    // Time-of-day greeting
    const getGreeting = (): string => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good morning';
        if (hour < 17) return 'Good afternoon';
        return 'Good evening';
    };

    // Extract display name from email (before @)
    const displayName = user?.displayName || user?.email?.split('@')[0] || 'there';

    // Format current date
    const dateString = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
    });

    // Handle task card press → navigate to detail
    const handleTaskPress = (taskId: string) => {
        navigation.navigate('TaskDetail', { taskId });
    };

    // Handle checkbox toggle
    const handleToggleComplete = (taskId: string) => {
        dispatch(toggleComplete(taskId) as any);
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <FlatList
                data={todayTasks}
                keyExtractor={(item) => item.id}
                contentContainerStyle={[
                    styles.scrollContent,
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
                        {/* ── Greeting ── */}
                        <View style={styles.greetingSection}>
                            <View style={styles.greetingTextBlock}>
                                <Text style={[styles.greeting, { color: colors.textPrimary }]}>
                                    {getGreeting()},
                                </Text>
                                <Text style={[styles.userName, { color: colors.primary }]}>
                                    {displayName}
                                </Text>
                                <Text style={[styles.date, { color: colors.textTertiary }]}>
                                    {dateString}
                                </Text>
                            </View>
                            {/* Avatar placeholder */}
                            <View style={[styles.avatar, { backgroundColor: colors.primaryBg }]}>
                                <Text style={[styles.avatarText, { color: colors.primary }]}>
                                    {displayName.charAt(0).toUpperCase()}
                                </Text>
                            </View>
                        </View>

                        {/* ── Stats Card ── */}
                        <View style={[
                            styles.statsCard,
                            {
                                backgroundColor: colors.surface,
                                borderColor: colors.borderLight,
                            },
                        ]}>
                            <View style={styles.statsGrid}>
                                <View style={styles.statItem}>
                                    <Text style={[styles.statValue, { color: colors.textPrimary }]}>
                                        {stats.total}
                                    </Text>
                                    <Text style={[styles.statLabel, { color: colors.textTertiary }]}>
                                        Total
                                    </Text>
                                </View>
                                <View style={styles.statItem}>
                                    <Text style={[styles.statValue, { color: colors.success }]}>
                                        {stats.completed}
                                    </Text>
                                    <Text style={[styles.statLabel, { color: colors.textTertiary }]}>
                                        Done
                                    </Text>
                                </View>
                                <View style={styles.statItem}>
                                    <Text style={[styles.statValue, { color: colors.warning }]}>
                                        {stats.pending}
                                    </Text>
                                    <Text style={[styles.statLabel, { color: colors.textTertiary }]}>
                                        Pending
                                    </Text>
                                </View>
                                {stats.overdue > 0 && (
                                    <View style={styles.statItem}>
                                        <Text style={[styles.statValue, { color: colors.error }]}>
                                            {stats.overdue}
                                        </Text>
                                        <Text style={[styles.statLabel, { color: colors.textTertiary }]}>
                                            Overdue
                                        </Text>
                                    </View>
                                )}
                            </View>
                            {stats.total > 0 && (
                                <View style={styles.progressRow}>
                                    <View style={[styles.progressTrack, { backgroundColor: colors.border }]}>
                                        <View
                                            style={[
                                                styles.progressFill,
                                                {
                                                    backgroundColor: colors.primary,
                                                    width: `${stats.progress}%`,
                                                },
                                            ]}
                                        />
                                    </View>
                                    <Text style={[styles.progressText, { color: colors.textSecondary }]}>
                                        {stats.progress}%
                                    </Text>
                                </View>
                            )}
                        </View>

                        {/* ── Section Header ── */}
                        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
                            {todayTasks.length > 0 ? 'Up Next' : 'Tasks'}
                        </Text>

                        {/* Skeleton or empty state */}
                        {loading && tasks.length === 0 && <SkeletonLoader count={3} />}
                    </>
                }
                renderItem={({ item }) => (
                    <View style={styles.taskCardWrapper}>
                        <TaskCard
                            task={item}
                            onPress={() => handleTaskPress(item.id)}
                            onToggleComplete={() => handleToggleComplete(item.id)}
                        />
                    </View>
                )}
                ListEmptyComponent={
                    !loading ? (
                        <EmptyState
                            icon="clipboard-check-outline"
                            title="You're all caught up!"
                            subtitle="Your schedule is clear. Add a task and start making progress."
                            actionLabel="Add Your First Task"
                            onAction={() => navigation.navigate('AddTab')}
                        />
                    ) : null
                }
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: Spacing.xl,
        paddingBottom: Spacing.huge + 60, // account for tab bar
    },

    // ── Greeting ──
    greetingSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: Spacing.xxl,
    },
    greetingTextBlock: {
        flex: 1,
    },
    greeting: {
        ...Typography.h2,
    },
    userName: {
        ...Typography.h1,
        marginBottom: Spacing.xs,
    },
    date: {
        ...Typography.caption,
    },
    avatar: {
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: Spacing.md,
    },
    avatarText: {
        fontSize: 18,
        fontWeight: '700',
    },

    // ── Stats Card ──
    statsCard: {
        borderRadius: Radii.lg,
        padding: Spacing.lg,
        marginBottom: Spacing.xxl,
        borderWidth: 1,
        ...Shadows.sm,
    },
    statsGrid: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: Spacing.md,
    },
    statItem: {
        alignItems: 'center',
    },
    statValue: {
        fontSize: 24,
        fontWeight: '700',
        marginBottom: 2,
    },
    statLabel: {
        ...Typography.small,
    },
    progressRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
    },
    progressTrack: {
        flex: 1,
        height: 4,
        borderRadius: 2,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        borderRadius: 2,
    },
    progressText: {
        ...Typography.small,
        width: 32,
        textAlign: 'right',
    },

    // ── Section ──
    sectionTitle: {
        ...Typography.h3,
        marginBottom: Spacing.md,
    },

    taskCardWrapper: {
        // TaskCard has its own margins
    },
});
