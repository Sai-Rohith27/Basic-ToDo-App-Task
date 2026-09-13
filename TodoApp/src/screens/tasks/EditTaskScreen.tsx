import React, { useEffect, useState } from 'react';
import {
    View,
    StyleSheet,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { TextInput, Button, Text, SegmentedButtons } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { updateTask } from '../../redux/slices/taskSlice';

/**
 * EDIT TASK SCREEN
 * User edits existing task
 */
export default function EditTaskScreen({ route, navigation }: any) {
    const { taskId } = route.params;
    const dispatch = useAppDispatch();

    // Get task from Redux
    const { tasks, loading } = useAppSelector((state) => state.tasks);
    const task = tasks.find((t) => t.id === taskId);

    // Form state
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [deadline, setDeadline] = useState(new Date());
    const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
    const [category, setCategory] = useState('');
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [error, setError] = useState('');

    // Load task data when screen loads
    useEffect(() => {
        if (task) {
            setTitle(task.title);
            setDescription(task.description || '');
            setDeadline(new Date(task.deadline));
            setPriority(task.priority);
            setCategory(task.category || '');
        }
    }, [task]);

    const handleDateChange = (event: any, selectedDate?: Date) => {
        if (selectedDate) {
            setDeadline(selectedDate);
        }
        setShowDatePicker(false);
    };

    const handleUpdateTask = async () => {
        if (!title.trim()) {
            setError('Title is required');
            return;
        }

        try {
            const result = await dispatch(
                updateTask({
                    taskId,
                    updates: {
                        title,
                        description,
                        deadline: deadline.toISOString(),
                        priority,
                        category: category || undefined,
                    },
                })
            ).unwrap();

            navigation.goBack();
        } catch (err) {
            setError('Failed to update task');
        }
    };

    if (!task) {
        return (
            <View style={styles.container}>
                <Text>Task not found</Text>
            </View>
        );
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <Text style={styles.title}>Edit Task</Text>
                </View>

                {error ? (
                    <View style={styles.errorBox}>
                        <Text style={styles.errorText}>{error}</Text>
                    </View>
                ) : null}

                <TextInput
                    label="Task Title"
                    value={title}
                    onChangeText={setTitle}
                    mode="outlined"
                    style={styles.input}
                    disabled={loading}
                />

                <TextInput
                    label="Description"
                    value={description}
                    onChangeText={setDescription}
                    mode="outlined"
                    multiline
                    numberOfLines={3}
                    style={styles.input}
                    disabled={loading}
                />

                <Button
                    mode="outlined"
                    onPress={() => setShowDatePicker(true)}
                    disabled={loading}
                    style={styles.dateButton}
                >
                    Deadline: {deadline.toLocaleDateString()} {deadline.toLocaleTimeString()}
                </Button>

                {showDatePicker && (
                    <DateTimePicker
                        value={deadline}
                        mode="datetime"
                        display="default"
                        onChange={handleDateChange}
                    />
                )}

                <Text style={styles.label}>Priority</Text>
                <SegmentedButtons
                    value={priority}
                    onValueChange={(value) => setPriority(value as 'low' | 'medium' | 'high')}
                    buttons={[
                        { value: 'low', label: 'Low', disabled: loading },
                        { value: 'medium', label: 'Medium', disabled: loading },
                        { value: 'high', label: 'High', disabled: loading },
                    ]}
                    style={styles.segmented}
                />

                <TextInput
                    label="Category"
                    value={category}
                    onChangeText={setCategory}
                    mode="outlined"
                    style={styles.input}
                    disabled={loading}
                />

                <Button
                    mode="contained"
                    onPress={handleUpdateTask}
                    loading={loading}
                    disabled={loading}
                    style={styles.button}
                >
                    {loading ? 'Updating...' : 'Update Task'}
                </Button>

                <Button
                    mode="outlined"
                    onPress={() => navigation.goBack()}
                    disabled={loading}
                    style={styles.cancelButton}
                >
                    Cancel
                </Button>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    scrollContent: {
        padding: 20,
    },
    header: {
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    input: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        color: '#333',
        marginBottom: 8,
    },
    dateButton: {
        marginBottom: 16,
        padding: 10,
    },
    segmented: {
        marginBottom: 16,
    },
    button: {
        marginTop: 10,
        marginBottom: 10,
        paddingVertical: 8,
    },
    cancelButton: {
        marginBottom: 20,
    },
    errorBox: {
        backgroundColor: '#ffebee',
        borderColor: '#ef5350',
        borderWidth: 1,
        borderRadius: 8,
        padding: 12,
        marginBottom: 16,
    },
    errorText: {
        color: '#c62828',
        fontSize: 13,
    },
});
