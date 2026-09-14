import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from '../utils/theme';
import TopNavbar from '../components/TopNavbar';

// Screens
import HomeScreen from '../screens/HomeScreen';
import TaskListScreen from '../screens/tasks/TaskListScreen';
import AddTaskScreen from '../screens/tasks/AddTaskScreen';
import EditTaskScreen from '../screens/tasks/EditTaskScreen';
import TaskDetailScreen from '../screens/tasks/TaskDetailScreen';

const Stack = createNativeStackNavigator();

/**
 * APP NAVIGATOR
 * Modern stack navigator using custom TopNavbar instead of bottom tabs.
 */
export default function AppNavigator() {
    const { colors } = useTheme();

    return (
        <Stack.Navigator
            screenOptions={{
                // Custom header replacing the bottom tabs
                header: ({ navigation, route, options, back }) => {
                    // For detail screens, we show a back button
                    const showBack = route.name !== 'Tasks';

                    return (
                        <TopNavbar
                            title={options.title || 'Taskly'}
                            showBack={showBack}
                            onBack={showBack ? () => navigation.goBack() : undefined}
                        />
                    );
                },
                contentStyle: { backgroundColor: colors.background },
            }}
            initialRouteName="Tasks"
        >
            {/* The main dashboard/task list is now the root screen */}
            <Stack.Screen
                name="Tasks"
                component={TaskListScreen}
                options={{ title: 'My Tasks' }}
            />

            {/* Keeping HomeScreen accessible if needed, though Tasks is usually primary */}
            <Stack.Screen
                name="Home"
                component={HomeScreen}
                options={{ title: 'Dashboard' }}
            />

            <Stack.Screen
                name="AddTask"
                component={AddTaskScreen}
                options={{ title: 'New Task' }}
            />

            <Stack.Screen
                name="TaskDetail"
                component={TaskDetailScreen}
                options={{ title: 'Task Details' }}
            />

            <Stack.Screen
                name="EditTask"
                component={EditTaskScreen}
                options={{ title: 'Edit Task' }}
            />
        </Stack.Navigator>
    );
}
