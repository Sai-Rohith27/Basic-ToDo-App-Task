import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, ActivityIndicator, Animated } from 'react-native';
import { Text } from 'react-native-paper';
import { useTheme, Spacing, Typography } from '../../utils/theme';

/**
 * SPLASH SCREEN
 * Shown while Firebase auth state is being resolved
 */
export default function SplashScreen() {
    const { colors } = useTheme();

    // Animation values
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.8)).current;
    const loaderFadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Start entrance animation
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 600,
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                friction: 8,
                tension: 40,
                useNativeDriver: true,
            }),
        ]).start(() => {
            // Fade in loader after logo appears
            Animated.timing(loaderFadeAnim, {
                toValue: 1,
                duration: 400,
                useNativeDriver: true,
            }).start();
        });
    }, [fadeAnim, scaleAnim, loaderFadeAnim]);

    return (
        <View style={[styles.container, { backgroundColor: colors.primary }]}>
            <Animated.View
                style={[
                    styles.logoContainer,
                    {
                        opacity: fadeAnim,
                        transform: [{ scale: scaleAnim }],
                    },
                ]}
            >
                <Text style={[styles.title, { color: colors.white }]}>Taskly</Text>
            </Animated.View>

            <Animated.View style={[styles.loaderContainer, { opacity: loaderFadeAnim }]}>
                <ActivityIndicator size="large" color={colors.white} style={styles.loader} />
                <Text style={[styles.subtitle, { color: colors.white }]}>Starting up...</Text>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: Spacing.xxxl,
    },
    title: {
        fontSize: 56,
        fontWeight: '900',
        letterSpacing: -1.5,
    },
    loaderContainer: {
        position: 'absolute',
        bottom: 120,
        alignItems: 'center',
    },
    loader: {
        marginBottom: Spacing.lg,
    },
    subtitle: {
        ...Typography.bodyMedium,
        opacity: 0.9,
        fontWeight: '500',
    },
});