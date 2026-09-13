import React from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { Text } from 'react-native-paper';
import { Colors, Typography, Spacing } from '../../theme';

/**
 * SPLASH SCREEN
 * Shows while app is loading/checking auth status.
 * Branded to match the login/register screens.
 */
export default function SplashScreen() {
    return (
        <View style={styles.container}>
            {/* App Logo */}
            <View style={styles.logoContainer}>
                <Text style={styles.logoIcon}>✓</Text>
            </View>

            <Text style={styles.appName}>Taskly</Text>
            <Text style={styles.tagline}>Organize your day, own your goals.</Text>

            <ActivityIndicator
                size="large"
                color={Colors.primary}
                style={styles.loader}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.background,
    },
    logoContainer: {
        width: 80,
        height: 80,
        borderRadius: 22,
        backgroundColor: Colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: Spacing.lg,
    },
    logoIcon: {
        fontSize: 36,
        color: Colors.textInverse,
        fontWeight: '700',
    },
    appName: {
        ...Typography.h1,
        color: Colors.primary,
        marginBottom: Spacing.xs,
    },
    tagline: {
        ...Typography.caption,
        color: Colors.textSecondary,
    },
    loader: {
        marginTop: Spacing.xxxl,
    },
});