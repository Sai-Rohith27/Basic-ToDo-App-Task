import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { setUser, clearAuth } from '../redux/slices/authSlice';

// Import all screens
import SplashScreen from '../screens/auth/SplashScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import TaskListScreen from '../screens/tasks/TaskListScreen';
import AddTaskScreen from '../screens/tasks/AddTaskScreen';
import EditTaskScreen from '../screens/tasks/EditTaskScreen';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
    const dispatch = useAppDispatch();
    const { user, isAuthenticated } = useAppSelector((state) => state.auth);
    const [initializing, setInitializing] = useState(true);

    useEffect(() => {
        const checkAuthStatus = async () => {
            try {
                const { listenToAuthState } = await import('../services/firebaseAuth');

                const unsubscribe = listenToAuthState((firebaseUser) => {
                    if (firebaseUser) {
                        dispatch(setUser({
                            uid: firebaseUser.uid,
                            email: firebaseUser.email || '',
                        }));
                    } else {
                        dispatch(clearAuth());
                    }
                    setInitializing(false);
                });

                return unsubscribe;
            } catch (error) {
                console.error('Auth check error:', error);
                setInitializing(false);
            }
        };

        checkAuthStatus();
    }, [dispatch]);

    if (initializing) {
        return (
            <NavigationContainer>
                <Stack.Navigator>
                    <Stack.Screen
                        name="Splash"
                        component={SplashScreen}
                        options={{ headerShown: false }}
                    />
                </Stack.Navigator>
            </NavigationContainer>
        );
    }

    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {isAuthenticated ? (
                    <Stack.Group>
                        <Stack.Screen
                            name="TaskList"
                            component={TaskListScreen}
                        />
                        <Stack.Screen
                            name="AddTask"
                            component={AddTaskScreen}
                            options={{
                                headerShown: true,
                                title: 'Add Task',
                            }}
                        />
                        <Stack.Screen
                            name="EditTask"
                            component={EditTaskScreen}
                            options={{
                                headerShown: true,
                                title: 'Edit Task',
                            }}
                        />
                    </Stack.Group>
                ) : (
                    <Stack.Group>
                        <Stack.Screen
                            name="Login"
                            component={LoginScreen}
                        />
                        <Stack.Screen
                            name="Register"
                            component={RegisterScreen}
                        />
                    </Stack.Group>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
}