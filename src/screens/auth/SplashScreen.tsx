import React from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { Text } from 'react-native-paper';

/**
 * SPLASH SCREEN
 * Shows while app is loading/checking auth status
 */
export default function SplashScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Modulus Todo App</Text>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text style={styles.loading}>Loading...</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
    },
    loading: {
        fontSize: 14,
        marginTop: 10,
        color: '#666',
    },
});