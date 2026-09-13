import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { useAppDispatch } from '../../redux/hooks';
import { clearAuth } from '../../redux/slices/authSlice';
import { logoutUser } from '../../services/firebaseAuth';

/**
 * TASK LIST SCREEN
 * Shows user's tasks
 * (We'll build this properly in Phase 4)
 */
export default function TaskListScreen() {
    const dispatch = useAppDispatch();

    /**
     * HANDLE LOGOUT
     * Logs out user and returns to login screen
     */
    const handleLogout = async () => {
        await logoutUser();
        dispatch(clearAuth());
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Your Tasks</Text>
            <Text style={styles.subtitle}>
                Tasks will appear here (Phase 4)
            </Text>

            <Button
                mode="contained"
                onPress={handleLogout}
                style={styles.logoutButton}
                color="#ff6b6b"
            >
                Logout
            </Button>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
    },
    subtitle: {
        fontSize: 14,
        color: '#666',
        marginBottom: 30,
        textAlign: 'center',
    },
    logoutButton: {
        paddingHorizontal: 20,
    },
});