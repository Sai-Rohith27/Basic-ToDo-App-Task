import React, { useState } from 'react';
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
import { createTask } from '../../redux/slices/taskSlice';

/**
 * ADD TASK SCREEN
 * User creates new task
 */
export default function AddTaskScreen({ navigation }: any) {
    // Form state
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [deadline, setDeadline] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
    const [category, setCategory] = useState('');
    const [error, setError] = useState('');

    const dispatch = useAppDispatch();
    const { loading, error: reduxError } = useAppSelector((state) => state.tasks);

    // Handle date change
    const handleDateChange = (event: any, selectedDate?: Date) => {
        if (selectedDate) {
            setDeadline(selectedDate);
        }
        setShowDatePicker(false);
    };

    // Handle create task
    const handleCreateTask = async () => {
        // Validate
        if (!title.trim()) {
            setError('Title is required');
            return;
        }

        if (deadline < new Date()) {
            setError('Deadline cannot be in the past');
            return;
        }

        // Create task
        const result = await dispatch(
            createTask({
                title,
                description,
                deadline: deadline.toISOString(),
                priority,
                category: category || undefined,
            })
        );

        if (result.meta.requestStatus === 'fulfilled') {
            // Success - go back
            navigation.goBack();
        } else {
            setError('Failed to create task');
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <Text style={styles.title}>Add New Task</Text>
                </View>

                {/* ERROR MESSAGE */}
                {error && (
                    <View style={styles.errorBox}>
                        <Text style={styles.errorText}>{error}</Text>
                    </View>
                )}

                {/* TITLE INPUT */}
                <TextInput
                    label="Task Title"
                    value={title}
                    onChangeText={setTitle}
                    mode="outlined"
                    style={styles.input}
                    disabled={loading}
                />

                {/* DESCRIPTION INPUT */}
                <TextInput
                    label="Description (optional)"
                    value={description}
                    onChangeText={setDescription}
                    mode="outlined"
                    multiline
                    numberOfLines={3}
                    style={styles.input}
                    disabled={loading}
                />

                {/* DEADLINE PICKER */}
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

                {/* PRIORITY SELECTOR */}
                <Text style={styles.label}>Priority</Text>
                <SegmentedButtons
                    value={priority}
                    onValueChange={(value) => setPriority(value as any)}
                    buttons={[
                        { value: 'low', label: 'Low' },
                        { value: 'medium', label: 'Medium' },
                        { value: 'high', label: 'High' },
                    ]}
                    style={styles.segmented}
                    disabled={loading}
                />

                {/* CATEGORY INPUT */}
                <TextInput
                    label="Category (optional)"
                    value={category}
                    onChangeText={setCategory}
                    mode="outlined"
                    style={styles.input}
                    disabled={loading}
                />

                {/* CREATE BUTTON */}
                <Button
                    mode="contained"
                    onPress={handleCreateTask}
                    loading={loading}
                    disabled={loading}
                    style={styles.button}
                    contentStyle={styles.buttonContent}
                >
                    {loading ? 'Creating...' : 'Create Task'}
                </Button>

                {/* CANCEL BUTTON */}
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
    buttonContent: {
        paddingVertical: 8,
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