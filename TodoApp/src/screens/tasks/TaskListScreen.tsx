import React, { useEffect, useState } from 'react';
import {
    View,
    StyleSheet,
    FlatList,
    RefreshControl,
    TouchableOpacity,
} from 'react-native';
import { Text, FAB, Chip, Button } from 'react-native-paper';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { fetchTasks, updateTask, deleteTask, setFilter } from '../../redux/slices/taskSlice';
import { logoutUser } from '../../services/firebaseAuth';
import { clearAuth } from '../../redux/slices/authSlice';

/**
 * TASK LIST SCREEN
 * Shows all user's tasks with options to add, edit, delete
 */
export default function TaskListScreen({ navigation }: any) {
    const dispatch = useAppDispatch();
    const { tasks, loading, filter, error } = useAppSelector((state) => state.tasks);
    const [refreshing, setRefreshing] = useState(false);

    // Fetch tasks when screen loads
    useEffect(() => {
        dispatch(fetchTasks() as any);
    }, [dispatch]);

    // Handle refresh
    const onRefresh = async () => {
        setRefreshing(true);
        await dispatch(fetchTasks() as any);
        setRefreshing(false);
    };

    // Handle logout
    const handleLogout = async () => {
        await logoutUser();
        dispatch(clearAuth());
    };

    // Handle mark complete
    const handleToggleComplete = (taskId: string, currentStatus: boolean) => {
        dispatch(
            updateTask({
                taskId,
                updates: { completed: !currentStatus },
            }) as any
        );
    };

    // Handle delete
    const handleDelete = (taskId: string) => {
        dispatch(deleteTask(taskId) as any);
    };

    // Filter tasks based on current filter
    const filteredTasks = tasks.filter((task) => {
        if (filter === 'completed') return task.completed;
        if (filter === 'pending') return !task.completed;
        return true;
    });

    // Render empty state
    if (!loading && filteredTasks.length === 0) {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.title}>Your Tasks</Text>
                    <Button mode="text" onPress={handleLogout}>
                        Logout
                    </Button>
                </View>

                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyTitle}>No tasks yet!</Text>
                    <Text style={styles.emptySubtitle}>
                        Tap the + button to create your first task
                    </Text>
                </View>

                <FAB
                    icon="plus"
                    onPress={() => navigation.navigate('AddTask')}
                    style={styles.fab}
                />
            </View>
        );
    }

    // Render task list
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Your Tasks</Text>
                <Button mode="text" onPress={handleLogout} textColor="#ff6b6b">
                    Logout
                </Button>
            </View>

            {/* FILTER CHIPS */}
            <View style={styles.filterContainer}>
                <Chip
                    selected={filter === 'all'}
                    onPress={() => dispatch(setFilter('all'))}
                    style={styles.chip}
                >
                    All
                </Chip>
                <Chip
                    selected={filter === 'pending'}
                    onPress={() => dispatch(setFilter('pending'))}
                    style={styles.chip}
                >
                    Pending
                </Chip>
                <Chip
                    selected={filter === 'completed'}
                    onPress={() => dispatch(setFilter('completed'))}
                    style={styles.chip}
                >
                    Done
                </Chip>
            </View>

            {/* ERROR MESSAGE */}
            {error && (
                <View style={styles.errorBox}>
                    <Text style={styles.errorText}>{error}</Text>
                </View>
            )}

            {/* TASK LIST */}
            <FlatList
                data={filteredTasks}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={[
                            styles.taskCard,
                            item.completed && styles.taskCardCompleted,
                        ]}
                        onPress={() =>
                            navigation.navigate('EditTask', { taskId: item.id })
                        }
                    >
                        <View style={styles.taskHeader}>
                            <Text
                                style={[
                                    styles.taskTitle,
                                    item.completed && styles.taskTitleCompleted,
                                ]}
                            >
                                {item.title}
                            </Text>
                            <Chip
                                style={[
                                    styles.priorityChip,
                                    item.priority === 'high' && styles.priorityHigh,
                                    item.priority === 'medium' && styles.priorityMedium,
                                    item.priority === 'low' && styles.priorityLow,
                                ]}
                            >
                                {item.priority}
                            </Chip>
                        </View>

                        {item.description && (
                            <Text style={styles.taskDescription}>{item.description}</Text>
                        )}

                        <Text style={styles.taskDeadline}>
                            Due: {new Date(item.deadline).toLocaleDateString()}
                        </Text>

                        <View style={styles.taskActions}>
                            <Button
                                mode="text"
                                onPress={() => handleToggleComplete(item.id, item.completed)}
                                compact={true}
                            >
                                {item.completed ? 'Undo' : 'Complete'}
                            </Button>
                            <Button
                                mode="text"
                                textColor="#ff6b6b"
                                onPress={() => handleDelete(item.id)}
                                compact={true}
                            >
                                Delete
                            </Button>
                        </View>
                    </TouchableOpacity>
                )}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
                scrollEnabled={true}
            />

            {/* ADD TASK BUTTON */}
            <FAB
                icon="plus"
                onPress={() => navigation.navigate('AddTask')}
                style={styles.fab}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 8,
        backgroundColor: '#ffffff',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    filterContainer: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#ffffff',
    },
    chip: {
        marginRight: 8,
    },
    taskCard: {
        backgroundColor: '#ffffff',
        marginHorizontal: 16,
        marginVertical: 8,
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    taskCardCompleted: {
        backgroundColor: '#f0f0f0',
        opacity: 0.6,
    },
    taskHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    taskTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        flex: 1,
    },
    taskTitleCompleted: {
        textDecorationLine: 'line-through',
        color: '#999',
    },
    taskDescription: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
    },
    taskDeadline: {
        fontSize: 12,
        color: '#999',
        marginBottom: 8,
    },
    priorityChip: {
        marginLeft: 8,
    },
    priorityHigh: {
        backgroundColor: '#ffcdd2',
    },
    priorityMedium: {
        backgroundColor: '#fff3cd',
    },
    priorityLow: {
        backgroundColor: '#d4edda',
    },
    taskActions: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        marginTop: 8,
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    emptySubtitle: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
    },
    errorBox: {
        backgroundColor: '#ffebee',
        borderColor: '#ef5350',
        borderWidth: 1,
        borderRadius: 8,
        padding: 12,
        marginHorizontal: 16,
        marginVertical: 8,
    },
    errorText: {
        color: '#c62828',
        fontSize: 13,
    },
});