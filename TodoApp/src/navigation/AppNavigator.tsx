import React from 'react';
import { View, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Text } from 'react-native-paper';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { IconButton } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme, Spacing, Radii, Shadows, Typography } from '../theme';

// Screens
import HomeScreen from '../screens/HomeScreen';
import TaskListScreen from '../screens/tasks/TaskListScreen';
import AddTaskScreen from '../screens/tasks/AddTaskScreen';
import EditTaskScreen from '../screens/tasks/EditTaskScreen';
import TaskDetailScreen from '../screens/tasks/TaskDetailScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

/**
 * TAB ICON
 * Renders a MaterialCommunityIcon with theme-aware coloring.
 */
function TabIcon({ icon, focused, color }: { icon: string; focused: boolean; color: string }) {
    return (
        <IconButton
            icon={icon}
            size={24}
            iconColor={color}
            style={{ margin: 0 }}
        />
    );
}

/**
 * CUSTOM TAB BAR
 * Premium tab bar with elevated center "Add" button.
 */
function CustomTabBar({ state, descriptors, navigation }: any) {
    const { colors } = useTheme();
    const insets = useSafeAreaInsets();

    return (
        <View
            style={[
                styles.tabBar,
                {
                    backgroundColor: colors.tabBarBg,
                    borderTopColor: colors.tabBarBorder,
                    paddingBottom: Math.max(insets.bottom, 8),
                },
            ]}
        >
            {state.routes.map((route: any, index: number) => {
                const { options } = descriptors[route.key];
                const isFocused = state.index === index;
                const isAddButton = route.name === 'AddTab';

                const onPress = () => {
                    const event = navigation.emit({
                        type: 'tabPress',
                        target: route.key,
                        canPreventDefault: true,
                    });

                    if (!isFocused && !event.defaultPrevented) {
                        navigation.navigate(route.name);
                    }
                };

                // Elevated center "Add" button
                if (isAddButton) {
                    return (
                        <TouchableOpacity
                            key={route.key}
                            onPress={onPress}
                            activeOpacity={0.8}
                            accessibilityRole="button"
                            accessibilityLabel="Add new task"
                            style={[
                                styles.addButton,
                                {
                                    backgroundColor: colors.primary,
                                    ...Shadows.md,
                                },
                            ]}
                        >
                            <IconButton
                                icon="plus"
                                size={28}
                                iconColor={colors.textInverse}
                                style={{ margin: 0 }}
                            />
                        </TouchableOpacity>
                    );
                }

                const iconMap: Record<string, string> = {
                    HomeTab: 'home-outline',
                    TasksTab: 'format-list-checks',
                    ProfileTab: 'account-outline',
                };
                const iconMapFocused: Record<string, string> = {
                    HomeTab: 'home',
                    TasksTab: 'format-list-checks',
                    ProfileTab: 'account',
                };

                const labelMap: Record<string, string> = {
                    HomeTab: 'Home',
                    TasksTab: 'Tasks',
                    ProfileTab: 'Profile',
                };

                return (
                    <TouchableOpacity
                        key={route.key}
                        onPress={onPress}
                        activeOpacity={0.7}
                        accessibilityRole="tab"
                        accessibilityState={{ selected: isFocused }}
                        accessibilityLabel={labelMap[route.name]}
                        style={styles.tabItem}
                    >
                        <IconButton
                            icon={isFocused ? (iconMapFocused[route.name] || 'circle') : (iconMap[route.name] || 'circle-outline')}
                            size={22}
                            iconColor={isFocused ? colors.primary : colors.tabInactive}
                            style={{ margin: 0, padding: 0 }}
                        />
                        <Text
                            style={[
                                styles.tabLabel,
                                { color: isFocused ? colors.primary : colors.tabInactive },
                            ]}
                        >
                            {labelMap[route.name]}
                        </Text>
                        {isFocused && (
                            <View style={[styles.activeIndicator, { backgroundColor: colors.primary }]} />
                        )}
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}

/**
 * BOTTOM TAB NAVIGATOR
 * Main app tabs: Home, Tasks, Add (center), Profile
 */
function BottomTabs() {
    return (
        <Tab.Navigator
            tabBar={(props) => <CustomTabBar {...props} />}
            screenOptions={{
                headerShown: false,
            }}
        >
            <Tab.Screen name="HomeTab" component={HomeScreen} />
            <Tab.Screen name="TasksTab" component={TaskListScreen} />
            <Tab.Screen name="AddTab" component={AddTaskScreen} />
            <Tab.Screen name="ProfileTab" component={ProfileScreen} />
        </Tab.Navigator>
    );
}

/**
 * APP NAVIGATOR
 * Stack navigator wrapping bottom tabs + modal screens (TaskDetail, EditTask).
 */
export default function AppNavigator() {
    const { colors } = useTheme();

    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: colors.background },
            }}
        >
            <Stack.Screen name="Main" component={BottomTabs} />
            <Stack.Screen
                name="TaskDetail"
                component={TaskDetailScreen}
                options={{
                    headerShown: true,
                    title: 'Task Details',
                    headerStyle: { backgroundColor: colors.surface },
                    headerTintColor: colors.textPrimary,
                    headerShadowVisible: false,
                }}
            />
            <Stack.Screen
                name="EditTask"
                component={EditTaskScreen}
                options={{
                    headerShown: true,
                    title: 'Edit Task',
                    headerStyle: { backgroundColor: colors.surface },
                    headerTintColor: colors.textPrimary,
                    headerShadowVisible: false,
                }}
            />
        </Stack.Navigator>
    );
}

const styles = StyleSheet.create({
    tabBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        borderTopWidth: 1,
        paddingTop: 4,
    },
    tabItem: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 4,
        position: 'relative',
    },
    tabLabel: {
        fontSize: 11,
        fontWeight: '500',
        marginTop: -4,
    },
    activeIndicator: {
        position: 'absolute',
        top: 0,
        width: 20,
        height: 3,
        borderRadius: 2,
    },
    addButton: {
        width: 52,
        height: 52,
        borderRadius: 26,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: -24,
    },
});
