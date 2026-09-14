import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { Text } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { createTask } from '../../redux/slices/taskSlice';
import { useTheme, Spacing, Typography, Radii, Layout } from '../../utils/theme';
import AppInput from '../../components/AppInput';
import AppButton from '../../components/AppButton';
import PrioritySelector from '../../components/PrioritySelector';

/**
 * ADD TASK SCREEN
 * User creates new task. Redesigned with design tokens and custom components.
 */
export default function AddTaskScreen({ navigation }: any) {
    const { colors } = useTheme();
    const insets = useSafeAreaInsets();

    // Form state
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [deadline, setDeadline] = useState(new Date(Date.now() + 86400000)); // Default to tomorrow
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
    const [category, setCategory] = useState('');
    const [error, setError] = useState('');

    const dispatch = useAppDispatch();
    const { loading } = useAppSelector((state) => state.tasks);

    // Handle date change
    const handleDateChange = (event: any, selectedDate?: Date) => {
        setShowDatePicker(false);
        if (selectedDate) {
            setDeadline(selectedDate);
        }
    };

    // Handle create task
    const handleCreateTask = async () => {
        // Validate
        if (!title.trim()) {
            setError('Task title is required');
            return;
        }

        if (deadline < new Date()) {
            setError('Deadline cannot be in the past');
            return;
        }

        setError('');

        // Create task
        const result = await dispatch(
            createTask({
                title: title.trim(),
                description: description.trim(),
                deadline: deadline.toISOString(),
                priority,
                category: category.trim() || undefined,
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
            style={[styles.container, { backgroundColor: colors.background }]}
        >
            <ScrollView
                contentContainerStyle={[
                    styles.scrollContent,
                    { paddingTop: insets.top + Spacing.lg }
                ]}
                keyboardShouldPersistTaps="handled"
            >
                <View style={styles.header}>
                    <Text style={[styles.title, { color: colors.textPrimary }]}>
                        Add New Task
                    </Text>
                    <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                        What do you need to get done?
                    </Text>
                </View>

                {/* ERROR MESSAGE */}
                {error ? (
                    <View style={[styles.errorBox, { backgroundColor: colors.errorBg, borderColor: colors.error }]}>
                        <Text style={styles.errorIcon}>⚠</Text>
                        <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
                    </View>
                ) : null}

                {/* FORM */}
                <View style={[styles.formCard, { backgroundColor: colors.surface, borderColor: colors.borderLight }]}>

                    <AppInput
                        label="Task Title"
                        value={title}
                        onChangeText={(t) => { setTitle(t); setError(''); }}
                        placeholder="e.g., Prepare Q3 Presentation"
                        disabled={loading}
                    />

                    <AppInput
                        label="Description (optional)"
                        value={description}
                        onChangeText={setDescription}
                        placeholder="Add details, links, or notes..."
                        multiline
                        numberOfLines={3}
                        disabled={loading}
                    />

                    {/* DEADLINE PICKER */}
                    <Text style={[styles.label, { color: colors.textSecondary }]}>Deadline</Text>
                    <AppButton
                        title={`${deadline.toLocaleDateString()} ${deadline.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
                        onPress={() => setShowDatePicker(true)}
                        variant="secondary"
                        icon={<Text style={{ fontSize: 16 }}>📅</Text>}
                        disabled={loading}
                        style={styles.dateButton}
                    />

                    {Platform.OS !== 'web' && showDatePicker && (
                        <DateTimePicker
                            value={deadline}
                            mode="datetime"
                            display="default"
                            minimumDate={new Date()}
                            onChange={handleDateChange}
                        />
                    )}
                    {Platform.OS === 'web' && showDatePicker && (
                        <View style={{ marginBottom: Spacing.xl }}>
                            {React.createElement('input', {
                                type: 'datetime-local',
                                value: new Date(deadline.getTime() - deadline.getTimezoneOffset() * 60000).toISOString().slice(0, 16),
                                onChange: (e: any) => {
                                    const newDate = new Date(e.target.value);
                                    if (!isNaN(newDate.getTime())) {
                                        setDeadline(newDate);
                                        setShowDatePicker(false);
                                    }
                                },
                                style: {
                                    padding: 12,
                                    borderRadius: 8,
                                    border: `1px solid ${colors.border}`,
                                    fontSize: 16,
                                    width: '100%',
                                    fontFamily: 'inherit',
                                    color: colors.textPrimary,
                                    backgroundColor: colors.surface,
                                },
                            })}
                        </View>
                    )}

                    {/* PRIORITY SELECTOR */}
                    <View style={styles.fieldSpacing}>
                        <Text style={[styles.label, { color: colors.textSecondary }]}>Priority</Text>
                        <PrioritySelector
                            value={priority}
                            onChange={setPriority}
                            disabled={loading}
                        />
                    </View>

                    {/* CATEGORY INPUT */}
                    <View style={styles.fieldSpacing}>
                        <AppInput
                            label="Category (optional)"
                            value={category}
                            onChangeText={setCategory}
                            placeholder="e.g., Work, Personal, Shopping"
                            leftIcon="tag-outline"
                            disabled={loading}
                        />
                    </View>

                </View>

                {/* ACTIONS */}
                <View style={styles.actions}>
                    <AppButton
                        title={loading ? 'Creating...' : 'Create Task'}
                        onPress={handleCreateTask}
                        loading={loading}
                        disabled={loading}
                    />

                    <AppButton
                        title="Cancel"
                        onPress={() => navigation.goBack()}
                        variant="ghost"
                        disabled={loading}
                        style={{ marginTop: Spacing.sm }}
                    />
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: Layout.screenPaddingH,
        paddingBottom: Spacing.huge,
    },
    header: {
        marginBottom: Spacing.xl,
    },
    title: {
        ...Typography.h1,
        marginBottom: Spacing.xs,
    },
    subtitle: {
        ...Typography.body,
    },
    formCard: {
        borderRadius: Radii.lg,
        padding: Spacing.xl,
        borderWidth: 1,
        marginBottom: Spacing.xl,
    },
    label: {
        ...Typography.small,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: Spacing.sm,
    },
    dateButton: {
        marginBottom: Spacing.xl,
        justifyContent: 'flex-start',
    },
    fieldSpacing: {
        marginTop: Spacing.md,
    },
    errorBox: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: Radii.md,
        padding: Spacing.md,
        marginBottom: Spacing.lg,
        gap: Spacing.sm,
    },
    errorIcon: {
        fontSize: 16,
    },
    errorText: {
        ...Typography.caption,
        flex: 1,
    },
    actions: {
        marginTop: Spacing.md,
    },
});