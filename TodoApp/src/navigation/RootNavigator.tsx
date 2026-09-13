import React, { useEffect, useState } from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { setUser, clearAuth } from '../redux/slices/authSlice';
import { useTheme } from '../theme';

// Auth screens
import SplashScreen from '../screens/auth/SplashScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';

// App navigator (bottom tabs + modals)
import AppNavigator from './AppNavigator';

const Stack = createNativeStackNavigator();

/**
 * ROOT NAVIGATOR
 * Top-level navigator that switches between auth flow and app flow.
 * Listens to Firebase auth state and updates Redux accordingly.
 */
export default function RootNavigator() {
    const dispatch = useAppDispatch();
    const { isAuthenticated } = useAppSelector((state) => state.auth);
    const [initializing, setInitializing] = useState(true);
    const { colors, isDark } = useTheme();

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

    // Show splash screen while checking auth state
    if (initializing) {
        return (
            <>
                <StatusBar
                    barStyle={isDark ? 'light-content' : 'dark-content'}
                    backgroundColor={colors.background}
                />
                <NavigationContainer>
                    <Stack.Navigator screenOptions={{ headerShown: false }}>
                        <Stack.Screen name="Splash" component={SplashScreen} />
                    </Stack.Navigator>
                </NavigationContainer>
            </>
        );
    }

    return (
        <>
            <StatusBar
                barStyle={isDark ? 'light-content' : 'dark-content'}
                backgroundColor={colors.background}
            />
            <NavigationContainer>
                <Stack.Navigator screenOptions={{ headerShown: false }}>
                    {isAuthenticated ? (
                        <Stack.Screen name="App" component={AppNavigator} />
                    ) : (
                        <Stack.Group>
                            <Stack.Screen name="Login" component={LoginScreen} />
                            <Stack.Screen name="Register" component={RegisterScreen} />
                        </Stack.Group>
                    )}
                </Stack.Navigator>
            </NavigationContainer>
        </>
    );
}